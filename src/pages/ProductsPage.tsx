import { useState } from "react";
import { 
  Package, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  Heart, 
  Star, 
  ExternalLink, 
  Search,
  Zap,
  Coins,
  Target,
  Users,
  CheckCircle2,
  Sparkles,
  History,
  Truck,
  Award
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const { products, favorites, toggleFavorite, isFavorite, getFavoriteProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categories = ["all", ...Array.from(new Set(products.map(p => p.categoria)))];

  const filteredProducts = products
    .filter(p => categoryFilter === "all" || p.categoria === categoryFilter)
    .filter(p => p.nome.toLowerCase().includes(searchQuery.toLowerCase()));

  const hotProductsCount = products.filter(p => p.hot).length;
  const highScoreProducts = products.filter(p => (p.scoreViral || 0) >= 80).length;
  const lowCompetition = products.filter(p => p.concorrencia === "Baixa").length;

  const metrics = [
    { label: "Produtos disponiveis", value: products.length, icon: Package, color: "bg-primary" },
    { label: "Produtos Hot", value: hotProductsCount, icon: Flame, color: "bg-red-500" },
    { label: "Score alto", value: highScoreProducts, icon: TrendingUp, color: "bg-emerald-500" },
    { label: "Baixa concorrencia", value: lowCompetition, icon: ShieldCheck, color: "bg-blue-500" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleDownload = async (imageUrl: string, productName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${productName.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Download concluído!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Erro no download");
    }
  };

  const handleToggleFavorite = (productId: number) => {
    const wasFavorite = isFavorite(productId);
    toggleFavorite(productId);
    toast.success(wasFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos!");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Central de Mineração</h2>
        <p className="text-sm text-muted-foreground">
          Descubra produtos com alto potencial de vendas no TikTok Shop.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border border-white/10 bg-card px-6 py-4 shadow-lg shadow-black/20 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${metric.color} text-white shadow-lg`}>
                <metric.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
                <p className="text-xl font-bold text-white">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Searchbar & Category filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border-white/10 pl-10 h-11 rounded-xl focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "flex-shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all",
                categoryFilter === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-secondary text-white/70 hover:bg-secondary/80"
              )}
            >
              {cat === "all" ? "Todos" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative rounded-[28px] border border-white/10 bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
          >
            {/* HOT Badge */}
            {product.hot && (
              <div className="absolute left-3 top-3 z-10">
                <div className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 shadow-lg animate-pulse">
                  <Flame className="h-3 w-3 text-white fill-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">HOT</span>
                </div>
              </div>
            )}

            {/* Top actions */}
            <div className="absolute right-3 top-3 z-10 flex gap-2">
              <button
                onClick={() => handleToggleFavorite(product.id)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-primary/80 transition-all border border-white/10"
              >
                <Heart
                  className={cn("h-4 w-4 transition-all", isFavorite(product.id) && "fill-red-500 text-red-500 scale-110")}
                />
              </button>
              <button
                onClick={() => handleDownload(product.imagem || product.imageUrl || "", product.nome)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-emerald-500/80 transition-all border border-white/10"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.imagem || product.imageUrl}
                alt={product.nome}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <button
                onClick={() => setSelectedProduct(product)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity backdrop-blur-[2px] group-hover:opacity-100"
              >
                <span className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-primary/40 transform translate-y-4 transition-transform group-hover:translate-y-0">
                  Ver detalhes
                </span>
              </button>
            </div>

            {/* Info */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{product.categoria}</p>
                <h4 className="font-bold text-white line-clamp-2 leading-tight h-10">{product.nome}</h4>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-2.5 py-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-white">{product.avaliacao}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span className="font-medium">{product.vendas.toLocaleString()} vendas</span>
                </div>
              </div>

              {/* Score viral */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-muted-foreground">Score Viral</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-white bg-opacity-20", getScoreColor(product.scoreViral || 0))}>
                    {product.scoreViral || 0}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-1000", getScoreColor(product.scoreViral || 0))}
                    style={{ width: `${product.scoreViral || 0}%` }}
                  />
                </div>
              </div>

              {/* Price and commission */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xl font-black text-white tracking-tighter">
                  {product.valor || product.precoTexto || `R$ ${product.preco?.toFixed(2)}`}
                </span>
                <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="h-3 w-3" />
                  <span>{product.comissao}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-card/50 rounded-[40px] border border-dashed border-white/10">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground font-medium">Nenhum produto encontrado</p>
        </div>
      )}

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl bg-card border-white/10 p-0 overflow-hidden shadow-2xl shadow-primary/10 rounded-[32px]">
          {selectedProduct && (
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto lg:overflow-hidden">
              {/* Product Image Section */}
              <div className="lg:w-1/2 relative bg-black/40 flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-white/5">
                <img
                  src={selectedProduct.imagem || selectedProduct.imageUrl}
                  alt={selectedProduct.nome}
                  className="w-full h-auto max-h-[400px] lg:max-h-full object-contain rounded-2xl shadow-2xl"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-white font-bold px-4 py-1 rounded-full shadow-lg">
                    {selectedProduct.categoria}
                  </Badge>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="lg:w-1/2 p-8 space-y-8 bg-card flex flex-col justify-between overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-white leading-tight mb-2">{selectedProduct.nome}</h2>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-white">{selectedProduct.avaliacao}</span>
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">
                        {selectedProduct.vendas.toLocaleString()} vendas
                      </span>
                      <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                        <Users className="h-3 w-3" />
                        <span>Concorrência {selectedProduct.concorrencia}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end gap-4">
                    <span className="text-4xl font-black text-white tracking-tighter">
                      {selectedProduct.valor || selectedProduct.precoTexto || `R$ ${selectedProduct.preco?.toFixed(2)}`}
                    </span>
                    <div className="mb-1">
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                        {selectedProduct.comissao}% de comissão
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <Truck className="h-4 w-4 text-primary" />
                      <span>7-15 dias úteis</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <Award className="h-4 w-4 text-emerald-400" />
                      <span>Fornecedor VIP (4.8)</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => window.open(selectedProduct.link || selectedProduct.linkTiktok, "_blank")}
                    className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-600/20 gap-3"
                  >
                    Afiliar-se a este Produto
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </div>

                {/* Viral Metrics Row */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Métricas Virais
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Viral Score", val: `${selectedProduct.scoreViral || 80}%`, icon: Zap, color: "text-primary", bg: "bg-primary/5" },
                      { label: "Vendas/Dia", val: selectedProduct.vendasDia || "45", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/5" },
                      { label: "Margem %", val: `${selectedProduct.margem || 25}%`, icon: Coins, color: "text-blue-400", bg: "bg-blue-400/5" },
                      { label: "Comissão R$", val: `R$ ${((parseFloat((selectedProduct.valor || "0").replace("R$ ","").replace(".","").replace(",",".")) * (selectedProduct.comissao || 10)) / 10000).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, icon: Target, color: "text-yellow-400", bg: "bg-yellow-400/5" },
                    ].map((m, idx) => (
                      <div key={idx} className={cn("p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1.5 text-center", m.bg)}>
                        <m.icon className={cn("h-4 w-4", m.color)} />
                        <span className="text-[12px] font-black text-white leading-none">{m.val}</span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profit Projection */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    Projeção de Lucro
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Início", sales: "10 vds", color: "bg-blue-500" },
                      { label: "Crescimento", sales: "100 vds", color: "bg-primary" },
                      { label: "Escala", sales: "1000 vds", color: "bg-emerald-500" },
                    ].map((p, idx) => {
                      const comm = (parseFloat((selectedProduct.valor || "0").replace("R$ ","").replace(".","").replace(",",".")) * (selectedProduct.comissao || 10)) / 10000;
                      const multiplier = p.label === "Início" ? 10 : p.label === "Crescimento" ? 100 : 1000;
                      return (
                        <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1 relative overflow-hidden group">
                          <div className={cn("absolute bottom-0 left-0 h-1 transition-all group-hover:h-full group-hover:opacity-5", p.color)} style={{ width: '100%' }} />
                          <p className="text-[9px] font-black text-muted-foreground uppercase">{p.label}</p>
                          <p className="text-[10px] font-bold text-white">{p.sales}</p>
                          <p className="text-[12px] font-black text-emerald-400">R$ {(comm * multiplier).toLocaleString('pt-BR', {minimumFractionDigits: 0})}</p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[9px] text-muted-foreground italic text-center">Projeção baseada em tráfego 100% orgânico</p>
                </div>

                {/* Creatives */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Criativos Recomendados</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg"><CheckCircle2 className="h-4 w-4 text-emerald-400" /></div>
                      <div>
                        <p className="text-[10px] font-black text-white">UGC Review</p>
                        <p className="text-[9px] text-muted-foreground leading-tight">Review autêntico como usuário real do produto</p>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg"><CheckCircle2 className="h-4 w-4 text-blue-400" /></div>
                      <div>
                        <p className="text-[10px] font-black text-white">Unboxing</p>
                        <p className="text-[9px] text-muted-foreground leading-tight">Abra o produto mostrando a experiência completa</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-6 border-t border-white/5">
                  <Button
                    onClick={() => {
                      setSelectedProduct(null);
                      navigate('/criar-video', { state: { product: selectedProduct } });
                    }}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/10 gap-2"
                  >
                    <Zap className="h-4 w-4 fill-white" />
                    Criar Vídeo
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDownload(selectedProduct.imagem || selectedProduct.imageUrl || "", selectedProduct.nome)}
                    className="h-12 w-12 rounded-xl border-white/10 hover:bg-white/5 shrink-0"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleFavorite(selectedProduct.id)}
                    className="h-12 w-12 rounded-xl border-white/10 hover:bg-white/5 shrink-0"
                  >
                    <Heart className={cn("h-5 w-5", isFavorite(selectedProduct.id) && "fill-red-500 text-red-500")} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

