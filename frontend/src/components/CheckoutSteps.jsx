import { Check, Circle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { name: 'Identity', active: step1, path: '/login', desc: 'Secure Access' },
    { name: 'Shipping', active: step2, path: '/shipping', desc: 'Destination' },
    { name: 'Payment', active: step3, path: '/payment', desc: 'Secure Checkout' },
    { name: 'Review', active: step4, path: '/placeorder', desc: 'Finalize' },
  ];

  return (
    <nav className="relative flex items-center justify-between max-w-4xl mx-auto mb-20 px-4">
      {/* Background Line */}
      <div className="absolute top-5 left-10 right-10 h-0.5 bg-border -z-10 hidden sm:block">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(steps.filter(s => s.active).length - 1) * 33.3}%` }}
            className="h-full bg-primary"
          />
      </div>

      {steps.map((step, index) => (
        <div key={step.name} className="flex flex-col items-center group relative">
          <Link
            to={step.path}
            disabled={!step.active}
            className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 z-10",
                step.active 
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                    : "bg-background border-border text-muted-foreground/40"
            )}
          >
            {step.active ? (
              <Check className="w-5 h-5" />
            ) : (
              <span className="text-xs font-black">{index + 1}</span>
            )}
          </Link>
          
          <div className="absolute top-12 flex flex-col items-center w-32 text-center space-y-1">
            <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors",
                step.active ? "text-foreground" : "text-muted-foreground/40"
            )}>
                {step.name}
            </span>
            <span className={cn(
                "text-[8px] font-medium transition-opacity hidden sm:block",
                step.active ? "opacity-40" : "opacity-0"
            )}>
                {step.desc}
            </span>
          </div>
        </div>
      ))}
    </nav>
  );
};

export default CheckoutSteps;
