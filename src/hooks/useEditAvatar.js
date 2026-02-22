import { useState } from 'react';

export default function useEditAvatar({
  defaultAvatarURL, defaultAvatarFile
}) {
  const [avatarURL, setAvatarURL] = useState(
    defaultAvatarFile ?
      URL.createObjectURL(defaultAvatarFile) :
      defaultAvatarURL
  );

  const [avatarFile, setAvatarFile] = useState(defaultAvatarFile);

  return [avatarURL, setAvatarURL, avatarFile, setAvatarFile];
}