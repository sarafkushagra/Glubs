// // components/ShareButtons.jsx
// import {
//   WhatsappShareButton,
//   FacebookShareButton,
//   TwitterShareButton,
//   LinkedinShareButton,
//   TelegramShareButton,
//   EmailShareButton,
// } from "react-share";

// import {
//   WhatsappIcon,
//   FacebookIcon,
//   TwitterIcon,
//   LinkedinIcon,
//   TelegramIcon,
//   EmailIcon,
// } from "react-share";

// const ShareButtons = ({ event }) => {
//   const eventUrl = `${window.location.origin}/events/${event._id}`;
//   const shareMessage = `🎉 ${event.title} is happening soon!

// 📅 Date: ${new Date(event.date).toLocaleDateString()}
// 📍 Mode: ${event.mode || "Online"}
// ${event.prizePool ? `💰 Prize Pool: ₹${event.prizePool.toLocaleString()}\n` : ""}👥 Already ${event.registeredUsers?.length || 0} people registered!

// ${event.description ? event.description.substring(0, 100) + "..." : ""}

// 🔗 Register Now: ${eventUrl}

// #Glubs #Events #${event.eventType || "Competition"}`;

//   return (
//     <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md w-fit">
//       <WhatsappShareButton url={eventUrl} title={shareMessage}>
//         <WhatsappIcon size={40} round />
//       </WhatsappShareButton>
//       <FacebookShareButton url={eventUrl} quote={shareMessage}>
//         <FacebookIcon size={40} round />
//       </FacebookShareButton>
//       <TwitterShareButton url={eventUrl} title={shareMessage}>
//         <TwitterIcon size={40} round />
//       </TwitterShareButton>
//       <LinkedinShareButton url={eventUrl} title={event.title} summary={shareMessage}>
//         <LinkedinIcon size={40} round />
//       </LinkedinShareButton>
//       <TelegramShareButton url={eventUrl} title={shareMessage}>
//         <TelegramIcon size={40} round />
//       </TelegramShareButton>
//       <EmailShareButton url={eventUrl} subject={`Don't miss: ${event.title}`} body={shareMessage}>
//         <EmailIcon size={40} round />
//       </EmailShareButton>
//     </div>
//   );
// };

// export default ShareButtons;




// import { useState } from "react";
// import { FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin, FaTelegram, FaEnvelope, FaTimes } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";

// const ShareModal = ({ event }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const eventUrl = `https://glubs.com/events/${event._id}`;
//   const title = `Check out this event "${event.title}" on Glubs! 🔥`;

//   const shareLinks = [
//     {
//       name: "WhatsApp",
//       icon: <FaWhatsapp />,
//       url: `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${eventUrl}`)}`,
//     },
//     {
//       name: "Twitter",
//       icon: <FaTwitter />,
//       url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(eventUrl)}`,
//     },
//     {
//       name: "Facebook",
//       icon: <FaFacebook />,
//       url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
//     },
//     {
//       name: "LinkedIn",
//       icon: <FaLinkedin />,
//       url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
//     },
//     {
//       name: "Telegram",
//       icon: <FaTelegram />,
//       url: `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(title)}`,
//     },
//     {
//       name: "Email",
//       icon: <FaEnvelope />,
//       url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(eventUrl)}`,
//     },
//   ];

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(true)}
//         className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow hover:scale-105 transition"
//       >
//         Share
//       </button>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             transition={{ type: "spring", duration: 0.3 }}
//             className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
//           >
//             <div className="bg-white w-full sm:w-96 p-6 rounded-t-2xl sm:rounded-2xl shadow-xl">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Share this Event</h3>
//                 <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black">
//                   <FaTimes />
//                 </button>
//               </div>
//               <div className="grid grid-cols-3 gap-4">
//                 {shareLinks.map(({ name, icon, url }) => (
//                   <a
//                     key={name}
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition"
//                   >
//                     <div className="text-2xl text-indigo-600">{icon}</div>
//                     <span className="text-xs mt-1 text-center text-gray-700">{name}</span>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ShareModal;






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
  EmailShareButton,
  EmailIcon
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

          <EmailShareButton url={eventUrl} subject={`You're invited: ${event.title}`} body={fullMessage}>
            <EmailIcon size={48} round />
          </EmailShareButton>
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
