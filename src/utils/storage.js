export function setToLS(key, value){
  window.localStorage.setItem(key, JSON.stringify(value));
}
export function getFromLS(key){
  const value = window.localStorage.getItem(key);
  if(value){
    return JSON.parse(value);
  }
}