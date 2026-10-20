import { describe, expect, it } from "vitest";
import { siteKeyTurnstile } from "@/lib/turnstile";

describe("siteKeyTurnstile", () => {
  it("lê a site key do ambiente e trata vazio como não configurado", () => {
    expect(siteKeyTurnstile({ VITE_TURNSTILE_SITE_KEY: " 0x4AAAA " })).toBe("0x4AAAA");
    expect(siteKeyTurnstile({ VITE_TURNSTILE_SITE_KEY: "" })).toBeNull();
    expect(siteKeyTurnstile({})).toBeNull();
  });
});
