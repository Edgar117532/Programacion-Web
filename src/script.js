const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0';
let allPokemon = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let displayMode = 'modern';

let currentPage = 1;  // Página actual
const pokemonPerPage = 20;  // Número de Pokémon por página

// Inicializar la aplicación
async function init() {
    await fetchAllPokemon();
    await fetchTypes();
    renderPagination();
}

// Obtener lista completa de Pokémon
async function fetchAllPokemon() {
    const response = await fetch(API_URL);
    const data = await response.json();
    allPokemon = data.results;
    renderPokemonList(allPokemon.slice(0, 20));
}

// Obtener tipos de Pokémon
async function fetchTypes() {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    const data = await response.json();
    const typeFilter = document.getElementById('type-filter');
    data.results.forEach((type) => {
        const option = document.createElement('option');
        option.value = type.name;
        option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
        typeFilter.appendChild(option);
    });
}

// Cambiar modo de imagen
function changeDisplayMode(mode) {
    displayMode = mode;
    renderPokemonList(allPokemon.slice(0, 20));
}

// Filtrar por tipo
async function filterByType(type) {
    if (!type) {
        renderPokemonList(allPokemon.slice(0, 20));
        return;
    }

    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    const filteredPokemon = data.pokemon.map((p) => p.pokemon);
    renderPokemonList(filteredPokemon.slice(0, 20));
}

// Buscar Pokémon
function searchPokemon(query) {
    const filteredPokemon = allPokemon.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    renderPokemonList(filteredPokemon.slice(0, 20));
}

// Cambiar de página
function changePage(page) {
    if (page < 1 || page > Math.ceil(allPokemon.length / pokemonPerPage)) return;
    currentPage = page;
    renderPokemonList(allPokemon.slice((currentPage - 1) * pokemonPerPage, currentPage * pokemonPerPage));
    renderPagination();
}

// Renderizar lista de Pokémon
function renderPokemonList(pokemonList) {
    const container = document.getElementById('pokemon-list');
    container.innerHTML = '';
    pokemonList.forEach((pokemon) => {
        const card = createPokemonCard(pokemon);
        container.appendChild(card);
    });
}

// Crear tarjeta de Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    const imageUrl = getImageByMode(pokemon);

    card.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${imageUrl}" alt="${pokemon.name}">
        <button onclick="addToFavorites('${pokemon.name}')">Favoritos</button>
        <button onclick="showDetails('${pokemon.name}')">Detalles</button>
    `;
    return card;
}

// Obtener imagen según el modo
function getImageByMode(pokemon) {
    if (displayMode === 'cartoon') return pokemon.sprites?.other?.dream_world?.front_default;
    if (displayMode === 'gameboy') return pokemon.sprites?.front_default;
    return pokemon.sprites?.other?.['official-artwork']?.front_default;
}

// Agregar a favoritos
function addToFavorites(name) {
    if (!favorites.includes(name)) {
        favorites.push(name);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${name.charAt(0).toUpperCase() + name.slice(1)} añadido a favoritos.`);
    } else {
        alert(`${name.charAt(0).toUpperCase() + name.slice(1)} ya está en favoritos.`);
    }
}

// Mostrar detalles de Pokémon
async function showDetails(name) {
    const modal = document.getElementById('pokemon-details-modal');
    const container = document.getElementById('pokemon-details');
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const pokemon = await response.json();

    container.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${getImageByMode(pokemon)}" alt="${pokemon.name}">
        <p>Tipos: ${pokemon.types.map((type) => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ')}</p>
        <p>Habilidades: ${pokemon.abilities.map((ability) => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)).join(', ')}</p>
    `;
    modal.classList.remove('hidden');
}

// Renderizar los controles de paginación
function renderPagination() {
    const container = document.getElementById('pagination');
    container.innerHTML = '';
    const totalPages = Math.ceil(allPokemon.length / pokemonPerPage);

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => changePage(currentPage - 1);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => changePage(currentPage + 1);

    container.appendChild(prevButton);
    container.appendChild(document.createTextNode(` Página ${currentPage} de ${totalPages} `));
    container.appendChild(nextButton);
}

// Cerrar modales
function closeModal() {
    document.querySelectorAll('.modal').forEach((modal) => modal.classList.add('hidden'));
}

// Inicializar la aplicación
init();
