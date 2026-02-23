import "../UserCard.css";
import "./UserCardFallback.css";
export default function UserCardFallback() {
  return (
    <div className="user-card">
      <div className="header">
        <img className="user-avatar flasher" />
        <div className="basic-info">
          <div className="user-name flasher"></div>
          <div className="user-tier flasher"></div>
        </div>

        <div className="banner">
          <div className="global-rank flasher"></div>
          <div className="global-percentile flasher"></div>
        </div>
      </div>
      <div className="problem-stats">
        <div className="easy flasher"></div>
        <div className="medium flasher"></div>
        <div className="hard flasher"></div>
      </div>
    </div>
  );
}
