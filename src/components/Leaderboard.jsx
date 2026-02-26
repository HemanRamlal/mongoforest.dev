import { useState, useEffect, use } from "react";
import { useLocation, useNavigate } from "react-router";
import { getUserAtom } from "../atoms/user";
import { pushToast } from "./Toasts/Toasts";
import { useAtomValue } from "jotai";
import api from "../api/axios";
import {
  faCheck,
  faPencil,
  faGavel,
  faCrown,
  faUserPlus,
  faUserMinus,
  faArrowRightFromBracket,
  faRightToBracket,
  faHourglass,
} from "@fortawesome/free-solid-svg-icons";
import ControlButton from "./ControlButton";
import CommunityFallback from "./fallbacks/CommunityFallback";
import LinearProgress from "@mui/material/LinearProgress";
import LeaderboardFallback from "./fallbacks/LeaderboardFallback";
import "./Leaderboard.css";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditAvatar from "./EditAvatar";
import { communityInfoQueryOptions, leaderboardQueryOptions } from "../hooks/queryOptions";
import { useQuery } from "@tanstack/react-query";
import { useToastMutation } from "../hooks/toastHooks";
/*
Handle stale data
*/

export default function Leaderboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const getUser = useAtomValue(getUserAtom);
  const [adminMode, setAdminMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isMember, setIsMember] = useState(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(location.pathname.split("/").at(-1));
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(9999);
  const communityName = location.pathname.split("/").at(-1);

  const communityInfoQuery = useQuery(
    communityInfoQueryOptions({
      communityName,
    })
  );
  const communityInfo = communityInfoQuery.data;
  console.log(communityInfo);

  const leaderboardQuery = useQuery(
    leaderboardQueryOptions({
      communityId: communityInfoQuery.data?.id,
      offset,
      limit,
      augment: {
        enabled: !!communityInfoQuery.data,
      },
    })
  );
  const thisLeaderboardId = [
    "leaderboard",
    {
      communityId: communityInfo?.id,
      offset,
      limit,
    },
  ];

  console.log(leaderboardQuery.data);
  if (leaderboardQuery.data) {
    for (const user of leaderboardQuery.data) {
      const isAdmin = communityInfo.admins.includes(user.user_id);
      user.is_admin = isAdmin;
    }
  }

  async function demoteToMemberMutationFn({ toDemote }) {
    const res = await api.post(`/community/${communityInfo.id}/edit/removeAdmin/${toDemote}`, {});
    return {
      code: res.status,
      ...res.data,
    };
  }

  async function promoteToAdminMutationFn({ toPromote }) {
    const res = await api.post(`/community/${communityInfo.id}/edit/addAdmin/${toPromote}`, {});
    return {
      code: res.status,
      ...res.data,
    };
  }
  async function communityInfoMutator(variables, { client }) {
    const communityInfo = client.getQueryData(["community-info", { communityName }]);

    if (!communityInfo) {
      throw {
        code: 400,
        title: "Community Information not populated",
      };
    }

    if (variables.avatar) {
      const formData = new FormData();
      formData.append("avatar", variables.avatar);
      const res = await api.post(
        `/community/${communityInfoQuery.data.id}/edit/changeAvatar`,
        formData
      );
      return res.data;
    }

    if (variables.name) {
      setEditingName(false);
      await api.post(`/community/${communityInfo.id}/edit/name`, { name: variables.name });
      return;
    } else if (variables.toDemote) {
      return await demoteToMemberMutationFn(variables);
    } else if (variables.toPromote) {
      return await promoteToAdminMutationFn(variables);
    }
  }

  async function onCommunityInfoMutate(variables, { client }) {
    client.cancelQueries({
      queryKey: ["community-info", { communityName }],
    });

    const communityInfo = client.getQueryData(["community-info", { communityName }]);

    const rollback = {};
    if (variables.avatar) {
      rollback.avatar = communityInfo.avatar;
      communityInfo.avatar = URL.createObjectURL(variables.avatar);
    } else if (variables.name) {
      rollback.name = communityInfo.name;
      communityInfo.name = variables.name;
    } else if (variables.toDemote) {
      rollback.addAdmin = variables.toDemote;
      communityInfo.admins = communityInfo.admins.filter(id => id != variables.toDemote);
    } else if (variables.toPromote) {
      rollback.removeAdmin = variables.toPromote;
      communityInfo.admins.push(variables.toPromote);
    }

    client.setQueryData(["community-info", { communityName }], communityInfo);
    return rollback;
  }
  async function onCommunityInfoError(err, variables, rollback, { client }) {
    console.log("some error bruv wtf");
    console.log(err);
    const communityInfo = client.getQueryData(["community-info", { communityName }]);

    console.log("here is the rollback" + JSON.stringify(rollback));
    if (rollback.avatar) {
      communityInfo.avatar = rollback.avatar;
    }
    if (rollback.name) {
      communityInfo.name = rollback.name;
    }
    if (rollback.addAdmin) {
      if (!communityInfo.admins.includes(rollback.addAdmin))
        communityInfo.admins.push(rollback.addAdmin);
    } else if (rollback.removeAdmin) {
      communityInfo.admins = communityInfo.admins.filter(id => id != rollback.removeAdmin);
    }

    client.setQueryData(["community-info", { communityName }], communityInfo);
  }
  async function onCommunityInfoSettled(data, err, variables, onMutateResult, { client }) {
    if (client.isMutating(["community-info", communityName]) != 1) return;

    client.invalidateQueries(["community-info", { communityName }]);
  }

  const avatarMutation = useToastMutation({
    mutationKey: ["community-info", communityName, "avatar"],
    mutationFn: communityInfoMutator,
    onMutate: onCommunityInfoMutate,
    onError: onCommunityInfoError,
    onSuccess: (data, variables, onMutateResult, { client }) => {
      pushToast({
        code: 200,
        title: "Updated this community's avatar",
      });
    },
    onSettled: onCommunityInfoSettled,
  });

  const nameMutation = useToastMutation({
    mutationKey: ["community-info", communityName, "name"],
    mutationFn: communityInfoMutator,
    onMutate: onCommunityInfoMutate,
    onError: onCommunityInfoError,
    onSuccess: (data, variables) => {
      navigate(`/leaderboard/${variables.name}`);
      pushToast({
        code: 200,
        title: "Changed community name",
      });
    },
    onSettled: onCommunityInfoSettled,
  });

  async function addMemberMutationFn({ newMemberName }) {
    const userRes = await api.get(`/user/public/${newMemberName}/info`);
    const user = userRes.data;

    const res = await api.post(`/community/${communityInfo.id}/edit/addMember/${user.id}`, {});
    return {
      code: res.status,
      ...res.data,
    };
  }
  async function kickMemberMutationFn({ kickeeId }) {
    const res = await api.post(`/community/${communityInfo.id}/edit/removeMember/${kickeeId}`, {});
    return {
      code: res.status,
      ...res.data,
    };
  }

  async function exitCommunityMutationFn() {
    const res = await api.post(`/user/edit/exit-community`, { communityId: communityInfo.id });
    return {
      code: res.status,
      ...res.data,
    };
  }

  async function joinCommunityMutationFn() {
    const res = await api.post(`/user/edit/join-community`, { communityId: communityInfo.id });
    return {
      code: res.status,
      ...res.data,
    };
  }
  async function leaderboardMutator(variables, { client }) {
    const communityInfo = client.getQueryData(["community-info", { communityName }]);
    if (!communityInfo)
      throw {
        title: "Cant be a leaderboard without community info populated",
      };

    if (variables.newMemberName) {
      return await addMemberMutationFn(variables);
    } else if (variables.kickeeId) {
      return await kickMemberMutationFn(variables);
    } else if (variables.exitCommunity) {
      return await exitCommunityMutationFn();
    } else if (variables.joinCommunity) {
      return await joinCommunityMutationFn();
    }
  }

  async function onLeaderboardMutate(variables, { client }) {
    const communityInfo = client.getQueryData(["community-info", { communityName }]);
    console.log("communityInfo is ", JSON.stringify(communityInfo, null, 2));

    if (!communityInfo)
      throw {
        title: "Can't have leaderboard with no community info",
      };

    client.cancelQueries({
      queryKey: thisLeaderboardId,
    });

    const leaderboard = client.getQueryData(thisLeaderboardId);

    let newLeaderboard, rollback;
    if (variables.newMemberName) {
      return { newMemberName };
    } else if (variables.kickeeId) {
    } else if (variables.exitCommunity) {
    } else if (variables.joinCommunity) {
    }

    client.setQueryData(thisLeaderboardId, newLeaderboard);
    return rollback;
    //rank, score, avatar faHourglass
    //user_id, username
    //  leaderboard.
  }
  async function onLeaderboardError(err, variables, onMutateResult, { client }) {
    console.log("leaderboard error bro");
    let toAdd = [],
      toDel = [];
    if (variables.newMemberName) {
      console.log("This error in addMemberMutation");
      console.log(err);
    } else if (variables.kickeeId) {
    } else if (variables.exitCommunity) {
    } else if (variables.joinCommunity) {
    }

    const leaderboard = client.getQueryData(thisLeaderboardId);
    let newLeaderboard = leaderboard;

    const existingIds = new Set();
    for (const entry of newLeaderboard) existingIds.add(entry.user_id);

    for (const toAdd_entry of toAdd) {
      if (existingIds.has(toAdd_entry.user_id)) continue;
      newLeaderboard.push(toAdd_entry);
      existingIds.add(toAdd_entry.user_id);
    }

    newLeaderboard = newLeaderboard.filter(
      entry => !toDel.some(toDel_entry => toDel_entry.user_id == entry.user_id)
    );

    newLeaderboard.sort((a, b) => {
      const comp = a.rank - b.rank;
      if (comp != 0) return comp;

      return a.username.localeCompare(b.username);
    });

    client.setQueryData(thisLeaderboardId, newLeaderboard);
  }
  async function onLeaderboardSuccess(data, variables, onMutateResult, { client }) {
    const leaderboard = client.getQueryData(thisLeaderboardId);
    let newLeaderboard = leaderboard;

    if (variables.kickeeId) {
      newLeaderboard = newLeaderboard.filter(user => user.user_id != variables.kickeeId);
    }

    pushToast(data);
    client.setQueryData(thisLeaderboardId, newLeaderboard);
    if (client.isMutating(thisLeaderboardId) != 1) return;

    return await client.invalidateQueries(thisLeaderboardId);
  }
  async function onLeaderboardSettled(data, err, variables, onMutateResult, { client }) {
    if (variables.newMemberName) {
      setNewMemberName("");
    }
    if (data) return;
    if (client.isMutating(thisLeaderboardId) != 1) return;

    client.invalidateQueries(thisLeaderboardId);
  }
  const addMemberMutation = useToastMutation({
    mutationKey: [...thisLeaderboardId, "addMember"],
    mutationFn: leaderboardMutator,
    onMutate: onLeaderboardMutate,
    onError: onLeaderboardError,
    onSuccess: onLeaderboardSuccess,
    onSettled: onLeaderboardSettled,
  });

  const kickMemberMutation = useToastMutation({
    mutationKey: [...thisLeaderboardId, "kickMember"],
    mutationFn: leaderboardMutator,
    onMutate: onLeaderboardMutate,
    onError: onLeaderboardError,
    onSuccess: onLeaderboardSuccess,
    onSettled: onLeaderboardSettled,
  });

  const demoteToMemberMutation = useToastMutation({
    mutationKey: ["community-info", communityName, "demoteToMember"],
    mutationFn: communityInfoMutator,
    onMutate: onCommunityInfoMutate,
    onError: onCommunityInfoError,
    onSuccess: () => {},
    onSettled: onCommunityInfoSettled,
  });

  const promoteToAdminMutation = useToastMutation({
    mutationKey: ["community-info", communityName, "promoteToAdmin"],
    mutationFn: communityInfoMutator,
    onMutate: onCommunityInfoMutate,
    onError: onCommunityInfoError,
    onSuccess: () => {},
    onSettled: onCommunityInfoSettled,
  });

  const joinCommunityMutation = useToastMutation({
    mutationKey: ["leaderboard", thisLeaderboardId, "joinCommunity"],
    mutationFn: leaderboardMutator,
    onMutate: onLeaderboardMutate,
    onError: onLeaderboardError,
    onSuccess: onLeaderboardSuccess,
    onSettled: onLeaderboardSettled,
  });

  const exitCommunityMutation = useToastMutation({
    mutationKey: ["leaderboard", thisLeaderboardId, "communityMembership"],
    mutationFn: leaderboardMutator,
    onMutate: onLeaderboardMutate,
    onError: onLeaderboardError,
    onSuccess: onLeaderboardSuccess,
    onSettled: onLeaderboardSettled,
  });

  useEffect(() => {
    if (!communityInfoQuery.data) return;
    if (
      communityInfoQuery.data.admins &&
      communityInfoQuery.data.admins.includes(getUser ? getUser.id : "dummy")
    ) {
      console.log(`Making admin mode view for ${JSON.stringify(communityInfoQuery.data, null, 2)}`);
      setIsAdmin(true);
      setAdminMode(true);
    } else {
      setAdminMode(false);
      setIsAdmin(false);
    }
  }, [communityInfoQuery.data]);
  useEffect(() => {
    if (!leaderboardQuery.data) return;
    setIsMember(getUser && leaderboardQuery.data.some(user => user.user_id == getUser.id));
  }, [leaderboardQuery.data]);

  function handleAddUserKeyDown(e) {
    if (e.key === "Enter")
      addMemberMutation.mutate({
        newMemberName: newMemberName,
      });
  }

  function handleCommunityNameFieldEnter(e) {
    if (e.key == "Enter") {
      nameMutation.mutate();
    }
  }

  return (
    <>
      {communityInfoQuery.isPending && <CommunityFallback />}
      {communityInfoQuery.isSuccess && (
        <div className="leaderboard-page">
          <div className="leaderboard-banner">
            {adminMode && (
              <EditAvatar
                avatarURL={communityInfoQuery.data.avatar}
                onAvatarChange={avatarMutation.mutate}
                loading={avatarMutation.isPending}
              />
            )}
            {!adminMode && <img src={communityInfoQuery.data.avatar} />}
            {!editingName && (
              <div
                className="leaderboard-community-name"
                onClick={() => {
                  if (adminMode) setEditingName(true);
                }}
              >
                {communityInfoQuery.data.name} Leaderboard
                {adminMode && (
                  <sup className="leaderboard-community-name-edit-pencil">
                    <FontAwesomeIcon icon={faPencil} />
                  </sup>
                )}
              </div>
            )}
            {editingName && (
              <div className="leaderboard-community-name-edit-wrap">
                <input
                  autoFocus
                  className="leaderboard-community-name"
                  value={draftName}
                  onChange={e => {
                    setDraftName(e.target.value);
                  }}
                  onKeyDown={handleCommunityNameFieldEnter}
                />
                <button
                  className="leaderboard-community-name-edit"
                  onClick={() => {
                    nameMutation.mutate({ name: draftName });
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
            )}
          </div>

          <div className="leaderboard-user-controls">
            {isAdmin && (
              <div className="community-add-member">
                <input
                  type="text"
                  placeholder="New member's username"
                  value={newMemberName}
                  disabled={addMemberMutation.isPending}
                  onChange={e => {
                    setNewMemberName(e.target.value);
                  }}
                  onKeyDown={handleAddUserKeyDown}
                />
                <div
                  className={`add-member-submit ${addMemberMutation.isPending && "add-member-submit-disabled"}`}
                  onClick={
                    addMemberMutation.isPending
                      ? null
                      : () => addMemberMutation.mutate({ newMemberName })
                  }
                >
                  <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>{" "}
                  {addMemberMutation.isPending ? "Adding User" : "Add User"}
                </div>
              </div>
            )}
            {/* isMember ? leave | join community */}
          </div>
          {(isAdmin || isMember) && (
            <div className="leaderboard-user-info">
              {communityInfoQuery.data.name != "global" && (
                <span>
                  You are <b> {isAdmin ? "an admin" : "a standard"} </b> {isMember && " member "} of
                  this community{" "}
                </span>
              )}
              {isMember == true && communityInfoQuery.data.name != "global" && (
                <ControlButton
                  disabled={exitCommunityMutation.isPending}
                  className={`community-leave`}
                  onClick={() => exitCommunityMutation.mutate({ exitCommunity: true })}
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  {exitCommunityMutation.isPending ? "Exiting Community" : "Exit Community"}
                </ControlButton>
              )}
              {isMember == false && (
                <ControlButton
                  className={`community-join`}
                  disabled={joinCommunityMutation.isPending}
                  onClick={() => joinCommunityMutation.mutate({ joinCommunity: true })}
                >
                  <FontAwesomeIcon icon={faRightToBracket} />
                  {joinCommunityMutation.isPending ? "Joining Community" : "Join Community"}
                </ControlButton>
              )}
            </div>
          )}
          <div className="leaderboard-main">
            <div className="leaderboard-main-header">
              <div className="leaderboard-main-header-rank">Rank</div>
              <div className="leaderboard-main-header-username">Username</div>
              <div className="leaderboard-main-header-score">Score</div>
            </div>
            {!leaderboardQuery.isPending && leaderboardQuery.isFetching && (
              <>
                <div class="leaderboard-progress-container">
                  <LinearProgress sx={{ width: "100%" }} />
                </div>
                <span>
                  {/*Because LinearProgress alone messes up odd even colors of .leaderboard-main-row's*/}
                </span>
              </>
            )}
            {leaderboardQuery.isPending && <LeaderboardFallback />}
            {leaderboardQuery.data &&
              leaderboardQuery.data.map(user => {
                return (
                  <div
                    className={`leaderboard-main-row`}
                    id={
                      getUser && user.user_id == getUser.id
                        ? "leaderboard-main-row-active-user"
                        : ""
                    }
                  >
                    <div className="leaderboard-item-rank">{user.rank}</div>
                    <div className="leaderboard-item-username">
                      {user.is_admin ? <b>{user.username}</b> : user.username}
                      {adminMode && (
                        <div className="leaderboard-item-username-manage">
                          <ControlButton
                            disabled={
                              kickMemberMutation.isPending &&
                              kickMemberMutation.variables.kickeeId == user.user_id
                            }
                            color={user.is_admin ? "orange" : "darkblue"}
                            onClick={
                              user.is_admin
                                ? () => demoteToMemberMutation.mutate({ toDemote: user.user_id })
                                : () =>
                                    promoteToAdminMutation.mutate({
                                      toPromote: user.user_id,
                                    })
                            }
                          >
                            <FontAwesomeIcon icon={user.is_admin ? faGavel : faCrown} />
                            <span class="leaderboard-item-username-manage-text">
                              {user.is_admin ? "Demote" : "Promote"}
                            </span>
                          </ControlButton>
                          <ControlButton
                            disabled={
                              kickMemberMutation.isPending &&
                              kickMemberMutation.variables.kickeeId == user.user_id
                            }
                            color="red"
                            onClick={async () => {
                              const variables = {
                                kickeeId: user.user_id,
                              };
                              if (user.is_admin) {
                                //Having non-member admins is allowed.
                                //A non-member can still be admin! so just kick isnt enough we have to demote too.
                                //We have to first kick then demote, because if we first demote then self kick wont work
                                let didKick;
                                try {
                                  didKick = await kickMemberMutation.mutateAsync(variables);
                                } catch (e) {
                                  didKick = false;
                                }
                                if (didKick) {
                                  demoteToMemberMutation.mutate({
                                    toDemote: user.user_id,
                                  });
                                }
                              } else {
                                kickMemberMutation.mutate(variables);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faUserMinus} />
                            <span class={`leaderboard-item-username-manage-text`}>
                              {kickMemberMutation.isPending &&
                              kickMemberMutation.variables.kickeeId == user.user_id
                                ? "Kicking"
                                : "Kick"}
                            </span>
                          </ControlButton>
                        </div>
                      )}
                    </div>
                    <div className="leaderboard-item-score">{user.score || 0}</div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}
