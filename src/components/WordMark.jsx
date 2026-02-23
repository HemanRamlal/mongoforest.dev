import "./WordMark.css";
export default function WordMark({ className }) {
  return (
    <div className={`wordmark ${className || ""}`}>
      <div className="wordmark-mongo">mongo</div>
      <div className="wordmark-forest">Forest</div>
    </div>
  );
}
