import { ReactNode, createContext, useEffect, useState } from "react";
import { ResponseModel, useToastErrorHandler, baseUrl } from "@/hooks/useApi";
import axios, { AxiosError } from "axios";

type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
};

type AuthContext = {
  status: "loading" | "unauthenticated" | "authenticated";
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContext>({
  status: "loading",
  user: null,
  login: async () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<
    "loading" | "unauthenticated" | "authenticated"
  >("loading");

  const errorHandler = useToastErrorHandler();

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post<ResponseModel<User>>(
        baseUrl + "/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      setUser(response.data.data);
      setStatus("authenticated");
    } catch (error: any) {
      errorHandler(error);
    }
  };

  const logout = () => {
    axios
      .delete<ResponseModel>(baseUrl + "/auth/logout", {
        withCredentials: true,
      })
      .then(() => {
        setUser(null);
        setStatus("unauthenticated");
      })
      .catch((err) => errorHandler(err));
  };

  useEffect(() => {
    axios
      .get<ResponseModel<User>>(baseUrl + "/auth/profile", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.data);
        setStatus("authenticated");
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          axios
            .get<ResponseModel>(baseUrl + "/auth/refresh", {
              withCredentials: true,
            })
            .then(() => {
              axios
                .get<ResponseModel<User>>(baseUrl + "/auth/profile", {
                  withCredentials: true,
                })
                .then((res) => {
                  setUser(res.data.data);
                  setStatus("authenticated");
                })
                .catch(() => {
                  setStatus("unauthenticated");
                });
            })
            .catch(() => {
              logout();
              setStatus("unauthenticated");
            });
        } else {
          logout();
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
