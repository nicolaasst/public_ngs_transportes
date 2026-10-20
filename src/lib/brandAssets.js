// Imagens da marca NGS (mesmos arquivos do App Delivery), empacotadas em src/assets/brand/.
import icone from "@/assets/brand/icone.png";
import logoCompleto from "@/assets/brand/logo-full.png";
import container from "@/assets/brand/container-paraquedas.png";
import acenando from "@/assets/brand/mascote-arredondado-acenando.png";
import pensando from "@/assets/brand/mascote-circulo-pensando.png";
import cambalhota from "@/assets/brand/mascote-quadrado-cambalhota.png";
import apontando from "@/assets/brand/mascote-triangulo-apontando.png";
import telaParada from "@/assets/app/stop-light.png";
import telaHistorico from "@/assets/app/history-detail-light.png";
import telaConcluida from "@/assets/app/complete-light.png";
import telaMapa from "@/assets/app/mapa-light-390x844.png";

export const BRAND = { icone, logoCompleto, container };
export const MASCOTES = { roundedWaving: acenando, circleThinking: pensando, squareCambalhota: cambalhota, trianglePointing: apontando };
// Capturas reais do aplicativo NGS Delivery usado pelos motoristas.
export const TELAS_APP = { parada: telaParada, historico: telaHistorico, concluida: telaConcluida, mapa: telaMapa };
