import avatarAna from "@/assets/avatars/avatar-ana.png";
import avatarBruna from "@/assets/avatars/avatar-bruna.jpeg";
import avatarRafael from "@/assets/avatars/avatar-rafael.png";
import avatarLucas from "@/assets/avatars/avatar-lucas.png";
import avatarMarina from "@/assets/avatars/avatar-marina.png";

export interface Product {
  id: number;
  nome: string;
  categoria: string;
  valor: string; // The user provided 'valor' in the new array
  avaliacao: number;
  vendas: number;
  comissao: number;
  concorrencia: "Baixa" | "Média" | "Alta";
  imagem: string; // The user provided 'imagem'
  link: string; // The user provided 'link'
  hot?: boolean;
  scoreViral?: number;
  vendasDia?: number;
  margem?: number;
  // Keep some old fields for compatibility if needed, but the user didn't specify
  preco?: number;
  imageUrl?: string;
  linkTiktok?: string;
  precoTexto?: string;
}

export const defaultProducts: Product[] = [
  {
    id: 1, hot: true,
    nome: "Cinto com tachas pretas punk rock com rebites pirâmide metal brilhante unissex",
    categoria: "Acessórios",
    avaliacao: 4.9,
    vendas: 3200,
    valor: "R$ 32,98",
    comissao: 14,
    scoreViral: 88,
    vendasDia: 45,
    margem: 28,
    concorrencia: "Baixa",
    link: "https://www.tiktok.com/shop/br/pdp/1731420019843958035",
    imagem: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/3fbdd9e221ed4405a41bcdfe025b6344~tplv-aphluv4xwc-crop-webp:300:300.webp"
  },
  {
    id: 2, hot: true,
    nome: "Barriguinha Cream 200g Creme para Hidratação Profunda",
    categoria: "Skincare",
    avaliacao: 4.8,
    vendas: 8500,
    valor: "R$ 136,00",
    comissao: 18,
    scoreViral: 91,
    vendasDia: 85,
    margem: 30,
    concorrencia: "Média",
    link: "https://www.tiktok.com/shop/br/pdp/1731351465671230649",
    imagem: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/9014652732064d459b29f56ef1f89438~tplv-aphluv4xwc-resize-webp:800:800.webp"
  },
  {
    id: 3, hot: true,
    nome: "Descascador De Alho Silicone Rolo Moedor Chopper Máquina Acessórios Cozinha",
    categoria: "Casa & Cozinha",
    avaliacao: 4.8,
    vendas: 6200,
    valor: "R$ 37,00",
    comissao: 16,
    scoreViral: 85,
    vendasDia: 62,
    margem: 25,
    concorrencia: "Baixa",
    link: "https://www.tiktok.com/shop/br/pdp/1732147487806556159",
    imagem: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/4e5ad1a12a9c46e397139643ca501ab0~tplv-o3syd03w52-crop-webp:300:300.webp"
  },
  {
    id: 4, hot: false,
    nome: "Conjunto Top Decotado Manga Cavada + Saia Longa Com Fenda Sereia Moda Feminina",
    categoria: "Moda",
    avaliacao: 4.3,
    vendas: 4100,
    valor: "R$ 62,71",
    comissao: 20,
    scoreViral: 79,
    vendasDia: 41,
    margem: 22,
    concorrencia: "Média",
    link: "https://www.tiktok.com/shop/br/pdp/1732767996168406714",
    imagem: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/ba79d680a3464e3e81261fbeae6d1610~tplv-o3syd03w52-crop-webp:300:300.webp"
  },
  {
    id: 5, hot: false,
    nome: "Kit 2 Bermudas Tactel Preta e Branca Bolsos Laterais Short Moda Praia",
    categoria: "Moda",
    avaliacao: 4.4,
    vendas: 3800,
    valor: "R$ 46,31",
    comissao: 15,
    scoreViral: 76,
    vendasDia: 38,
    margem: 20,
    concorrencia: "Alta",
    link: "https://www.tiktok.com/shop/br/pdp/1732706501926750064",
    imagem: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/dd7fef17a8144beb860b2471376e7b75~tplv-o3syd03w52-crop-webp:300:300.webp"
  },
  {
    id: 6, hot: false,
    nome: "Kit 4 Toalha de Banho Grande e Grossa Premium Luxo Felpuda 100% Algodão Viena",
    categoria: "Casa & Cozinha",
    avaliacao: 5.0,
    vendas: 9800,
    valor: "R$ 54,40",
    comissao: 17,
    scoreViral: 93,
    vendasDia: 98,
    margem: 28,
    concorrencia: "Baixa",
    link: "https://www.tiktok.com/shop/br/pdp/1732917888887194947",
    imagem: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/cd7420e061484c7198942872f8e33484~tplv-aphluv4xwc-crop-webp:300:300.webp"
  },
  {
    id: 7, hot: false,
    nome: "Mini Liquidificador Portátil Recarregável 450ml 8 Lâminas USB Display Digital",
    categoria: "Casa & Cozinha",
    avaliacao: 4.0,
    vendas: 5400,
    valor: "R$ 41,57",
    comissao: 14,
    scoreViral: 72,
    vendasDia: 54,
    margem: 18,
    concorrencia: "Média",
    link: "https://www.tiktok.com/shop/br/pdp/1731172576541443502",
    imagem: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/2ae85e37cfd14759887abc95f7395b6d~tplv-aphluv4xwc-crop-webp:300:300.webp"
  },
  {
    id: 8, hot: false,
    nome: "Azeiteiro Vinagreiro Spray De Vidro Com Botao Bico Dosador Tampa 470ml",
    categoria: "Casa & Cozinha",
    avaliacao: 4.3,
    vendas: 2900,
    valor: "R$ 29,69",
    comissao: 12,
    scoreViral: 68,
    vendasDia: 29,
    margem: 16,
    concorrencia: "Baixa",
    link: "https://www.tiktok.com/shop/br/pdp/1731518860899616510",
    imagem: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/07fc9c6501d546dea59b9a832137f133~tplv-o3syd03w52-crop-webp:300:300.webp"
  },
  {
    id: 9, hot: false,
    nome: "Saia para Box Cama Solteiro/Casal/Queen Micropercal Com Elástico",
    categoria: "Casa & Cozinha",
    avaliacao: 4.6,
    vendas: 7200,
    valor: "R$ 18,59",
    comissao: 13,
    scoreViral: 81,
    vendasDia: 72,
    margem: 22,
    concorrencia: "Média",
    link: "https://www.tiktok.com/shop/br/pdp/1733041675376232147",
    imagem: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/1204d72cee654efb98b21d265ea33c51~tplv-aphluv4xwc-crop-webp:300:300.webp"
  },
  {
    id: 10, hot: false,
    nome: "Chinelo Nuvem Unissex Macio Antiderrapante",
    categoria: "Moda",
    avaliacao: 4.6,
    vendas: 12300,
    valor: "R$ 10,90",
    comissao: 10,
    scoreViral: 87,
    vendasDia: 123,
    margem: 15,
    concorrencia: "Alta",
    link: "https://www.tiktok.com/shop/br/pdp/1733925089237698174",
    imagem: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/9c3796ba1af3436b9b013805c16dd026~tplv-aphluv4xwc-crop-webp:300:300.webp"
  },
  {
    id: 11, hot: false,
    nome: "Kit 3 Cuecas Boxer Algodão Masculina",
    categoria: "Moda",
    avaliacao: 4.5,
    vendas: 4700,
    valor: "R$ 68,60",
    comissao: 16,
    scoreViral: 74,
    vendasDia: 47,
    margem: 19,
    concorrencia: "Média",
    link: "https://www.tiktok.com/shop/br/pdp/1734135327597299060",
    imagem: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/20fd8623c7b04eb2ba9348f0b8afa5ff~tplv-o3syd03w52-crop-webp:300:300.webp"
  },
  {
    id: 12, hot: false,
    nome: "Vestido Curto Costa Nua Duna Leve Soltinho e Super Elegante",
    categoria: "Moda",
    avaliacao: 4.4,
    vendas: 3300,
    valor: "R$ 26,34",
    comissao: 18,
    scoreViral: 77,
    vendasDia: 33,
    margem: 21,
    concorrencia: "Baixa",
    link: "https://www.tiktok.com/shop/br/pdp/1733085955087566347",
    imagem: "https://p19-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/ccf42dee8f824e7d8f9da3b812dc801a~tplv-aphluv4xwc-crop-webp:225:300.webp"
  },
  {
    id: 13, hot: false,
    nome: "Escova Secadora 110V Alisador Elétrica Quente Cabelo Com 3 Em 1",
    categoria: "Beleza",
    avaliacao: 5.0,
    vendas: 6800,
    valor: "R$ 45,78",
    comissao: 19,
    scoreViral: 90,
    vendasDia: 68,
    margem: 26,
    concorrencia: "Média",
    link: "https://www.tiktok.com/shop/br/pdp/1732967190579021721",
    imagem: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/0907de2563f44cebacc60eaa04fab2a6~tplv-o3syd03w52-crop-webp:300:300.webp"
  },
  {
    id: 14, hot: false,
    nome: "Conjunto Alfaiataria Social Feminino Calça e Blusa Regata Elegante",
    categoria: "Moda",
    avaliacao: 4.7,
    vendas: 5100,
    valor: "R$ 71,76",
    comissao: 20,
    scoreViral: 83,
    vendasDia: 51,
    margem: 24,
    concorrencia: "Baixa",
    link: "https://www.tiktok.com/shop/br/pdp/1732741875357549600",
    imagem: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/f534867091ec4cb1a6eed90ae76e5e21~tplv-aphluv4xwc-crop-webp:225:300.webp"
  }
];

export const defaultAvatars = [
  { id: 1, name: "Ana", imageUrl: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Maria", imageUrl: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Lucas", imageUrl: "https://i.pravatar.cc/150?img=11" },
  { id: 4, name: "Tiago", imageUrl: "https://i.pravatar.cc/150?img=12" },
  { id: 5, name: "Pedro", imageUrl: "https://i.pravatar.cc/150?img=13" }
];
