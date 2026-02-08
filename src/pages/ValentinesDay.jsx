import { useNavigate } from "react-router-dom";
import "./dayPages.css";

export default function ValentinesDay() {
  const navigate = useNavigate();
  return (
    <div className="dayPage">
      <div className="dayCardShell">
        <button className="backBtn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="dayHeader">Valentine's Day ❤️</h1>
        <p className="dayText">Coming soon…</p>
      </div>
    </div>
  );
}
