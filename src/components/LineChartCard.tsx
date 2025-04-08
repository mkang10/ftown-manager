import React from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

interface LineChartCardProps {
  data: any;
  options: ChartOptions<"line">;
}

const LineChartCard: React.FC<LineChartCardProps> = ({ data, options }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-md p-4 flex flex-col transition hover:shadow-lg">
      <h2 className="font-semibold text-gray-800 mb-4">Order Processing Time</h2>
      <div className="h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChartCard;
