let displayMode = 'funko'; // Modo predeterminado
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Cambiar el modo de visualización
function setDisplayMode(mode) {
    displayMode = mode;
    renderPokemonList(); // Recarga la lista de Pokémon
}

// Renderizar la lista de Pokémon
async function renderPokemonList() {
    const container = document.getElementById('pokemon-list');
    container.innerHTML = ''; // Limpiar lista

    const list = await fetchPokemonList(0); // Obtener lista (20 por página)
    for (let pokemon of list) {
        const details = await fetchPokemonDetails(pokemon.url);
        const card = createPokemonCard(details);
        container.appendChild(card);
    }
}

// Crear tarjetas de Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    let imageUrl = '';
    if (displayMode === 'funko') {
        imageUrl = pokemon.sprites.other['official-artwork'].front_default;
    } else if (displayMode === 'gameboy') {
        imageUrl = pokemon.sprites.front_default;
    } else if (displayMode === 'cartoon') {
        imageUrl = pokemon.sprites.other.dream_world.front_default;
    }

    card.innerHTML = `
        <img src="${imageUrl}" alt="${pokemon.name}">
        <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
        <button onclick="showDetails('${pokemon.name}')">Detalles</button>
        <button onclick="addToFavorites('${pokemon.name}')">Añadir a Favoritos</button>
    `;
    return card;
}
