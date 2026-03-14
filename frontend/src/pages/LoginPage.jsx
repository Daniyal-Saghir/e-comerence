import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { useLoginMutation } from '@/redux/slices/usersApiSlice';
import { setCredentials } from '@/redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, Chrome, Loader2, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const res = await login(token).unwrap();
      dispatch(setCredentials({ ...res.data }));
    } catch (err) {
      setErrorMsg(err?.message || 'Invalid email or password');
      console.error(err);
    }
  };

  const googleLoginHandler = async () => {
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const res = await login(token).unwrap();
      dispatch(setCredentials({ ...res.data }));
    } catch (err) {
      setErrorMsg(err?.message || 'Google Login Failed');
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2rem] blur-xl opacity-20" />
        
        <div className="relative bg-card/90 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] shadow-2xl p-6 md:p-8 space-y-5">
            <div className="space-y-2 text-center">
                <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-1 shadow-inner"
                >
                    <ShieldCheck className="w-6 h-6" />
                </motion.div>
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-black tracking-tighter">Access Terminal</h1>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Secure Authentication Node</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {errorMsg && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 text-destructive"
                    >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{errorMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={submitHandler} className="space-y-6">
                <div className="space-y-4">
                    <div className="group/field space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Secure Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within/field:text-primary" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 w-full pl-11 pr-4 bg-muted/50 border border-border/50 rounded-xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none font-bold transition-all text-xs"
                                placeholder="identity@domain.com"
                            />
                        </div>
                    </div>

                    <div className="group/field space-y-1.5">
                        <div className="flex items-center justify-between px-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Encryption Key</label>
                            <Link to="/login" className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Recovery</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within/field:text-primary" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 w-full pl-11 pr-4 bg-muted/50 border border-border/50 rounded-xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none font-bold transition-all text-xs"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-primary text-white font-black text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            Authenticate
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </form>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center px-4">
                    <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-card px-3 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">External OAuth</span>
                </div>
            </div>

            <Button
                onClick={googleLoginHandler}
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-border/50 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-muted/50 transition-all active:scale-95"
            >
                <div className="bg-white p-1 rounded-full shadow-sm">
                    <Chrome className="w-3.5 h-3.5 text-blue-500" />
                </div>
                Continue with Google
            </Button>

            <div className="pt-4 text-center">
                <p className="text-[10px] font-medium text-muted-foreground">
                    New to the environment?{' '}
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-primary font-black uppercase tracking-widest hover:underline inline-flex items-center ml-1">
                        Initialize Account <Sparkles className="w-3 h-3 ml-1" />
                    </Link>
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
