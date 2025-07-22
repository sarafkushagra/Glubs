import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Users } from 'lucide-react';

const getCategoryColor = (category) => {
  const colors = {
    Arts: 'blue',
    Technology: 'green',
    Environment: 'green',
    Academic: 'yellow',
    Sports: 'red',
  };
  return colors[category] || 'gray';
};

const AnimatedMemberCount = ({ count }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = () => {
      if (start < count) {
        start += Math.ceil(count / 20);
        if (start > count) start = count;
        setDisplay(start);
        setTimeout(step, 20);
      } else {
        setDisplay(count);
      }
    };
    step();
  }, [count]);
  return <span>{display}</span>;
};

const ClubDetails = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/clubs/${clubId}`);
        setClub(res.data);
        setEvents(res.data.events || []);
      } catch (err) {
        setError('Failed to fetch club details');
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [clubId]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/clubs/${clubId}/events`);
        setEvents(res.data || []);
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [clubId]);

  if (loading) return <div className="flex justify-center items-center h-40 text-white">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!club) return <div className="text-center text-gray-400">Club not found.</div>;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      const res = await axios.delete(`http://localhost:3000/clubs/${clubId}`);
      if (res.status === 200) {
        navigate('/clubs');
      } else {
        alert('Failed to delete club.');
      }
    } catch (err) {
      alert('Error deleting club.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-800 relative">
      <Navbar />
      <div className="container mx-auto px-4 py-10 pt-28 relative z-10 min-h-[calc(100vh-80px)] flex flex-col">
        <div className="mb-10">
          <div className="mb-8 text-left">
            <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>{club.name}</h1>
            {club.category && (
              <Badge color={getCategoryColor(club.category)} className="mb-2">
                {club.category}
              </Badge>
            )}
            <p className="mb-6 text-gray-300 italic text-lg">{club.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Users className="h-4 w-4" />
              <AnimatedMemberCount count={club.members ? club.members.length : 0} /> members
            </div>
            <div className="flex gap-4 flex-wrap mt-4 mb-2 items-center">
              <Button onClick={() => navigate(`/clubs/edit/${club._id}`)} className="border border-indigo-400 text-indigo-200 bg-transparent rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-indigo-900/30 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                Edit Club
              </Button>
              <Button onClick={() => navigate(`/clubs/${club._id}/members`)} className="border border-indigo-400 text-indigo-200 bg-transparent rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-indigo-900/30 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                View Members
              </Button>
              <span className="mx-2 hidden md:inline-block h-6 border-l border-gray-700"></span>
              <Button onClick={() => setShowDeleteModal(true)} className="border border-red-400 text-red-200 bg-transparent rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-red-900/30 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 ml-0 md:ml-8">
                Delete Club
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-indigo-100 my-10"></div>
        <h2 className="text-2xl font-bold mb-6 text-indigo-200">Events Organized by {club.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {events.length > 0 ? events.map((event, idx) => (
            <Link to={`/events/${event._id}`} key={event._id} className="block group fade-in w-full" style={{ animationDelay: `${idx * 80}ms` }}>
              <Card className="bg-gray-900/60 backdrop-blur-lg shadow-xl rounded-md p-7 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group-hover:-translate-y-2 w-full">
                <h3 className="text-xl font-bold mb-1 text-white group-hover:text-indigo-300 transition">{event.title}</h3>
                <p className="text-gray-300 line-clamp-2">{event.description}</p>
                <div className="text-sm text-gray-400 mt-2">{event.date ? new Date(event.date).toLocaleString() : ''}</div>
                <span className="inline-block mt-2 text-xs text-indigo-400 font-semibold group-hover:underline">View Event →</span>
              </Card>
            </Link>
          )) : <div className="col-span-2 text-center text-gray-500">No events found for this club.</div>}
        </div>
      </div>
      <Footer />
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900/90 rounded-lg shadow-2xl p-8 max-w-md w-full relative animate-fade-in flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-4">Delete Club</h3>
            <p className="text-gray-300 mb-2 text-center">Are you sure you want to delete this club? Please provide a reason for deletion.</p>
            <textarea
              className="w-full min-h-[80px] rounded-md p-2 bg-gray-800 text-gray-100 border border-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Reason for deletion..."
              value={deleteReason}
              onChange={e => setDeleteReason(e.target.value)}
              disabled={deleting}
            />
            <div className="flex gap-4 mt-2">
              <Button
                onClick={async () => {
                  if (!deleteReason.trim()) {
                    alert('Reason is required.');
                    return;
                  }
                  setDeleting(true);
                  try {
                    const res = await axios.delete(`http://localhost:3000/clubs/${clubId}`);
                    if (res.status === 200) {
                      setShowDeleteModal(false);
                      navigate('/clubs');
                    } else {
                      alert('Failed to delete club.');
                    }
                  } catch (err) {
                    alert('Error deleting club.');
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="border border-red-400 text-red-200 bg-red-700/80 rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-red-900/80 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
              <Button
                onClick={() => { setShowDeleteModal(false); setDeleteReason(''); }}
                className="border border-gray-400 text-gray-200 bg-gray-800/80 rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-gray-700/80 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          </div>
          <style>{`
            .animate-fade-in { animation: fadeIn 0.3s; }
          `}</style>
        </div>
      )}
      <style>{`
.fade-in {
  opacity: 0;
  animation: fadeIn 0.7s forwards;
}
@keyframes fadeIn {
  to { opacity: 1; }
}
`}</style>
    </div>
  );
};

export default ClubDetails; 