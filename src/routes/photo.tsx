import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { FoodDetail } from "@/components/FoodDetail";
import { useLang } from "@/lib/lang";
import { analyzeLabel } from "@/lib/nutrition.functions";
import type { FoodInfo } from "@/lib/nutrition";

export const Route = createFileRoute("/photo")({
  head: () => ({
    meta: [
      { title: "تصوير المنتج | عافية" },
      { name: "description", content: "صوّر ملصق المنتج وسيقرأه الذكاء الاصطناعي ويعطيك البوتاسيوم والفوسفور والبروتين والملح." },
      { property: "og:title", content: "تصوير المنتج | عافية" },
      { property: "og:description", content: "صوّر ملصق المنتج وسيفسره الذكاء الاصطناعي فوراً." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PhotoPage,
});

type Phase = "idle" | "analyzing" | "done" | "noLabel" | "error";

async function fileToDataUrl(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const max = 1280;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas context");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function PhotoPage() {
  const { t } = useLang();
  const analyze = useServerFn(analyzeLabel);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [food, setFood] = useState<FoodInfo | null>(null);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(dataUrl);
      setFood(null);
      setPhase("idle");
    } catch {
      setPhase("error");
    }
    e.target.value = "";
  }

  async function onAnalyze() {
    if (!preview) return;
    setPhase("analyzing");
    try {
      const res = await analyze({ data: { image: preview } });
      if (res.ok) {
        setFood(res.food);
        setPhase("done");
      } else {
        setPhase(res.reason === "no_label" ? "noLabel" : "error");
      }
    } catch {
      setPhase("error");
    }
  }

  return (
    <AppShell title={t.photoTitle}>
      <div className="flex flex-col gap-4">
        <p className="text-center text-sm font-semibold text-muted-foreground">{t.photoHint}</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFile}
          className="hidden"
        />

        {preview ? (
          <img src={preview} alt="" className="max-h-96 w-full rounded-3xl border border-border object-contain" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-card text-primary transition-colors hover:bg-muted"
          >
            <Camera className="size-14" />
            <span className="text-lg font-extrabold text-foreground">{t.photoBtnCamera}</span>
          </button>
        )}

        {preview ? (
          <button
            type="button"
            onClick={onAnalyze}
            disabled={phase === "analyzing"}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-lg font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {phase === "analyzing" ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
            {phase === "analyzing" ? t.photoAnalyzing : t.photoBtnAnalyze}
          </button>
        ) : null}

        {phase === "noLabel" ? (
          <p className="rounded-2xl border border-caution/20 bg-caution/5 p-4 text-center text-sm font-semibold text-caution">
            {t.noLabel}
          </p>
        ) : null}
        {phase === "error" ? (
          <p className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-center text-sm font-semibold text-danger">
            {t.aiError}
          </p>
        ) : null}

        {phase === "done" && food ? <FoodDetail food={food} /> : null}
      </div>
    </AppShell>
  );
}
