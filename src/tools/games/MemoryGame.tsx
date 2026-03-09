import { useState, useCallback, useEffect } from "react";

const EMOJIS = ["🎨", "🎵", "🎮", "🎯", "🎪", "🎭", "🎸", "🎺"];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): Card[] {
  return shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const allMatched = cards.every((c) => c.matched);

  useEffect(() => {
    if (flipped.length === 2) {
      setLocked(true);
      const [a, b] = flipped;
      if (cards[a].emoji === cards[b].emoji) {
        setCards((prev) =>
          prev.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c))
        );
        setFlipped([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c))
          );
          setFlipped([]);
          setLocked(false);
        }, 1000);
      }
    }
  }, [flipped, cards]);

  const handleClick = useCallback(
    (id: number) => {
      if (locked || flipped.length >= 2) return;
      const card = cards[id];
      if (card.flipped || card.matched) return;

      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
      );
      setFlipped((prev) => [...prev, id]);
      setMoves((m) => m + 1);
    },
    [locked, flipped, cards]
  );

  const restart = () => {
    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">记忆翻牌</h2>
        <span className="text-sm text-slate-500">步数: {moves}</span>
      </div>

      {allMatched && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium">
          🎉 恭喜！你用了 {moves} 步完成了游戏！
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-4">
        {cards.map((card) => {
          const isUp = card.flipped || card.matched;
          return (
            <div
              key={card.id}
              className="aspect-square cursor-pointer"
              style={{ perspective: "600px" }}
              onClick={() => handleClick(card.id)}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isUp ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center text-2xl bg-indigo-500 text-white select-none"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  ❓
                </div>
                {/* Front */}
                <div
                  className={`absolute inset-0 rounded-xl flex items-center justify-center text-2xl select-none ${
                    card.matched ? "bg-green-100" : "bg-slate-100"
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {card.emoji}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={restart}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        新游戏
      </button>
    </div>
  );
}
