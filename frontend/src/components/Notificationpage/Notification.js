import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/notification/userId123'); // ← अपना userId लगाना
        setNotifications(res.data);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a259ff] to-[#f1e4ff] py-12 px-5">
      <div className="bg-white rounded-[20px] p-8 max-w-[700px] mx-auto shadow-lg">
        <h2 className="text-[28px] font-bold mb-6 text-center text-[#4b0082]">
          🔔 Notifications
        </h2>

        {notifications.length === 0 ? (
          <p className="text-center text-[16px] text-[#888]">
            No notifications yet!
          </p>
        ) : (
          <div className="flex flex-col gap-[18px]">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="bg-[#f7f0ff] p-5 rounded-[12px] border-l-[5px] border-[#a259ff] shadow-sm"
              >
                <h4 className="text-[18px] text-[#a259ff] font-semibold">
                  {n.type}
                </h4>
                <p className="text-[16px] text-[#333] mt-2">{n.message}</p>
                <p className="text-[13px] text-[#999] mt-2 text-right">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
