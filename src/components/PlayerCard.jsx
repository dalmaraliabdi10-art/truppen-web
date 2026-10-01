import { useState } from 'react';
import { imageUrl } from '../services/api';
import PlayerEditForm from './PlayerEditForm';

// Kortet äger ett enda state: om formuläret är öppet eller inte. Det är ren UI-state och hör hemma här, 
// spelardatan ägs fortfarande av App via usePlayers, och kortet sparar inget själv utan anropar onSave.
function PlayerCard({ player, onSave }) {
  const [editing, setEditing] = useState(false);
  const bild = imageUrl(player.bildPath);

  async function handleSave(dto) {
    // onSave kastar vidare om API svarar med fel. Då hoppas raden under över, formuläret står kvar och visar felmeddelandet.
    await onSave(player.id, dto);
    setEditing(false);
  }

  if (editing) {
    return (
      <article className="player-card player-card--editing">
        <div className="player-card__heading">
          <h2>Redigerar {player.namn}</h2>
        </div>

        <PlayerEditForm
          player={player}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      </article>
    );
  }

  return (
    <article className="player-card">
      <div className="player-card__media">
        {bild ? (
          // alt-texten beskriver bilden för skärmläsare och visas om bilden inte kan laddas,
          // till exempel om filen tagits bort från servern.
          <img src={bild} alt={`Porträtt på ${player.namn}`} />
        ) : (
          // Ingen bild uppladdad än. Tröjnumret får fylla platsen i stället
          // för en tom ruta. aria-hidden eftersom numret redan står i texten.
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
          {player.position}
          {/* För målvakter är position och linje samma ord ("Målvakt · Målvakt"). Linjen tillför inget då och utelämnas. */}
          {player.linje !== player.position && ` · ${player.linje}`}
          {/* Vissa positioner saknar klassiskt nummer och får null från API:et. Då ska hela stycket utebli, inte skrivas ut som "null".
              "klassiskt nr" för att skilja det från spelarens eget tröjnummer. */}
          {player.klassisktNummer && ` · klassiskt nr ${player.klassisktNummer}`}
        </p>

        {player.anteckning && (
          <p className="player-card__note">{player.anteckning}</p>
        )}

        <div className="player-card__actions">
          <span
            className={
              player.status === 'Skadad'
                ? 'badge badge--injured'
                : 'badge badge--available'
            }
          >
            {player.status}
          </span>

          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => setEditing(true)}
          >
            Redigera
          </button>
        </div>
      </div>
    </article>
  );
}

export default PlayerCard;
