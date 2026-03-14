import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useLoginMutation } from '@/redux/slices/usersApiSlice';
import { setCredentials } from '@/redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2, ChevronLeft, ArrowRight, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    
    if (password !== confirmPassword) {
      setErrorMsg('Access keys do not match synchronization requirements.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      const token = await userCredential.user.getIdToken();
      const res = await login(token).unwrap();
      dispatch(setCredentials({ ...res.data }));
    } catch (err) {
      setErrorMsg(err?.message || 'Initialization protocol failed.');
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />
      
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
                    <UserPlus className="w-6 h-6" />
                </motion.div>
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-black tracking-tighter">Initialize Identity</h1>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Genesis Registration Protocol</p>
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
                <div className="grid grid-cols-1 gap-4">
                    <div className="group/field space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Legal Identity Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within/field:text-primary" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 w-full pl-11 pr-4 bg-muted/50 border border-border/50 rounded-xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none font-bold transition-all text-xs"
                                placeholder="Full Name"
                            />
                        </div>
                    </div>

                    <div className="group/field space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Communications Channel</label>
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="group/field space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Secret Key</label>
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

                        <div className="group/field space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Confirm Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within/field:text-primary" />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-12 w-full pl-11 pr-4 bg-muted/50 border border-border/50 rounded-xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none font-bold transition-all text-xs"
                                    placeholder="••••••••"
                                />
                            </div>
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
                            Initialize Protocol
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </form>

            <div className="pt-6 text-center border-t border-border/50">
                <p className="text-[10px] font-medium text-muted-foreground">
                    Already recognized by the system?{' '}
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-primary font-black uppercase tracking-widest hover:underline inline-flex items-center ml-1 transition-colors">
                        Sign In Now <ChevronLeft className="w-3 h-3 ml-1 rotate-180" />
                    </Link>
                </p>
            </div>
            
            <div className="flex justify-center gap-6 text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
                <div className="flex items-center gap-1.5"><ShieldCheck className="h-2.5 w-2.5" /> Secure Node</div>
                <div className="flex items-center gap-1.5"><Sparkles className="h-2.5 w-2.5" /> Premium UI</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-2.5 w-2.5" /> Verified</div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
