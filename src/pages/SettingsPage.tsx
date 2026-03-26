import { useState, useEffect } from "react";
import { User, Bell, Shield, Save, Plus, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNotifications } from "@/hooks/useNotifications";
import { useProducts } from "@/hooks/useProducts";
import { useUserRole } from "@/hooks/useUserRole";
import { Product, defaultProducts } from "@/data/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface DashboardMetrics {
  faturamento: number;
  pedidos: number;
  comissao: number;
  produtosAtivos: number;
}

interface SalesData {
  name: string;
  value: number;
}

export default function SettingsPage() {
  const { notificationsEnabled, setNotificationsEnabled } = useNotifications();
  const { products, setProducts, restoreDefaults } = useProducts();
  const { isAdmin, isLoading: isRoleLoading } = useUserRole();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    avatarUrl: "",
  });
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    faturamento: 0,
    pedidos: 0,
    comissao: 0,
    produtosAtivos: 0,
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    nome: "",
    preco: 0,
    precoTexto: "",
    comissao: 0,
    imageUrl: "",
    linkTiktok: "",
    categoria: "",
    avaliacao: 4.5,
    vendas: 0,
    concorrencia: "Baixa" as Product["concorrencia"],
    scoreViral: 50,
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch {
        // ignore
      }
    }

    const savedMetrics = localStorage.getItem("dashboardMetrics");
    if (savedMetrics) {
      try {
        setMetrics(JSON.parse(savedMetrics));
      } catch {
        // ignore
      }
    }

    const savedSales = localStorage.getItem("salesEvolution");
    if (savedSales) {
      try {
        setSalesData(JSON.parse(savedSales));
      } catch {
        // ignore
      }
    } else {
      setSalesData([
        { name: "Jan", value: 0 },
        { name: "Fev", value: 0 },
        { name: "Mar", value: 0 },
        { name: "Abr", value: 0 },
        { name: "Mai", value: 0 },
        { name: "Jun", value: 0 },
      ]);
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    toast.success("Perfil salvo!");
  };

  const saveMetrics = () => {
    localStorage.setItem("dashboardMetrics", JSON.stringify(metrics));
    localStorage.setItem("salesEvolution", JSON.stringify(salesData));
    toast.success("Metricas salvas!");
  };

  const updateSalesValue = (index: number, value: number) => {
    setSalesData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const saveProduct = () => {
    if (!editingProduct) return;
    const updated = products.map((p) =>
      p.id === editingProduct.id ? editingProduct : p
    );
    setProducts(updated);
    setEditingProduct(null);
    toast.success("Produto atualizado!");
  };

  const addNewProduct = () => {
    if (!newProduct.nome) {
      toast.error("Nome do produto é obrigatório!");
      return;
    }
    const product: Product = {
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      nome: newProduct.nome,
      categoria: newProduct.categoria || "Outros",
      preco: newProduct.preco,
      precoTexto: newProduct.precoTexto || `R$ ${newProduct.preco.toFixed(2)}`,
      avaliacao: newProduct.avaliacao,
      vendas: newProduct.vendas,
      comissao: newProduct.comissao,
      concorrencia: newProduct.concorrencia,
      imageUrl: newProduct.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      linkTiktok: newProduct.linkTiktok || "https://shop.tiktok.com",
      scoreViral: newProduct.scoreViral,
    };
    setProducts([...products, product]);
    setNewProduct({
      nome: "",
      preco: 0,
      precoTexto: "",
      comissao: 0,
      imageUrl: "",
      linkTiktok: "",
      categoria: "",
      avaliacao: 4.5,
      vendas: 0,
      concorrencia: "Baixa",
      scoreViral: 50,
    });
    toast.success("Produto adicionado!");
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
    toast.success("Produto removido!");
  };

  const handleRestoreDefaults = () => {
    restoreDefaults();
    toast.success("Produtos restaurados!");
  };

  const handleAvatarUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setProfile((p) => ({ ...p, avatarUrl: ev.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Configuracoes</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie seu perfil e preferencias
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-3xl border border-white/10 bg-card p-6 space-y-6">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-white">Perfil</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white">Nome</Label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Seu nome"
              className="bg-secondary border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Email</Label>
            <Input
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              placeholder="seu@email.com"
              className="bg-secondary border-white/10"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-white">Avatar</Label>
            <div className="flex gap-4 items-center">
              {profile.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <Button
                variant="outline"
                onClick={handleAvatarUpload}
                className="border-white/10 hover:bg-white/5"
              >
                Escolher da galeria
              </Button>
              <Input
                value={profile.avatarUrl}
                onChange={(e) => setProfile((p) => ({ ...p, avatarUrl: e.target.value }))}
                placeholder="Ou cole uma URL..."
                className="bg-secondary border-white/10 flex-1"
              />
            </div>
          </div>
        </div>

        <Button onClick={saveProfile} className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Salvar perfil
        </Button>
      </div>

      {/* Notifications */}
      <div className="rounded-3xl border border-white/10 bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-white">Notificacoes</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">Ativar notificacoes</p>
            <p className="text-sm text-muted-foreground">
              Receba alertas sobre vendas e atualizacoes
            </p>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
      </div>

      {/* Admin Panel - Only shown for admin users */}
      {isRoleLoading ? (
        <div className="rounded-3xl border border-white/10 bg-card p-6">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : isAdmin ? (
        <div className="rounded-3xl border border-white/10 bg-card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-white">Painel de Admin</h3>
          </div>

          <div className="space-y-6">
            {/* Dashboard metrics */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">Numeros do Dashboard</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">Faturamento (R$)</Label>
                  <Input
                    type="number"
                    value={metrics.faturamento}
                    onChange={(e) => setMetrics((m) => ({ ...m, faturamento: Number(e.target.value) }))}
                    className="bg-secondary border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Pedidos</Label>
                  <Input
                    type="number"
                    value={metrics.pedidos}
                    onChange={(e) => setMetrics((m) => ({ ...m, pedidos: Number(e.target.value) }))}
                    className="bg-secondary border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Comissao (R$)</Label>
                  <Input
                    type="number"
                    value={metrics.comissao}
                    onChange={(e) => setMetrics((m) => ({ ...m, comissao: Number(e.target.value) }))}
                    className="bg-secondary border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Produtos Ativos</Label>
                  <Input
                    type="number"
                    value={metrics.produtosAtivos}
                    onChange={(e) => setMetrics((m) => ({ ...m, produtosAtivos: Number(e.target.value) }))}
                    className="bg-secondary border-white/10"
                  />
                </div>
              </div>
            </div>

            {/* Sales evolution */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">Curva de Vendas</h4>
              <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-6">
                {salesData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <Label className="text-muted-foreground text-xs">{item.name}</Label>
                    <Input
                      type="number"
                      value={item.value}
                      onChange={(e) => updateSalesValue(idx, Number(e.target.value))}
                      className="bg-secondary border-white/10"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={saveMetrics} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Salvar metricas
            </Button>

            {/* Products management */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">Gerenciar Produtos</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestoreDefaults}
                  className="border-white/10 hover:bg-white/5"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restaurar padrao
                </Button>
              </div>

              {/* Add new product form */}
              <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <h5 className="text-sm font-medium text-white flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  Adicionar novo produto
                </h5>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-white">Nome *</Label>
                    <Input
                      value={newProduct.nome}
                      onChange={(e) => setNewProduct(p => ({ ...p, nome: e.target.value }))}
                      placeholder="Nome do produto"
                      className="bg-secondary border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Categoria</Label>
                    <Input
                      value={newProduct.categoria}
                      onChange={(e) => setNewProduct(p => ({ ...p, categoria: e.target.value }))}
                      placeholder="Ex: Eletrônicos"
                      className="bg-secondary border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Valor (R$)</Label>
                    <Input
                      type="number"
                      value={newProduct.preco}
                      onChange={(e) => setNewProduct(p => ({ ...p, preco: Number(e.target.value) }))}
                      className="bg-secondary border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Texto do preço</Label>
                    <Input
                      value={newProduct.precoTexto}
                      onChange={(e) => setNewProduct(p => ({ ...p, precoTexto: e.target.value }))}
                      placeholder="Ex: R$ 29,99 - 54,99"
                      className="bg-secondary border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Comissao (%)</Label>
                    <Input
                      type="number"
                      value={newProduct.comissao}
                      onChange={(e) => setNewProduct(p => ({ ...p, comissao: Number(e.target.value) }))}
                      className="bg-secondary border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Score Viral</Label>
                    <Input
                      type="number"
                      value={newProduct.scoreViral}
                      onChange={(e) => setNewProduct(p => ({ ...p, scoreViral: Number(e.target.value) }))}
                      className="bg-secondary border-white/10"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-white">URL da Imagem</Label>
                    <Input
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct(p => ({ ...p, imageUrl: e.target.value }))}
                      placeholder="https://..."
                      className="bg-secondary border-white/10"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-white">Link TikTok</Label>
                    <Input
                      value={newProduct.linkTiktok}
                      onChange={(e) => setNewProduct(p => ({ ...p, linkTiktok: e.target.value }))}
                      placeholder="https://vt.tiktok.com/..."
                      className="bg-secondary border-white/10"
                    />
                  </div>
                </div>
                <Button onClick={addNewProduct} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar produto
                </Button>
              </div>

              {/* Products list */}
              <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer transition-colors",
                      editingProduct?.id === product.id
                        ? "bg-primary/20 border border-primary"
                        : "bg-secondary/30 hover:bg-secondary/50"
                    )}
                    onClick={() => setEditingProduct(product)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.nome}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-white line-clamp-1">{product.nome}</p>
                        <p className="text-xs text-muted-foreground">{product.categoria} — {product.precoTexto || `R$ ${product.preco.toFixed(2)}`}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(product.id);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {editingProduct && (
                <div className="space-y-4 rounded-2xl border border-white/10 bg-secondary/30 p-4">
                  <h5 className="text-sm font-medium text-white">Editando: {editingProduct.nome}</h5>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-white">Nome</Label>
                      <Input
                        value={editingProduct.nome}
                        onChange={(e) => setEditingProduct((p) => p ? { ...p, nome: e.target.value } : null)}
                        className="bg-secondary border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Categoria</Label>
                      <Input
                        value={editingProduct.categoria}
                        onChange={(e) => setEditingProduct((p) => p ? { ...p, categoria: e.target.value } : null)}
                        className="bg-secondary border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Valor (R$)</Label>
                      <Input
                        type="number"
                        value={editingProduct.preco}
                        onChange={(e) => setEditingProduct((p) => p ? { ...p, preco: Number(e.target.value) } : null)}
                        className="bg-secondary border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Texto do preço</Label>
                      <Input
                        value={editingProduct.precoTexto || ""}
                        onChange={(e) => setEditingProduct((p) => p ? { ...p, precoTexto: e.target.value } : null)}
                        placeholder="Ex: R$ 29,99 - 54,99"
                        className="bg-secondary border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Comissao (%)</Label>
                      <Input
                        type="number"
                        value={editingProduct.comissao}
                        onChange={(e) => setEditingProduct((p) => p ? { ...p, comissao: Number(e.target.value) } : null)}
                        className="bg-secondary border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Score Viral</Label>
                      <Input
                        type="number"
                        value={editingProduct.scoreViral || 0}
                        onChange={(e) => setEditingProduct((p) => p ? { ...p, scoreViral: Number(e.target.value) } : null)}
                        className="bg-secondary border-white/10"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-white">URL da Imagem</Label>
                      <Input
                        value={editingProduct.imageUrl}
                        onChange={(e) => setEditingProduct((p) => p ? { ...p, imageUrl: e.target.value } : null)}
                        className="bg-secondary border-white/10"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-white">Link TikTok</Label>
                      <Input
                        value={editingProduct.linkTiktok}
                        onChange={(e) => setEditingProduct((p) => p ? { ...p, linkTiktok: e.target.value } : null)}
                        className="bg-secondary border-white/10"
                      />
                    </div>
                  </div>
                  <Button onClick={saveProduct} className="bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar produto
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-card p-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-muted-foreground">Painel de Admin</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesso restrito a administradores.
          </p>
        </div>
      )}
    </div>
  );
}
