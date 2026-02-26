import "../CommunitiesList.css";
import "./CommunitiesListFallback.css";
function LeaderboardItem() {
  return (
    <div class="community-item community-item-fallback">
      <div className="community-item-fallback-loader"></div>
    </div>
  );
}

export default function CommunitiesListFallback() {
  return (
    <>
      <LeaderboardItem key={1} />
      <LeaderboardItem key={2} />
      <LeaderboardItem key={3} />
    </>
  );
}
