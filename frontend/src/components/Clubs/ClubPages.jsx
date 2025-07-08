import { useState } from "react";
import Header from "./Header";
import SearchAndFilter from "./clubs/SearchAndFilter";
import PageHeader from "./clubs/PageHeader";
import ClubGrid from "./clubs/ClubGrid";
import NoResults from "./clubs/NoResults";
import BenefitsSection from "./clubs/BenefitsSection";
import Footer from "./shared/Footer";

const ClubsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Mock data for clubs
  const clubs = [
    {
      id: 1,
      name: "Photography Club",
      logo: "📸",
      tagline: "Capture moments, create memories",
      department: "Arts",
      members: 120,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Coding Society",
      logo: "💻",
      tagline: "Learn, code, and innovate together",
      department: "Technology",
      members: 200,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Drama Club",
      logo: "🎭",
      tagline: "Express yourself through theater",
      department: "Arts",
      members: 85,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Debate Society",
      logo: "🗣",
      tagline: "Sharpen your argumentation skills",
      department: "Academic",
      members: 150,
      image: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Music Band",
      logo: "🎵",
      tagline: "Create harmony, share melodies",
      department: "Arts",
      members: 75,
      image: "/placeholder.svg"
    },
    {
      id: 6,
      name: "Sports Club",
      logo: "⚽",
      tagline: "Stay fit, play together",
      department: "Sports",
      members: 300,
      image: "/placeholder.svg"
    },
  ];

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || club.department.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "Arts", "Technology", "Academic", "Sports"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader />
        
        <SearchAndFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {filteredClubs.length > 0 ? (
          <ClubGrid clubs={filteredClubs} />
        ) : (
          <NoResults />
        )}

        <BenefitsSection />
      </div>

      <Footer />
    </div>
  );
};

export default ClubsPage;