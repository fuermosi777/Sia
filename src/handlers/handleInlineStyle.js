import { getCurrent, changeCurrentInlineStyle } from '../utils';
import { BOLD, ITALIC, CODE, STRIKETHROUGH } from '../regex';

export default function handleInlineStyle(editorState, character) {
  const { text } = getCurrent(editorState);
  const line = `${text}${character}`;

  let newEditorState = editorState;

  // bold
  let styleMap = { BOLD, ITALIC, CODE, STRIKETHROUGH };
  Object.keys(styleMap).some(k => {
    styleMap[k].some(re => {
      let matchArr;
      do {
        matchArr = re.exec(line);
        if (matchArr) {
          newEditorState = changeCurrentInlineStyle(
            newEditorState,
            matchArr,
            k,
            character
          );
        }
      } while (matchArr);
      return newEditorState !== editorState;
    });
    return newEditorState !== editorState;
  });

  return newEditorState;
};