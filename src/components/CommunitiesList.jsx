import "./CommunitiesList.css";
import { getAvatarURL } from "../utils/blobUtils";
import { motion } from "motion/react"
import { useState, useEffect, use, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faDoorOpen, faSquarePollHorizontal } from "@fortawesome/free-solid-svg-icons";
import { pushToast } from "./Toasts/Toasts";
import { useQuery, useMutation } from '@tanstack/react-query';
import CommunitiesListFallback from './fallbacks/CommunitiesListFallback';
import { axiosErrToToast, axiosResToToast } from "../hooks/toastObjects";
import LinearProgress from "@mui/material/LinearProgress";
import api from '../api/axios';

function UseComListMutations(username, setMode, setNewComName) {

  async function joinCommunity({ newComName }) {
    let comInfo = await api.get(`/community/getInfo/${newComName}`);

    const res = await api.post(`/user/edit/join-community`, {
      communityId: comInfo.id
    });

    return axiosResToToast(res);
  }

  async function createCommunity({ newComName }){
    const res = await api.post(`/community/create`, { communityName: newComName });

    return axiosResToToast(res);
  }

  async function onSuccess(data, variables, onMutateResult, { client }){
    pushToast(data);
    setMode("view");
    setNewComName("");
    await client.invalidateQueries(['com-list', username]);
  }

  const joinCommunityMutation = useMutation({
    mutationKey: ['com-list', username, 'join-community'],
    mutationFn : joinCommunity,
    onSuccess : onSuccess
  });

  const createCommunityMutation = useMutation({
    mutationKey : ['com-list', username, 'create-community'],
    mutationFn : createCommunity,
    onSuccess : onSuccess
  })

  return {joinCommunityMutation, createCommunityMutation}
}

async function fetchWithToasts(url, reqBody, pushToast) {

  const data = await res.json();
  if (!res.ok) {
    pushToast({
      code: res.status,
      ...data
    });
    console.log(data.e);
    return false;
  }
  return data;
}

function LeaderboardItem({ community }) {
  const variants = {
    initial: {
      scale: 1
    },
    hover: {
      scale: 1.05
    },
    tap: {
      scale: 0.95
    }
  }
  const navigate = useNavigate();
  console.log("hemlo");
  console.log(community);
  return <motion.a
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    onClick={() => {
      navigate(`/leaderboard/${community.name}`);
    }}
    className="community-item">
    <img src={community.avatar} className="community-logo" />
    <motion.div
      variants={variants}
      className="community-name">
      {community.name}
    </motion.div>
    <div className="community-user-stats">
      <div className="rank">#{community.rank}</div>
      <div className="percentile">Top {(100 - community.percentile).toFixed(2)}%</div>
    </div>
  </motion.a>
}

async function fetchUserInfo(username) {
  const res = await api.get(`/user/public/${username}/info`);
  return res.data;
}
async function fetchUserCommunities(user) {
  if (!user) return [];
  let newCommunities = [];
  for (const community of user.communities) {
    console.log(community);
    const [rankRes, percentileRes] = await Promise.all([
      api.get(`/user/public/${user.id}/info/community/rank/${community.id}`),
      api.get(`/user/public/${user.id}/info/community/percentile/${community.id}`)
    ]);
    newCommunities.push({
      ...community,
      rank: rankRes.data.rank,
      percentile: Number(percentileRes.data.percentile).toFixed(2),
      avatar: await getAvatarURL(community.avatar)
    });
  }

  return newCommunities;
}

async function getCommunities(username) {
  const user = await fetchUserInfo(username);
  const newCommunities = fetchUserCommunities(user);
  return newCommunities;
}

export default function CommunitiesList({ username }) {
  const [mode, setMode] = useState("view"); //enum(view, join, create);
  const [newComName, setNewComName] = useState('');

  const { data, error, isPending, isFetching,  isError} = useQuery({
    queryKey: ['com-list', username],
    queryFn: () => getCommunities(username)
  })
  const communities = data;

  const {joinCommunityMutation, createCommunityMutation} = UseComListMutations(username, setMode, setNewComName);

  if (isPending) {
    return <CommunitiesListFallback />
  }




  return (
    <>
      <div className="community">
        <div className="heading">
          <div className="heading-text">Your Communities</div>
          <div className="heading-controls">
            <div className={`view-communities ${mode == "view" ? 'control-active' : ''}`} onClick={() => setMode("view")} title="View my communities">
              <FontAwesomeIcon icon={faSquarePollHorizontal} />
            </div>
            <div className={`join-community ${mode == "join" ? 'control-active' : ''}`} onClick={() => setMode("join")} title="Join a community">
              <FontAwesomeIcon icon={faDoorOpen} />
            </div>
            <div className={`create-community ${mode == "create" ? 'control-active' : ''}`} onClick={() => setMode("create")} title="Create new community">
              <FontAwesomeIcon icon={faCirclePlus} />
            </div>
          </div>
        </div>
        {!isPending && isFetching && <div><LinearProgress sx={{width:"100%"}}/></div>}
        {mode == "view" && <div className="community-list">
          {communities.map(community =>
            <LeaderboardItem key={community.id} community={community} user />)}
        </div>}
        {mode == "join" && <div className="join-community-panel">
          <div className="com-input-box">
            <input type="text" placeholder="Community Name" value={newComName} disabled={joinCommunityMutation.isPending} onChange={(e) => {
              setNewComName(e.target.value);
            }} />
            <div className="com-join-btn" onClick={()=>joinCommunityMutation.mutate({newComName})}>
              <FontAwesomeIcon icon={faDoorOpen} />
              {joinCommunityMutation.isPending ? "Joining" : "Join"}
            </div>
          </div>
          <div className="com-join-info">
            Currently you can only join communities if you already know their name, Community Explorer coming soon!
          </div>
        </div>}
        {mode == "create" && <div className="create-community-panel">
          <div className="com-input-box">
            <input type="text" placeholder="New Community Name" value={newComName} disabled={createCommunityMutation.isPending} onChange={(e) => {
              setNewComName(e.target.value);
            }} />
            <div className="com-create-btn" onClick={()=>createCommunityMutation.mutate({newComName})}>
              <FontAwesomeIcon icon={faCirclePlus} />
              {createCommunityMutation.isPending ? "Creating" : "Create"}
            </div>
          </div>
        </div>}
      </div>
    </>
  );
}