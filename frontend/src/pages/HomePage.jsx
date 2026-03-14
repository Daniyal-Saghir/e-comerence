import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '@/redux/slices/productsApiSlice';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Sparkles, Zap, Laptop, Smartphone, Headphones, Watch, Layers, Cpu, Globe, Rocket, Box } from 'lucide-react';
import { useRef, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

import { MagneticButton, TiltCard } from '@/components/PremiumInteractions';

const HomePage = () => {
  const { keyword, category } = useParams();
  const navigate = useNavigate();
  const productsRef = useRef(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);

  const categories = [
    { name: 'Computing', id: 'computing', icon: Laptop, count: '12+ Units', color: 'bg-blue-500' },
    { name: 'Mobile', id: 'mobile', icon: Smartphone, count: '24+ Units', color: 'bg-emerald-500' },
    { name: 'Audio', id: 'audio', icon: Headphones, count: '18+ Units', color: 'bg-purple-500' },
    { name: 'Wearables', id: 'wearables', icon: Watch, count: '8+ Units', color: 'bg-amber-500' }
  ];

  const brands = [
    { name: 'Apple', logo: '', desc: 'Premium Innovation' },
    { name: 'Samsung', logo: 'S', desc: 'Global Excellence' },
    { name: 'Sony', logo: 'S', desc: 'Acoustic Mastery' },
    { name: 'Microsoft', logo: 'M', desc: 'Limitless Potential' }
  ];

  return (
    <div ref={containerRef} className="pb-32 overflow-hidden scroll-smooth">
      {/* Hero Section - Full Viewport */}
      {!keyword && (
        <section className="relative h-screen flex items-center overflow-hidden -mt-24 bg-background">
          {/* Multi-layered Parallax Background */}
          <div className="absolute inset-0 z-0">
            <motion.div
              style={{ y: heroY, scale: heroScale }}
              className="absolute inset-0 opacity-20"
            >
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] animate-pulse" />
            </motion.div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 glass-premium px-5 py-2 rounded-full"
              >
                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/70">Protocol v9.0 Active</span>
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl md:text-9xl font-black tracking-tighter text-foreground leading-[0.8] uppercase italic"
                >
                  Future <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-accent">Avenue.</span>
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-foreground/40 font-bold max-w-sm uppercase tracking-widest text-xs leading-relaxed"
              >
                Engineered for the elite. High-performance computing, minimalist design, and uncompromised quality.
              </motion.p>

              <div className="flex gap-6">
                <MagneticButton strength={30}>
                  <Button onClick={scrollToProducts} className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                    Enter Shop <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </MagneticButton>
              </div>
            </div>

            {/* Hero Interactive Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="hidden lg:block relative"
            >
              <TiltCard intensity={20}>
                <div className="glass-premium p-12 rounded-[4rem] aspect-square flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Rocket className="h-24 w-24 text-primary animate-bounce mb-4" />
                  <div>
                    <span className="text-6xl font-black text-foreground tracking-widest tabular-nums">1.5K+</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/40 mt-2">Deployments logged</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-foreground/20">
            <span className="text-[8px] font-black uppercase tracking-[0.6em]">Scroll to Initialize</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-10 w-[1px] bg-gradient-to-b from-foreground/20 to-transparent"
            />
          </div>
        </section>
      )}

      {/* Featured Spotlight - Viewport filling */}
      {!keyword && featuredProducts.length > 0 && (
        <section className="min-h-screen flex flex-col justify-center py-20 bg-background relative overflow-hidden">
          {/* Background elements for Spotlight */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            className="flex flex-col items-center text-center space-y-6 max-w-[1440px] mx-auto px-6 md:px-12 w-full mb-16"
          >
            <div className="flex items-center gap-3 text-accent bg-accent/5 px-4 py-1 rounded-full border border-accent/10">
              <Sparkles className="h-4 w-4" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Elite Curation</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-[calc(-0.05em)] uppercase italic leading-none text-foreground">Featured <br />Spotlight.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full">
            {featuredProducts.map((p, idx) => (
              <TiltCard key={p._id} intensity={15}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="relative h-[650px] rounded-[3.5rem] overflow-hidden group shadow-2xl border border-border/50"
                >
                  <img src={p.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={p.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                  <div className="absolute bottom-0 left-0 right-0 p-10 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-8 bg-primary rounded-full" />
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">{p.category}</span>
                      </div>
                      <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">{p.name}</h3>
                    </div>
                    <Button
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="w-full h-16 rounded-[1.5rem] bg-white text-black hover:bg-primary hover:text-white border-none font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      View Asset Protocols
                    </Button>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </section>
      )}

      {/* Browse Taxonomy - Redesigned Viewport filling */}
      {!keyword && (
        <section className="min-h-screen flex flex-col justify-center py-20 bg-muted/10">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full space-y-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-10"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Layers className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Network Architecture</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tight italic uppercase text-foreground leading-none">Taxonomy.</h2>
              </div>
              <MagneticButton strength={20}>
                <Button onClick={() => navigate('/shop')} variant="outline" className="font-black text-[10px] uppercase tracking-widest border-border/50 glass-premium rounded-2xl h-16 px-10 group text-foreground">
                  Universal Access <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Button>
              </MagneticButton>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-foreground">
              {categories.map((cat, idx) => (
                <TiltCard key={cat.id} intensity={10}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    onClick={() => navigate(`/shop?category=${cat.id}`)}
                    className="group relative h-[500px] rounded-[3rem] overflow-hidden cursor-pointer border border-border/50"
                  >
                    <div className={cn("absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60", cat.color)} />
                    <div className="absolute inset-0 bg-background/80 group-hover:bg-background/40 transition-all duration-700" />

                    <div className="absolute top-10 left-10 p-5 glass-premium rounded-[2rem] border border-border/10 group-hover:scale-110 transition-transform duration-500">
                      <cat.icon className="h-8 w-8 text-foreground" />
                    </div>

                    <div className="absolute bottom-10 left-10 right-10 space-y-6">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-2">Class Code: 0{idx + 1}</p>
                        <h3 className="text-4xl font-black tracking-tighter italic uppercase leading-none">{cat.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-3">{cat.count} Active Units</p>
                      </div>
                      <div className="h-1 w-12 bg-primary rounded-full" />
                    </div>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Feed - Viewport start */}
      <section ref={productsRef} className="min-h-screen py-16 bg-background relative">
        {/* Subtle separator */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/20 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full space-y-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Box className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] ">{keyword ? 'Search results' : 'Active Inventory'}</span>
              </div>
              <h2 className="text-5xl font-black tracking-tight italic uppercase text-foreground leading-none">
                {keyword ? `Feed: "${keyword}"` : 'The Collection.'}
              </h2>
            </div>

            <div className="glass-premium p-1.5 rounded-2xl border border-border/50 flex gap-1">
              {['trending', 'exclusive', null].map((type) => (
                <Button
                  key={type || 'all'}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(type ? `/search/${type}` : '/')}
                  className={cn(
                    "rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all",
                    (type === keyword || (!type && !keyword)) ? "bg-primary shadow-lg text-primary-foreground" : "text-foreground/40 hover:text-foreground"
                  )}
                >
                  {type || 'All Assets'}
                </Button>
              ))}
            </div>
          </motion.div>

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
        </div>
      </section>

      {/* Brand Showcase */}
      {!keyword && (
        <section className="py-32 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8">
            <div className="glass-premium rounded-[4rem] p-1 md:p-1 lg:p-1 relative overflow-hidden border-none shadow-[0_0_100px_rgba(37,99,235,0.05)]">
              <div className="absolute top-0 right-0 p-40 opacity-[0.03] pointer-events-none rotate-12">
                <Globe className="h-[600px] w-[600px] text-foreground" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-foreground/[0.02] backdrop-blur-3xl rounded-[3.8rem] p-10 md:p-20 border border-border/50">
                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                      <Globe className="h-5 w-5" />
                      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40">Global Logistics</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-none italic uppercase">The Official <br /> Distribution Hub.</h2>
                    <p className="text-foreground/30 font-bold text-sm leading-relaxed max-w-sm uppercase tracking-widest">
                      We partner exclusively with elite manufacturers to ensure product integrity and innovative superiority.
                    </p>
                  </div>
                  <MagneticButton strength={25}>
                    <Button className="h-16 rounded-2xl px-10 font-black text-[10px] uppercase tracking-widest bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-all shadow-2xl">Explore Partnerships</Button>
                  </MagneticButton>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {brands.map((brand) => (
                    <div key={brand.name} className="p-8 glass-card rounded-[2.5rem] group cursor-crosshair">
                      <div className="text-4xl font-black text-foreground/10 group-hover:text-primary transition-colors group-hover:scale-110 transition-transform duration-500 mb-4">{brand.logo}</div>
                      <h4 className="text-foreground font-black text-lg italic uppercase">{brand.name}</h4>
                      <p className="text-foreground/20 text-[9px] uppercase font-black tracking-widest mt-2">{brand.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter/Mailing List - Premium CTA */}
      {!keyword && (
        <section className="pb-40 bg-background">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8">
            <TiltCard intensity={5}>
              <div className="relative p-12 md:py-24 rounded-[4rem] flex flex-col items-center text-center space-y-12 bg-foreground/[0.02] border border-border/50 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50" />

                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="p-6 bg-primary/10 rounded-[2.5rem] text-primary shadow-2xl shadow-primary/20 backdrop-blur-3xl"
                >
                  <Rocket className="h-10 w-10 fill-primary/20" />
                </motion.div>

                <div className="max-w-2xl space-y-6 relative z-10">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground italic uppercase leading-none">Stay Ahead.</h2>
                  <p className="text-foreground/30 font-bold text-sm uppercase tracking-[0.2em] max-w-md mx-auto">Join the world's most elite tech distribution list. Rare units, early drops, and secret directives.</p>
                </div>

                <div className="flex w-full max-w-xl gap-3 p-2 bg-foreground/[0.03] border border-border/50 rounded-[2.5rem] shadow-2xl focus-within:ring-4 focus-within:ring-primary/20 transition-all group/input backdrop-blur-xl">
                  <input type="email" placeholder="terminal@domain.com" className="flex-grow bg-transparent px-8 py-4 outline-none text-[10px] font-black uppercase tracking-widest text-foreground placeholder:text-foreground/10" />
                  <MagneticButton strength={20}>
                    <Button className="rounded-[1.8rem] px-10 h-14 font-black text-[10px] uppercase tracking-widest bg-primary text-primary-foreground shadow-xl hover:scale-105 transition-all">Connect Feed</Button>
                  </MagneticButton>
                </div>

                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.6em] text-foreground/10">
                  <div className="h-[1px] w-12 bg-foreground/10" />
                  <span>End-to-End Encrypted</span>
                  <div className="h-[1px] w-12 bg-foreground/10" />
                </div>
              </div>
            </TiltCard>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
