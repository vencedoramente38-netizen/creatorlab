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
  Award,
  Rocket
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
                onClick={() => handleDownload(product.imagem, product.nome)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-emerald-500/80 transition-all border border-white/10"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.imagem}
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

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xl font-black text-white tracking-tighter">
                  R$ {product.valorMin.toFixed(2)}
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
        <DialogContent className="max-w-4xl bg-[#0a0a0a] border-zinc-800 p-0 overflow-hidden shadow-2xl rounded-[32px] text-white">
          {selectedProduct && (
            <div className="flex flex-col lg:flex-row">
              {/* COLUNA ESQUERDA: Imagem */}
              <div className="lg:w-[45%] p-6 bg-zinc-950/50">
                <img
                  src={selectedProduct.imagem}
                  alt={selectedProduct.nome}
                  className="w-full h-[400px] object-cover rounded-[12px] shadow-2xl"
                />
              </div>

              {/* COLUNA DIREITA: Info */}
              <div className="lg:w-[55%] p-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[12px] font-bold text-red-500 uppercase tracking-widest">
                      {selectedProduct.categoria}
                    </span>
                    <h2 className="text-[24px] font-black leading-tight">
                      {selectedProduct.nome}
                    </h2>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{selectedProduct.avaliacao}</span>
                      </div>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-400">{selectedProduct.vendas.toLocaleString()} vendas</span>
                      <Badge className={cn(
                        "ml-auto font-bold px-3 py-1 rounded-full",
                        selectedProduct.concorrencia === "Baixa" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        selectedProduct.concorrencia === "Média" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                        "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        Concorrência {selectedProduct.concorrencia}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[28px] font-black">
                      R$ {selectedProduct.valorMin.toFixed(2)}
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold px-3 py-1">
                      {selectedProduct.comissao}% comissão
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      <span>{selectedProduct.prazoEntrega}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-emerald-500" />
                      <span>Fornecedor: {selectedProduct.notaFornecedor}/5</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => window.open(selectedProduct.link, "_blank")}
                    className="w-full h-14 bg-[#FE2C55] hover:bg-[#ef2b50] text-white font-black text-lg rounded-xl gap-3 shadow-lg shadow-red-500/20"
                  >
                    Afiliar-se a este Produto
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </div>

                {/* Métricas Virais */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-red-500" /> Métricas Virais
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="h-4 w-4 text-red-500" />
                        <span className="text-xl font-black">{selectedProduct.scoreViral}</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-red-500" style={{ width: `${selectedProduct.scoreViral}%` }} />
                      </div>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase">Score Viral</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                      <Zap className="h-4 w-4 text-emerald-500 mb-2" />
                      <span className="text-xl font-black block">{selectedProduct.vendasDia}</span>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase">Vendas/Dia <span className="lowercase font-normal text-zinc-600">(média)</span></p>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                      <Target className="h-4 w-4 text-blue-500 mb-2" />
                      <span className="text-xl font-black block">{selectedProduct.margem}%</span>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase">Margem <span className="lowercase font-normal text-zinc-600">(lucro)</span></p>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                      <Coins className="h-4 w-4 text-yellow-500 mb-2" />
                      <span className="text-xl font-black block">R$ {((selectedProduct.valorMin * selectedProduct.comissao) / 100).toFixed(2)}</span>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase">Comissão <span className="lowercase font-normal text-zinc-600">(por venda)</span></p>
                    </div>
                  </div>
                </div>

                {/* Projeção de Lucro */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-emerald-500" /> Projeção de Lucro
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Início", icon: TrendingUp, sales: 10 },
                      { label: "Crescimento", icon: Rocket, sales: 100 },
                      { label: "Escala", icon: Award, sales: 1000 },
                    ].map((step, idx) => {
                      const comm = (selectedProduct.valorMin * selectedProduct.comissao) / 100;
                      return (
                        <div key={idx} className="p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1">
                          <step.icon className="h-3 w-3 text-emerald-500 mb-1" />
                          <p className="text-[9px] font-bold text-zinc-400 uppercase">{step.label}</p>
                          <p className="text-[10px] text-zinc-500">{step.sales} vendas</p>
                          <p className="text-[12px] font-black text-emerald-500">R$ {(comm * step.sales).toLocaleString('pt-BR')}</p>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-[8px] text-zinc-600 italic text-center">Projeção baseada em tráfego 100% orgânico</p>
                </div>

                {/* Criativos Recomendados */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-red-500/5 border border-red-500/10 flex gap-3">
                    <Users className="h-5 w-5 text-red-500 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black uppercase">UGC Review</p>
                      <p className="text-[9px] text-zinc-400 leading-tight">Review autêntico como usuário real do produto</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex gap-3">
                    <Package className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black uppercase">Unboxing</p>
                      <p className="text-[9px] text-zinc-400 leading-tight">Abra o produto mostrando a experiência completa</p>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-6 border-t border-zinc-800">
                  <Button 
                    onClick={() => window.open(selectedProduct.link, "_blank")}
                    className="flex-1 h-12 bg-red-600 hover:bg-red-700 font-bold rounded-xl"
                  >
                    Afiliar-se
                  </Button>
                  <Button 
                    onClick={() => {
                      setSelectedProduct(null);
                      navigate('/criar-video', { state: { product: selectedProduct } });
                    }}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl"
                  >
                    Criar Vídeo
                  </Button>
                  <Button variant="secondary" className="h-12 w-12 rounded-xl p-0">
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="h-12 w-12 rounded-xl p-0"
                    onClick={() => handleToggleFavorite(selectedProduct?.id)}
                  >
                    <Heart className={cn("h-5 w-5", selectedProduct && isFavorite(selectedProduct.id) && "fill-red-500 text-red-500")} />
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

