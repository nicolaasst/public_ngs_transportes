// Ícone e cor de cada evento da linha do tempo pública, a partir do TEXTO que a API devolve (sistema ou transportadora).

const semAcento = (v) => String(v ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * @returns {{ tipo: "entregue"|"saida"|"transito"|"registrado"|"separacao"|"coleta"|"falha"|"devolucao"|"cancelado"|"retirada"|"analise"|"evento", tom: "sucesso"|"andamento"|"alerta"|"erro"|"neutro" }}
 */
export function classificarEvento(texto) {
  const t = semAcento(texto);
  if (/nao entregue|sem sucesso|tentativa de entrega|ausente|nova tentativa|carteiro/.test(t)) return { tipo: "falha", tom: "alerta" };
  if (/cancelad/.test(t)) return { tipo: "cancelado", tom: "erro" };
  if (/devolu|devolvid|retorno ao remetente|entregue ao remetente/.test(t)) return { tipo: "devolucao", tom: "alerta" };
  if (/aguardando.*retirada|disponivel para retirada|caixa postal/.test(t)) return { tipo: "retirada", tom: "alerta" };
  if (/entreg(ue|a realizada|a efetuada)|retirad[oa]/.test(t) && !/saiu|saida|rota/.test(t)) return { tipo: "entregue", tom: "sucesso" };
  if (/saiu para entrega|saida para entrega|em rota|rota de entrega|out for delivery/.test(t)) return { tipo: "saida", tom: "andamento" };
  if (/transito|transferenc|encaminhad|unidade|centro de distribuicao|postado|despachad|expedid/.test(t)) return { tipo: "transito", tom: "andamento" };
  if (/separacao|separad|conferencia|conferid/.test(t)) return { tipo: "separacao", tom: "andamento" };
  if (/coleta|coletad/.test(t)) return { tipo: "coleta", tom: "andamento" };
  if (/analise|alerta|travad/.test(t)) return { tipo: "analise", tom: "alerta" };
  if (/registrad|criado|recebid|importad|pedido/.test(t)) return { tipo: "registrado", tom: "neutro" };
  return { tipo: "evento", tom: "neutro" };
}
