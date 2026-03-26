import { useState, useEffect, useCallback } from "react";

export interface SavedPrompt {
  id: number;
  title: string;
  content: string;
  origin: "Criar Video" | "Criar Perfil" | "Sync Lab" | "Viral Sync" | "Outro";
  createdAt: Date;
}

const PROMPTS_KEY = "tiktokSyncPrompts";

export function usePrompts() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(PROMPTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPrompts(parsed.map((p: SavedPrompt) => ({
          ...p,
          createdAt: new Date(p.createdAt)
        })));
      } catch {
        setPrompts([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
  }, [prompts]);

  const addPrompt = useCallback((title: string, content: string, origin: SavedPrompt["origin"]) => {
    const newPrompt: SavedPrompt = {
      id: Date.now(),
      title,
      content,
      origin,
      createdAt: new Date()
    };
    setPrompts(prev => [newPrompt, ...prev]);
    return newPrompt;
  }, []);

  const deletePrompt = useCallback((id: number) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updatePrompt = useCallback((id: number, updates: Partial<Omit<SavedPrompt, "id" | "createdAt">>) => {
    setPrompts(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  }, []);

  return {
    prompts,
    addPrompt,
    deletePrompt,
    updatePrompt
  };
}
