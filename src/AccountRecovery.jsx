import { useState } from "react";
import Button from "./components/Button";
import { pushToast } from "./components/Toasts/Toasts";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import api from "./api/axios";
import "./AccountRecovery.css";

function FindYourAccount({ setPageNo }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleEmailInput(e) {
    setEmail(e.target.value);
  }

  async function submitEmail() {
    setSubmitting(true);
    try {
      const res = await api.post(`/auth/password/reset-token`, {
        email,
      });
      pushToast({
        code: res.status,
        ...res.data,
      });
      setPageNo(oldVal => oldVal + 1);
    } catch (error) {
      if (error.response) {
        pushToast({
          code: error.response.status,
          ...error.response.data,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="find-your-account">
      <div className="recovery-header">
        {submitting
          ? "Generating a password reset token..."
          : "Your account was created using which email?"}
      </div>
      <div className="recovery-body">
        <div className="fields">
          <div className="email-field">
            <label htmlFor="email">Email : </label>
            <input type="text" name="email" id="email" value={email} onChange={handleEmailInput} />
          </div>
        </div>
        <div className="field-submit">
          <input
            type="button"
            className={`recovery-submit ${submitting ? "recovery-submit-disabled" : ""}`}
            disabled={submitting}
            onClick={submitEmail}
            value="Next"
          />
        </div>
      </div>
    </div>
  );
}
function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function submitReset() {
    setSubmitting(true);
    try {
      const res = await api.post(`/auth/password/reset-form`, {
        token,
        newPassword: password,
        newPasswordConfirm: confirmPassword,
      });
      pushToast({
        code: res.status,
        ...res.data,
      });
      navigate("/");
    } catch (error) {
      if (error.response) {
        pushToast({
          code: error.response.status,
          ...error.response.data,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleTokenInput(e) {
    setToken(e.target.value);
  }
  function handlePasswordInput(e) {
    setPassword(e.target.value);
  }
  function handleConfirmPasswordInput(e) {
    setConfirmPassword(e.target.value);
  }
  return (
    <div className="reset-password">
      <div className="recovery-header">Check your email's inbox for token value</div>
      <div className="recovery-body">
        <div className="fields">
          <div className="token-field">
            <label htmlFor="token">Token : </label>
            <input type="text" name="token" id="token" value={token} onChange={handleTokenInput} />
          </div>
          <div className="password-field">
            <label htmlFor="password">New Password : </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handlePasswordInput}
            />
          </div>
          <div className="confirm-password-field">
            <label htmlFor="confirmPassword">Confirm Password : </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordInput}
            />
          </div>
        </div>
        <div className="field-submit">
          <input
            class={`recovery-submit ${submitting ? "recovery-submit-disabled" : "0"}`}
            disabled={submitting}
            onClick={submitReset}
            value={"Reset Password"}
          />
        </div>
      </div>
    </div>
  );
}

export default function AccountRecovery() {
  const [pageNo, setPageNo] = useState(1);
  return (
    <>
      {pageNo === 1 && <FindYourAccount setPageNo={setPageNo} />}
      {pageNo === 2 && <ResetPassword />}
    </>
  );
}
