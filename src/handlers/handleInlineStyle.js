import { getCurrent, changeCurrentInlineStyle } from '../utils';
import { BOLD, ITALIC, CODE, STRIKETHROUGH } from '../regex';

export default function handleInlineStyle(editorState, character) {
  const { text, selection } = getCurrent(editorState);
  const position = selection.getAnchorOffset();
  const line = [text.slice(0, position), character, text.slice(position)].join('');

  let newEditorState = editorState;

  // bold
  let styleMap = { BOLD, ITALIC, CODE, STRIKETHROUGH };
  Object.keys(styleMap).some(k => {
    styleMap[k].some(re => {
      let matchArr;
      do {
        matchArr = re.exec(line);
        console.log(line)
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
