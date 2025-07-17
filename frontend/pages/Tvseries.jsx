import React, { useState, useEffect } from "react";
import { FaRegBookmark, FaBookmark, FaPlay, FaSearch, FaSpinner, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../utility/constant";
import { addTvSeriesBookmark, removeTvSeriesBookmark, setTVSeries } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

const TVSeries = () => {
  const [tvSeriesList, setTvSeriesList] = useState([]);
  const [filteredTvSeries, setFilteredTvSeries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bookmarkedTvSeries = useSelector((state) => state.netflix.bookmarkedTvSeries);

  const fetchTVSeries = async () => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=thewdb&s=batman&type=series`);
      const data = await response.json();
      let tvSeries = [];
      if (data.Response === "True" && data.Search) {
        tvSeries = data.Search.map((show) => ({
          id: show.imdbID,
          title: show.Title,
          name: show.Title,
          poster_path: show.Poster !== "N/A" ? show.Poster : "https://via.placeholder.com/200x300",
          vote_average: Math.floor(Math.random() * 5) + 5,
          overview: show.Type === "series" ? "TV Series" : "Movie",
          type: "tv",
        }));
      }
      setTvSeriesList(tvSeries);
      setFilteredTvSeries(tvSeries);
      dispatch(setTVSeries(tvSeries));
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch TV series list");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVSeries();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = tvSeriesList.filter((tvSeries) =>
      tvSeries.title.toLowerCase().includes(query)
    );
    setFilteredTvSeries(filtered);
  };

  const handleTvSeriesClick = (tvSeries) => {
    navigate(`/TvSeries/${tvSeries.id}`);
  };

  const handleBookmark = (tvSeries, e) => {
    e.stopPropagation();
    
    const isAuthenticated = !!localStorage.getItem('token');
    
    if (!isAuthenticated) {
      // Store the current path for redirect after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      toast.error((t) => (
        <div className="flex flex-col items-center gap-2">
          <span>Please login to save bookmarks</span>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => {
                toast.dismiss(t.id);
                navigate('/login');
              }}
              className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
            >
              Login
            </button>
            <button 
              onClick={() => {
                toast.dismiss(t.id);
                navigate('/signup');
              }}
              className="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-md text-white"
            >
              Sign Up
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'bottom-center',
        style: {
          background: '#1f2937',
          color: '#f3f4f6',
          padding: '1rem',
          borderRadius: '0.5rem',
          maxWidth: '24rem',
          width: '90%',
          margin: '0 auto 1rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }
      });
      
      return;
    }
    
    if (bookmarkedTvSeries.some((b) => b.id === tvSeries.id)) {
      dispatch(removeTvSeriesBookmark(tvSeries.id));
      toast.success('Removed from bookmarks', {
        position: 'bottom-center',
        duration: 2000,
      });
    } else {
      dispatch(addTvSeriesBookmark(tvSeries));
      toast.success('Added to bookmarks', {
        position: 'bottom-center',
        duration: 2000,
      });
    }
  };

  if (loading) {
    return <div>Loading TV series...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="content p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">TV Series</h1>
          <button 
            onClick={() => handleSearch({ target: { value: searchQuery } })}
            className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-white rounded-lg transition-colors duration-200"
          >
            <FaSearch className="w-5 h-5 inline-block mr-2" />
            Search
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={(e) => e.preventDefault()} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search TV series..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-zinc-800/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
          </div>
        </form>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin text-indigo-500">
              <FaSpinner className="w-8 h-8" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {filteredTvSeries.map((tvSeries) => (
              <motion.div 
                key={tvSeries.id}
                className="group relative bg-zinc-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => handleTvSeriesClick(tvSeries)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={tvSeries.poster_path}
                    alt={tvSeries.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="w-full">
                      <button 
                        className="w-full mb-2 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle play button click
                        }}
                      >
                        <FaPlay size={10} /> Watch Now
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(tvSeries, e);
                      }}
                      className="p-1.5 rounded-full bg-black/70 hover:bg-black/90 transition-colors"
                    >
                      {bookmarkedTvSeries.some((b) => b.id === tvSeries.id) ? (
                        <FaBookmark className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <FaRegBookmark className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-white truncate">{tvSeries.title || tvSeries.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-zinc-400">
                      {tvSeries.first_air_date ? new Date(tvSeries.first_air_date).getFullYear() : 'N/A'}
                    </span>
                    <div className="flex items-center text-xs bg-zinc-700/50 px-1.5 py-0.5 rounded">
                      <FaStar className="text-yellow-400 mr-1" size={10} />
                      <span className="text-white">
                        {tvSeries.vote_average ? tvSeries.vote_average.toFixed(1) : 'N/A'}
                      </span>
                    </div>
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

export default TVSeries;
