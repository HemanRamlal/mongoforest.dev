import "./Button.css";
import { motion } from "motion/react";
import { forwardRef } from "react";

const Button = forwardRef(function Button(
  { children, primary, secondary, tertiary, disabled, large, small, className, onClick },
  ref
) {
  return (
    <motion.button
      ref={ref}
      className={`${className} ${primary ? "primary" : ""} ${secondary ? "secondary" : ""} ${tertiary ? "tertiary" : ""} ${large ? "large" : ""} ${small ? "small" : ""}`}
      disabled={disabled}
      onClick={onClick}
      whileTap={
        !disabled && {
          scale: 0.97,
          ...(tertiary
            ? {
                textShadow: "none",
              }
            : {
                boxShadow: "none",
                ...(secondary
                  ? {
                      background: "var(--primary-color-sw)",
                    }
                  : {}),
              }),
          transition: { duration: 0.1 },
        }
      }
      whileHover={
        !disabled && {
          scale: 1.03,
          // Apply different effects based on button type
          ...(tertiary ? {} : { boxShadow: "var(--shadow-raised)" }),
          transition: { duration: 0.2 },
        }
      }
    >
      {children}
    </motion.button>
  );
});

export default Button;
