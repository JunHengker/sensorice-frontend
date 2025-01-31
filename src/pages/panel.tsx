import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Header } from "./index";
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
  AlertTriangle,
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
  const [showPest, setShowPest] = useState(false);
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
    setShowPest(false);
  };

  const handleWeatherSelect = () => {
    setSelectedDevice(null);
    setShowWeather(true);
    setShowPest(false);
  };

  const handlePestSelect = () => {
    setSelectedDevice(null);
    setShowWeather(false);
    setShowPest(true);
  };

  const predictPestAttack = () => {
    if (!sensorsData) return null;
    let pestRisk = { rodent: false, planthopper: false };

    sensorsData.forEach((sensorData) => {
      sensorData.data.forEach((sensor: any) => {
        const { type, value } = sensor;

        if (type.toLowerCase() === "motion" && value > 0) {
          pestRisk.rodent = true;
        }

        if (type.toLowerCase() === "temperature" && value > 27) {
          if (
            sensorData.data.some(
              (s: any) => s.type.toLowerCase() === "humidity" && s.value > 70
            )
          ) {
            pestRisk.planthopper = true;
          }
        }
      });
    });

    return pestRisk;
  };

  const pestRisk = predictPestAttack();

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
              <Card className="sticky top-24 bg-white">
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

                  <button
                    onClick={handlePestSelect}
                    className={`w-full text-left p-2 rounded mb-2 transition-colors flex items-center ${
                      showPest
                        ? "bg-green-200 text-green-800"
                        : "hover:bg-green-100"
                    }`}
                  >
                    <Rat className="mr-2 h-5 w-5" />
                    Pest Prediction
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
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8 bg-white">
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

                {showPest ? (
                  <motion.div
                    key="pest"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8 bg-white">
                      <CardHeader className="bg-red-600 text-white rounded-t-lg p-4">
                        <AlertTriangle className="w-10 h-10 text-white mb-2" />
                        <CardTitle>Pest Attack Prediction</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {pestRisk?.rodent && (
                          <p className="text-lg text-red-600">
                            ⚠️ Rodent activity detected! Consider setting traps.
                          </p>
                        )}
                        {pestRisk?.planthopper && (
                          <p className="text-lg text-red-600">
                            ⚠️ High risk of brown planthopper infestation due to
                            warm, humid conditions.
                          </p>
                        )}
                        {!pestRisk?.rodent && !pestRisk?.planthopper && (
                          <p className="text-lg text-green-600">
                            ✅ No immediate pest threats detected.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Sensorice</h3>
              <p className="text-sm">Smart IoT solutions for paddy fields</p>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/demo" className="hover:text-green-300">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-green-300">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-green-300">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-green-300">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-sm mb-2">Email: alvinyoh08@gmail.com</p>
              {/* <p className="text-sm mb-2">Phone: </p> */}
              <p className="text-sm">
                Address: Tangerang Kota, Banten, Indonesia.
              </p>
            </div>
            <div className="w-full md:w-1/4">
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-green-300">
                  Facebook (soon)
                </a>

                <a href="#" className="hover:text-green-300">
                  Twitter (soon)
                </a>
                <a
                  href="https://linked.in/in/alvinyohanes"
                  className="hover:text-green-300"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-700 text-center">
            <p className="text-sm">
              &copy; 2025 SensoRice. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
