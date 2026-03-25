"use client";

import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { menuBarStateSelector } from "../../types/menubarStates";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  CodeSquare,
  TextQuote,
  Minus,
  WrapText,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Link,
  Link2Off,
  Image,
  Table,
  Subscript,
  Superscript,
  ChevronDown,
  Type,
  Check,
} from "lucide-react";
import Tooltip from "../ui/Tootip";
import ColorPicker from "./editor/ColorPicker";
import LinkPopover from "./editor/LinkPopover";
import ImagePopover from "./editor/ImagePopover";
import TablePopover from "./editor/TablePopover";

const HIGHLIGHT_COLORS = [
  "#FEF08A",
  "#BBF7D0",
  "#BFDBFE",
  "#FDE68A",
  "#FBCFE8",
  "#DDD6FE",
  "#FED7AA",
  "#ffffff",
];
const TEXT_COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#2563EB",
  "#8B5CF6",
  "#EC4899",
  "#0F172A",
];
const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "monospace" },
  { label: "Sans", value: "sans-serif" },
];

// ─── Portal ───────────────────────────────────────────────────────────────────
const PopoverPortal = ({
  anchorRef,
  children,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    // clamp left so popover doesn't go off-screen
    const left = Math.min(rect.left + window.scrollX, window.innerWidth - 280);
    setPos({ top: rect.bottom + window.scrollY + 4, left: Math.max(8, left) });
  }, [anchorRef]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        portalRef.current &&
        !portalRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      )
        onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  return createPortal(
    <div
      ref={portalRef}
      style={{ position: "absolute", top: pos.top, left: pos.left, zIndex: 9999 }}
    >
      {children}
    </div>,
    document.body
  );
};

// ─── PopoverWrap ──────────────────────────────────────────────────────────────
const PopoverWrap = ({
  id,
  openPopover,
  onToggle,
  onClose,
  button,
  popover,
}: {
  id: string;
  openPopover: string | null;
  onToggle: () => void;
  onClose: () => void;
  button: React.ReactNode;
  popover: React.ReactNode;
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={anchorRef} className="shrink-0">
      <div onClick={onToggle}>{button}</div>
      {openPopover === id && (
        <PopoverPortal anchorRef={anchorRef} onClose={onClose}>
          {popover}
        </PopoverPortal>
      )}
    </div>
  );
};

// ─── PopoverShell ─────────────────────────────────────────────────────────────
const PopoverShell = ({ children, width }: { children: React.ReactNode; width?: number }) => (
  <div
    className="rounded-xl border py-1 overflow-hidden"
    style={{
      backgroundColor: "var(--canvas)",
      borderColor: "var(--border)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      minWidth: width ?? 160,
    }}
  >
    {children}
  </div>
);

// ─── MenuItem ─────────────────────────────────────────────────────────────────
const MenuItem = ({
  icon,
  label,
  onClick,
  isActive,
  danger,
  shortcut,
}: {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  danger?: boolean;
  shortcut?: string;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-mono transition-colors text-left"
    style={{
      color: danger ? "var(--error)" : isActive ? "var(--primary)" : "var(--text-primary)",
      backgroundColor: "transparent",
    }}
    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover)")}
    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
  >
    {icon && <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">{icon}</span>}
    <span className="flex-1">{label}</span>
    {isActive && <Check className="w-3 h-3 shrink-0" style={{ color: "var(--primary)" }} />}
    {shortcut && !isActive && <span className="text-[10px] opacity-40">{shortcut}</span>}
  </button>
);

const MenuDivider = () => (
  <div className="my-1 mx-3 h-px" style={{ backgroundColor: "var(--border)" }} />
);

// ─── IconBtn ──────────────────────────────────────────────────────────────────
const IconBtn = ({
  icon,
  label,
  onClick,
  isActive,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) => (
  <Tooltip label={label}>
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-100 disabled:opacity-25 disabled:cursor-not-allowed shrink-0"
      style={{
        color: isActive ? "var(--primary)" : "var(--text-secondary)",
        backgroundColor: isActive ? "#2563EB12" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive && !disabled) {
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
        }
      }}
    >
      {icon}
    </button>
  </Tooltip>
);

// ─── GroupBtn ─────────────────────────────────────────────────────────────────
const GroupBtn = ({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="h-7 px-2.5 flex items-center gap-1.5 rounded-md transition-all text-[11px] font-mono font-medium shrink-0"
    style={{
      color: isActive ? "var(--primary)" : "var(--text-secondary)",
      backgroundColor: isActive ? "#2563EB12" : "transparent",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover)";
      (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.backgroundColor = isActive
        ? "#2563EB12"
        : "transparent";
      (e.currentTarget as HTMLElement).style.color = isActive
        ? "var(--primary)"
        : "var(--text-secondary)";
    }}
  >
    {icon}
    {label}
    <ChevronDown className="w-3 h-3 opacity-50" />
  </button>
);

const Sep = () => (
  <div className="w-px h-4 mx-0.5 shrink-0" style={{ backgroundColor: "var(--border)" }} />
);

// ─── MenuBar ──────────────────────────────────────────────────────────────────
export const MenuBar = ({ editor }: { editor: Editor }) => {
  const s = useEditorState({ editor, selector: menuBarStateSelector });

  // Single flat state — one popover open at a time
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (name: string) => setOpen((p) => (p === name ? null : name));
  const close = () => setOpen(null);

  if (!editor) return null;

  const currentHeading = s.isHeading1
    ? "H1"
    : s.isHeading2
      ? "H2"
      : s.isHeading3
        ? "H3"
        : s.isHeading4
          ? "H4"
          : s.isHeading5
            ? "H5"
            : s.isHeading6
              ? "H6"
              : "H1";
  const currentAlign = s.isAlignCenter
    ? "Center"
    : s.isAlignRight
      ? "Right"
      : s.isAlignJustify
        ? "Justify"
        : "Left";
  const alignIcon = s.isAlignCenter ? (
    <AlignCenter className="w-3.5 h-3.5" />
  ) : s.isAlignRight ? (
    <AlignRight className="w-3.5 h-3.5" />
  ) : s.isAlignJustify ? (
    <AlignJustify className="w-3.5 h-3.5" />
  ) : (
    <AlignLeft className="w-3.5 h-3.5" />
  );

  return (
    <div
      className="sticky top-0 z-10 border-b rounded-t-md py-1"
      style={{ backgroundColor: "var(--canvas)", borderColor: "var(--border)" }}
    >
      <div className="flex flex-wrap lg:justify-center items-center gap-0.5 px-3 py-1.5">
        {/* ── Text style ── */}
        <IconBtn
          icon={<Bold className="w-3.5 h-3.5" />}
          label="Bold (⌘B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={s.isBold}
          disabled={!s.canBold}
        />
        <IconBtn
          icon={<Italic className="w-3.5 h-3.5" />}
          label="Italic (⌘I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={s.isItalic}
          disabled={!s.canItalic}
        />
        <IconBtn
          icon={<Underline className="w-3.5 h-3.5" />}
          label="Underline (⌘U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={s.isUnderline}
        />
        <IconBtn
          icon={<Strikethrough className="w-3.5 h-3.5" />}
          label="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={s.isStrike}
          disabled={!s.canStrike}
        />
        <IconBtn
          icon={<Code className="w-3.5 h-3.5" />}
          label="Inline code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={s.isCode}
          disabled={!s.canCode}
        />
        <IconBtn
          icon={<Superscript className="w-3.5 h-3.5" />}
          label="Superscript"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={s.isSuperscript}
        />
        <IconBtn
          icon={<Subscript className="w-3.5 h-3.5" />}
          label="Subscript"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={s.isSubscript}
        />

        {/* ── Color ── */}
        <PopoverWrap
          id="textColor"
          openPopover={open}
          onToggle={() => toggle("textColor")}
          onClose={close}
          button={
            <Tooltip label="Text color">
              <button
                className="w-7 h-7 flex flex-col items-center justify-center rounded-md transition-all gap-0.5 shrink-0"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                }
              >
                <Type className="w-3 h-3" />
                <div
                  className="w-3.5 h-[3px] rounded-full"
                  style={{ backgroundColor: s.currentColor ?? "var(--text-primary)" }}
                />
              </button>
            </Tooltip>
          }
          popover={
            <ColorPicker
              colors={TEXT_COLORS}
              current={s.currentColor}
              onSelect={(c) => {
                editor.chain().focus().setColor(c).run();
                close();
              }}
              onClose={close}
            />
          }
        />

        <PopoverWrap
          id="highlight"
          openPopover={open}
          onToggle={() => toggle("highlight")}
          onClose={close}
          button={
            <Tooltip label="Highlight">
              <button
                className="w-7 h-7 flex flex-col items-center justify-center rounded-md transition-all gap-0.5 shrink-0"
                style={{
                  color: s.isHighlight ? "var(--primary)" : "var(--text-secondary)",
                  backgroundColor: s.isHighlight ? "#2563EB12" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!s.isHighlight)
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover)";
                }}
                onMouseLeave={(e) => {
                  if (!s.isHighlight)
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          }
          popover={
            <ColorPicker
              colors={HIGHLIGHT_COLORS}
              current={s.currentHighlightColor}
              onSelect={(c) => {
                editor.chain().focus().toggleHighlight({ color: c }).run();
                close();
              }}
              onClose={close}
            />
          }
        />

        <Sep />

        {/* ── Undo / Redo ── */}
        <IconBtn
          icon={<Undo2 className="w-3.5 h-3.5" />}
          label="Undo (⌘Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!s.canUndo}
        />
        <IconBtn
          icon={<Redo2 className="w-3.5 h-3.5" />}
          label="Redo (⌘⇧Z)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!s.canRedo}
        />

        <Sep />

        {/* ── Typography ── */}
        <PopoverWrap
          id="typography"
          openPopover={open}
          onToggle={() => toggle("typography")}
          onClose={close}
          button={
            <GroupBtn
              label="Typography"
              icon={<Type className="w-3.5 h-3.5" />}
              onClick={() => {}}
            />
          }
          popover={
            <PopoverShell width={180}>
              <div className="px-3 py-1.5">
                <p
                  className="text-[10px] font-mono tracking-widest uppercase"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Font family
                </p>
              </div>
              {FONT_FAMILIES.map((f) => (
                <MenuItem
                  key={f.value}
                  label={f.label}
                  isActive={s.currentFontFamily === f.value}
                  onClick={() => {
                    f.value
                      ? editor.chain().focus().setFontFamily(f.value).run()
                      : editor.chain().focus().unsetFontFamily().run();
                    close();
                  }}
                />
              ))}
            </PopoverShell>
          }
        />

        {/* ── Headings ── */}
        <PopoverWrap
          id="headings"
          openPopover={open}
          onToggle={() => toggle("headings")}
          onClose={close}
          button={
            <GroupBtn
              label={`${currentHeading} Headings`}
              icon={<Heading1 className="w-3.5 h-3.5" />}
              isActive={
                s.isHeading1 ||
                s.isHeading2 ||
                s.isHeading3 ||
                s.isHeading4 ||
                s.isHeading5 ||
                s.isHeading6
              }
              onClick={() => {}}
            />
          }
          popover={
            <PopoverShell width={160}>
              <MenuItem
                icon={<Heading1 className="w-3.5 h-3.5" />}
                label="Heading 1"
                isActive={s.isHeading1}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                  close();
                }}
              />
              <MenuItem
                icon={<Heading2 className="w-3.5 h-3.5" />}
                label="Heading 2"
                isActive={s.isHeading2}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                  close();
                }}
              />
              <MenuItem
                icon={<Heading3 className="w-3.5 h-3.5" />}
                label="Heading 3"
                isActive={s.isHeading3}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                  close();
                }}
              />
              <MenuItem
                icon={<Heading4 className="w-3.5 h-3.5" />}
                label="Heading 4"
                isActive={s.isHeading4}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 4 }).run();
                  close();
                }}
              />
              <MenuItem
                icon={<Heading5 className="w-3.5 h-3.5" />}
                label="Heading 5"
                isActive={s.isHeading5}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 5 }).run();
                  close();
                }}
              />
              <MenuItem
                icon={<Heading6 className="w-3.5 h-3.5" />}
                label="Heading 6"
                isActive={s.isHeading6}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 6 }).run();
                  close();
                }}
              />
              <MenuDivider />
              <MenuItem
                icon={<Pilcrow className="w-3.5 h-3.5" />}
                label="Paragraph"
                isActive={s.isParagraph}
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  close();
                }}
              />
            </PopoverShell>
          }
        />

        {/* ── Blocks ── */}
        <PopoverWrap
          id="blocks"
          openPopover={open}
          onToggle={() => toggle("blocks")}
          onClose={close}
          button={
            <GroupBtn
              label="Blocks"
              icon={<List className="w-3.5 h-3.5" />}
              isActive={s.isBulletList || s.isOrderedList || s.isCodeBlock || s.isBlockquote}
              onClick={() => {}}
            />
          }
          popover={
            <PopoverShell width={170}>
              <MenuItem
                icon={<List className="w-3.5 h-3.5" />}
                label="Bullet list"
                isActive={s.isBulletList}
                onClick={() => {
                  editor.chain().focus().toggleBulletList().run();
                  close();
                }}
              />
              <MenuItem
                icon={<ListOrdered className="w-3.5 h-3.5" />}
                label="Ordered list"
                isActive={s.isOrderedList}
                onClick={() => {
                  editor.chain().focus().toggleOrderedList().run();
                  close();
                }}
              />
              <MenuItem
                icon={<CodeSquare className="w-3.5 h-3.5" />}
                label="Code block"
                isActive={s.isCodeBlock}
                onClick={() => {
                  editor.chain().focus().toggleCodeBlock().run();
                  close();
                }}
              />
              <MenuItem
                icon={<TextQuote className="w-3.5 h-3.5" />}
                label="Blockquote"
                isActive={s.isBlockquote}
                onClick={() => {
                  editor.chain().focus().toggleBlockquote().run();
                  close();
                }}
              />
              <MenuDivider />
              <MenuItem
                icon={<Minus className="w-3.5 h-3.5" />}
                label="Divider"
                onClick={() => {
                  editor.chain().focus().setHorizontalRule().run();
                  close();
                }}
              />
              <MenuItem
                icon={<WrapText className="w-3.5 h-3.5" />}
                label="Hard break"
                onClick={() => {
                  editor.chain().focus().setHardBreak().run();
                  close();
                }}
              />
            </PopoverShell>
          }
        />

        {/* ── Align ── */}
        <PopoverWrap
          id="align"
          openPopover={open}
          onToggle={() => toggle("align")}
          onClose={close}
          button={
            <GroupBtn
              label={currentAlign}
              icon={alignIcon}
              isActive={s.isAlignCenter || s.isAlignRight || s.isAlignJustify}
              onClick={() => {}}
            />
          }
          popover={
            <PopoverShell width={150}>
              <MenuItem
                icon={<AlignLeft className="w-3.5 h-3.5" />}
                label="Left"
                isActive={s.isAlignLeft}
                onClick={() => {
                  editor.chain().focus().setTextAlign("left").run();
                  close();
                }}
                shortcut="⌘L"
              />
              <MenuItem
                icon={<AlignCenter className="w-3.5 h-3.5" />}
                label="Center"
                isActive={s.isAlignCenter}
                onClick={() => {
                  editor.chain().focus().setTextAlign("center").run();
                  close();
                }}
                shortcut="⌘E"
              />
              <MenuItem
                icon={<AlignRight className="w-3.5 h-3.5" />}
                label="Right"
                isActive={s.isAlignRight}
                onClick={() => {
                  editor.chain().focus().setTextAlign("right").run();
                  close();
                }}
                shortcut="⌘R"
              />
              <MenuItem
                icon={<AlignJustify className="w-3.5 h-3.5" />}
                label="Justify"
                isActive={s.isAlignJustify}
                onClick={() => {
                  editor.chain().focus().setTextAlign("justify").run();
                  close();
                }}
                shortcut="⌘J"
              />
            </PopoverShell>
          }
        />

        {/* ── Insert — flat popovers, no nesting ── */}
        <PopoverWrap
          id="insertLink"
          openPopover={open}
          onToggle={() => toggle("insertLink")}
          onClose={close}
          button={
            <Tooltip label="Insert link">
              <GroupBtn
                label="Link"
                icon={<Link className="w-3.5 h-3.5" />}
                isActive={s.isLink}
                onClick={() => {}}
              />
            </Tooltip>
          }
          popover={
            <LinkPopover
              current={s.currentLinkHref}
              onSet={(url) => {
                editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
                close();
              }}
              onRemove={() => {
                editor.chain().focus().unsetLink().run();
                close();
              }}
              onClose={close}
            />
          }
        />

        <PopoverWrap
          id="insertImage"
          openPopover={open}
          onToggle={() => toggle("insertImage")}
          onClose={close}
          button={
            <Tooltip label="Insert image">
              <GroupBtn label="Image" icon={<Image className="w-3.5 h-3.5" />} onClick={() => {}} />
            </Tooltip>
          }
          popover={
            <ImagePopover
              onInsert={(src, alt) => {
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: "resizableImage",
                    attrs: { src, alt: alt || "", width: null },
                  })
                  .run();
                close();
              }}
              onClose={close}
            />
          }
        />

        <PopoverWrap
          id="insertTable"
          openPopover={open}
          onToggle={() => toggle("insertTable")}
          onClose={close}
          button={
            <Tooltip label="Insert table">
              <GroupBtn
                label="Table"
                icon={<Table className="w-3.5 h-3.5" />}
                isActive={s.isTable}
                onClick={() => {}}
              />
            </Tooltip>
          }
          popover={
            <TablePopover
              onInsert={(rows, cols) => {
                editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
                close();
              }}
              onClose={close}
            />
          }
        />

        {s.isLink && (
          <IconBtn
            icon={<Link2Off className="w-3.5 h-3.5" />}
            label="Remove link"
            onClick={() => editor.chain().focus().unsetLink().run()}
          />
        )}

        {/* ── Table controls — contextual ── */}
        {s.isTable && (
          <>
            <Sep />
            <PopoverWrap
              id="tableOps"
              openPopover={open}
              onToggle={() => toggle("tableOps")}
              onClose={close}
              button={
                <GroupBtn
                  label="Table ops"
                  icon={<Table className="w-3.5 h-3.5" />}
                  isActive
                  onClick={() => {}}
                />
              }
              popover={
                <PopoverShell width={170}>
                  <MenuItem
                    label="+Col before"
                    onClick={() => {
                      editor.chain().focus().addColumnBefore().run();
                      close();
                    }}
                  />
                  <MenuItem
                    label="+Col after"
                    onClick={() => {
                      editor.chain().focus().addColumnAfter().run();
                      close();
                    }}
                  />
                  <MenuItem
                    label="+Row before"
                    onClick={() => {
                      editor.chain().focus().addRowBefore().run();
                      close();
                    }}
                  />
                  <MenuItem
                    label="+Row after"
                    onClick={() => {
                      editor.chain().focus().addRowAfter().run();
                      close();
                    }}
                  />
                  <MenuDivider />
                  <MenuItem
                    label="Delete column"
                    danger
                    onClick={() => {
                      editor.chain().focus().deleteColumn().run();
                      close();
                    }}
                  />
                  <MenuItem
                    label="Delete row"
                    danger
                    onClick={() => {
                      editor.chain().focus().deleteRow().run();
                      close();
                    }}
                  />
                  <MenuItem
                    label="Delete table"
                    danger
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                      close();
                    }}
                  />
                </PopoverShell>
              }
            />
          </>
        )}
      </div>
    </div>
  );
};
