import { Component } from "react";

// Se o mapa (Leaflet) falhar por qualquer motivo, só ele some: o resultado do rastreio continua na tela.
export default class BarreiraDeErro extends Component {
  state = { falhou: false };
  static getDerivedStateFromError() { return { falhou: true }; }
  componentDidCatch(erro) { console.error("Falha ao exibir o mapa:", erro?.message); }
  render() {
    return this.state.falhou ? <p className="text-xs text-brand-text-secondary">Não foi possível carregar o mapa agora. O restante do rastreio está acima.</p> : this.props.children;
  }
}
