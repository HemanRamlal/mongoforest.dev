import api from '../api/axios';

const cache = new Map();
export async function getAvatarURL(avatarUUID){
  if(cache.has(avatarUUID)){
    console.log(`Cache hit for ${avatarUUID}`);
    return cache.get(avatarUUID);
  }
  console.log(`cache miss for ${avatarUUID}`);
  try {
    const res = await api.get(
      `/s3/downloadBlob?link=${encodeURIComponent("img/"+avatarUUID)}&type=${encodeURIComponent("image/jpeg")}`,
      { responseType: 'blob' }
    );
    cache.set(avatarUUID, URL.createObjectURL(res.data));
    return cache.get(avatarUUID);
  } catch (error) {
    console.log(error.response?.data);
    throw("couldn't resolve avatarUUID to URL");
  }
}
