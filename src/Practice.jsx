import LastUnsolved from "./components/LastUnsolved";
import LastUnsolvedFallback from "./components/fallbacks/LastUnsolvedFallback";
import UserCard from "./components/UserCard";
import UserCardFallback from "./components/fallbacks/UserCardFallback";
import CommunitiesList from "./components/CommunitiesList";
import CommunitiesListFallback from "./components/fallbacks/CommunitiesListFallback";
import ProblemSet from "./components/ProblemSet";
import "./Practice.css";
import { getUserAtom } from "./atoms/user";
import { useState, Suspense } from "react";
import { useAtomValue } from "jotai";
import { screenWidthAtom } from "./atoms/screenWidth";
import { pushToast } from "./components/Toasts/Toasts";
import { useNavigate } from "react-router";
export default function Practice() {
  const user = useAtomValue(getUserAtom);
  const screenWidth = useAtomValue(screenWidthAtom);
  const navigate = useNavigate();
  if (!user) {
    pushToast({
      title: "Not Authorized",
      message: "Login to access problemset",
      code: 100,
    });
    navigate("/");
  }
  return (
    user && (
      <>
        <div className="practice">
          <main className="practice-mainbar">
            <ProblemSet />
          </main>
          <aside className="practice-sidebar">
            <div className="basic-info-wrapper">
              <UserCard username={user.username} />
              {screenWidth >= 1025 && <CommunitiesList username={user.username} />}
              <LastUnsolved />
            </div>
          </aside>
        </div>
      </>
    )
  );
}
