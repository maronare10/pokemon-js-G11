const fetchPokemons = async () => {
  // https://pokeapi.co/api/v2/pokemon

  const url = 'https://pokeapi.co/api/v2/pokemon'
  const response = await fetch(url)
  const data = await response.json()
  // console.log(response)
  // console.log(data)
  const dataResults = data.results
  // console.log(dataResults)
  return dataResults
}

const renderPokemons = (pokemons) => {
  const pokemonList = document.getElementById('pokemonList')

  let elements = ''

  pokemons.forEach(pokemon => {
    elements += `<h2>${pokemon.name}</h2>`
  })

  pokemonList.innerHTML = elements

}



const documentReady = async () => {
  const pokemons = await fetchPokemons()
  renderPokemons(pokemons)

}

document.addEventListener('DOMContentLoaded', documentReady);

