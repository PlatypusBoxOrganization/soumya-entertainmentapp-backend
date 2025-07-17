import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FaBookmark, 
  FaSearch, 
  FaTimes, 
  FaStar, 
  FaPlay,
  FaFilm,
  FaTv,
  FaSignInAlt,
  FaHeart
} from "react-icons/fa";
import { removeBookmark, removeTvSeriesBookmark } from "../store/store";
import { toast } from 'react-hot-toast';

function Bookmark() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const bookmarkedMovies = useSelector((state) => state.netflix.bookmarkedMovies || []);
  const bookmarkedTvSeries = useSelector((state) => state.netflix.bookmarkedTvSeries || []);
  const isAuthenticated = !!localStorage.getItem('token');
  const dispatch = useDispatch();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);
  
  const handleLoginRedirect = () => {
    localStorage.setItem('redirectAfterLogin', '/bookmark');
    navigate('/login');
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = (items, type) => {
    return items.filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = type === 'movie' ? 
        (filterType === 'all' || filterType === 'movies') :
        (filterType === 'all' || filterType === 'tv');
      return matchesSearch && matchesType;
    });
  };

  const filteredMovies = filteredItems(bookmarkedMovies, 'movie');
  const filteredTvSeries = filteredItems(bookmarkedTvSeries, 'tv');

  const handleRemoveBookmark = (item, e) => {
    e.stopPropagation();
    if (item.title) { // It's a movie
      dispatch(removeBookmark(item.id));
    } else { // It's a TV show
      dispatch(removeTvSeriesBookmark(item.id));
    }
  };

  const renderMediaCard = (item, type) => {
    const title = item.title || item.name;
    const releaseDate = item.release_date || item.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const poster = item.poster_path || require('../asset/fallback.jpg');
    const isMovie = type === 'movie';

    return (
      <div 
        key={`${type}-${item.id}`}
        className="group relative bg-zinc-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="w-full">
              <button className="w-full mb-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-colors">
                <FaPlay size={14} /> Watch Now
              </button>
            </div>
          </div>
          <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <FaStar className="text-yellow-400" /> {rating}
          </div>
          <button
            onClick={(e) => handleRemoveBookmark(item, e)}
            className="absolute top-3 right-3 bg-black/70 text-red-500 hover:bg-red-600 hover:text-white p-2 rounded-full transition-colors duration-200"
            title="Remove from bookmarks"
          >
            <FaBookmark />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              {isMovie ? <FaFilm size={10} /> : <FaTv size={10} />}
              {isMovie ? 'Movie' : 'TV Show'}
            </span>
            {year && <span className="text-xs text-zinc-400">• {year}</span>}
          </div>
          <h3 className="font-semibold text-white line-clamp-1">{title}</h3>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-zinc-800/50 p-6 rounded-full mb-4">
        <FaBookmark className="w-12 h-12 text-zinc-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h3>
      <p className="text-zinc-400 max-w-md">
        {searchQuery || filterType !== 'all' 
          ? 'No items match your current filters.' 
          : 'Save your favorite movies and TV shows to watch them later.'}
      </p>
      {(searchQuery || filterType !== 'all') && (
        <button 
          onClick={() => {
            setSearchQuery('');
            setFilterType('all');
          }}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="h-10 bg-zinc-800 rounded w-1/3"></div>
              <div className="flex gap-2 w-full md:w-1/2">
                <div className="h-10 bg-zinc-800 rounded flex-1"></div>
                <div className="h-10 bg-zinc-800 rounded w-24"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-zinc-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
        <div className="max-w-md w-full bg-zinc-800/90 rounded-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-900/30 flex items-center justify-center">
            <FaHeart className="text-4xl text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Bookmarks</h2>
          <p className="text-zinc-400 mb-6">Login to view and manage your saved movies and TV shows</p>
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FaSignInAlt /> Sign In to Continue
          </button>
          <p className="text-sm text-zinc-500 mt-4">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    );
  }

  const hasMovies = filteredMovies.length > 0;
  const hasTvShows = filteredTvSeries.length > 0;
  const showEmptyState = !hasMovies && !hasTvShows;

  return (
    <div className="content p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Bookmarks</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {filterType === 'all' 
                ? 'All your saved movies and TV shows' 
                : filterType === 'movies' 
                  ? 'Your saved movies' 
                  : 'Your saved TV shows'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-zinc-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookmarks..."
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Content</option>
              <option value="movies">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
          </div>
        </div>

        {showEmptyState ? (
          renderEmptyState()
        ) : (
          <div className="space-y-10">
            {(filterType === 'all' || filterType === 'movies') && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <FaFilm className="text-indigo-400" />
                    Movies
                  </h2>
                  <span className="text-sm bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                    {filteredMovies.length}
                  </span>
                </div>
                {hasMovies ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredMovies.map(movie => renderMediaCard(movie, 'movie'))}
                  </div>
                ) : !showEmptyState && (
                  <div className="text-center py-8 text-zinc-400">
                    No movies match your search.
                  </div>
                )}
              </div>
            )}

            {(filterType === 'all' || filterType === 'tv') && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <FaTv className="text-indigo-400" />
                    TV Shows
                  </h2>
                  <span className="text-sm bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                    {filteredTvSeries.length}
                  </span>
                </div>
                {hasTvShows ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredTvSeries.map(show => renderMediaCard(show, 'tv'))}
                  </div>
                ) : !showEmptyState && (
                  <div className="text-center py-8 text-zinc-400">
                    No TV shows match your search.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmark;
