import { useGetOrdersQuery } from '@/redux/slices/ordersApiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle2, Clock, ShoppingCart, ArrowRight, Loader2, User, Calendar, DollarSign, Package, Truck, Search, Filter, Hash, MoreVertical, CreditCard, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const OrderListPage = () => {
  const { data: response, isLoading, error } = useGetOrdersQuery();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary/20" />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Synchronizing Logistics...</p>
    </div>
  );

  const orders = response?.data || [];
  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.user && o.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-12">
        <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">Financial Logistics</h1>
            <p className="text-muted-foreground font-medium">Real-time monitoring of global transactions and fulfillment cycles.</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by Order ID or Client..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 w-64 pl-12 pr-6 bg-muted/50 border border-border/50 rounded-2xl focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium text-sm"
                />
            </div>
            <div className="bg-primary/5 text-primary px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-primary/10">
                {orders.length} Managed Orders
            </div>
        </div>
      </div>

      {/* Logistics Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="p-8 bg-card border border-border/50 rounded-[2.5rem] flex flex-col gap-4 group hover:shadow-2xl hover:shadow-primary/5 transition-all">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit group-hover:rotate-6 transition-transform">
                  <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gross Volume</span>
                  <p className="text-2xl font-black tabular-nums">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
              </div>
          </div>
          <div className="p-8 bg-card border border-border/50 rounded-[2.5rem] flex flex-col gap-4 group hover:shadow-2xl hover:shadow-emerald-500/5 transition-all">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit group-hover:rotate-6 transition-transform">
                  <CreditCard className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clearance Rate</span>
                  <p className="text-2xl font-black tabular-nums text-emerald-500">
                    {orders.length > 0 ? Math.round((orders.filter(o => o.isPaid).length / orders.length) * 100) : 0}%
                  </p>
              </div>
          </div>
          <div className="p-8 bg-card border border-border/50 rounded-[2.5rem] flex flex-col gap-4 group hover:shadow-2xl hover:shadow-blue-500/5 transition-all">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl w-fit group-hover:rotate-6 transition-transform">
                  <Truck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Distributed</span>
                  <p className="text-2xl font-black tabular-nums text-blue-500">{orders.filter(o => o.isDelivered).length}</p>
              </div>
          </div>
          <div className="p-8 bg-card border border-border/50 rounded-[2.5rem] flex flex-col gap-4 group hover:shadow-2xl hover:shadow-amber-500/5 transition-all">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl w-fit group-hover:rotate-6 transition-transform">
                  <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Action</span>
                  <p className="text-2xl font-black tabular-nums text-amber-500">{orders.filter(o => !o.isPaid || !o.isDelivered).length}</p>
              </div>
          </div>
      </div>

      {/* Transaction Records Table */}
      <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/15 to-transparent rounded-[3rem] blur-3xl opacity-20" />
          
          <div className="relative bg-card border border-border/50 rounded-[3rem] shadow-sm overflow-hidden backdrop-blur-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/50">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Protocol ID</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Beneficiary</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Asset Value</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Clearance</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Distributions</th>
                    <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="group/row hover:bg-muted/10 transition-all relative"
                      >
                        <td className="px-10 py-8">
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover/row:text-primary transition-colors">
                                    #{order._id.substring(order._id.length - 12).toUpperCase()}
                                </span>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-3 w-3 opacity-40" />
                                    <span className="text-xs font-bold tracking-tight">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground/40 group-hover/row:bg-primary/10 group-hover:text-primary transition-all duration-500">
                                    <User className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-sm tracking-tight">{order.user ? order.user.name : 'Unknown Subject'}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Registered User</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-10 py-8">
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter tabular-nums">${order.totalPrice.toFixed(2)}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Gross Amount</span>
                            </div>
                        </td>
                        <td className="px-10 py-8">
                            <div className={cn(
                                "inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm",
                                order.isPaid 
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover/row:bg-emerald-500/20" 
                                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            )}>
                                {order.isPaid ? <ShieldCheck className="w-3 h-3 mr-2" /> : <Clock className="w-3 h-3 mr-2 animate-pulse" />}
                                {order.isPaid ? 'Authorized' : 'Awaiting Pay'}
                            </div>
                        </td>
                        <td className="px-10 py-8">
                            <div className={cn(
                                "inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm",
                                order.isDelivered 
                                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover/row:bg-blue-500/20" 
                                    : "bg-muted border-border text-muted-foreground/60"
                            )}>
                                {order.isDelivered ? <Truck className="w-3 h-3 mr-2" /> : <Package className="w-3 h-3 mr-2 opacity-40" />}
                                {order.isDelivered ? 'Dispatched' : 'Warehouse'}
                            </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                            <Link to={`/order/${order._id}`}>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-12 w-12 rounded-2xl bg-muted/50 border-border/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover/row:opacity-100 group-hover/row:rotate-12"
                                >
                                    <Eye className="h-5 w-5" />
                                </Button>
                            </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="p-32 text-center space-y-6">
                    <div className="mx-auto w-24 h-24 bg-muted rounded-[2.5rem] flex items-center justify-center text-muted-foreground/20 shadow-inner">
                        <Hash className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black">Data Fragmented</h3>
                        <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">We could not match any transaction log to your current filter. Please adjust your criteria.</p>
                    </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default OrderListPage;
