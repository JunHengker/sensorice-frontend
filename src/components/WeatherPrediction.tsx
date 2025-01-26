import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";
import {
  Sun,
  Thermometer,
  ThermometerSnowflake,
  ThermometerSun,
  Droplet,
  Wind,
  CloudSun,
} from "lucide-react";

interface WeatherPredictionProps {
  latitude: number;
  longitude: number;
}

export function WeatherPrediction({
  latitude,
  longitude,
}: WeatherPredictionProps) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [currentWeather, setCurrentWeather] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const params = {
        latitude,
        longitude,
        hourly: [
          "temperature_2m",
          "precipitation_probability",
          "windspeed_10m",
          "weathercode",
        ],
        current_weather: true,
        timezone: "auto",
        forecast_days: 1,
      };

      const weatherDescriptions: { [key: number]: string } = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Drizzle: Light",
        53: "Drizzle: Moderate",
        55: "Drizzle: Dense",
        56: "Freezing drizzle: Light",
        57: "Freezing drizzle: Dense",
        61: "Rain: Slight",
        63: "Rain: Moderate",
        65: "Rain: Heavy",
        66: "Freezing rain: Light",
        67: "Freezing rain: Heavy",
        71: "Snow fall: Slight",
        73: "Snow fall: Moderate",
        75: "Snow fall: Heavy",
        77: "Snow grains",
        80: "Rain showers: Slight",
        81: "Rain showers: Moderate",
        82: "Rain showers: Violent",
        85: "Snow showers: Slight",
        86: "Snow showers: Heavy",
        95: "Thunderstorm: Slight or moderate",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
      };

      const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        { params }
      );
      const hourly = response.data.hourly;
      const current = response.data.current_weather;

      if (!hourly) {
        return;
      }

      const weatherData = hourly.time.map((time: string, index: number) => ({
        time: new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperature: hourly.temperature_2m[index],
        precipitation: hourly.precipitation_probability[index],
        windSpeed: hourly.windspeed_10m[index],
        weatherDescription: weatherDescriptions[hourly.weathercode[index]],
      }));

      setWeatherData(weatherData);
      setCurrentWeather({
        temperature: current.temperature,
        windSpeed: current.windspeed,
        weatherDescription: weatherDescriptions[current.weathercode],
      });
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (!weatherData || !currentWeather) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <p className="text-lg text-green-600">Loading weather data...</p>
      </motion.div>
    );
  }

  const averageTemp =
    weatherData.reduce((sum: number, data: any) => sum + data.temperature, 0) /
    weatherData.length;
  const maxTemp = Math.max(...weatherData.map((data: any) => data.temperature));
  const minTemp = Math.min(...weatherData.map((data: any) => data.temperature));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-4 bg-gradient-to-br from-blue-50 to-green-50 shadow-lg">
        <CardHeader className="bg-green-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Sun className="w-10 h-10" />
              <span>Weather Prediction</span>
            </span>
            <span>
              <WeatherStat
                icon={<CloudSun className="w-10 h-10 text-blue-300" />}
                label="Current Weather"
                value={`${currentWeather.weatherDescription}`}
              />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <WeatherStat
              icon={<Thermometer className="w-6 h-6 text-yellow-500" />}
              label="Average Temp"
              value={`${averageTemp.toFixed(1)}°C`}
            />
            <WeatherStat
              icon={<ThermometerSun className="w-6 h-6 text-red-500" />}
              label="Max Temp"
              value={`${maxTemp.toFixed(1)}°C`}
            />
            <WeatherStat
              icon={<ThermometerSnowflake className="w-6 h-6 text-blue-500" />}
              label="Min Temp"
              value={`${minTemp.toFixed(1)}°C`}
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis
                dataKey="time"
                stroke="#718096"
                tick={{ fill: "#4A5568" }}
              />
              <YAxis
                yAxisId="left"
                stroke="#718096"
                tick={{ fill: "#4A5568" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#718096"
                tick={{ fill: "#4A5568" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                stroke="#F6AD55"
                strokeWidth={2}
                dot={false}
                name="Temperature (°C)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="precipitation"
                stroke="#63B3ED"
                strokeWidth={2}
                dot={false}
                name="Precipitation (%)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="windSpeed"
                stroke="#9AE6B4"
                strokeWidth={2}
                dot={false}
                name="Wind Speed (km/h)"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <WeatherStat
              icon={<Thermometer className="w-6 h-6 text-orange-500" />}
              label="Current Temp"
              value={`${currentWeather.temperature}°C`}
            />
            <WeatherStat
              icon={<Droplet className="w-6 h-6 text-blue-500" />}
              label="Precipitation"
              value={`${weatherData[0].precipitation}%`}
            />
            <WeatherStat
              icon={<Wind className="w-6 h-6 text-green-500" />}
              label="Wind Speed"
              value={`${currentWeather.windSpeed} km/h`}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface WeatherStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function WeatherStat({ icon, label, value }: WeatherStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
    >
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
}
