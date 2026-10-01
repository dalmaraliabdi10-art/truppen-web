// Speglar enum Position i API. Skickas ett värde som inte finns där svarar servern 400, 
// så listan och enumen måste hållas i takt. De ligger i en egen fil eftersom både formuläret för att lägga till och formuläret för att 
// redigera behöver den, annars finns den på två ställen och det är en tidsfråga innan bara den ena uppdateras.
export const POSITIONER = [
  'Målvakt',
  'Högerback',
  'Vänsterback',
  'Mittback',
  'Wingback',
  'Defensivmittfältare',
  'Centralmittfältare',
  'Offensivmittfältare',
  'Yttermittfältare',
  'Högerytter',
  'Vänsterytter',
  'Anfallare',
];

// Speglar enum PlayerStatus. Används bara vid redigering, en ny spelare får Tillgänglig av servern och 
// fältet finns inte i PlayerCreateDto.
export const STATUSAR = ['Tillgänglig', 'Skadad'];
