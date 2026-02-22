import { Outlet } from "react-router";
import { useParams } from 'react-router';

export default function ProfileContainer(){
  const {username} = useParams();
  return <>
    <Outlet />
  </>;
}
