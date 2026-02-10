// const DAYS = [
//   { id: "rose", title: "ROSE", date: "FEB 7", day: "SAT", icon: "🌹" },
//   { id: "propose", title: "PROPOSE", date: "FEB 8", day: "SUN", icon: "💍" },
//   { id: "chocolate", title: "CHOCOLATE", date: "FEB 9", day: "MON", icon: "🍫" },
//   { id: "teddy", title: "TEDDY", date: "FEB 10", day: "TUE", icon: "🧸" },
//   { id: "promise", title: "PROMISE", date: "FEB 11", day: "WED", icon: "💞" },
//   { id: "hug", title: "HUG", date: "FEB 12", day: "THU", icon: "🤗" },
//   { id: "kiss", title: "KISS", date: "FEB 13", day: "FRI", icon: "💋" },
//   { id: "valentine", title: "VALENTINE'S", date: "FEB 14", day: "SAT", icon: "🔒" },
// ];

// export default function ValentineWeek({ onPickDay }) {
//   return (
//     <div className="weekWrap">
//       <div className="weekTitle">Valentine Week</div>

//       <div className="weekGrid">
//         {DAYS.map((d) => (
//           <button
//             key={d.id}
//             type="button"
//             className="dayCard"
//             onClick={() => onPickDay(d)}
//             aria-label={`${d.title} Day`}
//           >
//             <div className="dayLeft">
//               <div className="dayTitle">{d.title} DAY</div>
//               <div className="dayMeta">
//                 <div className="dayDate">{d.date}</div>
//                 <div className="dayDow">{d.day}</div>
//               </div>
//             </div>

//             <div className="dayIcon" aria-hidden="true">
//               {d.icon}
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
import { Link } from "react-router-dom";

const DAYS = [
  { id: "rose", title: "ROSE", date: "FEB 7", day: "SAT", icon: "🌹", to: "/days/rose", enabled: true },
  { id: "propose", title: "PROPOSE", date: "FEB 8", day: "SUN", icon: "💍", to: "/days/propose", enabled: true },
  { id: "chocolate", title: "CHOCOLATE", date: "FEB 9", day: "MON", icon: "🍫", enabled: false },
  { id: "teddy", title: "TEDDY", date: "FEB 10", day: "TUE", icon: "🧸", enabled: false },
  { id: "promise", title: "PROMISE", date: "FEB 11", day: "WED", icon: "💞", enabled: false },
  { id: "hug", title: "HUG", date: "FEB 12", day: "THU", icon: "🤗", enabled: false },
  { id: "kiss", title: "KISS", date: "FEB 13", day: "FRI", icon: "💋", enabled: false },
  { id: "valentines", title: "VALENTINE'S", date: "FEB 14", day: "SAT", icon: "🔒", enabled: false },
];

export default function ValentineWeek() {
  return (
    <div className="weekWrap">
      <div className="weekGrid">
        {DAYS.map((d) =>
          d.enabled ? (
            <Link key={d.id} to={d.to} className="dayCard linkCard" aria-label={`${d.title} Day`}>
              <div className="dayLeft">
                <div className="dayTitle">{d.title} DAY</div>
                <div className="dayMeta">
                  <div className="dayDate">{d.date}</div>
                  <div className="dayDow">{d.day}</div>
                </div>
              </div>
              <div className="dayIcon" aria-hidden="true">{d.icon}</div>
            </Link>
          ) : (
            <div
              key={d.id}
              className="dayCard disabledCard"
              data-tooltip="please wait for the surprise, madam"
              aria-label={`${d.title} Day (locked)`}
            >
              <div className="dayLeft">
                <div className="dayTitle">{d.title} DAY</div>
                <div className="dayMeta">
                  <div className="dayDate">{d.date}</div>
                  <div className="dayDow">{d.day}</div>
                </div>
              </div>
              <div className="dayIcon" aria-hidden="true">{d.icon}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
