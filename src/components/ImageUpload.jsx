import { useState } from 'react';

// Egen komponent för uppladdningen så att PlayerCard slipper ännu två tillstånd. Den äger sin egen laddning och sitt eget fel, 
// precis som formulären gör — ett misslyckat filval ska synas vid knappen.
function ImageUpload({ player, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleChange(event) {
    // files är en lista även när bara en fil kan väljas. Avbryter användaren dialogen är listan tom, och då ska ingenting hända.
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      await onUpload(player.id, file);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      // Nollställer fältet. Utan detta räknas samma fil som "oförändrad" nästa gång den väljs, change-händelsen uteblir och 
      // ett nytt försök efter ett fel gör ingenting.
      event.target.value = '';
    }
  }

  return (
    <>
      {/* Ett file-input går inte att styla. Det vanliga greppet är att gömma det och låta labeln runt omkring se ut som en knapp
          klick på labeln öppnar ändå filväljaren. */}
      <label className="btn btn--ghost btn--small file-label">
        {uploading ? 'Laddar upp…' : player.bildPath ? 'Byt bild' : 'Lägg till bild'}
        <input
          type="file"
          // Speglar AllowedExtensions i FileStorageService. Filtrerar bara vad dialogen föreslår servern kontrollerar på riktigt.
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          disabled={uploading}
        />
      </label>

      {error && (
        <p className="upload-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

export default ImageUpload;
