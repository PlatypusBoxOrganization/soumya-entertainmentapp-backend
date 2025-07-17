import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  StarIcon as StarIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  PlayIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid';
import { 
  StarIcon,
  BookmarkIcon,
  FilmIcon,
  TvIcon,
  FireIcon,
  ClockIcon as ClockIconOutline,
  ArrowPathIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

const popularMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster: "https://images.unsplash.com/photo-1631030177789-70d9ec9f4f9d?w=1920",
    backdrop: "https://images.unsplash.com/photo-1631030177789-70d9ec9f4f9d?w=1920",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    year: 1994,
    rating: 9.3,
    duration: "2h 22m",
    genre: ["Drama", "Crime"],
    isBookmarked: false
  },
  {
    id: 2,
    title: "The Godfather",
    poster: "https://images.unsplash.com/photo-1542744095-6f7000181543?w=1920",
    backdrop: "https://images.unsplash.com/photo-1542744095-6f7000181543?w=1920",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    year: 1972,
    rating: 9.2,
    duration: "2h 55m",
    genre: ["Crime", "Drama"],
    isBookmarked: false
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster: "https://images.unsplash.com/photo-1516455590591-eac8102c6b44?w=1920",
    backdrop: "https://images.unsplash.com/photo-1516455590591-eac8102c6b44?w=1920",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    year: 2008,
    rating: 9.0,
    duration: "2h 32m",
    genre: ["Action", "Crime", "Drama"],
    isBookmarked: true
  },
  {
    id: 4,
    title: "Inception",
    poster: "https://images.unsplash.com/photo-1604382355076-af4b4a8e5f20?w=1920",
    backdrop: "https://images.unsplash.com/photo-1604382355076-af4b4a8e5f20?w=1920",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    year: 2010,
    rating: 8.8,
    duration: "2h 28m",
    genre: ["Action", "Adventure", "Sci-Fi"],
    isBookmarked: false
  }
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Auto-rotate featured movies
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % popularMovies.length);
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + popularMovies.length) % popularMovies.length);
      setIsTransitioning(false);
    }, 500);
  };

  const currentMovie = popularMovies[currentIndex];
  const features = [
    {
      title: "Unlimited Entertainment",
      description: "Access thousands of movies and TV shows from around the world.",
      icon: <FilmIcon className="w-6 h-6 text-white" />
    },
    {
      title: "Watch Anywhere",
      description: "Stream on your phone, tablet, laptop, and TV without paying more.",
      icon: <DevicePhoneMobileIcon className="w-6 h-6 text-white" />
    },
    {
      title: "Create Profiles",
      description: "Create up to 5 profiles for different members of your family.",
      icon: <UserGroupIcon className="w-6 h-6 text-white" />
    },
    {
      title: "Download & Watch",
      description: "Download your shows to watch them offline and save your data.",
      icon: <ArrowPathIcon className="w-6 h-6 text-white" />
    },
    {
      title: "No Ads",
      description: "Enjoy your favorite content without any interruptions.",
      icon: <BellAlertIcon className="w-6 h-6 text-white" />
    },
    {
      title: "New Content Weekly",
      description: "Fresh movies and TV shows added every week.",
      icon: <FireIcon className="w-6 h-6 text-white" />
    }
  ];

  // State for trending movies and loading states
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch trending content on component mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/trending');
        // const data = await response.json();
        // setTrendingMovies(data);
        
        // Mock data for now
        const movies = [
          {
            id: 1,
            title: "Inception",
            poster_path: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
            vote_average: 8.8,
            release_date: "2010-07-15",
            genre_ids: [28, 878, 12],
            overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            isBookmarked: false
          },
          {
            id: 2,
            title: "The Matrix",
            poster_path: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            vote_average: 8.7,
            release_date: "1999-03-30",
            genre_ids: [28, 878],
            overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
            isBookmarked: true
          },
          {
            id: 3,
            title: "Interstellar",
            poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            vote_average: 8.5,
            release_date: "2014-11-05",
            genre_ids: [12, 18, 878],
            overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
            isBookmarked: false
          },
          {
            id: 4,
            title: "The Dark Knight",
            poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            vote_average: 9.0,
            release_date: "2008-07-16",
            genre_ids: [28, 80, 18],
            overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
            isBookmarked: true
          }
        ];
        
        setTrendingMovies(movies);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching trending content:', error);
        setError('Failed to load trending content');
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // Handle search suggestions
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      // In a real app, you would fetch suggestions from your API
      // const response = await fetch(`/api/search/suggestions?q=${query}`);
      // const data = await response.json();
      // setSearchSuggestions(data);
      
      // Mock suggestions for now
      const suggestions = [
        { id: 1, title: "Inception", type: "movie", poster_path: "https://image.tmdb.org/t/p/w200/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg" },
        { id: 2, title: "The Matrix", type: "movie", poster_path: "https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" },
        { id: 3, title: "Interstellar", type: "movie", poster_path: "https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
        { id: 4, title: "The Dark Knight", type: "movie", poster_path: "https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg" }
      ].filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Toggle bookmark status
  const toggleBookmark = (movieId) => {
    // In a real app, you would update this on the server
    const updatedMovies = popularMovies.map(movie => 
      movie.id === movieId 
        ? { ...movie, isBookmarked: !movie.isBookmarked } 
        : movie
    );
    // Update local state or make API call to update bookmarks
    console.log(`Toggled bookmark for movie ${movieId}`);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-screen max-h-[800px] overflow-hidden">
        {/* Background Image with Overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(9, 9, 11, 0.9) 0%, rgba(9, 9, 11, 0.7) 100%), url(${currentMovie.backdrop || currentMovie.poster})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/70 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-2 mb-4"
              >
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm font-medium rounded-full">
                  {currentMovie.year}
                </span>
                <span className="text-zinc-400">•</span>
                <div className="flex items-center text-amber-400">
                  <StarIconSolid className="w-5 h-5 mr-1" />
                  <span>{currentMovie.rating.toFixed(1)}</span>
                </div>
                <span className="text-zinc-400">•</span>
                <div className="flex items-center text-zinc-400">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{currentMovie.duration}</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
              >
                {currentMovie.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {currentMovie.genre.map((genre, idx) => (
                  <span key={idx} className="px-3 py-1 bg-zinc-800/50 text-zinc-300 text-sm rounded-full">
                    {genre}
                  </span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-lg text-zinc-300 mb-8 line-clamp-3"
              >
                {currentMovie.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center space-x-4"
              >
                <button
                  onClick={() => navigate(`/watch/${currentMovie.id}`)}
                  className="flex items-center justify-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors duration-200 shadow-lg shadow-indigo-500/20"
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Watch Now
                </button>
                <button
                  onClick={() => toggleBookmark(currentMovie.id)}
                  className="flex items-center justify-center px-4 py-3 bg-zinc-800/50 hover:bg-zinc-700/50 text-white rounded-full font-medium transition-colors duration-200 backdrop-blur-sm"
                >
                  {currentMovie.isBookmarked ? (
                    <BookmarkIconSolid className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <BookmarkIcon className="w-5 h-5" />
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4 z-10">
          <button
            onClick={handlePrev}
            className="p-2 bg-zinc-800/50 hover:bg-zinc-700/70 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronDownIcon className="w-6 h-6 transform rotate-90" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-zinc-800/50 hover:bg-zinc-700/70 rounded-full text-white transition-colors duration-200 backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronDownIcon className="w-6 h-6 transform -rotate-90" />
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative z-20 -mt-20 mb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="relative"
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-zinc-800/80 backdrop-blur-sm rounded-xl p-1 shadow-2xl border border-zinc-700/50">
                <div className="pl-4 pr-2">
                  <MagnifyingGlassIcon className="w-5 h-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for movies, TV shows..."
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-zinc-400 py-4 text-lg"
                />
                <button
                  type="submit"
                  className="ml-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20"
                >
                  <span>Search</span>
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>

            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-zinc-800/95 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-zinc-700/50 z-50">
                {searchSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center p-3 hover:bg-zinc-700/50 cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      navigate(`/${suggestion.type === 'movie' ? 'movie' : 'tv'}/${suggestion.id}`);
                    }}
                  >
                    <div className="w-12 h-16 bg-zinc-700 rounded-lg overflow-hidden flex-shrink-0">
                      {suggestion.poster_path && (
                        <img
                          src={suggestion.poster_path}
                          alt={suggestion.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-white font-medium">{suggestion.title}</h4>
                      <div className="flex items-center text-xs text-zinc-400 mt-1">
                        <span className="capitalize">{suggestion.type}</span>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <StarIcon className="w-3 h-3 text-amber-400 mr-1" />
                          <span>{suggestion.vote_average?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Action', icon: <FilmIcon className="w-6 h-6" />, count: 128 },
            { name: 'Comedy', icon: <FilmIcon className="w-6 h-6" />, count: 92 },
            { name: 'Drama', icon: <FilmIcon className="w-6 h-6" />, count: 85 },
            { name: 'Thriller', icon: <FilmIcon className="w-6 h-6" />, count: 64 },
            { name: 'Horror', icon: <FilmIcon className="w-6 h-6" />, count: 47 },
            { name: 'Sci-Fi', icon: <FilmIcon className="w-6 h-6" />, count: 73 },
          ].map((category, index) => (
            <motion.button
              key={category.name}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-zinc-800/50 hover:bg-zinc-800/80 rounded-xl p-4 text-center transition-all duration-300 group"
              onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
            >
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/20 transition-colors duration-300">
                {category.icon}
              </div>
              <h3 className="text-white font-medium">{category.name}</h3>
              <p className="text-xs text-zinc-400 mt-1">{category.count} titles</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Interactive Features Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-zinc-800/50 p-6 rounded-xl hover:bg-zinc-800/80 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 border border-zinc-700/50"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Trending Now</h2>
          <button 
            onClick={() => navigate('/trending')}
            className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm"
          >
            View All
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ArrowPathIcon className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-sm font-medium transition-colors duration-200 flex items-center mx-auto"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {trendingMovies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-xl bg-zinc-800/50 hover:bg-zinc-800/80 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <div className="aspect-[2/3] w-full overflow-hidden">
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center bg-black/60 px-2 py-1 rounded-full">
                          <StarIconSolid className="w-4 h-4 text-amber-400 mr-1" />
                          <span className="text-xs font-medium">{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedMovies = trendingMovies.map(m => 
                              m.id === movie.id ? { ...m, isBookmarked: !m.isBookmarked } : m
                            );
                            setTrendingMovies(updatedMovies);
                          }}
                          className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors duration-200"
                        >
                          {movie.isBookmarked ? (
                            <BookmarkIconSolid className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <BookmarkIcon className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/watch/${movie.id}`);
                        }}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center justify-center transition-colors duration-200"
                      >
                        <PlayIcon className="w-3 h-3 mr-1.5" />
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium text-sm md:text-base line-clamp-1">{movie.title}</h3>
                  <div className="flex items-center mt-1 text-xs text-zinc-400">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span className="mx-1.5">•</span>
                    <span className="capitalize">Movie</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;