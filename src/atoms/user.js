import { atom } from 'jotai';
import { getFromLS, setToLS } from '../utils/storage.js';
import api from '../api/axios';

export const userAtom = atom(getFromLS('user') || null);
export const getUserAtom = atom(
  (get) => get(userAtom)
)
export const setUserAtom = atom(
  null,
  (get, set, newUser) => {
    set(userAtom, newUser);
    setToLS('user', newUser);
  }
)

export const refreshUserAtom = atom(
  null,
  async function (get, set){
    try {
      const res = await api.get(`/auth/check`);
      const {signedIn, ...user} = res.data;
      if(!signedIn){
        set(userAtom, null);
        setToLS('user', null);
      } else {
        set(userAtom, user);
      setToLS('user', user);
    }
    } catch(e){
      console.log('refresh-user failed');
      console.log(e);
    }
  }
);