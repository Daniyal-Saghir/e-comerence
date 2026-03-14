import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  
  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, qty: 1 }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-card rounded-[2rem] border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden flex flex-col h-full perspective-1000"
    >
      {/* 3D Inner Content */}
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="flex flex-col h-full">
        {/* Image Container */}
        <Link 
          to={`/product/${product._id}`} 
          className="relative aspect-[4/5] overflow-hidden bg-muted block m-3 rounded-[1.5rem] shadow-inner"
        >
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
          />
          
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                  <Eye className="h-3 w-3" />
              </Button>
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
                <div className="bg-primary/90 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg tracking-widest uppercase">
                    Featured
                </div>
            )}
            {product.countInStock === 0 && (
                <div className="bg-destructive/90 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg tracking-widest uppercase">
                    Sold Out
                </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="px-5 pb-5 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
              {product.category}
            </span>
            <div className="flex items-center text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span className="text-[8px] ml-1 font-black tabular-nums">{product.rating}</span>
            </div>
          </div>

          <Link to={`/product/${product._id}`} className="block mb-1 group-hover:text-primary transition-colors">
            <h3 className="font-black text-[13px] tracking-tight leading-tight line-clamp-1 italic uppercase">{product.name}</h3>
          </Link>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[7px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">SKU: {product.sku || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
            <div className="flex flex-col">
              <span className="text-[7px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">Value</span>
              <span className="text-sm font-black text-foreground tabular-nums tracking-tighter">${product.price.toFixed(2)}</span>
            </div>
            
            <Button
              size="icon"
              onClick={addToCartHandler}
              disabled={product.countInStock === 0 || added}
              className={cn(
                  "h-9 w-9 rounded-xl shadow-lg transition-all active:scale-90",
                  added ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-primary shadow-primary/20 hover:shadow-primary/40"
              )}
            >
              <AnimatePresence mode="wait">
                  {added ? (
                      <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                      >
                          <Check className="w-4 h-4" />
                      </motion.div>
                  ) : (
                      <motion.div
                          key="cart"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                      >
                          <ShoppingCart className="w-4 h-4" />
                      </motion.div>
                  )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
