import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="themeSwitch"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <label className="form-check-label" htmlFor="themeSwitch">
        {theme === "dark" ? "🌙" : "☀️"}
      </label>
    </div>
  );
}
