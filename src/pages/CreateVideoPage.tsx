import React, { useState, useCallback, useMemo } from "react";
import { 
  Wand2, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Video, 
  Smartphone,
  Info,
  CheckCircle,
  Zap,
  Film,
  Music,
  Camera,
  Layers,
  Star,
  MessageSquare,
  Package,
  History,
  Target,
  Rocket
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductSelectorModal } from "@/components/products/ProductSelectorModal";
import { useProducts } from "@/hooks/useProducts";
import { usePrompts } from "@/hooks/usePrompts";
import { cn } from "@/lib/utils";
import { Product } from "@/data/products";

const cenarios = [
  { value: "casa", label: "Em Casa", icon: "🏠" },
  { value: "cozinha", label: "Cozinha", icon: "🍳" },
  { value: "escritorio", label: "Escritório", icon: "💼" },
  { value: "quarto", label: "Quarto", icon: "🛏️" },
  { value: "banheiro", label: "Banheiro", icon: "🚿" },
  { value: "externo", label: "Externo/Rua", icon: "🌳" },
  { value: "estudio", label: "Estúdio Profissional", icon: "📹" },
  { value: "custom", label: "Personalizado", icon: "✏️" }
];

const moods = [
  { value: "animado", label: "Animado/Energético", icon: "⚡" },
  { value: "calmo", label: "Calmo/Relaxante", icon: "🌿" },
  { value: "curioso", label: "Curioso/Misterioso", icon: "🔍" },
  { value: "urgente", label: "Urgente", icon: "🚨" },
  { value: "engracado", label: "Engraçado/Humorado", icon: "😂" },
  { value: "serio", label: "Sério/Profissional", icon: "🛡️" }
];

const duracoes = [
  { value: "curto", label: "3 takes (~24s)", icon: "⏱️" },
  { value: "medio", label: "5 takes (~40s)", icon: "⏱️" },
  { value: "longo", label: "8+ takes (~60s+)", icon: "⏱️" }
];

const tonalidades = [
  { value: "calma", label: "Suave/Calma" },
  { value: "normal", label: "Natural/Médio" },
  { value: "agressiva", label: "Intensa/Agressiva" }
];

const videoStyles = [
  "Review Clássico",
  "Uso no Dia a Dia",
  "Problema x Solução",
  "Unboxing Aesthetic",
  "Comparativo",
  "ASMR de Uso",
  "Storytelling Curto",
  "Dicas Rápidas"
];

const avatars = [
  { id: 1, name: "Helena", desc: "Voz Suave & Natural", style: "Feminina" },
  { id: 2, name: "Gabriel", desc: "Voz Confiante & Firme", style: "Masculina" },
  { id: 3, name: "Sophia", desc: "Voz Jovem & Dinâmica", style: "Feminina" },
  { id: 4, name: "Lucas", desc: "Voz Deep & Profissional", style: "Masculina" },
];

interface Config {
  productId: number | null;
  cenario: string;
  cenarioCustom: string;
  mood: string;
  duracao: string;
  cameraStyle: string;
  selectedAvatarId: number;
  tonalidade: string;
  tipoVoz: string;
  falaAvatar: string;
  instrucoes: string;
}

export default function CreateVideoPage() {
  const [currentPart, setCurrentPart] = useState(1);
  const { products } = useProducts();
  const { addPrompt } = usePrompts();
  const [showProductModal, setShowProductModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);

  const [config, setConfig] = useState<Config>({
    productId: null,
    cenario: "casa",
    cenarioCustom: "",
    mood: "animado",
    duracao: "curto",
    cameraStyle: "avatar",
    selectedAvatarId: 1,
    tonalidade: "normal",
    tipoVoz: "feminina",
    falaAvatar: "",
    instrucoes: ""
  });

  const setConfigValue = <K extends keyof Config>(key: K, value: Config[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const selectedProduct = useMemo(() => 
    products.find(p => p.id === config.productId), 
    [products, config.productId]
  );

  const selectedAvatar = useMemo(() => 
    avatars.find(a => a.id === config.selectedAvatarId),
    [config.selectedAvatarId]
  );

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FE2C55', '#25F4EE', '#FFFFFF']
    });
  };

  const generatePrompt = useCallback((styleOverride?: string) => {
    const product = products.find(p => p.id === config.productId);
    if (!product) return "";

    const style = styleOverride || videoStyles[currentStyleIndex];
    const cenarioText = config.cenario === "custom" ? config.cenarioCustom : cenarios.find(c => c.value === config.cenario)?.label || "Livre";
    const moodText = moods.find(m => m.value === config.mood)?.label || "Animado";
    const duracaoText = duracoes.find(d => d.value === config.duracao)?.label || "3 takes (~24s)";
    const avatar = selectedAvatar;

    // Fixed: Hashtags handle missing property and non-array types safely
    const hashtags = ["#tiktokshop", "#comprassemanais"];

    const promptText = `Você é um roteirista profissional especializado em vídeos virais para TikTok Shop. Crie um roteiro COMPLETO e DETALHADO seguindo TODAS as instruções abaixo.

====================================
1. BRIEFING DO VÍDEO
====================================
ESTILO DO VÍDEO: ${String(style)}
PRODUTO: ${String(product.nome)}
CATEGORIA: ${String(product.categoria)}
PREÇO: ${String(product.precoTexto || `R$ ${product.preco.toFixed(2)}`)}
COMISSÃO: ${String(product.comissao)}%
LINK: ${String(product.linkTiktok)}
CENÁRIO: ${String(cenarioText)}
ESTILO DE CÂMERA: ${String(config.cameraStyle === "avatar" ? "Avatar Visual" : "POV (Ponto de Vista)")}
${avatar ? `AVATAR: ${String(avatar.name)}` : "AVATAR: Nenhum"}
DURAÇÃO: ${String(duracaoText)}
TOM/MOOD: ${String(moodText)}
TIPO DE VOZ: ${String(config.tipoVoz === "feminina" ? "Feminina" : "Masculina")}
TONALIDADE: ${String(tonalidades.find(t => t.value === config.tonalidade)?.label || "Médio")}
${config.instrucoes ? `INSTRUÇÕES EXTRAS: ${String(config.instrucoes)}` : ""}
${config.falaAvatar ? `FALA DO AVATAR: ${String(config.falaAvatar)}` : ""}

====================================
2. PERSONA DO CRIADOR
====================================
Defina a persona ideal para este vídeo:
- Idade aparente, gênero, estilo visual
- Personalidade e energia que deve transmitir
- Como deve se apresentar nos primeiros 2 segundos
- Tom de fala e ritmo de comunicação

====================================
3. GANCHOS DE ABERTURA (3 VARIAÇÕES)
====================================
Crie 3 opções de gancho poderoso para os primeiros 3 segundos:
- GANCHO 1 (Curiosidade): frase que gera pergunta na mente
- GANCHO 2 (Choque/Surpresa): dado ou afirmação impactante
- GANCHO 3 (Identificação): "Você também..." / "Se você..."
Cada gancho deve ser curto (máx 10 palavras) e impossível de ignorar.

====================================
4. ROTEIRO CENA A CENA
====================================
Divida o roteiro em cenas com marcações de tempo:

CENA 1 (0s-3s) — GANCHO
- Texto falado: [fala exata]
- Ação visual: [o que aparece na tela]
- Texto na tela: [legenda curta e forte, máx 5 palavras]
- Enquadramento: [close-up / plano médio / etc]
- Transição: [corte seco / zoom / swipe]

CENA 2 (3s-8s) — PROBLEMA/CONTEXTO
- Texto falado: [fala exata]
- Ação visual: [demonstração do problema]
- Texto na tela: [legenda de impacto]
- B-roll sugerido: [imagens de apoio]

CENA 3 (8s-15s) — APRESENTAÇÃO DO PRODUTO
- Texto falado: [fala exata mostrando o produto]
- Ação visual: [unboxing / demonstração / close-up do produto]
- Texto na tela: [nome do produto + benefício principal]
- Zoom/movimento: [speed ramp / slow motion no detalhe]

CENA 4 (15s-25s) — PROVA + BENEFÍCIOS
- Texto falado: [prova social + 2-3 benefícios rápidos]
- Ação visual: [uso real / antes-depois / resultado]
- Texto na tela: [bullet points dos benefícios]
- B-roll: [closes nos detalhes]

CENA 5 (25s+) — CTA + FECHAMENTO
- Texto falado: [CTA claro e urgente]
- Ação visual: [apontar para link / mostrar preço / empilhar produto]
- Texto na tela: [CTA + preço + "Link na bio" / "TikTok Shop"]

====================================
5. NARRAÇÃO — TOM E RITMO POR CENA
====================================
Para cada cena, especifique:
- Volume/energia da voz (de 1 a 10)
- Velocidade da fala (rápida/média/lenta)
- Emoção predominante (empolgação/seriedade/humor/urgência)
- Pausas dramáticas (onde colocar silêncios de 0.5s)

====================================
6. TEXTO NA TELA (LEGENDAS ESTILO CAPCUT)
====================================
Para cada cena, forneça:
- Texto curto e forte (máx 5-7 palavras por frame)
- Cor sugerida (branco com sombra / amarelo destaque / vermelho urgência)
- Posição (centro / topo / base)
- Animação sugerida (pop-in / typewriter / shake)

====================================
7. SUGESTÕES DE B-ROLL / TAKE / ENQUADRAMENTO
====================================
Liste pelo menos 5 sugerões de takes adicionais:
1. Close-up extremo do produto
2. Mão segurando o produto (aesthetic)
3. Pessoa usando em cenário real
4. Comparação lado a lado
5. Reação genuína de uso
Especifique ângulo da câmera e iluminação para cada take.

====================================
8. INSTRUÇÕES DE EDIÇÃO
====================================
- ZOOM: onde aplicar zoom in/out (timestamps)
- SPEED RAMP: momentos de aceleração/desaceleração
- CORTES: frequência ideal (a cada X segundos)
- LEGENDAS: estilo CapCut (fonte, tamanho, cor, animação)
- MÚSICA: gênero + BPM sugerido + momentos de beat drop
- EFEITOS SONOROS: onde colocar "whoosh", "pop", "ding"
- FILTRO/GRADE: tom de cor sugerido (quente/frio/neutro)

====================================
9. CTA — 3 VARIAÇÕES
====================================
CTA 1 (Direto): "Compre agora" + frase de urgência
CTA 2 (Social proof): "Mais de X pessoas já compraram..."
CTA 3 (Escassez): "Últimas unidades / Só hoje / Preço especial..."

====================================
10. CHECKLIST DE COMPLIANCE
====================================
Verifique se o roteiro:
[ ] NÃO promete resultados milagrosos
[ ] NÃO usa linguagem enganosa
[ ] NÃO viola diretrizes do TikTok
[ ] TEM disclaimer se necessário
[ ] Menciona o preço real do produto
[ ] CTA é claro sem ser agressivo demais
[ ] Conteúdo é adequado para todas as idades

====================================
11. HASHTAGS RECOMENDADAS
====================================
${hashtags.join(" ")}
+ 5 hashtags específicas do nicho "${String(product.categoria)}"

====================================
OUTPUT FINAL: Entregue o roteiro completo e estruturado acima, pronto para ser copiado e usado no Google Flow VEO3.
====================================`;

    return promptText;
  }, [config, products, currentStyleIndex, selectedAvatar]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenProgress(0);

    const interval = setInterval(() => {
      setGenProgress(prev => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + Math.random() * 15;
      });
    }, 300);

    await new Promise(resolve => setTimeout(resolve, 2500));

    clearInterval(interval);
    setGenProgress(100);

    const prompt = generatePrompt();
    if (prompt) {
      setGeneratedPrompt(prompt);
      addPrompt(`Creator Lab - ${selectedProduct?.nome || "Produto"}`, prompt, "Creator Lab");
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsGenerating(false);
    setShowResult(true);
    toast.success("Prompt V03 gerado com sucesso!");
    fireConfetti();
  };

  const handleShuffle = () => {
    const nextIndex = (currentStyleIndex + 1) % videoStyles.length;
    setCurrentStyleIndex(nextIndex);
    const prompt = generatePrompt(videoStyles[nextIndex]);
    if (prompt) {
      setGeneratedPrompt(prompt);
      toast.success(`Nova variação: ${videoStyles[nextIndex]}`);
      fireConfetti();
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("Prompt copiado!");
    fireConfetti();
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative">
          <Wand2 className="w-16 h-16 text-primary animate-pulse" />
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Criando seu vídeo viral...</h2>
          <p className="text-muted-foreground text-sm">Nossa IA está estruturando o melhor roteiro para este produto</p>
        </div>
        <div className="w-full max-w-md space-y-2">
          <Progress value={genProgress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">{Math.round(genProgress)}% concluído</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Roteiro Finalizado!</h2>
              <p className="text-muted-foreground">Prompt estruturado para o Google Flow V03</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowResult(false)}>
              Criar Novo
            </Button>
            <Button onClick={handleCopyPrompt} className="bg-primary text-white">
              <Copy className="mr-2 h-4 w-4" /> Copiar Prompt
            </Button>
          </div>
        </div>

        <Card className="bg-card border-white/5 overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">Prompt Estruturado</CardTitle>
                <CardDescription>Estilo: {videoStyles[currentStyleIndex]}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleShuffle} className="text-primary hover:text-primary/80">
                <RefreshCw className="mr-2 h-4 w-4" /> Gerar Outra Versão
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-black/40 p-6 font-mono text-sm leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar">
              <pre className="whitespace-pre-wrap text-[#25F4EE]">
                {generatedPrompt}
              </pre>
            </div>
          </CardContent>
        </Card>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-secondary/20 border-white/5">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-medium">Usa músicas em alta no TikTok</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/20 border-white/5">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-medium">Focado em retenção dos 3s iniciais</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/20 border-white/5">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Film className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-medium">Instruções visuais cena a cena</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/20 border-white/5">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-medium">CTA direta focado em vendas</p>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(254,44,85,0.15)]">
            <Video className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Creator Lab</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Criar vídeos virais otimizados para V03
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-xl border border-white/5">
          {[1, 2, 3].map((step) => (
            <div 
              key={step}
              className={cn(
                "w-10 h-2 rounded-full transition-all duration-300",
                step === currentPart ? "bg-primary w-16" : step < currentPart ? "bg-primary/40" : "bg-muted-foreground/20"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Product & Basic Config */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-card/50 border-white/5 overflow-hidden">
            <CardHeader className="p-4 bg-white/5">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> 1. Escolha o Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {selectedProduct ? (
                <div className="flex items-start gap-4 p-3 bg-secondary/50 rounded-xl border border-white/10 group relative">
                  <img src={selectedProduct.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{selectedProduct.nome}</p>
                    <p className="text-xs text-muted-foreground">{selectedProduct.categoria}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">
                        {String(selectedProduct.comissao)}% comissão
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setShowProductModal(true)}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowProductModal(true)}
                  variant="outline"
                  className="w-full h-24 border-dashed border-white/10 bg-transparent hover:bg-white/5 flex flex-col gap-2"
                >
                  <Package className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm font-medium">Selecionar Produto</span>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/5">
            <CardHeader className="p-4 bg-white/5">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> 2. Estilo do Vídeo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Select value={videoStyles[currentStyleIndex]} onValueChange={(v) => setCurrentStyleIndex(videoStyles.indexOf(v))}>
                <SelectTrigger className="bg-secondary/50 h-10 border-white/5">
                  <SelectValue placeholder="Estilo" />
                </SelectTrigger>
                <SelectContent>
                  {videoStyles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Duração Estimada</Label>
                <div className="grid grid-cols-3 gap-2">
                  {duracoes.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setConfigValue("duracao", d.value)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] transition-all",
                        config.duracao === d.value ? "bg-primary border-primary text-white" : "bg-secondary/40 border-white/5 text-muted-foreground hover:bg-secondary/60"
                      )}
                    >
                      <span className="font-bold">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Deep Config */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs value={`part${currentPart}`} className="w-full">
            <TabsContent value="part1" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4">
              <Card className="bg-card/50 border-white/10 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" /> Cenário & Vibe
                  </CardTitle>
                  <CardDescription>Onde o vídeo será gravado e qual sentimento ele deve passar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-bold">Cenário Sugerido</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {cenarios.map(c => (
                        <button
                          key={c.value}
                          onClick={() => setConfigValue("cenario", c.value)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border text-sm transition-all",
                            config.cenario === c.value ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-secondary/40 border-white/5 text-muted-foreground hover:bg-secondary/60"
                          )}
                        >
                          <span className="text-xl">{c.icon}</span>
                          <span className="font-medium text-xs">{c.label}</span>
                        </button>
                      ))}
                    </div>
                    {config.cenario === "custom" && (
                      <Textarea 
                        placeholder="Descreva o cenário desejado..." 
                        value={config.cenarioCustom}
                        onChange={(e) => setConfigValue("cenarioCustom", e.target.value)}
                        className="bg-secondary/40 border-white/5 resize-none h-20"
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-bold">Tom / Mood emocional</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {moods.map(m => (
                        <button
                          key={m.value}
                          onClick={() => setConfigValue("mood", m.value)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border text-sm transition-all",
                            config.mood === m.value ? "bg-primary border-primary text-white" : "bg-secondary/40 border-white/5 text-muted-foreground hover:bg-secondary/60"
                          )}
                        >
                          <span className="text-xl">{m.icon}</span>
                          <span className="font-medium text-xs">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="part2" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4">
              <Card className="bg-card/50 border-white/10 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" /> Estilo da Câmera & Avatar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                     <Label className="text-sm font-bold">Perspectiva do Vídeo</Label>
                     <RadioGroup value={config.cameraStyle} onValueChange={(v) => setConfigValue("cameraStyle", v)} className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                           <RadioGroupItem value="avatar" id="avatar" />
                           <Label htmlFor="avatar" className="cursor-pointer">Aparecer Avatar (Influencer)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                           <RadioGroupItem value="pov" id="pov" />
                           <Label htmlFor="pov" className="cursor-pointer">POV / Handheld (Mais Autêntico)</Label>
                        </div>
                     </RadioGroup>
                  </div>

                  {config.cameraStyle === "avatar" && (
                    <div className="space-y-4">
                      <Label className="text-sm font-bold">Selecione o Criador (Avatar)</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {avatars.map(a => (
                          <div 
                            key={a.id}
                            onClick={() => setConfigValue("selectedAvatarId", a.id)}
                            className={cn(
                              "relative cursor-pointer p-4 rounded-2xl border transition-all",
                              config.selectedAvatarId === a.id ? "bg-primary/10 border-primary" : "bg-secondary/40 border-white/5 grayscale hover:grayscale-0"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                {String(a.name)[0]}
                              </div>
                              <div>
                                <p className="text-sm font-bold">{a.name}</p>
                                <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                              </div>
                            </div>
                            {config.selectedAvatarId === a.id && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <Label className="text-sm font-bold">Tipo de Voz</Label>
                       <Select value={config.tipoVoz} onValueChange={(v) => setConfigValue("tipoVoz", v)}>
                         <SelectTrigger className="bg-secondary/40 border-white/5">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="feminina">Feminina</SelectItem>
                           <SelectItem value="masculina">Masculina</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-4">
                       <Label className="text-sm font-bold">Velocidade/Tonalidade</Label>
                       <Select value={config.tonalidade} onValueChange={(v) => setConfigValue("tonalidade", v)}>
                         <SelectTrigger className="bg-secondary/40 border-white/5">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           {tonalidades.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                         </SelectContent>
                       </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="part3" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4">
              <Card className="bg-card/50 border-white/10 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" /> Instruções Detalhadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {config.cameraStyle === "avatar" && (
                    <div className="space-y-3">
                      <Label className="text-sm font-bold">O que o avatar deve falar? (Opcional)</Label>
                      <Textarea 
                        placeholder="Ex: No começo do vídeo peça para eles comentarem a cor favorita..." 
                        value={config.falaAvatar}
                        onChange={(e) => setConfigValue("falaAvatar", e.target.value)}
                        className="bg-secondary/40 border-white/5 h-24"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label className="text-sm font-bold">Instruções Extras para a IA</Label>
                    <Textarea 
                      placeholder="Ex: Focar muito no material do produto / Falar que o frete é grátis..." 
                      value={config.instrucoes}
                      onChange={(e) => setConfigValue("instrucoes", e.target.value)}
                      className="bg-secondary/40 border-white/5 h-24"
                    />
                  </div>

                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Info className="w-4 h-4" />
                      <p className="text-xs font-bold uppercase">Prompt Otimizado V03</p>
                    </div>
                    <p className="text-[10px] text-white/70 leading-relaxed">
                      Este gerador utiliza uma estrutura de roteirização comprovada do TikTok Shop (Hook, Problem, Solution, CTA). O output é otimizado especificamente para o Google Flow V03.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {currentPart > 1 && (
                <Button variant="ghost" onClick={() => setCurrentPart(s => s - 1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                </Button>
              )}
            </div>
            
            {currentPart < 3 ? (
              <Button onClick={() => setCurrentPart(s => s + 1)} className="bg-white text-black hover:bg-white/90">
                Próximo <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                disabled={config.productId === null || isGenerating} 
                onClick={handleGenerate}
                className="bg-primary text-white hover:bg-primary/90 px-8 h-12 text-lg shadow-lg shadow-primary/25"
              >
                <Rocket className="mr-2 h-5 w-5" /> Gerar Prompt
              </Button>
            )}
          </div>
        </div>
      </div>

      <ProductSelectorModal 
        open={showProductModal} 
        onOpenChange={setShowProductModal}
        onSelect={(p: Product) => { setConfigValue("productId", p.id); setShowProductModal(false); }}
      />
    </div>
  );
}
