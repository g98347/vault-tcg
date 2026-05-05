"use client";

import { useEffect, useRef, useState } from "react";

type CardResult = {
  id: string;
  name: string;
  setName: string;
  number: string;
  displayName: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  /** Fires whenever the confirmed-from-db state changes */
  onValidChange?: (valid: boolean) => void;
};

export function CardSearchInput({ value, onChange, onSelect, onValidChange }: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<CardResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [confirmed, setConfirmed] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function setValid(v: boolean) {
    setConfirmed(v);
    onValidChange?.(v);
  }

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cards/search-db?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data: CardResult[] = await res.json();
          setResults(data);
          setOpen(data.length > 0);
          setActiveIndex(-1);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(card: CardResult) {
    setQuery(card.displayName);
    onChange(card.displayName);
    onSelect?.(card.displayName);
    setValid(true);
    setOpen(false);
    setResults([]);
  }

  function handleChange(v: string) {
    setQuery(v);
    onChange(v);
    if (confirmed) setValid(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      select(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showHint = query.length > 0 && !confirmed && !loading && !open;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          placeholder="Search e.g. Charizard…"
          className={`w-full rounded-lg border bg-zinc-800 px-3 py-2 pr-8 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 ${
            confirmed
              ? "border-emerald-600 focus:border-emerald-500 focus:ring-emerald-500"
              : "border-zinc-700 focus:border-purple-500 focus:ring-purple-500"
          }`}
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
          {loading && (
            <div className="h-3 w-3 animate-spin rounded-full border border-zinc-600 border-t-purple-500" />
          )}
          {confirmed && !loading && (
            <span className="text-emerald-500">✓</span>
          )}
        </div>
      </div>

      {showHint && (
        <p className="mt-1 text-xs text-zinc-500">
          Select a card from the dropdown to continue
        </p>
      )}

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-zinc-700 bg-zinc-900 shadow-2xl">
          {results.map((card, i) => (
            <li
              key={card.id}
              onMouseDown={() => select(card)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm ${
                i === activeIndex ? "bg-purple-600/20" : "hover:bg-zinc-800"
              }`}
            >
              <span className="font-medium text-white">{card.name}</span>
              <span className="ml-3 shrink-0 text-xs text-zinc-500">
                {card.setName} · #{card.number}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
