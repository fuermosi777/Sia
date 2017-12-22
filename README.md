# Sia

A react component of WYSIWYG editor for Markdown syntax based on [Draft.js](https://draftjs.org/).

## Block level styling

- Header 1 ~ 6
- Blockquote
- Ordered and unordered list
- Code block <pre/>

- HR

- YAML front-matter

Use `handleBeforeInput` and change block type

## Inline level styling

- Bold
- Italic
- Strikethrough

- Code

- Tags ~ <kbd></kbd>

Should use decorator

## Other stuff

- Image
- Link
- Table

Entity + decorator 

# TODO

GFM mode: 123_123_123 vs 123 _123_ 123

escape \*\*

add __ __ in text will remove the later space

blockquote add return before should insert \n?

blockquote return should just insert \n

hr

indention on list

copy and paste html

image

link - replace link in middle text will lose after

```1231```