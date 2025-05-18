
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-football-dark to-football-darker">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to matches
          </Link>
        </div>
        
        <div className="glass p-8 rounded-lg max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-3xl font-bold mb-6 text-football-orange">About LiveScore</h1>
          
          <p className="mb-4 text-lg">
            Welcome to LiveScore, your ultimate destination for real-time football updates, comprehensive statistics, and detailed match information across all major leagues and competitions worldwide.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4 text-football-blue">Our Mission</h2>
          <p className="mb-4">
            Our mission is to provide football fans with the most accurate, up-to-date information on matches happening around the globe. Whether you're tracking Premier League fixtures, checking Champions League scores, or following your local team, LiveScore has you covered with instantaneous updates.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4 text-football-blue">Features</h2>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>Live match updates with minute-by-minute progress</li>
            <li>Comprehensive match statistics including possession, shots, and cards</li>
            <li>Detailed lineups and substitutions</li>
            <li>Goal scorers and match events timeline</li>
            <li>Coverage of all major leagues and competitions</li>
            <li>User-friendly search and filter functionality</li>
          </ul>
          
          <h2 className="text-xl font-bold mt-8 mb-4 text-football-blue">Data Source</h2>
          <p>
            All match data is provided by API-Football, one of the most reliable and comprehensive sports data providers in the industry. This ensures that you receive accurate and timely information for all matches.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
