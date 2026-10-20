// Comprovante de entrega e compartilhamento do rastreio (100% no navegador, a partir do que a API pública devolveu).
// A API só entrega nome ABREVIADO de quem recebeu e URLs https de comprovação; nada de documento, endereço ou valores.

const fmt = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }) : "—";
};

export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Só aceita http(s) para <img src>/<a href> (nada de javascript:, data: ou blob: vindos da API). */
export function urlSegura(v) {
  try {
    const u = new URL(String(v ?? ""));
    return u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export function temComprovante(dados) {
  return !!dados?.comprovante;
}

export function nomeArquivo(dados) {
  return `comprovante-entrega-${String(dados?.codigo ?? "rastreio").replace(/[^A-Za-z0-9._-]/g, "")}`;
}

/** Documento HTML do comprovante (para abrir/imprimir). Todo texto vindo da API é escapado. */
export function htmlComprovante(dados) {
  const c = dados?.comprovante || {};
  const arquivos = (c.arquivos || []).map(urlSegura).filter(Boolean);
  const eventos = (Array.isArray(dados?.eventos) ? dados.eventos : []).slice(0, 30);
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Comprovante de entrega ${esc(dados?.codigo)}</title>
<style>body{font-family:Inter,Arial,sans-serif;color:#0d0d0d;max-width:720px;margin:24px auto;padding:0 16px}h1{font-size:20px;margin:0}
.sub{color:#555;font-size:13px;margin:4px 0 20px}dl{display:grid;grid-template-columns:150px 1fr;gap:8px 12px;font-size:14px}dt{color:#555}dd{margin:0;font-weight:600}
h2{font-size:15px;margin:24px 0 8px}ol{padding-left:18px;font-size:13px}li{margin:4px 0}.fotos{display:flex;flex-wrap:wrap;gap:10px}.fotos img{max-width:220px;max-height:220px;border:1px solid #ddd;border-radius:8px}
.ok{display:inline-block;background:#e7f7ec;color:#116b34;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:700}
footer{margin-top:28px;color:#777;font-size:11px;border-top:1px solid #eee;padding-top:10px}@media print{.noprint{display:none}}</style></head><body>
<h1>Comprovante de entrega</h1><p class="sub">NGS Transportes · gerado em ${esc(fmt(new Date().toISOString()))}</p>
<p><span class="ok">${esc(dados?.situacao || "Entregue")}</span></p>
<dl><dt>Código de rastreio</dt><dd>${esc(dados?.codigo)}</dd><dt>Destino</dt><dd>${esc(dados?.destino)}</dd>
<dt>Entregue em</dt><dd>${esc(fmt(c.entregue_em))}</dd><dt>Recebido por</dt><dd>${esc(c.recebido_por || "Não informado")}</dd></dl>
${arquivos.length ? `<h2>Comprovação</h2><div class="fotos">${arquivos.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer"><img src="${esc(u)}" alt="Comprovação da entrega" referrerpolicy="no-referrer"></a>`).join("")}</div>` : ""}
${eventos.length ? `<h2>Histórico</h2><ol>${eventos.map((e) => `<li>${esc(e.texto)} — ${esc(fmt(e.em))}</li>`).join("")}</ol>` : ""}
<footer>Documento informativo gerado a partir do rastreio público. Consulte o código em nosso portal para a situação atualizada.</footer>
<p class="noprint"><button onclick="window.print()">Imprimir / salvar como PDF</button></p></body></html>`;
}

/** Abre o comprovante numa nova aba. Devolve false se o navegador bloqueou o pop-up. */
export function abrirComprovante(dados, { abrir = window.open.bind(window), criarUrl = (b) => URL.createObjectURL(b) } = {}) {
  const url = criarUrl(new Blob([htmlComprovante(dados)], { type: "text/html;charset=utf-8" }));
  const w = abrir(url, "_blank"); // sem "noopener": com ele window.open devolve sempre null e não dá para saber se foi bloqueado
  if (!w) return false;
  try { w.opener = null; } catch { /* já isolado */ }
  return true;
}

/**
 * Carrega a foto de comprovação como JPEG (data URL) para incorporar ao PDF. Usa <img crossOrigin="anonymous"> (o bucket
 * público do comprovante responde `Access-Control-Allow-Origin: *`); qualquer formato que o navegador decodifique vira JPEG.
 * Devolve null se a imagem não carregar (sem CORS, offline, URL quebrada): o PDF então traz o link no lugar.
 */
export function carregarImagem(url, { max = 1200, tempoMs = 15000 } = {}) {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(null), tempoMs);
    const fim = (v) => { clearTimeout(timer); resolve(v); };
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      try {
        const escala = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * escala));
        const h = Math.max(1, Math.round(img.naturalHeight * escala));
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        fim({ dataUrl: canvas.toDataURL("image/jpeg", 0.85), w, h });
      } catch { fim(null); }
    };
    img.onerror = () => fim(null);
    img.src = url;
  });
}

/** Baixa o comprovante em PDF (jsPDF carregado só quando o botão é usado), com as fotos de comprovação INCORPORADAS. */
export async function baixarComprovante(dados, { carregar = carregarImagem } = {}) {
  const { jsPDF } = await import("jspdf");
  const c = dados?.comprovante || {};
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  let y = 20;
  const quebra = (altura) => { if (y + altura > 282) { pdf.addPage(); y = 20; } };
  const linha = (txt, tam = 11, negrito = false, avanco = 7) => {
    pdf.setFont("helvetica", negrito ? "bold" : "normal");
    pdf.setFontSize(tam);
    for (const parte of pdf.splitTextToSize(String(txt), 175)) {
      quebra(avanco);
      pdf.text(parte, 17, y);
      y += avanco;
    }
  };
  linha("Comprovante de entrega", 18, true, 9);
  linha(`NGS Transportes · gerado em ${fmt(new Date().toISOString())}`, 9, false, 9);
  linha(`Situação: ${dados?.situacao || "Entregue"}`, 12, true);
  linha(`Código de rastreio: ${dados?.codigo ?? ""}`);
  linha(`Destino: ${dados?.destino ?? "—"}`);
  linha(`Entregue em: ${fmt(c.entregue_em)}`);
  linha(`Recebido por: ${c.recebido_por || "Não informado"}`, 11, false, 9);

  const arquivos = (c.arquivos || []).map(urlSegura).filter(Boolean).slice(0, 4);
  if (arquivos.length) {
    linha("Comprovação", 12, true);
    const imagens = await Promise.all(arquivos.map((u) => carregar(u)));
    imagens.forEach((img, i) => {
      if (!img) { linha(`Foto ${i + 1} não pôde ser incorporada. Link: ${arquivos[i]}`, 8, false, 5); return; }
      const maxW = 120, maxH = 120;
      const proporcao = Math.min(maxW / img.w, maxH / img.h);
      const w = img.w * proporcao, h = img.h * proporcao;
      quebra(h + 4);
      pdf.addImage(img.dataUrl, "JPEG", 17, y, w, h);
      y += h + 6;
    });
    y += 2;
  }
  const eventos = (Array.isArray(dados?.eventos) ? dados.eventos : []).slice(0, 30);
  if (eventos.length) {
    linha("Histórico", 12, true);
    eventos.forEach((e) => linha(`${fmt(e.em)} — ${e.texto}`, 9, false, 5));
  }
  pdf.save(`${nomeArquivo(dados)}.pdf`);
}

export function urlDeCompartilhamento(codigo, origem = window.location.origin) {
  return `${origem}/rastreamento?codigo=${encodeURIComponent(String(codigo ?? "").trim())}`;
}

/** Web Share API quando existe (celular); senão copia o link. Devolve "compartilhado" | "copiado" | "cancelado" | "falhou". */
export async function compartilharRastreio(dados, { nav = globalThis.navigator, origem } = {}) {
  const url = urlDeCompartilhamento(dados?.codigo, origem);
  const payload = { title: "Rastreio NGS Transportes", text: `Acompanhe a entrega ${dados?.codigo ?? ""}: ${dados?.situacao ?? ""}`.trim(), url };
  try {
    if (nav?.share) {
      await nav.share(payload);
      return "compartilhado";
    }
  } catch (e) {
    if (e?.name === "AbortError") return "cancelado";
  }
  try {
    await nav.clipboard.writeText(url);
    return "copiado";
  } catch {
    return "falhou";
  }
}
