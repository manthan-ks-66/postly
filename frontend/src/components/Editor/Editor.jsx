import { $getRoot, $getSelection } from "lexical";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ToolbarPlugin from "./EditorTools/ToolbarPlugin.jsx";
import "./Editor.css";

const theme = {
  paragraph: "editor-paragraph",
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

function EditorPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        console.log(editor.getEditorState());
      });
    });
  }, [editor]);

  return null;
}

function Editor({ control, name = "content" }) {
  const initialConfig = {
    namespace: "PostEditor",
    theme,
    onError,
  };

  const [editorState, setEditorState] = useState();

  return (
    <div className="editor-shell">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-toolbar-wrapper">
              <ToolbarPlugin />
            </div>

            <div className="editor-inner">
              <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                ErrorBoundary={LexicalErrorBoundary}
                placeholder={
                  <div className="editor-placeholder">Write What You Think</div>
                }
              />
              <EditorPlugin />
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          </LexicalComposer>
        )}
      />
    </div>
  );
}

export default Editor;
