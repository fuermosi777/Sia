## 11.25.2017

For markdown, the last thing we want is two panes --- left is the markdown raw text and the right is the rendered preview, because of the following reasons:

- Markdown is supposed to be a quick and simple syntax for creating. A preview tab makes thing complicated.
- Markdown is raw text, with a syntax of formatting, which should be already a "preview" type.

Therefore, a WYSIWYG mode is a perfect choice for all markdown writers, except for those who want to see the raw text.

There are three level of WYSIWYG for markdown:

1. Color syntax rendering: all raw text are pure text with different color for styles (e.g. Bold, Italic, etc). This is the most common method implemented across all sorts of softwares and apps. And strictly it's not WYSIWYG.
2. Block and inline level rendering: only blocks (headers, blockquote, code blocks) are rendered in different mode. In this level, all block level entities are rendered differently. For example, in [Bear](http://www.bear-writer.com/), when typing "# ", the app will render this block as header one, and apply styles. In [Caret](http://caret.io), text between underscores will be italic, while the underscores are in different color, indicating that they are just markers for italic style.
3. Mixed rendering: in this level, what user see in the screen is exactly the same as they see in preview. No markdown syntax is shown. But the user should be able to modify some entities such as URLs and images.

## 11.26.2017

For Sia, I've considerer all sorts of ways to render the markdown. Finally, I decided to go with level 3, from a perspective of a user. If I (as a user) want to take full control of the text I am writing, I can use level 1 editors. The reason I want a WYSIWYG editor is because I don't want to see things symbols like "[]()__**".


