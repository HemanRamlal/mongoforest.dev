import "./ControlButton.css";

export default function ControlButton({color, onClick, className, disabled, children}){
  return <div className={`control-button-overlay ${className}`}
  style={{
    color
  }} onClick={disabled ? null : onClick}>
    <button disabled={disabled} className="control-button">
      {children}
    </button>
  </div>
}