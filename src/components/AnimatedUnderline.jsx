import "./AnimatedUnderline.css";
export default function AnimatedUnderline({ className, children }) {
  return (
    <div className={`animated-underline ${className ? className : ""}`}>
      <div>{children}</div>
    </div>
  );
}
