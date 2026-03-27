import React, { useState, useCallback, useRef, useEffect } from "react";
import { 
  BarChart2, 
  Search, 
  UserSearch, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Copy, 
  MessageSquare, 
  Send,
  Trash2,
  ChevronRight,
  User,
  Info,
  FileText
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NICHES = [
  "Moda & Beleza",
  "Casa & Cozinha",
  "Pets",
  "Eletrônicos",
  "Fitness & Saúde",
  "Alimentos",
  "Finanças",
  "Entretenimento",
  "Educação",
  "Personalizado"
];

interface AnalysisResult {
  score_geral: number;
  pontos_fortes: string[];
  pontos_melhoria: string[];
  foto_perfil: { nota: number; feedback: string };
  bio: { nota: number; feedback: string };
  nome_usuario: { nota: number; feedback: string };
  recomendacoes: string[];
  resumo: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AnaliseConta() {
  const [activeTab, setActiveTab] = useState("analise");
  const [subTab, setSubTab] = useState("perfil");
  
  // Tab 1 State
  const [niche, setNiche] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Tab 2 State
  const [chatNiche, setChatNiche] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleAnalise = async () => {
    if (!niche || !image) {
      toast.error("Selecione um nicho e envie um screenshot.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setAnalysisProgress(0);

    const loadingSteps = [
      { progress: 20, message: "Lendo seu perfil..." },
      { progress: 50, message: "Identificando pontos de melhoria..." },
      { progress: 85, message: "Gerando recomendações..." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setAnalysisProgress(step.progress);
        setLoadingMessage(step.message);
        currentStep++;
      }
    }, 1500);

    try {
      const gKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!gKey) throw new Error("Chave da API não encontrada.");

      // Image is base64, need to strip the prefix
      const base64Image = image.split(",")[1];

      const prompt = `Você é um especialista em TikTok Shop e marketing digital.
Analise este perfil TikTok do nicho: ${niche}
Com base na imagem, forneça análise detalhada em JSON:
{
  "score_geral": número de 0 a 100,
  "pontos_fortes": [array de strings],
  "pontos_melhoria": [array de strings],
  "foto_perfil": { "nota": 0-10, "feedback": "string" },
  "bio": { "nota": 0-10, "feedback": "string" },
  "nome_usuario": { "nota": 0-10, "feedback": "string" },
  "recomendacoes": [array de strings com ações concretas],
  "resumo": "string curto"
}
Responda APENAS o JSON, sem markdown.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: base64Image } }
            ]
          }]
        })
      });

      if (!response.ok) throw new Error("Erro na API.");

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) throw new Error("Resposta vazia.");

      const parsedResult: AnalysisResult = JSON.parse(textResponse.replace(/```json|```/g, "").trim());
      
      clearInterval(interval);
      setAnalysisProgress(100);
      setResult(parsedResult);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#FE2C55", "#25F4EE"] });
      toast.success("Análise concluída!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao analisar perfil. Tente novamente.");
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !chatNiche) return;

    const userMsg = inputMessage.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const gKey = import.meta.env.VITE_GEMINI_API_KEY;
      const systemPrompt = `Você é uma consultora especialista em TikTok Shop para o nicho ${chatNiche}.
Ajude o usuário a criar ou melhorar seu perfil TikTok do zero.
Faça perguntas estratégicas e dê orientações práticas sobre:
- Nome de usuário ideal
- Foto de perfil
- Bio otimizada para vendas
- Frequência de postagem
- Tipos de conteúdo para o nicho
Seja direta, use emojis e linguagem informal em português.`;

      const chatHistory = messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Entendido. Sou sua consultora especialista. Como posso ajudar hoje?" }] },
            ...chatHistory,
            { role: "user", parts: [{ text: userMsg }] }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiResponse) {
        setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
      }
    } catch (error) {
      toast.error("Erro ao processar mensagem.");
    } finally {
      setIsTyping(false);
    }
  };

  const startChat = (selectedNiche: string) => {
    setChatNiche(selectedNiche);
    setMessages([
      { 
        role: "assistant", 
        content: `Olá! Vou te ajudar a criar o perfil perfeito para ${selectedNiche}. Você já tem conta no TikTok? Se sim, há quantos seguidores?` 
      }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserSearch className="text-[#FE2C55]" /> Análise de Conta
        </h2>
        <p className="text-muted-foreground">Análise inteligente do seu perfil TikTok com recomendações personalizadas</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card border border-white/10 p-1">
          <TabsTrigger value="analise" className="data-[state=active]:bg-[#FE2C55] data-[state=active]:text-white">
            <Search className="w-4 h-4 mr-2" /> Análise de Conta
          </TabsTrigger>
          <TabsTrigger value="assistente" className="data-[state=active]:bg-[#FE2C55] data-[state=active]:text-white">
            <Sparkles className="w-4 h-4 mr-2" /> Assistente de Criação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analise" className="space-y-6">
          {!result && !isAnalyzing ? (
            <Card className="bg-card border-white/10 overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Selecione seu nicho</label>
                  <Select value={niche} onValueChange={setNiche}>
                    <SelectTrigger className="bg-secondary border-white/10">
                      <SelectValue placeholder="Selecione um nicho..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {NICHES.map(n => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Screenshot do Perfil</label>
                  <div 
                    {...getRootProps()} 
                    className={cn(
                      "group relative flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-2xl transition-all cursor-pointer",
                      isDragActive ? "border-[#FE2C55] bg-[#FE2C55]/5" : "border-white/10 bg-secondary/30 hover:border-[#FE2C55]/50"
                    )}
                  >
                    <input {...getInputProps()} />
                    {image ? (
                      <div className="relative w-full h-full p-2">
                        <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                          <p className="text-white text-sm font-medium">Trocar Imagem</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-[#FE2C55]/10 p-4 rounded-full mb-3">
                          <Upload className="w-8 h-8 text-[#FE2C55]" />
                        </div>
                        <p className="text-white font-medium">Clique para enviar um screenshot</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleAnalise} 
                  disabled={!niche || !image}
                  className="w-full h-12 bg-gradient-to-r from-[#FE2C55] to-[#E92045] hover:opacity-90 transition-all font-bold text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" /> Analisar Perfil
                </Button>
              </CardContent>
            </Card>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-secondary border-t-[#FE2C55] animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#FE2C55] animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">{loadingMessage}</h3>
                <p className="text-muted-foreground">Isso pode levar alguns segundos...</p>
              </div>
              <div className="w-full max-w-sm">
                <Progress value={analysisProgress} className="h-2 bg-secondary" />
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Resultado da Análise</h3>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" className="border-white/10" onClick={() => {
                     const text = `ANÁLISE DE PERFIL TIKTOK\nNicho: ${niche}\nScore: ${result?.score_geral}\n\nRESUMO: ${result?.resumo}\n\nRECOMENDAÇÕES:\n${result?.recomendacoes.join('\n')}`;
                     navigator.clipboard.writeText(text);
                     toast.success("Análise copiada!");
                   }}>
                     <Copy className="w-4 h-4 mr-2" /> Copiar Tudo
                   </Button>
                   <Button variant="outline" size="sm" className="border-white/10" onClick={() => { setResult(null); setImage(null); }}>
                     <RefreshCw className="w-4 h-4 mr-2" /> Nova Análise
                   </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 bg-card border-white/10 flex flex-col items-center justify-center p-8 space-y-4">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * (result?.score_geral || 0)) / 100} className="text-[#FE2C55] transition-all duration-1000 ease-out" />
                    </svg>
                    <span className="absolute text-3xl font-bold text-white">{result?.score_geral}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white uppercase tracking-wider">Score Geral</p>
                    <p className="text-sm text-muted-foreground">{result?.resumo}</p>
                  </div>
                </Card>

                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-emerald-500/5 border-emerald-500/20 p-4">
                      <h4 className="text-emerald-400 font-bold flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4" /> Pontos Fortes
                      </h4>
                      <ul className="text-sm text-white/80 space-y-1">
                        {result?.pontos_fortes.map((p, i) => <li key={i} className="flex gap-2">• {p}</li>)}
                      </ul>
                    </Card>
                    <Card className="bg-red-500/5 border-red-500/20 p-4">
                      <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4" /> Pontos de Melhoria
                      </h4>
                      <ul className="text-sm text-white/80 space-y-1">
                        {result?.pontos_melhoria.map((p, i) => <li key={i} className="flex gap-2">• {p}</li>)}
                      </ul>
                    </Card>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Foto", data: result?.foto_perfil, icon: User },
                      { label: "Bio", data: result?.bio, icon: FileText },
                      { label: "Nome", data: result?.nome_usuario, icon: Info }
                    ].map((item, idx) => (
                      <Card key={idx} className="bg-secondary/30 border-white/10 p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                          <span className={cn("text-xs font-bold", item.data!.nota >= 8 ? "text-emerald-400" : item.data!.nota >= 5 ? "text-yellow-400" : "text-red-400")}>
                            {item.data?.nota}/10
                          </span>
                        </div>
                        <p className="text-[10px] text-white/70 leading-tight">{item.data?.feedback}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <Card className="bg-card border-white/10 p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FE2C55]" /> Recomendações Estratégicas
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {result?.recomendacoes.map((rec, i) => (
                    <div key={i} className="flex items-center gap-3 bg-secondary/50 p-3 rounded-xl border border-white/5">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FE2C55]/20 flex items-center justify-center text-[#FE2C55] font-bold text-sm">
                        {i + 1}
                      </div>
                      <p className="text-sm text-white/90">{rec}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="assistente" className="h-[600px] flex gap-6">
          <div className="w-64 flex-shrink-0 space-y-4">
             <Card className="bg-card border-white/10 p-4">
                <h4 className="text-sm font-bold text-white mb-4">Novo Projeto</h4>
                <div className="space-y-3">
                   <p className="text-xs text-muted-foreground line-clamp-2">Escolha seu nicho para iniciar a consultoria guiada por IA.</p>
                   {NICHES.map(n => (
                     <Button 
                       key={n} 
                       variant="outline" 
                       size="sm" 
                       className={cn("w-full justify-start border-white/10", chatNiche === n && "bg-[#FE2C55]/10 border-[#FE2C55]/30 text-[#FE2C55]")}
                       onClick={() => startChat(n)}
                     >
                        <ChevronRight className="w-3 h-3 mr-2" /> {n}
                     </Button>
                   ))}
                </div>
             </Card>
             {messages.length > 0 && (
               <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-red-400" onClick={() => { setMessages([]); setChatNiche(""); }}>
                 <Trash2 className="w-3 h-3 mr-2" /> Limpar Conversa
               </Button>
             )}
          </div>

          <Card className="flex-1 bg-card border-white/10 flex flex-col overflow-hidden relative">
            {!chatNiche ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="bg-[#FE2C55]/10 p-6 rounded-full">
                  <MessageSquare className="w-12 h-12 text-[#FE2C55]" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white">Assistente de Criação</h3>
                   <p className="text-muted-foreground max-w-xs mx-auto">Selecione um nicho ao lado para começar a montar o perfil perfeito.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border border-[#FE2C55]/30">
                      <AvatarFallback className="bg-[#FE2C55] text-white"><Sparkles className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                    <div>
                       <p className="text-sm font-bold text-white">Consultora TikTok</p>
                       <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                         <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Online
                       </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => {
                    const text = messages.map(m => `${m.role === 'user' ? 'Você: ' : 'IA: '}${m.content}`).join('\n\n');
                    navigator.clipboard.writeText(text);
                    toast.success("Dicas copiadas!");
                  }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((m, i) => (
                      <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[80%] p-3 rounded-2xl text-sm",
                          m.role === "user" ? "bg-[#FE2C55] text-white rounded-tr-none" : "bg-secondary text-white/90 rounded-tl-none"
                        )}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-secondary p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 bg-secondary/30 border-t border-white/10 flex gap-2">
                  <Input 
                    placeholder="Tire suas dúvidas aqui..." 
                    className="bg-card border-white/10"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="icon" className="bg-[#FE2C55] hover:bg-[#E92045]" onClick={handleSendMessage} disabled={isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
