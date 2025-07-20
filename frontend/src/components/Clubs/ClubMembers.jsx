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
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-5xl pt-30 pb-10 mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-10">
          <h1 className="text-2xl font-extrabold mb-8 text-indigo-700">Club Members</h1>
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl shadow bg-white">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="p-3 text-left text-indigo-700">Name</th>
                  <th className="p-3 text-left text-indigo-700">Position</th>
                </tr>
              </thead>
              <tbody>
                {members.length > 0 ? members.map((member) => (
                  <tr key={member._id} className="border-t hover:bg-indigo-50 transition-all duration-200">
                    <td className="p-3">{member.username}</td>
                    <td className="p-3">{member.role}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="2" className="p-3 text-center text-gray-500">No members found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClubMembers; 