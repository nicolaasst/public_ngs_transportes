import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { escolherTiles } from "@/lib/rastreio";

// Mostra só um CÍRCULO (centro + raio devolvidos pela API). Sem marcador, sem trilha, sem seta: o ponto real do veículo nunca chega ao navegador.
export default function MapaAproximado({ centro, raioM }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    const mapa = L.map(ref.current, { zoomControl: true, attributionControl: true, maxZoom: 14, scrollWheelZoom: false });
    const tiles = escolherTiles(import.meta.env?.VITE_MAPBOX_PUBLIC_TOKEN);
    let camada = L.tileLayer(tiles.principal.url, { attribution: tiles.principal.atribuicao, maxZoom: 14, tileSize: 256 }).addTo(mapa);
    let trocou = false;
    // se o tile do Mapbox falhar (token inválido, cota, rede), troca sozinho para o OpenStreetMap
    camada.on("tileerror", () => {
      if (trocou || !tiles.reserva) return;
      trocou = true;
      mapa.removeLayer(camada);
      camada = L.tileLayer(tiles.reserva.url, { attribution: tiles.reserva.atribuicao, maxZoom: 14 }).addTo(mapa);
    });
    const circulo = L.circle([centro.lat, centro.lng], { radius: raioM, color: "#b45309", weight: 2, fillColor: "#fbbf24", fillOpacity: 0.25 }).addTo(mapa);
    mapa.fitBounds(circulo.getBounds(), { padding: [24, 24] });
    return () => { mapa.remove(); };
  }, [centro.lat, centro.lng, raioM]);

  return (
    <figure>
      <div ref={ref} role="img" aria-label="Mapa com a área aproximada onde a encomenda está" className="h-72 w-full rounded-card border border-brand-border overflow-hidden" />
      <figcaption className="mt-2 text-xs text-brand-text-secondary">Localização aproximada — atualizada com atraso por segurança.</figcaption>
    </figure>
  );
}
