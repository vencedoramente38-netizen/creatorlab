import { useState } from "react";
import { Package, Flame, TrendingUp, ShieldCheck, Download, Heart, Star, ExternalLink, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductsPage() {
  const { products, favorites, toggleFavorite, isFavorite, getFavoriteProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const favoriteProducts = getFavoriteProducts();
  const categories = ["all", ...Array.from(new Set(products.map(p => p.categoria)))];

  const filteredProducts = products
    .filter(p => categoryFilter === "all" || p.categoria === categoryFilter)
    .filter(p => p.nome.toLowerCase().includes(searchQuery.toLowerCase()));

  const hotProducts = products.filter(p => (p.scoreViral || 0) >= 85).length;
  const highScoreProducts = products.filter(p => (p.scoreViral || 0) >= 80).length;
  const lowCompetition = products.filter(p => p.concorrencia === "Baixa").length;

  const metrics = [
    { label: "Produtos disponiveis", value: products.length, icon: Package, color: "bg-primary" },
    { label: "Produtos Hot", value: hotProducts, icon: Flame, color: "bg-primary" },
    { label: "Score alto", value: highScoreProducts, icon: TrendingUp, color: "bg-primary" },
    { label: "Baixa concorrencia", value: lowCompetition, icon: ShieldCheck, color: "bg-primary" },
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Central de Mineracao</h2>
        <p className="text-sm text-muted-foreground">
          Descubra produtos com alto potencial de vendas no TikTok Shop.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border border-white/10 bg-card px-6 py-4"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${metric.color} text-white`}>
                <metric.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-lg font-bold text-white">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar produto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-card border-white/10 pl-10"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              categoryFilter === cat
                ? "bg-primary text-white"
                : "bg-secondary text-white/70 hover:bg-secondary/80"
            )}
          >
            {cat === "all" ? "Todos" : cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative rounded-[22px] border border-white/10 bg-card overflow-hidden"
          >
            {/* Top actions */}
            <div className="absolute right-3 top-3 z-10 flex gap-2">
              <button
                onClick={() => handleToggleFavorite(product.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <Heart
                  className={cn("h-4 w-4", isFavorite(product.id) && "fill-primary text-primary")}
                />
              </button>
              <button
                onClick={() => handleDownload(product.imageUrl, product.nome)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-square">
              <img
                src={product.imageUrl}
                alt={product.nome}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(product)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
                  Ver detalhes
                </span>
              </button>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-primary font-medium">{product.categoria}</p>
                <h4 className="font-semibold text-white line-clamp-1">{product.nome}</h4>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-white">{product.avaliacao}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.vendas.toLocaleString()} vendas
                </span>
              </div>

              {/* Score viral */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Score Viral</span>
                  <span className="text-white font-medium">{product.scoreViral || 0}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", getScoreColor(product.scoreViral || 0))}
                    style={{ width: `${product.scoreViral || 0}%` }}
                  />
                </div>
              </div>

              {/* Price and commission */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">
                  {product.precoTexto || `R$ ${product.preco.toFixed(2)}`}
                </span>
                <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  {product.comissao}% comissao
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum produto encontrado</p>
        </div>
      )}

      {/* Product detail modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-lg bg-card border-white/10">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{selectedProduct.nome}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.nome}
                  className="w-full aspect-video rounded-lg object-cover"
                />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Categoria</p>
                    <p className="font-medium text-white">{selectedProduct.categoria}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avaliacao</p>
                    <p className="font-medium text-white flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {selectedProduct.avaliacao}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vendas</p>
                    <p className="font-medium text-white">{selectedProduct.vendas.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Concorrencia</p>
                    <p className="font-medium text-white">{selectedProduct.concorrencia}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Score Viral</p>
                    <p className="font-medium text-white">{selectedProduct.scoreViral || 0}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Comissao</p>
                    <p className="font-medium text-emerald-400">{selectedProduct.comissao}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-2xl font-bold text-white">
                    {selectedProduct.precoTexto || `R$ ${selectedProduct.preco.toFixed(2)}`}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDownload(selectedProduct.imageUrl, selectedProduct.nome)}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => window.open(selectedProduct.linkTiktok, "_blank")}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Afiliar-se
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
