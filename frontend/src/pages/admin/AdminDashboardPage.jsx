import { motion } from 'framer-motion';
import { Users, Package, ShoppingCart, TrendingUp, ArrowRight, ShieldCheck, UserPlus, BoxSelect, DollarSign, Activity, ShoppingBag, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '@/redux/slices/usersApiSlice';
import { useGetOrdersQuery } from '@/redux/slices/ordersApiSlice';
import { useGetProductsQuery } from '@/redux/slices/productsApiSlice';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AdminDashboardPage = () => {
  const { data: usersResponse } = useGetUsersQuery();
  const { data: ordersResponse } = useGetOrdersQuery();
  const { data: productsResponse } = useGetProductsQuery();

  const orders = ordersResponse?.data || [];
  const paidOrders = orders.filter(o => o.isPaid);
  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.totalPrice, 0);

  const stats = [
    { 
        label: 'Total Users', 
        value: usersResponse?.count || 0, 
        change: '+12%', 
        icon: Users, 
        color: 'blue', 
        path: '/admin/userlist' 
    },
    { 
        label: 'Inventory', 
        value: productsResponse?.count || 0, 
        change: '+5%', 
        icon: Package, 
        color: 'emerald', 
        path: '/admin/productlist' 
    },
    { 
        label: 'Active Orders', 
        value: ordersResponse?.count || 0, 
        change: '+18%', 
        icon: ShoppingCart, 
        color: 'amber', 
        path: '/admin/orderlist' 
    },
    { 
        label: 'Gross Revenue', 
        value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        change: '+24%', 
        icon: DollarSign, 
        color: 'indigo', 
        path: '/admin/orderlist' 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h1 className="text-4xl font-black tracking-tight">Control Center</h1>
          </div>
          <p className="text-muted-foreground font-medium">Internal operational command and real-time boutique analytics.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full shadow-sm font-bold">
                <Activity className="h-4 w-4 mr-2" /> Live Monitor
            </Button>
            <Button className="rounded-full font-black shadow-xl shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" /> Global Update
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-8 bg-card border border-border/50 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden"
          >
            {/* Background Accent */}
             <div className={cn(
                 "absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity",
                 `bg-${stat.color}-500`
             )} />
            
            <div className="flex flex-col h-full justify-between gap-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className={cn(
                    "p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3",
                    `bg-${stat.color}-500 text-white`
                )}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Performance</span>
                    <span className="text-xs font-bold text-emerald-500">{stat.change}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-black tracking-tighter tabular-nums">{stat.value}</p>
              </div>

              <Link to={stat.path}>
                <Button variant="ghost" size="sm" className="w-full justify-between rounded-xl h-10 group/btn">
                    <span className="text-[10px] font-black uppercase tracking-widest">Deep Analytics</span>
                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        {/* Management hub */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.4 }} 
            className="lg:col-span-7 space-y-8"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                    <Layers className="h-4 w-4" />
                </div>
                <h3 className="text-2xl font-black tracking-tight tracking-tight">Operations Management</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link to="/admin/productlist" className="group relative p-10 bg-card rounded-[3rem] border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-2xl transition-all">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-5 bg-muted rounded-[2rem] group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner group-hover:rotate-6">
                            <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <span className="block font-black text-xl tracking-tight">Inventory Control</span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">348 SKU Registered</span>
                        </div>
                    </div>
                </Link>
                <Link to="/admin/userlist" className="group relative p-10 bg-card rounded-[3rem] border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-2xl transition-all">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-5 bg-muted rounded-[2rem] group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-inner group-hover:-rotate-6">
                            <Users className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <span className="block font-black text-xl tracking-tight">Resident Database</span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">1.2k Active Citizens</span>
                        </div>
                    </div>
                </Link>
                <Link to="/admin/orderlist" className="group relative p-10 bg-foreground text-background rounded-[3rem] shadow-2xl col-span-1 sm:col-span-2 overflow-hidden transition-all hover:scale-[1.01]">
                    {/* Background Decorative */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp className="h-24 w-24" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="p-5 bg-white/10 rounded-[2rem] shadow-lg">
                                <ShoppingCart className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-1">
                                <span className="block font-black text-2xl tracking-tighter">Financial Logbook</span>
                                <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em]">Transaction Monitoring & Logistics</span>
                            </div>
                        </div>
                        <Button className="bg-white text-black hover:bg-white/90 rounded-2xl px-8 h-14 font-black text-sm">
                            Open Finances
                        </Button>
                    </div>
                </Link>
            </div>
        </motion.div>

        {/* Status hub */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.5 }} 
            className="lg:col-span-5 space-y-8"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                    <BoxSelect className="h-4 w-4" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">System Integrity</h3>
            </div>

            <div className="p-2 rounded-[2.5rem] bg-muted/30 border border-border/50 overflow-hidden space-y-1">
                <div className="p-8 bg-card rounded-[2rem] shadow-sm flex items-center justify-between group transition-all hover:bg-muted/5">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Mainframe Status</span>
                            <span className="font-bold text-sm">Operational Excellence — 100%</span>
                        </div>
                    </div>
                    <Activity className="h-4 w-4 text-muted-foreground/20 group-hover:text-emerald-500 transition-colors" />
                </div>
                
                <div className="p-8 bg-card rounded-[2rem] shadow-sm flex items-center justify-between group transition-all hover:bg-muted/5">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Synchronization</span>
                            <span className="font-bold text-sm">Real-time DB Clusters Active</span>
                        </div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground/20 group-hover:text-blue-500 transition-colors" />
                </div>

                <div className="p-10 text-center space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                        Last security audit was performed <span className="text-foreground">2 hours ago</span>. All protocols validated and secure.
                    </p>
                    <div className="flex justify-center gap-2">
                        <div className="h-1.5 w-8 rounded-full bg-primary/20" />
                        <div className="h-1.5 w-8 rounded-full bg-primary/20" />
                        <div className="h-1.5 w-12 rounded-full bg-primary" />
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

const Plus = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
);

export default AdminDashboardPage;
