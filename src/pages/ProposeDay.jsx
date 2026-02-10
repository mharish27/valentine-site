// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./dayPages.css";

// function useTypewriter(text, speedMs = 28, start = true) {
//   const [shown, setShown] = useState("");

//   useEffect(() => {
//     if (!start) return;
//     let i = 0;
//     setShown("");

//     const id = setInterval(() => {
//       i += 1;
//       setShown(text.slice(0, i));
//       if (i >= text.length) clearInterval(id);
//     }, speedMs);

//     return () => clearInterval(id);
//   }, [text, speedMs, start]);

//   const done = shown.length >= text.length;
//   return { shown, done };
// }

// export default function ProposeDay() {
//   const navigate = useNavigate();

//   const quote =
//     "“If Srija has 1000 fans, I am one of them. If she has 1 fan, I am one of them. And if she has no fans, that means I am dead.”";

//   const { shown, done } = useTypewriter(quote, 26, true);

//   // little heart rain (lightweight)
//   const hearts = useMemo(() => {
//     const count = 16;
//     return Array.from({ length: count }, (_, i) => ({
//       id: i,
//       left: Math.random() * 100,
//       delay: Math.random() * 2.5,
//       duration: 3.2 + Math.random() * 3.8,
//       size: 14 + Math.random() * 18,
//       drift: (Math.random() * 2 - 1) * 50,
//       emoji: Math.random() > 0.4 ? "💗" : "💞",
//     }));
//   }, []);

//   return (
//     <div className="dayPage">
//       <div className="dayCardShell proposeShell">
//         {/* floating hearts layer */}
//         <div className="floatLayer" aria-hidden="true">
//           {hearts.map((h) => (
//             <span
//               key={h.id}
//               className="floatHeart"
//               style={{
//                 left: `${h.left}%`,
//                 animationDelay: `${h.delay}s`,
//                 animationDuration: `${h.duration}s`,
//                 fontSize: `${h.size}px`,
//                 "--drift": `${h.drift}px`,
//               }}
//             >
//               {h.emoji}
//             </span>
//           ))}
//         </div>

//         <button className="backBtn" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <h1 className="dayHeader">Propose Day 💍</h1>

//         <div className="quoteBox">
//           <div className="quoteText">
//             {shown}
//             {!done && <span className="cursor">▍</span>}
//           </div>

//           <div className={`loveLine ${done ? "showLove" : ""}`}>
//             I love you, <span className="name">Srija</span>. ❤️
//           </div>
//         </div>

//         {/* Optional image block (add later) */}
//         <div className="dayImageWrap proposeImageWrap">
//           {/* Put an image in /public/propose-day.jpg later if you want */}
//           <img
//             className="dayImage"
//             src="/propose-day.jpg"
//             alt="Propose Day"
//             onError={(e) => {
//               // hide broken image icon if file isn't there yet
//               e.currentTarget.style.display = "none";
//             }}
//           />
//           <div className="imagePlaceholder">
//             I will look at you the same way every day. 😌
//           </div>
//         </div>

//         {/* <div className="tinyNote">
//           PS: This is me officially proposing… to be your forever fan. 😌💘
//         </div> */}
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dayPages.css";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function useMultiLineTypewriter(lines, opts) {
  const {
    charDelayMs = 60,
    linePauseMs = 2000, // <-- 2 second pause between lines
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

        // pause after each line
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

export default function ProposeDay() {
  const navigate = useNavigate();

  const lines = useMemo(
    () => [
      "If Srija has 1000 fans, I am one of them.",
      "If she has 1 fan, I am one of them.",
      "And if she has no fans… that means I am dead.",
    ],
    []
  );

  const { shownLines, activeLine, done } = useMultiLineTypewriter(lines, {
    charDelayMs: 60,
    linePauseMs: 2000, // <-- 2 sec between lines
  });

  const [showLove, setShowLove] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  // Show "I love you" after typing completes
  useEffect(() => {
    if (!done) return;
    setShowLove(true);

    // wait 2 seconds AFTER love line appears before image
    const t = setTimeout(() => {
      setShowMedia(true);
    }, 2000);

    return () => clearTimeout(t);
  }, [done]);

  /* hearts background unchanged */
  const hearts = useMemo(() => {
    const count = 16;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 3.2 + Math.random() * 3.8,
      size: 14 + Math.random() * 18,
      drift: (Math.random() * 2 - 1) * 50,
      emoji: Math.random() > 0.4 ? "💗" : "💞",
    }));
  }, []);

  return (
    <div className="dayPage">
      <div className="dayCardShell proposeShell">
        <div className="floatLayer" aria-hidden="true">
          {hearts.map((h) => (
            <span
              key={h.id}
              className="floatHeart"
              style={{
                left: `${h.left}%`,
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.duration}s`,
                fontSize: `${h.size}px`,
                "--drift": `${h.drift}px`,
              }}
            >
              {h.emoji}
            </span>
          ))}
        </div>

        <button className="backBtn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="dayHeader">Propose Day 💍</h1>

        <div className="quoteBox">
          <div className="quoteText">
            {shownLines.map((t, idx) => (
              <div key={idx} className="typedLine">
                {t}
                {idx === activeLine && !done && <span className="cursor">▍</span>}
              </div>
            ))}
          </div>

          {showLove && (
            <div className="loveLine showLove">
              I love you, <span className="name">Srija</span>. ❤️
            </div>
          )}
        </div>

        {showMedia && (
          <div className="dayImageWrap proposeImageWrap">
            <img
              className="dayImage"
              src="/propose-day.jpg"
              alt="Propose Day"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="imagePlaceholder">
               I will look at you the same way every day. 😌
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
