import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '@/redux/slices/productsApiSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, ShoppingCart, Check, XCircle, ShieldCheck, Truck, RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ProductDetailsPage = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: response, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

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

  const product = response?.data;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Link to="/" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
        <div className="p-2 mr-2 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all">
          <ChevronLeft className="w-4 h-4" />
        </div>
        Back to Results
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Gallery Section */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
           className="sticky top-24"
        >
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-muted border shadow-2xl group">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
            {product.countInStock === 0 && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                 <div className="bg-destructive text-destructive-foreground px-6 py-2 rounded-full font-black tracking-widest text-sm shadow-xl">
                    OUT OF STOCK
                 </div>
              </div>
            )}
          </div>
          
          {/* Thumbnails Placeholder could go here */}
        </motion.div>

        {/* Product Details Section */}
        <div className="flex flex-col space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest uppercase">
               {product.brand}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-foreground">{product.name}</h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-full border border-amber-500/20">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{product.rating}</span>
                <span className="text-xs opacity-60 ml-1">({product.numReviews} active reviews)</span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                {product.category}
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Price</span>
            <div className="text-5xl font-black tracking-tighter tabular-nums text-foreground">
              ${product.price.toFixed(2)}
            </div>
          </div>

          <div className="space-y-3">
             <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">About this product</span>
             <p className="text-lg text-muted-foreground leading-relaxed">
               {product.description}
             </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y py-8">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                    <Truck className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase">Free Shipping</span>
                    <span className="text-[10px] text-muted-foreground">On all local orders</span>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                    <RefreshCw className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase">45-Day Returns</span>
                    <span className="text-[10px] text-muted-foreground">No questions asked</span>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase">Certified Refurbished</span>
                    <span className="text-[10px] text-muted-foreground">Manufacturer warranty</span>
                </div>
             </div>
          </div>

          {/* Action Panel */}
          <div className="p-8 rounded-[2rem] bg-muted/30 border border-border shadow-inner space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider">Availability</span>
              {product.countInStock > 0 ? (
                <div className="inline-flex items-center gap-2 text-emerald-600 font-bold px-3 py-1 bg-emerald-500/10 rounded-full text-xs">
                  <Check className="w-3 h-3" /> In Stock
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-destructive font-bold px-3 py-1 bg-destructive/10 rounded-full text-xs">
                  <XCircle className="w-3 h-3" /> Out of Stock
                </div>
              )}
            </div>

            {product.countInStock > 0 && (
              <div className="flex items-center justify-between gap-8">
                <span className="text-sm font-bold uppercase tracking-wider whitespace-nowrap">Quantity</span>
                <div className="flex items-center bg-background border rounded-xl overflow-hidden p-1 shadow-sm w-full max-w-[140px]">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-lg h-10 w-10 shrink-0"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                    >-</Button>
                    <span className="flex-grow text-center font-bold text-lg">{qty}</span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-lg h-10 w-10 shrink-0"
                        onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    >+</Button>
                </div>
              </div>
            )}

            <Button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full py-8 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <ShoppingCart className="w-6 h-6" />
              Add To Cart — ${(product.price * qty).toFixed(2)}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="pt-20 space-y-12">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                Community Feedback
            </h2>
            {userInfo && (
                <Button variant="outline" className="rounded-full font-bold">Write a Review</Button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
                {product.reviews.length === 0 ? (
                    <div className="px-10 py-16 rounded-[2.5rem] bg-muted/20 border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-muted text-muted-foreground/40 rounded-2xl">
                            <Star className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold">No reviews yet</h3>
                            <p className="text-sm text-muted-foreground max-w-xs">Be the first to share your thoughts about this product and help our community.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {product.reviews.map(review => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                key={review._id} 
                                className="p-8 rounded-3xl border border-border/50 bg-card hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{review.name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase opacity-60 font-black">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="sticky top-24 h-fit">
                {userInfo ? (
                    <form onSubmit={submitHandler} className="space-y-8 p-10 rounded-[2.5rem] border border-border bg-card shadow-2xl relative overflow-hidden">
                        {/* Decorative Background for the form */}
                        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
                        
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black tracking-tight">Post Your Experience</h3>
                            <p className="text-sm text-muted-foreground">Honest feedback helps us provide better tech for everyone.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setRating(num)}
                                            className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                                                rating >= num 
                                                    ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" 
                                                    : "bg-muted border-transparent text-muted-foreground hover:bg-muted/80"
                                            )}
                                        >
                                            <Star className={cn("h-4 w-4", rating >= num && "fill-current")} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Thoughts</label>
                                <textarea
                                    rows="4"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-muted/40 border-border border rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-background transition-all text-sm font-medium"
                                    placeholder="What do you love most about this product?"
                                ></textarea>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loadingReview || rating === 0}
                            className="w-full py-7 rounded-2xl font-black text-base shadow-xl active:scale-95 transition-all"
                        >
                            {loadingReview ? "Publishing..." : "Submit Review"}
                        </Button>
                    </form>
                ) : (
                    <div className="p-10 rounded-[2.5rem] bg-foreground text-background text-center space-y-6">
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Write a review</h3>
                            <p className="text-sm text-white/60">Join our community to rank this product and help others decide.</p>
                        </div>
                        <Link to="/login" className="block">
                            <Button className="w-full bg-white text-black hover:bg-white/90 rounded-2xl font-bold py-6">Sign In Now</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
