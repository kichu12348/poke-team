import React, { useState, useEffect } from "react";
import styles from "./styles/search.module.css";
import { IoSearchSharp } from "react-icons/io5";
import { useTeam } from "../context/team";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { debouncedFetch, searchQueryResult, isLoading, error, addToTeam } =
    useTeam();


  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setShowResults(false);
    } else {
      debouncedFetch(e.target.value)
      setShowResults(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      debouncedFetch(searchQuery);
      setShowResults(true);
    }
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
      }else{
        setTimeout(()=>{
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
          onSubmit={handleSearch}
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

        <div
          className={`${styles.resultsContainer} ${
            showResults ? styles.showResult : ""
          }`}
        >
          {isLoading && <div className={styles.loading}>Loading...</div>}

          {error && <div className={styles.error}>{error}</div>}

          {!isLoading && !error && searchQueryResult && (
            <div className={styles.resultItem} onClick={handleAddToTeam}>
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
              <button className={styles.addButton}>Add</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
