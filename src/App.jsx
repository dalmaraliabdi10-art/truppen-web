import PlayerList from './components/PlayerList';
import { usePlayers } from './hooks/usePlayers';

function App() {
  // All datahämtning ligger i hooken. App bestämmer bara vad som ska visas och skickar vidare tillstånden till listan som props.
  const { players, loading, error, reload } = usePlayers();

  const skadade = players.filter((p) => p.status === 'Skadad').length;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Truppen</h1>
          <p>Spelarregister för laget</p>
        </div>

        {/* Sammanfattningen visas bara när det faktiskt finns data att sammanfatta, annars står det "0 spelare" medan sidan laddar. */}
        {!loading && !error && players.length > 0 && (
          <p className="app-header__summary">
            {players.length} spelare · {skadade} skadade
          </p>
        )}
      </header>

      <main className="app-main">
        <PlayerList
          players={players}
          loading={loading}
          error={error}
          onRetry={reload}
        />
      </main>
    </div>
  );
}

export default App;
