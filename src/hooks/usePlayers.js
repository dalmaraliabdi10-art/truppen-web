import { useCallback, useEffect, useState } from 'react';
import * as api from '../services/api';

// Hook som hämtar alla spelare från API:et och håller reda på laddning och fel.
// Den då slipper då både effekt och felhantering i komponentena. Samma logik kan återanvändas om vyerna behlöver samma data.
export function usePlayers() {
  // Tre separata tillstånd, inte ett. En lista som är tom kan betyda "laddar fortfarande", "inga spelare finns" eller 
  // "anropet misslyckades" och de ska visas på tre olika sätt i gränssnittet.
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback gör att funktionen inte skapas på nytt vid varje omrendering.
  // Utan den byter load identitet hela tiden, useEffect nedan ser en ny
  // beroendelista varje gång och anropar API i en oändlig loop.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setPlayers(await api.getPlayers());
    } catch (err) {
      setError(err.message);
    } finally {
      // finally körs både när det gick bra och när det gick fel.
      // Annars blir spin kvar för alltid vid ett fel.
      setLoading(false);
    }
  }, []);

  // Tom beroendelista via load, hämtar en gång när komponenten monteras.
  useEffect(() => {
    load();
  }, [load]);

  // De tre funktionerna fångar inte fel med flit. 
  // Ett misslyckat sparande ska visas vid formuläret inte som ett fel över hela listan,
  // så den som anropar får ta hand om felet.
  async function addPlayer(dto) {
    const created = await api.createPlayer(dto);
    // Servern sorterar på tröjnummer, så listan sorteras om lokalt för att inte hamna i otakt med nästa hämtning.
    setPlayers((prev) => [...prev, created].sort((a, b) => a.nummer - b.nummer));
    return created;
  }

  async function savePlayer(id, dto) {
    const updated = await api.updatePlayer(id, dto);
    setPlayers((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }

  async function setPlayerImage(id, file) { // 
    const updated = await api.uploadImage(id, file);
    setPlayers((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }

  return { players, loading, error, reload: load, addPlayer, savePlayer, setPlayerImage };
}