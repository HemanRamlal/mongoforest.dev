import "./CommunityFallback.css";
export default function LeaderboardFallback({ limit }) {
  const ar = new Array(limit).fill(0);
  return (
    <>
      <div className="leaderboard-fallback">
        {ar.map(i => (
          <div className="rect-flash"></div>
        ))}
      </div>
    </>
  );
}
