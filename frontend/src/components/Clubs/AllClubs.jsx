import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Users, Heart, X } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';

const categories = [
  'All',
  'Arts',
  'Technology',
  'Environment',
  'Academic',
  'Sports',
];

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

const typewriterTexts = [
  'Discover Clubs',
  'Find Your Community',
  'Join. Connect. Grow.',
];

const useTypewriter = (texts, speed = 80, pause = 1200) => {
  const [displayed, setDisplayed] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const timeoutRef = useRef();

  useEffect(() => {
    if (charIdx < texts[textIdx].length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed((prev) => prev + texts[textIdx][charIdx]);
        setCharIdx((idx) => idx + 1);
      }, speed);
    } else {
      timeoutRef.current = setTimeout(() => {
        setDisplayed('');
        setCharIdx(0);
        setTextIdx((idx) => (idx + 1) % texts.length);
      }, pause);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [charIdx, textIdx, texts, speed, pause]);

  return displayed;
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
    // eslint-disable-next-line
  }, [count]);
  return <span>{display}</span>;
};

const AllClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(() => {
    // Optionally persist favorites in localStorage
    const fav = localStorage.getItem('clubFavorites');
    return fav ? JSON.parse(fav) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const navigate = useNavigate();
  const typewriter = useTypewriter(typewriterTexts);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    localStorage.setItem('clubFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/clubs');
        setClubs(res.data || []);
      } catch (err) {
        setError('Failed to fetch clubs');
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      (club.description && club.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    const matchesFavorite = !showOnlyFavorites || favorites.includes(club._id);
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  if (loading) return <div className="flex justify-center items-center h-40 text-white">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  const toggleFavorite = (clubId) => {
    setFavorites((prev) =>
      prev.includes(clubId)
        ? prev.filter((id) => id !== clubId)
        : [...prev, clubId]
    );
  };

  return (
    <div className={
      isDarkMode
        ? 'min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-800 relative'
        : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 relative'
    }>
      <Navbar />
      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-16">
          <h1 className={
            isDarkMode
              ? 'text-5xl md:text-7xl font-extrabold text-white mb-4 h-20 flex items-center justify-center'
              : 'text-5xl md:text-7xl font-extrabold text-gray-900 mb-4 h-20 flex items-center justify-center'
          }>
            <span className="pr-2">{typewriter}</span>
          </h1>
          <p className={
            isDarkMode
              ? 'text-lg text-gray-300 mb-8 max-w-2xl mx-auto'
              : 'text-lg text-gray-600 mb-8 max-w-2xl mx-auto'
          }>
            Join amazing communities, make lifelong friends, and pursue your passions.
          </p>
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
            <Input
              type="text"
              placeholder="Search clubs by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={
                isDarkMode
                  ? 'md:w-1/2 bg-gray-900/70 border-gray-700 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl backdrop-blur-sm'
                  : 'md:w-1/2 bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl backdrop-blur-sm'
              }
            />
            <Button
              onClick={() => navigate('/clubs/add')}
              className={
                isDarkMode
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full px-6 py-3 shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 border-none'
                  : 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold rounded-full px-6 py-3 shadow-lg hover:scale-105 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 border-none'
              }
            >
              + Add Club
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold border-2 transition-all duration-200 ${
                  selectedCategory === category
                    ? isDarkMode
                      ? 'bg-indigo-700 border-indigo-400 text-white shadow'
                      : 'bg-indigo-200 border-indigo-400 text-indigo-900 shadow'
                    : isDarkMode
                    ? 'bg-gray-900/60 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-indigo-400'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-indigo-700 hover:border-indigo-400'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setShowOnlyFavorites((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
              showOnlyFavorites
                ? isDarkMode
                  ? 'bg-pink-600 text-white'
                  : 'bg-pink-200 text-pink-900'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Heart className={`h-5 w-5 ${
              showOnlyFavorites
                ? isDarkMode
                  ? 'fill-pink-500 text-pink-200'
                  : 'fill-pink-400 text-pink-700'
                : isDarkMode
                ? 'text-gray-400'
                : 'text-gray-500'
            }`} />
            {showOnlyFavorites ? 'Show All Clubs' : 'Show Favorites'}
          </Button>
        </div>
        {/* Results Count */}
        <div className="text-center mb-8">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Found {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>
        {/* Clubs Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.length > 0 ? (
            filteredClubs.map((club, idx) => (
              <div key={club._id} className="relative group fade-in h-full">
                <Card className={`flex flex-col justify-between h-full ${isDarkMode ? 'bg-gray-900/60' : 'bg-white'} backdrop-blur-lg shadow-xl rounded-md transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:-translate-y-2 cursor-pointer overflow-hidden p-6 min-h-[270px]'`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className={isDarkMode ? 'text-2xl font-bold text-gray-100 group-hover:text-indigo-300 transition' : 'text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition'}>
                        {club.name}
                      </h2>
                      {club.category && (
                        <Badge color={getCategoryColor(club.category)} className="transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                          {club.category}
                        </Badge>
                      )}
                    </div>
                    <p className={isDarkMode ? 'text-gray-300 line-clamp-3 mb-4 min-h-[48px]' : 'text-gray-700 line-clamp-3 mb-4 min-h-[48px]'}>{club.description}</p>
                    <div className={isDarkMode ? 'flex items-center gap-2 text-sm text-gray-400 mb-2' : 'flex items-center gap-2 text-sm text-gray-600 mb-2'}>
                      <Users className="h-4 w-4" />
                      <AnimatedMemberCount count={club.members ? club.members.length : 0} /> members
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex gap-2">
                      <Button
                        className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 border transition-all duration-200
                          ${favorites.includes(club._id)
                            ? isDarkMode
                              ? 'border-pink-400 bg-pink-900/20 text-pink-200 hover:bg-pink-900/40'
                              : 'border-pink-500 bg-pink-50 text-pink-700 hover:bg-pink-100'
                            : isDarkMode
                            ? 'border-gray-700 bg-gray-900/40 text-gray-300 hover:bg-gray-800'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleFavorite(club._id)}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(club._id)
                          ? isDarkMode ? 'fill-pink-400 text-pink-200' : 'fill-pink-500 text-pink-700'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}/>
                        {favorites.includes(club._id) ? 'Favorited' : 'Favorite'}
                      </Button>
                    </div>
                    <Link
                      to={`/clubs/${club._id}`}
                      className="block mt-2"
                    >
                      <span className={isDarkMode ? 'text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors' : 'text-indigo-700 font-medium group-hover:text-indigo-500 transition-colors'}>
                        View Club →
                      </span>
                    </Link>
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No clubs found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                className="bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-indigo-500/50"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
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

export default AllClubs; 