import { useState, useRef, useEffect } from "react";
import { Check, ChevronRight, ChevronLeft, Upload, Play, Pause, Volume2, VolumeX, Plus, Trash2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TextOverlay {
  id: number;
  text: string;
  position: "top" | "center" | "bottom";
  style: "bold" | "normal" | "outline";
  color: string;
  fontSize: number;
  hasBorder: boolean;
  hasBackground: boolean;
  fontFamily: string;
  startTime: number;
  endTime: number;
}

interface VideoConfig {
  videoFile: File | null;
  videoUrl: string;
  format: "9:16" | "1:1" | "16:9";
  textOverlays: TextOverlay[];
  speed: number;
  volume: number;
  filter: string;
  coverImage: string;
}

const steps = ["Video & Formato", "Texto & Legendas", "Audio & Velocidade", "Filtros, Capa & Exportar"];

const filters = [
  { value: "none", label: "Nenhum" },
  { value: "grayscale(100%)", label: "Preto e Branco" },
  { value: "sepia(100%)", label: "Sepia" },
  { value: "contrast(120%)", label: "Alto Contraste" },
  { value: "brightness(110%)", label: "Mais Brilho" },
  { value: "saturate(150%)", label: "Saturado" },
  { value: "hue-rotate(90deg)", label: "Hue Shift" },
];

const textPositions = [
  { value: "top", label: "Topo" },
  { value: "center", label: "Centro" },
  { value: "bottom", label: "Base" },
];

const fontFamilies = [
  { value: "Poppins", label: "Poppins" },
  { value: "Arial Black", label: "Arial Black" },
  { value: "Impact", label: "Impact" },
  { value: "Georgia", label: "Georgia" },
  { value: "Courier New", label: "Courier" },
];

const colorPalette = ["#ffffff", "#000000", "#FE2C55", "#25F4EE", "#FFFC00", "#FF6600", "#00FF88", "#FF00FF"];

export default function EditVideosPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOverlayId, setSelectedOverlayId] = useState<number | null>(null);
  const [config, setConfig] = useState<VideoConfig>({
    videoFile: null,
    videoUrl: "",
    format: "9:16",
    textOverlays: [],
    speed: 1,
    volume: 1,
    filter: "none",
    coverImage: "",
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = config.speed;
      videoRef.current.volume = config.volume;
    }
  }, [config.speed, config.volume]);

  const selectedOverlay = config.textOverlays.find(o => o.id === selectedOverlayId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setConfig(prev => ({ ...prev, videoFile: file, videoUrl: url }));
      toast.success("Vídeo carregado!");
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const addTextOverlay = () => {
    const overlay: TextOverlay = {
      id: Date.now(),
      text: "Seu texto aqui",
      position: "bottom",
      style: "bold",
      color: "#ffffff",
      fontSize: 24,
      hasBorder: false,
      hasBackground: false,
      fontFamily: "Poppins",
      startTime: 0,
      endTime: 5,
    };
    setConfig(prev => ({
      ...prev,
      textOverlays: [...prev.textOverlays, overlay],
    }));
    setSelectedOverlayId(overlay.id);
    toast.success("Caixa de texto adicionada!");
  };

  const updateOverlay = (id: number, updates: Partial<TextOverlay>) => {
    setConfig(prev => ({
      ...prev,
      textOverlays: prev.textOverlays.map(o => o.id === id ? { ...o, ...updates } : o),
    }));
  };

  const removeOverlay = (id: number) => {
    setConfig(prev => ({
      ...prev,
      textOverlays: prev.textOverlays.filter(o => o.id !== id),
    }));
    if (selectedOverlayId === id) setSelectedOverlayId(null);
    toast.success("Texto removido!");
  };

  const generateCover = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setConfig(prev => ({ ...prev, coverImage: dataUrl }));
        toast.success("Capa gerada!");
      }
    }
  };

  const handleExport = () => {
    toast.success("Video exportado!");
  };

  const getAspectRatio = () => {
    switch (config.format) {
      case "9:16": return "aspect-[9/16]";
      case "1:1": return "aspect-square";
      case "16:9": return "aspect-video";
      default: return "aspect-[9/16]";
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return !!config.videoUrl;
    return true;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Sync Editor</h2>
        <p className="text-sm text-muted-foreground">
          Editor de video com efeitos neon TikTok
        </p>
      </div>

      {/* Stepper with neon accent */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                idx === currentStep
                  ? "bg-primary text-white shadow-[0_0_12px_rgba(254,44,85,0.5)]"
                  : idx < currentStep
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <span className={cn(
              "hidden text-sm lg:block",
              idx === currentStep ? "text-white font-medium" : "text-muted-foreground"
            )}>
              {step}
            </span>
            {idx < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Video preview - right side on desktop but shown first for UX */}
        <div className="rounded-3xl border border-white/10 bg-card p-6 space-y-4 lg:order-2" style={{ borderImage: "linear-gradient(135deg, #25F4EE, #FE2C55) 1" }}>
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FE2C55] animate-pulse" />
            Preview
          </h3>
          <div className="flex justify-center">
            <div className={cn(
              "relative overflow-hidden rounded-2xl bg-black max-w-[280px] border border-white/5",
              getAspectRatio(),
              "shadow-[0_0_30px_rgba(37,244,238,0.15),0_0_30px_rgba(254,44,85,0.15)]"
            )}>
              {config.videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={config.videoUrl}
                    className="h-full w-full object-cover"
                    style={{ filter: config.filter }}
                    loop
                    playsInline
                    onClick={togglePlay}
                  />
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {isPlaying ? (
                      <Pause className="h-12 w-12 text-white" />
                    ) : (
                      <Play className="h-12 w-12 text-white" />
                    )}
                  </button>
                  {/* Text overlays preview */}
                  {config.textOverlays.map((overlay) => (
                    <div
                      key={overlay.id}
                      onClick={() => setSelectedOverlayId(overlay.id)}
                      className={cn(
                        "absolute left-0 right-0 px-3 text-center cursor-pointer",
                        overlay.position === "top" && "top-4",
                        overlay.position === "center" && "top-1/2 -translate-y-1/2",
                        overlay.position === "bottom" && "bottom-4",
                        selectedOverlayId === overlay.id && "ring-2 ring-[#25F4EE] ring-offset-1 ring-offset-transparent rounded"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block px-2 py-1",
                          overlay.style === "bold" && "font-bold",
                          overlay.style === "outline" && "text-stroke",
                          overlay.hasBackground && "bg-black/60 rounded px-3 py-1",
                          overlay.hasBorder && "border-2 border-white rounded px-3 py-1"
                        )}
                        style={{
                          color: overlay.color,
                          fontSize: `${Math.max(overlay.fontSize * 0.5, 10)}px`,
                          fontFamily: overlay.fontFamily,
                          textShadow: overlay.style === "outline" ? `
                            -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
                          ` : "0 2px 4px rgba(0,0,0,0.8)",
                        }}
                      >
                        {overlay.text}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex h-full min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhum video</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls - left side */}
        <div className="rounded-3xl border border-white/10 bg-card p-6 space-y-6 lg:order-1">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Upload de video</Label>
                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-secondary/30 hover:border-[#25F4EE]/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">
                    Clique para fazer upload
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {config.videoFile && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo: {config.videoFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white">Formato do video</Label>
                <div className="flex gap-2">
                  {(["9:16", "1:1", "16:9"] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setConfig(prev => ({ ...prev, format }))}
                      className={cn(
                        "flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
                        config.format === format
                          ? "bg-primary text-white shadow-[0_0_12px_rgba(254,44,85,0.3)]"
                          : "bg-secondary text-white/70 hover:bg-secondary/80"
                      )}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Text boxes list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white flex items-center gap-2">
                    <Type className="h-4 w-4 text-[#25F4EE]" />
                    Caixas de Texto
                  </Label>
                  <Button size="sm" onClick={addTextOverlay} className="bg-primary hover:bg-primary/90 gap-1">
                    <Plus className="h-3 w-3" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {config.textOverlays.map((overlay) => (
                    <div
                      key={overlay.id}
                      onClick={() => setSelectedOverlayId(overlay.id)}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors",
                        selectedOverlayId === overlay.id
                          ? "bg-[#25F4EE]/10 border border-[#25F4EE]/30"
                          : "bg-secondary/30 hover:bg-secondary/50"
                      )}
                    >
                      <span className="text-sm text-white truncate">{overlay.text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOverlay(overlay.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {config.textOverlays.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma caixa de texto. Clique em "Adicionar" acima.
                    </p>
                  )}
                </div>
              </div>

              {/* Edit selected overlay */}
              {selectedOverlay && (
                <div className="space-y-4 rounded-2xl border border-[#FE2C55]/20 bg-secondary/20 p-4">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Texto</Label>
                    <Input
                      value={selectedOverlay.text}
                      onChange={(e) => updateOverlay(selectedOverlay.id, { text: e.target.value })}
                      className="bg-secondary border-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Tipografia</Label>
                    <Select
                      value={selectedOverlay.fontFamily}
                      onValueChange={(v) => updateOverlay(selectedOverlay.id, { fontFamily: v })}
                    >
                      <SelectTrigger className="bg-secondary border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        {fontFamilies.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Tamanho: {selectedOverlay.fontSize}px</Label>
                    <Slider
                      value={[selectedOverlay.fontSize]}
                      onValueChange={([v]) => updateOverlay(selectedOverlay.id, { fontSize: v })}
                      min={12}
                      max={72}
                      step={2}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Cor</Label>
                    <div className="flex gap-2 flex-wrap">
                      {colorPalette.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateOverlay(selectedOverlay.id, { color })}
                          className={cn(
                            "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                            selectedOverlay.color === color ? "border-[#25F4EE] scale-110" : "border-white/20"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white text-sm">Borda no texto</Label>
                      <Switch
                        checked={selectedOverlay.hasBorder}
                        onCheckedChange={(v) => updateOverlay(selectedOverlay.id, { hasBorder: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white text-sm">Caixa de fundo</Label>
                      <Switch
                        checked={selectedOverlay.hasBackground}
                        onCheckedChange={(v) => updateOverlay(selectedOverlay.id, { hasBackground: v })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Posicao</Label>
                    <div className="flex gap-2">
                      {textPositions.map((p) => (
                        <button
                          key={p.value}
                          onClick={() => updateOverlay(selectedOverlay.id, { position: p.value as TextOverlay["position"] })}
                          className={cn(
                            "flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
                            selectedOverlay.position === p.value
                              ? "bg-[#25F4EE] text-black"
                              : "bg-secondary text-white/70 hover:bg-secondary/80"
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-white">Velocidade: {config.speed}x</Label>
                <Slider
                  value={[config.speed]}
                  onValueChange={([v]) => setConfig(prev => ({ ...prev, speed: v }))}
                  min={0.25}
                  max={2}
                  step={0.25}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.25x</span>
                  <span>1x</span>
                  <span>2x</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-white">Volume: {Math.round(config.volume * 100)}%</Label>
                  <button onClick={() => setConfig(prev => ({ ...prev, volume: prev.volume === 0 ? 1 : 0 }))}>
                    {config.volume === 0 ? (
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <Slider
                  value={[config.volume]}
                  onValueChange={([v]) => setConfig(prev => ({ ...prev, volume: v }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="py-4"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-white">Filtro</Label>
                <div className="grid grid-cols-2 gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setConfig(prev => ({ ...prev, filter: filter.value }))}
                      className={cn(
                        "rounded-lg py-2 text-sm font-medium transition-colors",
                        config.filter === filter.value
                          ? "bg-primary text-white shadow-[0_0_12px_rgba(254,44,85,0.3)]"
                          : "bg-secondary text-white/70 hover:bg-secondary/80"
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white">Capa do video</Label>
                <Button
                  variant="outline"
                  onClick={generateCover}
                  disabled={!config.videoUrl}
                  className="w-full border-white/10 hover:bg-white/5"
                >
                  Gerar capa do frame atual
                </Button>
                {config.coverImage && (
                  <div className="flex justify-center">
                    <img
                      src={config.coverImage}
                      alt="Capa"
                      className="h-32 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <ShimmerButton
                onClick={handleExport}
                disabled={!config.videoUrl}
                background="linear-gradient(135deg, #25F4EE, #FE2C55)"
                shimmerColor="#ffffff"
                className="w-full text-sm font-semibold"
              >
                Exportar e baixar
              </ShimmerButton>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 0}
          className="border-white/10 hover:bg-white/5"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <Button
          onClick={() => setCurrentStep(prev => prev + 1)}
          disabled={currentStep === steps.length - 1 || !canProceed()}
          className="bg-primary hover:bg-primary/90"
        >
          Proximo
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
