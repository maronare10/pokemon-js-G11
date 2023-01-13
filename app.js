const POKEMONS_STORAGE_KEY = 'pokemon-favorites'
let pokemonFavorites = JSON.parse(localStorage.getItem(POKEMONS_STORAGE_KEY)) ?? []
let page = 1

const fetchPokemons = async (page = 1) => {
  const limit = 9
  const offset = (page - 1) * limit
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  const response = await axios.get(url) // Devuelve una promesa
  const dataResults = response.data.results.map(pokemon => {
    const id = pokemon.url.split('/').at(6)
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    const currentFavorites = JSON.parse(localStorage.getItem(POKEMONS_STORAGE_KEY)) ?? []
    const foundFavorite = currentFavorites.find(favorite => favorite.id === id )
    return {
      ...pokemon,
      id,
      name: Boolean(foundFavorite) ? foundFavorite.name : pokemon.name,
      image: Boolean(foundFavorite) ? foundFavorite.image : image,
      isFavorite: Boolean(foundFavorite)
    }
  })
  console.log(dataResults)
  return dataResults
}

const renderPokemons = (pokemons) => {
  const pokemonsList = document.getElementById('pokemonsList')

  let elements = ''

  pokemons.forEach(pokemon => {
    elements += `<article class='pokemons-item'>
      <img src='${pokemon.image}' width='80' height='80'></img>
      <h2>#${pokemon.id} ${pokemon.name}</h2>
      <div class="pokemons-item__buttons">
        <button onclick="toggleFavorite('${pokemon.id}', '${pokemon.name}')">
          <svg class="${pokemon.isFavorite ? 'is-favorite' : ''}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-star"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </button>
        <button onclick="readPokemon('${pokemon.id}')" class="btn ${!pokemon.isFavorite ? 'is-hidden' : ''}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
    </article>
    `
  })
  pokemonsList.innerHTML = elements

  const numberPokemons = document.getElementById('numberPokemons')
  const currentFavorites = JSON.parse(localStorage.getItem(POKEMONS_STORAGE_KEY)) ?? []
  numberPokemons.innerHTML = `Favorites: ${currentFavorites.length}`
}

const readPokemon = async (pokemonId) => {
  const pokemonForm = document.forms['pokemonForm'];

  const currentFavorites = JSON.parse(localStorage.getItem(POKEMONS_STORAGE_KEY)) ?? []

  const foundPokemon = currentFavorites.find(favorite => favorite.id === pokemonId)

  pokemonForm.id.value = foundPokemon.id;
  pokemonForm.name.value = foundPokemon.name;
  pokemonForm.image.value = foundPokemon.image;
}


const toggleFavorite = async (id, name) => {
  const foundPokemonFavorite = pokemonFavorites.filter(favorite => favorite.id === id)
  const existPokemonFavorite = foundPokemonFavorite.length > 0

    if(existPokemonFavorite) {
      pokemonFavorites = pokemonFavorites.filter(favorite => favorite.id !== id)
    } else {
        let image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        pokemonFavorites.push({id, name, image})
    }


  localStorage.setItem(POKEMONS_STORAGE_KEY, JSON.stringify(pokemonFavorites))

  const pokemons = await fetchPokemons(page)
  renderPokemons(pokemons);
} 

const updatePokemon = async () => {
  const pokemonForm = document.forms['pokemonForm'];

  const id = pokemonForm.id.value; 
  const name = pokemonForm.name.value; 
  const image = pokemonForm.image.value; 

  const newPokemons = pokemonFavorites.map(pokemon => {
    if(pokemon.id === id) {
      return {id, name, image}
    }
    return pokemon
  })

  localStorage.setItem(POKEMONS_STORAGE_KEY, JSON.stringify(newPokemons))

  pokemonForm.reset()

  const pokemons = await fetchPokemons(page)
  renderPokemons(pokemons)
  currentPage.innerHTML = page;

}

const documentReady = async () => {
  const nextPage = document.getElementById('nextPage')
  const prevtPage = document.getElementById('prevPage')
  const currentPage = document.getElementById('currentPage')

  const pokemonForm = document.getElementById('pokemonForm')

  const handleSubmit = (event) => {
    event.preventDefault();
    updatePokemon()
  }

  pokemonForm.addEventListener('submit', handleSubmit)

  nextPage.addEventListener('click', async () => {
    const pokemons = await fetchPokemons(++page)
    renderPokemons(pokemons)
    currentPage.innerHTML = page
  })

  prevPage.addEventListener('click', async () => {
    const pokemons = await fetchPokemons(--page)
    renderPokemons(pokemons)
    currentPage.innerHTML = page
  })


  const pokemons = await fetchPokemons()
  // console.log(pokemons)
  renderPokemons(pokemons)
}

document.addEventListener('DOMContentLoaded', documentReady); 
