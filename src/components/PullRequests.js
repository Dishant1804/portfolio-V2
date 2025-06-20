import { useState, useEffect } from 'react';
import Link from "next/link";
import { FiArrowUpRight, FiGitPullRequest, FiGitMerge, FiX } from "react-icons/fi";

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

  const blacklist = ['pksagar0512/ITB_Assignment', 'OctoTechHub/studysource'];

  const filteredPRs = pullRequests.filter(pr => {
    if (blacklist.includes(pr.repository.full_name)) return false;
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
      <div id="pull-requests" className="flex flex-col items-center w-full justify-between text-left gap-6 px-10">
        <h1 className="tracking-tight underline items-start w-full text-xl font-semibold">Pull Requests</h1>
        <div className="flex items-center justify-center w-full py-8">
          <p className="opacity-80">Loading contributions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="pull-requests" className="flex flex-col items-center w-full justify-between text-left gap-6 px-10">
        <h1 className="tracking-tight underline items-start w-full text-xl font-semibold">Pull Requests</h1>
        <div className="flex items-center justify-center w-full py-8">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="contributions" className="flex flex-col items-center w-full justify-between text-left gap-6 px-10">
      <h1 className="tracking-tight underline items-start w-full text-xl font-semibold">Contributions</h1>

      <div className="flex flex-wrap items-start w-full gap-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-1 text-sm border border-primary w-fit hover:bg-secondary ${filter === 'all' ? 'bg-secondary text-primary' : 'text-primary'
            }`}
        >
          All ({pullRequests.filter(pr => !blacklist.includes(pr.repository.full_name)).length})
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-2 py-1 text-sm border border-primary w-fit hover:bg-secondary ${filter === 'open' ? 'bg-secondary text-primary' : 'text-primary'
            }`}
        >
          Open ({pullRequests.filter(pr => !blacklist.includes(pr.repository.full_name) && pr.state === 'open').length})
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-2 py-1 text-sm border border-primary w-fit hover:bg-secondary ${filter === 'closed' ? 'bg-secondary text-primary' : 'text-primary'
            }`}
        >
          Closed ({pullRequests.filter(pr => !blacklist.includes(pr.repository.full_name) && pr.state === 'closed').length})
        </button>
      </div>

      <ul className="flex flex-col gap-5 w-full">
        {displayedPRs.map((pr) => (
          <li
            key={pr.id}
            className="flex flex-col gap-2 w-full p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center text-left gap-2 w-full justify-between max-[590px]:flex-col max-[590px]:items-start">
              <div className="flex items-center gap-2">
                {getStateIcon(pr.state, pr.merged_at)}
                <Link
                  className="flex items-center gap-1 font-medium text-[var(--blue-color)] hover:underline"
                  target="_blank"
                  href={pr.html_url}
                >
                  {pr.title.length > 40 ? `${pr.title.substring(0, 40)}...` : pr.title}
                  <FiArrowUpRight size={16} />
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <span className={getStateColor(pr.state, pr.merged_at)}>
                  {pr.merged_at ? 'Merged' : pr.state}
                </span>
                <span>•</span>
                <span>{formatDate(pr.created_at)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm opacity-80">
              <span>#{pr.number}</span>
              <span>•</span>
              <Link
                href={pr.repository.html_url}
                target="_blank"
                className="text-[var(--blue-color)] hover:underline"
              >
                {pr.repository.full_name}
              </Link>
              <span>•</span>
              <span>by Dishant1804</span>
            </div>
          </li>
        ))}
      </ul>

      {filteredPRs.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 text-sm border border-primary hover:bg-secondary text-primary rounded transition-colors"
        >
          {showAll ? 'Show Less' : `Show More (${filteredPRs.length - 5} more)`}
        </button>
      )}

      {filteredPRs.length === 0 && (
        <div className="flex items-center justify-center w-full py-8">
          <p className="opacity-80">No pull requests found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default PullRequests;
