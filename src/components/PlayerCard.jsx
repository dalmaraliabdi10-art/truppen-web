import { imageUrl } from '../services/api';

// Kortet tar emot en spelare via props och visar den. Det hämtar ingenting själv och äger inget state,
// allt det behöver kommer utifrån. En sådan komponent är lätt att återanvända och lätt att resonera om,
// eftersom samma props alltid ger samma utseende.
function PlayerCard({ player }) {
  const bild = imageUrl(player.bildPath);

  return (
    <article className="player-card">
      <div className="player-card__media">
        {bild ? (
          // alt-texten beskriver bilden för skärmläsare och visas om bilden inte kan laddas,
          // till exempel om filen tagits bort från servern.
          <img src={bild} alt={`Porträtt på ${player.namn}`} />
        ) : (
          // Ingen bild uppladdad än. Tröjnumret får fylla platsen i stället för en tom ruta.
          // aria-hidden eftersom numret redan står i texten.
          <span className="player-card__placeholder" aria-hidden="true">
            {player.nummer}
          </span>
        )}
      </div>

      <div className="player-card__body">
        <div className="player-card__heading">
          <h2>{player.namn}</h2>
          <span className="player-card__number">#{player.nummer}</span>
        </div>

        <p className="player-card__position">
          {player.position} · {player.linje}
          {/* Vissa positioner saknar klassiskt nummer och får null från API:et. Då ska hela stycket utebli, inte skrivas ut som "null". */}
          {player.klassisktNummer && ` · nummer ${player.klassisktNummer}`}
        </p>

        {player.anteckning && (
          <p className="player-card__note">{player.anteckning}</p>
        )}

        <span
          className={
            player.status === 'Skadad'
              ? 'badge badge--injured'
              : 'badge badge--available'
          }
        >
          {player.status}
        </span>
      </div>
    </article>
  );
}

export default PlayerCard;
