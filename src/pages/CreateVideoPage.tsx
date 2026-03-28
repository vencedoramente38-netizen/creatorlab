import React, { useState, useCallback, useMemo, useEffect } from "react";
import { 
  Wand2, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  Video, 
  Smartphone,
  Info,
  CheckCircle2,
  Zap,
  Camera,
  Layers,
  MessageSquare,
  Package,
  History,
  Rocket,
  Image as ImageIcon,
  Mic2,
  Settings2,
  Eye,
  ArrowRight,
  Flame,
  Heart,
  Search,
  CheckCircle,
  Users,
  Home,
  MapPin,
  Trees,
  Store,
  Briefcase,
  Waves,
  Bath,
  UtensilsCrossed,
  Coffee,
  Sun,
  GraduationCap,
  MoreHorizontal,
  Palette,
  Aperture,
  Hand,
  Monitor,
  Timer,
  Feather,
  Smile,
  Volume2,
  Music,
  Music2,
  Shield
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
import { useProducts } from "@/hooks/useProducts";
import { usePrompts } from "@/hooks/usePrompts";
import { cn } from "@/lib/utils";
import { Product } from "@/data/products";
import { useLocation, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Data Types & Constants ---

interface CreatorConfig {
  product: Product | null;
  cenario: string;
  cenarioCustom: string;
  cameraStyle: "frente" | "selfie" | "maos";
  pose: string;
  influencerStyle: string;
  imageImprovements: string[];
  selectedInfluencer: string | null;
  iaPlatform: "Flow VEO3" | "Grok";
  instructions: string;
  duration: 1 | 2 | 3 | 4 | 5;
  tone: string;
  voiceType: "feminina" | "masculina";
  voiceTonality: string;
  takeScripts: string[];
}

const STEPS = [
  { id: 1, title: "Produto", icon: Package },
  { id: 2, title: "Imagem", icon: ImageIcon },
  { id: 3, title: "Config", icon: Settings2 },
  { id: 4, title: "Fala", icon: Mic2 },
  { id: 5, title: "Revisão", icon: Eye }
];

const SCENARIOS = [
  { id: "home", name: "Em Casa", icon: Home },
  { id: "estudio", name: "Estúdio", icon: Camera },
  { id: "rua", name: "Na Rua", icon: MapPin },
  { id: "natureza", name: "Natureza", icon: Trees },
  { id: "loja", name: "Loja / Vitrine", icon: Store },
  { id: "escritorio", name: "Escritório", icon: Briefcase },
  { id: "praia", name: "Praia", icon: Waves },
  { id: "banheiro", name: "Banheiro", icon: Bath },
  { id: "cozinha", name: "Cozinha", icon: UtensilsCrossed },
  { id: "cafeteria", name: "Cafeteria", icon: Coffee },
  { id: "ar_livre", name: "Ao ar livre", icon: Sun },
  { id: "academia", name: "Academia", icon: GraduationCap },
  { id: "outros", name: "Outros", icon: MoreHorizontal }
];

const CAMERA_STYLES = [
  { id: "frente", name: "De Frente", desc: "Influencer segurando o produto em plano médio.", color: "pink" },
  { id: "selfie", name: "Selfie", desc: "Formato vlog, conexão direta com a audiência.", color: "cyan" },
  { id: "maos", name: "Mãos", desc: "Foco total no produto e detalhes táteis.", color: "green" }
];

const INFLUENCER_STYLES = ["Casual", "Profissional", "Esportivo", "Glamouroso", "Minimalista"];

const IMAGE_IMPROVEMENTS = [
  { id: "pele", name: "Pele Realista", icon: Users },
  { id: "luz", name: "Luz de Estúdio", icon: Sun },
  { id: "realismo", name: "HD Realism", icon: Search },
  { id: "cores", name: "Vibrant Colors", icon: Palette },
  { id: "profundidade", name: "Bokeh Effect", icon: Aperture },
  { id: "maos", name: "High Detail", icon: Hand }
];

const IA_PLATFORMS = [
  { id: "Flow VEO3", name: "Flow VEO3", icon: Monitor, pros: ["Alta Fidelidade", "Sincronia Labial"], cons: ["Custo maior"] },
  { id: "Grok", name: "Grok", icon: Zap, pros: ["Rápido", "Eficiente"], cons: ["Menos detalhes"] }
];

const DURATIONS = [
  { id: 1, label: "08 Segundos", detail: "Ideal para ganchos diretos" },
  { id: 2, label: "16 Segundos", detail: "Dois takes de impacto" },
  { id: 3, label: "24 Segundos", detail: "Apresentação completa" },
  { id: 4, label: "32 Segundos", detail: "Review detalhado" },
  { id: 5, label: "40 Segundos", detail: "Narrativa viral longa" }
];

const TONES = [
  { id: "animado", name: "Animado", icon: Zap },
  { id: "calmo", name: "Calmo", icon: Feather },
  { id: "urgente", name: "Urgente", icon: Flame },
  { id: "divertido", name: "Divertido", icon: Smile }
];

const VOICE_TYPES = [
  { id: "feminina", name: "Feminina", icon: Users },
  { id: "masculina", name: "Masculina", icon: Users }
];

const TONALITIES = [
  { id: "grave", name: "Grave", icon: Volume2 },
  { id: "medio", name: "Médio", icon: Music },
  { id: "agudo", name: "Agudo", icon: Music2 },
  { id: "doce", name: "Doce", icon: Heart },
  { id: "serio", name: "Sério", icon: Shield }
];

const POSES = [
  { id: "Casual", name: "Pose Casual", desc: "Influencer segurando o produto naturalmente." },
  { id: "Demonstracao", name: "Demonstração", desc: "Mostrando as funcionalidades do produto." },
  { id: "Close-up", name: "Close-up", desc: "Focado nos detalhes e textura do item." },
  { id: "Entusiasmo", name: "Entusiasmo", desc: "Expressão de alegria ao usar o produto." }
];

// --- Main Component ---

export default function CreateVideoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addPrompt } = usePrompts();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<CreatorConfig>({
    product: null,
    cenario: "home",
    cenarioCustom: "",
    cameraStyle: "frente",
    pose: "Casual",
    influencerStyle: "Casual",
    imageImprovements: ["pele", "luz"],
    selectedInfluencer: null,
    iaPlatform: "Flow VEO3",
    instructions: "",
    duration: 1,
    tone: "animado",
    voiceType: "feminina",
    voiceTonality: "medio",
    takeScripts: ["", "", "", "", ""]
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const updateConfig = useCallback((updates: Partial<CreatorConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    const state = location.state as { product?: Product };
    if (state?.product) {
      updateConfig({ product: state.product });
    }
  }, [location.state, updateConfig]);

  const stepValid = useMemo(() => {
    if (currentStep === 1) return !!config.product;
    return true;
  }, [currentStep, config.product]);

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF0055", "#00FFDD", "#FFFFFF"]
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenProgress(0);

    const interval = setInterval(() => {
      setGenProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 50);

    setTimeout(() => {
      const promptText = `--- CRYSTAL ENGINE V3.0 PROMPT ---\nPRODUCT: ${config.product?.nome}\nPLATFORM: ${config.iaPlatform}\nDURATION: ${config.duration * 8}s\nVISUAL: ${config.cenario}, ${config.influencerStyle}, ${config.cameraStyle}\nVOICE: ${config.voiceType}, ${config.tone}\n\n[SCRIPT]\n${config.takeScripts.slice(0, config.duration).map((s, i) => `T${i+1}: ${s || "IA Generated Hook..."}`).join('\n')}`;
      setGeneratedPrompt(promptText);
      setIsGenerating(false);
      setShowResult(true);
      fireConfetti();
      toast.success("Roteiro Criado!");
    }, 3000);
  };

  // --- Step Sub-components ---

  const Step1Produto = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Escolha o Produto</h3>
            <p className="text-muted-foreground font-medium text-sm">Selecione o item para o qual criaremos o vídeo viral.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/radar")} className="text-xs font-bold text-primary hover:bg-primary/10 rounded-xl">
            Catálogo Completo <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <ScrollArea className="h-[380px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div 
                key={p.id}
                onClick={() => updateConfig({ product: p })}
                className={cn(
                  "group relative bg-white/5 border-2 rounded-[32px] p-5 transition-all cursor-pointer",
                  config.product?.id === p.id 
                    ? "border-primary bg-primary/10 shadow-2xl shadow-primary/20 scale-[1.02]" 
                    : "border-white/5 hover:border-white/10 hover:bg-white/10"
                )}
              >
                <div className="aspect-square rounded-[24px] overflow-hidden mb-4 relative">
                  <img src={p.imageUrl} alt={p.nome} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" />
                  {config.product?.id === p.id && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                       <CheckCircle2 className="h-10 w-10 text-white fill-primary" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Badge className="bg-primary/20 text-primary border-none text-[8px] uppercase tracking-widest">{p.categoria}</Badge>
                  <h4 className="font-black text-white text-xs line-clamp-1 italic uppercase tracking-tighter">{p.nome}</h4>
                  <p className="text-[10px] font-black text-emerald-400">Comissão: {p.comissao}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Cenário Principal</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => updateConfig({ cenario: s.name })}
              className={cn(
                "p-4 rounded-[24px] border flex flex-col items-center gap-2 transition-all",
                config.cenario === s.name ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
              )}
            >
              <s.icon className="h-4 w-4" />
              <span className="text-[9px] font-black uppercase tracking-tight">{s.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const Step2Imagem = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-6">
        <div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Ângulo da Camera</h3>
          <p className="text-muted-foreground font-medium text-sm">Defina como o influencer irá apresentar o produto.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {CAMERA_STYLES.map((style) => (
            <div 
              key={style.id}
              onClick={() => updateConfig({ cameraStyle: style.id as any })}
              className={cn(
                "relative p-8 rounded-[40px] border-2 cursor-pointer transition-all bg-white/5",
                config.cameraStyle === style.id ? "border-primary bg-primary/10 shadow-2xl shadow-primary/20" : "border-white/5 hover:border-white/10"
              )}
            >
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center mb-6",
                style.color === "pink" ? "bg-pink-500/20 text-pink-500" : style.color === "cyan" ? "bg-cyan-500/20 text-cyan-500" : "bg-emerald-500/20 text-emerald-500"
              )}>
                 {style.id === "frente" && <Users className="h-6 w-6" />}
                 {style.id === "selfie" && <Smartphone className="h-6 w-6" />}
                 {style.id === "maos" && <Hand className="h-6 w-6" />}
              </div>
              <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">{style.name}</h4>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">{style.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
         <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Otimizadores de Imagem</h3>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {IMAGE_IMPROVEMENTS.map(opt => (
              <div 
                key={opt.id}
                onClick={() => {
                  const current = config.imageImprovements;
                  updateConfig({ 
                    imageImprovements: current.includes(opt.id) 
                      ? current.filter(i => i !== opt.id) 
                      : [...current, opt.id] 
                  });
                }}
                className={cn(
                  "p-5 rounded-[24px] border flex items-center gap-4 transition-all cursor-pointer",
                  config.imageImprovements.includes(opt.id) ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/10 text-muted-foreground"
                )}
              >
                <opt.icon className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-widest">{opt.name}</span>
                {config.imageImprovements.includes(opt.id) && <CheckCircle2 className="h-4 w-4 ml-auto" />}
              </div>
            ))}
         </div>
      </section>
    </div>
  );

  const Step3Config = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">IA Platform</h3>
              <div className="space-y-3">
                {IA_PLATFORMS.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => updateConfig({ iaPlatform: p.id as any })}
                    className={cn(
                      "p-4 rounded-[28px] border-2 cursor-pointer transition-all",
                      config.iaPlatform === p.id ? "border-primary bg-primary/5 shadow-lg" : "border-white/5 bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                       <p.icon className="h-4 w-4 text-primary" />
                       <span className="font-bold text-white text-sm">{p.name}</span>
                    </div>
                    <div className="flex gap-1">
                       {p.pros.map((pro, i) => <Badge key={i} className="bg-emerald-500/10 text-emerald-400 border-none text-[7px] uppercase font-black">{pro}</Badge>)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Duração Total</h3>
              <div className="grid gap-2">
                {DURATIONS.map(d => (
                  <div 
                    key={d.id}
                    onClick={() => updateConfig({ duration: d.id as any })}
                    className={cn(
                      "p-4 rounded-[24px] border flex items-center justify-between cursor-pointer transition-all",
                      config.duration === d.id ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10"
                    )}
                  >
                     <div>
                        <p className="font-bold text-white text-xs">{d.label}</p>
                        <p className="text-[9px] text-muted-foreground uppercase">{d.detail}</p>
                     </div>
                     <Timer className={cn("h-4 w-4", config.duration === d.id ? "text-primary" : "text-muted-foreground")} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-3 space-y-4">
             <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Instruções de Estilo & Prompting</h3>
             <Textarea 
               placeholder="Ex: Foque nos detalhes da embalagem, destaque o acabamento premium, sugira um tom amigável porém persuasivo..."
               className="bg-white/5 border-white/10 min-h-[420px] rounded-[40px] p-8 focus:ring-primary/20 text-sm font-medium leading-relaxed resize-none"
               value={config.instructions}
               onChange={(e) => updateConfig({ instructions: e.target.value })}
             />
          </div>
       </div>
    </div>
  );

  const Step4Fala = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="grid lg:grid-cols-3 gap-10">
          <div className="space-y-8">
             <section className="space-y-4">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Voz & Persona</h3>
                <div className="grid grid-cols-2 gap-3">
                   {VOICE_TYPES.map(v => (
                     <div 
                       key={v.id}
                       onClick={() => updateConfig({ voiceType: v.id as any })}
                       className={cn(
                         "p-5 rounded-[28px] border-2 cursor-pointer flex flex-col items-center gap-2",
                         config.voiceType === v.id ? "border-primary bg-primary/10 shadow-lg" : "border-white/5 bg-white/5"
                       )}
                     >
                        <v.icon className={cn("h-6 w-6", config.voiceType === v.id ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-bold text-white text-xs">{v.name}</span>
                     </div>
                   ))}
                </div>
             </section>

             <section className="space-y-4">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Tom de Voz</h4>
                <div className="grid grid-cols-2 gap-2">
                   {TONES.map(t => (
                     <button
                       key={t.id}
                       onClick={() => updateConfig({ tone: t.id })}
                       className={cn(
                         "p-3 rounded-2xl border flex items-center gap-2 transition-all",
                         config.tone === t.id ? "bg-secondary border-secondary text-white" : "bg-white/5 border-white/10 text-muted-foreground"
                       )}
                     >
                       <t.icon className="h-3 w-3" />
                       <span className="text-[10px] font-bold">{t.name}</span>
                     </button>
                   ))}
                </div>
             </section>

             <section className="space-y-4">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Tonalidade</h4>
                <div className="grid grid-cols-2 gap-2">
                   {TONALITIES.map(tn => (
                     <button
                       key={tn.id}
                       onClick={() => updateConfig({ voiceTonality: tn.id })}
                       className={cn(
                         "p-3 rounded-2xl border flex items-center gap-2 transition-all",
                         config.voiceTonality === tn.id ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted-foreground"
                       )}
                     >
                       <tn.icon className="h-3 w-3" />
                       <span className="text-[10px] font-bold">{tn.name}</span>
                     </button>
                   ))}
                </div>
             </section>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Roteiro por Take (8s cada)</h3>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black italic">PROMPT-SYNC ENGINE</Badge>
             </div>
             
             <div className="space-y-5">
                {Array.from({ length: config.duration }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <div className="h-5 w-5 bg-primary/20 rounded flex items-center justify-center text-primary font-bold">0{i+1}</div>
                      DIÁLOGO DO TAKE {i+1}
                    </Label>
                    <Textarea 
                      placeholder="IA irá gerar automaticamente se deixar vazio..."
                      className="bg-white/3 border-white/5 rounded-[24px] p-6 focus:ring-primary/20 min-h-[100px] text-sm font-medium italic transition-all"
                      value={config.takeScripts[i]}
                      onChange={(e) => {
                        const newScripts = [...config.takeScripts];
                        newScripts[i] = e.target.value;
                        updateConfig({ takeScripts: newScripts });
                      }}
                    />
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const Step5Revisao = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
           <section className="space-y-6">
              <div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Engenharia Final</h3>
                <p className="text-muted-foreground font-medium">Resumo do setup otimizado para viralização.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Produto", val: config.product?.nome, icon: Package },
                  { label: "Cenário", val: config.cenario, icon: Home },
                  { label: "Voz", val: `${config.voiceType} (${config.voiceTonality})`, icon: Mic2 },
                  { label: "Duração", val: `${config.duration * 8} Segundos`, icon: History },
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-white/3 border border-white/5 rounded-[28px] flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                      <p className="text-xs font-bold text-white line-clamp-1">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
           </section>

           <Card className="bg-gradient-to-br from-primary/15 to-transparent border-primary/20 rounded-[40px] p-8 space-y-5">
              <div className="flex items-center gap-4">
                 <div className="h-14 w-14 bg-primary rounded-[22px] flex items-center justify-center shadow-2xl shadow-primary/40">
                    <Rocket className="h-8 w-8 text-white fill-white" />
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Crystal Power Ativado</h4>
                    <p className="text-xs text-white/60 font-medium">Ajustes finais de renderização configurados.</p>
                 </div>
              </div>
              <p className="text-xs text-white/40 leading-relaxed italic border-l-2 border-primary/30 pl-4">
                "Utilizando LLM avançado para garantir sincronia labial e fidelidade extrema ao produto materializado no cenário."
              </p>
           </Card>
        </div>

        <div className="space-y-6">
          <div className="relative aspect-[9/16] rounded-[56px] overflow-hidden border-4 border-white/5 bg-black group max-h-[580px] mx-auto shadow-2xl">
             {config.product && (
               <img 
                src={config.product.imageUrl} 
                className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale blur-md scale-110"
                alt="" 
               />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
             <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-2 border-primary/40 flex items-center justify-center">
                     <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                  <div className="absolute -inset-4 border border-primary/10 rounded-full animate-ping" />
                </div>
                <div>
                   <h5 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Build V3.0</h5>
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Ready for generation via {config.iaPlatform}</p>
                </div>
             </div>
             
             <div className="absolute bottom-10 left-8 right-8">
                <Button 
                  onClick={handleGenerate}
                  className="w-full h-16 bg-white text-black hover:bg-white/90 font-black text-lg rounded-[28px] shadow-2xl group italic"
                >
                  START BUILD <Zap className="ml-2 h-6 w-6 fill-black group-hover:scale-125 transition-transform" />
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Layout logic ---

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-12 animate-in fade-in duration-700">
        <div className="relative">
          <div className="h-44 w-44 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
          <Wand2 className="h-28 w-28 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce-slow" />
          <div className="absolute -top-6 -right-6 h-14 w-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-spin-slow">
            <RefreshCw className="h-7 w-7 text-white" />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none italic">Engenharia Viral</h2>
          <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.4em]">{config.iaPlatform} calibrando luz e roteiro...</p>
        </div>

        <div className="w-full max-w-xl space-y-4 px-10">
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
            <div 
              className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300 relative"
              style={{ width: `${genProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
            <span>Product Scan</span>
            <span className="text-white text-base">{Math.round(genProgress)}%</span>
            <span>Final Sync</span>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in-95 duration-700 pb-20 mt-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 border-b border-white/5 pb-12">
          <div className="flex items-center gap-8">
            <div className="h-22 w-22 bg-emerald-500 rounded-[35px] flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">Build Completa</h2>
              <div className="flex gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 font-black text-[10px] uppercase italic">Roteiro Otimizado</Badge>
                <Badge className="bg-primary/10 text-primary border-none px-3 font-black text-[10px] uppercase italic">Prompt Pronto</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Button 
              variant="ghost" 
              onClick={() => { setShowResult(false); setCurrentStep(1); }}
              className="h-14 px-8 border-white/10 hover:bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest italic"
            >
              CRIAR NOVO
            </Button>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(generatedPrompt);
                toast.success("Prompt copiado!");
              }}
              className="h-16 px-12 bg-white text-black hover:bg-white/90 rounded-[28px] font-black text-sm uppercase tracking-widest gap-4 shadow-2xl shadow-white/20"
            >
              COPIAR PROMPT <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-[#050505] border-2 border-white/5 rounded-[56px] p-12 shadow-2xl relative overflow-hidden group">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed custom-scrollbar max-h-[520px] overflow-y-auto relative z-10 selection:bg-primary selection:text-white italic">
                {generatedPrompt}
              </pre>
              <div className="absolute top-10 right-10 flex gap-2">
                <Badge className="bg-white/5 text-white/40 border-white/10 font-mono text-[9px] uppercase tracking-tighter">CRYSTAL ENGINE JSON V3.0</Badge>
              </div>
              <div className="absolute -bottom-24 -right-24 h-80 w-80 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/15 transition-all" />
            </div>

            <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-[40px] flex items-start gap-6">
              <Info className="h-7 w-7 text-blue-400 shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-sm font-black text-white uppercase tracking-widest italic">Manual do Criador</p>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                  Copie o código acima e insira no campo "Visual/Scene" da sua ferramenta de vídeo. O script de áudio já contém as pausas rítmicas indicadas pela tonificadora {config.voiceTonality}.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <Card className="bg-white/3 border border-white/5 rounded-[56px] p-12 space-y-8 relative overflow-hidden">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] flex items-center gap-3">
                <History className="h-4 w-4" /> TIMELINE DO SCRIPT
              </h4>

              <div className="space-y-8 relative z-10">
                {Array.from({ length: config.duration }).map((_, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center font-black text-primary text-xs">
                      {i+1}
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-white uppercase tracking-tighter opacity-40">Take {i+1} - 8s</p>
                      <p className="text-xs text-muted-foreground leading-relaxed font-semibold line-clamp-2 italic">
                        {config.takeScripts[i] || "IA calibrando pitch e entonação viral para este take."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/5 blur-[60px] rounded-full" />
            </Card>

            <div className="p-12 bg-gradient-to-br from-primary/15 via-transparent to-transparent border border-primary/30 rounded-[56px] space-y-8">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 bg-primary/20 rounded-[22px] flex items-center justify-center border border-primary/30">
                  <Flame className="h-8 w-8 text-primary shadow-lg" />
                </div>
                <h5 className="font-black text-white italic uppercase tracking-tighter text-xl leading-none">Score Viral</h5>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] leading-none">Potencial de Escala</span>
                  <span className="text-3xl font-black text-primary italic leading-none">99.2%</span>
                </div>
                <Progress value={99} className="h-2.5 bg-black/60 overflow-hidden rounded-full border border-white/5 shadow-inner" />
                <p className="text-[10px] text-muted-foreground leading-relaxed text-center italic font-semibold px-6 opacity-70">
                  "Este roteiro atinge o índice máximo de retenção nos primeiros 3 segundos."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 px-4 sm:px-0 mt-8">
      {/* Stepper Superior */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pb-12 border-b border-white/5">
        <div className="flex items-center gap-8 self-start">
          <div className="h-24 w-24 bg-gradient-to-br from-primary to-pink-600 rounded-[35px] shadow-2xl shadow-primary/40 flex items-center justify-center relative group overflow-hidden">
            <Video className="w-12 h-12 text-white fill-white transition-transform group-hover:scale-110 relative z-10" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <div className="absolute -inset-8 bg-white/10 blur-[50px] scale-0 group-hover:scale-100 transition-transform duration-1000" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <h2 className="text-6xl font-black text-white tracking-widest uppercase italic leading-none">Creator Lab</h2>
              <Badge className="bg-primary/20 text-primary border-primary/40 font-black px-4 py-1.5 rounded-xl text-[11px] uppercase tracking-[0.3em] h-fit">ULTRA V3</Badge>
            </div>
            <p className="text-muted-foreground font-black text-[12px] tracking-[0.4em] uppercase flex items-center gap-3 mt-3">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" /> Engenharia de Roteiro via Gemini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#0A0A0A] p-3 rounded-[35px] border border-white/10 max-w-full overflow-x-auto no-scrollbar shadow-2xl ring-1 ring-white/5">
          {STEPS.map((step) => (
            <div 
              key={step.id} 
              className={cn(
                "flex items-center gap-5 px-8 py-5 rounded-[28px] transition-all duration-700 min-w-fit relative group",
                currentStep === step.id 
                  ? "bg-white text-black shadow-2xl ring-4 ring-white/10 scale-105" 
                  : currentStep > step.id 
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" 
                    : "text-muted-foreground/20 hover:text-muted-foreground/40 transition-colors"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center transition-all",
                currentStep === step.id ? "bg-black text-white" : "bg-white/5"
              )}>
                <step.icon className={cn("h-5 w-5", currentStep === step.id && "animate-pulse")} />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Step 0{step.id}</span>
                <span className="text-base font-black italic uppercase tracking-tighter">{step.title}</span>
              </div>
              {currentStep > step.id && (
                <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1.5 border-4 border-[#030303] shadow-2xl">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <main className="min-h-[600px] relative mt-12 py-10">
        <div className="absolute -left-40 top-40 w-96 h-96 bg-primary/10 blur-[180px] rounded-full" />
        <div className="absolute -right-40 bottom-40 w-96 h-96 bg-blue-500/10 blur-[180px] rounded-full" />
        
        <div className="relative z-10 transition-all duration-700">
          {currentStep === 1 && <Step1Produto />}
          {currentStep === 2 && <Step2Imagem />}
          {currentStep === 3 && <Step3Config />}
          {currentStep === 4 && <Step4Fala />}
          {currentStep === 5 && <Step5Revisao />}
        </div>
      </main>

      <div className="flex items-center justify-between pt-20 border-t border-white/5 relative z-10">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          disabled={currentStep === 1}
          className="h-20 px-12 rounded-[32px] font-black text-[12px] text-muted-foreground hover:text-white hover:bg-white/5 transition-all disabled:opacity-0 uppercase tracking-[0.4em] gap-4"
        >
          <ChevronLeft className="h-6 w-6" /> Voltar
        </Button>

        <div className="flex items-center gap-10">
           {currentStep === 1 && config.product && (
             <div className="flex items-center gap-4 px-8 py-4 bg-primary/15 border border-primary/30 rounded-[28px] animate-in zoom-in-95 duration-500 shadow-xl shadow-primary/10">
               <div className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
               <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] italic">
                 {config.product.nome} Ativo
               </p>
             </div>
           )}
           <Button 
              onClick={currentStep === 5 ? handleGenerate : handleNext}
              disabled={!stepValid}
              className={cn(
                "h-24 px-20 rounded-[35px] font-black text-base tracking-[0.3em] shadow-2xl transition-all gap-6 group uppercase italic relative overflow-hidden",
                currentStep === 5 
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/40 text-white" 
                  : "bg-white text-black hover:bg-white/95 shadow-white/30"
              )}
           >
             <span className="relative z-10 flex items-center gap-5">
              {currentStep === 5 ? 'Ativar Crystal Engine' : 'Continuar Build'}
              {currentStep === 5 ? <Rocket className="h-7 w-7 group-hover:-translate-y-2 transition-transform" /> : <ChevronRight className="h-7 w-7 group-hover:translate-x-2 transition-transform" />}
             </span>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
           </Button>
        </div>
      </div>
    </div>
  );
}
