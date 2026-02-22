/*
Needed features

planned
username : readyonly
firstname : editable
lastname : editable
communities : editable
account : enum(public, private) editable

unplanned
**avatar change
**password change
**email change
*/
import { getUserAtom, refreshUserAtom} from './atoms/user';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { getAvatarURL } from './utils/blobUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faEdit, faHourglass} from '@fortawesome/free-solid-svg-icons';
import api from './api/axios';
import './ProfileEdit.css'
import Button from './components/Button.jsx';
import { pushToast } from './components/Toasts/Toasts';
import useEditAvatar from './hooks/useEditAvatar.js';
import EditAvatar from './components/EditAvatar.jsx';

export default function ProfileEdit() {
  console.log('rendering profile edit');
  const getUser = useAtomValue(getUserAtom);
  const refreshUser = useSetAtom(refreshUserAtom);
  console.log(getUser);

  const [mode, setMode] = useState('editing'); //enum(editing, submitting)
  const [firstName, setFirstName] = useState(getUser.firstname || '');
  const [lastName, setLastName] = useState(getUser.lastname || '');
  const [isPrivate, setIsPrivate] = useState(getUser.is_private);
  const [avatarURL, setAvatarURL, avatarFile, setAvatarFile] = useEditAvatar({
    defaultAvatarURL : 'https://cdn-icons-png.flaticon.com/512/739/739249.png',
    defaultAvatarFile : null
  })

  useEffect(()=>{
    (async function(){
      if(!getUser || !getUser.avatar) return;
      setFirstName(getUser.firstname || '');
      setLastName(getUser.lastname || '');
      setAvatarURL(await getAvatarURL(getUser.avatar));
    })()
  }, [getUser]);

  function trackFirstName(e) {
    setFirstName(e.target.value);
  }
  function trackLastName(e) {
    setLastName(e.target.value);
  }
  function trackPrivacy(e) {
    console.log("privacy set to "+e.target.value);
    setIsPrivate(e.target.value === 'true');
  }
  function trackAvatar(e){
    const file = e.target.files[0];
    if(!file){
      console.log("no files chosen");
      return;
    }

    if(!file.type=="image/jpeg"){
      console.log("non jpeg file chosen");
      return;
    }
    if(file.size > 1024 * 1024){
      console.log("file size greater than 1mb");
      return;
    }
    setAvatarFile(file);
    setAvatarURL(URL.createObjectURL(file));
  }
  function resetChanges() {
    setFirstName(getUser.firstname || '');
    setLastName(getUser.lastname || '');
    setIsPrivate(getUser.is_private);
  }
  async function saveChanges() {
    setMode("submitting");
    let changesMade=false;
    const changed=[];
    
    if (firstName != getUser.firstname) {
      changesMade = true;
      try {
        await api.post(`/user/edit/first-name`, {
          firstName
        });
        changed.push("First Name");
      } catch (error) {
        if (error.response) {
          pushToast({
            code: error.response.status,
            ...error.response.data
          });
        }
      }
    }

    if (lastName != getUser.lastname) {
      changesMade = true;
      try {
        await api.post(`/user/edit/last-name`, {
          lastName
        });
        changed.push("Last Name");
      } catch (error) {
        if (error.response) {
          pushToast({
            code: error.response.status,
            ...error.response.data
          });
        }
      }
    }

    if (isPrivate != getUser.is_private) {
      changesMade = true;
      try {
        await api.post(`/user/edit/toggle-private`, {});
        changed.push("Privacy Settings");
      } catch (error) {
        if (error.response) {
          pushToast({
            code: error.response.status,
            ...error.response.data
          });
        }
      }
    }

    if (avatarFile != null){
      changesMade = true;
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      try {
        await api.post(`/user/edit/avatar`, formData);
        await refreshUser();
        setAvatarFile(null);
        changed.push("Avatar");
      } catch (error) {
        if (error.response) {
          pushToast({
            code: error.response.status,
            ...error.response.data
          });
        }
      }
    }
    
    if(changesMade){
      pushToast({
        code : 200,
        title : "Edited the following successfully",
        message : changed.join(", ")
      });
      await refreshUser();
    } else {
      pushToast({
        code : 400,
        title : "Nothing edited to save"
      });
    }
    setMode('editing');
  }
  return <>
  <div className="edit-profile">
    <EditAvatar 
      avatarURL={avatarURL}
      avatarFile={avatarFile}
      setAvatarURL={setAvatarURL}
      setAvatarFile={setAvatarFile}
    />
      <div className="username-display" title="Username cannot be changed">{getUser.username}</div>
      <div className="editable-section">
        <div className="first-name-wrap">
          <label htmlFor="first-name">First Name : </label>
          <input type="text" name="first-name" id="first-name" placeholder={getUser.firstname} value={firstName} onChange={trackFirstName} />
        </div>
        <div className="last-name-wrap">
          <label htmlFor="last-name">Last Name : </label>
          <input type="text" name="last-name" id="last-name" placeholder={getUser.lastname} value={lastName} onChange={trackLastName} />
        </div>
        <div className="email-wrap" title="Email cannot be changed">
          <label htmlFor="email">Email : </label>
          <input type="text" name="email" id="email" placeholder={getUser.email} value={getUser.email} disabled/>
        </div>
        <div className="account-type-private">
          <label htmlFor="privacy-toggle">Account Visibility:</label>
          <div className="privacy-toggle-wrap">
            <label>
              <input type="radio" name="privacy-toggle" id="pt-public" value="false" checked={!isPrivate} onChange={trackPrivacy} />
              Public
            </label>
            <label>
              <input type="radio" name="privacy-toggle" id="pt-private" value="true" checked={isPrivate} onChange={trackPrivacy} />
              Private
            </label>
          </div>
        </div>
      </div>
      <div className="form-controls">
        <Button className="tertiary" onClick={resetChanges}>Reset Form</Button>
        <Button className={`primary`} disabled={mode=="submitting"} onClick={saveChanges}>
          { mode=="editing" && "Save Changes"}
          { mode=="submitting" && (<>Saving Changes <FontAwesomeIcon icon={faHourglass} /></>)}
          </Button>
      </div>
    </div>
  </>;
}
