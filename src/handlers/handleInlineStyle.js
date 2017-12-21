import { getCurrent, changeCurrentInlineStyle } from '../utils';
import { BOLD_STAR, BOLD_UNDERSCORE, ITALIC_STAR, ITALIC_UNDERSCORE, CODE, STRIKETHROUGH } from '../regex';

export default function handleInlineStyle(editorState, character) {
  const { text, selection } = getCurrent(editorState);
  const position = selection.getAnchorOffset();
  const line = [text.slice(0, position), character, text.slice(position)].join('');

  let newEditorState = editorState;

  let styleMap = { BOLD_STAR, BOLD_UNDERSCORE, ITALIC_STAR, ITALIC_UNDERSCORE, CODE, STRIKETHROUGH };

  Object.keys(styleMap).some(k => {
    let re = styleMap[k];

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

  return newEditorState;
};
