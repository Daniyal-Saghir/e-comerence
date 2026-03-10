import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '@/redux/slices/cartSlice';
import CheckoutSteps from '@/components/CheckoutSteps';
import { motion } from 'framer-motion';
import { MapPin, Building2, Globe, Send, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <CheckoutSteps step1 step2 />
      
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Visual/Context Sidebar */}
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col space-y-8"
        >
            <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter leading-tight">Where should we <br/><span className="text-primary italic">deliver?</span></h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Provide your destination details to continue. We offer priority global shipping to ensure your tech arrives safely and swiftly.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-8">
                <div className="flex items-center gap-4 p-5 rounded-3xl bg-muted/30 border border-border/50">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <Truck className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase">Priority Network</span>
                        <span className="text-xs text-muted-foreground">Standard 3-5 day international transit</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-3xl bg-muted/30 border border-border/50">
                    <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase">Safe Arrival</span>
                        <span className="text-xs text-muted-foreground">Fully insured and trackable delivery</span>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-[2.5rem] border border-border/50 shadow-2xl p-10 space-y-10 relative overflow-hidden"
        >
            {/* Background Accent */}
             <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
             
             <div className="space-y-2 relative z-10 text-center lg:text-left">
                <h2 className="text-2xl font-black tracking-tight">Shipping Address</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Destination Profile</p>
             </div>

            <form onSubmit={submitHandler} className="space-y-8 relative z-10">
              <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Street Address</label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            required
                            placeholder="Unit, Floor, Building, Street..."
                            className="w-full bg-muted/40 border border-border rounded-2xl px-12 py-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-background transition-all text-sm font-bold"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City / Region</label>
                        <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                required
                                placeholder="City"
                                className="w-full bg-muted/40 border border-border rounded-2xl px-12 py-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-background transition-all text-sm font-bold"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Postal Code</label>
                        <div className="relative group">
                            <Send className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                required
                                placeholder="Zip"
                                className="w-full bg-muted/40 border border-border rounded-2xl px-12 py-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-background transition-all text-sm font-bold"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Country</label>
                    <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            required
                            placeholder="Country"
                            className="w-full bg-muted/40 border border-border rounded-2xl px-12 py-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-background transition-all text-sm font-bold"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-8 rounded-2xl font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                Save & Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
        </motion.div>
      </div>

      {/* Mobile-only Context Info */}
      <div className="lg:hidden grid grid-cols-1 gap-4 pt-4">
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-muted/30 border border-border/50">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Global Priority Shipping Available</span>
            </div>
      </div>
    </div>
  );
};

// Internal mini-truck icon since lucide might not have all variations
const Truck = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><path d="M16 18h3a1 1 0 0 0 1-1v-4.34a1 1 0 0 0-.29-.71l-2.66-2.65A1 1 0 0 0 16.34 9H14"/><circle cx="18" cy="18" r="2"/>
    </svg>
);

export default ShippingPage;
