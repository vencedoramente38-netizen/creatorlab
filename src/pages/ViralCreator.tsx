import React, { useState } from "react";
import { Zap, Check, ChevronRight, ChevronLeft, Sparkles, Wand2, Copy, RefreshCw, ExternalLink, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { NeonCard, NeonSection } from "@/components/synclab/NeonCard";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon: string;
  items: string[];
}

const CATEGORIES: Category[] = [
  {
    id: "alimentos",
    name: "Alimentos & Frutas",
    icon: "🍎",
    items: ["Morango", "Abacate", "Limão", "Manga", "Uva", "Açaí", "Banana", "Maçã"],
  },
  {
    id: "utensilios",
    name: "Utensílios de Cozinha",
    icon: "🍳",
    items: ["Fritadeira Air Fryer", "Panela de Pressão", "Mixer", "Tábua de Corte", "Faca Chef", "Ralador"],
  },
  {
    id: "personalizados",
    name: "Personalizados",
    icon: "🎨",
    items: [],
  },
];

interface StyleOption {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

const STYLES: StyleOption[] = [
  { id: "comedia", name: "Comédia Rápida", desc: "Humor e ritmo acelerado", icon: "😂" },
  { id: "suspense", name: "Suspense", desc: "Deixa o espectador ansioso", icon: "😱" },
  { id: "historia", name: "Mini-História", desc: "Narrativa com começo, meio e fim", icon: "📖" },
  { id: "falante", name: "Objeto Falante", desc: "O produto tem voz própria", icon: "🗣️" },
  { id: "antes_depois", name: "Antes & Depois", desc: "Transformação impactante", icon: "🔥" },
  { id: "tutorial", name: "Tutorial Rápido", desc: "Ensina algo em 30 segundos", icon: "🎯" },
  { id: "pov", name: "POV", desc: "Ponto de vista imersivo", icon: "💬" },
  { id: "trend", name: "Trend Dance", desc: "Sincronizado com trend atual", icon: "⚡" },
];

const duracoes = [
  { value: "15s", label: "15 Segundos", sub: "TikTok Curto" },
  { value: "30s", label: "30 Segundos", sub: "Ideal" },
  { value: "60s", label: "60 Segundos", sub: "História Completa" },
];

interface ScriptResult {
  titulo: string;
  hook: string;
  roteiro: string;
  cta_final: string;
  hashtags: string[];
  dicas_edicao: string;
}

const parts = ["Objeto", "Estilo", "Conteúdo", "Revisão"];

export default function ViralCreator() {
  const [currentPart, setCurrentPart] = useState(0);
  const [viralMode, setViralMode] = useState(false);

  // Form State
  const [categoryId, setCategoryId] = useState("");
  const [selectedObject, setSelectedObject] = useState("");
  const [customObject, setCustomObject] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [message, setMessage] = useState("");
  const [hook, setHook] = useState("");
  const [cta, setCta] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [duration, setDuration] = useState("30s");

  // Generate State
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [result, setResult] = useState<ScriptResult | null>(null);

  const activeCategory = CATEGORIES.find((c) => c.id === categoryId);
  const activeStyle = STYLES.find((s) => s.id === selectedStyle);

  const handleNext = () => {
    if (currentPart === 0) {
      if (!categoryId) return toast.error("Selecione uma categoria");
      if (categoryId === "personalizados" && !customObject.trim()) return toast.error("Digite o objeto personalizado");
      if (categoryId !== "personalizados" && !selectedObject && !customObject.trim()) return toast.error("Selecione ou digite um objeto");
    }
    if (currentPart === 1 && !selectedStyle) return toast.error("Selecione um estilo");
    if (currentPart === 2 && !message.trim()) return toast.error("A mensagem principal é obrigatória");
    setCurrentPart(s => Math.min(s + 1, 3));
  };

  const currentObject = selectedObject || customObject;

  const generateScript = async () => {
    setIsGenerating(true);
    setResult(null);
    setGenProgress(0);

    const interval = setInterval(() => {
      setGenProgress(prev => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + Math.random() * 15;
      });
    }, 400);

    const prompt = `Você é um especialista em conteúdo viral para TikTok Shop.
Crie um roteiro viral completo para um vídeo de ${duration} sobre: ${currentObject}
Estilo: ${activeStyle?.name}
Mensagem principal: ${message}
Hook: ${hook}
CTA: ${cta}
Restrições: ${restrictions || "Nenhuma"}

Responda APENAS em JSON válido sem markdown e sem blocos de código. A resposta deve começar com { e terminar com }.
{
  "titulo": "título chamativo do vídeo",
  "hook": "frase de abertura dos primeiros 3 segundos",
  "roteiro": "roteiro completo dividido em cenas com timecode",
  "cta_final": "chamada para ação do final",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "dicas_edicao": "dicas de edição e efeitos para usar"
}`;

    try {
      const gKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!gKey) {
        throw new Error("API Key do Gemini não encontrada na variável VITE_GEMINI_API_KEY.");
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (!res.ok) throw new Error("Falha na comunicação com a API");
      
      const data = await res.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) throw new Error("Resposta da IA vazia");

      const parsed = JSON.parse(textResponse);
      
      clearInterval(interval);
      setGenProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));

      setResult(parsed);
      toast.success("🔥 Roteiro viral gerado com sucesso!");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#25F4EE', '#FE2C55', '#FFFFFF']
      });

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao gerar roteiro. Tente novamente.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  // ── Se Gerando Result ──
  if (isGenerating) {
    return (
      <div className="flex min-h-[400px] items-center justify-center animate-fade-in">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-card p-8 text-center shadow-[0_0_30px_hsl(var(--neon-pink)/0.1)]">
          <div className="mb-6">
            <Sparkles className="mx-auto h-12 w-12 text-[hsl(var(--neon-pink))] animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Processando conteúdo...</h3>
          <p className="text-sm text-muted-foreground mb-6">Criando roteiro viral com IA</p>
          <div className="relative mb-3">
            <Progress value={genProgress} className="h-3 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-[hsl(var(--neon-pink))] [&>div]:to-[hsl(var(--neon-cyan))]" />
          </div>
          <p className="text-2xl font-bold text-white">{Math.round(genProgress)}%</p>
        </div>
      </div>
    );
  }

  // ── Se Exibindo Resultado Final ──
  if (result) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Viral Creator — Resultado</h2>
            <p className="text-sm text-muted-foreground">Roteiro gerado com sucesso!</p>
          </div>
          <Button variant="outline" className="border-white/10" onClick={() => { setResult(null); setCurrentPart(0); setCustomObject(""); setSelectedObject(""); }}>
            <RefreshCw className="mr-2 h-4 w-4" /> Novo Roteiro
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[hsl(var(--neon-cyan))]/30 bg-card p-4 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.1)]">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[hsl(var(--neon-cyan))]">Objeto Escolhido</p>
            <div className="flex items-center gap-3">
               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--neon-cyan))]/10 text-2xl">
                 📦
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{currentObject}</p>
               </div>
            </div>
          </div>
          <div className="rounded-2xl border border-[hsl(var(--neon-pink))]/30 bg-card p-4 shadow-[0_0_20px_hsl(var(--neon-pink)/0.1)]">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[hsl(var(--neon-pink))]">Estilo do Vídeo</p>
            <div className="flex items-center gap-3">
               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--neon-pink))]/10 text-2xl">
                 {activeStyle?.icon}
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{activeStyle?.name}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Roteiro */}
        <div className="rounded-2xl border border-white/10 bg-card p-5">
           <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                 <PlayCircle className="w-5 h-5 text-[hsl(var(--neon-cyan))]" /> Roteiro Completo
              </h3>
              <Button size="sm" variant="outline" className="border-[hsl(var(--neon-cyan))]/30 text-[hsl(var(--neon-cyan))]" onClick={() => copyToClipboard(result.roteiro)}>
                 <Copy className="mr-1.5 h-3.5 w-3.5" /> Copiar Roteiro
              </Button>
           </div>
           <div className="rounded-xl bg-secondary/50 p-4 text-sm text-white/80 whitespace-pre-wrap font-mono relative">
               {result.roteiro}
           </div>
        </div>

        {/* Hook and CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="rounded-2xl border border-white/10 bg-card p-5">
              <h3 className="font-semibold text-white mb-3">🪝 Hook Principal (3s)</h3>
              <div className="rounded-xl bg-[hsl(var(--neon-pink))]/10 p-4 border border-[hsl(var(--neon-pink))]/20 relative">
                 <p className="text-white/90 italic font-medium">"{result.hook}"</p>
                 <button onClick={() => copyToClipboard(result.hook)} className="absolute right-3 top-3 text-[hsl(var(--neon-pink))]/50 hover:text-[hsl(var(--neon-pink))]">
                    <Copy className="w-4 h-4" />
                 </button>
              </div>
           </div>
           
           <div className="rounded-2xl border border-white/10 bg-card p-5">
              <h3 className="font-semibold text-white mb-3">🎯 Call to Action (CTA)</h3>
              <div className="rounded-xl bg-secondary/50 p-4 relative">
                 <p className="text-white/90">{result.cta_final}</p>
                 <button onClick={() => copyToClipboard(result.cta_final)} className="absolute right-3 top-3 text-muted-foreground hover:text-white">
                    <Copy className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>

        {/* Edit Tips & Hashtags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="rounded-2xl border border-white/10 bg-card p-5">
              <h3 className="font-semibold text-white mb-3">🧠 Dicas de Edição</h3>
              <div className="rounded-xl border-l-[hsl(var(--neon-cyan))] border-l-4 bg-secondary/30 p-4 text-sm text-white/80">
                 {result.dicas_edicao}
              </div>
           </div>
           <div className="rounded-2xl border border-white/10 bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                 <h3 className="font-semibold text-white"># Hashtags</h3>
                 <Button size="sm" variant="outline" className="h-7 px-2 border-white/10" onClick={() => copyToClipboard(result.hashtags.join(" "))}>
                    <Copy className="h-3 w-3" />
                 </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                 {result.hashtags.map(tag => (
                    <span key={tag} className="rounded-full border border-[hsl(var(--neon-pink))]/30 bg-[hsl(var(--neon-pink))]/10 px-3 py-1 text-sm text-[hsl(var(--neon-pink))]">
                       {tag}
                    </span>
                 ))}
              </div>
           </div>
        </div>
        
        {/* Full copy action */}
        <div className="flex justify-end pt-4">
           <Button className="bg-gradient-to-r from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-cyan))] text-white font-semibold" onClick={() => copyToClipboard(`${result.titulo}\n\nHOOK: ${result.hook}\n\nROTEIRO:\n${result.roteiro}\n\nCTA: ${result.cta_final}\n\nHashtags: ${result.hashtags.join(' ')}`)}>
             <Copy className="mr-2 h-4 w-4" /> Copiar Pacote Completo
           </Button>
        </div>
      </div>
    );
  }

  // ── Main Wizard View ──
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
         <div>
           <h2 className="text-xl font-bold text-white">Viral Creator</h2>
           <p className="text-sm text-muted-foreground">Crie roteiros virais incríveis com IA em segundos</p>
         </div>
         <Button
           variant="outline"
           onClick={() => setViralMode(!viralMode)}
           className={cn(
               "font-bold transition-all border-white/10",
               viralMode 
                 ? "bg-[hsl(var(--neon-pink))]/20 text-[hsl(var(--neon-pink))] border-[hsl(var(--neon-pink))]/50 hover:bg-[hsl(var(--neon-pink))]/30" 
                 : "bg-transparent text-muted-foreground"
             )}
         >
           {viralMode ? (
             <><Sparkles className="mr-2 w-4 h-4 animate-pulse" /> Modo Viral Ativo</>
           ) : (
             <><Zap className="mr-2 w-4 h-4 text-[hsl(var(--neon-cyan))]" /> Modo Viral</>
           )}
         </Button>
      </div>

      {/* Stepper (Matched to CreateVideoPage) */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {parts.map((part, idx) => (
          <div key={part} className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPart(idx)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                idx === currentPart
                  ? "bg-gradient-to-r from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-cyan))] text-white shadow-[0_0_12px_hsl(var(--neon-pink)/0.4)]"
                  : idx < currentPart
                  ? "bg-[hsl(var(--neon-pink))]/20 text-[hsl(var(--neon-pink))]"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {idx < currentPart ? <Check className="h-4 w-4" /> : idx + 1}
            </button>
            <span className={cn("hidden text-sm sm:block", idx === currentPart ? "text-white font-medium" : "text-muted-foreground")}>
              {part}
            </span>
            {idx < parts.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* PART 1 */}
      {currentPart === 0 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-card p-5">
            <NeonSection title="Escolha a Categoria" subtitle="Qual o tipo do seu produto?">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                 {CATEGORIES.map(cat => (
                    <NeonCard 
                       key={cat.id} 
                       selected={categoryId === cat.id} 
                       onClick={() => { setCategoryId(cat.id); setSelectedObject(""); setCustomObject(""); }}
                    >
                       <div className="text-center">
                          <span className="text-2xl">{cat.icon}</span>
                          <p className="mt-1 text-sm font-medium text-white">{cat.name}</p>
                       </div>
                    </NeonCard>
                 ))}
              </div>
            </NeonSection>
          </div>

          {categoryId && (
             <div className="rounded-2xl border border-white/10 bg-card p-5 animate-fade-in">
                <NeonSection title="Escolha o Objeto" subtitle="Selecione ou crie um objeto personalizado">
                   {activeCategory && activeCategory.items.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-6">
                         {activeCategory.items.map(item => (
                            <NeonCard 
                               key={item} 
                               selected={selectedObject === item} 
                               onClick={() => { setSelectedObject(item); setCustomObject(""); }}
                               className="px-4 py-2 flex-shrink-0"
                            >
                               <span className="text-sm font-medium text-white">{item}</span>
                            </NeonCard>
                         ))}
                      </div>
                   )}
                   <div className="mt-2">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Objeto personalizado:</p>
                      <Input
                         placeholder="Escreva seu produto..."
                         value={customObject}
                         onChange={(e) => { setCustomObject(e.target.value); setSelectedObject(""); }}
                         className="bg-secondary border-white/10"
                      />
                   </div>
                </NeonSection>
             </div>
          )}
        </div>
      )}

      {/* PART 2 */}
      {currentPart === 1 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-card p-5">
             <NeonSection title="Estilo do Vídeo" subtitle="Qual o formato do roteiro?">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                   {STYLES.map(style => (
                      <NeonCard 
                         key={style.id} 
                         selected={selectedStyle === style.id} 
                         onClick={() => setSelectedStyle(style.id)}
                         className="p-4"
                      >
                         <div className="flex items-center gap-4">
                            <div className="text-3xl">{style.icon}</div>
                            <div className="text-left">
                               <p className="font-semibold text-white">{style.name}</p>
                               <p className="text-xs text-muted-foreground">{style.desc}</p>
                            </div>
                         </div>
                      </NeonCard>
                   ))}
                </div>
             </NeonSection>
          </div>
        </div>
      )}

      {/* PART 3 */}
      {currentPart === 2 && (
        <div className="space-y-6">
           <div className="rounded-2xl border border-white/10 bg-card p-5">
              <NeonSection title="Mensagem Principal" subtitle="Sobre o que o vídeo precisa falar obrigatoriamente?">
                 <Textarea
                    placeholder="Ex: Esse produto mudou a minha vida porque..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-secondary border-white/10 min-h-[100px]"
                 />
              </NeonSection>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-card p-5">
                 <NeonSection title="Gancho (Hook)" subtitle="Abertura opcional específica">
                    <Input
                       placeholder="Ex: Pare o scroll agora mesmo..."
                       value={hook}
                       onChange={(e) => setHook(e.target.value)}
                       className="bg-secondary border-white/10 mt-2"
                    />
                 </NeonSection>
              </div>
              <div className="rounded-2xl border border-white/10 bg-card p-5">
                 <NeonSection title="Call to Action (CTA)" subtitle="Chamada final opcional">
                    <Input
                       placeholder="Ex: Curte e me siga para mais..."
                       value={cta}
                       onChange={(e) => setCta(e.target.value)}
                       className="bg-secondary border-white/10 mt-2"
                    />
                 </NeonSection>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-card p-5">
                 <NeonSection title="Duração Alvo" subtitle="O ideal para TikTok Shorts">
                    <div className="grid grid-cols-3 gap-2 mt-2">
                       {duracoes.map(d => (
                          <NeonCard 
                             key={d.value} 
                             selected={duration === d.value} 
                             onClick={() => setDuration(d.value)}
                             className="p-2 text-center"
                          >
                             <p className="text-sm font-semibold text-white">{d.label}</p>
                             <p className="text-[10px] text-muted-foreground">{d.sub}</p>
                          </NeonCard>
                       ))}
                    </div>
                 </NeonSection>
              </div>
              <div className="rounded-2xl border border-white/10 bg-card p-5">
                 <NeonSection title="Restrições" subtitle="O que a IA NÃO deve mencionar (opcional)">
                    <Textarea
                       placeholder="Ex: Não use termos como grátis, não exagere..."
                       value={restrictions}
                       onChange={(e) => setRestrictions(e.target.value)}
                       className="bg-secondary border-white/10 min-h-[60px] mt-2"
                    />
                 </NeonSection>
              </div>
           </div>
        </div>
      )}

      {/* PART 4 */}
      {currentPart === 3 && (
        <div className="space-y-6">
           <div className="rounded-2xl border border-white/10 bg-card p-6">
              <div className="flex flex-col gap-6">
                 <div>
                    <h3 className="text-lg font-bold text-white mb-4">Revisão Final</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                       <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                          <div>
                             <p className="text-xs font-medium uppercase text-muted-foreground tracking-wider mb-1">Objeto</p>
                             <p className="font-semibold text-white">{currentObject || "Nenhum"}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setCurrentPart(0)}>Editar</Button>
                       </div>
                       <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                          <div>
                             <p className="text-xs font-medium uppercase text-muted-foreground tracking-wider mb-1">Estilo</p>
                             <p className="font-semibold text-[hsl(var(--neon-cyan))]">{activeStyle?.name || "Nenhum"}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setCurrentPart(1)}>Editar</Button>
                       </div>
                    </div>
                    
                    <div className="mt-3 rounded-xl bg-secondary/50 p-4">
                       <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Conteúdo Base</p>
                          <Button variant="ghost" size="sm" className="h-6" onClick={() => setCurrentPart(2)}>Editar</Button>
                       </div>
                       <div className="space-y-1 text-sm text-white/80">
                          <p><span className="text-muted-foreground w-20 inline-block">Mensagem:</span> {message}</p>
                          <p><span className="text-muted-foreground w-20 inline-block">Duração:</span> {duration}</p>
                       </div>
                    </div>
                 </div>

                 <Button 
                    className="w-full bg-gradient-to-r from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-cyan))] text-white font-bold h-14 text-lg shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)] hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)] transition-all"
                    onClick={generateScript}
                 >
                    <Sparkles className="mr-2 h-5 w-5" /> Gerar Roteiro Viral
                 </Button>
              </div>
           </div>
        </div>
      )}

      {/* Navigation Footer */}
      {currentPart < 3 && (
        <div className="flex items-center justify-between pt-4">
           <div>
              {currentPart > 0 && (
                 <Button variant="ghost" onClick={() => setCurrentPart(s => s - 1)}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                 </Button>
              )}
           </div>
           <Button onClick={handleNext} className="bg-gradient-to-r from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-cyan))] text-white">
              Próximo <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
        </div>
      )}
    </div>
  );
}
