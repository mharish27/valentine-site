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
      setShownLines(lines.map(() => ""));
      setActiveLine(0);

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

export default function PromiseDay() {
  const navigate = useNavigate();

  const lines = useMemo(
    () => [
      "My promise is simple:",
      "to choose you, again and again, every single day.",
      "Happy Promise Day, Srija 💍",
      "Are you waiting for a picture?",
      "Sorry… the real gift is my lifetime subscription of love 😌",
    ],
    []
  );

  const { shownLines, activeLine } = useMultiLineTypewriter(lines, {
    charDelayMs: 60,
    linePauseMs: 2000,
  });

  return (
    <div className="dayPage">
      <div className="dayCardShell">
        <button className="backBtn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="dayHeader">Promise Day 💍</h1>

        <div className="quoteBox">
          <div className="quoteText">
            {shownLines.map((t, idx) => (
              <div key={idx} className="typedLine">
                {t}
                {idx === activeLine && <span className="cursor">▍</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
