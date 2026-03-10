import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '@/redux/slices/productsApiSlice';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Sparkles, Zap, Laptop, Smartphone, Headphones, Watch, Layers, Cpu, Globe, Rocket } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

const HomePage = () => {
  const { keyword, category } = useParams();
  const navigate = useNavigate();
  const productsRef = useRef(null);
  const { data: response, isLoading, error } = useGetProductsQuery({ keyword, category });

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary/40" />
            </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Initializing Feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-32 bg-destructive/5 rounded-[3rem] border border-dashed border-destructive/20 max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-destructive tracking-tight">Sync Protocol Interrupted</h2>
        <p className="text-muted-foreground mt-2 font-medium">{error?.data?.message || 'The data feed is currently unavailable.'}</p>
        <Button variant="outline" className="mt-8 rounded-2xl px-8 h-12 font-bold" onClick={() => window.location.reload()}>Re-Initialize</Button>
      </div>
    );
  }

  const products = response?.data || [];

  const categories = [
    { name: 'Computing', icon: Laptop, count: '12+ Units', color: 'bg-blue-500' },
    { name: 'Mobile', icon: Smartphone, count: '24+ Units', color: 'bg-emerald-500' },
    { name: 'Audio', icon: Headphones, count: '18+ Units', color: 'bg-purple-500' },
    { name: 'Wearables', icon: Watch, count: '8+ Units', color: 'bg-amber-500' }
  ];

  const brands = [
    { name: 'Apple', logo: '', desc: 'Premium Innovation' },
    { name: 'Samsung', logo: 'S', desc: 'Global Excellence' },
    { name: 'Sony', logo: 'S', desc: 'Acoustic Mastery' },
    { name: 'Microsoft', logo: 'M', desc: 'Limitless Potential' }
  ];

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      {!keyword && (
        <section className="relative overflow-hidden rounded-[3rem] bg-foreground px-8 py-20 md:px-20 md:py-32 group">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
          
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -right-24 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[150px] mix-blend-screen pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-24 -left-24 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px] mix-blend-screen pointer-events-none" 
          />

          <div className="relative z-10 max-w-3xl space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-xs font-black uppercase tracking-widest text-white/70 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Winter Collection v4.0 Active</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl font-black tracking-tighter text-white md:text-8xl leading-[0.9]"
            >
                Redefine Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Digital Identity.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/50 leading-relaxed md:text-xl font-medium max-w-xl"
            >
              The definitive ecosystem for premium aesthetics and computational superiority. Curated for the tech elite.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-5"
            >
              <Button onClick={scrollToProducts} size="lg" className="h-16 rounded-[1.25rem] px-10 text-base font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group">
                Shop Collection <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="h-16 rounded-[1.25rem] border-white/10 px-10 text-base font-black uppercase tracking-widest text-white hover:bg-white/5 hover:text-white transition-all">
                View Trends
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="absolute top-1/2 right-20 hidden xl:block"
          >
             <div className="relative h-56 w-56 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-3xl flex items-center justify-center p-12 shadow-2xl overflow-hidden group/badge">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/badge:opacity-100 transition-opacity duration-700" />
                <div className="text-center relative z-10 transition-transform duration-700 group-hover/badge:scale-110">
                    <p className="text-6xl font-black text-white leading-none">40%</p>
                    <p className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] mt-2">Off Selection</p>
                </div>
                <div className="absolute -top-4 -right-4 bg-primary p-4 rounded-[1.5rem] shadow-2xl rotate-12 group-hover/badge:rotate-0 transition-transform duration-500">
                    <Zap className="h-6 w-6 text-white fill-white" />
                </div>
             </div>
          </motion.div>
        </section>
      )}

      {/* Featured Categories */}
      {!keyword && (
        <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary">
                        <Layers className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Infrastructure</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight">Browse Taxonomy</h2>
                </div>
                <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest group">
                    Full Spectrum <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        onClick={() => navigate(category === cat.name.toLowerCase() ? '/' : `/category/${cat.name.toLowerCase()}`)}
                        className={cn(
                            "group relative h-64 rounded-[2.5rem] border bg-card p-10 flex flex-col justify-between overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:shadow-primary/5",
                            category === cat.name.toLowerCase() ? "border-primary ring-2 ring-primary/20 shadow-xl shadow-primary/5" : "border-border/50 hover:border-primary/30"
                        )}
                    >
                        <div className={cn("absolute -top-24 -right-24 h-48 w-48 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20", cat.color)} />
                        
                        <div className="bg-muted w-fit p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            <cat.icon className="h-6 w-6" />
                        </div>
                        
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black tracking-tight">{cat.name}</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">{cat.count}</p>
                        </div>
                        
                        <div className="absolute bottom-10 right-10 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-2">
                            <ArrowRight className="h-6 w-6 text-primary" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
      )}

      {/* Product Feed */}
      <section ref={productsRef} className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary">
                <ShoppingBag className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{keyword ? 'Search results' : 'Distribution'}</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight italic">
              {keyword ? `Results for "${keyword}"` : 'Curated Assets'}
            </h2>
          </div>

          <div className="bg-muted/30 p-1.5 rounded-2xl border border-border/20 flex gap-1">
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/search/trending')}
                className={cn(
                    "rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all",
                    keyword === 'trending' ? "bg-background shadow-sm text-primary" : "opacity-40"
                )}
             >
                Trending
             </Button>
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/search/exclusive')}
                className={cn(
                    "rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all",
                    keyword === 'exclusive' ? "bg-background shadow-sm text-primary" : "opacity-40"
                )}
             >
                Exclusive
             </Button>
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className={cn(
                    "rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all",
                    !keyword ? "bg-background shadow-sm text-primary" : "opacity-40"
                )}
             >
                All Assets
             </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-40 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50 max-w-4xl mx-auto space-y-8">
            <div className="mx-auto w-24 h-24 rounded-[2.5rem] bg-muted/50 flex items-center justify-center shadow-inner">
               <Cpu className="h-10 w-10 text-muted-foreground/30 animate-pulse" />
            </div>
            <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tight">Zero Matches Located</h3>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto">Our identity filters returned no active units matching this specific query protocol.</p>
            </div>
            <Button variant="outline" className="h-14 rounded-2xl px-10 font-black uppercase tracking-widest border-border hover:bg-muted transition-all" onClick={() => navigate('/')}>Reset Feed</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            <AnimatePresence>
                {products.map((product, idx) => (
                <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                >
                    <ProductCard product={product} />
                </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Brand Showcase */}
      {!keyword && (
          <section className="bg-foreground rounded-[3rem] p-4 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-20 opacity-[0.05] pointer-events-none">
                  <Globe className="h-96 w-96 text-white" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-12 md:p-20 border border-white/5">
                  <div className="space-y-8">
                      <div className="space-y-4">
                          <h2 className="text-5xl font-black text-white tracking-tighter leading-none">The Official <br /> Distribution Hub.</h2>
                          <p className="text-white/40 font-medium text-lg leading-relaxed max-w-sm">
                            We partner exclusively with elite manufacturers to ensure product integrity and innovative superiority.
                          </p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                          <Button className="h-12 rounded-xl px-8 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Explore Partnerships</Button>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                      {brands.map((brand) => (
                          <div key={brand.name} className="p-8 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all cursor-crosshair">
                              <div className="text-4xl font-black text-white/20 group-hover:text-primary transition-colors group-hover:scale-110 transition-transform duration-500 mb-4">{brand.logo}</div>
                              <h4 className="text-white font-black text-lg">{brand.name}</h4>
                              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mt-1">{brand.desc}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      )}

      {/* Newsletter/Mailing List - Premium CTA */}
      {!keyword && (
        <section className="relative px-8 py-24 rounded-[4rem] flex flex-col items-center text-center space-y-12 bg-card border border-border/50 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            <div className="relative">
                <div className="p-6 bg-primary/10 rounded-3xl text-primary shadow-2xl shadow-primary/20 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <Rocket className="h-10 w-10 fill-primary/20" />
                </div>
            </div>
            
            <div className="max-w-xl space-y-4 relative z-10">
                <h2 className="text-5xl font-black tracking-tighter">Stay Ahead.</h2>
                <p className="text-muted-foreground font-medium text-lg">Join the world's most elite tech distribution list. Rare units, early drops, and secret directives.</p>
            </div>

            <div className="flex w-full max-w-lg gap-3 p-2 bg-muted/30 border border-border/50 rounded-3xl shadow-inner focus-within:ring-2 focus-within:ring-primary/20 transition-all group/input">
                <input type="email" placeholder="terminal@domain.com" className="flex-grow bg-transparent px-6 py-4 outline-none text-sm font-black uppercase tracking-widest" />
                <Button className="rounded-2xl px-10 h-14 font-black text-[10px] uppercase tracking-widest shadow-xl">Connect Feed</Button>
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">End-to-end encrypted distribution</p>
        </section>
      )}
    </div>
  );
};

export default HomePage;
