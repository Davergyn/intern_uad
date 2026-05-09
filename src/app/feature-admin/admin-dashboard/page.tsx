"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import Link from "next/link";
import ManageEvents from "../manage-events";
import ManageUsers from "../manage-users";
import Analytics from "../analytics";

export default function AdminDashboard() {
  const { adminEmail, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");


  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const totalUsers = 3;
  const activeUsers = 2;
  const totalEvents = 3;
  const upcomingEvents = 2;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">.id Academy Admin</h1>
            <p className="text-sm text-gray-600 mt-1">
              Logged in as: <span className="font-semibold">{adminEmail}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "users", label: "Manage Users" },
              { id: "events", label: "Manage Events" },
              { id: "analytics", label: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</p>
                  </div>
                  <div className="text-4xl text-blue-500 opacity-20">👥</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{activeUsers}</p>
                  </div>
                  <div className="text-4xl text-green-500 opacity-20">✓</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Events</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalEvents}</p>
                  </div>
                  <div className="text-4xl text-purple-500 opacity-20">📅</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Upcoming Events</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingEvents}</p>
                  </div>
                  <div className="text-4xl text-orange-500 opacity-20">🎯</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-gray-900 font-medium">New user registration</p>
                    <p className="text-sm text-gray-600">Jane Smith joined the platform</p>
                  </div>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-gray-900 font-medium">Event completed</p>
                    <p className="text-sm text-gray-600">Digital Marketing Seminar finished</p>
                  </div>
                  <p className="text-sm text-gray-600">5 hours ago</p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-gray-900 font-medium">New event created</p>
                    <p className="text-sm text-gray-600">AI Training Program scheduled</p>
                  </div>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && <ManageUsers />}

        {/* Events Tab */}
        {activeTab === "events" && <ManageEvents />}

        {/* Analytics Tab */}
        {activeTab === "analytics" && <Analytics />}
      </div>


    </div>
  );
}
