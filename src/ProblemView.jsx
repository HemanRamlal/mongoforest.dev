import "./ProblemView.css";
import { useToastQuery } from "./hooks/toastHooks";
import { useState, useEffect, useRef } from "react";
import { getUserAtom } from "./atoms/user";
import { useAtomValue } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { pushToast } from "./components/Toasts/Toasts";
import { problemSubmissionsQueryOptions } from "./hooks/queryOptions";
import api from "./api/axios";
import {
  faBoltLightning,
  faUpload,
  faQuestionCircle,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistance } from "date-fns";
import _, { head } from "lodash";
import { FullEditor, ReadOnlyEditor } from "./components/Editors";

function verdictFullForm(verdict) {
  const verdictFullFormMap = {
    AC: "Accepted",
    WA: "Wrong Answer",
    RTE: "RunTime Error",
    TLE: "TimeLimit Exceeded",
  };

  return verdictFullFormMap[verdict] ?? "Unknown";
}
function Statement({ statement, schema_data, schema_name, schema_description }) {
  const tooltip = `Database Schema in following format : 

{
  "collection1" : {
    "field" : DataType,
    "Arrayfield" : [DataType],
    ...
  },
  "collection2" : {},
  ...
}`;
  return (
    <div className="problem-statement">
      {statement ? (
        <div className="problem-statement-content">{statement}</div>
      ) : (
        <div className="problem-statement-content flasher problem-statement-content-skeleton"></div>
      )}
      {schema_data ? (
        <div class="schema-view" title={tooltip}>
          <div className="schema-name">
            Schema : {schema_name}
            <FontAwesomeIcon icon={faQuestionCircle} />
          </div>
          <div className="schema-description">{schema_description}</div>
          <div className="schema-data">
            <ReadOnlyEditor content={JSON.stringify(schema_data, null, 2)} />
          </div>
        </div>
      ) : (
        <div className="schema-view">
          <div className="schema-name flasher schema-name-skeleton"></div>
          <div className="schema-description flasher schema-description-skeleton"></div>
          <div className="schema-data flasher schema-data-skeleton"></div>
        </div>
      )}
    </div>
  );
}
function Samplecases({ testcases }) {
  function SamplecaseSkeleton() {
    return (
      <div className="testcase-container">
        <div className="testcase-label flasher testcase-label-skeleton"></div>
        <div className="testcase-view flasher testcase-view-skeleton"></div>
      </div>
    );
  }
  return (
    <div className="testcases-viewer">
      {testcases ? (
        testcases.map((testcase, idx) => (
          <div className="testcase-container" key={idx}>
            <div className="testcase-label">SampleCase #{idx + 1}:</div>
            <div className="testcase-view">
              <FullEditor content={JSON.stringify(testcase, null, 2)} />
            </div>
          </div>
        ))
      ) : (
        <>
          <SamplecaseSkeleton />
          <SamplecaseSkeleton />
          <SamplecaseSkeleton />
        </>
      )}
    </div>
  );
}
function Submissions({ problemSlug, isSubmitting }) {
  const [view, setView] = useState();
  const user = useAtomValue(getUserAtom);

  const submissionsQuery = useToastQuery(
    problemSubmissionsQueryOptions({
      username: user.username,
      problemSlug: problemSlug,
    })
  );

  const submissions = submissionsQuery.data;
  function smoothScrollToTop(container) {
    const step = 10;
    const planksTime = 2.5;
    const intervalId = setInterval(() => {
      const prevScrollY = container.scrollY;
      container.scrollTo(container.scrollX, container.scrollY + step);
      if (container.scrollY == prevScrollY) {
        clearInterval(intervalId);
        return;
      }
    }, planksTime);
  }

  function SubmissionItemSkeleton({ children }) {
    return <div className="submission-item submission-item-skeleton flasher">{children}</div>;
  }

  if (submissionsQuery.isPending) {
    return (
      <div className="submissions">
        <div className="submissions-list">
          <div className="submission-item submission-head">
            <div className="submission-id">ID</div>
            <div className="verdict">Verdict</div>
            <div className="execTime">Exec. Time</div>
            <div className="submission-timestamp">Submitted on</div>
          </div>
          <SubmissionItemSkeleton />
          <SubmissionItemSkeleton />
          <SubmissionItemSkeleton />
          <SubmissionItemSkeleton />
        </div>
      </div>
    );
  }
  return (
    submissions && (
      <div className="submissions">
        <div className={`submitted-code ${view ? "" : "d-none"}`}>
          <ReadOnlyEditor content={view?.submitted_code} />
        </div>
        <div className="submissions-list">
          <div className="submission-item submission-head">
            <div className="submission-id">ID</div>
            <div className="verdict">Verdict</div>
            <div className="execTime">Exec. Time</div>
            <div className="submission-timestamp">Submitted on</div>
          </div>
          {isSubmitting && <SubmissionItemSkeleton>Submitting...</SubmissionItemSkeleton>}
          {submissions.map(submission => (
            <div
              className={`submission-item interactive-ns ${view?.id == submission.id ? "submission-item-active" : ""}`}
              onClick={() => {
                setView(submission);
                smoothScrollToTop(document.querySelector(".submission-read"));
              }}
            >
              <div className="submission-id">
                <span class="num">#{submission.id}</span>
              </div>
              <div className={`verdict verdict-${submission.verdict.toLowerCase()}`}>
                {submission.verdict}
              </div>
              <div className="execTime">{(+submission.exectime).toFixed(0) + " ms"}</div>
              <div className="submission-timestamp">
                {formatDistance(new Date(submission.submitted_at), new Date(), {
                  addSuffix: true,
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
function Output({ runResult }) {
  /*
  All correct : submission passes all testcases
  Any wrong : submission fails x/X testcases
  */
  const failCount = runResult
    ? runResult.outputs.reduce((acc, output, idx) => {
        return acc + (runResult.verdicts[idx] == "AC" ? 0 : 1);
      }, 0)
    : null;

  const data = runResult
    ? runResult.outputs.reduce((acc, outputs, idx) => {
        const output = outputs.submissionOutput;
        acc += "O" + (idx + 1) + ":\n";
        acc += JSON.stringify(output, null, 2) + "\n";

        return acc;
      }, "")
    : null;
  return (
    <div className="outputs-viewer">
      {runResult && (
        <div className={`outputs-summary ${failCount == 0 ? "summary-green" : "summary-red"}`}>
          {failCount == 0
            ? "Passed all samplecases"
            : `Failed ${failCount}/${runResult.outputs.length} samplecases`}
        </div>
      )}
      {runResult &&
        runResult.outputs.map((output, idx) => (
          <div className="output-container" key={idx}>
            <div className="output-label">
              <div className="output-serial">Output #{idx + 1}</div>
              <div className="output-stats">
                <div className={`output-exectime`}>{runResult.execTimes[idx]} ms</div>
                <div
                  className={`output-verdict ${"verdict-" + runResult.verdicts[idx].toLowerCase()}`}
                  title={verdictFullForm(runResult.verdicts[idx])}
                >
                  {runResult.verdicts[idx]}
                </div>
              </div>
            </div>
            <div className="output-view">
              <ReadOnlyEditor
                content={JSON.stringify(runResult.outputs[idx].submissionOutput, null, 2)}
              />
            </div>
            <div className="output-label">
              <div className="output-serial">Expected Output #{idx + 1}</div>
            </div>
            <div className="output-view">
              <ReadOnlyEditor
                content={JSON.stringify(runResult.outputs[idx].solutionOutput, null, 2)}
              />
            </div>
          </div>
        ))}
      {runResult == null && "Run your code to see output"}
    </div>
  );
}
export default function ProblemView() {
  const { problemSlug } = useParams();
  const [readMode, setReadMode] = useState("statement");
  const possibleReadModes = ["statement", "samplecases", "output", "submissions"];
  const [writeMode, setWriteMode] = useState("editing"); //ENUM: editing | running | submitting
  const [problemInfo, setProblemInfo] = useState(); //pid, samplecases, schema_data, schema_name, statement, testcases
  const [userCode, setUserCode] = useState("");
  const [runResult, setRunResult] = useState(null);
  const queryClient = useQueryClient();
  const user = useAtomValue(getUserAtom);

  useEffect(() => {
    (async function () {
      try {
        const res = await api.get(`/problem/${problemSlug}`);
        setProblemInfo(res.data);
        return true;
      } catch (error) {
        if (error.response) {
          pushToast({
            code: error.response.status,
            ...error.response.data,
          });
        }
        return false;
      }
    })();
  }, []);

  async function runCode() {
    if (writeMode != "editing") return;
    setWriteMode("running");
    try {
      const res = await api.post(`/problem/${problemSlug}/run`, {
        submittedCode: userCode,
        testcases: problemInfo?.samplecases,
      });
      setRunResult(res.data);
      setReadMode("output");
      setWriteMode("editing");
      return true;
    } catch (error) {
      if (error.response) {
        pushToast({
          code: error.response.status,
          ...error.response.data,
        });
      }
      return false;
    }
  }
  async function submitCode() {
    if (writeMode != "editing") return;
    setWriteMode("submitting");
    setRunResult("");
    setReadMode("submissions");
    try {
      await api.post(`/problem/${problemSlug}/submit`, {
        submittedCode: userCode,
      });
      setWriteMode("editing");
      queryClient.invalidateQueries(
        problemSubmissionsQueryOptions({
          username: user.username,
          problemSlug: problemSlug,
        })
      );
      return true;
    } catch (error) {
      if (error.response) {
        pushToast({
          code: error.response.status,
          ...error.response.data,
        });
      }
      return false;
    }
  }

  return (
    <div className="problem-view">
      <div className="submission-read">
        {problemInfo ? (
          <div className="problem-head">
            <div className="problem-id">{problemInfo.pid}. </div>
            <div className="problem-title">{problemInfo.title}</div>
          </div>
        ) : (
          <div className="problem-head flasher problem-head-skeleton" />
        )}
        <div className="read-tabs">
          {possibleReadModes.map(selectedMode => (
            <div
              className={`nav-button ns ${readMode == selectedMode ? "active-tab" : "interactive-ns"}`}
              onClick={() => setReadMode(selectedMode)}
            >
              {_.startCase(selectedMode)}
            </div>
          ))}
        </div>
        <div className="read-display">
          {(readMode == "statement" && (
            <Statement
              statement={problemInfo?.statement}
              schema_name={problemInfo?.schema_name}
              schema_data={problemInfo?.schema_data}
              schema_description={problemInfo?.schema_description}
            />
          )) ||
            (readMode == "samplecases" && <Samplecases testcases={problemInfo?.samplecases} />) ||
            (readMode == "submissions" && (
              <Submissions problemSlug={problemSlug} isSubmitting={writeMode == "submitting"} />
            )) ||
            (readMode == "output" && <Output runResult={runResult || null} />)}
        </div>
      </div>
      <div className="submission-write">
        <div className="control-panel">
          <div
            className={`run-btn ${writeMode != "editing" ? "disabled-btn" : ""}`}
            onClick={runCode}
          >
            {writeMode != "running" ? "Run" : "Running"}
            <FontAwesomeIcon icon={writeMode != "running" ? faBoltLightning : faStopwatch} />
          </div>
          <div
            className={`submit-btn ${writeMode != "editing" ? "disabled-btn" : ""}`}
            onClick={submitCode}
          >
            {writeMode != "submitting" ? "Submit" : "Submitting"}
            <FontAwesomeIcon icon={writeMode != "submitting" ? faUpload : faStopwatch} />
          </div>
        </div>
        <div className="editor-container">
          {writeMode == "editing" && <FullEditor content={userCode} onChange={setUserCode} />}
          {writeMode != "editing" && <ReadOnlyEditor content={userCode} onChange={setUserCode} />}
        </div>
      </div>
    </div>
  );
}
