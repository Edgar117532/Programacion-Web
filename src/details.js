// Mostrar detalles del Pokémon en el modal
async function showDetails(name) {
    const modal = document.getElementById('pokemon-details-modal');
    const container = document.getElementById('pokemon-details');
    container.innerHTML = 'Cargando...'; // Indicador de carga mientras se obtiene la información

    try {
        const pokemon = await fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const abilities = pokemon.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ');
        const stats = pokemon.stats.map(stat => `${capitalizeFirstLetter(stat.stat.name)}: ${stat.base_stat}`).join(', ');

        // Crear el contenido dinámico del modal de detalles
        container.innerHTML = `
            <h2>${capitalizeFirstLetter(pokemon.name)}</h2>
            <img src="${getImageByMode(pokemon)}" alt="${pokemon.name}">
            <p>Tipos: ${pokemon.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ')}</p>
            <p>Habilidades: ${abilities}</p>
            <p>Estadísticas: ${stats}</p>
        `;

        // Mostrar el modal
        modal.classList.remove('hidden');
    } catch (error) {
        container.innerHTML = `<p>Error al cargar los detalles. Intenta de nuevo más tarde.</p>`;
        console.error('Error al obtener detalles del Pokémon:', error);
    }
}
// Función para cerrar el modal
function closeModal() {
    document.querySelectorAll('.modal').forEach((modal) => modal.classList.add('hidden'));
}

// Obtener detalles de un Pokémon
async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    return await response.json();
}

// Obtener la imagen según el modo seleccionado
function getImageByMode(pokemon) {
    const displayMode = document.getElementById('display-mode').value; // Obtener el modo de imagen seleccionado
    if (displayMode === 'cartoon') return pokemon.sprites.other.dream_world.front_default;
    if (displayMode === 'gameboy') return pokemon.sprites.front_default;
    return pokemon.sprites.other['official-artwork'].front_default;
}
// Función para obtener la cadena de evoluciones del Pokémon
async function fetchEvolutions(speciesUrl) {
    try {
        // Obtener información de la especie
        const response = await fetch(speciesUrl);
        const species = await response.json();
        // Obtener la cadena de evolución
        const chainResponse = await fetch(species.evolution_chain.url);
        const chain = await chainResponse.json();

        // Obtener todas las evoluciones
        const evolutions = [];
        let current = chain.chain;
        do {
            evolutions.push(current.species.name);
            current = current.evolves_to[0];
        } while (current);

        return evolutions; // Devuelve la lista de evoluciones
    } catch (error) {
        console.error('Error al obtener evoluciones:', error);
        return []; // Retorna un arreglo vacío si hay un error
    }
}

// Función para capitalizar la primera letra de una cadena
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Aquí están los ejemplos de cómo se pueden llamar estas funciones:

// Mostrar los detalles de un Pokémon específico
// showDetails('pikachu');

// Cerrar el modal de detalles
// closeModal();
