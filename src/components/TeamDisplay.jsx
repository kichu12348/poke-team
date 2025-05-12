import React, { useMemo } from 'react';
import { useTeam } from '../context/team';
import styles from './styles/teamDisplay.module.css';

function TeamDisplay() {
  const { team, removeFromTeam } = useTeam();

  // Calculate team stats
  const teamStats = useMemo(() => {
    if (team.length === 0) return null;

    const stats = {
      hp: 0,
      attack: 0,
      defense: 0,
      'special-attack': 0,
      'special-defense': 0,
      speed: 0,
      total: 0,
      types: {}
    };


    team.forEach(pokemon => {
      pokemon.stats.forEach(stat => {
        stats[stat.stat.name] += stat.base_stat;
      });

      pokemon.types.forEach(type => {
        const typeName = type.type.name;
        stats.types[typeName] = (stats.types[typeName] || 0) + 1;
      });
    });

    stats.total = stats.hp + stats.attack + stats.defense + 
                  stats['special-attack'] + stats['special-defense'] + stats.speed;

    return stats;
  }, [team]);

  if (team.length === 0) {
    return (
      <div className={styles.emptyTeam}>
        <h2>Your Team</h2>
        <p>Your team is empty. Search for Pokémon to add them to your team.</p>
      </div>
    );
  }

  return (
    <div className={styles.teamContainer}>
      <h2>Your Team ({team.length}/8)</h2>
      {teamStats && (
        <div className={styles.teamStats}>
          <h3>Team Power</h3>
          <div className={styles.statsSummary}>
            <div className={styles.statGroup}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>HP</span>
                <span className={styles.statValue}>{teamStats.hp}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>ATK</span>
                <span className={styles.statValue}>{teamStats.attack}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>DEF</span>
                <span className={styles.statValue}>{teamStats.defense}</span>
              </div>
            </div>
            <div className={styles.statGroup}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>SP.ATK</span>
                <span className={styles.statValue}>{teamStats['special-attack']}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>SP.DEF</span>
                <span className={styles.statValue}>{teamStats['special-defense']}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>SPD</span>
                <span className={styles.statValue}>{teamStats.speed}</span>
              </div>
            </div>
            <div className={styles.totalPower}>
              <span>Total Power</span>
              <span className={styles.totalValue}>{teamStats.total}</span>
            </div>
          </div>
          
          <div className={styles.typeDistribution}>
            <h4>Type Distribution</h4>
            <div className={styles.typeContainer}>
              {Object.entries(teamStats.types).map(([type, count]) => (
                <div key={type} className={styles.typeCount}>
                  <span className={`${styles.typeTag} ${styles[type]}`}>{type}</span>
                  <span className={styles.count}>x{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.teamGrid}>
        {team.map(pokemon => (
          <div key={pokemon.id} className={styles.pokemonCard}>
            <button 
              className={styles.removeButton}
              onClick={() => removeFromTeam(pokemon.id)}
              aria-label={`Remove ${pokemon.name} from team`}
            >
              ×
            </button>
            
            <img 
              src={pokemon.sprites.front_default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'} 
              alt={pokemon.name}
              className={styles.pokemonImage}
            />
            
            <h3>{pokemon.name}</h3>
            
            <div className={styles.typeContainer}>
              {pokemon.types.map(type => (
                <span 
                  key={type.type.name} 
                  className={`${styles.typeTag} ${styles[type.type.name]}`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
            
            <div className={styles.statsContainer}>
              {pokemon.stats.slice(0, 3).map(stat => (
                <div key={stat.stat.name} className={styles.stat}>
                  <span className={styles.statName}>
                    {stat.stat.name === 'hp' ? 'HP' : 
                     stat.stat.name === 'attack' ? 'ATK' : 
                     stat.stat.name === 'defense' ? 'DEF' : 
                     stat.stat.name}
                  </span>
                  <span className={styles.statValue}>{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamDisplay;
