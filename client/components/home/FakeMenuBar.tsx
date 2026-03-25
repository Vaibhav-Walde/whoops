import {
  Bold,
  Italic,
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
  RemoveFormatting,
  Trash2,
} from "lucide-react";

type FakeButton = {
  icon: React.ElementType;
  active?: boolean;
};

type FakeGroup = FakeButton[];

const groups: FakeGroup[] = [
  [{ icon: Bold, active: true }, { icon: Italic }, { icon: Strikethrough }, { icon: Code }],
  [
    { icon: Heading1 },
    { icon: Heading2 },
    { icon: Heading3 },
    { icon: Heading4 },
    { icon: Heading5 },
    { icon: Heading6 },
  ],
  [
    { icon: Pilcrow },
    { icon: List },
    { icon: ListOrdered },
    { icon: CodeSquare },
    { icon: TextQuote },
    { icon: Minus },
    { icon: WrapText },
  ],
  [{ icon: RemoveFormatting }, { icon: Trash2 }],
  [{ icon: Undo2 }, { icon: Redo2 }],
];

const FakeMenuBar = () => (
  <div
    className="overflow-x-auto mx-auto rounded-md py-2"
    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
  >
    <div className="flex items-center gap-0.5 px-3 py-1.5 w-max">
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5">
          {group.map((btn, bi) => (
            <button
              key={bi}
              className="w-7 h-7 rounded flex items-center justify-center shrink-0 transition-colors"
              style={{
                color: btn.active ? "#ffffff" : "var(--text-secondary)",
                backgroundColor: btn.active ? "var(--primary)" : "transparent",
                boxShadow: btn.active ? "0 1px 3px rgba(37,99,235,0.3)" : "none",
              }}
            >
              <btn.icon className="w-3.5 h-3.5" />
            </button>
          ))}
          {gi < groups.length - 1 && (
            <div className="w-px h-4 mx-1 shrink-0" style={{ backgroundColor: "var(--border)" }} />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default FakeMenuBar;
