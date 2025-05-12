import styles from "./styles/nav.module.css";
import { MdOutlineLightMode } from "react-icons/md";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useTeam } from "../context/team";

export default function Navbar() {
  const { isDarkMode, setIsDarkMode } = useTeam();

  const toggleTheme = () => {
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    if (currentTheme === "light") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
    localStorage.setItem("theme", currentTheme === "light" ? "dark" : "light");
  };

  return (
    <div className={styles.navbar}>
      <div
        className={`${styles.toggleSwitch} ${isDarkMode ? styles.active : ""}`}
        onClick={toggleTheme}
      >
        <div className={styles.toggleSwitchBtn}>
          {isDarkMode ? (
            <BsFillMoonStarsFill color="#ffd700" size={16} />
          ) : (
            <MdOutlineLightMode color="#ff8c00" size={17} />
          )}
        </div>
      </div>
    </div>
  );
}
