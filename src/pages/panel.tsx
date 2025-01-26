import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Header, Footer } from "./index";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sprout,
  Droplet,
  Thermometer,
  Rat,
  Sun,
  CloudSun,
  Cctv,
} from "lucide-react";
import { WeatherPrediction } from "@/components/WeatherPrediction";
import { SensorCard } from "@/components/SensorCard";

export const baseUrl = import.meta.env.VITE_APP_API_URL ?? "";
export const api = axios.create({
  baseURL: baseUrl,
});

// Fetchers
export const post = (url: string, body: any) =>
  api.post(url, body).then((res) => res.data);

export const fetcher = (url: string) => api.get(url).then((res) => res.data);

const sensorIcons: { [key: string]: any } = {
  temperature: Thermometer,
  humidity: Droplet,
  motion: Rat,
  light_level: Sun,
  soil_moisture: Sprout,
  valve_status: Droplet,
};

const sensorUnits: { [key: string]: string } = {
  temperature: "°C",
  humidity: "%",
  light_level: "lx",
  soil: "%",
};

export default function Panel() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showWeather, setShowWeather] = useState(false);
  const field = useLocation();
  const fieldId = field.state;

  // Fetch devices by field ID
  const {
    data: devicesData,
    error: devicesError,
    isLoading: devicesLoading,
  } = useSWR([`/device/byFieldId`, fieldId], ([url, body]) => post(url, body));

  const fieldCoords = field.state.coordinate.split(",");
  const fieldLat = parseFloat(fieldCoords[0]);
  const fieldLng = parseFloat(fieldCoords[1]);

  // Combine all sensor requests into one key
  const sensorFetchKey = devicesData?.data.map(
    (device: any) => `/read/newest/${device.machineId}`
  );
  const {
    data: sensorsData,
    error: sensorsError,
    isLoading: sensorsLoading,
  } = useSWR(sensorFetchKey ? `/read/all` : null, () =>
    Promise.all(
      devicesData.data.map((device: any) =>
        fetcher(`/read/newest/${device.machineId}`)
      )
    )
  );

  useEffect(() => {
    if (devicesData?.data.length > 0) {
      setSelectedDevice(devicesData.data[0].machineId);
    }
  }, [devicesData]);

  // Loading or Error State
  if (devicesLoading || sensorsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-green-800"
        >
          Loading data...
        </motion.div>
      </div>
    );
  }

  if (devicesError || sensorsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-red-600"
        >
          Failed to load data. Please try again later.
        </motion.div>
      </div>
    );
  }

  if (!devicesData || !sensorsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-green-800"
        >
          No data available
        </motion.div>
      </div>
    );
  }

  // Combine devices and sensor data
  const devicesWithSensors = devicesData.data.map(
    (device: any, index: number) => ({
      ...device,
      sensorData: sensorsData[index],
    })
  );

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setShowWeather(false);
  };

  const handleWeatherSelect = () => {
    setSelectedDevice(null);
    setShowWeather(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4 py-20">
          {/* <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-green-800 mb-12 text-center"
          >
            Sensor Data Dashboard
          </motion.h2> */}
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/3"
            >
              <Card className="sticky top-24">
                <CardHeader className="bg-green-900 text-white rounded-t-lg p-4">
                  <CardTitle>Devices</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {devicesWithSensors.map((device: any) => (
                    <button
                      key={device.machineId}
                      onClick={() => handleDeviceSelect(device.machineId)}
                      className={`w-full text-left p-2 rounded mb-2 transition-colors ${
                        selectedDevice === device.machineId
                          ? "bg-green-200 text-green-800"
                          : "hover:bg-green-100"
                      }`}
                    >
                      <Cctv className="mr-2 h-5 w-5" />
                      {device.machineId}
                    </button>
                  ))}

                  <button
                    onClick={handleWeatherSelect}
                    className={`w-full text-left p-2 rounded mb-2 transition-colors flex items-center ${
                      showWeather
                        ? "bg-green-200 text-green-800"
                        : "hover:bg-green-100"
                    }`}
                  >
                    <CloudSun className="mr-2 h-5 w-5" />
                    Weather Prediction
                  </button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:w-2/3"
            >
              <AnimatePresence mode="wait">
                {showWeather ? (
                  <motion.div
                    key="weather"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <WeatherPrediction
                      latitude={fieldLat}
                      longitude={fieldLng}
                    />
                  </motion.div>
                ) : (
                  devicesWithSensors
                    .filter(
                      (device: any) => device.machineId === selectedDevice
                    )
                    .map((device: any) => (
                      <motion.div
                        key={device.machineId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
                          <CardHeader className="bg-green-900 text-white rounded-t-lg p-4">
                            <Sprout className="w-10 h-10 text-white mb-2" />
                            <CardTitle>{`Device ID : ${device.machineId}`}</CardTitle>
                            <CardDescription>
                              Sensor readings overview
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-6">
                            {device.sensorData &&
                            device.sensorData.data.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {device.sensorData.data.map(
                                  (sensor: any, index: number) => (
                                    <motion.div
                                      key={sensor.timestamp}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                      }}
                                    >
                                      <SensorCard
                                        type={sensor.type}
                                        value={sensor.value}
                                        timestamp={sensor.timestamp}
                                        icon={
                                          sensorIcons[sensor.type.toLowerCase()]
                                        }
                                        unit={
                                          sensorUnits[sensor.type.toLowerCase()]
                                        }
                                      />
                                    </motion.div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p>No sensor data available</p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
