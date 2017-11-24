import { getCurrent } from '../utils';
import { RichUtils } from "draft-js";

export default function handleExitBlock(editorState) {
  let { type } = getCurrent(editorState);

  return RichUtils.toggleBlockType(editorState, type);
};
