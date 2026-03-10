import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetOrderDetailsQuery, usePayOrderMutation, useDeliverOrderMutation } from '@/redux/slices/ordersApiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, ShoppingBag, CheckCircle2, Clock, Loader2, AlertCircle, Package, Truck, ShieldCheck, Mail, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const { data: response, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

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
      <div className="max-w-2xl mx-auto my-20 p-12 bg-destructive/5 rounded-[3rem] border border-dashed border-destructive/20 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-destructive">Record Not Found</h2>
          <p className="text-muted-foreground font-medium">{error?.data?.message || 'We could not retrieve the details for this order ID.'}</p>
        </div>
        <Link to="/" className="inline-block mt-4">
          <Button variant="outline" className="rounded-full px-8">Return to Store</Button>
        </Link>
      </div>
    );
  }

  const order = response?.data;

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const payHandler = async () => {
    try {
      await payOrder({ orderId, details: { id: 'SIMULATED_ID', status: 'COMPLETED', update_time: new Date().toISOString(), payer: { email_address: userInfo.email } } }).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-4xl font-black tracking-tight">Order Insight</h1>
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            Order ID <span className="text-foreground bg-muted px-2 py-0.5 rounded font-mono lowercase">{order._id}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border",
            order.isPaid ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-amber-500/10 border-amber-500/20 text-amber-600"
          )}>
            {order.isPaid ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {order.isPaid ? 'Payment Confirmed' : 'Payment Required'}
          </div>
          <div className={cn(
            "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border",
            order.isDelivered ? "bg-blue-500/10 border-blue-500/20 text-blue-600" : "bg-muted border-border text-muted-foreground"
          )}>
            {order.isDelivered ? <Truck className="h-3 w-3" /> : <Package className="h-3 w-3" />}
            {order.isDelivered ? 'Consignment Delivered' : 'In Processing'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Detailed Breakdown */}
        <div className="lg:col-span-8 space-y-8">

          {/* Status Timeline / Logic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Status */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-sm space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Truck className="h-16 w-16" />
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <MapPin className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-primary/60">Shipping Destination</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recipient</span>
                    <span className="font-bold text-sm tracking-tight">{order.user.name}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Notification Channel</span>
                    <span className="font-bold text-sm tracking-tight">{order.user.email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-2 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Standard Delivery Address</span>
                    <span className="font-bold text-sm leading-relaxed">{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</span>
                  </div>
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-2xl flex items-center gap-3 border text-xs font-bold",
                order.isDelivered ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-blue-500/10 border-blue-500/20 text-blue-600"
              )}>
                {order.isDelivered ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Priority Shipment Processing'}
              </div>
            </motion.div>

            {/* Payment Tracking */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-sm space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CreditCard className="h-16 w-16" />
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-primary/60">Financial Status</h2>
              </div>

              <div className="space-y-6 flex-grow">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-foreground text-background rounded-[1.25rem] flex items-center justify-center shadow-lg">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transaction Method</span>
                    <span className="font-bold text-base tracking-tight">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current State</span>
                  <div className={cn(
                    "p-4 rounded-2xl flex items-center gap-3 border text-xs font-bold w-full",
                    order.isPaid ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-amber-500/10 border-amber-500/20 text-amber-600"
                  )}>
                    {order.isPaid ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    {order.isPaid ? `Authorized on ${new Date(order.paidAt).toLocaleDateString()}` : 'Financial Clearing Required'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Consignment Items */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-10 rounded-[2.5rem] bg-card border border-border/50 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-border/50 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Package className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-black tracking-tight">Product Verification</h2>
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {order.orderItems.length} Consigned Item{order.orderItems.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="divide-y divide-border/50">
              {order.orderItems.map((item, index) => (
                <div key={index} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-center justify-between gap-6 group">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden border border-border/50 shrink-0 group-hover:shadow-lg transition-all">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="space-y-1">
                      <Link to={`/product/${item.product}`} className="text-base font-black tracking-tight hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Premium Unit</span>
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

        {/* Financial Summary Sidebar */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-foreground text-background rounded-[3rem] p-10 shadow-2xl space-y-10 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />

            <div className="space-y-2 relative z-10">
              <h3 className="text-3xl font-black tracking-tighter">Valuation</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Financial Record</p>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-4 font-medium">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40 uppercase tracking-widest text-[10px]">Net Value</span>
                  <span className="text-lg font-black tabular-nums">${(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40 uppercase tracking-widest text-[10px]">Priority Freight</span>
                  <span className="text-sm font-black text-emerald-400">
                    {order.shippingPrice === 0 ? 'COMPLIMENTARY' : `$${order.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40 uppercase tracking-widest text-[10px]">Regulatory VAT</span>
                  <span className="text-sm font-black tabular-nums text-white/80">${order.taxPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-1">
                <div className="flex justify-between items-end">
                  <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Gross Investment</span>
                  <span className="text-5xl font-black tabular-nums text-white tracking-tighter">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                {!order.isPaid && (
                  <Button
                    onClick={payHandler}
                    disabled={loadingPay}
                    className="w-full bg-white text-black hover:bg-white/90 h-20 rounded-2xl font-black text-lg shadow-xl shadow-white/5 active:scale-95 transition-all group"
                  >
                    {loadingPay ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        Authorize Payment
                        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                )}

                {userInfo && userInfo.role === 'admin' && order.isPaid && !order.isDelivered && (
                  <Button
                    onClick={deliverHandler}
                    disabled={loadingDeliver}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 h-20 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all group"
                  >
                    {loadingDeliver ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        Finalize Shipment
                        <Truck className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                )}

                <p className="text-[10px] text-center text-white/20 font-medium leading-snug max-w-[240px] mx-auto">
                  This order is verified and secured. Reference ID: {order._id.substring(0, 8)} for all inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default OrderPage;
