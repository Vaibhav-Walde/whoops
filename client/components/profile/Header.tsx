import React from "react";

const Header = () => {
  return (
    <header>
      <p
        className="text-[10px] tracking-[0.4em] uppercase mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        Profile
      </p>
      <h1 className="text-xl font-semibold mb-10" style={{ color: "var(--text-primary)" }}>
        Your account
      </h1>
    </header>
  );
};

export default Header;
