// Copyright 2025 Julian Calvin Rill

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
