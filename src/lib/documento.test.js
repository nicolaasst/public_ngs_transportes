import { describe, expect, it } from "vitest";
import { documentoValido, extrairCodigos, mascararDocumento } from "@/lib/documento";

describe("documento", () => {
  it("valida CPF e CNPJ pelos dígitos verificadores", () => {
    expect(documentoValido("529.982.247-25")).toBe(true);
    expect(documentoValido("11.222.333/0001-81")).toBe(true);
    for (const ruim of ["529.982.247-24", "111.111.111-11", "123", "", "11.222.333/0001-82"]) expect(documentoValido(ruim)).toBe(false);
  });
  it("aplica a máscara de CPF e de CNPJ enquanto digita", () => {
    expect(mascararDocumento("52998224725")).toBe("529.982.247-25");
    expect(mascararDocumento("5299")).toBe("529.9");
    expect(mascararDocumento("11222333000181")).toBe("11.222.333/0001-81");
    expect(mascararDocumento("abc")).toBe("");
  });
  it("separa vários códigos por vírgula, espaço ou quebra de linha, sem repetir", () => {
    expect(extrairCodigos("ngsam1br, NGSSP2BR\nNGSAM1BR ;NGSBA3BR")).toEqual(["NGSAM1BR", "NGSSP2BR", "NGSBA3BR"]);
    expect(extrairCodigos("  ")).toEqual([]);
  });
});
