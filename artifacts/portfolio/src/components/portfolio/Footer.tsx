export default function Footer() {
  return (
    <footer
      className="w-full py-8 text-center mt-0"
      style={{
        borderTop: "1px solid rgba(0,229,255,0.1)",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <p className="text-xs" style={{ color: "#6B7280" }} data-testid="text-footer">
        © 2025 Tharun Ramesh. Built with precision.
      </p>
    </footer>
  );
}
