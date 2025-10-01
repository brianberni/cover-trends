import React, { useEffect, useState } from 'react';
import { TrendingUp, Book, Palette, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface TrendSnapshot {
  id: string;
  category_id: string;
  total_books_analyzed: number;
  avg_brightness: number;
  avg_saturation: number;
  avg_contrast: number;
  top_colors: any[];
  created_at: string;
}

interface BookCover {
  id: string;
  title: string;
  image_url: string;
  rank: number;
  rating: number;
}

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [trendSnapshots, setTrendSnapshots] = useState<TrendSnapshot[]>([]);
  const [recentBooks, setRecentBooks] = useState<BookCover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    const { data: snapshots } = await supabase
      .from('trend_snapshots')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: books } = await supabase
      .from('book_covers')
      .select('id, title, image_url, rank, rating')
      .order('created_at', { ascending: false })
      .limit(12);

    if (snapshots) setTrendSnapshots(snapshots);
    if (books) setRecentBooks(books);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">Cover Trend Intelligence</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Books Analyzed</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {trendSnapshots[0]?.total_books_analyzed || 0}
                </p>
              </div>
              <Book className="h-12 w-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Brightness</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {trendSnapshots[0]?.avg_brightness?.toFixed(1) || '0'}
                </p>
              </div>
              <Palette className="h-12 w-12 text-purple-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Trend Snapshots</p>
                <p className="text-3xl font-bold text-white mt-2">{trendSnapshots.length}</p>
              </div>
              <BarChart3 className="h-12 w-12 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-xl border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Trend Analysis</h2>
          <div className="space-y-4">
            {trendSnapshots.map((snapshot) => (
              <div key={snapshot.id} className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Category: {snapshot.category_id}</span>
                  <span className="text-slate-400 text-sm">
                    {new Date(snapshot.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Brightness:</span>
                    <span className="text-white ml-2">{snapshot.avg_brightness.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Saturation:</span>
                    <span className="text-white ml-2">{snapshot.avg_saturation.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Contrast:</span>
                    <span className="text-white ml-2">{snapshot.avg_contrast.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Book Covers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentBooks.map((book) => (
              <div key={book.id} className="group">
                <div className="aspect-[2/3] bg-slate-700 rounded-lg overflow-hidden mb-2">
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-white text-sm font-medium truncate">{book.title}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Rank: {book.rank}</span>
                  <span>Rating: {book.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
