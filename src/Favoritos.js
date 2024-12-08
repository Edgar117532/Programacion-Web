function addToFavorites(name) {
    if (!favorites.includes(name)) {
        favorites.push(name);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${name} añadido a favoritos`);
    } else {
        alert(`${name} ya está en favoritos`);
    }
}

// Ver lista de favoritos
function viewFavorites() {
    const container = document.getElementById('pokemon-list');
    container.innerHTML = '';

    favorites.forEach(async (name) => {
        const pokemon = await fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const card = createPokemonCard(pokemon);
        container.appendChild(card);
    });
}

