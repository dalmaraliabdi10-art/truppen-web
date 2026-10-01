import { useState } from 'react';
import { POSITIONER } from '../constants';

const TOMT_FORMULAR = { namn: '', nummer: '', position: 'Målvakt', anteckning: '' };

function PlayerForm({ onAdd }) {
  // Ett state-objekt för alla fält i stället för fyra useState.
  // Då räcker en enda handleChange för hela formuläret.
  const [form, setForm] = useState(TOMT_FORMULAR);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    // [name] är en beräknad nyckel fältets name attribut avgör vilken egenskap som uppdateras. Spread först så att övriga fält behålls.
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    // Utan detta laddar webbläsaren om hela sidan när formuläret skickas, React-staten nollställs och anropet hinner aldrig fram.
    event.preventDefault();

    setError(null);
    setSaving(true);

    try {
      await onAdd({
        namn: form.namn.trim(),
        // Ett input-fält ger alltid en sträng, även med type="number".
        // API förväntar sig ett heltal, så värdet konverteras här.
        nummer: Number(form.nummer),
        position: form.position,
        anteckning: form.anteckning.trim(),
      });

      // Töms först när sparandet lyckats. Misslyckas det står texten kvar så att användaren slipper skriva om allt.
      setForm(TOMT_FORMULAR);
    } catch (err) {
      // Felet från API visas vid formuläret, inte över hela listan.
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="player-form" onSubmit={handleSubmit}>
      <h2>Lägg till spelare</h2>

      <div className="player-form__grid">
        {/* Fälten är kontrollerade värdet kommer från state och varje tangenttryck går via handleChange. React äger innehållet,
            inte DOM-elementet. */}
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
          <span>Anteckning</span>
          <textarea
            name="anteckning"
            rows={2}
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

      {/* Knappen låses medan anropet pågår, annars kan dubbelklick skapa två spelare. */}
      <button type="submit" className="btn" disabled={saving}>
        {saving ? 'Sparar…' : 'Lägg till'}
      </button>
    </form>
  );
}

export default PlayerForm;
