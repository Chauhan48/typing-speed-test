'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  getUserTypingResultsWithPagination, 
  TypingFilters, 
  TypingResultsResponse 
} from '@/lib/typingResults';

const StatisticsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TypingResultsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TypingFilters>({});

  // Fetch results with pagination and filters
  const fetchResults = async (page: number = 1, appliedFilters?: TypingFilters) => {
    setLoading(true);
    try {
      const { success, data, error } = await getUserTypingResultsWithPagination(
        page, 
        10, 
        appliedFilters || filters
      );
      
      if (success && data) {
        setResults(data);
        setCurrentPage(page);
      } else {
        toast.error(error || 'Failed to fetch statistics');
        if (error?.includes('not authenticated')) {
          router.push('/signup');
        }
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchResults();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle filter changes
  const handleFilterChange = (newFilters: TypingFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    fetchResults(1, newFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchResults(page);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Your Typing Statistics</h1>
        
        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  value={filters.dateRange?.from || ''}
                  onChange={(e) => handleFilterChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, from: e.target.value || undefined }
                  })}
                />
                <input
                  type="date"
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  value={filters.dateRange?.to || ''}
                  onChange={(e) => handleFilterChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, to: e.target.value || undefined }
                  })}
                />
              </div>
            </div>

            {/* Minimum WPM */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Minimum WPM</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                placeholder="e.g., 50"
                value={filters.minWpm || ''}
                onChange={(e) => handleFilterChange({
                  ...filters,
                  minWpm: e.target.value ? parseInt(e.target.value) : undefined
                })}
              />
            </div>

            {/* Test Duration */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Test Duration</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                value={filters.testDuration || ''}
                onChange={(e) => handleFilterChange({
                  ...filters,
                  testDuration: e.target.value ? parseInt(e.target.value) : undefined
                })}
              >
                <option value="">All Durations</option>
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
                <option value="120">120 seconds</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => handleFilterChange({})}
            className="mt-4 px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Results Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">Loading statistics...</div>
            </div>
          ) : results?.data.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">No typing results found. Start practicing to see your statistics!</div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">WPM</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Accuracy</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Characters</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Errors</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {results?.data.map((result) => (
                      <tr key={result.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground">
                          {formatDate(result.created_at)}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground font-mono">
                          {result.wpm}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground font-mono">
                          {result.accuracy}%
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground font-mono">
                          {result.characters}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground font-mono">
                          {result.errors}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground font-mono">
                          {result.test_duration}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 bg-muted border-t border-border flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, results?.count || 0)} of {results?.count} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-background border border-border rounded-md text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-foreground">
                    Page {currentPage} of {results?.totalPages || 1}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === results?.totalPages}
                    className="px-3 py-1 text-sm bg-background border border-border rounded-md text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;