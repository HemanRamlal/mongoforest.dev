import { faEdit, faHourglass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './EditAvatar.css';

export default function EditAvatar({
  avatarURL, onAvatarChange,
  loading
}) {
  async function trackFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    await onAvatarChange({avatar : file});
    e.target.value=null;
  }

  if(loading) console.log("Loading Avatar");
  else console.log("Avatar Loaded");
  return (
    <div
      className="editable-avatar">
      {loading &&
      <div className="editable-avatar-loading-overlay">
        <FontAwesomeIcon icon={faHourglass} />
      </div>}
      <input className="editable-avatar-input" type="file" disabled={loading} onChange={trackFile} />
      <img className="editable-avatar-img" src={avatarURL} alt="" />
      <div className='editable-avatar-indicator'>
        <FontAwesomeIcon icon={faEdit} />
      </div>
    </div>
  );
}