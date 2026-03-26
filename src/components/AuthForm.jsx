import "./AuthForm.css";
import { motion, AnimatePresence } from "motion/react";
import WordMark from "./WordMark";
import Button from "./Button";
import logo from "../assets/logo.png";
import { useState, useRef } from "react";
import _ from "lodash";
import api from "../api/axios";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSetAtom } from "jotai";
import { refreshUserAtom } from "../atoms/user";
import { pushToast } from "./Toasts/Toasts";
import { useNavigate } from "react-router";

export default function AuthForm({ setAuthOverlay, authOffset }) {
  const [mode, setMode] = useState("signin");
  const [isClosing, setIsClosing] = useState(false);
  const refreshUser = useSetAtom(refreshUserAtom);
  const navigate = useNavigate();
  const refs = useRef([]);
  const formVariants = {
    visible: {
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    hidden: {
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
      },
    },
  };
  const fieldsetVariants = {
    initial: {
      opacity: 0,
      height: 0,
      padding: 0,
      margin: 0,
    },
    visible: {
      opacity: 1,
      height: "auto",
      margin: "10px",
    },
    hidden: {
      opacity: 0,
      padding: 0,
      height: 0,
      margin: 0,
    },
  };
  function toggleMode(e) {
    setMode(mode == "signin" ? "signup" : "signin");
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  async function forgotPassword(e) {
    navigate("/account-recovery");
  }
  async function handleSign(e) {
    if (mode == "signin") {
      try {
        const res = await api.post("/auth/signin", {
          username: username,
          password: password,
        });
        await refreshUser();
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
    } else if (mode == "signup") {
      try {
        const res = await api.post("/auth/signup", {
          email,
          username,
          password,
          confirmPassword,
        });
        pushToast({
          code: res.status,
          ...res.data,
        });
        await refreshUser();
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
  }
  async function handleGoogleSign(e) {
    window.location = `${import.meta.env.VITE_API_URL}/auth/signin/federated/google`;
  }
  async function handleGithubSign(e) {
    window.location = `${import.meta.env.VITE_API_URL}/auth/signin/federated/github`;
  }
  async function handleUsernameChange(e) {
    setUsername(e.target.value);
  }
  async function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  async function handlePasswordChange(e) {
    setPassword(e.target.value);
  }
  async function handleConfirmPasswordChange(e) {
    setConfirmPassword(e.target.value);
  }

  const position =
    authOffset + 900 > document.documentElement.offsetHeight
      ? {
          bottom: 0,
        }
      : {
          top: authOffset + 50 + "px",
        };
  function keyDown(i) {
    return e => {
      if (e.key != "Enter") return;
      e.preventDefault();
      if (i == 3 || (i == 1 && mode == "signin")) {
        const buttonIndex = mode == "signup" ? 4 : 2;
        refs.current[buttonIndex]?.click();
        return;
      }
      refs.current[i + 1]?.focus();
    };
  }
  return (
    <div
      className="auth-overlay"
      style={{
        ...position,
      }}
    >
      <AnimatePresence mode="wait">
        {isClosing ? (
          setTimeout(() => {
            setAuthOverlay(false);
          }, 300)
        ) : (
          <motion.div
            key="form"
            className="auth-form-container"
            variants={formVariants}
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
              transition: formVariants.visible.transition,
            }}
            exit={{
              scale: 0,
              transition: formVariants.hidden.transition,
            }}
          >
            <div className="controls">
              <Button tertiary onClick={() => setIsClosing(true)}>
                Close
              </Button>
            </div>
            <div className="logo">
              <img src={logo} alt="logo-img" className="logo-img" />
              <WordMark className="wordmark-md" />
            </div>
            <Button tertiary className="modeToggler" onClick={toggleMode}>
              {mode == "signup"
                ? "Already have an account? Sign in"
                : "Dont have an account? Sign up"}
            </Button>
            <AnimatePresence mode="wait">
              <motion.form
                className="auth-form"
                initial={false}
                animate="visible"
                key={mode + "form"}
                variants={formVariants}
                onSubmit={handleSubmit}
              >
                <motion.div
                  variants={fieldsetVariants}
                  className="fieldset"
                  initial="initial"
                  animate="visible"
                  exit="hidden"
                >
                  <label htmlFor="auth-username">Username :</label>
                  <input
                    id="auth-username"
                    onChange={handleUsernameChange}
                    value={username}
                    onKeyDown={keyDown(0)}
                    ref={e => {
                      refs.current[0] = e;
                    }}
                    type="name"
                    placeholder="Username"
                  />
                </motion.div>
                {mode == "signup" && (
                  <motion.div
                    variants={fieldsetVariants}
                    initial="initial"
                    animate="visible"
                    exit="hidden"
                    className="fieldset"
                  >
                    <label htmlFor="auth-email">Email :</label>
                    <input
                      id="auth-email"
                      onChange={handleEmailChange}
                      value={email}
                      onKeyDown={keyDown(1)}
                      ref={e => {
                        refs.current[1] = e;
                      }}
                      type="email"
                      placeholder="Email"
                    />
                  </motion.div>
                )}
                <motion.div
                  initial="initial"
                  animate="visible"
                  exit="hidden"
                  variants={fieldsetVariants}
                  className="fieldset"
                >
                  <label htmlFor="auth-password">Password :</label>
                  <input
                    id="auth-password"
                    onChange={handlePasswordChange}
                    value={password}
                    onKeyDown={keyDown(mode == "signup" ? 2 : 1)}
                    ref={e => {
                      refs.current[mode == "signup" ? 2 : 1] = e;
                    }}
                    type="password"
                    placeholder="Password"
                  />
                </motion.div>
                {mode == "signup" && (
                  <motion.div
                    initial="initial"
                    animate="visible"
                    exit="hidden"
                    variants={fieldsetVariants}
                    className="fieldset"
                  >
                    <label htmlFor="auth-password-confirm">Confirm password :</label>
                    <input
                      id="auth-password-confirm"
                      onChange={handleConfirmPasswordChange}
                      onKeyDown={keyDown(3)}
                      ref={e => (refs.current[3] = e)}
                      value={confirmPassword}
                      type="password"
                      placeholder="Password"
                    />
                  </motion.div>
                )}
                <Button tertiary className="forgot-pass" onClick={forgotPassword}>
                  Forgot Password?
                </Button>
                <motion.div initial="initial" animate="visible" exit="hidden" className="fieldset">
                  <Button
                    primary
                    onClick={handleSign}
                    ref={e => (refs.current[mode == "signup" ? 4 : 2] = e)}
                    className="signup"
                  >
                    {_.capitalize(mode)}
                  </Button>
                </motion.div>
              </motion.form>
              <Button secondary className="signup-oauth" onClick={handleGoogleSign}>
                {_.capitalize(mode) + " with "}
                <FontAwesomeIcon icon={faGoogle} />
              </Button>
              <Button secondary className="signup-oauth" onClick={handleGithubSign}>
                {_.capitalize(mode) + " with "}
                <FontAwesomeIcon icon={faGithub} />
              </Button>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
