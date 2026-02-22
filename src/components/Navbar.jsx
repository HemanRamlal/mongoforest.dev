import "./Navbar.css";
import logo from "../assets/logo.png";
import WordMark from "./WordMark";
import NavLink from "./NavLink";
import { Link } from 'react-router';
import { motion, AnimatePresence } from "motion/react";
import api from '../api/axios';
//import AnimatedUnderline from "./AnimatedUnderline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faCircleUser, faBell, faBullhorn, faRankingStar, faChevronDown, faChevronUp, faUser, faPenToSquare, faList, faRightFromBracket, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getAvatarURL } from "../utils/blobUtils";
import { getUserAtom, refreshUserAtom } from '../atoms/user';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
export default function Navbar() {
  const user = useAtomValue(getUserAtom);
  const [userMenu, setUserMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [avatarURL, setAvatarURL] = useState('https://cdn-icons-png.flaticon.com/512/739/739249.png');
  const navigate = useNavigate();
  const refreshUser = useSetAtom(refreshUserAtom);
  
  function toggleUserMenu(){
    setUserMenu(oldVal => !oldVal);
  }
  function toggleMobileMenu(){
    setMobileMenu(oldVal => !oldVal);
  }
  async function logout(){
    try {
      await api.post(`/auth/signout`, {});
      refreshUser();
      navigate('/');
    } catch (error) {
      // Optionally handle error
    }
  }
  useEffect(() => {
    (async function () {
      if (!user || !user.avatar) return;
      setAvatarURL(await getAvatarURL(user.avatar));
    })()
  }, [user]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo-link nav-link">
        <img src={logo} alt="Logo" className="logo" />
        <WordMark className="wordmark-xl" />
      </NavLink>
      
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={mobileMenu ? faTimes : faBars} />
      </button>

      <AnimatePresence>
        {(!isMobile || mobileMenu) && (
          <motion.div 
            className="nav-links"
            initial={isMobile ? { height: 0, opacity: 0 } : false}
            animate={isMobile ? { height: "auto", opacity: 1 } : false}
            exit={isMobile ? { height: 0, opacity: 0 } : false}
            transition={{ duration: 0.2 }}
            style={isMobile ? { overflow: "hidden" } : {}}
          >
        <NavLink to="/practice" className="nav-link" text="ProblemSet">
          <FontAwesomeIcon icon={faDatabase} />
        </NavLink>
        <NavLink to="/leaderboard/global" className="nav-link" text="Global Leaderboard">
          <FontAwesomeIcon icon={faRankingStar} />
        </NavLink>
        {/*        <NavLink to="/announcements" className="nav-link" text="Announcements">
          <FontAwesomeIcon icon={faBullhorn} />
        </NavLink>
        <NavLink to="/notifications" className="nav-link" text="Notifications">
          <FontAwesomeIcon icon={faBell} />
        </NavLink>*/}
        {user && 
        <div className="user-drop-container" onClick={toggleUserMenu}>
          <NavLink className="nav-link" text={<span>{user.username}<FontAwesomeIcon icon={userMenu ? faChevronUp : faChevronDown} /></span>} >
            <img src={avatarURL} class="navbar-avatar" />
          </NavLink>
          <AnimatePresence>
          {userMenu && 
          <motion.div 
            className="user-drop"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div className="user-option">
              <Link to={`/profile/${user.username}`}>
                <FontAwesomeIcon icon={faUser} />
                View Profile
              </Link>
            </div>
            <div className="user-option">
              <Link to={`/profile/priv/edit`}>
                <FontAwesomeIcon icon={faPenToSquare} />
                Edit Profile
              </Link>
            </div>
            <div className="user-option">
              <Link to={`/profile/priv/submissions`}>
                <FontAwesomeIcon icon={faList} />
                My Submissions
              </Link>
            </div>
            <div className="user-option">
              <a className="logout-btn" onClick={logout}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </a>
            </div>
          </motion.div>}
          </AnimatePresence>
      </div>
        }
      </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}