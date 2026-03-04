import "./SubmissionsPage.css";
import { useState } from "react";
import { ReadOnlyEditor } from "./components/Editors";
import { formatDistance } from "date-fns";
import { getUserAtom } from "./atoms/user";
import { useAtomValue } from "jotai";
import { submissionsQueryOptions } from "./hooks/queryOptions";
import { useToastQuery } from "./hooks/toastHooks";
import SubmissionsPageFallback from "./components/fallbacks/SubmissionsPageFallback";
import Pagination from "@mui/material/Pagination";

function smoothScrollToTop() {
  const step = 10;
  const planksTime = 2.5;
  const intervalId = setInterval(() => {
    console.log("runn");
    const prevScrollY = window.scrollY;
    window.scrollTo(window.scrollX, window.scrollY + step);
    if (window.scrollY == prevScrollY) {
      console.log("hello interval cleared");
      clearInterval(intervalId);
      return;
    }
  }, planksTime);
}

function getVerdictDisplay(verdict) {
  const verdictMap = {
    AC: { text: "Accepted", className: "verdict-ac" },
    WA: { text: "Wrong Answer", className: "verdict-wa" },
    TLE: { text: "Time Limit Exceeded", className: "verdict-tle" },
    RTE: { text: "Runtime Error", className: "verdict-rte" },
  };

  return verdictMap[verdict] || { text: verdict, className: "verdict-unknown" };
}

export default function Submissions({ problemSlug }) {
  const user = useAtomValue(getUserAtom);
  const [view, setView] = useState(null);
  const [page, setPage] = useState(1);

  const submissionsQuery = useToastQuery(
    submissionsQueryOptions({
      username: user.username,
    })
  );

  if (submissionsQuery.isPending) {
    return <SubmissionsPageFallback />;
  }

  const submissions = submissionsQuery.data?.slice((page - 1) * 10, page * 10);
  return (
    <div className="submissions-page-wrapper">
      <div className="submissions-page">
        <h1 class="submissions-greeter">Your Submission History</h1>
        <div className="submissions-list">
          <div className="submission-item submission-head">
            <div className="submission-id">ID</div>
            <div className="verdict">Verdict</div>
            <div className="execTime">Exec. Time</div>
            <div className="submission-timestamp">Submitted on</div>
          </div>
          {submissions.length == 0 && (
            <div class="empty-submissions-indicator">No submissions to show</div>
          )}
          {submissions.map(submission => {
            const verdictInfo = getVerdictDisplay(submission.verdict);
            return (
              <div
                key={submission.id}
                className={`submission-item ${view?.id == submission.id ? "submission-item-active" : ""}`}
                onClick={() => {
                  setView(submission);
                  smoothScrollToTop();
                }}
              >
                <div className="submission-id">
                  <span className="num">#{submission.id}</span>
                </div>
                <div className={`verdict ${verdictInfo.className}`}>{verdictInfo.text}</div>
                <div className="execTime">{(+submission.exectime).toFixed(0) + " ms"}</div>
                <div className="submission-timestamp">
                  {formatDistance(new Date(submission.submitted_at), new Date(), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="submissions-pagination-menu">
          <Pagination
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            count={Math.ceil(submissionsQuery.data.length / 10)}
          />
        </div>
        <div className={`submitted-code ${!view ? "d-none" : ""}`}>
          <h2 className="submission-greeter">Submission #{view?.id}</h2>
          <ReadOnlyEditor content={view?.submitted_code} />
        </div>
      </div>
    </div>
  );
}
