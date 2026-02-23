import ProblemItem from "./ProblemItem";
import "./ProblemList.css";
/* problemList Schema 
[
  {
    from db schema: id:String, title:String, slug:String, difficultyLabel:String, acRate:Number
    extras: status:Status, bookmarked lists:Array
  }
]

*/
export default function ProblemList({ problemList }) {
  console.log(problemList);
  return (
    <div className="problem-list">
      {problemList.map(problem => {
        return <ProblemItem key={problem.id} problem={problem} />;
      })}
    </div>
  );
}
