import submissionsData from "../mockdata/submissionsData.json";

function flattenData(){
  const flattenedData = [];

  for([date, submissions] of submissionsData){
    for(submission of submissions){
      submission["date"] = date
      flattenedData.push(submission);
    }
  }

  return flattenedData;
}

const flattenedData = flattenData();
export function sortByTime(flatData, desc=true){
  const sortedFlatData = flatData.sort(
    (a, b)=>{
      (new Date(b.date)).getTime() - (new Date(a.date)).getTime()
    }
  )
  return sortedFlatData;
}
export function getSolved(){
  const solvedProblems = flattenedData.filter(submission => submission.verdict=="AC");
  return sortByTime(solvedProblems)
}

export function getAttempted(){
  const attemptedProblems = flattenedData.filter((submission) => {
    return !flattenedData.some( 
      sub => sub.problem_id==submission.problem_id && verdict=="AC"
    )
  });
  return sortByTime(attemptedProblems);
}

export function getSubmissionsData(){
  return submissionsData;
}
export function getFlattenedData(){
  return flattenedData;
}