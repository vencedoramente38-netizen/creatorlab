import React, { useState } from "react";
import { 
  Zap, 
  Wand2, 
  RefreshCw, 
  Copy, 
  Trash2, 
  LayoutPanelLeft,
  Search,
  CheckCircle,
  Smartphone,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MessageSquare,
  FileText,
  Clock,
  Music,
  Camera,
  Layers,
  Star,
  Clapperboard,
  Palette,
  Laugh,
  AlertCircle,
  BookOpen,
  MessageCircle,
  Flame,
  Target,
  History
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { usePrompts } from "@/hooks/usePrompts";
import { cn } from "@/lib/utils";

const STEPS = ["Categorias", "Estilo", "Vídeo", "Gerar"];

const CATEGORIES = [
  { id: "moda", label: "Moda & Beleza", icon: Palette },
  { id: "casa", label: "Casa & Cozinha", icon: Layers },
  { id: "pets", label: "Pets", icon: Target },
  { id: "eletronicos", label: "Eletrônicos", icon: Smartphone },
  { id: "fitness", label: "Fitness & Saúde", icon: Flame },
  { id: "comida", label: "Alimentos", icon: Zap },
  { id: "financas", label: "Finanças", icon: FileText },
  { id: "vlog", label: "Lifestyle/Vlog", icon: Camera },
];

const STYLES = [
  { id: "engracado", label: "Engraçado", icon: Laugh },
  { id: "educativo", label: "Educativo", icon: BookOpen },
  { id: "urgente", label: "Urgente", icon: AlertCircle },
  { id: "storytelling", label: "Storytelling", icon: History },
  { id: "aesthetic", label: "Aesthetic", icon: Sparkles },
  { id: "debate", label: "Debate", icon: MessageCircle },
];

const VIDEO_TYPES = [
  { id: "review", label: "Review de Produto", icon: Star },
  { id: "dica", label: "Dicas Rápidas", icon: Sparkles },
  { id: "lista", label: "Top 5 / Lista", icon: FileText },
  { id: "tutorial", label: "Tutorial/How-to", icon: Clapperboard },
  { id: "trend", label: "Baseado em Trend", icon: Music },
  { id: "fake", label: "Fake Chat/WhatsApp", icon: MessageSquare },
];

export default function ViralCreator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const { addPrompt } = usePrompts();
  
  // Script Selection State
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [topic, setTopic] = useState("");

  const handleNext = () => {
    if (currentStep === 0 && !selectedCategory) return toast.error("Selecione uma categoria");
    if (currentStep === 1 && !selectedStyle) return toast.error("Selecione um estilo");
    if (currentStep === 2 && (!selectedType || !topic)) return toast.error("Preencha o tipo e o tópico");
    
    setCurrentStep(prev => prev + 1);
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FE2C55', '#25F4EE', '#FFFFFF']
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenProgress(0);

    const interval = setInterval(() => {
      setGenProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 5;
      });
    }, 200);

    try {
      const gKey = import.meta.env.VITE_GEMINI_API_KEY;
      const prompt = `Você é um especialista em TikTok Shop. Crie um roteiro viral curto (máx 30s) para a categoria ${selectedCategory}, estilo ${selectedStyle}, e tipo de vídeo ${selectedType}. Tópico: ${topic}. Foque em alta retenção e CTA clara. Responda apenas com o roteiro formatado.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const script = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar roteiro.";

      setGenProgress(100);
      addPrompt(`Viral Creator - ${topic}`, script, "Viral Creator");
      fireConfetti();
      toast.success("Roteiro viral gerado!");
      setCurrentStep(4); // Result Page
    } catch (error) {
      toast.error("Erro ao conectar com a IA.");
    } finally {
      setIsGenerating(false);
      clearInterval(interval);
    }
  };

  const OptionCard = ({ selected, onClick, icon: Icon, label }: { selected: boolean, onClick: () => void, icon?: any, label: string }) => (
    <Card 
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all border-white/10 overflow-hidden group",
        selected 
          ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(254,44,85,0.2)]" 
          : "bg-secondary/30 hover:bg-secondary/50"
      )}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center gap-3 text-center h-full">
        {Icon && <Icon className={cn("w-6 h-6", selected ? "text-primary" : "text-muted-foreground group-hover:text-white")} />}
        <span className={cn("text-xs font-bold uppercase tracking-wider", selected ? "text-white" : "text-muted-foreground")}>{label}</span>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(254,44,85,0.15)]">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Viral Creator</h2>
            <p className="text-muted-foreground">Scripts inteligentes que explodem em visualizações</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
        {STEPS.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                idx === currentStep ? "bg-primary text-white shadow-[0_0_15px_rgba(254,44,85,0.5)]" : idx < currentStep ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              )}>
                {idx < currentStep ? <Check className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={cn("text-[10px] uppercase font-bold tracking-tighter", idx === currentStep ? "text-white" : "text-muted-foreground")}>{step}</span>
            </div>
            {idx < STEPS.length - 1 && <div className={cn("h-0.5 flex-1 max-w-[40px] mb-6", idx < currentStep ? "bg-primary/50" : "bg-secondary")} />}
          </React.Fragment>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
            <div className="relative">
               <Wand2 className="w-16 h-16 text-primary animate-spin-slow" />
               <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Criando Roteiro...</h3>
              <Progress value={genProgress} className="w-64 h-2 mx-auto" />
              <p className="text-xs text-muted-foreground">Nossa IA está analisando padrões de viralização</p>
            </div>
          </div>
        ) : (
          <>
            {currentStep === 0 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Qual o nicho do vídeo?</h3>
                  <p className="text-sm text-muted-foreground">Cada nicho tem um padrão de comportamento diferente no TikTok</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CATEGORIES.map(c => (
                    <OptionCard 
                      key={c.id} 
                      label={c.label} 
                      icon={c.icon} 
                      selected={selectedCategory === c.label} 
                      onClick={() => setSelectedCategory(c.label)} 
                    />
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Qual o estilo de comunicação?</h3>
                  <p className="text-sm text-muted-foreground">O tom de voz define a conexão com o público</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {STYLES.map(s => (
                    <OptionCard 
                      key={s.id} 
                      label={s.label} 
                      icon={s.icon} 
                      selected={selectedStyle === s.label} 
                      onClick={() => setSelectedStyle(s.label)} 
                    />
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Sobre o que vamos falar?</h3>
                  <p className="text-sm text-muted-foreground">Defina o formato e o tema principal</p>
                </div>
                <Card className="bg-card border-white/5">
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                      <Label className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Formato do Conteúdo</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {VIDEO_TYPES.map(t => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedType(t.label)}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl border text-sm transition-all",
                              selectedType === t.label ? "bg-primary border-primary text-white" : "bg-secondary/40 border-white/5 text-muted-foreground hover:bg-secondary/60"
                            )}
                          >
                            <t.icon className="w-4 h-4" />
                            <span className="font-medium text-xs truncate">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Tópico ou Nome do Produto</Label>
                      <Input 
                        placeholder="Ex: Novo fone Bluetooth / Como organizar a geladeira..." 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="bg-secondary/50 h-12 border-white/10 text-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
                <div className="p-8 bg-primary/5 rounded-3xl border border-primary/20 space-y-4 max-w-lg mx-auto">
                   <Wand2 className="w-12 h-12 text-primary mx-auto" />
                   <h3 className="text-2xl font-bold">Pronto para visualizar!</h3>
                   <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Categoria: <span className="text-primary font-bold">{selectedCategory}</span></p>
                      <p>Estilo: <span className="text-primary font-bold">{selectedStyle}</span></p>
                      <p>Tipo: <span className="text-primary font-bold">{selectedType}</span></p>
                   </div>
                   <Button onClick={handleGenerate} className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_25px_rgba(254,44,85,0.4)]">
                     <Zap className="mr-2 w-5 h-5 fill-white" /> Gerar Roteiros Virais
                   </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 text-center animate-in fade-in duration-500">
                <div className="p-12 bg-secondary/20 rounded-3xl border border-white/5 space-y-4">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">Roteiro Salvo!</h3>
                  <p className="text-muted-foreground">O roteiro gerado pela IA já está disponível na sua aba de "Meus Prompts".</p>
                  <div className="flex justify-center gap-4 pt-4">
                    <Button variant="outline" onClick={() => { setCurrentStep(0); setSelectedCategory(""); setSelectedStyle(""); setSelectedType(""); setTopic(""); }}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Criar Outro
                    </Button>
                    <Button onClick={() => window.location.href = "/meus-prompts"}>
                      <FileText className="mr-2 h-4 w-4" /> Ver Roteiros
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* NavButtons */}
            {currentStep < 3 && (
              <div className="flex justify-between items-center mt-8">
                <div>
                  {currentStep > 0 && (
                    <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                  )}
                </div>
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white px-8 h-12 font-bold group">
                  Próximo <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
