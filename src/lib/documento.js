// CPF/CNPJ e lista de códigos digitados no formulário de rastreio.
export const MAX_CODIGOS = 10;

const soDigitos = (v) => String(v ?? "").replace(/\D/g, "");

function digitoCpf(base, pesoInicial) {
  const soma = [...base].reduce((acc, n, i) => acc + Number(n) * (pesoInicial - i), 0);
  const r = (soma * 10) % 11;
  return r === 10 ? 0 : r;
}

function digitoCnpj(base) {
  const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const r = [...base].reduce((acc, n, i) => acc + Number(n) * pesos[i], 0) % 11;
  return r < 2 ? 0 : 11 - r;
}

/** CPF (11) ou CNPJ (14) com dígitos verificadores corretos. */
export function documentoValido(valor) {
  const d = soDigitos(valor);
  if (/^(\d)\1+$/.test(d)) return false;
  if (d.length === 11) return digitoCpf(d.slice(0, 9), 10) === Number(d[9]) && digitoCpf(d.slice(0, 10), 11) === Number(d[10]);
  if (d.length === 14) return digitoCnpj(d.slice(0, 12)) === Number(d[12]) && digitoCnpj(d.slice(0, 13)) === Number(d[13]);
  return false;
}

/** Máscara enquanto digita: até 11 dígitos vira CPF; acima disso, CNPJ. */
export function mascararDocumento(valor) {
  const d = soDigitos(valor).slice(0, 14);
  if (d.length <= 11) return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

/** "NGSAM1BR, ngssp2br  NGSBA3BR" → ["NGSAM1BR", "NGSSP2BR", "NGSBA3BR"] (sem repetição, em maiúsculas). */
export function extrairCodigos(texto) {
  const lista = String(texto ?? "").split(/[\s,;]+/).map((c) => c.trim().toUpperCase()).filter(Boolean);
  return [...new Set(lista)];
}
