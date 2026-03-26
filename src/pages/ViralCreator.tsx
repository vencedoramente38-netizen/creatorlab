import React, { useState } from "react";
import { Zap, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Wand2, Copy, RefreshCw, ExternalLink, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

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

interface ScriptResult {
  titulo: string;
  hook: string;
  roteiro: string;
  cta_final: string;
  hashtags: string[];
  dicas_edicao: string;
}

export default function ViralCreator() {
  const [step, setStep] = useState(1);
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
  const [loadingText, setLoadingText] = useState("");
  const [result, setResult] = useState<ScriptResult | null>(null);

  const activeCategory = CATEGORIES.find((c) => c.id === categoryId);
  const activeStyle = STYLES.find((s) => s.id === selectedStyle);

  const handleNext = () => {
    if (step === 1) {
      if (!categoryId) return toast.error("Selecione uma categoria");
      if (categoryId === "personalizados" && !customObject.trim()) return toast.error("Digite o objeto personalizado");
      if (categoryId !== "personalizados" && !selectedObject && !customObject.trim()) return toast.error("Selecione ou digite um objeto");
    }
    if (step === 2 && !selectedStyle) return toast.error("Selecione um estilo");
    if (step === 3 && !message.trim()) return toast.error("A mensagem principal é obrigatória");
    setStep(s => Math.min(s + 1, 4));
  };

  const currentObject = selectedObject || customObject;

  const generateScript = async () => {
    setIsGenerating(true);
    setResult(null);

    const loadingMessages = [
      "Analisando tendências...",
      "Criando hook viral...",
      "Montando roteiro...",
      "Finalizando..."
    ];
    
    let msgIndex = 0;
    setLoadingText(loadingMessages[0]);
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[msgIndex]);
    }, 1500);

    const prompt = `Você é um especialista em conteúdo viral para TikTok Shop.
Crie um roteiro viral completo para um vídeo de ${duration} sobre: ${currentObject}
Estilo: ${activeStyle?.name}
Mensagem principal: ${message}
Hook: ${hook || "Crie um forte"}
CTA: ${cta || "Crie um forte"}
Restrições: ${restrictions || "Nenhuma"}

Responda APENAS em JSON válido sem markdown e sem blocos de código formatados como \`\`\`json. A resposta deve começar com { e terminar com }.
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

  return (
    <div className="w-full flex-1 bg-background text-white p-4 pb-20 md:p-8">
      {/* Header */}
      <div className="mb-8 pt-4 md:pt-0 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] bg-clip-text text-transparent drop-shadow-sm">
            Viral Creator
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed">
            Crie roteiros virais com IA em segundos
          </p>
        </div>
        <button
          onClick={() => setViralMode(!viralMode)}
          className={`relative overflow-hidden group px-6 py-3 rounded-full font-bold transition-all duration-300 transform outline-none flex items-center gap-2 ${
            viralMode 
            ? "bg-[#FE2C55] text-white shadow-[0_0_20px_#FE2C55] hover:shadow-[0_0_30px_#FE2C55] scale-105" 
            : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
          }`}
        >
          {viralMode ? (
            <><Sparkles className="w-5 h-5 animate-pulse" /> 🔥 Modo Viral Ativo</>
          ) : (
            <><Zap className="w-5 h-5 text-[#25F4EE]" /> ⚡ Ativar Modo Viral</>
          )}
        </button>
      </div>

      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center p-8 rounded-2xl bg-[#0F0F13] border border-white/10 shadow-2xl max-w-sm w-full mx-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
              <div className="h-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] animate-[loading_2s_ease-in-out_infinite] w-1/2 rounded-full" />
            </div>
            <Wand2 className="w-12 h-12 text-[#25F4EE] mx-auto mb-6 animate-bounce" />
            <h3 className="text-xl font-bold mb-2">Processando...</h3>
            <p className="text-white/60 text-sm animate-pulse">{loadingText}</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {!result ? (
        <div className="max-w-4xl mx-auto bg-[#0F0F13]/80 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-[2rem] p-5 md:p-10 shadow-2xl relative z-10">
          
          {/* Stepper */}
          <div className="flex items-center justify-between mb-10 md:mb-12 relative px-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] rounded-full z-0 transition-all duration-500 ease-in-out" 
              style={{ width: \`${((step - 1) / 3) * 100}%\` }} 
            />
            
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 transition-all duration-300 ${
                  step > s 
                    ? "bg-[#25F4EE] border-[#25F4EE] text-black shadow-[0_0_15px_#25F4EE]" 
                    : step === s 
                      ? "bg-[#0F0F13] border-[#FE2C55] text-[#FE2C55] shadow-[0_0_15px_#FE2C55]" 
                      : "bg-[#0F0F13] border-white/20 text-white/50"
                 }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : s}
                </div>
                <span className={`absolute -bottom-7 text-xs md:text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                  step >= s ? "text-white" : "text-white/40"
                }`}>
                  {s === 1 ? "Objeto" : s === 2 ? "Estilo" : s === 3 ? "Conteúdo" : "Revisão"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-16 min-h-[400px]">
            {/* Step 1 */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-[#25F4EE]">1.</span> Escolha a Categoria
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setCategoryId(cat.id); setSelectedObject(""); setCustomObject(""); }}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        categoryId === cat.id 
                          ? "bg-white/10 border-[#25F4EE] shadow-[0_0_15px_rgba(37,244,238,0.2)]" 
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="text-3xl mb-3">{cat.icon}</div>
                      <div className="font-semibold">{cat.name}</div>
                    </button>
                  ))}
                </div>

                {categoryId && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold mb-4">Escolha o Objeto</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {activeCategory?.items.map((item) => (
                        <button
                          key={item}
                          onClick={() => { setSelectedObject(item); setCustomObject(""); }}
                          className={`p-3 rounded-lg border text-sm text-center transition-all duration-200 ${
                            selectedObject === item 
                              ? "bg-white/10 border-[#FE2C55] text-[#FE2C55]" 
                              : "bg-white/5 border-white/5 hover:bg-white/10"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <label className="text-sm text-white/60 mb-2 block">Ou defina um objeto personalizado:</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">✏️</span>
                        <input
                          type="text"
                          value={customObject}
                          onChange={(e) => { setCustomObject(e.target.value); setSelectedObject(""); }}
                          placeholder="Digite o objeto..."
                          className="w-full bg-[#1A1A24] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#25F4EE] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-[#25F4EE]">2.</span> Escolha o Estilo do Vídeo
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-5 rounded-xl border text-left transition-all duration-200 flex items-start gap-4 ${
                        selectedStyle === style.id 
                          ? "bg-gradient-to-br from-white/10 to-white/5 border-[#25F4EE] shadow-[0_0_20px_rgba(37,244,238,0.15)]" 
                          : "bg-[#1A1A24] border-white/5 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      <div className="text-3xl">{style.icon}</div>
                      <div>
                        <div className={`font-bold mb-1 ${selectedStyle === style.id ? 'text-[#25F4EE]' : 'text-white'}`}>
                          {style.name}
                        </div>
                        <div className="text-sm text-white/50">{style.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-[#25F4EE]">3.</span> Detalhes do Conteúdo
                </h2>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white/90">Mensagem Principal <span className="text-[#FE2C55]">*</span></label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: Esse produto mudou a minha vida..."
                    className="w-full bg-[#1A1A24] border border-white/10 rounded-xl p-4 min-h-[100px] text-white focus:outline-none focus:border-[#25F4EE] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/90">Hook (Gancho inicial) <span className="text-white/40 font-normal ml-1">Opcional</span></label>
                    <input
                      type="text"
                      value={hook}
                      onChange={(e) => setHook(e.target.value)}
                      placeholder="Ex: Pare o scroll agora mesmo..."
                      className="w-full bg-[#1A1A24] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#25F4EE] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/90">CTA (Chamada para Ação) <span className="text-white/40 font-normal ml-1">Opcional</span></label>
                    <input
                      type="text"
                      value={cta}
                      onChange={(e) => setCta(e.target.value)}
                      placeholder="Ex: Curte e me siga..."
                      className="w-full bg-[#1A1A24] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#25F4EE] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/90">Restrições <span className="text-white/40 font-normal ml-1">Opcional</span></label>
                    <textarea
                      value={restrictions}
                      onChange={(e) => setRestrictions(e.target.value)}
                      placeholder="O que a IA NÃO deve mencionar..."
                      className="w-full bg-[#1A1A24] border border-white/10 rounded-xl p-3 min-h-[80px] text-white focus:outline-none focus:border-[#25F4EE] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/90">Duração do Vídeo</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-[#1A1A24] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#25F4EE] transition-colors appearance-none"
                    >
                      <option value="15s">15 Segundos (TikTok Curto)</option>
                      <option value="30s">30 Segundos (Ideal)</option>
                      <option value="60s">60 Segundos (História Completa)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-[#25F4EE]">4.</span> Revisão
                </h2>
                
                <div className="space-y-4 mb-8">
                  {/* Summary Card 1 */}
                  <div className="bg-[#1A1A24] border border-white/10 rounded-xl p-5 flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl">
                        📦
                      </div>
                      <div>
                        <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Objeto Escolhido</div>
                        <div className="font-bold text-lg">{currentObject}</div>
                      </div>
                    </div>
                    <button onClick={() => setStep(1)} className="text-white/40 hover:text-white transition-colors p-2">
                      ✏️ Editar
                    </button>
                  </div>

                  {/* Summary Card 2 */}
                  <div className="bg-[#1A1A24] border border-white/10 rounded-xl p-5 flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl">
                        {activeStyle?.icon}
                      </div>
                      <div>
                        <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Estilo do Vídeo</div>
                        <div className="font-bold text-lg text-[#25F4EE]">{activeStyle?.name}</div>
                      </div>
                    </div>
                    <button onClick={() => setStep(2)} className="text-white/40 hover:text-white transition-colors p-2">
                      ✏️ Editar
                    </button>
                  </div>

                  {/* Summary Card 3 */}
                  <div className="bg-[#1A1A24] border border-white/10 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-white/50 text-xs font-semibold uppercase tracking-wider">Conteúdo</div>
                      <button onClick={() => setStep(3)} className="text-white/40 hover:text-white transition-colors p-1">
                        ✏️ Editar
                      </button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-2"><span className="text-white/50 min-w-[90px]">Mensagem:</span> <span className="text-white truncate">{message}</span></div>
                      {hook && <div className="flex gap-2"><span className="text-white/50 min-w-[90px]">Hook:</span> <span className="text-white truncate">{hook}</span></div>}
                      {cta && <div className="flex gap-2"><span className="text-white/50 min-w-[90px]">CTA:</span> <span className="text-white truncate">{cta}</span></div>}
                      <div className="flex gap-2"><span className="text-white/50 min-w-[90px]">Duração:</span> <span className="text-[#FE2C55] font-semibold">{duration}</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <button 
                    onClick={generateScript}
                    disabled={isGenerating}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] text-white rounded-2xl py-5 font-extrabold text-xl shadow-[0_10px_40px_rgba(254,44,85,0.3)] hover:shadow-[0_10px_60px_rgba(37,244,238,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center gap-3">
                      🚀 <span className="drop-shadow-md">GERAR ROTEIRO VIRAL</span> <Sparkles className="w-6 h-6" />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          {step < 4 && (
            <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                  step === 1 ? "opacity-0 pointer-events-none" : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                Próximo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result View */
        <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500 relative z-10">
          <div className="bg-[#0F0F13]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Result Header */}
            <div className="bg-gradient-to-r from-[#25F4EE]/20 via-[#1A1A24] to-[#FE2C55]/20 p-8 border-b border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-32 h-32" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest mb-4">
                <CheckCircle2 className="w-4 h-4 text-[#25F4EE]" /> Sucesso
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{result.titulo}</h2>
              <div className="flex gap-2 flex-wrap mt-4">
                {result.hashtags?.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => copyToClipboard(tag)}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-[#25F4EE] transition-colors cursor-crosshair"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Hook Card */}
              <div className="relative p-6 rounded-2xl bg-[#1A1A24] border border-[#FE2C55]/30 shadow-[0_0_20px_rgba(254,44,85,0.05)]">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-[#FE2C55] text-white text-xs font-bold rounded-full shadow-lg">
                  HOOK PRINCIPAL (3s)
                </div>
                <p className="text-xl md:text-2xl font-bold italic pt-2 text-white/90">
                  "{result.hook}"
                </p>
                <button 
                  onClick={() => copyToClipboard(result.hook)}
                  className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                  title="Copiar Hook"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              {/* Roteiro */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white/80">
                  <PlayCircle className="w-5 h-5 text-[#25F4EE]" /> Roteiro Completo
                </h3>
                <div className="bg-[#1A1A24] border border-white/10 rounded-2xl p-6 relative group">
                  <button 
                    onClick={() => copyToClipboard(result.roteiro)}
                    className="absolute top-4 right-4 p-2 bg-white/5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <pre className="text-white/80 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                    {result.roteiro}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">CTA (Final)</h3>
                   <div className="bg-[#1A1A24] border border-white/10 rounded-xl p-4 text-white/90 relative">
                     <p>{result.cta_final}</p>
                     <button onClick={() => copyToClipboard(result.cta_final)} className="absolute right-3 top-3 text-white/30 hover:text-white">
                        <Copy className="w-4 h-4" />
                     </button>
                   </div>
                </div>
                <div>
                   <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">🧠 Dicas de Edição</h3>
                   <div className="bg-white/5 border border-white/10 border-l-[#25F4EE] border-l-4 rounded-xl p-4 text-white/90 text-sm">
                     {result.dicas_edicao}
                   </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-[#1A1A24] p-6 md:p-8 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-white/10">
              <button 
                onClick={() => {
                  setResult(null);
                  setStep(1);
                  setCustomObject("");
                  setSelectedObject("");
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Gerar Novo
              </button>

              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => copyToClipboard(`${result.titulo}\n\nHOOK: ${result.hook}\n\nROTEIRO:\n${result.roteiro}\n\nCTA: ${result.cta_final}\n\nHashtags: ${result.hashtags.join(' ')}`)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold bg-[#25F4EE]/10 text-[#25F4EE] border border-[#25F4EE]/30 hover:bg-[#25F4EE]/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Copiar Tudo
                </button>
                <a 
                  href="https://labs.google/fx/pt/tools/flow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Abrir Flow VEO3 <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
