import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type AllowedMediaType = (typeof ALLOWED_TYPES)[number];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type as AllowedMediaType)) {
    return NextResponse.json(
      { error: "Unsupported image format. Use JPEG, PNG, GIF, or WebP." },
      { status: 400 }
    );
  }

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 128,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: file.type as AllowedMediaType,
              data: base64,
            },
          },
          {
            type: "text",
            text: 'This is a Pokémon card. Identify it and reply with ONLY the card name in this format: "Card Name (Set Name)" — for example: "Charizard (Base Set)" or "Pikachu (Jungle)". If you cannot identify the card, reply with exactly: "Unknown Card". No other text.',
          },
        ],
      },
    ],
  });

  const name =
    message.content[0].type === "text"
      ? message.content[0].text.trim()
      : "Unknown Card";

  return NextResponse.json({ name });
}
