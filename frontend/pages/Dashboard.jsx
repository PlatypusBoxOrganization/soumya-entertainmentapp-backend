import React, { useState, useEffect } from "react";
import { 
  FaBookmark, 
  FaChartLine, 
  FaList, 
  FaUser, 
  FaFilm,
  FaTv,
  FaStar,
  FaUsers,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaRegClock
} from "react-icons/fa";
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { userAPI } from "../src/services/api";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    movies: 0,
    tvShows: 0,
    bookmarks: 0,
    users: 0,
    views: 0,
    watchTime: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [trendingContent, setTrendingContent] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API calls
        const [statsRes, activityRes, trendingRes] = await Promise.all([
          userAPI.getDashboardStats(),
          userAPI.getRecentActivity(),
          userAPI.getTrendingContent()
        ]);
        
        setStats(statsRes.data);
        setRecentActivity(activityRes.data);
        setTrendingContent(trendingRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data if API fails
        setStats({
          movies: 1245,
          tvShows: 876,
          bookmarks: 3421,
          users: 1543,
          views: 12543,
          watchTime: 2456
        });
        setRecentActivity([
          { id: 1, type: 'view', title: 'Stranger Things', time: '2 mins ago', change: '+15%' },
          { id: 2, type: 'bookmark', title: 'The Witcher', time: '10 mins ago', change: '+25' },
          { id: 3, type: 'user', title: 'New user registered', time: '30 mins ago', change: '+1' },
          { id: 4, type: 'trending', title: 'Wednesday is trending', time: '1 hour ago', change: '+42%' },
        ]);
        setTrendingContent([
          { id: 1, title: 'Stranger Things', type: 'tv', views: 12453, change: 15 },
          { id: 2, title: 'The Witcher', type: 'tv', views: 9876, change: 8 },
          { id: 3, title: 'Wednesday', type: 'tv', views: 15432, change: 42 },
          { id: 4, title: 'The Mandalorian', type: 'tv', views: 8765, change: 5 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data
  const viewsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Views',
        data: [4500, 5200, 4800, 6100, 7300, 8900],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const contentData = {
    labels: ['Movies', 'TV Shows', 'Documentaries', 'Anime'],
    datasets: [
      {
        label: 'Content Distribution',
        data: [45, 35, 12, 8],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(67, 56, 202, 0.8)',
          'rgba(79, 70, 229, 0.8)',
          'rgba(55, 48, 163, 0.8)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(67, 56, 202, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(55, 48, 163, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const StatCard = ({ title, value, icon: Icon, change, isIncrease = true }) => (
    <div className="bg-zinc-800/50 rounded-xl p-6 hover:bg-zinc-800/70 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
            {change && (
              <span className={`text-xs flex items-center mb-1 ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                {isIncrease ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {change}%
              </span>
            )}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ type, title, time, change }) => {
    const getIcon = () => {
      switch (type) {
        case 'view':
          return <FaChartLine className="w-5 h-5 text-indigo-500" />;
        case 'bookmark':
          return <FaBookmark className="w-5 h-5 text-pink-500" />;
        case 'user':
          return <FaUsers className="w-5 h-5 text-green-500" />;
        case 'trending':
          return <FaStar className="w-5 h-5 text-yellow-500" />;
        default:
          return <FaRegClock className="w-5 h-5 text-zinc-500" />;
      }
    };

    return (
      <div className="flex items-start gap-4 p-4 hover:bg-zinc-800/50 rounded-lg transition-colors">
        <div className="p-2 rounded-lg bg-zinc-800/50">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium">{title}</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <FaClock className="w-3 h-3" />
              {time}
            </p>
            {change && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800/50 text-zinc-300">
                {change.startsWith('+') ? '↑ ' : '↓ '}{change}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="content p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-zinc-800/50 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-zinc-800/50 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-zinc-800/50 rounded-xl"></div>
              <div className="h-96 bg-zinc-800/50 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-zinc-400 text-sm mt-1">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center gap-2 text-sm bg-zinc-800/50 px-3 py-1.5 rounded-lg">
            <FaRegClock className="text-indigo-400" />
            <span className="text-zinc-300">Last updated: Just now</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Movies" 
            value={stats.movies} 
            icon={FaFilm} 
            change={12.5} 
            isIncrease={true} 
          />
          <StatCard 
            title="TV Shows" 
            value={stats.tvShows} 
            icon={FaTv} 
            change={8.2} 
            isIncrease={true} 
          />
          <StatCard 
            title="Active Users" 
            value={stats.users} 
            icon={FaUsers} 
            change={5.7} 
            isIncrease={true} 
          />
          <StatCard 
            title="Total Views" 
            value={stats.views} 
            icon={FaChartLine} 
            change={24.3} 
            isIncrease={true} 
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-zinc-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Monthly Views</h2>
              <select className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Last 6 months</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="h-64">
              <Line 
                data={viewsData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: '#9ca3af'
                      }
                    },
                    y: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                      },
                      ticks: {
                        color: '#9ca3af'
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
          
          <div className="bg-zinc-800/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Content Distribution</h2>
            <div className="h-64">
              <Bar 
                data={contentData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: '#9ca3af'
                      }
                    },
                    y: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                      },
                      ticks: {
                        color: '#9ca3af'
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-zinc-800/50 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            </div>
            <div className="divide-y divide-zinc-700">
              {recentActivity.map(activity => (
                <ActivityItem key={activity.id} {...activity} />
              ))}
            </div>
            <div className="p-4 text-center border-t border-zinc-700">
              <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                View All Activity
              </button>
            </div>
          </div>

          {/* Trending Now */}
          <div className="bg-zinc-800/50 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-lg font-semibold text-white">Trending Now</h2>
            </div>
            <div className="divide-y divide-zinc-700">
              {trendingContent.map((item, index) => (
                <div key={item.id} className="p-4 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-zinc-500 w-6">{index + 1}</span>
                      <div>
                        <h3 className="font-medium text-white">{item.title}</h3>
                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                          {item.type === 'movie' ? <FaFilm className="w-3 h-3" /> : <FaTv className="w-3 h-3" />}
                          {item.type === 'movie' ? 'Movie' : 'TV Show'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.views.toLocaleString()} views</p>
                      <p className={`text-xs ${item.change > 0 ? 'text-green-400' : 'text-red-400'} flex items-center justify-end gap-1`}>
                        {item.change > 0 ? <FaArrowUp className="w-2.5 h-2.5" /> : <FaArrowDown className="w-2.5 h-2.5" />}
                        {Math.abs(item.change)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 text-center border-t border-zinc-700">
              <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                View All Trending
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
