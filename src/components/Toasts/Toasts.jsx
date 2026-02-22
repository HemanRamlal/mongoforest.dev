import { readToastsAtom, deleteToastAtom, useServerCode } from './Toasts.js';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Toasts.css";

function getRemainingTime(startTimestamp, duration) {
  const elapsedTime = Date.now() - startTimestamp;
  const remainingTime = Math.max(0, duration - elapsedTime);
  return remainingTime;
}

function ToastClock({ toastId, startTime, duration, color }) {
  const [tick, setTick] = useState(0);
  const deleteToast = useSetAtom(deleteToastAtom);
  useEffect(() => {
    const timeoutId = setTimeout(() => setTick((tick) => tick + 1), 12);
    const remainingTime = getRemainingTime(startTime, duration);
    if (remainingTime == 0) {
      deleteToast(toastId);
    }
    return () => {
      clearTimeout(timeoutId);
    }
  }, [tick]);

  const remainingTime = getRemainingTime(startTime, duration);
  const width = remainingTime / duration * 100;
  return <div style={{
    width: width + "%",
    backgroundColor: color,
  }} className="toast-clock"></div>
}
function Toast({ data }) {
  const [startTime] = useState(Date.now());
  const duration=5000;
  return <div style={{
    backgroundColor: useServerCode.makeBgColor(data.code),
  }} className="toast">
    <ToastClock toastId={data.id} startTime={startTime} duration={duration} color={useServerCode.makeFgColor(data.code)} />
    <div className="toast-content">
      <div className="toast-indicator" style={{
        color: useServerCode.makeFgColor(data.code)
      }}>
        <FontAwesomeIcon icon={useServerCode.makeIcon(data.code)} />
      </div>
      <div className="toast-data">
        <div className="toast-title">{data.title}</div>
        <div className="toast-message">{data.message}</div>
      </div>
    </div>
  </div>
}
export default function Toasts() {
  const readToasts = useAtomValue(readToastsAtom);

  console.log(readToasts);
  return <div className="toasts">
    {readToasts.map((toastData, idx) =>
      <Toast data={toastData} key={toastData.id} />
    )}
  </div>
}