import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Baymax from "./Baymax";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function App() {
  const buttonAreaRef = useRef(null);
  const noBtnRef = useRef(null);

  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const isTouch = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia?.("(pointer: coarse)")?.matches
    );
  }, []);

  const roses = useMemo(() => {
    if (!accepted) return [];
    const count = 22;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      leftPct: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 2.8 + Math.random() * 2.8,
      size: 16 + Math.random() * 18,
      drift: (Math.random() * 2 - 1) * 40,
    }));
  }, [accepted]);

  useEffect(() => {
    const area = buttonAreaRef.current;
    const btn = noBtnRef.current;
    if (!area || !btn) return;

    const r = area.getBoundingClientRect();
    const b = btn.getBoundingClientRect();

    const pad = 10;
    const startX = clamp(Math.round(r.width * 0.58), pad, r.width - b.width - pad);
    const startY = clamp(Math.round(r.height * 0.55), pad, r.height - b.height - pad);

    setNoPos({ x: startX, y: startY });
  }, []);

  function moveNoButton() {
    const area = buttonAreaRef.current;
    const btn = noBtnRef.current;
    if (!area || !btn) return;

    const r = area.getBoundingClientRect();
    const b = btn.getBoundingClientRect();

    const pad = 10;
    const maxX = Math.max(pad, Math.floor(r.width - b.width - pad));
    const maxY = Math.max(pad, Math.floor(r.height - b.height - pad));

    let best = null;
    for (let i = 0; i < 14; i++) {
      const x = randInt(pad, maxX);
      const y = randInt(pad, maxY);
      const dx = x - noPos.x;
      const dy = y - noPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 120) {
        best = { x, y };
        break;
      }
      best = { x, y };
    }

    setNoPos(best);
  }

  function handleNoMouseEnter() {
    if (isTouch) return;
    moveNoButton();
  }

  function handleNoClick(e) {
    e.preventDefault();
    if (!isTouch) return;
    moveNoButton();
  }

  function handleYes() {
    setAccepted(true);
  }

  return (
    <div className="page">
      <div className="card">
        {!accepted ? (
          <div className="split">
            {/* LEFT: Baymax */}
            <div className="leftPane">
              <Baymax expression="tensed" />
            </div>

            {/* RIGHT: content */}
            <div className="rightPane">
              <div className="headline">Will you be my Valentine? 💘</div>
              <div className="sub">
                I promise snacks, bad jokes, and maximum emotional support.
              </div>

              <div className="buttonArea" ref={buttonAreaRef}>
                <button className="btn yes" onClick={handleYes}>
                  Yes 💖
                </button>

                <button
                  ref={noBtnRef}
                  className="btn no"
                  style={{ transform: `translate(${noPos.x}px, ${noPos.y}px)` }}
                  onMouseEnter={handleNoMouseEnter}
                  onClick={handleNoClick}
                  aria-label="No button"
                >
                  No 😤
                </button>
              </div>

              <div className="hint">
                {isTouch
                  ? "Tip: try tapping “No” 😈"
                  : "Tip: try hovering over “No” 😈"}
              </div>
            </div>
          </div>
        ) : (
          <div className="split">
            {/* Roses overlay only on success */}
            <div className="roseRain" aria-hidden="true">
              {roses.map((r) => (
                <span
                  key={r.id}
                  className="rose"
                  style={{
                    left: `${r.leftPct}%`,
                    animationDelay: `${r.delay}s`,
                    animationDuration: `${r.duration}s`,
                    fontSize: `${r.size}px`,
                    "--drift": `${r.drift}px`,
                  }}
                >
                  🌹
                </span>
              ))}
            </div>

            {/* LEFT: Baymax */}
            <div className="leftPane">
              <Baymax expression="happy" />
            </div>

            {/* RIGHT: content */}
            <div className="rightPane">
              <div className="headline">YAY!! 💞</div>
              <div className="sub">
                Thank you, sweetheart 🥰 <br />
                I’m the luckiest human alive. <br />
                Now come here—your Valentine demands a hug.
              </div>

              <div className="afterRow">
                <div className="heart">💗💗💗</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">Built with React. Make it yours ✨</footer>
    </div>
  );
}
