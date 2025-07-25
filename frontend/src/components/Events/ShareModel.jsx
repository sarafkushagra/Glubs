import { motion } from "framer-motion";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";

import { X } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";

const ShareModal = ({ event, onClose }) => {
  const eventUrl = `https://glubs.com/events/${event._id}`;

  const formattedDate = event.date
    ? format(new Date(event.date), "dd MMM yyyy, h:mm a")
    : "Soon";

  const fullMessage = `🚀 You're invited to *${event.title}* on Glubs!

📅 Date: ${formattedDate}
📍 Mode: ${event.mode?.toUpperCase()}
🏛️ Venue: ${event.venue || "To be announced"}

🔗 Register or know more: ${eventUrl}
#${event.festival || "GlubsEvent"} #CollegeEvents #Glubs`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast.success("✅ Link copied to clipboard!");
    } catch (err) {
      toast.error("❌ Failed to copy link.");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 flex items-end md:items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-2xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            📢 Spread the word!
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 justify-items-center py-2">
          <WhatsappShareButton url={eventUrl} title={fullMessage}>
            <WhatsappIcon size={48} round />
          </WhatsappShareButton>

          <FacebookShareButton url={eventUrl} quote={fullMessage}>
            <FacebookIcon size={48} round />
          </FacebookShareButton>

          <TwitterShareButton url={eventUrl} title={fullMessage}>
            <TwitterIcon size={48} round />
          </TwitterShareButton>

          <LinkedinShareButton url={eventUrl} summary={event.description} title={event.title}>
            <LinkedinIcon size={48} round />
          </LinkedinShareButton>

          <TelegramShareButton url={eventUrl} title={fullMessage}>
            <TelegramIcon size={48} round />
          </TelegramShareButton>
        </div>

        <button
          onClick={handleCopy}
          className="w-full mt-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          📋 Copy Link to Clipboard
        </button>
      </motion.div>
    </div>
  );
};

export default ShareModal;
