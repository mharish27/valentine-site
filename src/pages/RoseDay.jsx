import { useNavigate } from "react-router-dom";
import "./dayPages.css";

export default function RoseDay() {
  const navigate = useNavigate();

  return (
    <div className="dayPage">
      <div className="dayCardShell">
        <button className="backBtn" onClick={() => navigate(-1)}>← Back</button>

        <h1 className="dayHeader">Happy Rose Day Srija 🌹</h1>

        <p className="dayText">
          I can’t wait to start a life with you… and give you roses every day.
        </p>

        {/* Add your image file and update the src below */}
        <div className="dayImageWrap">
          <img
            className="dayImage"
            src="/rose-day.jpg"
            alt="Rose Day"
          />
        </div>
      </div>
    </div>
  );
}
