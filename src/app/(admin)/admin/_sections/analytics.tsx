"use client";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">User Growth</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-700">January</p>
                <p className="text-sm text-gray-600">245</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-700">February</p>
                <p className="text-sm text-gray-600">312</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "35%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-700">March</p>
                <p className="text-sm text-gray-600">456</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "50%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-700">April</p>
                <p className="text-sm text-gray-600">623</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-700">May</p>
                <p className="text-sm text-gray-600">892</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Event Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <p className="text-gray-700 font-medium">Upcoming Events</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <p className="text-gray-700 font-medium">Completed Events</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                <p className="text-gray-700 font-medium">Cancelled Events</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                <p className="text-gray-700 font-medium">Total Registrations</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">4.9/5</p>
            <p className="text-gray-600 text-sm mt-2">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">98%</p>
            <p className="text-gray-600 text-sm mt-2">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">2.4s</p>
            <p className="text-gray-600 text-sm mt-2">Avg. Response Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
