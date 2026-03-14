import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '@/redux/slices/productsApiSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, ShoppingCart, Check, XCircle, ShieldCheck, Truck, RefreshCw, MessageSquare, Box, Award, Shield, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MagneticButton, TiltCard } from '@/components/PremiumInteractions';

const ProductDetailsPage = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: response, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

  const product = response?.data;

  // Set initial selected image when product data arrives or product changes
  useEffect(() => {
    if (product?.image) {
        setSelectedImage(product.image);
    }
  }, [productId, product?.image]);

  const { userInfo } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-dashed border-destructive/20 max-w-2xl mx-auto my-12">
        <h2 className="text-2xl font-black text-destructive">Product unavailable</h2>
        <p className="text-muted-foreground mt-2">{error?.data?.message || error?.error}</p>
        <Link to="/" className="mt-8 inline-block">
          <Button variant="outline" className="rounded-full">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Store
          </Button>
        </Link>
      </div>
    );
  }

  const displayImage = selectedImage || product?.image;

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      setRating(0);
      setComment('');
      // Toast notification would be nice here
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-32 space-y-20">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link to="/shop" className="inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all group">
            <div className="p-3 mr-4 rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all border border-border/50">
            <ChevronLeft className="w-4 h-4" />
            </div>
            Universal Access / {product.category}
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Gallery Section */}
        <div className="lg:col-span-6 space-y-6 sticky top-24">
          <TiltCard intensity={8}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-muted border border-border/50 shadow-xl group max-w-[550px] mx-auto"
            >
                <AnimatePresence mode="wait">
                    <motion.img
                    key={displayImage}
                    src={displayImage}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="object-cover w-full h-full"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                
                {product.countInStock === 0 && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center">
                    <div className="bg-destructive text-destructive-foreground px-6 py-2 rounded-xl font-black tracking-[0.3em] text-[10px] shadow-2xl uppercase">
                        Protocol Unavailable
                    </div>
                </div>
                )}
            </motion.div>
          </TiltCard>
          
          {/* Thumbnails */}
          {(product.images && product.images.length > 0) && (
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar max-w-[550px] mx-auto">
              {[product.image, ...product.images].map((img, i) => (
                <motion.button 
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-card",
                    img === displayImage ? "border-primary shadow-lg shadow-primary/20" : "border-border/40 opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} className="object-cover w-full h-full rounded-lg" alt={`${product.name} gallery ${i}`} />
                </motion.button>
              ))}
            </div>
          )}

          {/* Description below image for better layout balance */}
          <div className="max-w-[550px] mx-auto pt-6 space-y-6 hidden lg:block border-t border-border/30">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Product Brief</span>
                <span className="text-[9px] font-black text-primary bg-primary/5 px-3 py-1 rounded-md uppercase tracking-widest border border-primary/10">SKU-ID: {product.sku}</span>
            </div>
            <p className="text-base text-muted-foreground leading-[1.6] font-medium">
              {product.description}
            </p>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:col-span-6 flex flex-col space-y-10">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[8px] font-black tracking-[0.4em] uppercase border border-primary/20">
                {product.brand} Protocol
              </span>
              <div className="h-px flex-grow bg-gradient-to-r from-border/50 to-transparent" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[calc(-0.04em)] uppercase italic leading-[0.9] text-foreground"
            >
              {product.name}
            </motion.h1>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-500/20 shadow-inner">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-black italic">{product.rating}</span>
                <span className="text-[9px] uppercase font-black tracking-widest opacity-40 ml-1">Nodes</span>
              </div>
              <div className="px-3 py-1.5 bg-muted/50 rounded-xl border border-border/50 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Class: {product.category}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-8 rounded-[2.5rem] bg-foreground text-background relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[2s]">
                <Box className="h-24 w-24" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 relative z-10">Valuation</span>
            <div className="text-5xl font-black tracking-[calc(-0.04em)] tabular-nums relative z-10 flex items-start">
              <span className="text-2xl mt-1.5 mr-1 opacity-50">$</span>
              {product.price.toFixed(2)}
            </div>
          </div>

          {/* Mobile Description (shown only on small screens) */}
          <div className="lg:hidden space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Brief</span>
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">SKU: {product.sku}</span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              {product.description}
            </p>
          </div>


          {/* Technical Grid */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.specifications.map((spec, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-muted/30 border border-border/50 space-y-2 group hover:bg-muted/50 transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">{spec.key}</span>
                        <p className="text-sm font-black tracking-tight text-foreground">{spec.value}</p>
                    </div>
                ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-border/50">
             <div className="flex flex-col gap-2">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl w-fit">
                    <Truck className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest">Global Logistics</span>
                    <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-[0.1em]">Free Shipping</p>
                </div>
             </div>
             <div className="flex flex-col gap-2">
                <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl w-fit">
                    <RefreshCw className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest">45-Day Sync</span>
                    <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-[0.1em]">Free Returns</p>
                </div>
             </div>
             <div className="flex flex-col gap-2">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl w-fit">
                    <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest">Verified Auth</span>
                    <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-[0.1em]">Guaranteed</p>
                </div>
             </div>
          </div>

          {/* Action Hub */}
          <div className="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-xl space-y-8 relative overflow-hidden group/hub">
            <div className="absolute -top-10 -right-10 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover/hub:scale-150 transition-transform duration-1000" />
            
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Registry</span>
              {product.countInStock > 0 ? (
                <div className="inline-flex items-center gap-2 text-emerald-600 font-black px-3 py-1.5 bg-emerald-500/10 rounded-lg text-[8px] uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Active
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-destructive font-black px-3 py-1.5 bg-destructive/10 rounded-lg text-[8px] uppercase tracking-widest">
                   <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                   Exhausted
                </div>
              )}
            </div>

            {product.countInStock > 0 && (
              <div className="flex items-center justify-between gap-4 relative z-10">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Units</span>
                <div className="flex items-center bg-muted/50 border border-border/50 rounded-lg p-0.5 w-full max-w-[120px] shadow-inner">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-md h-8 w-8 shrink-0 hover:bg-background"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                    >-</Button>
                    <span className="flex-grow text-center font-black tabular-nums text-xs">{qty}</span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-md h-8 w-8 shrink-0 hover:bg-background"
                        onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    >+</Button>
                </div>
              </div>
            )}

            <MagneticButton className="w-full relative z-10" strength={10}>
                <Button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="w-full py-6 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all group"
                >
                <ShoppingCart className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                Initialize — ${(product.price * qty).toFixed(2)}
                </Button>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="pt-24 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground">Sync</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight italic uppercase text-foreground leading-none">
                    Feedback.
                </h2>
            </div>
            {userInfo && (
                <div className="hidden md:block">
                    <MagneticButton strength={15}>
                        <Button variant="outline" className="h-12 px-8 rounded-xl font-black text-[9px] uppercase tracking-widest border-border/50 hover:bg-primary hover:text-primary-foreground transition-all">
                            Review Protocol
                        </Button>
                    </MagneticButton>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-6">
                {product.reviews.length === 0 ? (
                    <div className="px-8 py-20 rounded-[3rem] bg-muted/20 border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="p-6 bg-muted/50 text-muted-foreground/20 rounded-2xl shadow-inner">
                            <Star className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase">No Entries</h3>
                            <p className="text-muted-foreground font-medium max-w-sm mx-auto uppercase text-[8px] tracking-[0.2em]">Be the first to establish a baseline.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {product.reviews.map((review, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                key={review._id} 
                                className="p-8 rounded-[2rem] border border-border/50 bg-card hover:bg-muted/10 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                                    <Award className="h-16 w-16" />
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-black text-lg text-primary border border-primary/20 shadow-inner">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-black italic uppercase tracking-tight">{review.name}</span>
                                                <Shield className="h-2.5 w-2.5 text-emerald-500" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Timer className="h-2.5 w-2.5 text-muted-foreground/40" />
                                                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex text-amber-500 bg-amber-500/5 px-3 py-1 rounded-lg border border-amber-500/10">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'opacity-10'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 p-5 rounded-xl bg-muted/30 border border-border/30 relative z-10">
                                    <p className="text-xs font-medium leading-relaxed italic text-foreground/80">
                                        "{review.comment}"
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="lg:col-span-5">
                <div className="sticky top-24">
                    {userInfo ? (
                        <form onSubmit={submitHandler} className="space-y-8 p-10 rounded-[3rem] border border-border/50 bg-card shadow-xl relative overflow-hidden group/form">
                            <div className="absolute -top-10 -right-10 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover/form:scale-150 transition-transform duration-1000" />
                            
                            <div className="space-y-2 relative z-10">
                                <h3 className="text-3xl font-black tracking-tighter italic uppercase leading-none">Log Intel.</h3>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Performance Report</p>
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                key={num}
                                                type="button"
                                                onClick={() => setRating(num)}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                                                    rating >= num 
                                                        ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30" 
                                                        : "bg-muted border-transparent text-muted-foreground hover:bg-muted/80"
                                                )}
                                            >
                                                <Star className={cn("h-4 w-4", rating >= num && "fill-current")} />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Analysis</label>
                                    <textarea
                                        rows="4"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-muted/30 border-border border rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-background transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-muted-foreground/20"
                                        placeholder="Observations..."
                                    ></textarea>
                                </div>
                            </div>

                            <MagneticButton className="w-full relative z-10" strength={15}>
                                <Button
                                    type="submit"
                                    disabled={loadingReview || rating === 0}
                                    className="w-full py-7 rounded-2xl font-black text-[9px] uppercase tracking-[0.4em] shadow-lg active:scale-95 transition-all"
                                >
                                    {loadingReview ? "Processing..." : "Authorize Entry"}
                                </Button>
                            </MagneticButton>
                        </form>
                    ) : (
                        <div className="p-10 rounded-[3rem] bg-foreground text-background text-center space-y-8 relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-30" />
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-background/10 flex items-center justify-center relative z-10 border border-background/20">
                                <ShieldCheck className="h-8 w-8 text-background" />
                            </div>
                            <div className="space-y-2 relative z-10">
                                <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Access Required.</h3>
                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-background/40 max-w-[150px] mx-auto">Authenticate to provide field data.</p>
                            </div>
                            <MagneticButton className="w-full relative z-10" strength={20}>
                                <Link to="/login">
                                    <Button className="w-full bg-background text-foreground hover:bg-background/90 rounded-2xl font-black text-[9px] uppercase tracking-[0.4em] py-7 shadow-xl">
                                        Authenticate
                                    </Button>
                                </Link>
                            </MagneticButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
