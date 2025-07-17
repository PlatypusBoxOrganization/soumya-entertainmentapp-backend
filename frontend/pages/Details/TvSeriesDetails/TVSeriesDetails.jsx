import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBookmark, FaPlay, FaStar, FaClock, FaCalendar, FaSignInAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addTvSeriesBookmark, removeTvSeriesBookmark } from '../../../store/store';
import { toast } from 'react-hot-toast';

const TVSeriesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tvSeries, setTVSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const bookmarkedTvSeries = useSelector((state) => state.netflix.bookmarkedTvSeries || []);
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchTVSeriesDetails = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=thewdb&i=${id}&type=series`);
        const data = await response.json();
        
        if (data.Response === "True") {
          const formattedTVSeries = {
            id: data.imdbID,
            title: data.Title,
            name: data.Title,
            poster_path: data.Poster !== "N/A" ? data.Poster : null,
            vote_average: data.imdbRating,
            overview: data.Plot,
            type: 'tv',
            ...data
          };
          setTVSeries(formattedTVSeries);
          
          // Check if TV series is bookmarked
          const isInBookmarks = bookmarkedTvSeries.some(bm => bm.id === formattedTVSeries.id);
          setIsBookmarked(isInBookmarks);
        } else {
          setError(data.Error);
        }
      } catch (err) {
        setError('Failed to fetch TV series details');
      } finally {
        setLoading(false);
      }
    };

    fetchTVSeriesDetails();
  }, [id, bookmarkedTvSeries]);
  
  const handleBookmark = (e) => {
    e.stopPropagation();
    
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
              <FaSignInAlt className="inline mr-1" /> Login
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
    
    if (isBookmarked) {
      dispatch(removeTvSeriesBookmark(tvSeries.id));
      setIsBookmarked(false);
      toast.success('Removed from bookmarks', {
        position: 'bottom-center',
        duration: 2000,
      });
    } else {
      dispatch(addTvSeriesBookmark(tvSeries));
      setIsBookmarked(true);
      toast.success('Added to bookmarks', {
        position: 'bottom-center',
        duration: 2000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500/20"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-slate-900">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!tvSeries) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-zinc-800/90 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* TV Series Poster */}
            <div className="w-full md:w-1/3 relative">
              <div className="aspect-video bg-zinc-700 rounded-xl overflow-hidden">
                <img 
                  src={tvSeries.Poster === "N/A" ? "https://via.placeholder.com/300x450" : tvSeries.Poster} 
                  alt={tvSeries.Title}
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 flex gap-3">
                    <button className="p-3 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-full transition-colors">
                      <FaPlay className="w-6 h-6 text-white" />
                    </button>
                    <button 
                      onClick={handleBookmark}
                      className={`p-3 rounded-full transition-colors ${isBookmarked ? 'text-yellow-400 bg-yellow-500/20 hover:bg-yellow-500/30' : 'bg-zinc-800/50 hover:bg-zinc-800/70'}`}
                    >
                      <FaBookmark className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* TV Series Info */}
            <div className="w-full md:w-2/3 space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white">{tvSeries.Title}</h1>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span className="text-2xl font-semibold text-indigo-500">{tvSeries.imdbRating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <FaCalendar />
                    <span>{tvSeries.Year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <FaClock />
                    <span>{tvSeries.Runtime}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Genres</h3>
                <div className="flex flex-wrap gap-3">
                  {tvSeries.Genre.split(', ').map((genre, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-full text-zinc-400 text-sm font-medium transition-colors"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Plot</h3>
                <p className="text-zinc-400 leading-relaxed">{tvSeries.Plot}</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Seasons</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-zinc-400">Total Seasons: {tvSeries.totalSeasons}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-zinc-400">Status: {tvSeries.Status}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 flex items-center justify-center gap-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl py-4 transition-colors">
                  <FaPlay className="w-6 h-6" />
                  Watch Now
                </button>
                <button 
                  onClick={handleBookmark}
                  className={`flex-1 flex items-center justify-center gap-4 font-medium rounded-xl py-4 transition-colors ${isBookmarked ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-zinc-800/50 hover:bg-zinc-800/70 text-zinc-400'}`}
                >
                  <FaBookmark className="w-6 h-6" />
                  {isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVSeriesDetails;
