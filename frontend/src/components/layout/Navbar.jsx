import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, LayoutDashboard, Menu, Sparkles, ShieldCheck, ShoppingBag, Fingerprint, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setShowMobileSearch(false);
    } else {
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={cn(
        scrolled ? "py-2" : "py-4"
    )}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-8">
        
        {/* Glassmorphism Background */}
        <div className={cn(
            "absolute inset-x-4 md:inset-x-8 top-0 h-full rounded-[2rem] border transition-all duration-500 -z-10",
            scrolled 
                ? "bg-background/80 backdrop-blur-2xl border-border/50 shadow-2xl shadow-primary/5 translate-y-0" 
                : "bg-transparent border-transparent translate-y-2"
        )} />

        {/* Brand/Logo */}
        <Link to="/" className="relative group shrink-0">
          <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20 rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500">
                  <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase group-hover:text-primary transition-colors">
                  Boutique<span className="text-primary group-hover:text-foreground">.</span>
              </span>
          </div>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full" />
        </Link>

        {/* Dynamic Navigation Core - Hidden on small screens */}
        <div className="hidden lg:flex items-center gap-1 bg-muted/30 p-1 rounded-2xl border border-border/20 backdrop-blur-sm">
            {[
                { name: 'Collections', path: '/' },
                { name: 'Trending', path: '/search/trending' },
                { name: 'Exclusive', path: '/search/exclusive' }
            ].map((link) => (
                <Link key={link.name} to={link.path}>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                            "rounded-xl px-4 font-black text-[10px] uppercase tracking-widest transition-all",
                            isActive(link.path) ? "bg-background text-primary shadow-sm" : "hover:bg-background/50"
                        )}
                    >
                        {link.name}
                    </Button>
                </Link>
            ))}
        </div>

        {/* Functional Cluster */}
        <div className="flex items-center gap-3">
          
          {/* Search Functionality */}
          <form onSubmit={submitHandler} className="hidden xl:flex relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
                <input
                    type="search"
                    placeholder="Discover gems..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="h-10 w-40 focus:w-56 pl-10 pr-4 bg-muted/30 border border-border/10 rounded-xl text-[10px] font-bold transition-all outline-none focus:bg-background focus:ring-2 focus:ring-primary/20"
                />
          </form>

          <div className="h-8 w-px bg-border/40 mx-2 hidden sm:block" />

          {/* Cart Interaction */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative group/cart h-10 w-10 rounded-xl hover:bg-primary/10 transition-colors">
              <ShoppingCart className="h-4.5 w-4.5 group-hover/cart:scale-110 transition-transform" />
              <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-background shadow-lg shadow-primary/20"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
              </AnimatePresence>
            </Button>
          </Link>

          {/* User Status / Authentication */}
          {userInfo ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button 
                    variant="outline" 
                    className={cn(
                        "h-10 rounded-xl px-3 flex items-center gap-2 border-border/30 hover:border-primary/30 transition-all group",
                        isActive('/profile') ? "bg-primary/5 border-primary/20" : "bg-muted/10"
                    )}
                >
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest leading-none">{userInfo.name.split(' ')[0]}</span>
                </Button>
              </Link>
              
              <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block" />

              {userInfo.role === 'admin' && (
                <Link to="/admin/dashboard">
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl hover:bg-primary/10 text-primary transition-all">
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-11 w-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 transition-all hover:bg-muted/50">Terminal Access</Button>
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest px-6 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Initialize</Button>
              </Link>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden h-11 w-11 rounded-xl"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            {showMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden absolute top-full left-0 right-0 p-4 bg-background/80 backdrop-blur-2xl border-b border-border/50 z-50"
            >
                <form onSubmit={submitHandler} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        autoFocus
                        placeholder="Search assets..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="h-14 w-full pl-12 pr-6 bg-muted/50 border border-border/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </form>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
