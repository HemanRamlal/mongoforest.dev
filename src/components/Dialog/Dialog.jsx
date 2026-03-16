import "./Dialog.css";
import { emotions, dialogResults, getDialogsAtom, deleteDialogAtom } from "./Dialog-lib.jsx";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Button({ children, onClick, className }) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

function DialogInteraction({ dialog, inputVal, setInputVal }) {
  const { type, uiElements, onResolve } = dialog;
  const setDeleteDialog = useSetAtom(deleteDialogAtom);

  function handleReject() {
    const result = type == "prompt" ? null : false;
    dialogResults.set(dialog.id, result);
    setDeleteDialog(dialog.id);
    onResolve?.(result);
  }
  function handleAccept() {
    console.log("handling accept");
    const result = type == "prompt" ? inputVal : true;
    dialogResults.set(dialog.id, result);
    setDeleteDialog(dialog.id);
    onResolve?.(result);
  }

  return (
    <div className="dialog-interaction">
      {type == "notify" && (
        <div className="notify-options">
          <Button className="accept" onClick={handleAccept}>
            {uiElements?.accept ?? "Ok"}
          </Button>
        </div>
      )}
      {type == "confirm" && (
        <div className="confirm-options">
          <Button className="reject" onClick={handleReject}>
            {uiElements?.reject ?? "No"}
          </Button>
          <Button className="accept" onClick={handleAccept}>
            {" "}
            {uiElements?.accept ?? "Yes"}
          </Button>
        </div>
      )}
      {type == "prompt" && (
        <>
          <div className="dialog-prompt">
            <input
              type={uiElements?.inputType ?? "text"}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
            />
            <div className="prompt-options">
              <Button className="reject" onClick={handleReject}>
                {uiElements?.reject ?? "Cancel"}{" "}
              </Button>
              <Button className="accept" onClick={handleAccept}>
                {uiElements?.accept ?? "Submit"}{" "}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default function Dialog() {
  /*
  emotion = enum(destructive|constructive|neutral):String
  children = markup for dialog message section
  type = enum(notify|confirm|prompt):String
  uiElements = {reject:String,accept:String,[for type="prompt"]inputType:String}
  onResolve = callback that gets result as its first argument (True/False/[type="prompt"]Response:inputType)
  */
  const dialogs = useAtomValue(getDialogsAtom);

  console.log("There are currently these many dialogs : " + dialogs.length);
  const dialog = dialogs[0];

  const [inputVal, setInputVal] = useState("");
  const setDeleteDialog = useSetAtom(deleteDialogAtom);

  if (dialog === undefined) return null;

  const emotionObj = emotions[dialog.emotion];

  function handleClose() {
    const result = dialog.type == "notify" ? true : dialog.type == "prompt" ? null : false;
    dialogResults.set(dialog.id, result);
    setDeleteDialog(dialog.id);
    dialog.onResolve?.(result);
  }

  return (
    <>
      <div className="dialog-overlay" />
      <div
        className="dialog"
        style={{
          backgroundColor: emotionObj.bg,
        }}
      >
        <div className="dialog-close" onClick={handleClose}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <div className="dialog-title">
          <div
            className="dialog-title-icon"
            style={{
              color: emotionObj.fg,
            }}
          >
            <FontAwesomeIcon icon={emotionObj.icon} />
          </div>
          <div className="dialog-title-text">{dialog.title}</div>
        </div>
        <div className="dialog-message">{dialog.message}</div>
        <DialogInteraction dialog={dialog} inputVal={inputVal} setInputVal={setInputVal} />
      </div>
    </>
  );
}
