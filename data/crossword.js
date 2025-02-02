const createCells = letters => {
  let nextClue = 1;
  return letters.reduce((rows, row, rowIndex) => {
    const prevRow = rows[rowIndex - 1];
    const newRow = row.reduce((cells, letter, letterIndex) => {
      if (!letter || letter === ' ') {
        cells.push(null);
        return cells;
      }
      const leftCell = cells[letterIndex - 1];
      const prevAcross = leftCell && leftCell.across;
      const across = prevAcross ? prevAcross : nextClue.toString();

      const aboveCell = prevRow && prevRow[letterIndex];
      const prevDown = aboveCell && aboveCell.down;
      const down = prevDown ? prevDown : nextClue.toString();

      if (!(prevAcross && prevDown)) {
        nextClue = nextClue + 1;
      }
      cells.push({ letter, across, down });
      return cells;
    }, []);
    rows.push(newRow);
    return rows;
  }, []);
};

const createClues = (cells, acrossClues, downClues) => {
  const across = {};
  const down = {};
  let prevAcross = 0;
  let prevDown = 0;
  cells.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (!cell) {
        return;
      }
      const acrossNumber = parseInt(cell.across);
      if (acrossNumber > prevAcross) {
        across[acrossNumber] = {
          clue: acrossClues.shift(),
          startingCell: { row: rowIdx, col: colIdx }
        };
        prevAcross = acrossNumber;
      }
      const downNumber = parseInt(cell.down);
      if (downNumber > prevDown) {
        down[downNumber] = {
          clue: downClues.shift(),
          startingCell: { row: rowIdx, col: colIdx }
        };
        prevDown = downNumber;
      }
    });
  });
  return { across, down };
};

const LETTERS = [
  ['A', 'T', 'E', 'F', ' ', ' ', 'T', 'A', 'P', 'E', ' ', ' ', 'A', 'L', 'L', 'I'],
  ['F', 'A', 'V', 'A', ' ', 'J', 'I', 'H', 'A', 'D', 'S', ' ', 'B', 'O', 'A', 'T'],
  ['A', 'C', 'I', 'D', ' ', 'U', 'T', 'O', 'P', 'I', 'A', ' ', 'R', 'A', 'Z', 'E'],
  ['R', 'O', 'L', 'E', 'P', 'L', 'A', 'Y', 'I', 'N', 'G', 'G', 'A', 'M', 'E', 'S'],
  [' ', ' ', ' ', ' ', 'B', 'I', 'N', ' ', ' ', 'S', 'G', 'A', ' ', ' ', ' ', ' '],
  ['N', 'E', 'W', 'E', 'R', 'A', ' ', ' ', 'N', 'O', 'E', 'L', ' ', 'R', 'G', 'B'],
  ['E', 'V', 'A', 'L', 'S', ' ', 'B', 'O', 'U', 'N', 'D', ' ', 'A', 'E', 'R', 'O'],
  ['Z', 'E', 'R', 'O', ' ', 'S', 'E', 'X', 'T', ' ', ' ', 'H', 'I', 'D', 'E', 'R'],
  [' ', 'N', 'I', 'T', 'T', 'A', 'N', 'Y', ' ', 'S', 'P', 'O', 'O', 'F', 'E', 'D'],
  [' ', 'T', 'O', 'E', 'R', 'I', 'N', 'G', ' ', 'T', 'A', 'N', 'L', 'I', 'N', 'E'],
  [' ', ' ', ' ', 'S', 'A', 'D', 'I', 'E', 'H', 'A', 'W', 'K', 'I', 'N', 'S', ' '],
  ['T', 'A', 'U', ' ', 'P', 'H', 'E', 'N', 'O', 'M', ' ', ' ', ' ', ' ', ' ', ' '],
  ['I', 'M', 'P', 'E', 'D', 'E', ' ', ' ', 'S', 'P', 'I', 'R', 'I', 'T', 'E', 'D'],
  ['T', 'W', 'O', 'F', 'O', 'L', 'D', ' ', 'T', 'E', 'N', 'O', 'R', 'I', 'S', 'T'],
  ['H', 'A', 'N', 'S', 'O', 'L', 'O', ' ', 'E', 'D', 'G', 'E', 'L', 'E', 'S', 'S'],
  ['E', 'Y', 'E', ' ', 'R', 'O', 'N', ' ', 'D', 'E', 'E', 'S', ' ', ' ', ' ', ' ']
];

const ACROSS = [
  'eseehc keerG',
  'Item purchased before you move',
  'There, in Toledo',
  'What Hannibal Lecter might order instead of kidney?',
  'Islamic struggles',
  'Something that Flex Seal can repair, allegedly',
  'One element of good cooking according to Samin Nosrat',
  'A perfect place',
  'Destroy, as a city',
  'Pokémon, Skyrim, Dark Souls, etc.',
  'Trash can',
  'Common school org.',
  'Cap manufacturer for Major League Baseball',
  'December 25',
  'Unnecessary expense in many PC builds',
  'Perf. reviews, for example',
  'Tied up',
  'Prefix, often used with fluids',
  'arccos(1)',
  'Dirty text message',
  `1 of 2 roles in a children's game`,
  'State College lion',
  'Parodied, as a movie',
  'Piece of jewelry rarely visible in the winter',
  'Souvenir from the beach',
  'Non-traditional dance format',
  '19th letter of the Greek alphabet',
  'In sports, a young superstar',
  'Obstruct',
  'Lively',
  '2x',
  'One who plays the saxophone, maybe',
  `A Wookiee's best friend`,
  'Like a sphere',
  `A pupil's home`,
  `Scabbers' owner`,
  'Disappointments on a report card'
];

const DOWN = [
  'Not close',
  'Dinner Bell?',
  'Sauron, Voldemort, Vader, etc.',
  'Kanye West ft. Post Malone',
  'A prisoner in Tartarus',
  'Greeting for a captain',
  'Big _, in Boston',
  `First name of PSG's all-time leading scorer`,
  'A Pokémon quick to run away, or, a magical lead-in',
  'Sandy soil',
  'What many people do on weekends, especially during a pandemic',
  'Anions with one less oxygen, usually',
  'Meryl Streep, as a Child?',
  'Slumped',
  'Cheap beers at HH',
  'A woman, casually',
  '_ Perce',
  'A social occasion',
  'Nintendo character who made his debut as a villain on Game Boy',
  'Popular street food in Mexico',
  'It goes next to the washer, usually',
  'A real-estate brokerage',
  'Spinach, arugula, romaine, etc.',
  'Edge of Peru?',
  'Lead singer of the Jets, in song',
  '8th element in the periodic table',
  'Traditionally, a mayo-less sauce',
  'Greeted',
  `Sound when someone isn't paying attention, perhaps`,
  'Type of spider that burrows underground',
  'Cause of death of a Disney king',
  'Clawed foot',
  'Had people over',
  '10%, traditionally',
  '_ Center, home of the Orlando Magic',
  'The Pittsburgh Penguins, leading 4-3, for example',
  'Respects paid, in chats?',
  `Elsa's alter ego, in Jojo Rabbit`,
  'Masses of fish eggs',
  'Not digital, but used on the WWW',
  'What every game starts with, but few end in',
  'Feminine suffix',
  'Aaron Donald, Warren Sapp, Ndamukong Suh, etc.',
  'Wear, as a hat'
];

export const CELLS = createCells(LETTERS);
export const CLUES = createClues(CELLS, ACROSS, DOWN);
