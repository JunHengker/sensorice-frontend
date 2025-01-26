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

export function SensorCard({
  type,
  value,
  timestamp,
  icon,
  unit,
}: SensorCardProps) {
  const displayValue = `${value}${unit ? ` ${unit}` : ""}`;

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
      <CardContent className="flex items-center bg-gray-100 ">
        <p className="text-2xl font-bold text-green-700">{displayValue}</p>
      </CardContent>
    </Card>
  );
}
