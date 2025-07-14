import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard({ role = "user" }) {
  const totalRegistrations = 1247;
  const revenue = "$24,580";
  const attendanceRate = 78;
  const avgRating = 4.6;
  const barValues = [45, 78, 123, 89, 156, 234, 189];
  const capacity = 83;
  const refunds = 3500; // admin‑only metric
  const promoSpend = "$1,200"; // admin‑only metric
  const nps = 68; // admin‑only metric (Net Promoter Score)

  const recent = [
    { name: "Alex Johnson", email: "alex@example.com", status: "confirmed", time: "2 min" },
    { name: "Sarah Chen", email: "sarah@example.com", status: "pending", time: "5 min" },
    { name: "Mike Davis", email: "mike@example.com", status: "confirmed", time: "6 min" },
    { name: "Emma Wilson", email: "emma@example.com", status: "confirmed", time: "11 min" },
    { name: "James Brown", email: "james@example.com", status: "cancelled", time: "15 min" },
  ];

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      { label: "Registrations", data: barValues, backgroundColor: "#0ea5e9", borderRadius: 4 },
    ],
  };

  const doughnutData = {
    labels: ["Registered", "Available"],
    datasets: [
      { data: [capacity, 100 - capacity], backgroundColor: ["#0ea5e9", "#bae6fd"] },
    ],
  };

  const badge = (s) =>
    ({
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      cancelled: "bg-red-100 text-red-700",
    }[s]);

  const adminKPIs = [
    { title: "Total Registrations", value: totalRegistrations, growth: "+12%" },
    { title: "Revenue Generated", value: revenue },
    { title: "Refunds Issued", value: `$${refunds}` },
    { title: "Promo Spend", value: promoSpend },
    { title: "Attendance Rate", value: `${attendanceRate}%`, progress: attendanceRate },
    { title: "Average Rating", value: `${avgRating}/5` },
    { title: "Net Promoter Score", value: nps },
  ];

  const userKPIs = [
    { title: "Total Registrations", value: totalRegistrations, growth: "+12%" },
    { title: "Revenue Generated", value: revenue },
    { title: "Attendance Rate", value: `${attendanceRate}%`, progress: attendanceRate },
    { title: "Average Rating", value: `${avgRating}/5` },
  ];

  return (
    <div className="flex min-h-screen bg-sky-100 text-sm">
      {role === "admin" && (
        <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sky-50 shadow-xl">
          <div className="px-6 py-4 text-lg font-semibold text-sky-700">Glubs</div>
          <nav className="flex-1 px-6 py-4 space-y-6 text-sky-800">
            <section>
              <p className="mb-2 text-xs font-bold text-sky-600">CURRENT EVENTS</p>
              <ul className="space-y-1">
                <li className="font-medium text-sky-700">Design Thinking #1</li>
                <li className="text-sky-500">Tech Conference 2024 (Draft)</li>
                <li className="text-sky-500">Startup Pitch Night (Scheduled)</li>
              </ul>
            </section>
            <section className="space-y-3">
              <p className="text-xs font-bold text-sky-600">MANAGEMENT</p>
              <div>🗓️ Event Calendar</div>
              <div>👥 Attendee Management</div>
              <div>💸 Finance Overview</div>
              <div>⚙️ Settings</div>
            </section>
          </nav>
        </aside>
      )}

      <main className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-sky-800">Design Thinking and Innovation Week #1</h1>
            <p className="text-sky-600">Real‑time analytics and registration data</p>
          </div>

          {role === "admin" && (
            <div className="flex gap-2">
              <button className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700">Export CSV</button>
              <button className="border border-sky-600 text-sky-600 px-3 py-1 rounded hover:bg-sky-100">Filter</button>
              <label className="flex items-center gap-1">
                <input type="checkbox" className="accent-sky-600" /> Live
              </label>
            </div>
          )}
        </div>

        {/* KPI Grid */}
        <div className={`grid gap-4 ${role === "admin" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
          {(role === "admin" ? adminKPIs : userKPIs).map((k) => (
            <KPI key={k.title} {...k} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Registration Trend">
            <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
          </Card>

          <Card title="Event Capacity">
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Doughnut data={doughnutData} options={{ plugins: { legend: { display: false } } }} />
              <p className="text-center text-sky-600">
                Registered {totalRegistrations} • Available {1000 - totalRegistrations}
              </p>
            </div>
          </Card>
        </div>

        {/* Recent Registrations */}
        <Card title="Recent Registrations" className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <tbody>
              {recent.map((r) => (
                <tr key={r.email} className="bg-white shadow-sm">
                  <td className="py-2 w-1/3 text-sky-900 font-medium">{r.name}</td>
                  <td className="text-sky-600 w-1/3">{r.email}</td>
                  <td className="w-1/6">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${badge(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="text-right text-sky-400 w-1/6">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}

function KPI({ title, value, growth, progress }) {
  return (
    <div className="bg-white rounded border border-sky-200 p-4 space-y-2 shadow">
      <p className="text-xs text-sky-500 font-semibold">{title}</p>
      <p className="text-2xl font-bold text-sky-800">{value}</p>
      {growth && <p className="text-xs text-green-600">{growth}</p>}
      {progress !== undefined && (
        <div className="h-2 w-full bg-sky-200 rounded">
          <div
            className="h-2 bg-sky-600 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded border border-sky-200 p-4 shadow ${className}`}>
      <h2 className="text-sm font-semibold text-sky-700 mb-2">{title}</h2>
      {children}
    </div>
  );
}

