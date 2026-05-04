import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name")?.trim();
  const condition = searchParams.get("condition")?.trim();
  const source = searchParams.get("source")?.trim();

  if (!name || !condition || !source) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const sourceContext: Record<string, string> = {
    eBay: "eBay recent sold listings",
    TCGPlayer: "TCGPlayer market price",
    PWCC: "PWCC Marketplace recent auction results",
  };

  const context = sourceContext[source] ?? "current market listings";

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Search for the current market price of the Pokémon card "${name}" in ${condition} condition using ${context}. Return ONLY a single number in USD (e.g. 45.00). No dollar sign, no text, just the number. If you cannot find a price, return 0.`,
    },
  ];

  let response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 64,
    tools: [{ type: "web_search_20260209", name: "web_search" }],
    messages,
  });

  while (response.stop_reason === "pause_turn") {
    messages.push({ role: "assistant", content: response.content });
    response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 64,
      tools: [{ type: "web_search_20260209", name: "web_search" }],
      messages,
    });
  }

  const textBlock = response.content.find((b) => b.type === "text");
  const raw = textBlock?.type === "text" ? textBlock.text.trim() : "0";
  const price = parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;

  return NextResponse.json({ price });
}
