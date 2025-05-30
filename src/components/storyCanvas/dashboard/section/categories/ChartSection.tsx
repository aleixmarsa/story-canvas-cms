"use client";

import { ChartSectionProps } from "@/sections/validation/sections/chart-section-schema";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
import RichTextContent from "./fields/RichTextContent";

const ChartSection = ({
  title,
  description,
  data,
  xKey,
  yKeys,
  type,
}: ChartSectionProps) => {
  if (!data || !xKey || !yKeys || yKeys.length === 0) {
    return (
      <div className="py-8 text-red-500 text-center">
        Invalid chart configuration
      </div>
    );
  }

  const yKeysSplit = yKeys.split(",");
  let parsedData = [];
  try {
    parsedData = JSON.parse(data);
    if (!Array.isArray(parsedData)) throw new Error("Invalid array");
  } catch {
    return <div className="text-red-500">Invalid chart data</div>;
  }

  const renderChart = (): React.ReactElement => {
    switch (type) {
      case "line":
        return (
          <LineChart data={parsedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeysSplit.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                dot
              />
            ))}
          </LineChart>
        );
      case "bar":
        return (
          <BarChart data={parsedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeysSplit.map((key, index) => (
              <Bar
                key={key}
                type="monotone"
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        );
      default:
        return (
          <div className="text-red-500 text-center">
            Unsupported chart type: <code>{type}</code>
          </div>
        );
    }
  };
  const chart = renderChart();
  const isValidChart = type === "line" || type === "bar";

  return (
    <div className="py-8 w-full">
      <div className="pb-4">{title && <RichTextContent html={title} />}</div>
      <div className="pb-4">
        {description && <RichTextContent html={description} />}
      </div>
      {isValidChart ? (
        <ResponsiveContainer width="100%" height={400}>
          {chart}
        </ResponsiveContainer>
      ) : (
        chart
      )}
    </div>
  );
};

export default ChartSection;
