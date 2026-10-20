import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormRastreio from "@/components/tracking/FormRastreio";
import { Button } from "@/components/rp/Button";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { BRAND } from "@/lib/brandAssets";

export default function HeroSection() {
  const [code, setCode] = useState("");
  const [erro, setErro] = useState("");
  const turnstileRef = useRef(null);
  const navigate = useNavigate();

  const enviar = async () => {
    setErro("");
    try {
      const turnstileToken = await turnstileRef.current.obterToken();
      navigate("/rastreamento", { state: { codigo: code.trim(), turnstileToken } });
    } catch {
      setErro("Não foi possível validar a verificação de segurança. Tente novamente.");
    }
  };

  return (
    <section className="bg-accent text-foreground">
      <div className="page-container grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="eyebrow">Logística terrestre e last mile</p>
          <h1 className="text-display-lg mt-3 md:!text-[48px] md:!leading-[56px]">
            Aproximando o seu negócio <span className="rounded-lg bg-primary px-1.5">dos seus clientes</span>, entrega por entrega.
          </h1>
          <p className="mt-4 max-w-lg text-body-lg text-muted-foreground">Entregas last mile, fulfillment e transporte rodoviário, com rastreamento por evento e comprovação digital de entrega.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/contato"><Icon name="request_quote" size={20} />Solicitar cotação</Button>
            <Button to="/servicos" variant="outline">Conhecer serviços</Button>
          </div>
          <img src={BRAND.container} alt="Contêiner NGS Transportes sendo içado, cercado por caixas com paraquedas" width="768" height="259" className="mt-10 w-full max-w-lg" />
        </div>
        <Card className="!p-5 md:!p-7 text-card-foreground">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name="package_2" size={26} filled /></span>
            <div>
              <h2 className="text-headline-sm">Rastrear encomenda</h2>
              <p className="text-body-sm text-muted-foreground">Informe o código de rastreio</p>
            </div>
          </div>
          <FormRastreio codigo={code} onCodigo={setCode} turnstileRef={turnstileRef} onEnviar={enviar} />
          {erro && <p role="alert" className="mt-3 text-body-sm text-destructive">{erro}</p>}
        </Card>
      </div>
    </section>
  );
}
