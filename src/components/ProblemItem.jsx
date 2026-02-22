import Bookmark from "./Bookmark";
import acceptedIcon from "../assets/accepted.svg";
import inProgressIcon from "../assets/inProgress.svg";
import blankIcon from "../assets/blank.svg";
import easyIcon from "../assets/easy.svg";
import mediumIcon from "../assets/medium.svg";
import hardIcon from "../assets/hard.svg";
import "./ProblemItem.css";
import _ from "lodash";

/* problem schema
    from db schema: id:String, title:String, slug:String, difficultyLabel:String, acRate:Number
    extras: status:Status, bookmarked lists:Array
*/
export default function ProblemItem({problem}){
  const statusSVG = {
    "accepted" : acceptedIcon,
    "inProgress" : inProgressIcon,
    "notTried" : blankIcon,
  };

  const difficultySVG = {
    "easy" : easyIcon,
    "medium" : mediumIcon,
    "hard" : hardIcon
  };

  return <div className="problem-item">
    <div className="problem-item-left">
      <div className="problem-item-status">
        <img src={statusSVG[problem.status]}>
        </img>
      </div>
      <div className="problem-item-title">
        <span className="problem-item-id">{Number.parseInt(problem.id).toString().padStart(3, " ")} </span>{problem.title}
      </div>
    </div>
    <div className="problem-item-right">
      <div className="problem-item-ac-rate">{problem.acRate} %</div>
      <div className="problem-item-difficulty">
        <div className="problem-item-difficulty-icon">
          <img src={difficultySVG[problem.difficultyLabel]} />
        </div>
        <div className="problem-item-difficulty-label">
          {_.upperFirst(problem.difficultyLabel)}
        </div>
      </div>
      <Bookmark />
    </div>
  </div>
}