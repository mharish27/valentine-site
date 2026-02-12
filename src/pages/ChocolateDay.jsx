import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dayPages.css";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function useMultiLineTypewriter(lines, opts) {
  const {
    charDelayMs = 60,
    linePauseMs = 2000,
    startDelayMs = 250,
  } = opts || {};

  const [shownLines, setShownLines] = useState(() => lines.map(() => ""));
  const [activeLine, setActiveLine] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setDone(false);
      setActiveLine(0);
      setShownLines(lines.map(() => ""));

      await sleep(startDelayMs);
      if (cancelled) return;

      for (let li = 0; li < lines.length; li++) {
        setActiveLine(li);

        const full = lines[li];
        for (let i = 1; i <= full.length; i++) {
          if (cancelled) return;
          setShownLines((prev) => {
            const next = [...prev];
            next[li] = full.slice(0, i);
            return next;
          });
          await sleep(charDelayMs);
        }

        await sleep(linePauseMs);
        if (cancelled) return;
      }

      setDone(true);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [lines, charDelayMs, linePauseMs, startDelayMs]);

  return { shownLines, activeLine, done };
}

export default function ChocolateDay() {
  const navigate = useNavigate();

  const lines = useMemo(
    () => [
      "Chocolate melts… but my feelings for you don’t. 🍫❤️",
      "Happy Chocolate Day, Srija 🍫✨",
    ],
    []
  );

  const { shownLines, activeLine, done } = useMultiLineTypewriter(lines, {
    charDelayMs: 60,
    linePauseMs: 2000,
    startDelayMs: 250,
  });

  // show image AFTER typing is fully done + an extra 2s suspense
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setShowMedia(true), 2000);
    return () => clearTimeout(t);
  }, [done]);

  // Cute float background (chocolates + hearts)
  const floaties = useMemo(() => {
    const count = 18;
    const pool = ["🍫", "🍫", "🍫", "💗", "💞", "✨"];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 3.4 + Math.random() * 3.8,
      size: 14 + Math.random() * 18,
      drift: (Math.random() * 2 - 1) * 55,
      emoji: pool[Math.floor(Math.random() * pool.length)],
    }));
  }, []);

  return (
    <div className="dayPage">
      <div className="dayCardShell chocoShell">
        {/* floating layer */}
        <div className="floatLayer" aria-hidden="true">
          {floaties.map((f) => (
            <span
              key={f.id}
              className="floatHeart"
              style={{
                left: `${f.left}%`,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.duration}s`,
                fontSize: `${f.size}px`,
                "--drift": `${f.drift}px`,
              }}
            >
              {f.emoji}
            </span>
          ))}
        </div>

        <button className="backBtn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="dayHeader">Chocolate Day 🍫</h1>

        <div className="quoteBox">
          <div className="quoteText">
            {shownLines.map((t, idx) => (
              <div key={idx} className="typedLine">
                {t}
                {idx === activeLine && !done && <span className="cursor">▍</span>}
              </div>
            ))}
          </div>
        </div>

        {showMedia && (
          <div className="dayImageWrap chocoImageWrap">
            {/* Add your image to: public/chocolate-day.jpg */}
            <img
              className="dayImage"
              src="/chocolate-day.jpg"
              alt="Chocolate Day"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {/* <div className="imagePlaceholder">
              Add your photo here: <span className="mono">public/chocolate-day.jpg</span>
            </div> */}
          </div>
        )}

        {/* <div className="tinyNote">
          Today it’s chocolate… tomorrow it’s more reasons to smile. 🤎
        </div> */}
      </div>
    </div>
  );
}
