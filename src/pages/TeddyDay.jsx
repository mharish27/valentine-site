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

export default function TeddyDay() {
  const navigate = useNavigate();

  const lines = useMemo(
    () => [
      "Teddy is soft… but my love for you is softer.",
      "Happy Teddy Day, Srija 🧸",
    ],
    []
  );

  const { shownLines, activeLine, done } = useMultiLineTypewriter(lines, {
    charDelayMs: 60,
    linePauseMs: 2000,
  });

  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setShowMedia(true), 2000);
    return () => clearTimeout(t);
  }, [done]);

  // floating teddies + hearts
  const floaties = useMemo(() => {
    const pool = ["🧸", "💗", "💞"];
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 3.4 + Math.random() * 3.8,
      size: 14 + Math.random() * 18,
      drift: (Math.random() * 2 - 1) * 50,
      emoji: pool[Math.floor(Math.random() * pool.length)],
    }));
  }, []);

  return (
    <div className="dayPage">
      <div className="dayCardShell teddyShell">
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

        <h1 className="dayHeader">Teddy Day 🧸</h1>

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
          <div className="dayImageWrap">
            {/* Place your teddy image here */}
            <img
              className="dayImage"
              src="/teddy-day.jpg"
              alt="Teddy Day"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            {/* <div className="imagePlaceholder">
              Add your photo here: <span className="mono">public/teddy-day.jpg</span>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
