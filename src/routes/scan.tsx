import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CameraOff, ScanLine } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { IScannerControls } from "@zxing/browser";
import { AppShell } from "@/components/AppShell";
import { FoodDetail } from "@/components/FoodDetail";
import { useLang } from "@/lib/lang";
import { getProductByBarcode } from "@/lib/nutrition.functions";
import type { FoodInfo } from "@/lib/nutrition";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "مسح الباركود | عافية" },
      { name: "description", content: "امسح باركود المنتج لمعرفة قيمه الغذائية ومدى ملاءمته لمرضى الكلى والسكري." },
      { property: "og:title", content: "مسح الباركود | عافية" },
      { property: "og:description", content: "امسح باركود المنتج لمعرفة قيمه الغذائية ومدى ملاءمته لمرضى الكلى." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScanPage,
});

type Phase = "idle" | "loading" | "notFound";

function ScanPage() {
  const { t } = useLang();
  const getProduct = useServerFn(getProductByBarcode);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handlerRef = useRef<(code: string) => void>(() => {});
  const doneRef = useRef(false);
  const [cameraError, setCameraError] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [food, setFood] = useState<FoodInfo | null>(null);
  const [manual, setManual] = useState("");

  async function handleCode(code: string) {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("loading");
    try {
      const f = await getProduct({ data: { code } });
      setFood(f);
      setPhase(f ? "idle" : "notFound");
    } catch {
      setPhase("notFound");
    }
  }

  handlerRef.current = handleCode;

  useEffect(() => {
    let controls: IScannerControls | null = null;
    let cancelled = false;
    (async () => {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        if (cancelled || !videoRef.current) return;
        const reader = new BrowserMultiFormatReader();
        controls = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
          if (result) void handlerRef.current(result.getText());
        });
      } catch {
        if (!cancelled) setCameraError(true);
      }
    })();
    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, []);

  function onManual(e: FormEvent) {
    e.preventDefault();
    const code = manual.replace(/\D/g, "");
    if (code.length < 4) return;
    doneRef.current = false;
    setFood(null);
    void handleCode(code);
  }

  function reset() {
    doneRef.current = false;
    setFood(null);
    setPhase("idle");
  }

  return (
    <AppShell title={t.scanTitle}>
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5">
          <video ref={videoRef} className="aspect-[3/4] w-full object-cover" muted playsInline />
          <p className="absolute inset-x-0 bottom-0 bg-foreground/60 px-4 py-2 text-center text-sm font-semibold text-background">
            {t.scanHint}
          </p>
        </div>

        {cameraError ? (
          <div className="flex items-start gap-3 rounded-2xl border border-caution/20 bg-caution/5 p-4">
            <CameraOff className="mt-0.5 size-5 shrink-0 text-caution" />
            <p className="text-sm font-semibold text-foreground">{t.cameraError}</p>
          </div>
        ) : null}

        {phase === "loading" ? (
          <p className="text-center text-base font-semibold text-muted-foreground">{t.loadingProduct}</p>
        ) : null}
        {phase === "notFound" ? (
          <div className="flex flex-col gap-2">
            <p className="text-center text-base font-semibold text-caution">{t.notFound}</p>
            <button
              type="button"
              onClick={reset}
              className="mx-auto rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
            >
              {t.scanManualBtn}
            </button>
          </div>
        ) : null}

        {food ? <FoodDetail food={food} /> : null}

        <form onSubmit={onManual} className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-muted-foreground">{t.scanManual}</p>
          <div className="flex gap-2">
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              inputMode="numeric"
              className="min-w-0 flex-1 rounded-2xl border border-input bg-background px-4 py-3 text-lg font-bold tracking-wider text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="1234567890"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ScanLine className="size-5" />
              <span className="hidden sm:inline">{t.scanManualBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
