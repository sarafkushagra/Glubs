import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "./Header";
import Breadcrumb from "./Breadcrumb";
import ClubBanner from "./clubDetail/clubBanner";
import AboutSection from "./clubDetail/AboutSection";
import UpcomingEvents from "./clubDetail/UpcomingEvents";
import PastEvents from "./clubDetail/PastEvents";
import Achievements from "./clubDetail/Achievements";
import Testimonials from "./clubDetail/Testimonials";
import StayConnected from "./clubDetail/StayConnected";
import Footer from "./shared/Footer";

const ClubDetailPage = () => {
  const { id } = useParams();
  
  // Mock data - in a real app, this would come from an API
  const club = {
    id: 1,
    name: "AI & Machine Learning Club",
    logo: "🤖",
    tagline: "Exploring the Future with AI and Machine Learning",
    description: "Our AI & Machine Learning Club is dedicated to fostering innovation and learning in the rapidly evolving field of artificial intelligence. We organize workshops, hackathons, and research sessions to help students stay at the forefront of AI technology. Whether you're a beginner or an expert, our community welcomes all levels of experience.",
    department: "Computer Science & Engineering",
    founded: "2019",
    coordinator: "Dr. Sarah Johnson",
    members: 450,
    email: "aiclub@university.edu",
    instagram: "@aiclub_uni",
    linkedin: "ai-club-university",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800",
    achievements: [
      "20+ Events Organized",
      "1200+ Participants",
      "10 Inter-College Hackathons",
      "5 Research Papers Published"
    ]
  };

  const upcomingEvents = [
    {
      id: 1,
      title: "Introduction to Neural Networks",
      date: "July 25, 2024",
      deadline: "July 23, 2024",
      description: "Learn the fundamentals of neural networks and deep learning"
    },
    {
      id: 2,
      title: "AI Ethics Workshop",
      date: "August 5, 2024",
      deadline: "August 3, 2024",
      description: "Exploring ethical considerations in AI development"
    },
    {
      id: 3,
      title: "Computer Vision Hackathon",
      date: "August 15, 2024",
      deadline: "August 10, 2024",
      description: "24-hour hackathon focused on computer vision applications"
    }
  ];

  const pastEvents = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300"
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      rating: 5,
      comment: "Great sessions & hands-on experience! The workshops are incredibly well-structured."
    },
    {
      name: "Maria Rodriguez",
      rating: 4,
      comment: "Loved the last hackathon! Amazing networking opportunities and learning experience."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: "Clubs", href: "/" },
          { label: club.name }
        ]} />

        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clubs
        </Link>

        <ClubBanner club={club} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AboutSection club={club} />
            <UpcomingEvents events={upcomingEvents} />
            <PastEvents images={pastEvents} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Achievements achievements={club.achievements} />
            <Testimonials testimonials={testimonials} />
            <StayConnected />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClubDetailPage;