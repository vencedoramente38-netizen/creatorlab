import React, { useState } from "react";
import { 
  Bot, 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Copy, 
  CheckCircle,
  Smartphone,
  Check,
  ChevronRight,
  ChevronLeft,
  User,
  Star,
  Zap,
  Palette,
  Laugh,
  AlertCircle,
  BookOpen,
  MessageCircle,
  Flame,
  Target,
  History,
  FileText,
  Clock,
  Camera,
  Layers,
  Clapperboard,
  Music,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePrompts } from "@/hooks/usePrompts";
import { cn } from "@/lib/utils";

const STEPS = ["Gênero", "Estilo", "Vibe", "Gerar"];

const GENDERS = [
  { id: "feminino", label: "Feminino", icon: User },
  { id: "masculino", label: "Masculino", icon: User },
  { id: "animacao", label: "Animação/3D", icon: Bot },
  { id: "misterioso", label: "Misterioso/Dark", icon: Search },
];

const STYLES = [
  { id: "realista", label: "Ultra Realista", icon: Camera },
  { id: "anime", label: "Estilo Anime", icon: Palette },
  { id: "cyberpunk", label: "Cyberpunk", icon: Zap },
  { id: "luxo", label: "Luxo/Elegante", icon: Star },
  { id: "casual", label: "Casual/Dia a dia", icon: Layers },
  { id: "influencer", label: "Digital Influencer", icon: Target },
];

const VIBES = [
  { id: "confiante", label: "Confiante", icon: Zap },
  { id: "amigavel", label: "Amigável", icon: Laugh },
  { id: "serio", label: "Sério/Profissional", icon: Shield },
  { id: "misterioso", label: "Misterioso", icon: Search },
  { id: "energetico", label: "Energético", icon: Flame },
  { id: "calmo", label: "Calmo/Zen", icon: Leaf },
];

export default function CriarAvatar() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const { addPrompt } = usePrompts();
  
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("");
  const [extraDetails, setExtraDetails] = useState("");

  const handleNext = () => {
    if (currentStep === 0 && !selectedGender) return toast.error("Selecione o gênero");
    if (currentStep === 1 && !selectedStyle) return toast.error("Selecione o estilo");
    if (currentStep === 2 && !selectedVibe) return toast.error("Selecione a vibe");
    
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
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 150);

    try {
      const gKey = import.meta.env.VITE_GEMINI_API_KEY;
      const prompt = `Você é um engenheiro de prompts especialista em geração de imagens de IA (Midjourney/Flux/Leonardo). 
      Crie um prompt técnico e detalhado para um avatar com as seguintes características:
      - Gênero: ${selectedGender}
      - Estilo Visual: ${selectedStyle}
      - Vibe/Personalidade: ${selectedVibe}
      - Detalhes Extras: ${extraDetails || "Nenhum"}
      
      O prompt deve incluir detalhes de iluminação, enquadramento cinematográfico, texturas e referências artísticas. Responda apenas com o prompt em inglês.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const generatedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar prompt.";

      setGenProgress(100);
      addPrompt(`Avatar AI - ${selectedStyle}`, generatedPrompt, "Avatar AI");
      fireConfetti();
      toast.success("Prompt para Avatar gerado!");
      setCurrentStep(4);
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
        "cursor-pointer transition-all border-white/10 group",
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
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Criar Avatar AI</h2>
            <p className="text-muted-foreground">Gere o prompt perfeito para o seu criador digital</p>
          </div>
        </div>
      </div>

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
            <Wand2 className="w-16 h-16 text-primary animate-pulse" />
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Gerando Prompt Mestre...</h3>
              <Progress value={genProgress} className="w-64 h-2 mx-auto" />
              <p className="text-xs text-muted-foreground">Estamos criando uma descrição técnica ultra detalhada</p>
            </div>
          </div>
        ) : (
          <>
            {currentStep === 0 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Qual o gênero do avatar?</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {GENDERS.map(g => (
                    <OptionCard 
                      key={g.id} 
                      label={g.label} 
                      icon={g.icon} 
                      selected={selectedGender === g.label} 
                      onClick={() => setSelectedGender(g.label)} 
                    />
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Qual o estilo artístico?</h3>
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
                  <h3 className="text-xl font-bold">Qual a vibe do criador?</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {VIBES.map(v => (
                    <OptionCard 
                      key={v.id} 
                      label={v.label} 
                      icon={v.icon} 
                      selected={selectedVibe === v.label} 
                      onClick={() => setSelectedVibe(v.label)} 
                    />
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Toques finais</h3>
                  <p className="text-sm text-muted-foreground">Adicione detalhes de aparência ou ambiente</p>
                </div>
                <Card className="bg-card border-white/5">
                  <CardContent className="p-6 space-y-4">
                    <Label className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Características Extras (Opcional)</Label>
                    <Input 
                      placeholder="Ex: Cabelo azul, jaqueta de couro, iluminacao neon rosa..." 
                      value={extraDetails}
                      onChange={(e) => setExtraDetails(e.target.value)}
                      className="bg-secondary/50 h-12 border-white/10"
                    />
                    <Button onClick={handleGenerate} className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg">
                      <Sparkles className="mr-2 w-5 h-5" /> Gerar Prompt do Avatar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 text-center animate-in fade-in duration-500">
                <div className="p-12 bg-secondary/20 rounded-3xl border border-white/5 space-y-4">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">Avatar Criado!</h3>
                  <p className="text-muted-foreground">O prompt mestre já está disponível nos seus itens salvos.</p>
                  <div className="flex justify-center gap-4 pt-4">
                    <Button variant="outline" onClick={() => { setCurrentStep(0); setSelectedGender(""); setSelectedStyle(""); setSelectedVibe(""); setExtraDetails(""); }}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Criar Outro
                    </Button>
                    <Button onClick={() => window.location.href = "/meus-prompts"}>
                      <FileText className="mr-2 h-4 w-4" /> Ver Meus Prompts
                    </Button>
                  </div>
                </div>
              </div>
            )}

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

// Missing icons for the mapping
function Search(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}

function Leaf(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C10.9 14.36 12 14.1 14 12c1 2 1.34 4 1.34 7 0 1.25-.5 2.5-1 3.5" />
      <path d="M11 20c1.34-3.5 1.43-5 1.43-7.5" />
    </svg>
  )
}
