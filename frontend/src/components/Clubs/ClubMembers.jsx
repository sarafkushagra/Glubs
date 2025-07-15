import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClubMembers = () => {
  const { clubId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/clubs/${clubId}/members`);
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
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-green-700">Club Members</h1>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl shadow">
          <thead>
            <tr className="bg-green-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Position</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? members.map((member) => (
              <tr key={member._id} className="border-t hover:bg-green-50">
                <td className="p-3">{member.name}</td>
                <td className="p-3">{member.position}</td>
              </tr>
            )) : (
              <tr><td colSpan="2" className="p-3 text-center text-gray-500">No members found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubMembers; 