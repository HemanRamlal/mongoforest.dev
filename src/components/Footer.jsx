import "./Footer.css";
import WordMark from "./WordMark";
import Logo from "../assets/logo.png";
import {motion} from "motion/react";
import { faYoutube, faReddit, faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUserTie, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ContactLink({link, icon, color}){
  return <motion.a whileHover={{scale:1.1, color:color}} href={link} target="_blank" rel="noopener noreferrer" className="link" >
        <FontAwesomeIcon icon={icon} />
      </motion.a>;
}
export default function Footer() {
  return <>
    <div className="footer">{/*
          <a href="/" className="link">
            <WordMark className="wordmark-xl" />
          </a> */}
      <ContactLink link="https://www.youtube.com" icon={faYoutube} color="#ff0033" />
      <ContactLink link="https://www.reddit.com" icon={faReddit} color="#ff4500" />
      <ContactLink link="https://www.twitter.com" icon={faSquareXTwitter} color="#222222"/>
      <ContactLink link="mailto:example@example.com" icon={faEnvelope} color="#2255ff" />
      <ContactLink link="https://www.linkedin.com/in/example" icon={faUserTie} color="#22ff55"/>
    </div>
  </>
}