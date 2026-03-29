"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TrainFront, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Subway Surfers (Giphy – klassiske media-URL-er) */
const SUBWAY_GIFS = [
  "https://media.giphy.com/media/l8cSolJ93hp2UOZBNQ/giphy.gif",
  "https://media.giphy.com/media/h80pI84OJM8LyW1FrJ/giphy.gif"
];

/**
 * Minecraft / parkour – Giphy v1-URL-er (søk «minecraft parkour»), testet med HTTP 200.
 * Gamle korte media-ID-er gir ofte 404.
 */
const MINECRAFT_PARKOUR_GIFS = [
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWR4MWUxMHZhbXI3djliYjlhbXZwNnBjc2lwZWVzaDlzZmIzOGV6bCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jPXB66UWvUiqHNwPlD/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzZ6NHA3dDcydGhwMDllY3N2MnBnNjQ1YTU4ZnFsYzZkNjg0a2FhYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8UiYQWoZgafFJaN9hw/200.gif"
];

type Source = "subway" | "minecraft";

function pickSrc(index: number): { src: string; source: Source } {
  const useSubway = index % 2 === 0;
  if (useSubway) {
    return { src: SUBWAY_GIFS[index % SUBWAY_GIFS.length], source: "subway" };
  }
  return { src: MINECRAFT_PARKOUR_GIFS[index % MINECRAFT_PARKOUR_GIFS.length], source: "minecraft" };
}

function MemeSwitch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Meme-rutenett av eller på"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        checked ? "bg-amber-500" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-7 w-7 translate-x-0.5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-6"
        )}
      />
    </button>
  );
}

export function MemeModePanel({
  enabled,
  onEnabledChange,
  zoomPercent,
  onZoomPercentChange,
  cellMinPx,
  onCellMinPxChange
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  zoomPercent: number;
  onZoomPercentChange: (v: number) => void;
  cellMinPx: number;
  onCellMinPxChange: (v: number) => void;
}) {
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  if (panelCollapsed) {
    return (
      <button
        type="button"
        onClick={() => setPanelCollapsed(false)}
        title="Vis meme-rutenett"
        aria-label="Vis meme-rutenett-innstillinger"
        className={cn(
          "fixed left-4 top-4 z-[200] flex h-12 w-12 items-center justify-center rounded-2xl border shadow-lg transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
          enabled
            ? "border-amber-400/90 bg-gradient-to-br from-amber-100 to-orange-100"
            : "border-slate-200 bg-white/95"
        )}
      >
        <TrainFront className={cn("h-6 w-6", enabled ? "text-amber-700" : "text-slate-600")} aria-hidden />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed left-4 top-4 z-[200] flex w-[min(calc(100vw-2rem),22rem)] flex-col gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-md",
        enabled
          ? "border-amber-300/80 bg-gradient-to-br from-amber-50/95 to-orange-50/95"
          : "border-slate-200 bg-white/95"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <TrainFront className={cn("h-4 w-4 shrink-0", enabled ? "text-amber-700" : "text-slate-500")} aria-hidden />
          <span className="text-sm font-semibold leading-tight text-slate-900">Meme-rutenett</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <MemeSwitch checked={enabled} onCheckedChange={onEnabledChange} />
          <button
            type="button"
            onClick={() => setPanelCollapsed(true)}
            title="Skjul panel"
            aria-label="Skjul meme-rutenett-panel"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-black/5 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <p className="text-xs leading-snug text-slate-600">
        Subway Surfers + Minecraft parkour i rutenett bak quizen. Juster zoom og cellestørrelse under.
      </p>

      <div className="space-y-3 border-t border-slate-200/80 pt-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <label htmlFor="meme-zoom">Zoom</label>
            <span className="tabular-nums text-slate-500">{zoomPercent}%</span>
          </div>
          <input
            id="meme-zoom"
            type="range"
            min={50}
            max={200}
            step={5}
            value={zoomPercent}
            onChange={(e) => onZoomPercentChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-amber-500"
          />
          <p className="text-[10px] text-slate-500">Over 100% = zoomet inn (beskjærer). Under = zoomet ut.</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <label htmlFor="meme-cell">Rutenett (cellestørrelse)</label>
            <span className="tabular-nums text-slate-500">{cellMinPx}px</span>
          </div>
          <input
            id="meme-cell"
            type="range"
            min={70}
            max={260}
            step={5}
            value={cellMinPx}
            onChange={(e) => onCellMinPxChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-amber-500"
          />
          <p className="text-[10px] text-slate-500">Lav verdi = flere, mindre ruter. Høy verdi = færre, større ruter.</p>
        </div>
      </div>
    </div>
  );
}

function useGridTileCount(enabled: boolean, cellMinPx: number) {
  const [count, setCount] = useState(48);

  useEffect(() => {
    if (!enabled) return;

    const update = () => {
      const minW = Math.max(60, cellMinPx);
      const rowH = Math.round(minW * 1.5);
      const cols = Math.max(4, Math.ceil(window.innerWidth / minW) + 2);
      const rows = Math.max(4, Math.ceil(window.innerHeight / rowH) + 2);
      const n = cols * rows;
      setCount(Math.min(220, Math.max(24, n)));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [enabled, cellMinPx]);

  return count;
}

export function MemeBackgroundGrid({
  enabled,
  zoomPercent,
  cellMinPx
}: {
  enabled: boolean;
  zoomPercent: number;
  cellMinPx: number;
}) {
  const tileCount = useGridTileCount(enabled, cellMinPx);
  const scale = Math.max(0.5, Math.min(2.5, zoomPercent / 100));

  const rowMin = Math.max(100, Math.round(cellMinPx * 1.45));

  const tiles = useMemo(() => {
    return Array.from({ length: tileCount }, (_, i) => {
      const { src, source } = pickSrc(i);
      return { id: i, src, source };
    });
  }, [tileCount, enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-zinc-950" aria-hidden>
      <div
        className="h-full w-full origin-center will-change-transform"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className="grid h-full min-h-screen w-full gap-0.5 p-0.5"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${cellMinPx}px, 1fr))`,
            gridAutoRows: `minmax(${rowMin}px, 1fr)`
          }}
        >
          {tiles.map((t) => (
            <div key={t.id} className="relative min-h-0 overflow-hidden bg-black" style={{ minHeight: rowMin }}>
              <img
                src={t.src}
                alt=""
                className="h-full w-full object-cover opacity-95"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
              <div
                className={cn(
                  "pointer-events-none absolute left-1 top-1 rounded px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white shadow",
                  t.source === "subway" ? "bg-emerald-600/90" : "bg-lime-600/90"
                )}
              >
                {t.source === "subway" ? "Subway" : "MC parkour"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
