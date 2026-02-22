import {atom, getDefaultStore} from 'jotai';
import {
  faCircleInfo,
  faCircleCheck,
  faArrowsRotate,
  faCircleExclamation,
  faTriangleExclamation,
  faEllipsis
} from "@fortawesome/free-solid-svg-icons";

export const useServerCode = {
  bgColorInventory : {
    1 : "rgba(237, 245, 255, 1)",
    2 : "rgba(237, 249, 240, 1)",
    3 : "rgba(236, 250, 248, 1)",
    4 : "rgba(255, 246, 227, 1)",
    5 : "rgba(252, 237, 237, 1)",
  },
  bgColorPlaceholder : "rgba(239, 239, 239, 1)",
  fgColorInventory : {
    1 : "rgba(10, 110, 180, 1)",
    2 : "rgba(10, 139, 107, 1)",
    3 : "rgba(10, 168, 168, 1)",
    4 : "rgba(180, 138, 10, 1)",
    5 : "rgba(180, 10, 10, 1)",
  },
  fgColorPlaceholder : "rgba(176, 176, 176, 1)",
  iconInventory : {
    1 : faCircleInfo,
    2 : faCircleCheck,
    3 : faArrowsRotate,
    4 : faCircleExclamation,
    5 : faTriangleExclamation
  },
  iconPlaceholder : faEllipsis,
  codeToKey : function(code){
    return Math.floor(code/100);
  },
  makeBgColor : function(code){
    const key = this.codeToKey(code);
    return this.bgColorInventory[key] ?? this.bgColorPlaceholder;
  },
  makeFgColor : function(code){
    const key = this.codeToKey(code);
    return this.fgColorInventory[key] ?? this.fgColorPlaceholder;
  },
  makeIcon : function(code){
    const key = this.codeToKey(code);
    return this.iconInventory[key] ?? this.iconPlaceholder;
  }
}

const toastsBaseAtom = atom([]);

export const readToastsAtom = atom(
  (get) => get(toastsBaseAtom)
);

export const deleteToastAtom = atom(
  null, 
  (get, set, toastId) => {
    const newToasts = [...get(toastsBaseAtom)].filter(oldToast => oldToast.id != toastId);
    set(toastsBaseAtom, newToasts);
  }
);
export const insertToastAtom = atom(
  null,
  (get, set, toast) => {
    toast.id = crypto.randomUUID();
    toast.title ??= "";
    toast.message ??= "";

    set(toastsBaseAtom, (oldToasts) => [...oldToasts, toast]);
  }
);

export function pushToast(toast){
  const err = new Error();
  const stack = err.stack;

  const callerLine = stack.split('\n')[2]; // caller frame
  console.log('toast caller '+callerLine);
  const defaultStore = getDefaultStore();

  toast.id = crypto.randomUUID();
  toast.title ??= "";
  toast.message ??= "";

  defaultStore.set(toastsBaseAtom, (oldToasts) => [...oldToasts, toast]);
}