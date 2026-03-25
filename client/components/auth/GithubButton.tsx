import { Github } from "lucide-react";

const GithubButton = ({
  onclick,
  loading,
  disabled,
}: {
  onclick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onclick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 bg-(--canvas) border border-(--border) text-(--text-primary) hover:bg-(--hover) disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-(--border) border-t-(--text-secondary) rounded-full animate-spin" />
      ) : (
        <Github className="w-4 h-4" />
      )}
      {loading ? "Signing in..." : "Continue with GitHub"}
    </button>
  );
};

export default GithubButton;
