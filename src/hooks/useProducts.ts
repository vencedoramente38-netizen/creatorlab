import { useState, useEffect, useCallback } from "react";
import { defaultProducts, Product } from "@/data/products";

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

    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

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
