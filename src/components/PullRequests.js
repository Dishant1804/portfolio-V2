import { useState, useEffect } from 'react';
import Link from "next/link";
import { FiArrowUpRight, FiGitPullRequest, FiGitMerge, FiX } from "react-icons/fi";
import blacklist from '@/data/blacklistrepo';
import blacklistPRs from '@/data/blacklistPRs';

const PullRequests = () => {
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchPullRequests = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch('/api/pull-requests', {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const data = await response.json();

        if (data.success) {
          setPullRequests(data.data);
          if (data.cached) {
            console.log('Pull requests loaded from cache');
          }
        } else {
          setError(data.message);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError('Failed to fetch pull requests');
        }
        console.error('Pull requests fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPullRequests();
  }, []);

  const filteredPRs = pullRequests.filter(pr => {
    if (blacklist.includes(pr.repository.full_name)) return false;

    if (blacklistPRs.some(item =>
      item.repo === pr.repository.full_name && item.number === pr.number
    )) return false;

    if (filter === 'all') return true;
    return pr.state === filter;
  });

  const displayedPRs = showAll ? filteredPRs : filteredPRs.slice(0, 5);

  const getStateIcon = (state, merged_at) => {
    if (state === 'open') {
      return <FiGitPullRequest className="text-green-600" size={16} />;
    }
    if (state === 'closed' && merged_at) {
      return <FiGitMerge className="text-purple-600" size={16} />;
    }
    if (state === 'closed' && !merged_at) {
      return <FiX className="text-red-600" size={16} />;
    }
    return <FiX className="text-red-600" size={16} />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStateColor = (state, merged_at) => {
    if (merged_at) return 'text-purple-600';
    if (state === 'open') return 'text-green-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div id="pull-requests" className="flex flex-col items-center w-full justify-between text-left gap-6 px-4 sm:px-6 lg:px-10">
        <h1 className="tracking-tight underline items-start w-full text-lg sm:text-xl font-semibold">Pull Requests</h1>
        <div className="flex items-center justify-center w-full py-8">
          <p className="opacity-80 text-sm sm:text-base">Loading contributions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="pull-requests" className="flex flex-col items-center w-full justify-between text-left gap-6 px-4 sm:px-6 lg:px-10">
        <h1 className="tracking-tight underline items-start w-full text-lg sm:text-xl font-semibold">Pull Requests</h1>
        <div className="flex items-center justify-center w-full py-8">
          <p className="text-red-600 text-sm sm:text-base">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="contributions" className="flex flex-col items-center w-full justify-between text-left gap-4 sm:gap-6 px-4 sm:px-6 lg:px-10">
      <h1 className="tracking-tight underline items-start w-full text-lg sm:text-xl font-semibold">Some contributions</h1>

      <div className="flex flex-wrap items-start w-full gap-2 sm:gap-4 lg:gap-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-2 text-xs sm:text-sm border border-primary w-fit hover:bg-secondary transition-colors ${filter === 'all' ? 'bg-secondary text-primary' : 'text-primary'
            }`}
        >
          All ({pullRequests.filter(pr =>
            !blacklist.includes(pr.repository.full_name) &&
            !blacklistPRs.some(item =>
              item.repo === pr.repository.full_name && item.number === pr.number
            )
          ).length})
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-3 py-2 text-xs sm:text-sm border border-primary w-fit hover:bg-secondary transition-colors ${filter === 'open' ? 'bg-secondary text-primary' : 'text-primary'
            }`}
        >
          Open ({pullRequests.filter(pr =>
            !blacklist.includes(pr.repository.full_name) &&
            !blacklistPRs.some(item =>
              item.repo === pr.repository.full_name && item.number === pr.number
            ) &&
            pr.state === 'open'
          ).length})
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-3 py-2 text-xs sm:text-sm border border-primary w-fit hover:bg-secondary transition-colors ${filter === 'closed' ? 'bg-secondary text-primary' : 'text-primary'
            }`}
        >
          Closed ({pullRequests.filter(pr =>
            !blacklist.includes(pr.repository.full_name) &&
            !blacklistPRs.some(item =>
              item.repo === pr.repository.full_name && item.number === pr.number
            ) &&
            pr.state === 'closed'
          ).length})
        </button>
      </div>

      <ul className="flex flex-col gap-3 sm:gap-4 lg:gap-5 w-full">
        {displayedPRs.map((pr) => (
          <li
            key={pr.id}
            className="flex flex-col gap-2 sm:gap-3 w-full p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center text-left gap-2 w-full sm:justify-between">
              <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                  {getStateIcon(pr.state, pr.merged_at)}
                </div>
                <Link
                  className="flex items-start sm:items-center gap-1 font-medium text-[var(--blue-color)] hover:underline text-sm sm:text-base break-words min-w-0 flex-1"
                  target="_blank"
                  href={pr.html_url}
                >
                  <span className="break-words">
                    {window.innerWidth < 640 && pr.title.length > 40 
                      ? `${pr.title.substring(0, 40)}...` 
                      : pr.title.length > 50 
                        ? `${pr.title.substring(0, 50)}...` 
                        : pr.title}
                  </span>
                  <FiArrowUpRight size={14} className="flex-shrink-0 mt-0.5 sm:mt-0" />
                </Link>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm opacity-80 flex-shrink-0">
                <span className={getStateColor(pr.state, pr.merged_at)}>
                  {pr.merged_at ? 'Merged' : pr.state}
                </span>
                <span>•</span>
                <span>{formatDate(pr.created_at)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm opacity-80">
              <span>#{pr.number}</span>
              <span>•</span>
              <Link
                href={pr.repository.html_url}
                target="_blank"
                className="text-[var(--blue-color)] hover:underline break-all"
              >
                {pr.repository.full_name}
              </Link>
              <span className='hidden md:inline'>•</span>
              <span className='hidden md:inline'>by Dishant1804</span>
            </div>
          </li>
        ))}
      </ul>

      {filteredPRs.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 text-xs sm:text-sm border border-primary hover:bg-secondary text-primary rounded transition-colors"
        >
          {showAll ? 'Show Less' : `Show More (${filteredPRs.length - 5} more)`}
        </button>
      )}

      {filteredPRs.length === 0 && (
        <div className="flex items-center justify-center w-full py-8">
          <p className="opacity-80 text-sm sm:text-base text-center">No pull requests found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default PullRequests;
