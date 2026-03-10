import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { addToCart, removeFromCart } from '@/redux/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                <ShoppingBag className="h-10 w-10 text-primary" />
                Your Cart
            </h1>
            <p className="text-muted-foreground font-medium">
                {totalItems === 0 ? "Your bag is currently empty." : `You have ${totalItems} premium items in your selection.`}
            </p>
        </div>
        
        {cartItems.length > 0 && (
            <Link to="/">
                <Button variant="ghost" className="rounded-full font-bold group">
                    <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Continue Shopping
                </Button>
            </Link>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 space-y-8 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-border"
          >
            <div className="relative">
                <div className="p-8 bg-background rounded-[2rem] border shadow-2xl relative z-10">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
                </div>
                <div className="absolute -top-4 -right-4 h-8 w-8 bg-primary/10 rounded-full blur-xl animate-pulse" />
            </div>
            
            <div className="text-center space-y-2 max-w-sm">
              <h2 className="text-2xl font-black">Empty Collection</h2>
              <p className="text-muted-foreground font-medium">Looks like you haven&apos;t discovered your next upgrade yet. Start exploring our latest drops.</p>
            </div>
            
            <Link to="/">
              <Button size="lg" className="rounded-2xl px-10 py-7 text-base font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Explore Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                    className="group relative flex flex-col sm:flex-row items-center gap-6 p-6 bg-card rounded-[2rem] border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
                  >
                    {/* Item Image */}
                    <Link to={`/product/${item._id}`} className="relative w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-muted shrink-0 group-hover:shadow-lg transition-all">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      {item.countInStock < 5 && item.countInStock > 0 && (
                          <div className="absolute bottom-2 left-2 right-2 bg-amber-500/90 backdrop-blur-md text-[8px] font-black text-white text-center py-1 rounded-full uppercase tracking-tighter">
                              Only {item.countInStock} Left
                          </div>
                      )}
                    </Link>
                    
                    {/* Item Info */}
                    <div className="flex-grow space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
                              {item.category}
                          </span>
                      </div>
                      <Link to={`/product/${item._id}`} className="block text-lg font-black tracking-tight leading-tight hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground font-medium">{item.brand}</p>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                        <div className="text-xl font-black tabular-nums">${item.price.toFixed(2)}</div>
                        <div className="h-4 w-px bg-border hidden sm:block" />
                        <div className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            item.countInStock > 0 ? "text-emerald-500" : "text-destructive"
                        )}>
                            {item.countInStock > 0 ? "Ready to ship" : "Unavailable"}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center bg-muted/50 rounded-xl p-1 border shadow-inner">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={item.qty <= 1}
                            onClick={() => addToCartHandler(item, Math.max(1, item.qty - 1))}
                            className={cn("h-8 w-8 rounded-lg", item.qty <= 1 && "opacity-20")}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-10 text-center text-sm font-black tabular-nums">{item.qty}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={item.qty >= item.countInStock}
                            onClick={() => addToCartHandler(item, Math.min(item.countInStock, item.qty + 1))}
                            className={cn("h-8 w-8 rounded-lg", item.qty >= item.countInStock && "opacity-20")}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCartHandler(item._id)}
                          className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Shopping Features Overlay */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 opacity-60">
                <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Global Express Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">2-Year Secure Warranty</span>
                </div>
                <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Multi-Pay Encrypted</span>
                </div>
              </div>
            </div>

            {/* Checkout Summary Card */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="p-8 bg-foreground text-background rounded-[2.5rem] shadow-2xl space-y-10 relative overflow-hidden">
                {/* Decorative Element */}
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/20 blur-[80px]" />
                
                <div className="space-y-2 relative z-10">
                    <h3 className="text-2xl font-black tracking-tight">Order Summary</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Checkout Breakdown</p>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="space-y-4 font-medium">
                    <div className="flex justify-between items-center group cursor-help">
                      <span className="text-white/60 text-sm flex items-center gap-2">
                        Subtotal <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{totalItems} items</span>
                      </span>
                      <span className="text-lg font-black tabular-nums">${cart.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Priority Shipping</span>
                      <span className="text-sm font-bold text-emerald-400 tabular-nums">
                        {Number(cart.shippingPrice) === 0 ? "FREE" : `$${cart.shippingPrice}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Estimated VAT</span>
                      <span className="text-sm font-bold tabular-nums">${cart.taxPrice}</span>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10 space-y-1">
                    <div className="flex justify-between items-end">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Total Investment</span>
                        <span className="text-4xl font-black tabular-nums text-white">${cart.totalPrice}</span>
                    </div>
                  </div>

                  <div className="pt-6 space-y-4">
                    <Button
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                      className="w-full bg-white text-black hover:bg-white/90 h-16 rounded-2xl font-black text-base shadow-xl active:scale-95 transition-all group"
                    >
                      Checkout Now
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-[10px] text-center text-white/30 font-medium">
                        Standard encrypted checkout powered by Stripe & PayPal. By proceeding, you agree to our premium service terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;
