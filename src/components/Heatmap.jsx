import "./Heatmap.css";
import { useState, useEffect } from "react";
import { useToastQuery } from "../hooks/toastHooks";
import { userInfoQueryOptions, heatmapQueryOptions } from "../hooks/queryOptions";
import * as dateFns from "date-fns";
import * as d3 from "d3";

function putSvg(parentSelector, dateActivityMap, year) {
  if (!document.querySelector(parentSelector)) return;
  document.querySelector(parentSelector).innerHTML = "";

  const grid = 20;
  const pad = 0.2;
  const width = 26 * grid;
  const totalGaps = 5 * grid * 1.93;
  const height = grid * 7;
  const margin = { top: 20, left: 10, right: 10, bottom: 30 };

  if (!dateActivityMap) {
    const svgRoot = d3
      .select(parentSelector)
      .append("svg")
      .attr("width", width + margin.left + margin.right + totalGaps)
      .attr("height", height * 2 + margin.top * 2 + margin.bottom);

    const g = svgRoot.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const skeleton = g
      .append("rect")
      .attr("width", width + totalGaps)
      .attr("height", height * 2)
      .attr("rx", 6)
      .attr("fill", "#e5e7eb");

    g.append("text")
      .attr("x", (width + totalGaps) / 2)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "38px")
      .style("font-family", "Space Grotesk")
      .style("fill", "#6b7280")
      .text("Loading Heatmap...");

    function flash() {
      skeleton
        .transition()
        .duration(700)
        .attr("opacity", 0.4)
        .transition()
        .duration(700)
        .attr("opacity", 1)
        .on("end", flash);
    }

    flash();
    return;
  }
  const days = [];
  for (let i = new Date(`${year} Jan 1`); dateFns.compareAsc(i, new Date(`${year + 1} Jan 1`)); ) {
    days.push(i);
    i = dateFns.addDays(i, 1);
  }

  const dataset = days.map(day => {
    return [
      dateFns.getWeek(day),
      dateFns.format(day, "EEE"),
      dateActivityMap.find(entry => {
        const submissionTime = new Date(entry.activity_date.split(" ")[0]);
        const targetDay = new Date(day);
        return (
          dateFns.format(submissionTime, "MM-dd-yyyy") == dateFns.format(targetDay, "MM-dd-yyyy")
        );
      }) ?? { count: 0 },
      day,
    ];
  });

  const svgRoot = d3
    .select(parentSelector)
    .append("svg")
    .attr("width", width + margin.left + margin.right + totalGaps)
    .attr("height", height * 2 + margin.top * 2 + margin.bottom);
  const topSvg = svgRoot.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
  const bottomSvg = svgRoot
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top * 2 + height})`);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const xTop = d3.scaleBand().range([0, width]).domain(d3.range(1, 28)).padding(pad);

  const yTop = d3.scaleBand().range([0, height]).domain(weekDays).padding(pad);

  const xBottom = d3.scaleBand().range([0, width]).domain(d3.range(27, 54)).padding(pad);

  const yBottom = d3.scaleBand().range([0, height]).domain(weekDays).padding(pad);

  const colorScale = d3.scaleLinear().range(["#dedede", "#007700"]).domain([0, 20]).clamp(true);

  const daysUntilJuly = dateFns.differenceInDays(
    new Date(`${year}-07-01`),
    new Date(`${year}-01-01`)
  );
  topSvg
    .selectAll()
    .data(dataset.slice(0, daysUntilJuly), function (data) {
      return data[0] + ":" + data[1];
    })
    .join("rect")
    .attr("x", data => {
      return xTop(data[0]) + grid * 2 * dateFns.getMonth(data[3]);
    })
    .attr("y", data => {
      return yTop(data[1]);
    })
    .attr("width", xTop.bandwidth())
    .attr("height", yTop.bandwidth())
    .attr("fill", data => {
      return colorScale(data[2].count);
    });

  bottomSvg
    .selectAll()
    .data(dataset.slice(daysUntilJuly), function (data) {
      return data[0] + ":" + data[1];
    })
    .join("rect")
    .attr("x", data => {
      return xBottom(data[0] == 1 ? 53 : data[0]) + grid * 2 * (dateFns.getMonth(data[3]) - 6);
    })
    .attr("y", data => {
      return yBottom(data[1]);
    })
    .attr("width", xBottom.bandwidth())
    .attr("height", yBottom.bandwidth())
    .attr("fill", data => {
      return colorScale(data[2].count);
    });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  topSvg
    .selectAll()
    .data(months.slice(0, 6), function (d) {
      return "label-" + d;
    })
    .join("text")
    .text(d => d)
    .attr("text-anchor", "center")
    .attr("y", height + 15)
    .attr("x", (d, i) => {
      const val = i * 1.83 * grid + (i * width) / 6 + 30;
      return val;
    })
    .attr("width", (width + totalGaps) / 12)
    .attr("style", "font-family:Space Grotesk;");
  bottomSvg
    .selectAll()
    .data(months.slice(6), function (d) {
      return "label-" + d;
    })
    .join("text")
    .text(d => d)
    .attr("text-anchor", "center")
    .attr("y", height + 15)
    .attr("x", (d, i) => {
      const val = i * 1.83 * grid + (i * width) / 6 + 30;
      return val;
    })
    .attr("width", (width + totalGaps) / 12)
    .attr("style", "font-family:Space Grotesk;");
}

export default function Heatmap({ username }) {
  const [mode, setMode] = useState("all-submissions"); //solved-problems
  const [heatmapYear, setHeatmapYear] = useState(() => {
    return new Date().getFullYear();
  });

  const userInfoQuery = useToastQuery(
    userInfoQueryOptions({
      username: username,
    })
  );

  const user = userInfoQuery.data;

  const heatmapQuery = useToastQuery(
    heatmapQueryOptions({
      userId: user?.id,
      mode: mode,
      enabled: !!user,
    })
  );

  const heatmapData = heatmapQuery.data;

  useEffect(() => {
    putSvg(".heatmap-visualizer", heatmapData, heatmapYear);
  }, [heatmapData, heatmapYear]);

  const yearList = [];
  for (let yearItem = 2025; yearItem <= new Date().getFullYear(); yearItem++) {
    yearList.push(yearItem);
  }

  return (
    <div class="heatmap">
      <main>
        <div className="heatmap-controls">
          {/*      <label htmlFor="year-selector">Year : </label>
      <select id="year-selector" defaultValue={heatmapYear} onChange={(e)=>{
        setHeatmapYear(e.target.value);
      }}>
        {yearList.map(
          yearItem => 
            <option value={yearItem}>{yearItem}</option>
        )}
      </select>*/}

          <div className="heatmap-control">
            <label htmlFor="mode-selector">Show : </label>
            <select
              id="mode-selector"
              defaultValue={mode}
              onChange={e => {
                setMode(e.target.value);
              }}
            >
              <option value="all-submissions">Submissions Heatmap</option>
              <option value="solved-problems">Problems Solved Heatmap</option>
            </select>
          </div>
          <div className="heatmap-control">
            <label htmlFor="year-selector">Year : </label>
            <select
              id="year-selector"
              defaultValue={heatmapYear}
              onChange={e => {
                setHeatmapYear(+e.target.value);
              }}
            >
              {yearList.map(year => (
                <option value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div class="heatmap-visualizer def-cur-ns-ans"></div>
      </main>
      <div className="heatmap-stats">
        <div className="heatmap-stat heatmap-main-stat">
          {heatmapData ? (
            <div className="heatmap-stat-value">
              {heatmapData?.reduce((accumulator, dayStats) => {
                if (dateFns.getYear(new Date(dayStats.activity_date)) != heatmapYear)
                  return accumulator;
                return (accumulator += dayStats.count);
              }, 0)}
            </div>
          ) : (
            <div className="heatmap-stat-value flasher heatmap-stat-value-skeleton"></div>
          )}
          <div className="heatmap-stat-label">
            {(mode == "all-submissions" ? "Submissions" : "Problems Solved") + ` In ${heatmapYear}`}
          </div>
        </div>
        <div className="heatmap-stat heatmap-main-stat">
          {heatmapData ? (
            <div className="heatmap-stat-value">
              {heatmapData?.reduce((accumulator, dayStats) => {
                return (accumulator += dayStats.count);
              }, 0)}
            </div>
          ) : (
            <div className="heatmap-stat-value flasher heatmap-stat-value-skeleton"></div>
          )}
          <div className="heatmap-stat-label">
            {mode == "all-submissions" ? "Total Submissions" : "Total Problems Solved"}
          </div>
        </div>
        <div className="heatmap-stat heatmap-ac-stat">
          {user ? (
            <div className="heatmap-stat-value">{user ? (+user.ac_rate * 100).toFixed(2) : 0}%</div>
          ) : (
            <div className="heatmap-stat-value heatmap-stat-value-skeleton flasher"></div>
          )}
          <div className="heatmap-stat-label">Overall Acceptance Rate</div>
        </div>
      </div>
    </div>
  );
}
