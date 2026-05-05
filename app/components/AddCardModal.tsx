"use client";

import { useRef, useState } from "react";
import { CardSearchInput } from "./CardSearchInput";

type CardFormData = {
  name: string;
  condition: string;
  qty: number;
  cost: number;
  source: string;
};

const CONDITIONS = ["PSA 10", "PSA 9", "NM", "LP", "MP", "HP"];
const SOURCES = ["eBay", "TCGPlayer", "PWCC", "Other"];

const DEFAULT_FORM: CardFormData = {
  name: "",
  condition: "NM",
  qty: 1,
  cost: 0,
  source: "eBay",
};

type Props = {
  onClose: () => void;
  onAdded: () => void;
};

export function AddCardModal({ onClose, onAdded }: Props) {
  const [step, setStep] = useState<"scan" | "form">("scan");
  const [form, setForm] = useState<CardFormData>(DEFAULT_FORM);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [fetchingMarket, setFetchingMarket] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameValid, setNameValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchIdRef = useRef(0);

  function set<K extends keyof CardFormData>(key: K, value: CardFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function fetchMarketPrice(name: string, condition: string, source: string) {
    if (!name || source === "Other") {
      setMarketPrice(null);
      setFetchingMarket(false);
      return;
    }

    const id = ++fetchIdRef.current;
    setFetchingMarket(true);
    setMarketPrice(null);

    try {
      const params = new URLSearchParams({ name, condition, source });
      const res = await fetch(`/api/cards/market?${params}`);
      if (!res.ok) throw new Error("Failed to fetch price");
      const { price } = await res.json();
      if (fetchIdRef.current === id) setMarketPrice(price);
    } catch {
      if (fetchIdRef.current === id) setMarketPrice(null);
    } finally {
      if (fetchIdRef.current === id) setFetchingMarket(false);
    }
  }

  function enterForm(nameOverride?: string) {
    const name = nameOverride ?? form.name;
    setStep("form");
    fetchMarketPrice(name, form.condition, form.source);
  }

  async function handleImageSelect(file: File) {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setScanning(true);
    setScanError(null);

    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/cards/scan", { method: "POST", body: fd });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Scan failed");
      }

      const { name } = await res.json();
      setForm((prev) => ({ ...prev, name }));
      setNameValid(true);
      enterForm(name);
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleImageSelect(file);
  }

  function handleSourceChange(source: string) {
    set("source", source);
    fetchMarketPrice(form.name, form.condition, source);
  }

  function handleConditionChange(condition: string) {
    set("condition", condition);
    fetchMarketPrice(form.name, condition, form.source);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, market: marketPrice ?? 0 }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add card");
      }

      onAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const usd = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Add Card</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 transition-colors hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        {/* Step 1 — Scan */}
        {step === "scan" && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {!scanning && !preview && (
              <div
                className="flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed border-zinc-700 px-6 py-10 text-center transition-colors hover:border-purple-500"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-3xl">
                  📷
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Scan your card</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    AI will identify the card automatically
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500"
                >
                  Choose Photo
                </button>
              </div>
            )}

            {(scanning || (preview && !scanError)) && (
              <div className="flex flex-col items-center gap-4">
                {preview && (
                  <img
                    src={preview}
                    alt="Card preview"
                    className="h-48 w-auto rounded-lg object-contain"
                  />
                )}
                {scanning && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-purple-500" />
                    <p className="text-sm text-zinc-400">Identifying card...</p>
                  </div>
                )}
              </div>
            )}

            {scanError && (
              <div className="flex flex-col items-center gap-3">
                {preview && (
                  <img
                    src={preview}
                    alt="Card preview"
                    className="h-32 w-auto rounded-lg object-contain opacity-50"
                  />
                )}
                <p className="rounded-lg border border-red-800 bg-red-900/30 px-3 py-2 text-xs text-red-400">
                  {scanError}
                </p>
                <button
                  onClick={() => { setPreview(null); setScanError(null); }}
                  className="text-xs text-zinc-400 underline hover:text-zinc-200"
                >
                  Try again
                </button>
              </div>
            )}

            <div className="mt-5 text-center">
              <button
                className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
                onClick={() => enterForm()}
              >
                Skip — enter manually
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Form */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card name */}
            <div>
              {preview && (
                <div className="mb-3 flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-2">
                  <img
                    src={preview}
                    alt="Scanned card"
                    className="h-10 w-auto rounded object-contain"
                  />
                  <p className="text-xs text-zinc-400">Identified — edit if needed</p>
                </div>
              )}
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Card Name
              </label>
              <CardSearchInput
                value={form.name}
                onChange={(v) => set("name", v)}
                onSelect={(v) => fetchMarketPrice(v, form.condition, form.source)}
                onValidChange={setNameValid}
              />
            </div>

            {/* Condition */}
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Condition
              </label>
              <select
                value={form.condition}
                onChange={(e) => handleConditionChange(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Qty + Source */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={form.qty}
                  onChange={(e) => set("qty", parseInt(e.target.value) || 1)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Source</label>
                <select
                  value={form.source}
                  onChange={(e) => handleSourceChange(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {SOURCES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cost + Market Value */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Cost ($)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.cost}
                  onChange={(e) => set("cost", parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-400">
                    Market Value
                  </label>
                  {!fetchingMarket && form.source !== "Other" && form.name && (
                    <button
                      type="button"
                      onClick={() => fetchMarketPrice(form.name, form.condition, form.source)}
                      className="text-xs text-zinc-500 transition-colors hover:text-purple-400"
                      title="Refresh price"
                    >
                      ↻
                    </button>
                  )}
                </div>
                <div className="flex h-[38px] items-center rounded-lg border border-zinc-700 bg-zinc-800/50 px-3">
                  {fetchingMarket ? (
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <span className="h-3 w-3 animate-spin rounded-full border border-zinc-600 border-t-purple-500" />
                      Fetching...
                    </span>
                  ) : form.source === "Other" ? (
                    <span className="text-sm text-zinc-600">—</span>
                  ) : marketPrice !== null ? (
                    <span className="text-sm font-medium text-white">{usd(marketPrice)}</span>
                  ) : (
                    <span className="text-sm text-zinc-600">—</span>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-800 bg-red-900/30 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !nameValid}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Card"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
