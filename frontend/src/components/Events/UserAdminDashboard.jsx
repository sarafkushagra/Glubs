import React, { useState } from "react"; // ✨ Add useState
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
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Download, Filter } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// ✨ NavItem now takes `onClick` handler
const NavItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-2 px-2 py-1 text-left rounded hover:bg-sky-100 transition"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default function Dashboard({ role = "user" }) {
  const [page, setPage] = useState("dashboard"); // ✨ Track selected page

  // KPI data
  const totalRegistrations = 1247;
  const revenue = "$24,580";
  const attendanceRate = 78;
  const avgRating = 4.6;
  const barValues = [45, 78, 123, 89, 156, 234, 189];
  const capacity = 83;
  const refunds = 3500;
  const promoSpend = "$1,200";
  const nps = 68;

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ label: "Registrations", data: barValues, backgroundColor: "#0ea5e9", borderRadius: 4 }],
  };
  const doughnutData = {
    labels: ["Registered", "Available"],
    datasets: [{ data: [capacity, 100 - capacity], backgroundColor: ["#0ea5e9", "#bae6fd"] }],
  };

  const badge = (s) =>
    ({ confirmed: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", cancelled: "bg-red-100 text-red-700" }[s]);

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

  const recent = [
    { name: "Alex Johnson", email: "alex@example.com", status: "confirmed", time: "2 min" },
    { name: "Sarah Chen", email: "sarah@example.com", status: "pending", time: "5 min" },
    { name: "Mike Davis", email: "mike@example.com", status: "confirmed", time: "6 min" },
    { name: "Emma Wilson", email: "emma@example.com", status: "confirmed", time: "11 min" },
    { name: "James Brown", email: "james@example.com", status: "cancelled", time: "15 min" },
  ];

  /* ───────────── Sidebar ───────────── */
  const sidebarItems = role === "admin"
    ? [
        { label: "📊 Live Dashboard", value: "dashboard" },
        { label: "📈 Trend Analysis", value: "trend" },
        { label: "💰 Revenue Report", value: "revenue" },
        { label: "⭐ Rating & NPS", value: "rating" },
        { label: "🗓️ Event Calendar", value: "calendar" },
        { label: "👥 Attendee Manager", value: "attendees" },
        { label: "🔔 Notifications", value: "notifications" },
        { label: "💸 Finance Overview", value: "finance" },
        { label: "⚙️ Settings", value: "settings" },
      ]
    : [
        { label: "🏠 Dashboard", value: "dashboard" },
        { label: "🗓️ Upcoming Events", value: "upcoming" },
        { label: "🎫 My Tickets", value: "tickets" },
        { label: "📜 Certificates", value: "certificates" },
      ];

  const currentPageContent = () => {
    if (page === "dashboard") {
      return (
        <>
          <h1 className="text-xl font-bold text-sky-800">Design Thinking and Innovation Week #1</h1>
          <p className="text-sky-600">Real‑time analytics and registration data</p>

          <div className={`grid gap-4 ${role === "admin" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
            {(role === "admin" ? adminKPIs : userKPIs).map((k) => (
              <motion.div key={k.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <KPI {...k} />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="Registration Trend">
              <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
            </Card>
            <Card title="Event Capacity">
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Doughnut data={doughnutData} options={{ plugins: { legend: { display: false } } }} />
                <p className="text-center text-sky-600">Registered {totalRegistrations} • Available {1000 - totalRegistrations}</p>
              </div>
            </Card>
          </div>
        </>
      );
    }
    return <div className="text-sky-700 text-lg">You selected: <strong>{page}</strong> page (coming soon)</div>;
  };

  return (
    <div className="flex min-h-screen bg-sky-100 text-sm">
      {/* ────────── SIDEBAR ────────── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sky-50 shadow-xl">
        <div className="px-6 py-4 text-lg font-bold text-sky-700">{role === "admin" ? "Glubs Admin" : "My Panel"}</div>
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-2 text-sky-800">
          {sidebarItems.map((item) => (
            <NavItem key={item.label} label={item.label} onClick={() => setPage(item.value)} />
          ))}
        </nav>
      </aside>

      {/* ────────── MAIN CONTENT ────────── */}
      <main className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {currentPageContent()}
      </main>
    </div>
  );
}

// ✨ Sample KPI and Card (you already have this probably)
const KPI = ({ title, value }) => (
  <div className="p-4 bg-white rounded-xl shadow flex flex-col gap-1">
    <p className="text-sky-600 text-sm">{title}</p>
    <p className="text-lg font-bold text-sky-900">{value}</p>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="mb-2 font-bold text-sky-700">{title}</p>
    {children}
  </div>
);



