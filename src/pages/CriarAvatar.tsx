import React, { useState, useCallback } from "react";
import { 
  Bot, 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Star, 
  Zap, 
  Palette, 
  Search,
  Users,
  CheckCircle2,
  Package,
  History,
  Rocket,
  Image as ImageIcon,
  Check,
  Award,
  Shield,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePrompts } from "@/hooks/usePrompts";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const PREMIUM_AVATARS = [
  { 
    id: "av1", 
    nome: "Sofia Tech", 
    tag: "Casual/Tech",
    imagem: "/avatar_premium_1_1774735732406.png" 
  },
  { 
    id: "av2", 
    nome: "Lucas Modern", 
    tag: "Streetwear",
    imagem: "/avatar_premium_2_1774735757110.png" 
  },
  { 
    id: "av3", 
    nome: "Cyber Neon", 
    tag: "Futurista",
    imagem: "/avatar_premium_3_1774735777288.png" 
  },
  { 
    id: "av4", 
    nome: "Clara Studio", 
    tag: "Minimalista",
    imagem: "/avatar_premium_4_1774735791450.png" 
  },
  { 
    id: "av5", 
    nome: "Marina Urban", 
    tag: "Casual/Urban",
    imagem: "/avatar_premium_5_1774735902950.png" 
  },
  { 
    id: "av6", 
    nome: "Rafael Fit", 
    tag: "Fitness/Sport",
    imagem: "/avatar_premium_6_1774735918019.png" 
  }
];

const GENDERS = [
  { id: "feminino", label: "Feminino", icon: Users },
  { id: "masculino", label: "Masculino", icon: User },
  { id: "outro", label: "Outro", icon: Bot },
];

export default function CriarAvatar() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const { addPrompt } = usePrompts();
  
  const [config, setConfig] = useState({
    genero: "feminino",
    description: "",
    resultPrompt: ""
  });

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FE2C55', '#25F4EE', '#FFFFFF']
    });
  };

  const handleGenerate = async () => {
    if (!config.description) return toast.error("Descreva seu avatar primeiro!");
    
    setIsGenerating(true);
    setGenProgress(0);
    setCurrentStep(2);

    const interval = setInterval(() => {
      setGenProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    try {
      const gKey = import.meta.env.VITE_GEMINI_API_KEY;
      const prompt = `Você é um engenheiro de prompts especialista em geração de imagens de IA (Midjourney/Flux/Leonardo). 
      Crie um prompt técnico e detalhado para um avatar com as seguintes características:
      - Gênero: ${config.genero}
      - Descrição do Usuário: ${config.description}
      
      O prompt deve ser em INGLÊS, ultra-detalhado, focando em:
      - Realismo extremo (hyper-realistic, 8k, photorealistic)
      - Iluminação cinematográfica (volumetric lighting, soft shadows)
      - Textura de pele e tecidos (pore details, fabric weave)
      - Enquadramento de rede social (face focused, shallow depth of field)
      
      Responda APENAS com o bloco final do prompt em inglês.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Professional influencer portrait, hyper-realistic, 8k...";

      setConfig(prev => ({ ...prev, resultPrompt: generatedText }));
      setGenProgress(100);
      fireConfetti();
      toast.success("Avatar Gerado com Sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro na motor de IA. Tente novamente.");
      setCurrentStep(1);
    } finally {
      setIsGenerating(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Visual */}
      <div className="relative h-48 rounded-[40px] overflow-hidden border border-white/5 bg-gradient-to-r from-red-600/20 via-transparent to-cyan-500/10 flex items-center px-10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="h-20 w-20 rounded-[28px] bg-red-600 flex items-center justify-center shadow-2xl shadow-red-600/40">
            <Bot className="h-10 w-10 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Avatar Creator Pro</h1>
            <p className="text-white/60 font-medium text-sm">IA Generativa para Criadores Digitais do TikTok</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Wizard Container */}
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Lado Esquerdo: Configuração */}
          <div className="lg:col-span-12">
            <div className={cn(
              "p-10 rounded-[48px] border border-white/5 bg-white/3 transition-all",
              currentStep === 2 ? "opacity-30 pointer-events-none grayscale" : "opacity-100"
            )}>
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-black">01</div>
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Configurações Básicas</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gênero do Avatar</Label>
                    <div className="flex gap-4">
                      {GENDERS.map(g => (
                        <button
                          key={g.id}
                          onClick={() => setConfig(prev => ({ ...prev, genero: g.id }))}
                          className={cn(
                            "flex-1 p-6 rounded-[28px] border-2 flex flex-col items-center gap-3 transition-all",
                            config.genero === g.id ? "bg-red-600 border-red-600 text-white shadow-xl shadow-red-600/20" : "bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10"
                          )}
                        >
                          <g.icon className="h-6 w-6" />
                          <span className="text-[10px] font-black uppercase">{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Descrição do Estilo</Label>
                    <Textarea 
                      placeholder="Ex: Homem de 30 anos, estilo tech, jaqueta neon, cabelo curto degradê, iluminação dramática..."
                      className="bg-white/5 border-white/5 rounded-[32px] p-6 focus:ring-red-600/20 min-h-[140px] text-sm font-medium leading-relaxed resize-none italic"
                      value={config.description}
                      onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-[24px] gap-3 shadow-2xl shadow-red-600/20 uppercase tracking-tighter group mt-6"
                >
                  <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
                  Avançar para Gerar Avatar
                </Button>
              </div>
            </div>
          </div>

          {/* Engine Preview Overlay (quando carregando ou resultado) */}
          {currentStep === 2 && (
            <div className="lg:col-span-12 animate-in fade-in zoom-in-95 duration-700">
               <Card className="bg-zinc-950 border-white/10 rounded-[48px] p-12 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Rocket className="h-48 w-48 text-red-600" />
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/3 flex flex-col items-center gap-8">
                      <div className="relative">
                        <div className={cn(
                          "h-48 w-48 rounded-full border-4 border-red-600/20 flex items-center justify-center",
                          isGenerating && "animate-spin-slow"
                        )}>
                          <div className="h-40 w-40 rounded-full border-4 border-red-600 shadow-[0_0_30px_rgba(254,44,85,0.4)] flex items-center justify-center bg-zinc-900">
                            <Sparkles className={cn("h-16 w-16 text-red-600", isGenerating ? "animate-pulse" : "")} />
                          </div>
                        </div>
                        {isGenerating && (
                           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-600 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                             Processing
                           </div>
                        )}
                      </div>
                      
                      <div className="space-y-3 w-full text-center">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
                            <span>Engine V3.0</span>
                            <span>{genProgress}%</span>
                         </div>
                         <Progress value={genProgress} className="h-2 bg-zinc-800" />
                      </div>
                    </div>

                    <div className="w-full md:w-2/3 space-y-6">
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-red-500 border-red-500/30 font-black italic">PROMPT-SYNC GENERATED</Badge>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Avatar Blueprint</h3>
                      </div>

                      <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 font-mono text-[11px] leading-relaxed text-zinc-300 relative group">
                        <div className="max-h-[200px] overflow-y-auto pr-4 custom-scrollbar italic">
                           {config.resultPrompt || "Aguardando conclusão do processamento neural..."}
                        </div>
                        <Button 
                          onClick={() => {
                            navigator.clipboard.writeText(config.resultPrompt);
                            toast.success("Copiado!");
                          }}
                          className="absolute bottom-4 right-4 h-10 w-10 p-0 rounded-xl bg-zinc-800 hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      {!isGenerating && (
                        <div className="flex gap-4 pt-4">
                           <Button 
                             onClick={() => {
                               addPrompt(`Avatar - ${config.description.slice(0, 20)}`, config.resultPrompt, "Criar Avatar");
                               toast.success("Avatar salvo na biblioteca!");
                               setCurrentStep(1);
                             }}
                             className="flex-1 h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-[22px] shadow-xl shadow-emerald-600/20"
                           >
                             Salvar na Biblioteca
                           </Button>
                           <Button 
                             variant="secondary" 
                             onClick={() => setCurrentStep(1)}
                             className="h-16 px-8 rounded-[22px] font-black uppercase text-xs"
                           >
                             <RefreshCw className="mr-2 h-4 w-4" /> Reset
                           </Button>
                        </div>
                      )}
                    </div>
                  </div>
               </Card>
            </div>
          )}
        </div>

        {/* Mini Biblioteca - Premium Avatars */}
        <div className="space-y-8">
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                <Award className="h-5 w-5 text-red-600" /> Avatares Premium Prontos
              </h3>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lançamentos da Semana</span>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {PREMIUM_AVATARS.map((avatar) => (
                <div key={avatar.id} className="group relative rounded-[32px] border border-white/5 bg-zinc-900/50 overflow-hidden hover:border-red-600/30 transition-all">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={avatar.imagem} 
                      alt={avatar.nome} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-black/60 backdrop-blur-md text-[8px] font-black border-none px-2 py-0.5">{avatar.tag}</Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-black text-white italic uppercase tracking-tighter truncate">{avatar.nome}</p>
                    <Button 
                      className="w-full h-10 bg-zinc-800 hover:bg-red-600 transition-colors text-[10px] font-black uppercase rounded-xl"
                      onClick={() => {
                        toast.success(`Copiando prompt de ${avatar.nome}...`);
                        navigator.clipboard.writeText(`High fidelity digital influencer portrait of ${avatar.nome}, photorealistic style, 8k render...`);
                      }}
                    >
                      Usar este Avatar
                    </Button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent for Lucide fallback if needed (Copy is missing in main imports but available)
function Copy(props: any) {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
