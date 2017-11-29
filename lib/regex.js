"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CODE_BLOCK_START = exports.CODE_BLOCK_START = /^```([\w-]+)?\s*$/;
var CODE_BLOCK_END = exports.CODE_BLOCK_END = /```\s*$/;
var BOLD = exports.BOLD = [/(\*\*([^(?:**)]+)\*\*)/g, /(__([^(?:__)]+)__)/g];

// (?:[^_]|^)             _([^_]+)_     (?!_)
// Start with ^ or non _,   capture    not following _
var ITALIC = exports.ITALIC = [/(?:[^\*]|^)(\*([^*]+)\*)(?!\*)/g, /(?:[^_]|^)(_([^_]+)_)(?!_)/g];

var CODE = exports.CODE = [/(`([^`]+)`)/g];
var STRIKETHROUGH = exports.STRIKETHROUGH = [/(~~([^(?:~~)]+)~~)/g];
var IMAGE = exports.IMAGE = /!\[([^\]]*)]\(([^)"]+)(?: "([^"]+)")?\)/g;
var LINK = exports.LINK = /\[([^\]]+)]\(([^)"]+)(?: "([^"]+)")?\)/g;