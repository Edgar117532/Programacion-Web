import React, { useEffect, useState } from 'react';
import './styles.css';

function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [displayMode, setDisplayMode] = useState('modern');
  const [types, setTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonPerPage = 20;

  useEffect(() => {
    fetchAllPokemon();
    fetchTypes();
  }, []);

  // Cargar lista completa de Pokémon
  const fetchAllPokemon = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0');
    const data = await response.json();
    setAllPokemon(data.results);
  };

  // Cargar tipos de Pokémon
  const fetchTypes = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    const data = await response.json();
    setTypes(data.results);
  };

  // Cambiar de página para la paginación
  const changePage = (page) => {
    if (page < 1 || page > Math.ceil(allPokemon.length / pokemonPerPage)) return;
    setCurrentPage(page);
  };

  // Filtrar Pokémon por tipo
  const filterByType = async (type) => {
    if (!type) {
      fetchAllPokemon(); // Si no hay filtro, cargar todos los Pokémon
      return;
    }

    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    const filteredPokemon = data.pokemon.map((p) => p.pokemon);
    setAllPokemon(filteredPokemon);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Obtener imagen según el modo de visualización
  const getImageByMode = (pokemon) => {
    if (displayMode === 'cartoon') return pokemon.sprites?.other?.dream_world?.front_default;
    if (displayMode === 'gameboy') return pokemon.sprites?.front_default;
    return pokemon.sprites?.other?.['official-artwork']?.front_default;
  };

  // Agregar a favoritos
  const addToFavorites = (name) => {
    if (!favorites.includes(name)) {
      const updatedFavorites = [...favorites, name];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert(`${name} added to favorites!`);
    } else {
      alert(`${name} is already in favorites.`);
    }
  };

  // Buscar Pokémon por nombre
  const searchPokemon = (query) => {
    const filteredPokemon = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    setAllPokemon(filteredPokemon);
  };

  // Renderizar lista de Pokémon
  const renderPokemonList = () => {
    const currentPokemons = allPokemon.slice(
      (currentPage - 1) * pokemonPerPage,
      currentPage * pokemonPerPage
    );

    return currentPokemons.map((pokemon) => (
      <div key={pokemon.name} className="pokemon-card">
        <div className="card-header">
          <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2> {/* Capitalización directa */}
          <img
            src={getImageByMode(pokemon)}
            alt={pokemon.name}
            onError={(e) => (e.target.src = '/default-image.png')}
          />
        </div>
        <div className="card-info">
          <button onClick={() => addToFavorites(pokemon.name)}>Add to Favorites</button>
        </div>
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokédex Interactiva</h1>
        <input
          type="text"
          id="search-box"
          placeholder="Buscar Pokémon..."
          onInput={(e) => searchPokemon(e.target.value)}
        />
        <select onChange={(e) => setDisplayMode(e.target.value)} value={displayMode}>
          <option value="modern">Modern</option>
          <option value="gameboy">Gameboy</option>
          <option value="cartoon">Cartoon</option>
        </select>
      </header>

      <main>
        <section>
          <label htmlFor="type-filter">Filter by Type:</label>
          <select id="type-filter" onChange={(e) => filterByType(e.target.value)}>
            <option value="">All</option>
            {types.map((type) => (
              <option key={type.name} value={type.name}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)} {/* Capitalización directa */}
              </option>
            ))}
          </select>
        </section>

        <section id="pokemon-list-container">{renderPokemonList()}</section>

        <section id="pagination" className="pagination-controls">
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(allPokemon.length / pokemonPerPage)}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === Math.ceil(allPokemon.length / pokemonPerPage)}
          >
            Next
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;

