import type { Editor } from "@tiptap/core";

export type MenuBarState = {
  // text style
  isBold: boolean;
  canBold: boolean;
  isItalic: boolean;
  canItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  canStrike: boolean;
  isCode: boolean;
  canCode: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  // color
  currentColor: string | undefined;
  currentHighlightColor: string | undefined;
  isHighlight: boolean;
  // font
  currentFontFamily: string | undefined;
  currentFontSize: string | undefined;
  // headings
  isParagraph: boolean;
  isHeading1: boolean;
  isHeading2: boolean;
  isHeading3: boolean;
  isHeading4: boolean;
  isHeading5: boolean;
  isHeading6: boolean;
  // alignment
  isAlignLeft: boolean;
  isAlignCenter: boolean;
  isAlignRight: boolean;
  isAlignJustify: boolean;
  // blocks
  isBulletList: boolean;
  isOrderedList: boolean;
  isCodeBlock: boolean;
  isBlockquote: boolean;
  // link
  isLink: boolean;
  currentLinkHref: string | undefined;
  // table
  isTable: boolean;
  // history
  canUndo: boolean;
  canRedo: boolean;
};

const empty: MenuBarState = {
  isBold: false,
  canBold: false,
  isItalic: false,
  canItalic: false,
  isUnderline: false,
  isStrike: false,
  canStrike: false,
  isCode: false,
  canCode: false,
  isSubscript: false,
  isSuperscript: false,
  currentColor: undefined,
  currentHighlightColor: undefined,
  isHighlight: false,
  currentFontFamily: undefined,
  currentFontSize: undefined,
  isParagraph: false,
  isHeading1: false,
  isHeading2: false,
  isHeading3: false,
  isHeading4: false,
  isHeading5: false,
  isHeading6: false,
  isAlignLeft: false,
  isAlignCenter: false,
  isAlignRight: false,
  isAlignJustify: false,
  isBulletList: false,
  isOrderedList: false,
  isCodeBlock: false,
  isBlockquote: false,
  isLink: false,
  currentLinkHref: undefined,
  isTable: false,
  canUndo: false,
  canRedo: false,
};

export const menuBarStateSelector = (ctx: { editor: Editor | null }): MenuBarState => {
  const e = ctx.editor;
  if (!e) return empty;

  return {
    isBold: e.isActive("bold"),
    canBold: e.can().chain().toggleBold().run(),
    isItalic: e.isActive("italic"),
    canItalic: e.can().chain().toggleItalic().run(),
    isUnderline: e.isActive("underline"),
    isStrike: e.isActive("strike"),
    canStrike: e.can().chain().toggleStrike().run(),
    isCode: e.isActive("code"),
    canCode: e.can().chain().toggleCode().run(),
    isSubscript: e.isActive("subscript"),
    isSuperscript: e.isActive("superscript"),
    currentColor: e.getAttributes("textStyle").color as string | undefined,
    isHighlight: e.isActive("highlight"),
    currentHighlightColor: e.getAttributes("highlight").color as string | undefined,
    currentFontFamily: e.getAttributes("textStyle").fontFamily as string | undefined,
    currentFontSize: e.getAttributes("textStyle").fontSize as string | undefined,
    isParagraph: e.isActive("paragraph"),
    isHeading1: e.isActive("heading", { level: 1 }),
    isHeading2: e.isActive("heading", { level: 2 }),
    isHeading3: e.isActive("heading", { level: 3 }),
    isHeading4: e.isActive("heading", { level: 4 }),
    isHeading5: e.isActive("heading", { level: 5 }),
    isHeading6: e.isActive("heading", { level: 6 }),
    isAlignLeft: e.isActive({ textAlign: "left" }),
    isAlignCenter: e.isActive({ textAlign: "center" }),
    isAlignRight: e.isActive({ textAlign: "right" }),
    isAlignJustify: e.isActive({ textAlign: "justify" }),
    isBulletList: e.isActive("bulletList"),
    isOrderedList: e.isActive("orderedList"),
    isCodeBlock: e.isActive("codeBlock"),
    isBlockquote: e.isActive("blockquote"),
    isLink: e.isActive("link"),
    currentLinkHref: e.getAttributes("link").href as string | undefined,
    isTable: e.isActive("table"),
    canUndo: e.can().chain().undo().run(),
    canRedo: e.can().chain().redo().run(),
  };
};
