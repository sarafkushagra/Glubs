import React, { useState } from "react";
import Navbar from "../Pages/Navbar";
import Footer from "../Pages/Footer";
import EventAnalytics from "./EventAnalytics";
import Organizers from "./Organizers";
import QRRegistration from "./QRRegistration";
import { ChevronRight } from "lucide-react";

export default function DashboardPage() {
    const FEATURES = ["Events", "Clubs", "QR"];
    const [currentFeature, setCurrentFeature] = useState(FEATURES[0]);

    const handleFeatureSwitch = () => {
        const currentIndex = FEATURES.indexOf(currentFeature);
        const nextIndex = (currentIndex + 1) % FEATURES.length;
        setCurrentFeature(FEATURES[nextIndex]);
    };

    return (
        <>
            <Navbar />

            {/* Floating Button */}
            <button
                onClick={handleFeatureSwitch}
                className="fixed bottom-8 right-8 z-50 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full p-4 shadow-lg transition duration-300 flex items-center justify-center"
                aria-label="Switch Feature"
            >
                <ChevronRight size={28} />
            </button>

            <div className="flex justify-center">
                {/* Render current feature content */}
                {currentFeature === "Events" && <EventAnalytics />}
                {currentFeature === "Clubs" && <Organizers />}
                {currentFeature === "QR" && <QRRegistration />}
            </div>

            <Footer />
        </>
    );
}
