import "./LastUnsolved.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useNavigate } from "react-router";
import { getUserAtom } from "../atoms/user";
import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { lastUnsolvedQueryOptions } from "../hooks/queryOptions";
import LastUnsolvedFallback from "./fallbacks/LastUnsolvedFallback";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
function UnsolvedItem({ data }) {
  const navigate = useNavigate();
  function navigateToProblem() {
    navigate(`/practice/${data.slug}`);
  }
  return (
    <div className="unsolved" onClick={navigateToProblem}>
      <div className="unsolved-problem">
        <div className="unsolved-problem-id">{data.pid}.</div>
        <div className="unsolved-problem-name">{data.title}</div>
      </div>
      <div className="unsolved-since">{timeAgo.format(new Date(data.last_submission))}</div>
    </div>
  );
}

export default function LastUnsolved() {
  const user = useAtomValue(getUserAtom);
  const { data, error, isPending, isError } = useQuery(
    lastUnsolvedQueryOptions({ usernamem: user.username })
  );

  if (isPending) {
    return <LastUnsolvedFallback />;
  }

  const list = data;
  console.log("hello");
  console.log(list);

  return (
    <div className="lastUnsolved">
      <div className="heading">Last Unsolved</div>
      {list.length == 0 && (
        <div className="lastUnsolved-nolist">No Attempted Unsolved Problems</div>
      )}
      {list.length != 0 && (
        <div className="lastUnsolved-list">
          {list && list.map(item => <UnsolvedItem key={item.submissionId} data={item} />)}
        </div>
      )}
    </div>
  );
}
