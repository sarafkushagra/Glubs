import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';

const ClubMembers = () => {
  const { clubId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/clubs/${clubId}/members`);
        console.log("Fetched members:", res.data);
        setMembers(res.data || []);
      } catch (err) {
        setError('Failed to fetch club members');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [clubId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-800 relative">
      <Navbar />
      <div className="container mx-auto px-4 py-10 pt-28 relative z-10 min-h-[calc(100vh-80px)] flex flex-1 items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="mb-8 text-left">
            <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Club Members
            </h1>
            <div className="bg-gray-900/60 backdrop-blur-lg shadow-xl rounded-md p-8">
              <div className="overflow-x-auto">
                <table className="w-full border border-indigo-700 rounded-md shadow bg-gray-900 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <thead>
                    <tr className="bg-indigo-900/60">
                      <th className="p-3 text-left text-indigo-200 font-semibold">Name</th>
                      <th className="p-3 text-left text-indigo-200 font-semibold">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length > 0 ? members.map((member) => (
                      <tr key={member._id} className="border-t border-indigo-800 hover:bg-indigo-900/30 transition-all duration-200">
                        <td className="p-3">{member.username}</td>
                        <td className="p-3">{member.role}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="2" className="p-3 text-center text-gray-400">No members found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClubMembers; 