import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

function EditorOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // when this plugin un-mounts the lexical automatically calls unsubscribe fn and cleans up the useEffect memory
    // so no need to manually call the unsubscribe() here

    return editor.registerUpdateListener(({ editoState }) => {
      // Purpose of this callback: Lexical calls this function every time the editor updates (typing, formatting, etc.)
    });
  }, [editor]);
  return null;
}

export default EditorOnChangePlugin;
