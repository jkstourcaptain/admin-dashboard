import React from "react";
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CogIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "관리자 홈",
      icon: HomeIcon,
      path: "/",
      hasAddButton: false,
    },
    {
      name: "유저 관리",
      icon: UsersIcon,
      path: "/users",
      hasAddButton: true,
    },
    {
      name: "컨텐츠 관리",
      icon: DocumentTextIcon,
      path: "/content",
      hasAddButton: true,
    },
    {
      name: "포인트 관리",
      icon: CurrencyDollarIcon,
      path: "/points",
      hasAddButton: true,
    },
    {
      name: "서비스 관리",
      icon: CogIcon,
      path: "/services",
      hasAddButton: true,
    },
    {
      name: "통계",
      icon: ChartBarIcon,
      path: "/statistics",
      hasAddButton: true,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-blue-50 min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">머니또</h1>
        <p className="text-sm text-gray-600">탐험대장 Admin</p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-item ${isActive ? "active" : ""}`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="flex-1">{item.name}</span>
              {item.hasAddButton && (
                <PlusIcon className="w-4 h-4 text-gray-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full sidebar-item text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
