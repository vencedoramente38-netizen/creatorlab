import { useState, useEffect, useCallback } from "react";
import { defaultProducts, Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

const PRODUCTS_KEY = "tiktokSyncProducts";
const FAVORITES_KEY = "favoriteProductIds";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem(PRODUCTS_KEY);
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch {
        setProducts(defaultProducts);
      }
    } else {
      setProducts(defaultProducts);
    }

    const loadFavorites = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data } = await supabase.from('favorites').select('product_id').eq('user_id', session.user.id);
          if (data) {
            setFavorites(data.map(f => parseInt(f.product_id, 10)));
            return;
          }
        }
      } catch (e) {
        console.error("Error loading favorites from Supabase", e);
      }
      
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch {
          setFavorites([]);
        }
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback(async (productId: number) => {
    const isFav = favorites.includes(productId);
    const newFavs = isFav ? favorites.filter(id => id !== productId) : [...favorites, productId];
    setFavorites(newFavs);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      if (isFav) {
        await supabase.from("favorites")
          .delete()
          .eq("product_id", productId.toString())
          .eq("user_id", session.user.id);
      } else {
        const productData = products.find(p => p.id === productId);
        if (productData) {
          await supabase.from("favorites")
            .upsert({
              user_id: session.user.id,
              product_id: productId.toString(),
              product_data: productData as any
            }, { onConflict: "user_id,product_id" });
        }
      }
    } catch (error) {
      console.error("Erro ao salvar favorito:", error);
    }
  }, [favorites, products]);

  const isFavorite = useCallback((productId: number) => {
    return favorites.includes(productId);
  }, [favorites]);

  const getFavoriteProducts = useCallback(() => {
    return products.filter(p => favorites.includes(p.id));
  }, [products, favorites]);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev =>
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  }, []);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts(prev => [...prev, { ...product, id: newId }]);
  }, [products]);

  const deleteProduct = useCallback((productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setFavorites(prev => prev.filter(id => id !== productId));
  }, []);

  const restoreDefaults = useCallback(() => {
    setProducts(defaultProducts);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
  }, []);

  return {
    products,
    setProducts,
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteProducts,
    updateProduct,
    addProduct,
    deleteProduct,
    restoreDefaults
  };
}
