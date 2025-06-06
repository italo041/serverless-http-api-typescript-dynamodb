export async function getRandomStarWarsFilm() {
  try {
    const response = await fetch("https://swapi.dev/api/films/");
    const data = await response.json();

    const films = data.results;
    const randomIndex = Math.floor(Math.random() * films.length);
    const film = films[randomIndex];

    return film;
  } catch (error) {
    console.error("Error in getRandomStarWarsFilm", error);
  }
}
