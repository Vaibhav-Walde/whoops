import FadeUp from "../ui/FadeUp";

const Stats = () => {
  const stats = [
    { value: "∞", label: "Documents" },
    { value: "Real-time", label: "Collaboration" },
    { value: "20", label: "Versions kept" },
    { value: "3", label: "Auth methods" },
  ];
  return (
    <section
      className="border-y py-12"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--canvas)" }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={i * 80}>
            <div className="text-center">
              <p className="font-mono font-bold text-3xl mb-1" style={{ color: "var(--primary)" }}>
                {s.value}
              </p>
              <p
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.label}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
};

export default Stats;
