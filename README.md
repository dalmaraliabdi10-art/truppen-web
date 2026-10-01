Truppen Web

Webbgränssnitt för spelarregistret. React med Vite. Använder samma API som mobilappen.

--

Teknik

  React med Vite
  Komponentbaserad struktur med en egen hook, usePlayers
  All API-kommunikation samlad i services/api.js
  Responsiv layout med CSS Grid och Flexbox

--

Köra projektet

  API måste köras samtidigt. Starta truppen-api med dotnet run i en egen terminal först.
  git clone <repo-url>
  cd truppen-web
  npm install
  npm run dev

Appen startar på http://localhost:5173

API-adressen är http://localhost:5275 och kan bytas med miljövariabeln VITE_API_URL.

--

Funktioner

Lista

  Alla spelare med bild eller tröjnummer, namn, position, linje, klassiskt tröjnummer och status.

Lägg till

  Formulär med namn, tröjnummer, position och anteckning. Bilden läggs till separat efteråt, servern sätter status och bildsökväg.

Redigera

  Namn, nummer, position, status och anteckning, direkt i kortet.

Bilduppladdning 

  Egen knapp på varje kort. Bilden laddas upp när filen väljs och visas sedan i kortet.

Felhantering

  Nätverksfel och felsvar från API:et visas i gränssnittet. Appen kraschar inte och fryser inte.

--

Struktur

  src/components – PlayerCard, PlayerList, PlayerForm, PlayerEditForm, ImageUpload

  src/hooks – usePlayers, hämtning och state

  src/services – api.js, allt som rör HTTP

  src/constants.js – positioner och statusar, speglar API:ets enums

  src/index.css – färgvariabler och all styling

--

Responsiv design

  Brytpunkten är 40rem, alltså 640px, och används både för kortlistan och för formuläret.

  Under 640px: en kolumn. Kort och formulärfält under varandra.

  Över 640px: kortlistan blir ett rutnät med repeat auto-fill och minmax 20rem till 1fr. Webbläsaren räknar själv ut hur många kolumner som får plats, så antalet anpassas efter skärmen i stället för att vara fast(hårdkodade).

--

Felhantering

  Varje hämtning har tre tillstånd: laddar, fel och data. En tom lista är misstänkt, den kan betyda att hämtningen pågår, att det inte finns några spelare, eller att anropet misslyckades. De ska visas på tre olika sätt.

  fetch kastar bara fel när anropet inte gick fram alls. Ett svar med 400 eller 404 räknas som lyckat, så response.ok kontrolleras separat i api.js. Felmeddelandet som API skickar plockas ut och visas för användaren – skriver man tröjnummer 0 står det "Tröjnumret måste vara mellan 1 och 99" i gränssnittet.

  Fel vid sparande visas vid formuläret, inte över hela listan och formuläret töms bara när sparandet lyckats.

--

Val jag gjort

  Vite framför Create React App. Vite startar på någon sekund och laddar om direkt när jag sparar.

  All API kommunikation i en fil. Alternativet är en fetch i varje komponent. Då hamnar adressen på sex ställen och felhanteringen skrivs om sex gånger, lite olika varje gång.

  Två formulär i stället för ett. API har två olika DTO, PlayerCreateDto saknar status, PlayerUpdateDto har den. Webben speglar den skillnaden.

  Validering på två ställen. required och min/max i fälten ger direkt återkoppling utan att något anrop skickas. Men klienten går inte att lita på, så valideringen i C# ligger kvar.

  CSS-variabler på root. Alla färger på ett ställe. Kontrasten är kontrollerad mot WCAG AA, den gröna accentfärgen ligger på 5,4 till 1 mot vitt, kravet är 4,5 till 1.

  --

Förbättringar för framtiden

  Ingen möjlighet att ta bort en spelare, API har ingen DELETE
  Ingen inloggning
  Två spelare kan ha samma tröjnummer
