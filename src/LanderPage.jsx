import { useState } from "react";
import "./LanderPage.css";
import WordMark from "./components/WordMark";
import Button from "./components/Button";
import AuthForm from "./components/AuthForm";
import logo from "./assets/logo.png";
import playgroundScreenshot from "./assets/playground-screenshot.png";
export default function LanderPage() {
  const [authOverlay, setAuthOverlay] = useState(false);
  const [authOffset, setAuthOffset] = useState(window.scrollY);

  function updateAuthOffset() {
    setAuthOffset(window.scrollY);
  }
  function toggleAuthOverlay() {
    updateAuthOffset();
    setAuthOverlay(!authOverlay);
  }
  return (
    <>
      {authOverlay && <AuthForm authOffset={authOffset} setAuthOverlay={setAuthOverlay} />}
      <div className={`lander-page ${authOverlay && "blur"}`}>
        <div className="screen1">
          <div className="logo">
            <img src={logo} alt="logo-img" />
            <WordMark />
          </div>
          <div className="tagline">Docs teach theory, Practice makes it real</div>
          {!authOverlay && (
            <Button onClick={toggleAuthOverlay} large className="signup-cta">
              Learn by doing
            </Button>
          )}
          {authOverlay && (
            <Button disabled large className="signup-cta">
              Learn by doing
            </Button>
          )}
        </div>
        <div className="screen2">
          <img src={playgroundScreenshot} alt="" />
          <div className="playground-screenshot-caption">
            Chiesel your MongoDB skills by solving problems involving simple finds to complex
            aggregations
          </div>
        </div>
        <div className="screen3">
          <div className="header">
            <div className="title"> You can't read your way to mastery</div>
            <div className="subtitle">
              We give you real challenges : from basic queries to deep aggregations
            </div>
          </div>
          <div className="cta">
            {!authOverlay && (
              <Button onClick={toggleAuthOverlay} large className="signup-cta">
                Train now!
              </Button>
            )}
            {authOverlay && (
              <Button disabled large className="signup-cta">
                Train now!
              </Button>
            )}
            <div className="payoff-line">Develop fingertip feel for MongoDB queries</div>
          </div>
        </div>
      </div>
    </>
  );
}
