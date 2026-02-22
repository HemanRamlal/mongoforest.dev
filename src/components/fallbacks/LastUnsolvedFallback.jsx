import "./LastUnsolvedFallback.css";

export default function LastUnsolvedFallback(){

  return (
    <div className="lastUnsolved lastUnsolved-fallback">
      <div className="heading">Last Unsolved</div>
      <div className="lastUnsolved-list">
        <div className="unsolved-item flash"></div>
        <div className="unsolved-item flash"></div>
        <div className="unsolved-item flash"></div>
        <div className="unsolved-item flash"></div>
      </div>
    </div>
  );
}