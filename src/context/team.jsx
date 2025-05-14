import {
  createContext,
  useMemo,
  useContext,
  useState,
  useLayoutEffect,
} from "react";

const TeamContext = createContext();

export const useTeam = () => useContext(TeamContext);

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQueryResult, setSearchQueryResult] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    const storedTeam = localStorage.getItem("team");
    if (storedTeam) {
      setTeam(JSON.parse(storedTeam));
    }
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const fetchFromPokeAPI = async (pokemonName) => {
    if (!pokemonName || pokemonName.trim() === "") return;
    if(isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase().trim()}`
      );
      if (!response.ok) {
        throw new Error("Pokemon not found");
      }
      const data = await response.json();
      setSearchQueryResult(data);
    } catch (error) {
      setError(error.message);
      setSearchQueryResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchFromPokeAPI, 300), []);

  const displayError = (error) => {
    setError(error);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const addToTeam = (pokemon) => {
    if (team.length >= 8) {
      displayError("Your team is full (maximum 8 Pokémon)");
      setSearchQueryResult(null);
      return false;
    }

    if (team.some((p) => p.id === pokemon.id)) {
      displayError(`${pokemon.name} is already in your team`);
      setSearchQueryResult(null);
      return false;
    }

    const newTeam = [...team, pokemon];
    setTeam(newTeam);
    localStorage.setItem("team", JSON.stringify(newTeam));
    setSearchQueryResult(null);
    setError(null);
    return true;
  };

  const removeFromTeam = (pokemonId) => {
    const newTeam = team.filter((pokemon) => pokemon.id !== pokemonId);
    setTeam(newTeam);
    localStorage.setItem("team", JSON.stringify(newTeam));
  };

  return (
    <TeamContext.Provider
      value={{
        team,
        setTeam,
        isLoading,
        error,
        searchQueryResult,
        fetchFromPokeAPI,
        debouncedFetch,
        addToTeam,
        removeFromTeam,
        isDarkMode,
        setIsDarkMode,
        setError,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export default TeamProvider;
