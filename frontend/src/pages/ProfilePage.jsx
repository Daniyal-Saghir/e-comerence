import { useSelector, useDispatch } from 'react-redux';
import { useGetMyOrdersQuery } from '@/redux/slices/ordersApiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, CheckCircle2, Clock, ShoppingBag, ArrowRight, Calendar, Package, ChevronRight, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { logout } from '@/redux/slices/authSlice';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetMyOrdersQuery();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const orders = response?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Title & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Personal Workspace</h1>
          <p className="text-muted-foreground font-medium">Manage your boutique experience and track your premium acquisitions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full shadow-sm">
            <Settings className="h-4 w-4 mr-2" /> Account Settings
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="rounded-full text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Profile Identity Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            {/* Background Decorative Element */}
            <div className="absolute -top-12 -right-12 h-32 w-32 bg-primary/20 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="relative group">
                <div className="w-28 h-28 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white backdrop-blur-xl group-hover:scale-105 transition-transform duration-500">
                  <User className="w-12 h-12 opacity-80" />
                </div>
                {userInfo.role === 'admin' && (
                  <div className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-2xl shadow-xl flex items-center justify-center border-4 border-foreground" title="Administrator Privileges">
                    <Shield className="w-4 h-4 fill-current" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-white">{userInfo.name}</h2>
                <p className="text-sm text-white/40 font-medium">{userInfo.email}</p>
              </div>

              <div className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
                userInfo.role === 'admin' ? "bg-amber-500/20 border-amber-500/30 text-amber-400" : "bg-white/10 border-white/10 text-white/60"
              )}>
                {userInfo.role} Environment
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-white/5 space-y-6 relative z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Entry Milestone
                </span>
                <span className="text-white/60 font-bold">{new Date(userInfo.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
                  <Shield className="h-3 w-3" /> Security Class
                </span>
                <span className="text-white/60 font-bold">Encrypted OAuth</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats / Help Box */}
          <div className="p-8 rounded-[2.5rem] bg-muted/30 border border-border/50 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center opacity-60">
              <Package className="w-4 h-4 mr-2" /> Asset Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 p-4 rounded-2xl border border-border/50 text-center">
                <span className="block text-2xl font-black tracking-tighter">{orders.length}</span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Orders</span>
              </div>
              <div className="bg-background/50 p-4 rounded-2xl border border-border/50 text-center">
                <span className="block text-2xl font-black tracking-tighter tabular-nums">${orders.reduce((acc, o) => acc + o.totalPrice, 0).toFixed(0)}</span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Investment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Activity Feed (Orders) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 space-y-10"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-primary" />
              Acquisition History
            </h2>
            <div className="flex gap-1 bg-muted p-1 rounded-full">
              <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase h-7 px-4 bg-background shadow-sm">All</Button>
              <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase h-7 px-4 opacity-40">Active</Button>
              <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase h-7 px-4 opacity-40">Delivered</Button>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-primary/20" /></div>
            ) : error ? (
              <div className="px-10 py-20 bg-destructive/5 rounded-[3rem] text-center border-2 border-dashed border-destructive/20 space-y-4">
                <div className="mx-auto h-12 w-12 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center">
                  <Package className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-destructive">Fetch Interrupt</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">We encountered an issue while retrieving your history. Please refresh the environment.</p>
                </div>
                <Button variant="outline" className="rounded-full px-8 text-destructive">Retry Connection</Button>
              </div>
            ) : orders.length === 0 ? (
              <div className="px-10 py-32 bg-muted/20 rounded-[3rem] text-center space-y-8 border-2 border-dashed border-border/50">
                <div className="relative inline-block">
                  <div className="p-8 bg-background rounded-[2rem] border shadow-2xl">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">Begin your journey</h3>
                  <p className="text-muted-foreground font-medium max-w-sm mx-auto">Your collection is waiting for its first item. Explore our curated selection of premium technology.</p>
                </div>
                <Link to="/">
                  <Button size="lg" className="rounded-2xl px-12 py-7 font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Explore Shop
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                  <Link key={order._id} to={`/order/${order._id}`} className="block">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group relative p-8 bg-card rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all flex flex-col sm:flex-row justify-between items-center gap-8"
                    >
                      <div className="flex items-center gap-6 w-full sm:w-auto">
                        <div className="h-16 w-16 bg-muted/50 rounded-2xl flex items-center justify-center text-primary/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Package className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono text-muted-foreground/40 group-hover:text-primary/40 transition-colors">ID: {order._id.substring(order._id.length - 8).toUpperCase()}</p>
                          <h4 className="font-black text-2xl tracking-tighter tabular-nums">${order.totalPrice.toFixed(2)}</h4>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground/40" />
                            <span className="text-xs text-muted-foreground font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                            order.isPaid ? "bg-emerald-500/10 text-emerald-600 shadow-sm border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 shadow-sm border border-amber-500/20"
                          )}>
                            {order.isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 text-amber-500 animate-pulse" />}
                            {order.isPaid ? 'Cleared' : 'Pending'}
                          </div>
                          <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                            order.isDelivered ? "bg-blue-500/10 text-blue-600 shadow-sm border border-blue-500/20" : "bg-muted text-muted-foreground shadow-sm border border-border"
                          )}>
                            {order.isDelivered ? <Truck className="w-3 h-3" /> : <Package className="w-3 h-3 opacity-40" />}
                            {order.isDelivered ? 'Delivered' : 'Process'}
                          </div>
                        </div>

                        <div className="hidden sm:flex h-12 w-12 bg-muted group-hover:bg-primary group-hover:text-primary-foreground rounded-2xl items-center justify-center transition-all duration-500 shadow-inner group-hover:rotate-12">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const Loader2 = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);



const ChevronLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default ProfilePage;
