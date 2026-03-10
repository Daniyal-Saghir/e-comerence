import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateOrderMutation } from '@/redux/slices/ordersApiSlice';
import { clearCartItems } from '@/redux/slices/cartSlice';
import CheckoutSteps from '@/components/CheckoutSteps';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, ShoppingBag, ArrowRight, Loader2, Info, CheckCircle2, Package, Truck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems.map((item) => ({
          ...item,
          product: item._id,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Review Content */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">Final Review</h1>
            <p className="text-muted-foreground font-medium">Verify your selection and details before finalizing your order.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Summary */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-sm space-y-4 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MapPin className="h-12 w-12" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                        <Truck className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-primary/60">Destination</h2>
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-lg leading-tight">{cart.shippingAddress.address}</p>
                    <p className="text-sm text-muted-foreground font-medium">{cart.shippingAddress.city}, {cart.shippingAddress.postalCode}</p>
                    <p className="text-sm text-muted-foreground font-medium">{cart.shippingAddress.country}</p>
                </div>
                <Link to="/shipping">
                    <Button variant="ghost" size="sm" className="mt-4 rounded-full text-[10px] font-black uppercase tracking-widest">Edit Address</Button>
                </Link>
            </motion.div>

            {/* Payment Summary */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-sm space-y-4 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CreditCard className="h-12 w-12" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-primary/60">Payment</h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg leading-tight">{cart.paymentMethod}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Secure Gateway</span>
                    </div>
                </div>
                <Link to="/payment">
                    <Button variant="ghost" size="sm" className="mt-4 rounded-full text-[10px] font-black uppercase tracking-widest">Change Method</Button>
                </Link>
            </motion.div>
          </div>

          {/* Items Review */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-10 rounded-[2.5rem] bg-card border border-border/50 shadow-sm space-y-8"
          >
            <div className="flex items-center justify-between border-b border-border/50 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                        <Package className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-black tracking-tight">Consignment Items</h2>
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {cart.cartItems.length} Unique Product{cart.cartItems.length !== 1 ? 's' : ''}
                </span>
            </div>
            
            <div className="divide-y divide-border/50">
              {cart.cartItems.map((item, index) => (
                <div key={index} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-center justify-between gap-6 group">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden border border-border/50 shrink-0 group-hover:shadow-lg transition-all">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="space-y-1">
                      <Link to={`/product/${item._id}`} className="text-base font-black tracking-tight hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{item.brand}</span>
                          <div className="h-1 w-1 rounded-full bg-border" />
                          <span className="text-xs text-muted-foreground font-medium">{item.qty} unit{item.qty !== 1 ? 's' : ''} × ${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-lg tabular-nums shrink-0">${(item.qty * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-foreground text-background rounded-[3rem] p-10 shadow-2xl space-y-10 relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
             
            <div className="space-y-2 relative z-10">
                <h3 className="text-3xl font-black tracking-tighter">Order Summary</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Commitment Summary</p>
            </div>

            {error && (
              <div className="p-5 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-2xl flex items-start gap-3 relative z-10">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-bold">{error?.data?.message || 'Transaction could not be initialized'}</span>
              </div>
            )}

            <div className="space-y-8 relative z-10">
              <div className="space-y-4 font-medium">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40 uppercase tracking-widest">Subtotal</span>
                  <span className="text-lg font-black tabular-nums">${cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40 uppercase tracking-widest">Priority Network Shipping</span>
                  <span className="text-sm font-black text-emerald-400">
                    {Number(cart.shippingPrice) === 0 ? 'COMPLIMENTARY' : `$${cart.shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40 uppercase tracking-widest">Regulatory VAT (15%)</span>
                  <span className="text-sm font-black tabular-nums text-white/80">${cart.taxPrice}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-1">
                <div className="flex justify-between items-end">
                    <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Total Value</span>
                    <span className="text-5xl font-black tabular-nums text-white tracking-tighter">${cart.totalPrice}</span>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <Button
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                  className="w-full bg-white text-black hover:bg-white/90 h-20 rounded-2xl font-black text-lg shadow-xl shadow-white/5 active:scale-95 transition-all group"
                >
                  {isLoading ? (
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <>
                      Complete Purchase
                      <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3 border border-white/5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <p className="text-[10px] font-bold text-white/40 leading-snug">
                        By completing this transaction, you authorize the secure charge of the total amount shown.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
