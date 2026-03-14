import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  useGetProductDetailsQuery, 
  useUpdateProductMutation 
} from '@/redux/slices/productsApiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ChevronLeft, Package, FileText, Image as ImageIcon, Tag, Hash, DollarSign, Loader2, Sparkles, AlertCircle, CheckCircle2, CloudUpload, Info, Layers, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [specifications, setSpecifications] = useState([]);

  const { data: response, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

  useEffect(() => {
    if (response?.data) {
      const p = response.data;
      setName(p.name);
      setSku(p.sku || '');
      setPrice(p.price);
      setImage(p.image);
      setImages(p.images || []);
      setBrand(p.brand);
      setCategory(p.category);
      setCountInStock(p.countInStock);
      setDescription(p.description);
      setIsFeatured(p.isFeatured || false);
      
      // Specifications handling: Ensure it stays as an array of {key, value}
      if (p.specifications) {
        if (Array.isArray(p.specifications)) {
          setSpecifications(p.specifications.map(s => ({ key: s.key, value: s.value })));
        } else {
          // Fallback if it somehow comes as an object
          const specArray = Object.entries(p.specifications).map(([key, value]) => ({ key, value }));
          setSpecifications(specArray);
        }
      }
    }
  }, [response]);

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
  };

  const updateSpecification = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecifications(newSpecs);
  };

  const addImage = () => {
    setImages([...images, '']);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const updateImage = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Filter out empty specs
    const filteredSpecs = specifications.filter(spec => spec.key.trim() !== '' && spec.value.trim() !== '');

    try {
      await updateProduct({
        productId,
        name,
        sku,
        price,
        image,
        images,
        brand,
        category,
        countInStock,
        description,
        isFeatured,
        specifications: filteredSpecs,
      }).unwrap();
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
        console.error(err);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary/20" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Initializing Asset Editor...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-32">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
          <Link to="/admin/productlist">
            <Button variant="ghost" className="rounded-full pl-2 pr-6 h-12 hover:bg-muted/50 transition-all font-bold">
                <ChevronLeft className="w-5 h-5 mr-1" /> Return to Inventory
            </Button>
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-2xl border border-border/50">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Record Reference</span>
              <div className="h-4 w-px bg-border mx-1" />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary/60">{productId.substring(productId.length - 12).toUpperCase()}</span>
          </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
        <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary">
                <div className="p-3 bg-primary/10 rounded-2xl shadow-inner">
                    <Sparkles className="h-6 w-6" />
                </div>
                <h1 className="text-4xl font-black tracking-tight">Modify Asset</h1>
            </div>
            <p className="text-muted-foreground font-medium max-w-xl">Fine-tune product specifications, visual representation, and inventory levels for the global catalog.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <Button 
                onClick={submitHandler}
                disabled={loadingUpdate}
                className="h-14 px-10 rounded-2xl font-black text-base shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
            >
                {loadingUpdate ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : (
                    <>
                        <Save className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                        Save Evolution
                    </>
                )}
            </Button>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submitHandler}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
      >
        {/* Left Column: Core Data & Visuals */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Asset Visual System */}
            <div className="p-10 bg-card border border-border/50 rounded-[3rem] shadow-sm space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ImageIcon className="h-24 w-24" />
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <ImageIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight">Visual Identity</h3>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="group/field space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Main Proxy image URL</label>
                                <div className="relative">
                                    <CloudUpload className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within/field:text-primary" />
                                    <input 
                                        type="text" 
                                        value={image} 
                                        onChange={(e) => setImage(e.target.value)} 
                                        required 
                                        className="h-14 w-full pl-12 pr-6 bg-muted/50 border border-border/50 rounded-2xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all" 
                                        placeholder="Main image URL"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="aspect-video rounded-[2rem] bg-muted/50 border-2 border-dashed border-border overflow-hidden flex items-center justify-center group-hover:shadow-2xl transition-all duration-700">
                                {image ? (
                                    <img src={image} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground/30">
                                        <ImageIcon className="h-12 w-12" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Main Render</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Universal Gallery URLs</label>
                            <Button type="button" onClick={addImage} size="sm" variant="ghost" className="rounded-xl h-10 px-4 font-black text-[9px] uppercase tracking-widest">Add Frame</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative group/img">
                                    <input 
                                        type="text" 
                                        value={img} 
                                        onChange={(e) => updateImage(idx, e.target.value)} 
                                        className="h-12 w-full pl-4 pr-12 bg-muted/30 border border-border/50 rounded-xl focus:bg-background outline-none font-medium text-xs transition-all" 
                                        placeholder={`Gallery Image #${idx + 1}`}
                                    />
                                    <Button 
                                        type="button" 
                                        onClick={() => removeImage(idx)}
                                        variant="destructive" 
                                        size="icon" 
                                        className="absolute right-1 top-1 h-10 w-10 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                                    >
                                        <Zap className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Specifications */}
            <div className="p-10 bg-card border border-border/50 rounded-[3rem] shadow-sm space-y-10 group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Zap className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight text-foreground">Technical Specs</h3>
                    </div>
                    <Button type="button" onClick={addSpecification} size="sm" variant="outline" className="rounded-xl h-10 px-4 font-black text-[9px] uppercase tracking-widest border-border hover:bg-muted transition-all">Add Parameter</Button>
                </div>

                <div className="space-y-4">
                    {specifications.map((spec, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-3 group/spec">
                            <div className="col-span-4">
                                <input 
                                    type="text" 
                                    value={spec.key} 
                                    onChange={(e) => updateSpecification(idx, 'key', e.target.value)} 
                                    className="h-12 w-full px-4 bg-muted/50 border border-border/50 rounded-xl focus:bg-background outline-none font-black text-[10px] uppercase tracking-widest placeholder:opacity-30" 
                                    placeholder="Property"
                                />
                            </div>
                            <div className="col-span-7">
                                <input 
                                    type="text" 
                                    value={spec.value} 
                                    onChange={(e) => updateSpecification(idx, 'value', e.target.value)} 
                                    className="h-12 w-full px-4 bg-muted/50 border border-border/50 rounded-xl focus:bg-background outline-none font-bold text-xs" 
                                    placeholder="Value"
                                />
                            </div>
                            <div className="col-span-1">
                                <Button 
                                    type="button" 
                                    onClick={() => removeSpecification(idx)}
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-12 w-full rounded-xl text-destructive hover:bg-destructive/10"
                                >
                                    <Zap className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {specifications.length === 0 && (
                        <div className="text-center py-10 bg-muted/10 rounded-[2rem] border-2 border-dashed border-border/50">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">No technical parameters defined</p>
                        </div>
                    )}
                </div>
            </div>

            {/* In-depth Specifications */}
            <div className="p-10 bg-card border border-border/50 rounded-[3rem] shadow-sm space-y-10 group">
                <div className="flex items-center gap-4 text-primary">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-foreground">Detailed Narrative</h3>
                </div>

                <div className="space-y-3 group/field">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Product Description</label>
                        <span className="text-[10px] font-bold text-muted-foreground/40">{description.length} Characters</span>
                    </div>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        rows="8" 
                        required 
                        className="w-full p-8 bg-muted/50 border border-border/50 rounded-[2rem] focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all resize-none leading-relaxed text-sm"
                        placeholder="Define the technical superiority and usage context of this asset..."
                    ></textarea>
                </div>
            </div>
        </div>

        {/* Right Column: Taxonomy & Valuation */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
            {/* Core Metrics */}
            <div className="p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 h-52 w-52 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="space-y-8 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Layers className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight text-white">System Protocol</h3>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest pl-2">Featured</span>
                            <button
                                type="button"
                                onClick={() => setIsFeatured(!isFeatured)}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-all relative overflow-hidden",
                                    isFeatured ? "bg-primary" : "bg-white/10"
                                )}
                            >
                                <motion.div 
                                    animate={{ x: isFeatured ? 24 : 4 }}
                                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg" 
                                />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2 group/field">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Display Identity</label>
                            <div className="relative">
                                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 transition-colors group-focus-within/field:text-primary" />
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    className="h-16 w-full pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-primary/40 outline-none font-black text-white text-lg transition-all" 
                                    placeholder="Product Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group/field">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">SKU Reference</label>
                            <div className="relative">
                                <Hash className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input 
                                    type="text" 
                                    value={sku} 
                                    onChange={(e) => setSku(e.target.value)} 
                                    className="h-14 w-full pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:ring-2 focus:ring-primary/40 outline-none font-bold text-white text-sm transition-all" 
                                    placeholder="e.g. SKU-12345"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 pt-4">
                            <div className="space-y-2 group/field">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Market Valuation</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 transition-colors group-focus-within/field:text-emerald-400" />
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        value={price} 
                                        onChange={(e) => setPrice(Number(e.target.value))} 
                                        required 
                                        className="h-20 w-full pl-14 pr-6 bg-white/5 border border-white/10 rounded-3xl focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/40 outline-none font-black text-white text-4xl tracking-tighter tabular-nums transition-all" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Classification & Inventory */}
            <div className="p-10 bg-card border border-border/50 rounded-[3rem] shadow-sm space-y-10 group">
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2 group/field">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Manufacturer</label>
                            <input 
                                type="text" 
                                value={brand} 
                                onChange={(e) => setBrand(e.target.value)} 
                                required 
                                className="h-14 w-full px-6 bg-muted/50 border border-border/50 rounded-2xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm transition-all" 
                            />
                        </div>
                        <div className="space-y-2 group/field">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Taxonomy</label>
                            <input 
                                type="text" 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)} 
                                required 
                                className="h-14 w-full px-6 bg-muted/50 border border-border/50 rounded-2xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm transition-all" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2 group/field">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Inventory Availability</label>
                            <span className={cn(
                                "text-[10px] font-black uppercase flex items-center gap-1",
                                countInStock > 0 ? "text-emerald-500" : "text-destructive"
                            )}>
                                {countInStock > 0 ? <Zap className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                {countInStock > 0 ? 'Satisfactory' : 'Critical'}
                            </span>
                        </div>
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                            <input 
                                type="number" 
                                value={countInStock} 
                                onChange={(e) => setCountInStock(Number(e.target.value))} 
                                required 
                                className="h-14 w-full pl-12 pr-6 bg-muted/50 border border-border/50 rounded-2xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none font-black text-lg transition-all" 
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/50">
                    <div className="p-6 bg-muted/20 rounded-2xl border border-border/50 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Global Sync Active</span>
                        </div>
                        <p className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed">Saving changes will instantly propagate current asset data across all consumer interfaces and distribution nodes.</p>
                    </div>
                </div>
            </div>
        </div>
      </motion.form>
    </div>
  );
};

export default ProductEditPage;
