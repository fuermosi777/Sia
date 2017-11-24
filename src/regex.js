export const CODE_BLOCK_START = /^```([\w-]+)?\s*$/;
export const CODE_BLOCK_END = /```\s*$/;
export const BOLD = [/\*\*([^(?:**)]+)\*\*/g, /__([^(?:__)]+)__/g];
export const ITALIC = [/\*([^*]+)\*/g, /_([^_]+)_/g];
export const CODE = [/`([^`]+)`/g];
export const STRIKETHROUGH = [/~~([^(?:~~)]+)~~/g];
export const IMAGE = /!\[([^\]]*)]\(([^)"]+)(?: "([^"]+)")?\)/g;
export const LINK = /\[([^\]]+)]\(([^)"]+)(?: "([^"]+)")?\)/g;
