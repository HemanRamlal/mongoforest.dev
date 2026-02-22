import "./SubmissionPageFallback.css";
export default function SubmissionsPageFallback() {
  return <div className="submissions-page-wrapper submissions-page-fallback-wrapper">
    <div className="submissions-page">
      <h1 class="submissions-greeter">Your Submission History</h1>
      <div className="submissions-list">
        <div className="submission-item submission-head">
          <div className="submission-id">ID</div>
          <div className="verdict">Verdict</div>
          <div className="execTime">Exec. Time</div>
          <div className="submission-timestamp">Submitted on</div>
        </div>
        <div className="submission-item flash"></div>
        <div className="submission-item flash"></div>
        <div className="submission-item flash"></div>
        <div className="submission-item flash"></div>
        <div className="submission-item flash"></div>
        <div className="submission-item flash"></div>
        <div className="submission-item flash"></div>
      </div>
    </div>
  </div>
}