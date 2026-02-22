import CodeMirror from '@uiw/react-codemirror';
import { lineNumbers } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { basicSetup } from "codemirror";


const fixedHeightEditor = EditorView.theme({
  "&": { height: "300px" },
  ".cm-scroller": { overflow: "auto" }
});

export function ReadOnlyEditor({ content, onChange }) {
  return <CodeMirror
    value={content}
    basicSetup={true}
    theme={vscodeLight}
    extensions={[
      lineNumbers(),
      javascript(),
      EditorState.readOnly.of(true),
      fixedHeightEditor,
      EditorView.editable.of(false)
    ]}
    onChange={onChange}
  />
}

export function FullEditor({ content, onChange }) {
  return <CodeMirror
    value={content}
    basicSetup={true}
    theme={vscodeLight}
    extensions={[
      lineNumbers(),
      javascript(),
      fixedHeightEditor,
    ]}
    onChange={onChange}
  />
}