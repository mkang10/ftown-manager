import React from "react";
import { IconType } from "react-icons";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactElement<IconType>;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconColor }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md p-4 rounded-lg shadow-md flex items-center space-x-4 transition hover:shadow-lg">
      <div className={`p-3 rounded-full text-white ${iconColor}`}>{icon}</div>
      <div>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
