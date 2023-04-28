import React, { useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import Title from "./Title/title";
import { ReactDOM } from "react";
import { convertToRaw, Editor, EditorState, RichUtils, DraftInlineStyle, ContentState, Modifier} from "draft-js";
import "draft-js/dist/Draft.css";
import InlineStyleControls, { inlineStyles } from "./InlineStylesControls";

// import { applyInlineStyle } from "draft-js-modifiers";

function App() {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );


    const handleEditorChange = (newState: any) => {
        setEditorState(newState);
        const rawContentState = convertToRaw(newState.getCurrentContent());
        let text = rawContentState.blocks[0].text;
        let subString, subString2, subString3;
        if(text.length > 1)
          subString = text.substring(text.length-2, text.length);
        subString2 = text.substring(text.length-3, text.length);
        subString2 = text.substring(text.length-3, text.length);
        if(subString == "* ")
          delteLastCharacters(2, text, "BOLD");
        else if(subString == "# ")
          delteLastCharacters(2, text, "FONT_SIZE_30");
        console.log(subString);
    }

    const delteLastCharacters = (len: number, text: string, style: string) => {
        toggleInlineStyle(style);
        const currentInlineStyle = editorState.getCurrentInlineStyle;
        text = `${text.slice(0, text.length-len)}`;
        console.log(text);

        const contentState  = editorState.getCurrentContent();
        const selectionState  = editorState.getSelection();
        const lastTwoChars = contentState.getBlockForKey(selectionState.getAnchorKey())
                          .getText()
                          .slice(len * -1 + 1);

        const newSelection = selectionState.merge({
          anchorOffset: selectionState.getFocusOffset() - len + 1,
          focusOffset: selectionState.getFocusOffset(),
        })
        const newContentState = Modifier.replaceText(
          contentState,
          newSelection,
          '',
        );
        
        // Create a new EditorState with the new ContentState and selection
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          'remove-range'
        )
        let updatedEditorState = EditorState.forceSelection(
            newEditorState, 
            newContentState.getSelectionAfter()
          );

          const newState = RichUtils.toggleInlineStyle(updatedEditorState, style);
          const newState2 = RichUtils.toggleBlockType(newState, "header-one");
        // updatedEditorState = RichUtils.applyInlineStyle(updatedEditorState, currentInlineStyle, newSelection);
          setEditorState(newState2);
    }

    const editor = useRef<any>(null);
    const focusEditor = () => {
        editor.current?.focus();
    };

    const customStyleMap = {
      STRIKETHROUGH: {
        textDecoration: "line-through"
      },
      FONT_SIZE_30: {
        fontSize: "30px"
      }
    };

    const toggleInlineStyle = (inlineStyle: string) => {
      const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
      const newState2 = RichUtils.toggleBlockType(newState, "header-one");
      setEditorState(newState2);
    };

    return (
        <div className="App">
            <Title />
            <div className="m-10"
                style={{
                    border: "1px solid black",
                    minHeight: "6em",
                    cursor: "text",
                }}
                onClick={focusEditor}
            >
              <InlineStyleControls
                currentInlineStyle={editorState.getCurrentInlineStyle()}
                onToggle={toggleInlineStyle}
              />

                <Editor
                    ref={editor}
                    customStyleMap={customStyleMap}
                    editorState={editorState}
                    onChange={handleEditorChange}
                    placeholder="Write something!"
                />
            </div>
        </div>
    );
}

export default App;
