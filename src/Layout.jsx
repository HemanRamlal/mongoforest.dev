import Navbar from "./components/Navbar";
import { Outlet } from "react-router";
import Footer from "./components/Footer";
import "./Layout.css";
export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-outlet">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
