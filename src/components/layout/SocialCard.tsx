const KEY: [string, string, string?][] = [
  ["#4cc582", "O(1)"],
  ["#b2d44a", "O(log n)"],
  ["#f0c040", "O(n)"],
  ["#f59a55", "O(n log n)"],
  ["#f06b62", "O(n", "2"],
  ["#d46bb0", "O(2", "n"],
];

export default function SocialCard() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#12151a", color: "#e6e8eb" }}>
      <div style={{ display: "flex", height: 14 }}>
        {KEY.map(([c]) => (
          <div key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: "64px 80px", flex: 1 }}>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
          Big<span style={{ color: "#f59a55", fontStyle: "italic" }}>O</span>Sheet
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1, marginTop: 56, maxWidth: 980 }}>
          Time and space complexity, with the fine print.
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a3aab4", marginTop: 28 }}>
          Data structures, sorting, graphs, and patterns for coding interviews.
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: "auto" }}>
          {KEY.map(([c, label, sup]) => (
            <div key={c} style={{ display: "flex", alignItems: "flex-start", fontSize: 30, padding: "8px 18px", borderRadius: 6, border: `2px solid ${c}`, color: c }}>
              {label}
              {sup && <span style={{ fontSize: 20, marginTop: -2 }}>{sup}</span>}
              {sup && ")"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
