import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  // Get current theme and toggle function from theme context
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="themeSwitch"
        checked={theme === "dark"} // Checkbox is checked when theme is dark
        onChange={toggleTheme} // Toggle theme when checkbox is clicked
      />
      <label className="form-check-label" htmlFor="themeSwitch">
        {/* Show moon emoji for dark theme, sun for light theme */}
        {theme === "dark" ? "🌙" : "☀️"}
      </label>
    </div>
  );
}
