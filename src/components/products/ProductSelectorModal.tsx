import { useState } from "react";
import { Search, X } from "lucide-react";
import { Product } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProducts } from "@/hooks/useProducts";

interface ProductSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (product: Product) => void;
}

export function ProductSelectorModal({ open, onOpenChange, onSelect }: ProductSelectorModalProps) {
  const [search, setSearch] = useState("");
  const { products } = useProducts();

  const filtered = products.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-card max-w-lg p-0 overflow-hidden rounded-3xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-white text-xl font-bold">Selecionar Produto</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-secondary/50 border-white/10 pl-10 h-11 rounded-xl focus:ring-primary/20"
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[450px] px-6 pb-6">
          <div className="space-y-3 pb-4">
            {filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => { onSelect(product); onOpenChange(false); }}
                className="flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-secondary/20 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5 group"
              >
                <div className="relative h-16 w-16 flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.nome}
                    className="h-full w-full rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                      {product.nome}
                    </p>
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {product.comissao}% comissão
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{product.categoria}</span>
                    <span>•</span>
                    <span className="text-white font-medium">
                      {product.precoTexto || `R$ ${product.preco.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <div className="p-4 bg-secondary/30 rounded-full">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-white font-medium">Nenhum produto encontrado</p>
                  <p className="text-sm text-muted-foreground">Tente uma busca diferente</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
