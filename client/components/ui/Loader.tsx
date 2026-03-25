const Loader = () => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 font-mono"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Animated logo mark */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }}
        />
        {/* Inner diamond */}
        <div
          className="absolute w-3 h-3 rotate-45 border"
          style={{ borderColor: "var(--primary)", backgroundColor: "var(--primary)" }}
        />
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-[11px] tracking-[0.4em] uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          Loading
        </span>
        {/* Animated dots */}
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: "var(--primary)",
                animation: `dotPulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
