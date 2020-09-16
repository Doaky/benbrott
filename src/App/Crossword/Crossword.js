import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Crossword.module.scss';
import { CELLS, CLUES } from './data';
import withFormFactor from 'utils/withFormFactor';
import { KEY_CODES } from 'utils/events';

const ACROSS = 'across';
const DOWN = 'down';
const ROW_COUNT = CELLS.length;
const COL_COUNT = CELLS[0].length;
const LOCAL_STORAGE_KEY = 'first_crossword';

class Crossword extends React.PureComponent {
  static propTypes = {
    isDark: PropTypes.bool,
    formFactor: PropTypes.string
  };
  static defaultProps = { isDark: false };

  constructor(props) {
    super(props);
    this.crosswordContainer = React.createRef();
    this.clueRefs = {};
    const storedLetters = localStorage.getItem(LOCAL_STORAGE_KEY);
    const letters = storedLetters ? JSON.parse(storedLetters) : this.constructEmptyLetters();
    this.state = {
      currentCell: { row: 0, col: 0 },
      clueSet: ACROSS,
      containerSize: 0,
      letters
    };
  }

  componentDidMount() {
    this.setContainerSize();
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate() {
    this.setContainerSize();
  }

  storeLetters = letters => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(letters));

  constructEmptyLetters = () => {
    let letters = [];
    CELLS.forEach(cellRow => {
      let row = [];
      cellRow.forEach(() => {
        row.push('');
      });
      letters.push(row);
    });
    return letters;
  };

  setContainerSize = () => {
    if (this.crosswordContainer) {
      const { width, height } = this.crosswordContainer.current.getBoundingClientRect();
      const containerSize = Math.min(width, height);
      this.setState({ containerSize });
    }
  };

  isPhone = () => this.props.formFactor === 'PHONE';

  isCurrentCell = (rowIdx, colIdx) => {
    const { row, col } = this.state.currentCell;
    return row === rowIdx && col === colIdx;
  };

  onKeyDown = event => {
    const { code } = event;
    if (code === KEY_CODES.TAB || code === KEY_CODES.ENTER) {
      return;
    }
    event.preventDefault();
    const { currentCell, clueSet, letters } = this.state;
    const { row, col } = currentCell;
    const cell = CELLS[row][col];
    if (code === KEY_CODES.SPACE) {
      this.switchClueSet(cell);
    } else if (code === KEY_CODES.UP) {
      if (clueSet === ACROSS) {
        this.switchClueSet(cell);
      } else {
        let i = row - 1;
        while (i >= 0) {
          if (CELLS[i][col]) {
            this.onCellClick(i, col);
            break;
          }
          i = i - 1;
        }
      }
    } else if (code === KEY_CODES.DOWN) {
      if (clueSet === ACROSS) {
        this.switchClueSet(cell);
      } else {
        let i = row + 1;
        while (i < ROW_COUNT) {
          if (CELLS[i][col]) {
            this.onCellClick(i, col);
            break;
          }
          i = i + 1;
        }
      }
    } else if (code === KEY_CODES.LEFT) {
      if (clueSet === DOWN) {
        this.switchClueSet(cell);
      } else {
        let i = col - 1;
        while (i >= 0) {
          if (CELLS[row][i]) {
            this.onCellClick(row, i);
            break;
          }
          i = i - 1;
        }
      }
    } else if (code === KEY_CODES.RIGHT) {
      if (clueSet === DOWN) {
        this.switchClueSet(cell);
      } else {
        let i = col + 1;
        while (i < COL_COUNT) {
          if (CELLS[row][i]) {
            this.onCellClick(row, i);
            break;
          }
          i = i + 1;
        }
      }
    } else if (code === KEY_CODES.BACKSPACE) {
      letters[row][col] = '';
      this.storeLetters(letters);
      if (clueSet === ACROSS) {
        this.goToPreviousAcrossCell(row, col);
      } else {
        this.goToPreviousDownCell(row, col);
      }
    } else if (code.length === 4 && code.startsWith('Key')) {
      letters[row][col] = code[3];
      this.storeLetters(letters);
      if (clueSet === ACROSS) {
        this.goToNextOpenAcrossCell(row, col);
      }
    }
  };

  goToNextOpenAcrossCell = (row, col) => {
    if (this.goToNextOpenCellOfAcrossClue(row, col + 1)) {
      return;
    }
    const currentClue = CELLS[row][col][ACROSS];
    const acrossClues = Object.keys(CLUES[ACROSS]);
    let i = acrossClues.indexOf(currentClue) + 1;
    while (i < acrossClues.length) {
      const number = acrossClues[i];
      if (this.goToFirstOpenCellOfAcrossClue(number)) {
        return;
      }
      i = i + 1;
    }
    //this.goToFirstOpenDownCell
  };

  goToFirstOpenCellOfAcrossClue = number => {
    const { row, col } = CLUES[ACROSS][number].startingCell;
    return this.goToNextOpenCellOfAcrossClue(row, col, number);
  };

  goToNextOpenCellOfAcrossClue(row, startCol, number) {
    let col = startCol;
    while (CELLS[row][col]) {
      if (!this.state.letters[row][col]) {
        this.scrollClueIntoView(ACROSS, number);
        this.setState({ clueSet: ACROSS, currentCell: { row, col } });
        return true;
      }
      col = col + 1;
    }
    return false;
  }

  goToPreviousAcrossCell = (currentRow, currentCol) => {
    if (CELLS[currentRow][currentCol - 1]) {
      this.setState({ currentCell: { row: currentRow, col: currentCol - 1 } });
      return;
    }
    const currentClue = CELLS[currentRow][currentCol][ACROSS];
    const acrossClueNumbers = Object.keys(CLUES[ACROSS]);
    const previousClueIndex = acrossClueNumbers.indexOf(currentClue) - 1;
    if (previousClueIndex < 0) {
      const downClueNumbers = Object.keys(CLUES[DOWN]);
      this.goToLastCellOfDownClue(downClueNumbers[downClueNumbers.length - 1]);
      return;
    }
    this.goToLastCellOfAcrossClue(acrossClueNumbers[previousClueIndex]);
  };

  goToPreviousDownCell = (currentRow, currentCol) => {
    if (CELLS[currentRow - 1] && CELLS[currentRow - 1][currentCol]) {
      this.setState({ currentCell: { row: currentRow - 1, col: currentCol } });
      return;
    }
    const currentClue = CELLS[currentRow][currentCol][DOWN];
    const downClueNumbers = Object.keys(CLUES[DOWN]);
    const previousClueIndex = downClueNumbers.indexOf(currentClue) - 1;
    if (previousClueIndex < 0) {
      const acrossClueNumbers = Object.keys(CLUES[ACROSS]);
      this.goToLastCellOfAcrossClue(acrossClueNumbers[acrossClueNumbers.length - 1]);
      return;
    }
    this.goToLastCellOfDownClue(downClueNumbers[previousClueIndex]);
  };

  goToLastCellOfAcrossClue = number => {
    const { row, col } = CLUES[ACROSS][number].startingCell;
    let i = col;
    while (CELLS[row][i + 1]) {
      i = i + 1;
    }
    this.scrollClueIntoView(ACROSS, number);
    this.setState({ clueSet: ACROSS, currentCell: { row, col: i } });
  };

  goToLastCellOfDownClue = number => {
    const { row, col } = CLUES[DOWN][number].startingCell;
    let i = row;
    while (CELLS[i + 1] && CELLS[i + 1][col]) {
      i = i + 1;
    }
    this.scrollClueIntoView(DOWN, number);
    this.setState({ clueSet: DOWN, currentCell: { row: i, col } });
  };

  getClueKey = (clueSet, number) => `${clueSet}_${number}`;

  scrollClueIntoView = (clueSet, number) => {
    const element = this.clueRefs[this.getClueKey(clueSet, number)];
    if (element) {
      element.scrollIntoView();
    }
  };

  switchClueSet = cell => {
    const clueSet = this.state.clueSet === ACROSS ? DOWN : ACROSS;
    this.scrollClueIntoView(clueSet, cell[clueSet]);
    this.setState({ clueSet });
  };

  onCellClick = (rowIdx, colIdx) => {
    const cell = CELLS[rowIdx][colIdx];
    if (this.isCurrentCell(rowIdx, colIdx)) {
      this.switchClueSet(cell);
    } else {
      const clueSet = this.state.clueSet;
      this.scrollClueIntoView(clueSet, cell[clueSet]);
      this.setState({ currentCell: { row: rowIdx, col: colIdx } });
    }
  };

  renderCell = (cell, number, rowIdx, colIdx) => {
    const { currentCell, clueSet, letters } = this.state;
    const { row, col } = currentCell;
    const inClue = cell[clueSet] === CELLS[row][col][clueSet];
    const isCurrent = rowIdx === row && colIdx === col;
    const cellStyles = classNames([
      styles.cell,
      this.props.isDark ? styles.dark : styles.light,
      inClue && styles.in_clue,
      isCurrent && styles.current
    ]);
    const decoration = number ? (
      <text x="1.5" y="1" alignmentBaseline="hanging" className={styles.clue_decoration}>
        {number}
      </text>
    ) : null;
    return (
      <svg viewBox="0 0 25 25" className={cellStyles} onClick={() => this.onCellClick(rowIdx, colIdx)}>
        {decoration}
        <text x="50%" y="57%" textAnchor="middle" alignmentBaseline="central">
          {letters[rowIdx][colIdx]}
        </text>
      </svg>
    );
  };

  renderCrossword = () => {
    const containerSizePx = `${this.state.containerSize}px`;
    const crosswordStyle = { height: containerSizePx, width: containerSizePx };

    let num = 0;
    const renderedCells = CELLS.map((row, rowIdx) => {
      return row.map((cell, colIdx) => {
        if (!cell) {
          return <div />;
        }
        const { across, down } = cell;
        let number;
        let maxClue = Math.max(across, down);
        if (maxClue > num) {
          number = maxClue;
          num = maxClue;
        }

        return this.renderCell(cell, number, rowIdx, colIdx);
      });
    });

    return (
      <div className={styles.crossword_container} ref={this.crosswordContainer}>
        <div className={styles.crossword} style={crosswordStyle}>
          {renderedCells}
        </div>
      </div>
    );
  };

  renderClue = (clueSet, number, isCurrent) => {
    const classes = classNames([
      styles.clue,
      this.props.isDark ? styles.dark : styles.light,
      isCurrent && styles.current
    ]);
    const key = this.getClueKey(clueSet, number);
    const ref = element => {
      this.clueRefs[key] = element;
    };
    return (
      <div className={classes} key={key} ref={ref}>
        {number}. {CLUES[clueSet][number].clue}
      </div>
    );
  };

  renderClueList = clueSet => {
    const { row, col } = this.state.currentCell;
    const isCurrentClueSet = clueSet === this.state.clueSet;
    return Object.keys(CLUES[clueSet]).map(number => {
      const isCurrent = isCurrentClueSet && number === CELLS[row][col][clueSet];
      return this.renderClue(clueSet, number, isCurrent);
    });
  };

  renderClues() {
    const clueSet = this.state.clueSet;
    if (this.isPhone()) {
      const { row, col } = this.state.currentCell;
      const number = CELLS[row][col][clueSet];
      return this.renderClue(clueSet, number, false);
    }

    const renderedAcross = this.renderClueList(ACROSS);
    const renderedDown = this.renderClueList(DOWN);
    return (
      <div className={styles.clues}>
        {renderedAcross}
        {renderedDown}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderCrossword()}
        {this.renderClues()}
      </div>
    );
  }
}

export default withFormFactor(Crossword, true);
