import Heatmap from "./components/Heatmap";
import UserCard from "./components/UserCard";
import CommunitiesList from "./components/CommunitiesList";

import {useParams}  from 'react-router';
import "./ProfilePage.css";

export default function ProfilePage(){
  const {username} = useParams();
  return <>
  <div className="container-1-2">
    <div className="left">
      <UserCard username={username}/>
      <CommunitiesList username={username}/>
    </div>
    <div className="right">
      <Heatmap username={username} />
    </div>
  </div>
  </>;
}
