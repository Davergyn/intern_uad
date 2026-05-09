"use client";

import React, { useState } from "react";

interface Event {
  id: number;
  title: string;
  date: string;
  attendees: number;
  status: "upcoming" | "completed" | "cancelled";
}

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Web Development Workshop",
      date: "2024-05-20",
      attendees: 45,
      status: "upcoming",
    },
    {
      id: 2,
      title: "Digital Marketing Seminar",
      date: "2024-05-15",
      attendees: 32,
      status: "completed",
    },
    {
      id: 3,
      title: "AI Training Program",
      date: "2024-06-01",
      attendees: 28,
      status: "upcoming",
    },
  ]);

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter((e) => e.id !== eventId));
  };

  const handleEditEvent = (eventId: number) => {
    // TODO: Implement edit functionality
    console.log("Edit event:", eventId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
          Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">📅 {event.date}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  event.status === "upcoming"
                    ? "bg-blue-100 text-blue-800"
                    : event.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {event.status}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{event.attendees}</span> attendees
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditEvent(event.id)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
