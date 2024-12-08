import React, { useEffect, useState } from 'react';
import { closeModal, getImageByMode } from './script';
import './styles.css';

function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [displayMode, setDisplayMode] = useState('modern');
  const [types, setTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonPerPage = 20;
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    fetchAllPokemon();
    fetchTypes();
  }, []);

  const fetchAllPokemon = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0');
    const data = await response.json();
    setAllPokemon(data.results);
  };

  const fetchTypes = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    const data = await response.json();
    setTypes(data.results);
  };

  const changePage = (page) => {
    if (page < 1 || page > Math.ceil(allPokemon.length / pokemonPerPage)) return;
    setCurrentPage(page);
  };

  const filterByType = async (type) => {
    if (!type) {
      fetchAllPokemon();
      return;
    }
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    const filteredPokemon = data.pokemon.map((p) => p.pokemon);
    setAllPokemon(filteredPokemon);
    setCurrentPage(1);
  };

  const renderPokemonList = () => {
    const currentPokemons = allPokemon.slice(
      (currentPage - 1) * pokemonPerPage,
      currentPage * pokemonPerPage
    );

    return currentPokemons.map((pokemon) => (
      <div key={pokemon.name} className="pokemon-card">
        <div className="card-header">
          <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
          <img
            src={getImageByMode(pokemon)}
            alt={pokemon.name}
            onError={(e) => (e.target.src = '/default-image.png')}
          />
        </div>
        <div className="card-info">
          <button onClick={() => addToFavorites(pokemon.name)}>Add to Favorites</button>
          <button onClick={() => setSelectedPokemon(pokemon)}>View Details</button>
        </div>
      </div>
    ));
  };

  const addToFavorites = (name) => {
    if (!favorites.includes(name)) {
      const updatedFavorites = [...favorites, name];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokédex Interactiva</h1>
        <input
          type="text"
          id="search-box"
          placeholder="Search Pokémon..."
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
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
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

      {selectedPokemon && (
        <div id="pokemon-details-modal" className="modal">
          <div className="modal-content">
            <button onClick={() => closeModal()}>Close</button>
            <h2>{selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}</h2>
            <img src={getImageByMode(selectedPokemon)} alt={selectedPokemon.name} />
            {/* You can add more details about the Pokemon here */}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

