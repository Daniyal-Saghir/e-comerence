import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden flex flex-col h-full"
    >
      {/* Image Container */}
      <Link 
        to={`/product/${product._id}`} 
        className="relative aspect-[4/5] overflow-hidden bg-muted block"
      >
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button size="icon" variant="secondary" className="rounded-full scale-90 group-hover:scale-100 transition-transform duration-300">
                <Eye className="h-4 w-4" />
            </Button>
        </div>

        {product.countInStock === 0 ? (
          <div className="absolute top-3 right-3 bg-destructive/90 backdrop-blur-md text-destructive-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
            SOLD OUT
          </div>
        ) : product.price < 50 ? (
           <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
            BEST VALUE
          </div>
        ) : null}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-transparent to-muted/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded">
            {product.category}
          </span>
          <div className="flex items-center text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] ml-1 font-bold">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product._id}`} className="block mb-2 group-hover:text-primary transition-colors">
          <h3 className="font-bold text-base leading-tight line-clamp-1">{product.name}</h3>
        </Link>
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-grow leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Starting from</span>
            <span className="text-xl font-black text-foreground tabular-nums">${product.price.toFixed(2)}</span>
          </div>
          
          <Button
            size="icon"
            onClick={addToCartHandler}
            disabled={product.countInStock === 0 || added}
            className={cn(
                "rounded-xl shadow-lg transition-all active:scale-95",
                added ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "shadow-primary/20 hover:shadow-primary/40"
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
    </motion.div>
  );
};

export default ProductCard;
