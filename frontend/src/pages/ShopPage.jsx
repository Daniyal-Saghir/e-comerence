import { useState, useEffect } from 'react';
import { useGetProductsQuery } from '@/redux/slices/productsApiSlice';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Search, Filter, ChevronDown, SlidersHorizontal, 
  LayoutGrid, List, Star, ArrowUpDown, X,
  ShoppingBag, Zap, Laptop, Smartphone, Headphones, Watch, Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'Electronics', name: 'Electronics', icon: Zap },
  { id: 'Computing', name: 'Computing', icon: Laptop },
  { id: 'Mobile', name: 'Mobile', icon: Smartphone },
  { id: 'Audio', name: 'Audio', icon: Headphones },
  { id: 'Wearables', name: 'Wearables', icon: Watch },
  { id: 'Lifestyle', name: 'Lifestyle', icon: Layers },
  { id: 'Footwear', name: 'Footwear', icon: Sparkles },
  { id: 'Accessories', name: 'Accessories', icon: ShieldCheck },
];

const ShopPage = () => {
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2500 });
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('-createdAt');
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI States
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const { data: response, isLoading, error } = useGetProductsQuery({
    category: selectedCategories.join(','),
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    rating: minRating,
    sort: sort,
    keyword: searchTerm
  });

  const products = response?.data || [];

  const toggleCategory = (catId) => {
    setSelectedCategories(prev => 
      prev.includes(catId) 
        ? prev.filter(c => c !== catId) 
        : [...prev, catId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 2500 });
    setMinRating(0);
    setSort('-createdAt');
    setSearchTerm('');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 space-y-12 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Universal Distribution</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic">Advanced <br />Collection.</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full md:w-80 pl-12 pr-6 bg-muted/50 border border-border/50 rounded-2xl focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-xs tracking-tight"
            />
          </div>
          <Button 
            variant="primary" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
                "h-12 rounded-2xl px-6 gap-3 font-black text-[10px] uppercase tracking-widest transition-all shrink-0",
                isFilterOpen ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" : "hover:bg-muted"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {isFilterOpen ? 'Hide Filters' : 'Filter Products'}
          </Button>
        </div>
      </div>

      <div className="flex gap-8 md:gap-12 items-start">
        {/* Advanced Sidebar Filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0, x: -50 }}
              animate={{ width: isFilterOpen ? 'auto' : 0, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: -50 }}
              className={cn(
                "lg:block space-y-8 sticky top-32 h-fit max-h-[calc(100vh-160px)] overflow-y-auto pr-4 custom-scrollbar no-scrollbar-x shrink-0 lg:w-64",
                isFilterOpen ? "block w-full lg:w-64 mb-8 lg:mb-0" : "hidden"
              )}
            >
              {/* Category Filter */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Classifications</h3>
                  {selectedCategories.length > 0 && (
                    <button onClick={() => setSelectedCategories([])} className="text-[9px] font-black uppercase text-primary hover:underline">Reset</button>
                  )}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-xl transition-all border text-left",
                        selectedCategories.includes(cat.id) 
                          ? "bg-primary/10 border-primary/20 text-primary shadow-sm" 
                          : "bg-muted/20 border-transparent hover:border-border/30"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <cat.icon className={cn("h-3 w-3", selectedCategories.includes(cat.id) ? "text-primary" : "text-muted-foreground/40")} />
                        <span className="text-[11px] font-black uppercase tracking-tight italic">{cat.name}</span>
                      </div>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        selectedCategories.includes(cat.id) ? "bg-primary" : "bg-muted-foreground/10"
                      )} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-4 p-6 bg-muted/20 rounded-[2rem] border border-border/30">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Valuation</h3>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="space-y-1.5 flex-grow">
                      <label className="text-[8px] font-black uppercase text-muted-foreground/40 px-1">Min</label>
                      <input 
                        type="number" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full h-10 bg-background border border-border/50 rounded-lg px-3 text-[11px] font-black tabular-nums outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5 flex-grow">
                      <label className="text-[8px] font-black uppercase text-muted-foreground/40 px-1">Max</label>
                      <input 
                        type="number" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full h-10 bg-background border border-border/50 rounded-lg px-3 text-[11px] font-black tabular-nums outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Rating</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                  {[4, 3, 2].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMinRating(prev => prev === num ? 0 : num)}
                      className={cn(
                        "flex items-center gap-3 p-3.5 rounded-xl border transition-all justify-center sm:justify-start",
                        minRating === num ? "bg-amber-500/10 border-amber-500/30 text-amber-600" : "bg-muted/20 border-transparent text-muted-foreground/40"
                      )}
                    >
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-2.5 h-2.5", i < num ? "fill-current" : "opacity-10")} />
                        ))}
                      </div>
                      <span className="text-[10px] font-black italic">{num}+ Rating</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                variant="destructive" 
                onClick={clearFilters}
                className="w-full h-12 rounded-xl gap-2 font-black text-[9px] uppercase tracking-widest bg-destructive/5 text-destructive border border-destructive/10 hover:bg-destructive hover:text-white transition-all"
              >
                <X className="h-3 w-3" />
                Reset System Directives
              </Button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product Listing Area */}
        <main className="flex-grow space-y-8 min-w-0">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-card border border-border/50 p-4 rounded-2xl shadow-sm gap-4">
            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground px-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="uppercase tracking-widest">{isLoading ? 'Scanning...' : `${products.length} Units`}</span>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-2 px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sort:</span>
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 bg-muted/50 border border-border/50 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer min-w-[140px]"
              >
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low</option>
                <option value="-price">Price: High</option>
                <option value="-rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[450px] rounded-[2.5rem] bg-muted animate-pulse" />
               ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-40 flex flex-col items-center text-center space-y-6 bg-muted/20 border-2 border-dashed rounded-[3rem]">
              <div className="p-6 bg-muted rounded-[2rem] text-muted-foreground/20">
                <Search className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic tracking-tight">Zero Matches Located</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-xs">No active units match your current directive. Try resetting your filters.</p>
              </div>
              <Button onClick={clearFilters} className="rounded-xl h-12 px-8 font-bold">Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-x-6 gap-y-10">
              <AnimatePresence mode="popLayout">
                {products.map((p, idx) => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
