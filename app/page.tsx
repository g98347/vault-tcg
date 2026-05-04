"use client";

import { useEffect, useState } from "react";
import { AddCardModal } from "./components/AddCardModal";

type Card = {
  id: number;
  user_id: string;
  name: string;
  condition: string;
  qty: number;
  cost: number;
  market: number;
  source: string;
  created_at: string;
};

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const pct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

const conditionColor: Record<string, string> = {
  "PSA 10": "text-emerald-400",
  "PSA 9": "text-emerald-400",
  NM: "text-sky-400",
  LP: "text-yellow-400",
  MP: "text-orange-400",
  HP: "text-red-400",
};

function sourceUrl(source: string, name: string, condition: string): string | null {
  const q = encodeURIComponent(name);
  switch (source) {
    case "eBay":
      return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${name} ${condition}`)}&LH_Sold=1&LH_Complete=1`;
    case "TCGPlayer":
      return `https://www.tcgplayer.com/search/pokemon/product?q=${q}&view=grid`;
    case "PWCC":
      return `https://www.pwccmarketplace.com/search?query=${q}`;
    default:
      return null;
  }
}

export default function Home() {
  const [inventory, setInventory] = useState<Card[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchCards() {
    try {
      const res = await fetch("/api/cards");
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCards();
  }, []);

  const totalValue = inventory.reduce((s, c) => s + c.market * c.qty, 0);
  const costBasis = inventory.reduce((s, c) => s + c.cost * c.qty, 0);
  const unrealizedPnl = totalValue - costBasis;
  const unrealizedPct = costBasis > 0 ? (unrealizedPnl / costBasis) * 100 : 0;

  const metrics = [
    {
      label: "Total Value",
      value: usd(totalValue),
      sub: `${inventory.reduce((s, c) => s + c.qty, 0)} cards`,
      accent: false,
    },
    {
      label: "Cost Basis",
      value: usd(costBasis),
      sub: "avg cost per card",
      accent: false,
    },
    {
      label: "Unrealized P&L",
      value: usd(unrealizedPnl),
      sub: pct(unrealizedPct),
      accent: true,
      positive: unrealizedPnl >= 0,
    },
    {
      label: "Active Listings",
      value: "0",
      sub: "on marketplace",
      accent: false,
    },
  ];

  return (
    <div className="flex-1 bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Inventory
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Track your collection value and performance
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            + Add Card
          </button>
        </div>

        {/* Metrics row */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-purple-400">
                {m.label}
              </p>
              <p
                className={`text-2xl font-bold tabular-nums ${
                  m.accent
                    ? m.positive
                      ? "text-emerald-400"
                      : "text-red-400"
                    : "text-white"
                }`}
              >
                {m.accent && m.positive ? "+" : ""}
                {m.value}
              </p>
              <p
                className={`mt-1 text-xs tabular-nums ${
                  m.accent
                    ? m.positive
                      ? "text-emerald-500"
                      : "text-red-500"
                    : "text-zinc-500"
                }`}
              >
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Inventory table */}
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">All Cards</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/40">
                  {[
                    "Card",
                    "Condition",
                    "Qty",
                    "Cost",
                    "Market Value",
                    "P&L",
                    "Source",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-zinc-500"
                    >
                      Loading...
                    </td>
                  </tr>
                )}
                {!loading && inventory.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-zinc-500"
                    >
                      No cards in inventory. Click{" "}
                      <span className="text-purple-400">+ Add Card</span> to
                      get started.
                    </td>
                  </tr>
                )}
                {inventory.map((card) => {
                  const pnlAbs = (card.market - card.cost) * card.qty;
                  const pnlPercent =
                    card.cost > 0
                      ? ((card.market - card.cost) / card.cost) * 100
                      : 0;
                  const positive = pnlAbs >= 0;

                  return (
                    <tr
                      key={card.id}
                      className="transition-colors hover:bg-zinc-800/40"
                    >
                      <td className="px-5 py-4 font-medium text-white">
                        {card.name}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`font-medium ${conditionColor[card.condition] ?? "text-zinc-400"}`}
                        >
                          {card.condition}
                        </span>
                      </td>
                      <td className="px-5 py-4 tabular-nums text-zinc-300">
                        {card.qty}
                      </td>
                      <td className="px-5 py-4 tabular-nums text-zinc-300">
                        {usd(card.cost)}
                      </td>
                      <td className="px-5 py-4 tabular-nums font-medium text-white">
                        {usd(card.market)}
                      </td>
                      <td className="px-5 py-4 tabular-nums">
                        <div
                          className={`font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {positive ? "+" : ""}
                          {usd(pnlAbs)}
                        </div>
                        <div
                          className={`text-xs ${positive ? "text-emerald-600" : "text-red-600"}`}
                        >
                          {pct(pnlPercent)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {(() => {
                          const url = sourceUrl(
                            card.source,
                            card.name,
                            card.condition
                          );
                          return url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-purple-400 transition-colors hover:bg-zinc-700 hover:text-purple-300"
                            >
                              {card.source} ↗
                            </a>
                          ) : (
                            <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
                              {card.source}
                            </span>
                          );
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-zinc-700 bg-zinc-800/30">
                  <td
                    colSpan={3}
                    className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-400"
                  >
                    Totals
                  </td>
                  <td className="px-5 py-3 tabular-nums text-sm font-semibold text-white">
                    {usd(costBasis)}
                  </td>
                  <td className="px-5 py-3 tabular-nums text-sm font-semibold text-white">
                    {usd(totalValue)}
                  </td>
                  <td className="px-5 py-3 tabular-nums">
                    <div
                      className={`text-sm font-semibold ${unrealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {unrealizedPnl >= 0 ? "+" : ""}
                      {usd(unrealizedPnl)}
                    </div>
                    <div
                      className={`text-xs ${unrealizedPnl >= 0 ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {pct(unrealizedPct)}
                    </div>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>

      {modalOpen && (
        <AddCardModal
          onClose={() => setModalOpen(false)}
          onAdded={fetchCards}
        />
      )}
    </div>
  );
}
