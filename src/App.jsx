import "./App.css";
import useTheme from "./theme/useTheme";
import { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalStyles } from "./theme/GlobalStyles";
import WebFont from "webfontloader";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router";
import LanderPage from "./LanderPage";
import themes from "./theme/schema.json";
import Layout from "./Layout";
import Practice from "./Practice";
import Toasts from "./components/Toasts/Toasts.jsx";
import ProblemSet from "./components/ProblemSet";
import Leaderboard from "./components/Leaderboard";
import LeaderboardFallback from "./components/fallbacks/CommunityFallback.jsx";
import ProblemView from "./ProblemView";
import ProfileContainer from "./ProfileContainer";
import ProfilePage from "./ProfilePage";
import ProfileEdit from "./ProfileEdit";
import NotFound from "./NotFound";
import SubmissionsPage from "./SubmissionsPage";
import SubmissionsPageFallback from "./components/fallbacks/SubmissionsPageFallback.jsx";
import { getUserAtom, refreshUserAtom } from "./atoms/user";
import { useAtomValue, useSetAtom } from "jotai";
import useScreenWidth from "./hooks/useScreenWidth.js";
import AccountRecovery from "./AccountRecovery.jsx";

const themeList = [themes.data.light, themes.data.dark];
const queryClient = new QueryClient();

function App() {
  useScreenWidth();
  const user = useAtomValue(getUserAtom);
  const refreshUser = useSetAtom(refreshUserAtom);
  const { theme, setTheme } = useTheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  console.log("user is ", user);
  useEffect(() => {
    refreshUser();
    const intervalId = setInterval(() => refreshUser(), 10 * 60 * 1000);
    WebFont.load({
      google: {
        families: ["Work Sans", "Poppins", "Space Grotesk", "Caveat"],
      },
      active: () => setFontsLoaded(true),
      inactive: () => setFontsLoaded(true),
    });
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function toggleTheme() {
    if (theme == themeList[0]) setTheme(themeList[1]);
    else setTheme(themeList[0]);
  }
  return (
    theme &&
    fontsLoaded && (
      <ThemeProvider theme={themes.data[theme]}>
        <Toasts />
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={user ? <Navigate to="/practice" replace /> : <LanderPage />} />
              {/*            <Route path="announcements" element={<Announcements />}>
              <Route index element={<AnnouncementsList />} />
              <Route path=":announcementId" element={<AnnouncementDetail />} />
            </Route>
            <Route path="notifications" element={<Notifications />} />*/}
              <Route path="practice" element={<Practice />} />
              <Route path="practice/:problemSlug" element={<ProblemView />} />
              <Route path="leaderboard">
                <Route index element={<Navigate to="/leaderboard/global/" replace />} />
                <Route path=":communitySlug" element={<Leaderboard />}></Route>
              </Route>
              <Route path="profile/priv/edit" element={<ProfileEdit />}></Route>
              <Route
                path="profile/priv/submissions"
                element={
                  <Suspense fallback={<SubmissionsPageFallback />}>
                    <SubmissionsPage />
                  </Suspense>
                }
              />
              <Route path="profile/:username" element={<ProfilePage />} />
              <Route path="account-recovery" element={<AccountRecovery />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        {/*<Showcase />
      <button onClick={toggleTheme}>Toggle Theme</button>*/}
      </ThemeProvider>
    )
  );
}

export default App;
