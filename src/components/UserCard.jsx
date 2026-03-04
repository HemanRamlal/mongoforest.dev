import "./UserCard.css";
import userAvatarDefault from "../assets/user-avatar-default.png";
import { getAvatarURL } from "../utils/blobUtils";
import { Link } from "react-router";
import UserCardFallback from "./fallbacks/UserCardFallback";
import _ from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import { userStatsQueryOptions } from "../hooks/queryOptions";
import { useToastQuery } from "../hooks/toastHooks";
import LinearProgress from "@mui/material/LinearProgress";
function getTier(percentile) {
  if (percentile >= 99) return "Sage";
  if (percentile >= 95) return "Master";
  if (percentile >= 80) return "Practitioner";
  if (percentile >= 50) return "Apprentice";
  if (percentile >= 20) return "Beginner";
  return "Newbie";
}
function getPercentage(n, d) {
  if (d == 0) return 0;

  return ((n / d) * 100).toFixed(1);
}
export default function UserCard({ username }) {
  const { data, error, isPending, isError, isFetching } = useToastQuery(
    userStatsQueryOptions({
      username,
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

  function Fill({ completed, total }) {
    const fill = Math.round(Math.max(getPercentage(completed, total), 2));
    console.log("we got fill of");
    console.log(fill);
    return (
      <div
        className="fill"
        style={{
          height: fill + "%",
        }}
      ></div>
    );
  }
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
        <div className="problem-stat-wrap">
          <div className="easy plate def-cur-ns-par">
            <div className="solved">{solvedStats.easy_solved}</div>
            <div className="total">{solvedStats.easy_total}</div>
            <div className="label">
              Easy {`(${getPercentage(solvedStats.easy_solved, solvedStats.easy_total)}%)`}
            </div>
          </div>
          <div className="problem-stat-visualize">
            <div className="vert-bar easy-bar">
              <Fill completed={solvedStats.easy_solved} total={solvedStats.easy_total}></Fill>
            </div>
          </div>
        </div>
        <div className="problem-stat-wrap">
          <div className="medium plate def-cur-ns-par">
            <div className="solved">{solvedStats.medium_solved}</div>
            <div className="total">{solvedStats.medium_total}</div>
            <div className="label">
              Med. {`(${getPercentage(solvedStats.medium_solved, solvedStats.medium_total)}%)`}
            </div>
          </div>
          <div className="problem-stat-visualize">
            <div className="vert-bar medium-bar">
              <Fill completed={solvedStats.medium_solved} total={solvedStats.medium_total}></Fill>
            </div>
          </div>
        </div>
        <div className="problem-stat-wrap">
          <div className="hard plate def-cur-ns-par">
            <div className="solved">{solvedStats.hard_solved}</div>
            <div className="total">{solvedStats.hard_total}</div>
            <div className="label">
              Hard {`(${getPercentage(solvedStats.hard_solved, solvedStats.hard_total)}%)`}
            </div>
          </div>
          <div className="problem-stat-visualize">
            <div className="vert-bar hard-bar">
              <Fill completed={solvedStats.hard_solved} total={solvedStats.hard_total}></Fill>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
