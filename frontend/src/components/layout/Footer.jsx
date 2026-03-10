import { Link } from 'react-router-dom';
import { ShoppingBag, Github, Twitter, Instagram, Mail, ShieldCheck, Zap, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card border-t border-border/50 pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t from-primary/5 to-transparent -z-10" />
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">
          
          {/* Brand & Mission */}
          <div className="space-y-8 col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">
                Boutique<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xs">
              Elevating the digital commerce experience through premium design, seamless interactions, and global logistics excellence.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Architecture (Links) */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Architecture</h4>
            <ul className="space-y-4">
              {['Collections', 'Trending', 'New Arrivals', 'Bestsellers'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative group w-fit block">
                    {item}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Node */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Support Node</h4>
            <ul className="space-y-4">
              {['Secure Delivery', 'Returns Protocol', 'Terms of Registry', 'Privacy Encryption'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative group w-fit block">
                    {item}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Terminal */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Communications</h4>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              Join our global distribution network for exclusive asset updates.
            </p>
            <div className="relative group/field">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
                <input 
                    type="email" 
                    placeholder="terminal@domain.com"
                    className="h-12 w-full pl-11 pr-4 bg-muted/50 border border-border/50 rounded-xl text-xs font-bold transition-all outline-none focus:bg-background focus:ring-2 focus:ring-primary/20"
                />
            </div>
            <Button className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Subscribe to Feed
            </Button>
          </div>
        </div>

        {/* System Credits */}
        <div className="pt-12 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> SSL Encrypted</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4" /> Optimized Core</div>
            <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> Global CDN</div>
          </div>
          
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-2">
            © {currentYear} BOUTIQUE. ENGINEERED WITH <Heart className="h-3 w-3 text-red-500 fill-current mx-1 animate-pulse" /> FOR EXCELLENCE.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
