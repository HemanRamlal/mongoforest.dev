import api from '../api/axios';

async function fetchUserSubmissions(startDate) {
  try {
    const res = await api.get('/user/info/submissions/' + startDate);
    return res.data;
  } catch (e) {
    console.log(e);
    return;
  }
}

async function fetchSubmissionDetails(submissionId){
  try{
    const res = await api.get('/user/info/submission/' + submissionId);
    return res.data;
  } catch(e){
    console.log(e);
    return;
  }
}

async function fetchUserStats(userId){
  try{
    const res = await api.get("/user/public/"+userId+"/info/solved-stats");
    console.log(res.data);
    return res.data;
  } catch(e){
    console.log(e);
    return;
  }
}

async function fetchUserSolvedProblems(userId){
  try{
    const res = await api.get("/user/public/"+userId+"/info/solved-problems");
    console.log(res.data);
    return res.data;
  } catch(e){
    console.log(e);
    return;
  }
}

async function fetchUserHeatmap(userId){
  try{
    const res = await api.get("/user/public/"+userId+"/info/heatmap");
    return res.data;
  } catch(e){
    console.log(e);
    return;
  }
}
}