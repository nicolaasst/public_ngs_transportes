import { useCallback, useEffect, useState } from "react";

const CHAVE = "ngs-portal-theme";

const lerPreferencia = () => { try { return localStorage.getItem(CHAVE) || "system"; } catch { return "system"; } };
const escuro = (pref) => pref === "dark" || (pref === "system" && typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);

/** Tema claro/escuro do portal (mesma mecânica do App Delivery: classe `.dark` no <html>, preferência no localStorage). */
export function useTema() {
  const [pref, setPref] = useState(lerPreferencia);
  const [dark, setDark] = useState(() => escuro(lerPreferencia()));
  useEffect(() => {
    const aplicar = () => { const d = escuro(pref); setDark(d); document.documentElement.classList.toggle("dark", d); };
    aplicar();
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    mq?.addEventListener?.("change", aplicar);
    return () => mq?.removeEventListener?.("change", aplicar);
  }, [pref]);
  const alternar = useCallback(() => {
    const novo = dark ? "light" : "dark";
    try { localStorage.setItem(CHAVE, novo); } catch { /* sem armazenamento: vale só nesta sessão */ }
    setPref(novo);
  }, [dark]);
  return { dark, alternar };
}
