# Statistics System Documentation

## 🎯 Overview

A comprehensive statistics page for displaying user typing test results with advanced filtering, pagination, and modern UI.

## 📊 Features

### ✅ Core Functionality
- **User-specific results** - Only shows logged-in user's typing results
- **Real-time filtering** - Dynamic filters for date range, WPM, and test duration
- **Pagination** - 10 results per page with Previous/Next navigation
- **Responsive design** - Works on desktop and mobile

### ✅ Advanced Filters
- **Date Range** - Filter results by specific date periods
- **Minimum WPM** - Show only results above a certain WPM threshold
- **Test Duration** - Filter by specific test durations (15s, 30s, 60s, 120s)

### ✅ UI/UX Features
- **Loading states** - Smooth loading indicators
- **Empty states** - Helpful messages when no data exists
- **Toast notifications** - Success/error feedback
- **Hover effects** - Interactive table rows
- **Modern design** - Uses Tailwind CSS with theme variables

## 🏗️ Architecture

### Database Layer
```typescript
// lib/typingResults.ts
export interface TypingResultRow {
  id: string;
  user_id: string;
  wpm: number;
  accuracy: number;
  characters: number;
  errors: number;
  test_duration: number;
  created_at: string;
}

export interface TypingFilters {
  dateRange?: {
    from?: string;
    to?: string;
  };
  minWpm?: number;
  testDuration?: number;
}

export interface TypingResultsResponse {
  data: TypingResultRow[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

### Supabase Query Layer
```typescript
// Pagination + Filters + RLS
export async function getUserTypingResultsWithPagination(
  page: number = 1,
  pageSize: number = 10,
  filters?: TypingFilters
): Promise<{ success: boolean; data?: TypingResultsResponse; error?: string }>
```

### Component Layer
```typescript
// app/stats/page.tsx
const StatisticsPage = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TypingResultsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TingFilters>({});
  
  // Data fetching with filters and pagination
  // UI components for table, filters, pagination
};
```

## 🔧 Supabase Query Features

### ✅ Row Level Security (RLS)
```sql
-- Users can only see their own results
CREATE POLICY "Users can view own typing results" ON public.typing_results
  FOR SELECT USING (auth.uid() = user_id);
```

### ✅ Advanced Filtering
```typescript
// Date range filtering
if (filters.dateRange?.from) {
  query = query.gte('created_at', filters.dateRange.from);
}
if (filters.dateRange?.to) {
  query = query.lte('created_at', filters.dateRange.to);
}

// WPM filtering
if (filters.minWpm) {
  query = query.gte('wpm', filters.minWpm);
}

// Test duration filtering
if (filters.testDuration) {
  query = query.eq('test_duration', filters.testDuration);
}
```

### ✅ Pagination
```typescript
// Supabase range-based pagination
const from = (page - 1) * pageSize;
const to = from + pageSize - 1;
query = query.range(from, to);

// Get total count for pagination info
.select('*', { count: 'exact' })
```

## 🎨 UI Components

### Filter Section
```typescript
<div className="bg-card border border-border rounded-lg p-4 mb-6">
  <h2 className="text-lg font-semibold text-foreground mb-4">Filters</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Date Range */}
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
      <div className="flex gap-2">
        <input type="date" />
        <input type="date" />
      </div>
    </div>
    
    {/* Minimum WPM */}
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Minimum WPM</label>
      <input type="number" placeholder="e.g., 50" />
    </div>
    
    {/* Test Duration */}
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Test Duration</label>
      <select>
        <option value="">All Durations</option>
        <option value="15">15 seconds</option>
        <option value="30">30 seconds</option>
        <option value="60">60 seconds</option>
        <option value="120">120 seconds</option>
      </select>
    </div>
  </div>
</div>
```

### Results Table
```typescript
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
        {/* ... other columns */}
      </tr>
    ))}
  </tbody>
</table>
```

### Pagination Controls
```typescript
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
```

## 🚀 Performance Optimizations

### ✅ Efficient Queries
- **Database-level filtering** - Reduces data transfer
- **Pagination** - Limits results per request
- **Index optimization** - Fast query performance

### ✅ React Optimizations
- **State management** - Efficient re-renders
- **Memoization** - Prevents unnecessary calculations
- **Loading states** - Smooth user experience

## 🔐 Security Features

### ✅ Authentication Required
```typescript
// Check user authentication
const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  return { success: false, error: 'User not authenticated' };
}
```

### ✅ Row Level Security
- **User isolation** - Users only see their own data
- **Server-side filtering** - Security enforced at database level
- **No client-side data leaks**

## 📱 Responsive Design

### ✅ Mobile Optimization
- **Responsive grid** - Adapts to screen size
- **Scrollable tables** - Horizontal scroll on mobile
- **Touch-friendly** - Large tap targets

### ✅ Desktop Experience
- **Wide layouts** - Utilize screen space
- **Hover effects** - Interactive feedback
- **Keyboard navigation** - Accessibility support

## 🎯 Usage Examples

### Basic Usage
```typescript
// Navigate to /stats
// Results automatically load for logged-in user
```

### Advanced Filtering
```typescript
// Filter by date range
handleFilterChange({
  dateRange: { from: '2024-01-01', to: '2024-12-31' }
});

// Filter by minimum WPM
handleFilterChange({ minWpm: 50 });

// Filter by test duration
handleFilterChange({ testDuration: 30 });
```

### Pagination
```typescript
// Go to next page
handlePageChange(currentPage + 1);

// Go to previous page
handlePageChange(currentPage - 1);
```

## 🛠️ Customization

### ✅ Styling
- **Tailwind CSS** - Easy theme customization
- **CSS variables** - Dynamic theming
- **Component-based** - Reusable UI elements

### ✅ Configuration
- **Page size** - Adjustable pagination
- **Filter options** - Customizable filters
- **Display format** - Flexible date/time formatting

## 📊 Data Flow

1. **User visits `/stats`**
2. **Component checks authentication**
3. **Fetches user results with pagination**
4. **Applies filters if specified**
5. **Displays results in table format**
6. **Handles pagination navigation**
7. **Updates on filter changes**

This statistics system provides a comprehensive, secure, and user-friendly way for users to track their typing progress over time.
