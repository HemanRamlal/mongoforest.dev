import "./Footer.css";
import WordMark from "./WordMark";
import Logo from "../assets/logo.png";
import { motion } from "motion/react";
import { faYoutube, faReddit, faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUserTie, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EarlyAccessBanner() {
  return (
    <div className="early-access-banner">
      <h1>Early Access</h1>
      <p>Still in development. Might be buggy</p>
    </div>
  );
}
function ContactLink({ link, icon, color }) {
  return (
    <motion.a
      whileHover={{ scale: 1.1, color: color }}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="link"
    >
      <FontAwesomeIcon icon={icon} />
    </motion.a>
  );
}
export default function Footer() {
  return (
    <>
      <div className="footer">
        <EarlyAccessBanner />
      </div>
    </>
  );
}
