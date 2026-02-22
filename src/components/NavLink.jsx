import { motion } from "motion/react";
import { Link } from 'react-router';
import "./NavLink.css";
import { redirect } from "react-router";
export default function NavLink({ to, className, children, text, onClick }) {
  if(!to){
    return <motion.span onClick={onClick}
      className={`nav-link ${className}`}
      whileHover={{
        scale: 1.05
      }}
      whileTap={{
        scale: 0.95
      }}>
      {children}
      <div className="text-container">
        <div className="text">{text}</div>
      </div>
    </motion.span>;
  }
  return <Link to={to}>
    <motion.span onClick={onClick}
      className={`nav-link ${className}`}
      whileHover={{
        scale: 1.05
      }}
      whileTap={{
        scale: 0.95
      }}>
      {children}
      <div className="text-container">
        <div className="text">{text}</div>
      </div>
    </motion.span>
  </Link>
}