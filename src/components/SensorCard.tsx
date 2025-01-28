import { createElement } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SensorCardProps {
  type: string;
  value: string | number;
  timestamp: string;
  icon: any;
  unit?: string;
  explanation?: string;
}

// Function to determine the soil moisture explanation
const getSoilMoistureExplanation = (value: number): string => {
  if (value >= 1500 && value < 1700) return "Wet";
  if (value >= 1700 && value < 2000) return "Optimal";
  if (value >= 2000 && value < 2200) return "Moderate";
  if (value >= 2200 && value <= 2500) return "Dry";
  return "Unknown";
};

export function SensorCard({
  type,
  value,
  timestamp,
  icon,
  unit,
}: SensorCardProps) {
  const displayValue = `${value}${unit ? ` ${unit}` : ""}`;
  const soilMoistureExplanation =
    type === "SOIL_MOISTURE" && typeof value === "string"
      ? getSoilMoistureExplanation(parseInt(value))
      : null;

  return (
    <Card className="border shadow-md p-2 h-full bg-white">
      <CardHeader className="bg-gray-100 rounded p-3">
        <div className="flex items-center justify-between">
          {type === "TEMPERATURE" ? (
            <div className="flex items-center space-x-2">
              {createElement(icon, { className: "w-6 h-6 text-blue-500" })}
              <CardTitle className="text-blue-800">{type}</CardTitle>
            </div>
          ) : null}
          {type === "HUMIDITY" ? (
            <div className="flex items-center space-x-2">
              {createElement(icon, { className: "w-6 h-6 text-blue-800" })}
              <CardTitle className="text-blue-900">{type}</CardTitle>
            </div>
          ) : null}
          {type === "SOIL_MOISTURE" ? (
            <div className="flex items-center space-x-2">
              {createElement(icon, { className: "w-6 h-6 text-green-500" })}
              <CardTitle className="text-green-900">{type}</CardTitle>
            </div>
          ) : null}
          {type === "LIGHT_LEVEL" ? (
            <div className="flex items-center space-x-2">
              {createElement(icon, { className: "w-6 h-6 text-yellow-500" })}
              <CardTitle className="text-yellow-700">{type}</CardTitle>
            </div>
          ) : null}
          {type === "MOTION" ? (
            <div className="flex items-center space-x-2">
              {createElement(icon, { className: "w-6 h-6 text-yellow-800" })}
              <CardTitle className="text-yellow-900">{type}</CardTitle>
            </div>
          ) : null}
          {type === "VALVE_STATUS" ? (
            <div className="flex items-center space-x-2">
              {createElement(icon, { className: "w-6 h-6 text-blue-500" })}
              <CardTitle className="text-blue-900">{type}</CardTitle>
            </div>
          ) : null}
        </div>
        <CardDescription className="text-gray-500 ">
          {new Date(timestamp).toLocaleString()}
        </CardDescription>
      </CardHeader>

      {soilMoistureExplanation ? (
        <CardContent className="bg-white-100 p-2">
          <p className="text-2xl font-bold text-green-700">
            {soilMoistureExplanation}
          </p>

          {soilMoistureExplanation === "Dry" ? (
            <p className="text-red-500">
              Low moisture, urgent irrigation needed.
            </p>
          ) : soilMoistureExplanation === "Moderate" ? (
            <p className="text-yellow-500">
              Slightly dry, may require irrigation soon.
            </p>
          ) : soilMoistureExplanation === "Optimal" ? (
            <p className="text-green-500">Best range for paddy field growth.</p>
          ) : soilMoistureExplanation === "Wet" ? (
            <p className="text-blue-500">
              High moisture, typically during irrigation or after rain.
            </p>
          ) : (
            <p className="text-gray-500">Unknown moisture level.</p>
          )}
        </CardContent>
      ) : (
        <CardContent className="bg-white-100 space-y-2">
          <p className="text-2xl font-bold text-green-700">{displayValue}</p>
        </CardContent>
      )}
    </Card>
  );
}
