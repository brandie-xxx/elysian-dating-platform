import SearchFilters from '../SearchFilters';
import { ThemeProvider } from '../ThemeProvider';

export default function SearchFiltersExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <SearchFilters 
          onSearch={(query) => console.log('Search:', query)}
          onFiltersChange={(filters) => console.log('Filters:', filters)}
        />
      </div>
    </ThemeProvider>
  );
}