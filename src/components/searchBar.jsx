import React, { useState } from "react";
import styles from "./styles/search.module.css";
import { IoSearchSharp } from "react-icons/io5";
import { useTeam } from "../context/team";
import { pokemons } from "../constants/pokemons";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { debouncedFetch, searchQueryResult, isLoading, error, addToTeam } =
    useTeam();

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredPokemons([]);
      setShowResults(false);
    } else {
      const matches = pokemons.filter((pokemon) =>
        pokemon.toLowerCase().includes(query.toLowerCase())
      );
      console.log(matches);
      setFilteredPokemons(matches);
      setShowResults(true);
    }
  };

  const handlePokemonClick = (pokemonName) => {
    setSearchQuery(pokemonName);
    setFilteredPokemons([]);
    debouncedFetch(pokemonName);
  };

  const handleAddToTeam = () => {
    if (searchQueryResult) {
      const success = addToTeam({
        id: searchQueryResult.id,
        name: searchQueryResult.name,
        types: searchQueryResult.types,
        sprites: searchQueryResult.sprites,
        stats: searchQueryResult.stats,
      });

      if (success) {
        setSearchQuery("");
        setShowResults(false);
      } else {
        setTimeout(() => {
          setSearchQuery("");
          setShowResults(false);
        }, 2000);
      }
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div
        className={`${styles.searchBar} ${
          showResults ? styles.showResult : ""
        }`}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "flex", width: "100%" }}
        >
          <input
            type="text"
            placeholder="Search Pokémon..."
            className={styles.input}
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button type="submit" className={styles.button}>
            <IoSearchSharp size={20} />
          </button>
        </form>

        {showResults && filteredPokemons.length > 0 && (
          <div className={`${styles.resultsContainer} ${showResults?styles.showResult:""}`}
            style={{
              height: `${(filteredPokemons.length * 40)}px`,
            }}
          >
            {filteredPokemons.map((pokemon) => (
              <div
                key={pokemon}
                className={styles.resultItem}
                onClick={() => handlePokemonClick(pokemon)}
              >
                {pokemon}
              </div>
            ))}
          </div>
        )}

        {isLoading && <div className={styles.loading}>Loading...</div>}

        {error && <div className={styles.error}>{error}</div>}

        {!isLoading && !error && searchQueryResult && (
          <div className={styles.searchQueryResult}>
            <img
              src={searchQueryResult.sprites.front_default}
              alt={searchQueryResult.name}
              className={styles.pokemonSprite}
            />
            <div className={styles.pokemonInfo}>
              <h3>{searchQueryResult.name}</h3>
              <div className={styles.typeContainer}>
                {searchQueryResult.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`${styles.typeTag} ${styles[type.type.name]}`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
            <button className={styles.addButton} onClick={handleAddToTeam}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
