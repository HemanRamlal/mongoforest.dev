import { atom, getDefaultStore } from "jotai";
import {
  faTriangleExclamation,
  faCircleCheck,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

export const emotions = {
  destructive: {
    bg: "rgba(252, 237, 237, 1)",
    fg: "rgba(180, 10, 10, 1)",
    icon: faTriangleExclamation,
  },
  constructive: {
    bg: "rgba(237, 249, 240, 1)",
    fg: "rgba(10, 139, 107, 1)",
    icon: faCircleCheck,
  },
  neutral: {
    bg: "rgba(237, 245, 255, 1)",
    fg: "rgba(10, 110, 180, 1)",
    icon: faCircleInfo,
  },
};

const dialogsBaseAtom = atom([]);
export const dialogResults = new Map();

export const getDialogsAtom = atom(get => get(dialogsBaseAtom));

export const deleteDialogAtom = atom(null, (get, set, dialogId) => {
  set(dialogsBaseAtom, oldDialogsBaseAtom => {
    return oldDialogsBaseAtom.filter(dialog => dialog.id != dialogId);
  });
});

function setupDialog(dialog) {
  dialog.id = crypto.randomUUID();
  dialog.title ??= "";
  dialog.message ??= "";

  dialog.emotion ??= "neutral";
  if (!["constructive", "destructive", "neutral"].includes(dialog.emotion)) {
    throw new Error("Invalid emotion, Supported emotions : constructive, destructive, neutral");
  }

  dialog.type ??= "notify";
  if (!["notify", "confirm", "prompt"].includes(dialog.type)) {
    throw new Error("Invalid type, Supported types : notify, confirm, prompt");
  }

  if (!dialog.onResolve && dialog.type != "notify") {
    throw new Error("onResolve callback is required for confirm and prompt dialog types");
  }

  dialog.uiElements ??= {
    accept: "Accept",
    reject: "Reject",
  };
  dialog.uiElements.accept ??= "Accept";
  dialog.uiElements.reject ??= "Reject";

  if (dialog.type == "prompt") {
    dialog.uiElements.inputType ??= "text";
  }
}

export async function pushDialog(dialog) {
  /*
  document this neatly: inside dialog
    dialog : {
      emotion : enum("destructive", "constructive", "netural"),
      children : JSX,
      type : enum("notify", "confirm", "prompt"),
      uiElements : {
        reject : [String],
        accept : [String],
        [type=='prompt']inputType : [String]
      },
      onResolve : func(arg = enum('True', 'False', response:inputType)){
      }
    }
  */
  const err = new Error();
  const stack = err.stack;

  const callerLine = stack.split("\n")[2]; // caller frame
  console.log("dialog caller " + callerLine);
  const defaultStore = getDefaultStore();

  setupDialog(dialog);

  defaultStore.set(dialogsBaseAtom, oldDialogs => [...oldDialogs, dialog]);

  return await new Promise(resolve => {
    const intervalId = setInterval(() => {
      if (dialogResults.has(dialog.id)) {
        clearInterval(intervalId);
        resolve(dialogResults.get(dialog.id));
      }
    }, 100);
  });
}
