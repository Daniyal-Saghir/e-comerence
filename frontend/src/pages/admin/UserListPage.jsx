import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '@/redux/slices/usersApiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, UserCog, CheckCircle2, XCircle, Shield, User, Loader2, Mail, Calendar, Search, MoreVertical, ShieldCheck, UserMinus, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const UserListPage = () => {
  const { data: response, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const deleteHandler = async (id) => {
    if (window.confirm('Definitively remove this user from the system?')) {
      try {
        await deleteUser(id).unwrap();
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleStatusHandler = async (user) => {
    try {
      await updateUser({ userId: user._id, isActive: !user.isActive }).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleRoleHandler = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    try {
      await updateUser({ userId: user._id, role: newRole }).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary/20" />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Indexing Residents...</p>
    </div>
  );

  const users = response?.data || [];
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-12">
        <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">Resident Directory</h1>
            <p className="text-muted-foreground font-medium">Global authority view of all registered entities and permission levels.</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by identity..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 w-64 pl-12 pr-6 bg-muted/50 border border-border/50 rounded-2xl focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium text-sm"
                />
            </div>
            <div className="bg-primary/5 text-primary px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-primary/10">
                {users.length} Total Records
            </div>
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="relative group">
          {/* Glassmorphism Background Accent */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
          
          <div className="relative bg-card border border-border/50 rounded-[2.5rem] shadow-sm overflow-hidden backdrop-blur-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Subject Identity</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Authorization Class</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Logistics State</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Registration</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.03 }}
                        className="group/row hover:bg-muted/10 transition-colors relative"
                      >
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover/row:scale-110 transition-transform duration-500">
                                        <span className="text-xl font-black">{user.name.charAt(0)}</span>
                                    </div>
                                    <div className={cn(
                                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card",
                                        user.isActive ? "bg-emerald-500" : "bg-destructive"
                                    )} />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-black text-lg tracking-tight leading-none group-hover/row:text-primary transition-colors">{user.name}</h4>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="h-3 w-3" />
                                        <span className="text-xs font-medium tracking-tight opacity-60">{user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <Button 
                                variant="ghost" 
                                onClick={() => toggleRoleHandler(user)}
                                className={cn(
                                    "h-auto py-2.5 px-4 rounded-2xl border transition-all active:scale-95 group/role",
                                    user.role === 'admin' 
                                        ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 shadow-lg shadow-indigo-500/5" 
                                        : "bg-slate-500/10 border-slate-500/20 text-slate-400 hover:bg-slate-500/20"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    {user.role === 'admin' ? <ShieldCheck className="w-4 h-4 transition-transform group-hover/role:rotate-12" /> : <User className="w-4 h-4" />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                                </div>
                            </Button>
                        </td>
                        <td className="px-8 py-6">
                            <Button 
                                variant="ghost" 
                                onClick={() => toggleStatusHandler(user)}
                                className={cn(
                                    "h-auto py-2.5 px-4 rounded-2xl border transition-all active:scale-95 group/status",
                                    user.isActive 
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/5" 
                                        : "bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/20"
                                )}
                            >
                                <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                    {user.isActive ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                    {user.isActive ? 'Active' : 'Restricted'}
                                </div>
                            </Button>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-muted-foreground/40 group-hover/row:text-primary/40 transition-colors">
                                    <Calendar className="h-3 w-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Enrollment</span>
                                </div>
                                <span className="text-sm font-bold tracking-tight">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-10 w-10 rounded-xl bg-muted/50 border-border/50 hover:bg-primary/10 hover:text-primary transition-all opacity-0 group-hover/row:opacity-100 translate-x-4 group-hover/row:translate-x-0"
                                >
                                    <UserCog className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => deleteHandler(user._id)}
                                    disabled={loadingDelete}
                                    className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all opacity-0 group-hover/row:opacity-100 translate-x-4 group-hover/row:translate-x-0 delay-75"
                                >
                                    {loadingDelete ? <Loader2 className="h-4 w-4 animate-spin text-destructive/20" /> : <UserMinus className="h-4 w-4" />}
                                </Button>
                            </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="p-24 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground/30">
                        <Search className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black">Zero Identities Located</h3>
                        <p className="text-sm text-muted-foreground font-medium">We could not find any resident matching your query.</p>
                    </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default UserListPage;
