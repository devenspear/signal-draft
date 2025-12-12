import { kv } from "@vercel/kv";
import { CardDeck, CardType } from "./types";

// Key for master card deck
const MASTER_DECK_KEY = "cards:master";

// Type for card without runtime fields
type DeckCard = {
  id: string;
  type: CardType;
  title: string;
  description?: string;
  tags?: string[];
  // Type-specific fields
  timeHorizon?: string;
  category?: string;
  persona?: string;
  painLevelHint?: number;
  techCategory?: string;
  ownerPlayerName?: string;
};

// Get master card deck from KV
export async function getMasterCardDeck(): Promise<CardDeck | null> {
  const data = await kv.get<string>(MASTER_DECK_KEY);

  if (!data) {
    return null;
  }

  // Handle both string and object responses from KV
  if (typeof data === "string") {
    return JSON.parse(data) as CardDeck;
  }

  return data as unknown as CardDeck;
}

// Save master card deck to KV
export async function saveMasterCardDeck(deck: CardDeck): Promise<void> {
  await kv.set(MASTER_DECK_KEY, JSON.stringify(deck));
}

// Get the array key for a card type
function getTypeKey(type: CardType): keyof CardDeck {
  const map: Record<CardType, keyof CardDeck> = {
    trend: "trends",
    problem: "problems",
    tech: "tech",
    asset: "assets",
    market: "markets",
  };
  return map[type];
}

// Get empty deck structure
function getEmptyDeck(): CardDeck {
  return {
    trends: [],
    problems: [],
    tech: [],
    assets: [],
    markets: [],
  };
}

// Add a card to the deck
export async function addCardToDeck(
  card: DeckCard,
  cardType: CardType
): Promise<CardDeck> {
  const deck = (await getMasterCardDeck()) || getEmptyDeck();
  const typeKey = getTypeKey(cardType);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (deck[typeKey] as any[]).push(card);

  await saveMasterCardDeck(deck);
  return deck;
}

// Update a card in the deck
export async function updateCardInDeck(
  cardId: string,
  cardType: CardType,
  updates: Partial<DeckCard>
): Promise<CardDeck> {
  const deck = await getMasterCardDeck();
  if (!deck) throw new Error("Master deck not found");

  const typeKey = getTypeKey(cardType);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (deck[typeKey] as any[]) = (deck[typeKey] as any[]).map((c) =>
    c.id === cardId ? { ...c, ...updates } : c
  );

  await saveMasterCardDeck(deck);
  return deck;
}

// Delete a card from the deck
export async function deleteCardFromDeck(
  cardId: string,
  cardType: CardType
): Promise<CardDeck> {
  const deck = await getMasterCardDeck();
  if (!deck) throw new Error("Master deck not found");

  const typeKey = getTypeKey(cardType);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (deck[typeKey] as any[]) = (deck[typeKey] as any[]).filter(
    (c) => c.id !== cardId
  );

  await saveMasterCardDeck(deck);
  return deck;
}

// Check if master deck exists
export async function masterDeckExists(): Promise<boolean> {
  const exists = await kv.exists(MASTER_DECK_KEY);
  return exists === 1;
}
