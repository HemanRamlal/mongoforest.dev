import "./UserCard.css";
import userAvatarDefault from "../assets/user-avatar-default.png";
import { getAvatarURL } from "../utils/blobUtils";
import { pushToast } from "../components/Toasts/Toasts";
import { Link } from "react-router";
import UserCardFallback from "./fallbacks/UserCardFallback";
import _ from "lodash";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { userStatsQueryOptions } from "../hooks/queryOptions";
import LinearProgress from "@mui/material/LinearProgress";
function getTier(percentile) {
  if (percentile >= 99) return "Sage";
  if (percentile >= 95) return "Master";
  if (percentile >= 80) return "Practitioner";
  if (percentile >= 50) return "Apprentice";
  if (percentile >= 20) return "Beginner";
  return "Newbie";
}

export default function UserCard({ username }) {
  const { data, error, isPending, isError, isFetching } = useQuery(
    userStatsQueryOptions({
      username,
      pushToast,
    })
  );

  if (isPending) {
    return <UserCardFallback />;
  }

  const { avatarURL, solvedStats, globalRank, globalPercentile, firstName, lastName } = data;

  console.log("MEAT");
  console.log(avatarURL);
  console.log(solvedStats);
  console.log(globalRank);
  console.log(globalPercentile);

  return (
    <div className="user-card">
      {!isPending && isFetching && <LinearProgress />}
      <div className="header">
        <img
          className="user-avatar"
          src={avatarURL || userAvatarDefault}
          alt={`${username}'s avatar`}
        />
        <div className="basic-info">
          <div className="full-name">
            {firstName} {lastName}
          </div>
          <Link to={`/profile/${username}`} className="user-name">
            {username}
          </Link>
          <div className="user-tier">{getTier(globalPercentile)}</div>
        </div>

        <div className="banner">
          <div className="global-rank">#{globalRank}</div>
          <div className="global-percentile">Top {(100 - globalPercentile).toFixed(2)}%</div>
        </div>
      </div>
      <div className="problem-stats">
        <div className="easy">
          <div className="solved">{solvedStats.easy_solved}</div>
          <div className="total">{solvedStats.easy_total}</div>
          <div className="label">Easy</div>
        </div>
        <div className="medium">
          <div className="solved">{solvedStats.medium_solved}</div>
          <div className="total">{solvedStats.medium_total}</div>
          <div className="label">Med.</div>
        </div>
        <div className="hard">
          <div className="solved">{solvedStats.hard_solved}</div>
          <div className="total">{solvedStats.hard_total}</div>
          <div className="label">Hard</div>
        </div>
      </div>
    </div>
  );
}
