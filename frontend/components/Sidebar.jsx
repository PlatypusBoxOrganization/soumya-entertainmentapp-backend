import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  FilmIcon,
  TvIcon,
  BookmarkIcon,
  UserIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { 
      path: '/', 
      icon: <HomeIcon className="w-6 h-6" />, 
      tooltip: 'Home',
      exact: true 
    },
    { 
      path: '/movies', 
      icon: <FilmIcon className="w-6 h-6" />, 
      tooltip: 'Movies' 
    },
    { 
      path: '/tvseries', 
      icon: <TvIcon className="w-6 h-6" />, 
      tooltip: 'TV Series' 
    },
    { 
      path: '/bookmark', 
      icon: <BookmarkIcon className="w-6 h-6" />, 
      tooltip: 'Bookmarks' 
    },
    { 
      path: '/dashboard', 
      icon: <Cog6ToothIcon className="w-6 h-6" />, 
      tooltip: 'Dashboard' 
    },
    { 
      path: '/profile', 
      icon: <UserIcon className="w-6 h-6" />, 
      tooltip: 'Profile' 
    }
  ];

  // Add scroll effect for the sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path) && item.path !== '/';
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-20 bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-700/50 z-40 transition-all duration-300 ${
      isScrolled ? 'pt-16' : 'pt-20'
    }`}>
      <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col justify-between py-4">
          <div className="space-y-2 px-2">
            {navItems.map((item, index) => {
              const active = isActive(item);
              return (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center justify-center w-full h-14 rounded-xl transition-all duration-200 group ${
                    active 
                      ? 'text-indigo-400' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={item.tooltip}
                >
                  {active && (
                    <motion.div 
                      layoutId="activeNavItem"
                      className="absolute inset-0 bg-indigo-500/10 rounded-xl"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  <div className="relative z-10 p-2.5 rounded-lg transition-colors group-hover:bg-zinc-800/50">
                    {React.cloneElement(item.icon, {
                      className: `w-5 h-5 ${active ? 'text-indigo-400' : 'group-hover:text-white'}`
                    })}
                  </div>
                  <AnimatePresence>
                    {hoveredItem === index && (
                      <motion.span 
                        className="absolute left-full ml-3 px-3 py-1.5 text-sm font-medium bg-zinc-800/95 backdrop-blur-sm text-white rounded-md whitespace-nowrap shadow-lg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      >
                        {item.tooltip}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
