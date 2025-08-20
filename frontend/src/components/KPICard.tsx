import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface KPICardProps {
  title: string;
  mainValue: string | number;
  subtitle?: string;
  color: "orange" | "light-orange" | "beige";
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  mainValue,
  subtitle,
  color,
  onClick,
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "orange":
        return "bg-orange-500 text-white";
      case "light-orange":
        return "bg-orange-400 text-white";
      case "beige":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div
      className={`stat-card ${getColorClasses(
        color
      )} cursor-pointer transition-transform duration-200 hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
          <div className="text-2xl font-bold mb-1">{mainValue}</div>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
        </div>
        <ArrowRightIcon className="w-6 h-6 opacity-80" />
      </div>
    </div>
  );
};

export default KPICard;
