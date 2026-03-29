import React from "react";
import { 
  GraduationCap, 
  Users, 
  Headphones, 
  TrendingUp, 
  Video, 
  Award, 
  Zap, 
  ExternalLink, 
  PlayCircle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ACADEMY_GROUP_URL = "https://chat.whatsapp.com/example-group-link"; // Placeholder URL

const BENEFITS = [
  { icon: Users, title: "Networking", desc: "Conecte-se com criadores de todo o Brasil" },
  { icon: Headphones, title: "Suporte Direto", desc: "Tire dúvidas com nossa equipe" },
  { icon: TrendingUp, title: "Estratégias", desc: "Aprenda o que está funcionando agora" },
  { icon: Video, title: "Aulas Práticas", desc: "Conteúdo direto ao ponto e atualizado" },
  { icon: Award, title: "Certificado", desc: "Comprove seu conhecimento" },
  { icon: Zap, title: "Atualizações", desc: "Seja o primeiro a saber das novidades" },
];

export default function Academy() {
  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-[#FE2C55]/10 border border-[#FE2C55]/20 shadow-[0_0_30px_rgba(254,44,85,0.2)]">
          <GraduationCap className="w-12 h-12 text-[#FE2C55]" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Academy</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mt-2">
            Aprenda, evolua e conecte-se com outros criadores para dominar o TikTok Shop.
          </p>
        </div>
      </div>

      {/* Main Card - VIP Community */}
      <div className="max-w-4xl mx-auto">
        <Card className="relative overflow-hidden bg-card border-[#FE2C55]/20 shadow-[0_0_50px_rgba(254,44,85,0.1)] group">
          <div className="absolute top-0 right-0 p-4">
            <Badge className="bg-[#FE2C55] text-black font-bold animate-pulse border-2 border-[#FE2C55]/50 px-3 py-1">
              EXCLUSIVO
            </Badge>
          </div>
          <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="bg-[#FE2C55] p-6 rounded-3xl shadow-[0_0_20px_rgba(254,44,85,0.4)]">
              <Users className="w-16 h-16 text-black" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <h2 className="text-3xl font-bold text-white leading-tight">Comunidade VIP</h2>
              <p className="text-muted-foreground text-lg">
                Troque experiências com outros criadores de elite, receba insights diários e suporte direto da nossa equipe técnica.
              </p>
              <Button 
                onClick={() => window.open(ACADEMY_GROUP_URL, "_blank")}
                className="w-full md:w-auto h-14 px-10 text-lg font-bold bg-gradient-to-r from-[#FE2C55] to-[#E92045] text-black hover:shadow-[0_0_30px_rgba(254,44,85,0.5)] transition-all flex items-center gap-3 rounded-xl"
              >
                Entrar no Grupo Academy <ExternalLink className="w-6 h-6" />
              </Button>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FE2C55]/50 to-transparent" />
        </Card>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-6xl mx-auto space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 px-2">
          <TrendingUp className="w-5 h-5 text-[#FE2C55]" /> Por que fazer parte?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b, idx) => (
            <Card key={idx} className="bg-secondary/20 border-white/10 hover:border-[#FE2C55]/50 transition-colors group">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-[#FE2C55]/10 p-3 rounded-xl group-hover:bg-[#FE2C55]/20 transition-all">
                  <b.icon className="w-6 h-6 text-[#FE2C55]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white">{b.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black/40 border-white/5 opacity-80 overflow-hidden relative border-dashed">
          <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <PlayCircle className="w-16 h-16 text-muted-foreground" />
              <Badge variant="outline" className="absolute -top-1 -right-1 border-white/20 text-[10px] bg-black">EM BREVE</Badge>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-white/90">Aulas em Vídeo</h4>
                <p className="text-sm text-muted-foreground">Módulos completos do zero ao avançado estão sendo gravados agora.</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  <span>Desenvolvimento</span>
                  <span>75%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-[#FE2C55] to-transparent w-[75%] animate-pulse" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
