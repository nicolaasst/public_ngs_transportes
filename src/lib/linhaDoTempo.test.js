import { describe, expect, it } from "vitest";
import { classificarEvento } from "@/lib/linhaDoTempo";

describe("classificarEvento", () => {
  it.each([
    ["Entregue", "entregue", "sucesso"],
    ["Objeto entregue ao destinatário", "entregue", "sucesso"],
    ["Saiu para entrega", "saida", "andamento"],
    ["Pedido registrado", "registrado", "neutro"],
    ["Em trânsito", "transito", "andamento"],
    ["Objeto encaminhado para Unidade de Tratamento", "transito", "andamento"],
    ["Em separação", "separacao", "andamento"],
    ["Tentativa de entrega sem sucesso, uma nova tentativa será programada", "falha", "alerta"],
    ["Objeto não entregue - carteiro não atendido", "falha", "alerta"],
    ["Pedido cancelado", "cancelado", "erro"],
    ["Em devolução", "devolucao", "alerta"],
    ["Objeto aguardando retirada na caixa postal", "retirada", "alerta"],
    ["Qualquer coisa nova", "evento", "neutro"],
  ])("%s → %s/%s", (texto, tipo, tom) => {
    expect(classificarEvento(texto)).toEqual({ tipo, tom });
  });
});
