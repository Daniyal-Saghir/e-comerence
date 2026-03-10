import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '@/redux/slices/cartSlice';
import CheckoutSteps from '@/components/CheckoutSteps';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, ArrowRight, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PaymentPage = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  const methods = [
    { 
        id: 'PayPal', 
        name: 'PayPal or Global Credit Card', 
        desc: 'Fast, secure and convenient. Support for all major cards.',
        icon: CreditCard,
        color: 'blue'
    },
    { 
        id: 'Stripe', 
        name: 'Stripe Direct Payment', 
        desc: 'Pay directly with your card for an instant transaction experience.',
        icon: Wallet,
        color: 'indigo'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <CheckoutSteps step1 step2 step3 />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Decorative Side */}
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col space-y-10"
        >
            <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter leading-tight">Secure your <br/><span className="text-primary italic">Investment.</span></h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Choose your preferred payment gateway. All transactions are encrypted and processed through industry-leading secure networks.
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-3xl bg-foreground text-background shadow-2xl">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-widest">End-to-End Encryption</span>
                        <span className="text-xs text-white/40">Your financial data never touches our servers.</span>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-6 rounded-3xl border border-border bg-muted/30">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-widest">Instant Authorization</span>
                        <span className="text-xs text-muted-foreground">Verification usually takes less than 2 seconds.</span>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-[3rem] border border-border/50 shadow-2xl p-10 space-y-10 relative overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-[80px] -z-10" />

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Payment Gateway</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Select Transaction Channel</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-10">
            <div className="space-y-4">
              {methods.map((method) => (
                <label
                  key={method.id}
                  className={cn(
                    "flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 group",
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5 shadow-xl shadow-primary/5"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/10"
                  )}
                >
                  <div className={cn(
                      "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 shrink-0",
                      paymentMethod === method.id 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "bg-muted text-muted-foreground"
                  )}>
                    <method.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-grow space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                        <span className="font-bold text-base tracking-tight">{method.name}</span>
                        {paymentMethod === method.id && (
                            <motion.div layoutId="check" className="h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-2 w-2 text-white stroke-[4]" />
                            </motion.div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{method.desc}</p>
                  </div>

                  <input
                    type="radio"
                    className="hidden"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full py-8 rounded-2xl font-black text-base shadow-xl active:scale-95 transition-all group"
              >
                Proceed to Review
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => navigate('/shipping')}
                className="w-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Destination
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale pt-12">
          <span className="text-sm font-black tracking-tighter">VISA</span>
          <span className="text-sm font-black tracking-tighter">MASTERCARD</span>
          <span className="text-sm font-black tracking-tighter">PAYPAL</span>
          <span className="text-sm font-black tracking-tighter">STRIPE</span>
          <span className="text-sm font-black tracking-tighter">APPLE PAY</span>
      </div>
    </div>
  );
};

const Check = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);

export default PaymentPage;
