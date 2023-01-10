let page = 1

const fetchPokemons = async (page = 1) => {
  const limit = 9
  const offset = (page - 1) * limit
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  const response = await axios.get(url) // Devuelve una promesa
  const dataResults = response.data.results.map(pokemon => {
    const id = pokemon.url.split('/').at(6)
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    return {
      ...pokemon,
      id,
      image
    }
  })

  return dataResults
}

const renderPokemons = (pokemons) => {
  const pokemonsList = document.getElementById('pokemonsList')

  let elements = ''

  pokemons.forEach(pokemon => {
    elements += `<article class='pokemons-item'>
      <img src='${pokemon.image}' width='80' height='80'></img>
      <h2>#${pokemon.id} ${pokemon.name}</h2>
    </article>
    `
  })
  pokemonsList.innerHTML = elements
}

const documentReady = async () => {
  const nextPage = document.getElementById('nextPage')
  const prevtPage = document.getElementById('prevPage')
  const currentPage = document.getElementById('currentPage')

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
