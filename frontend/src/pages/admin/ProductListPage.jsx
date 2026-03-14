import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation
} from '@/redux/slices/productsApiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit, Plus, Package, Loader2, Star, BoxSelect, MoreVertical, Search, Filter, Layers, Zap, AlertTriangle, ArrowUpRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const ProductListPage = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, error, refetch } = useGetProductsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const deleteHandler = async (id) => {
    if (window.confirm('Definitively remove this asset from inventory?')) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const res = await createProduct().unwrap();
      refetch();
      navigate(`/admin/product/${res.data._id}/edit`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary/20" />
      <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Mapping Assets...</p>
    </div>
  );

  const products = response?.data || [];
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Product Inventory</h1>
          <p className="text-muted-foreground font-medium">Strategic oversight of all store assets and stock availability.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-64 pl-12 pr-6 bg-muted/50 border border-border/50 rounded-2xl focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium text-sm"
            />
          </div>
          <Button
            onClick={createProductHandler}
            disabled={loadingCreate}
            className="h-12 px-8 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            {loadingCreate ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
            New Asset
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border/50 rounded-[2rem] flex items-center justify-between group hover:shadow-lg transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Units</span>
            <p className="text-2xl font-black tabular-nums">{products.length}</p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:rotate-6 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
        </div>
        <div className="p-6 bg-card border border-border/50 rounded-[2rem] flex items-center justify-between group hover:shadow-lg transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">In Stock</span>
            <p className="text-2xl font-black tabular-nums text-emerald-500">{products.filter(p => p.countInStock > 0).length}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:rotate-6 transition-transform">
            <Zap className="h-5 w-5" />
          </div>
        </div>
        <div className="p-6 bg-card border border-border/50 rounded-[2rem] flex items-center justify-between group hover:shadow-lg transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Out of Stock</span>
            <p className="text-2xl font-black tabular-nums text-destructive">{products.filter(p => p.countInStock === 0).length}</p>
          </div>
          <div className="p-3 bg-destructive/10 text-destructive rounded-2xl group-hover:rotate-6 transition-transform">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Inventory Registry */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent rounded-[3rem] blur-2xl opacity-10" />

        <div className="relative bg-card border border-border/50 rounded-[2.5rem] shadow-sm overflow-hidden backdrop-blur-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Product Assignment</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">SKU Reference</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Classification</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Valuation</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Registry Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Modifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.03 }}
                      className="group/row hover:bg-muted/10 transition-colors relative"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden border border-border/50 shrink-0 group-hover/row:shadow-2xl transition-all duration-500">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover/row:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="space-y-1 max-w-[200px]">
                            <h4 className="font-black text-base tracking-tight leading-none group-hover/row:text-primary transition-colors truncate">{product.name}</h4>
                            <div className="flex items-center gap-1.5 text-amber-500">
                              <Star className="h-3 w-3 fill-current" />
                              <span className="text-[10px] font-black tabular-nums">{product.rating}</span>
                              <div className="w-1 h-1 rounded-full bg-border" />
                              <span className="text-[10px] font-bold text-muted-foreground/60">{product.numReviews} Reviews</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary/60">{product.sku || 'N/A'}</span>
                           <span className="text-[9px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-widest">Internal SKU</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black tracking-tight">{product.category}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{product.brand}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xl font-black tracking-tighter tabular-nums">${product.price.toFixed(2)}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Unit Price</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                            <div className={cn(
                            "inline-flex items-center w-fit px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors",
                            product.countInStock > 0
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                : "bg-destructive/10 border-destructive/20 text-destructive"
                            )}>
                            {product.countInStock > 0 ? (
                                <Zap className="h-2.5 w-2.5 mr-1.5" />
                            ) : (
                                <AlertTriangle className="h-2.5 w-2.5 mr-1.5" />
                            )}
                            {product.countInStock > 0 ? `${product.countInStock} Units` : 'Stock Depleted'}
                            </div>

                            {product.isFeatured && (
                                <div className="inline-flex items-center w-fit px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary">
                                    <Sparkles className="h-2.5 w-2.5 mr-1.5" />
                                    Featured
                                </div>
                            )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/product/${product._id}/edit`}>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-xl bg-muted/50 border-border/50 hover:bg-primary/10 hover:text-primary transition-all opacity-0 group-hover/row:opacity-100 translate-x-4 group-hover/row:translate-x-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteHandler(product._id)}
                            disabled={loadingDelete}
                            className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all opacity-0 group-hover/row:opacity-100 translate-x-4 group-hover/row:translate-x-0 delay-75"
                          >
                            {loadingDelete ? <Loader2 className="h-4 w-4 animate-spin text-destructive/20" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="p-32 text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center text-muted-foreground/30 shadow-inner">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black">Archive Empty</h3>
                  <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">No products were found matching your current filters or inventory search.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
