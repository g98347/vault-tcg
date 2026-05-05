import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type PokemonCard = {
  id: string;
  name: string;
  number: string;
  set: { name: string };
};

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const headers: Record<string, string> = {};
  if (process.env.POKEMON_TCG_API_KEY) {
    headers["X-Api-Key"] = process.env.POKEMON_TCG_API_KEY;
  }

  // Split into words and require each word to appear anywhere in the name
  const words = q.split(/\s+/).filter(Boolean);
  const nameQuery = words.map((w) => `name:*${w}*`).join(" ");
  const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(nameQuery)}&pageSize=24&select=id,name,set,number&orderBy=name`;

  const res = await fetch(url, { headers, next: { revalidate: 3600 } });
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 502 });
  }

  const data = await res.json();

  const cards = (data.data ?? []).map((card: PokemonCard) => ({
    id: card.id,
    name: card.name,
    setName: card.set?.name ?? "Unknown Set",
    number: card.number ?? "",
    displayName: `${card.name} (${card.set?.name ?? "Unknown Set"})`,
  }));

  return NextResponse.json(cards);
}
