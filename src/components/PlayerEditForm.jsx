import { useState } from 'react';
import { POSITIONER, STATUSAR } from '../constants';

// Eget formulär i stället för att återanvända PlayerForm, eftersom API har två olika DTO,
// PlayerCreateDto saknar status (servern sätter Tillgänglig), PlayerUpdateDto har den. Webben speglar den skillnaden.
function PlayerEditForm({ player, onSave, onCancel }) {
  // Startvärdena kommer från spelaren som redigeras. useState tar emot dem en gång när komponenten monteras,
  // ändras player senare slår det inte igenom här, vilket är precis vad man vill mitt i en redigering.
  const [form, setForm] = useState({
    namn: player.namn,
    // Inputfält arbetar med strängar. Konverteras tillbaka vid submit.
    nummer: String(player.nummer),
    position: player.position,
    status: player.status,
    anteckning: player.anteckning,
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await onSave({
        namn: form.namn.trim(),
        nummer: Number(form.nummer),
        position: form.position,
        status: form.status,
        anteckning: form.anteckning.trim(),
      });
      // Ingen setSaving(false) här. Lyckas sparandet stänger kortet formuläret och komponenten försvinner, det finns inget state
      // kvar att återställa. Därför inget finally, till skillnad från PlayerForm som ligger kvar på sidan efteråt.
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="player-edit" onSubmit={handleSubmit}>
      <div className="player-edit__grid">
        <label className="field">
          <span>Namn</span>
          <input
            name="namn"
            value={form.namn}
            onChange={handleChange}
            maxLength={100}
            required
          />
        </label>

        <label className="field">
          <span>Tröjnummer</span>
          <input
            name="nummer"
            type="number"
            min="1"
            max="99"
            value={form.nummer}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field field--wide">
          <span>Position</span>
          <select name="position" value={form.position} onChange={handleChange}>
            {POSITIONER.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--wide">
          <span>Status</span>
          <select name="status" value={form.status} onChange={handleChange}>
            {STATUSAR.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--wide">
          <span>Anteckning</span>
          <textarea
            name="anteckning"
            rows={3}
            value={form.anteckning}
            onChange={handleChange}
          />
        </label>
      </div>

      {error && (
        <p className="player-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Sparar…' : 'Spara'}
        </button>
        {/* type="button" är viktigt. Utan det är knappen en submit-knapp som standard och Avbryt skulle skicka formuläret. */}
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onCancel}
          disabled={saving}
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}

export default PlayerEditForm;
