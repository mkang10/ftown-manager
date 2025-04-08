import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

interface BarChartCardProps {
  data: any;
  options: ChartOptions<"bar">; // Sử dụng ChartOptions cho chart type "bar"
}

const BarChartCard: React.FC<BarChartCardProps> = ({ data, options }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-md p-4 flex flex-col transition hover:shadow-lg">
      <h2 className="font-semibold text-gray-800 mb-4">Revenue</h2>
      <div className="h-48">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChartCard;
