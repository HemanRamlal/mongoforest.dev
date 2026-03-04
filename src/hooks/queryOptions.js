import { queryOptions } from "@tanstack/react-query";
import { getAvatarURL } from "../utils/blobUtils.js";
import api from "../api/axios";

async function getUserInfo(username) {
  const res = await api.get(`/user/public/${username}/info`);
  return res.data;
}
async function fetchUserStats(username) {
  const defaultAvatarURL = "";
  const defaultSolvedStats = {
    easy_total: 0,
    easy_solved: 0,
    medium_total: 0,
    medium_solved: 0,
    hard_total: 0,
    hard_solved: 0,
  };
  const defaultGlobalRank = 69;
  const defaultGlobalPercentile = 69;
  const defaultFirstName = "";
  const defaultLastName = "";
  const user = await getUserInfo(username);
  if (!user)
    return {
      avatarURL: defaultAvatarURL,
      solvedStats: defaultSolvedStats,
      globalRank: defaultGlobalRank,
      globalPercentile: defaultGlobalPercentile,
      firstName: defaultFirstName,
      lastName: defaultLastName,
    };

  const solvedStats = (await api.get(`/user/public/${user.id}/info/solved-stats`)).data;
  const globalRank = (await api.get(`/user/public/${user.id}/info/community/rank/1`)).data.rank;
  const globalPercentile = Number(
    (await api.get(`/user/public/${user.id}/info/community/percentile/1`)).data.percentile
  ).toFixed(2);
  let avatarURL;
  try {
    avatarURL = await getAvatarURL(user.avatar);
  } catch (e) {
    console.log(e);
  }

  return {
    avatarURL: avatarURL ?? "",
    solvedStats: solvedStats ?? defaultSolvedStats,
    globalRank: globalRank ?? 69,
    globalPercentile: globalPercentile ?? 69,
    firstName: user.firstname ?? defaultFirstName,
    lastName: user.lastname ?? defaultLastName,
  };
}

export function userInfoQueryOptions({ username, augment = {} }) {
  return queryOptions({
    queryKey: ["user-info", username],
    queryFn: () => getUserInfo(username),
    ...augment,
  });
}

export function userStatsQueryOptions({ username, augment = {} } = {}) {
  return queryOptions({
    queryKey: ["user-stats", { username }],
    queryFn: () => fetchUserStats(username),
    ...augment,
  });
}

async function getCommunityInfo(communityName) {
  const res = await api.get(`/community/getInfo/${communityName}`);
  const data = res.data;
  if (!data.admins) data.admins = [];
  data.avatar = await getAvatarURL(data.avatar);

  return data;
}

export function communityInfoQueryOptions({ communityName, augment = {} } = {}) {
  return queryOptions({
    queryKey: ["community-info", { communityName }],
    queryFn: () => getCommunityInfo(communityName),
    ...augment,
  });
}

async function getCommunityLeaderboard(communityId, offset, limit) {
  const res = await api.post(`/community/${communityId}/leaderboard`, { offset, limit });
  return res.data;
}

async function getSubmissions() {
  const res = await api.get(`/user/info/submissions/0`);
  res.data.sort((submissionA, submissionB) => {
    const at = new Date(submissionA.submitted_at).getTime();
    const bt = new Date(submissionB.submitted_at).getTime();
    return bt - at;
  });
  return res.data;
}

async function getProblemset() {
  const res = await api.get("/problem/all");
  return res.data.map(problem => {
    return {
      ...problem,
      id: problem.pid.toString(),
      accuracy: (+problem.ac_rate * 100).toFixed(2),
    };
  });
}

async function getLastUnsolved() {
  const res = await api.get("/user/info/unsolved-problems");
  return res.data.slice(0, 5);
}

async function getProblemSubmissions(problemSlug) {
  const res = await api.get(`/problem/${problemSlug}/submissions`);
  return res.data;
}

async function getHeatmap(userId, mode) {
  const res = await api.get(`/user/public/${userId}/info/heatmap/` + mode);

  return res.data;
}

export function leaderboardQueryOptions({ communityId, offset, limit, augment = {} } = {}) {
  return queryOptions({
    queryKey: ["leaderboard", { communityId, offset, limit }],
    queryFn: () => getCommunityLeaderboard(communityId, offset, limit),
    ...augment,
  });
}

export function submissionsQueryOptions({ username, augment = {} } = {}) {
  return queryOptions({
    queryKey: ["submissions", username],
    queryFn: () => getSubmissions(),
    ...augment,
  });
}

export function problemSubmissionsQueryOptions({ username, problemSlug, augment = {} }) {
  return queryOptions({
    queryKey: ["problem-submissions", username, problemSlug],
    queryFn: () => getProblemSubmissions(problemSlug),
    ...augment,
  });
}

export function lastUnsolvedQueryOptions({ username, augment = {} } = {}) {
  return queryOptions({
    queryKey: ["last-unsolved", username],
    queryFn: () => getLastUnsolved(),
    ...augment,
  });
}

export function problemsetQueryOptions({ augment = {} } = {}) {
  return queryOptions({
    queryKey: ["problemset"],
    queryFn: () => getProblemset(),
    ...augment,
  });
}

export function heatmapQueryOptions({ userId, mode, augment = {} }) {
  return queryOptions({
    queryKey: ["heatmap", userId, mode],
    queryFn: () => getHeatmap(userId, mode),
    ...augment,
  });
}
