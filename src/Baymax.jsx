// import { useEffect, useMemo, useRef, useState } from "react";

// /**
//  * Baymax-inspired eye-tracking.
//  * - Eyes stay fixed (black circles + connecting line)
//  * - White highlight inside each eye moves toward cursor (illusion of tracking)
//  *
//  * expression:
//  *  - "tensed": adds eyebrows + sweat drop + straight line
//  *  - "happy": blush cheeks + curved line
//  */
// export default function Baymax({ expression = "tensed" }) {
//   const wrapRef = useRef(null);
//   const rafRef = useRef(null);

//   const [shine, setShine] = useState({ x: 0, y: 0 }); // shared offset for highlights

//   const isCoarse = useMemo(() => {
//     if (typeof window === "undefined") return false;
//     return (
//       "ontouchstart" in window ||
//       navigator.maxTouchPoints > 0 ||
//       window.matchMedia?.("(pointer: coarse)")?.matches
//     );
//   }, []);

//   useEffect(() => {
//     if (isCoarse) return; // desktop-only per your request

//     const handleMove = (e) => {
//       if (!wrapRef.current) return;

//       // Use rAF so we don't set state 1000 times/sec
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);

//       rafRef.current = requestAnimationFrame(() => {
//         const rect = wrapRef.current.getBoundingClientRect();
//         const cx = rect.left + rect.width / 2;
//         const cy = rect.top + rect.height / 2;

//         const dx = e.clientX - cx;
//         const dy = e.clientY - cy;

//         // Normalize direction but keep magnitude capped (small subtle movement)
//         const max = 7; // px
//         const dist = Math.sqrt(dx * dx + dy * dy) || 1;

//         // Scale down a lot so it feels cute, not creepy
//         const scale = Math.min(max, dist / 35);

//         const ox = (dx / dist) * scale;
//         const oy = (dy / dist) * scale;

//         setShine({ x: ox, y: oy });
//       });
//     };

//     window.addEventListener("pointermove", handleMove, { passive: true });
//     return () => {
//       window.removeEventListener("pointermove", handleMove);
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     };
//   }, [isCoarse]);

//   // SVG geometry (viewBox units)
//   const eyeL = { x: 92, y: 90 };
//   const eyeR = { x: 168, y: 90 };

//   // Connect line: straight (tensed) vs slight smile curve (happy)
//   const linePath =
//     expression === "happy"
//       ? `M ${eyeL.x} ${eyeL.y} Q 130 ${eyeL.y + 10} ${eyeR.x} ${eyeR.y}`
//       : `M ${eyeL.x} ${eyeL.y} L ${eyeR.x} ${eyeR.y}`;

//   return (
//     <div
//       ref={wrapRef}
//       className={`baymaxWrap ${expression === "happy" ? "baymaxHappy" : "baymaxTensed"}`}
//       aria-hidden="true"
//     >
//       <svg className="baymaxSvg" viewBox="0 0 260 220" role="img">
//         {/* Soft body blob */}
//         <defs>
//           <radialGradient id="bmxGlow" cx="40%" cy="30%" r="70%">
//             <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
//             <stop offset="70%" stopColor="rgba(255,255,255,0.88)" />
//             <stop offset="100%" stopColor="rgba(255,255,255,0.82)" />
//           </radialGradient>
//         </defs>

//         <path
//           d="M60 160
//              C40 145, 36 122, 50 100
//              C64 78, 88 62, 130 62
//              C172 62, 196 78, 210 100
//              C224 122, 220 145, 200 160
//              C180 175, 162 182, 130 182
//              C98 182, 80 175, 60 160 Z"
//           fill="url(#bmxGlow)"
//           opacity="0.96"
//         />

//         {/* Head circle-ish */}
//         <ellipse cx="130" cy="92" rx="92" ry="72" fill="rgba(255,255,255,0.92)" />

//         {/* Eye connecting line */}
//         <path d={linePath} stroke="#111" strokeWidth="6.5" strokeLinecap="round" />

//         {/* Eyes */}
//         <circle cx={eyeL.x} cy={eyeL.y} r="14" fill="#111" />
//         <circle cx={eyeR.x} cy={eyeR.y} r="14" fill="#111" />

//         {/* Highlights (the "tracking") */}
//         <circle
//           cx={eyeL.x + shine.x}
//           cy={eyeL.y + shine.y}
//           r="4.1"
//           fill="rgba(255,255,255,0.92)"
//         />
//         <circle
//           cx={eyeR.x + shine.x}
//           cy={eyeR.y + shine.y}
//           r="4.1"
//           fill="rgba(255,255,255,0.92)"
//         />

//         {/* Tensed extras */}
//         {expression === "tensed" && (
//           <>
//             {/* eyebrows */}
//             <path
//               d="M78 74 L104 66"
//               stroke="#111"
//               strokeWidth="6"
//               strokeLinecap="round"
//               opacity="0.9"
//             />
//             <path
//               d="M182 74 L156 66"
//               stroke="#111"
//               strokeWidth="6"
//               strokeLinecap="round"
//               opacity="0.9"
//             />

//             {/* sweat drop */}
//             <path
//               className="baymaxSweat"
//               d="M205 68
//                  C214 80, 216 90, 209 97
//                  C202 104, 190 100, 191 90
//                  C192 82, 198 76, 205 68 Z"
//               fill="rgba(120,170,255,0.75)"
//             />
//           </>
//         )}

//         {/* Happy extras */}
//         {expression === "happy" && (
//           <>
//             <circle cx="78" cy="112" r="10" fill="rgba(255,120,160,0.25)" />
//             <circle cx="182" cy="112" r="10" fill="rgba(255,120,160,0.25)" />
//           </>
//         )}
//       </svg>
//     </div>
//   );
// }
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Baymax-inspired full body + eye tracking.
 * Desktop: eyes track pointer via moving highlight in each eye.
 * expression: "tensed" | "happy"
 */
export default function Baymax({ expression = "tensed" }) {
  const wrapRef = useRef(null);
  const rafRef = useRef(null);
  const [shine, setShine] = useState({ x: 0, y: 0 });

  const isCoarse = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia?.("(pointer: coarse)")?.matches
    );
  }, []);

  useEffect(() => {
    if (isCoarse) return;

    const handleMove = (e) => {
      if (!wrapRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = wrapRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height * 0.22; // look from face area

        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        const max = 7;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const scale = Math.min(max, dist / 35);

        setShine({
          x: (dx / dist) * scale,
          y: (dy / dist) * scale,
        });
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isCoarse]);

  // Face geometry (viewBox units)
  const eyeL = { x: 110, y: 72 };
  const eyeR = { x: 190, y: 72 };

  const linePath =
    expression === "happy"
      ? `M ${eyeL.x} ${eyeL.y} Q 150 ${eyeL.y + 10} ${eyeR.x} ${eyeR.y}`
      : `M ${eyeL.x} ${eyeL.y} L ${eyeR.x} ${eyeR.y}`;

  return (
    <div
      ref={wrapRef}
      className={`baymaxWrap ${expression === "happy" ? "baymaxHappy" : "baymaxTensed"}`}
      aria-hidden="true"
    >
      <svg className="baymaxSvg" viewBox="0 0 300 420" role="img">
        <defs>
          <radialGradient id="bmxBody" cx="42%" cy="18%" r="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.92)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.86)" />
          </radialGradient>

          <radialGradient id="bmxShade" cx="65%" cy="35%" r="65%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.10)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.0)" />
          </radialGradient>
        </defs>

        {/* Body */}
        <path
          d="
            M150 92
            C210 92, 250 145, 250 225
            C250 318, 208 378, 150 378
            C92 378, 50 318, 50 225
            C50 145, 90 92, 150 92
            Z"
          fill="url(#bmxBody)"
          opacity="0.98"
        />
        {/* Body subtle shading */}
        <ellipse cx="205" cy="210" rx="70" ry="120" fill="url(#bmxShade)" opacity="0.35" />

        {/* Chest dot (small circle) */}
        <circle cx="205" cy="185" r="10" fill="rgba(0,0,0,0.06)" />

        {/* Arms */}
        <path
          d="M58 176
             C35 210, 35 265, 58 305
             C75 336, 98 345, 112 330
             C124 318, 118 292, 106 268
             C90 236, 88 216, 100 185
             C112 156, 82 145, 58 176 Z"
          fill="rgba(255,255,255,0.90)"
        />
        <path
          d="M242 176
             C265 210, 265 265, 242 305
             C225 336, 202 345, 188 330
             C176 318, 182 292, 194 268
             C210 236, 212 216, 200 185
             C188 156, 218 145, 242 176 Z"
          fill="rgba(255,255,255,0.90)"
        />

        {/* Legs */}
        <path
          d="M110 330
             C95 345, 95 375, 112 392
             C128 409, 148 405, 150 388
             C152 365, 140 338, 110 330 Z"
          fill="rgba(255,255,255,0.88)"
        />
        <path
          d="M190 330
             C205 345, 205 375, 188 392
             C172 409, 152 405, 150 388
             C148 365, 160 338, 190 330 Z"
          fill="rgba(255,255,255,0.88)"
        />

        {/* Head */}
        <ellipse cx="150" cy="72" rx="92" ry="64" fill="rgba(255,255,255,0.95)" />

        {/* Eye connecting line */}
        <path d={linePath} stroke="#111" strokeWidth="7" strokeLinecap="round" />

        {/* Eyes */}
        <circle cx={eyeL.x} cy={eyeL.y} r="14" fill="#111" />
        <circle cx={eyeR.x} cy={eyeR.y} r="14" fill="#111" />

        {/* Tracking highlights */}
        <circle cx={eyeL.x + shine.x} cy={eyeL.y + shine.y} r="4.2" fill="rgba(255,255,255,0.92)" />
        <circle cx={eyeR.x + shine.x} cy={eyeR.y + shine.y} r="4.2" fill="rgba(255,255,255,0.92)" />

        {/* Expression add-ons */}
        {expression === "tensed" && (
          <>
            <path d="M92 52 L118 44" stroke="#111" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
            <path d="M208 52 L182 44" stroke="#111" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
            <path
              className="baymaxSweat"
              d="M240 44
                 C252 58, 254 72, 244 82
                 C234 92, 218 86, 220 70
                 C222 58, 231 52, 240 44 Z"
              fill="rgba(120,170,255,0.75)"
            />
          </>
        )}

        {expression === "happy" && (
          <>
            <circle cx="95" cy="96" r="12" fill="rgba(255,120,160,0.22)" />
            <circle cx="205" cy="96" r="12" fill="rgba(255,120,160,0.22)" />
          </>
        )}
      </svg>
    </div>
  );
}
