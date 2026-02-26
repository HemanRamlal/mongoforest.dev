import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import "./ProblemSet.css";
import ProblemSetFallback from "./fallbacks/ProblemSetFallback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircle,
  faSort,
  faFilter,
  faBookmark,
  faDice,
  faMagnifyingGlass,
  faAngleLeft,
  faAnglesLeft,
  faAngleRight,
  faAnglesRight,
  faArrowDown19,
  faArrowDown91,
  faArrowDownAZ,
  faArrowDownZA,
  faArrowTrendUp,
  faArrowTrendDown,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { screenWidthAtom } from "../atoms/screenWidth";
import { problemsetQueryOptions } from "../hooks/queryOptions";
import { useToastQuery } from "../hooks/toastHooks";
import { useAtomValue } from "jotai";
import useScreenWidth from "../hooks/useScreenWidth";

function compareDifficulty(A, B) {
  const a = A.difficulty;
  const b = B.difficulty;
  if (a == b) return 0;
  if (a == "easy") return -1;
  if (a == "hard") return 1;
  if (a == "medium") {
    if (b == "easy") return 1;
    if (b == "hard") return -1;
  }
  throw new Error(`Invalid difficulty value : ${a} and ${b}`);
}
function compareId(A, B) {
  return A.id.localeCompare(B.id);
}
function compareTitle(A, B) {
  return A.title.localeCompare(B.title);
}
function compareAccuracy(A, B) {
  return A.accuracy - B.accuracy;
}
function selectSortingMethod(status, forAsc, forDsc) {
  if (status == "nosort") return (A, B) => 1;
  else if (status == "asc") return forAsc;
  else if (status == "dsc") return forDsc;
  throw new Error("Invalid sort value " + status);
}
function sortProblems(problems, sort) {
  const selectedCompareId = selectSortingMethod(sort.id, compareId, (A, B) => -compareId(A, B));
  const selectedCompareTitle = selectSortingMethod(
    sort.title,
    compareTitle,
    (A, B) => -compareTitle(A, B)
  );
  const selectedCompareAccuracy = selectSortingMethod(
    sort.accuracy,
    compareAccuracy,
    (A, B) => -compareAccuracy(A, B)
  );
  const selectedCompareDifficulty = selectSortingMethod(
    sort.difficulty,
    compareDifficulty,
    (A, B) => -compareDifficulty(A, B)
  );

  problems.sort(selectedCompareId);
  problems.sort(selectedCompareTitle);
  problems.sort(selectedCompareAccuracy);
  problems.sort(selectedCompareDifficulty);
}
function sieve(problem, filter) {
  filter.title = filter.title.replaceAll(/\s+/g, " ");

  const regex = new RegExp(filter.title, "gi");
  return (
    filter.status[problem.status] &&
    filter.accuracy.min <= +problem.accuracy &&
    filter.accuracy.max >= +problem.accuracy &&
    filter.difficulty[problem.difficulty] &&
    (regex.test(problem.title) || regex.test(problem.id))
  );
}
function ProblemsetMenuOverlay({ setOpenMenu }) {
  return <div className="problemset-menu-overlay" onClick={() => setOpenMenu("none")}></div>;
}
export default function ProblemSet() {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(25);
  const [pattern, setPattern] = useState("");
  const [openMenu, setOpenMenu] = useState("none");
  const navigate = useNavigate();

  const [sort, setSort] = useState({
    id: "asc",
    title: "nosort",
    accuracy: "nosort",
    difficulty: "nosort",
  });

  const [filter, setFilter] = useState({
    status: {
      notAttempted: true,
      attempted: true,
      solved: true,
    },
    difficulty: {
      easy: true,
      medium: true,
      hard: true,
    },
    accuracy: {
      min: 0,
      max: 100,
    },
    title: "",
  });

  const problemsetQuery = useToastQuery(problemsetQueryOptions());
  const problems = problemsetQuery.data;

  if (!problems || problems.length == 0)
    return (
      <>
        <h1 class="problemset-greeter">Problemset</h1>
        <ProblemSetFallback />
      </>
    );

  if (offset % limit != 0) {
    setOffset(Math.floor(offset / limit) * limit);
  }

  const filteredProblems = problems.filter(
    problem =>
      (problem.title.toLowerCase().includes(pattern.toLowerCase()) ||
        problem.id.toString().includes(pattern.toLowerCase())) &&
      sieve(problem, filter)
  );

  sortProblems(filteredProblems, sort);
  const currentPage = offset / limit + 1;
  const totalPages = Math.ceil(filteredProblems.length / limit);

  const viewedProblems = filteredProblems.slice(offset, offset + limit);

  function changePattern(e) {
    setPattern(e.target.value);
  }
  function toggleSort(key) {
    if (sort[key] == "nosort") {
      sort[key] = "asc";
    } else if (sort[key] == "asc") {
      sort[key] = "dsc";
    } else {
      if (key == "id") sort[key] = "asc";
      else sort[key] = "nosort";
    }
    setSort({
      ...sort,
    });
  }
  function pickRandomProblem() {
    const idx = Math.floor(Math.random() * filteredProblems.length);
    console.log(filteredProblems[idx]);

    navigate("/practice/" + filteredProblems[idx].slug);
  }
  function onCurrentPageChange(e) {
    let input = +e.target.value;

    if (isNaN(input)) return;
    if (input <= 0 || input > totalPages) {
      e.target.style.borderColor = "red";
      setTimeout(() => {
        e.target.style.borderColor = "var(--primary-color-sw)";
      }, 1000);
      e.target.blur();
      return;
    }
    input -= 1;
    setOffset(input * limit);
  }

  function onPageSizeChange(e) {
    let input = +e.target.value;

    if (isNaN(input) || input == 0) return;
    setLimit(input);
  }
  function previousPage() {
    setOffset(currentPage == 1 ? 0 : limit * (currentPage - 2));
  }
  function nextPage() {
    setOffset(currentPage == totalPages ? limit * (totalPages - 1) : limit * currentPage);
  }
  function clearField(e) {
    e.target.value = "";
  }
  return (
    <>
      <h1 class="problemset-greeter">Problemset</h1>
      <div className="problemset">
        <div className="problemset-control">
          <div className="problemset-left">
            <div className="problemset-search">
              <input
                type="text"
                placeholder="Search ID or Title"
                value={pattern}
                onChange={changePattern}
              />
              <div className="problemset-search-icon">
                <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
              </div>
            </div>
            <SortMenu
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              sort={sort}
              toggleSort={toggleSort}
            />
            <FilterMenu
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              filter={filter}
              setFilter={setFilter}
            />
          </div>
          <div className="problemset-right">
            <div
              className="problemset-control-btn problemset-pick-random"
              title="Pick random problem"
              onClick={pickRandomProblem}
            >
              <FontAwesomeIcon icon={faDice}></FontAwesomeIcon>
            </div>
          </div>
        </div>
        <div className="problemset-list">
          {viewedProblems.map(problem => (
            <ProblemItem key={problem.id} problem={problem} />
          ))}
        </div>
        <div className="problemset-pagination">
          <div className="pagination-status">
            Showing {(offset + 1).toString().padStart(4, " ")} -
            {Math.min(offset + limit, filteredProblems.length)
              .toString()
              .padStart(4, " ")}{" "}
            from {filteredProblems.length.toString().padStart(4, " ")}
          </div>
          <div className="pagination-controls">
            <FontAwesomeIcon
              onClick={() => {
                setOffset(0);
              }}
              icon={faAnglesLeft}
            ></FontAwesomeIcon>
            <FontAwesomeIcon onClick={previousPage} icon={faAngleLeft}></FontAwesomeIcon>
            <div className="pagination-current">
              <input
                inputMode="numeric"
                placeholder={currentPage}
                onChange={onCurrentPageChange}
                onBlur={clearField}
              />
              of {totalPages}
            </div>
            <FontAwesomeIcon onClick={nextPage} icon={faAngleRight}></FontAwesomeIcon>
            <FontAwesomeIcon
              onClick={() => {
                setOffset(limit * (totalPages - 1));
              }}
              icon={faAnglesRight}
            ></FontAwesomeIcon>
          </div>
          <div className="pagination-size">
            Rows per page :{" "}
            <input
              inputMode="numeric"
              placeholder={limit}
              onChange={onPageSizeChange}
              onBlur={clearField}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function SortIcon({ status, type }) {
  let icon;
  if (status == "nosort") {
    icon = faSort;
  } else if (status == "asc") {
    if (type == "number") {
      icon = faArrowDown19;
    } else if (type == "enum") {
      icon = faArrowTrendUp;
    } else {
      icon = faArrowDownAZ;
    }
  } else {
    if (type == "number") {
      icon = faArrowDown91;
    } else if (type == "enum") {
      icon = faArrowTrendDown;
    } else {
      icon = faArrowDownZA;
    }
  }
  return <FontAwesomeIcon icon={icon} />;
}
function SortMenu({ openMenu, setOpenMenu, sort, toggleSort, className }) {
  function toggleOpen() {
    setOpenMenu(openMenu != "sort" ? "sort" : "none");
  }
  return (
    <>
      {openMenu == "sort" && <ProblemsetMenuOverlay setOpenMenu={setOpenMenu} />}
      <div className={`problemset-menu sort-menu ${openMenu == "sort" ? "antioverlay" : ""}`}>
        <div
          className="problemset-control-btn problemset-sort"
          onClick={toggleOpen}
          title="Sort Options"
        >
          <FontAwesomeIcon icon={faSort}></FontAwesomeIcon>
        </div>
        <motion.div
          className={`menu-items`}
          initial={{
            height: 0,
            margin: 0,
            padding: 0,
            border: "none",
            boxShadow: "none",
          }}
          style={{
            originY: "top",
            overflow: "hidden",
          }}
          animate={
            openMenu == "sort"
              ? {
                  height: "auto",
                  boxShadow: "var(--shadow-elevated)",
                  border: "1px solid var(--primary-color-fill)",
                }
              : {
                  height: 0,
                  margin: 0,
                  padding: 0,
                  border: "none",
                  boxShadow: "none",
                }
          }
          transition={{
            duration: 0.2,
            originY: "top",
          }}
        >
          <div
            className={`menu-item`}
            onClick={() => {
              toggleSort("id");
            }}
          >
            Problem Id
            <SortIcon status={sort.id} type="number" />
          </div>
          <div
            className={`menu-item`}
            onClick={() => {
              toggleSort("title");
            }}
          >
            Problem Title
            <SortIcon status={sort.title} type="string" />
          </div>
          <div
            className="menu-item"
            onClick={() => {
              toggleSort("accuracy");
            }}
          >
            Accuracy
            <SortIcon status={sort.accuracy} type="number" />
          </div>
          <div
            className="menu-item"
            onClick={() => {
              toggleSort("difficulty");
            }}
          >
            Difficulty
            <SortIcon status={sort.difficulty} type="enum" />
          </div>
        </motion.div>
      </div>
    </>
  );
}
function FilterMenu({ openMenu, setOpenMenu, filter, setFilter }) {
  const [currentFilter, setCurrentFilter] = useState(filter);
  console.log(currentFilter.title);
  function toggleOpen() {
    setOpenMenu(openMenu != "filter" ? "filter" : "none");
  }
  function toggleOption(obj, key) {
    obj[key] = !obj[key];
    setCurrentFilter({ ...currentFilter });
  }
  function applyFilter() {
    setFilter({
      ...currentFilter,
    });
  }
  function adjustRange([min, max]) {
    setCurrentFilter({
      ...currentFilter,
      accuracy: {
        min,
        max,
      },
    });
  }
  return (
    <>
      {openMenu == "filter" && <ProblemsetMenuOverlay setOpenMenu={setOpenMenu} />}
      <div className={`problemset-menu filter-menu ${openMenu == "filter" ? "antioverlay" : ""}`}>
        <div
          className="problemset-control-btn problemset-filter"
          title="Filter Options"
          onClick={toggleOpen}
        >
          <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
        </div>
        <div className="menu-overlay">
          <motion.div
            className={`menu-items filter-menu`}
            initial={{
              height: 0,
              margin: 0,
              padding: 0,
              border: "none",
              boxShadow: "none",
            }}
            style={{
              originY: "top",
            }}
            animate={
              openMenu == "filter"
                ? {
                    height: "auto",
                    padding: "0px",
                    boxShadow: "var(--shadow-elevated)",
                    border: "1px solid var(--primary-color-fill)",
                  }
                : {
                    height: 0,
                    padding: 0,
                    margin: 0,
                    border: "none",
                    boxShadow: "none",
                  }
            }
            transition={{
              duration: 0.2,
              originY: "top",
            }}
          >
            <div className="menu-item">
              <div
                style={{
                  marginTop: "12.5px",
                }}
              >
                Status :
              </div>
              <div className="flat-radio">
                <div
                  className={`flat-radio-item ${currentFilter.status.notAttempted ? "flat-radio-item-active" : ""}`}
                  onClick={() => toggleOption(currentFilter.status, "notAttempted")}
                >
                  <div className="tag">Not Attempted</div>
                </div>
                <div
                  className={`flat-radio-item ${currentFilter.status.attempted ? "flat-radio-item-active" : ""}`}
                  onClick={() => toggleOption(currentFilter.status, "attempted")}
                >
                  <FontAwesomeIcon icon={faCircle}></FontAwesomeIcon>
                  <div className="tag">Attempted</div>
                </div>
                <div
                  className={`flat-radio-item ${currentFilter.status.solved ? "flat-radio-item-active" : ""}`}
                  onClick={() => toggleOption(currentFilter.status, "solved")}
                >
                  <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                  <div className="tag">Solved</div>
                </div>
              </div>
            </div>
            <div className="menu-item">
              <div
                style={{
                  marginTop: "2.5px",
                }}
              >
                Difficulty :
              </div>
              <div className="flat-radio">
                <div
                  className={`flat-radio-item ${currentFilter.difficulty.easy ? "flat-radio-item-active" : ""}`}
                  onClick={() => toggleOption(currentFilter.difficulty, "easy")}
                >
                  <div className="tag">Easy</div>
                </div>
                <div
                  className={`flat-radio-item ${currentFilter.difficulty.medium ? "flat-radio-item-active" : ""}`}
                  onClick={() => toggleOption(currentFilter.difficulty, "medium")}
                >
                  <div className="tag">Medium</div>
                </div>
                <div
                  className={`flat-radio-item ${currentFilter.difficulty.hard ? "flat-radio-item-active" : ""}`}
                  onClick={() => toggleOption(currentFilter.difficulty, "hard")}
                >
                  <div className="tag">Hard</div>
                </div>
              </div>
            </div>
            <div className="menu-item">
              <div
                style={{
                  marginTop: "5px",
                }}
              >
                Accuracy :
              </div>
              <div className="accuracy-adjust">
                <div className="accuracy-min">{currentFilter.accuracy.min}</div>
                <RangeSlider
                  id="rangeslider"
                  value={[currentFilter.accuracy.min, currentFilter.accuracy.max]}
                  defaultValue={[currentFilter.accuracy.min, currentFilter.accuracy.max]}
                  onInput={adjustRange}
                />
                <div className="accuracy-max">{currentFilter.accuracy.max}</div>
              </div>
            </div>
            <Button primary small onClick={applyFilter}>
              Apply
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
function ProblemItem({ problem }) {
  useScreenWidth();
  const screenWidth = useAtomValue(screenWidthAtom);
  return (
    <div className="problemitem">
      <div className={`problemitem-status`}>
        {problem.status != "notAttempted" && (
          <FontAwesomeIcon icon={problem.status == "solved" ? faCheck : faCircle} />
        )}
      </div>
      <div className="problemitem-id">{problem.id.toString().padStart(3, "0")}</div>
      {screenWidth > 500 && (
        <>
          <Link to={`/practice/${problem.slug}`} className="problemitem-title">
            {problem.title}
          </Link>
          <div
            className="problemitem-accuracy"
            title={`Only ${problem.accuracy}% of all global user submissions were correct`}
          >
            {problem.accuracy}%
          </div>
          <div className={`problemitem-difficulty difficulty-${problem.difficulty}`}>
            {problem.difficulty}
          </div>
        </>
      )}
      {screenWidth <= 500 && (
        <>
          <div className="problemitem-title">
            <Link to={`/practice/${problem.slug}`}>{problem.title}</Link>
            <div className="problemitem-badges">
              <div className="problemitem-accuracy">{problem.accuracy}%</div>
              <div className={`problemitem-difficulty difficulty-${problem.difficulty}`}>
                {problem.difficulty}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
