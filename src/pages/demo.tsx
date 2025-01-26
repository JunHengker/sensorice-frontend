import useSWR from "swr";
import { motion } from "framer-motion";
import { Header } from "./index";
import { Footer } from "./index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";

const colorGenerator = () => {
  const colors = ["bg-yellow-900", "bg-red-950", "bg-green-950"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const baseUrl = import.meta.env.VITE_APP_API_URL ?? "";
export const api = axios.create({
  baseURL: baseUrl,
});

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function DemoField() {
  // Use SWR to fetch data
  const { data, error, isLoading } = useSWR<{
    data: { name: string; id: number; coordinate: string }[];
  }>("/field", fetcher);

  const fields = data?.data || [];

  console.log(fields);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
        <div className="container mx-auto px-4 py-20">
          {/* <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center text-green-800 mb-12"
          >
            Choose Fields
          </motion.h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fields.map(({ name, coordinate, id }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Link to="/panel" state={{ id, coordinate }}>
                  <Card className="cursor-pointer border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                    <CardHeader
                      className={`${colorGenerator()} rounded-t-lg p-4`}
                    >
                      <Sprout className="w-12 h-12 text-white mb-2" />
                      <CardTitle className="text-xl font-semibold text-white">
                        {name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-500 mb-4">
                        coordinate: {coordinate}
                      </p>
                      <div className="w-full h-40 overflow-hidden rounded-lg">
                        <iframe
                          title={`Map of ${name}`}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps/embed/v1/place?key=${
                            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                          }&q=${encodeURIComponent(coordinate)}`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
