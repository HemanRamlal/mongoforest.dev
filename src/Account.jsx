import "./Account.css";
import "./components/PlayerCard";
import "./components/LastSolved";
import "./components/PlayerStats";
import "./components/Heatmap";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import mockPlayer from "./mockdata/player";
export default function Account() {
  return (
    <div className="account-page">
      <div className="edit">
        <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
        Edit
      </div>
      <div className="sidebar">
        <PlayerCard player={mockPlayer} />
        <LastSolved data={lastSolvedData} />
      </div>
      <div className="main">
        <PlayerStats player={mockPlayer} />
        <Heatmap timeline={submissionsData} />
      </div>
    </div>
  );
}
