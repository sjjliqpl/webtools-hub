import { useState, useRef, useEffect } from "react";

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

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const handleClick = (id: number) => {
    if (locked || flipped.length >= 2 || cards[id].flipped || cards[id].matched) return;
    setCards(prev => prev.map(card => card.id === id ? { ...card, flipped: true } : card));
    if (flipped.length === 0) { setFlipped([id]); return; }
    const first = flipped[0];
    setMoves(value => value + 1);
    if (cards[first].emoji === cards[id].emoji) {
      setCards(prev => prev.map(card => card.id === first || card.id === id ? { ...card, matched: true } : card));
      setFlipped([]);
    } else {
      setFlipped([first,id]); setLocked(true);
      timer.current = setTimeout(() => {
        setCards(prev => prev.map(card => card.id === first || card.id === id ? { ...card, flipped: false } : card));
        setFlipped([]); setLocked(false);
      }, 850);
    }
  };

  const restart = () => {
    if (timer.current) clearTimeout(timer.current);
    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
  };

  return (
    <div className="tool-surface max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">

        <span className="text-sm text-slate-500">步数: {moves}</span>
      </div>

      {allMatched && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md text-center font-medium">
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
                  className="absolute inset-0 rounded-md flex items-center justify-center text-2xl bg-blue-500 text-white select-none"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  ❓
                </div>
                {/* Front */}
                <div
                  className={`absolute inset-0 rounded-md flex items-center justify-center text-2xl select-none ${
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
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        新游戏
      </button>
    </div>
  );
}
