import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/events`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setTimeout(() => setLoading(false), 500); // smooth loader
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-blue-400 flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-gray-800 font-sans font-semibold">
            GitHub Repository Activity
          </h1>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="h-2 w-2 bg-blue-500 rounded-full animate-ping"></span>
              Refreshing
            </div>
          )}
        </div>

        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">No activity yet.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event, idx) => (
              <li
                key={idx}
                className="border-l-4 border-blue-500 pl-4 text-gray-700 text-sm"
              >
                {formatEvent(event)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatEvent(event) {
  const time = new Date(event.timestamp).toUTCString();

  if (event.action === "PUSH") {
    return `"${event.author}" pushed to "${event.to_branch}" on ${time}`;
  }

  if (event.action === "PULL_REQUEST") {
    return `"${event.author}" submitted a pull request from "${event.from_branch}" to "${event.to_branch}" on ${time}`;
  }

  if (event.action === "MERGE") {
    return `"${event.author}" merged branch "${event.from_branch}" to "${event.to_branch}" on ${time}`;
  }

  return null;
}
