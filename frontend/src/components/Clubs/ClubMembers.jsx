import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ClubNavbar from './ClubNavbar';
import Footer from '../Pages/Footer';

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
    <>
    <ClubNavbar/>
    <div className="max-w-5xl mt-30 mb-10 h-screen mx-auto p-8 bg-purple-50 rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Club Members</h1>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl shadow">
          <thead>
            <tr className="bg-purple-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Position</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? members.map((member) => (
              <tr key={member._id} className="border-t hover:bg-purple-50">
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
    <Footer/>
    </>
  );
};

export default ClubMembers; 