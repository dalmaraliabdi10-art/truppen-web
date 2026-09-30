// Services för att anropa API:et. Fetch används för att göra HTTP-anrop.
// Addressen till API:et hämtas från Vite-konfigurationen (VITE_API_URL) eller används
// som fallback http://localhost:5275 om den inte finns. Det gör att man kan köra
// frontend och backend på olika portar under utveckling, men i produktion kan
// frontend och backend ligga på samma server.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5275';
// fetch kastar ett undantag om servern inte går att nå men inte om servern svarar med ett fel. Därför
// kapslas fetch in i en egen funktion som hanterar fel och returnerar JSON.
// för exempel: 404 Not Found, 400 Bad Request, 500 Internal Server Error.
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch {
    throw new Error('Kunde inte nå servern. Kontrollera att API:et är igång.');
  }
// Om servern svarar med ett fel, t.ex. 404 Not Found, 400 Bad Request eller 500 Internal Server Error,
// läs felmeddelandet från svaret och kasta ett undantag med det. Då kan komponenterna fånga undantaget och visa meddelandet.
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
// Annars returneras svaret som JSON. Om svaret är 204 No Content returneras null.
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
// readErrorMessage läser felmeddelandet från ett felaktigt svar. 
// Det kan vara ett eget meddelande från controllern eller ett ProblemDetails-objekt med valideringsfel.

async function readErrorMessage(response) {
  try {
    const body = await response.json();

    // Egna 404- och 400-svar från controllern, t.ex. return NotFound("Spelaren finns inte") eller return BadRequest("Något gick fel").
    if (body.message) {
      return body.message;
    }

    // Automatisk validering från [ApiController]: ProblemDetails med ett
    // errors-objekt där varje fält har en lista med meddelanden.
    if (body.errors) {
      return Object.values(body.errors).flat().join(' ');
    }

    if (body.title) {
      return body.title;
    }
  } catch {
    // Svaret var inte JSON. Då får statuskoden räcka.
  }

  return `Något gick fel (${response.status}).`;
}
// getPlayers,getPlayer, createPlayer, updatePlayer och uploadImage anropar API med request-funktionen. 
// Alltså returnerar ett Promise som komponenterna kan använda för att hämta data eller spara data.
export function getPlayers() {
  return request('/api/players');
}

export function getPlayer(id) {
  return request(`/api/players/${id}`);
}

export function createPlayer(player) {
  return request('/api/players', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(player),
  });
}

export function updatePlayer(id, player) {
  return request(`/api/players/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(player),
  });
}

export function uploadImage(id, file) {
  const formData = new FormData();
  formData.append('file', file); // Namnet måste vara "file", anledningen är att det är det namn som controller-metoden tar emot.

  return request(`/api/players/${id}/upload`, {
    method: 'POST',
    body: formData,
    // Content-Type ska inte sättas när man skickar FormData, det gör fetch automatiskt.
  });
}
// Api returnerar bara sökvägen till bilden, t.ex. /images/abc123.jpg.
// För att kunna visa bilden i frontend måste man lägga till BASE_URL framför sökvägen.
export function imageUrl(bildPath) {
  return bildPath ? `${BASE_URL}${bildPath}` : null;
}
