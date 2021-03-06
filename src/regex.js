export const CODE_BLOCK_START = /^```([\w-]+)?\s*$/;
export const CODE_BLOCK_END = /^```\s*$/;
export const BOLD_STAR = /(\*\*([^(?:**)]+)\*\*)/g;
export const BOLD_UNDERSCORE = /(__([^(?:__)]+)__)/g;


// (?:[^_]|^)             _([^_]+)_     (?!_)
// Start with ^ or non _,   capture    not following _
export const ITALIC_STAR = /(?:[^\*]|^)(\*([^*]+)\*)(?!\*)/g;
export const ITALIC_UNDERSCORE = /(?:[^_]|^)(_([^_]+)_)(?!_)/g;

export const CODE = /(`([^`]+)`)/g;
export const STRIKETHROUGH = /(~~([^(?:~~)]+)~~)/g;
export const IMAGE = /!\[([^\]]*)]\(([^)"]+)(?: "([^"]+)")?\)/g;
export const LINK = /\[([^\]]+)]\(([^)"]+)(?: "([^"]+)")?\)/g;
