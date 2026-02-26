import Skeleton from "@mui/material/Skeleton";
import "./ProblemSetFallback.css";

function ProblemItemSkeleton() {
  return (
    <Skeleton
      sx={{
        margin: 0,
        height: "40px",
        transform: "none",
      }}
      className="problemitem problemitem-skeleton"
    ></Skeleton>
  );
}

export default function ProblemSetFallback() {
  return (
    <>
      <div
        style={{
          width: "90%",
          margin: "auto",
        }}
        className="problemset"
      >
        {Array.from("123456789012345").map(e => (
          <ProblemItemSkeleton />
        ))}
      </div>
    </>
  );
}
