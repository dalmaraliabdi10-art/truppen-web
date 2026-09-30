import PlayerCard from './PlayerCard';

// Listan avgör vilket av fyra lägen som ska visas. Den hämtar inget själv utan får tillstånden från usePlayers via App.
function PlayerList({ players, loading, error, onRetry }) {
  if (loading) {
    return <p className="state">Laddar truppen…</p>;
  }

  if (error) {
    return (
      // role="alert" gör att skärmläsare läser upp felet direkt när det dyker upp,
      // i stället för att användaren måste navigera fram till det.
      <div className="state state--error" role="alert">
        <p>{error}</p>
        <button type="button" className="btn" onClick={onRetry}>
          Försök igen
        </button>
      </div>
    );
  }

  if (players.length === 0) {
    return <p className="state">Truppen är tom. Lägg till en spelare för att börja.</p>;
  }

  return (
    <ul className="player-list">
      {players.map((player) => (
        // key måste vara stabil och unik. Spelarens id kommer från databasen och ändras aldrig.
        // Använder man listans index i stället återanvänder React fel element när listan sorteras om eller något tas bort.
        <li key={player.id}>
          <PlayerCard player={player} />
        </li>
      ))}
    </ul>
  );
}

export default PlayerList;
