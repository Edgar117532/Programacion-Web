let displayMode = 'Caricatura'; // Default mode
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function setDisplayMode(mode) {
    displayMode = mode;
    renderPokemonList(currentPage);
}

// Actualiza `renderPokemonList` para usar el `displayMode`
async function renderPokemonList(offset = 0) {
    const list = await fetchPokemonList(offset);
    const container = document.getElementById('pokemon-list');
    container.innerHTML = '';

    for (let pokemon of list) {
        const details = await fetchPokemonDetails(pokemon.url);

        let imageUrl;
        if (displayMode === 'Caricatura') {
            imageUrl = details.sprites.other['official-artwork'].front_default;
        } else if (displayMode === 'gameboy') {
            imageUrl = details.sprites.front_default;
        } else if (displayMode === 'cartoon') {
            imageUrl = details.sprites.other.dream_world.front_default;
        }

        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <img src="${imageUrl}" alt="${pokemon.name}">
            <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
            <p>Type: ${details.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ')}</p>
            <button onclick="addToFavorites('${details.name}')">Añadir a Favoritos</button>
        `;
        card.addEventListener('click', () => openPokemonDetails(details));
        container.appendChild(card);
    }
    renderPagination();
}
