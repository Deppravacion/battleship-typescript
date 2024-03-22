import * as rs from "readline-sync";

let grid: { id: string; hasShip: boolean }[][] = [];
const gridSize: number = 3;
let guessArr: string[] = [];
let fleetSizeVariable: number = 2;
const fleetSizeConstant: number = 2;

const createGrid = (size: number): { id: string; hasShip: boolean }[][] => {
  const alpha: string[] = ["A", "B", "C"];
  grid = [];
  for (let i: number = 0; i < size; i++) {
    grid.push([]);
    for (let j = 0; j < size; j++) {
      grid[i].push({ id: alpha[i] + (j + 1), hasShip: false });
    }
  }
  return grid;
};

const getRandomNum = (max: number): number => Math.floor(Math.random() * max);

const createShipsFunction = (
  numberOfShips: number,
  gridSize: number
): { id: string; hasShip: boolean }[][] => {
  const alpha: string[] = ["A", "B", "C"];
  let col: number;
  let row: number;
  for (let i = 0; i < numberOfShips; i++) {
    col = getRandomNum(gridSize);
    row = getRandomNum(gridSize);
    // Check if the selected cell already has a ship
    if (grid[row][col].hasShip) {
      i--; // Retry for a unique position
    } else {
      grid[row][col].hasShip = true;
    }
  }
  return grid;
};

const checkIfShipIsHit = (guessed: string): void => {
  const row = guessed.charCodeAt(0) - "A".charCodeAt(0);
  const col = parseInt(guessed.substring(1)) - 1;

  if (grid[row][col].hasShip) {
    console.log("You have hit a ship");
    fleetSizeVariable--;
    console.log(`you have this many ships left to hit: ${fleetSizeVariable}`);
    grid[row][col].hasShip = false; // Mark the ship as hit
  } else {
    console.log("You have missed");
  }
};

const askToPlayAgain = (): void => {
  if (rs.keyInYN("Do you want to play again? ")) {
    newGameLogic();
  } else {
    console.log(`Thanks for playing`);
  }
};

const getUserInput = (): string => {
  let guessed = rs.question("Enter a location to strike ");
  guessed = guessed.toUpperCase(); // Convert the input to uppercase

  if (guessArr.includes(guessed)) {
    console.log("already shot there");
    return getUserInput();
  }
  guessArr.push(guessed);
  return guessed;
};

const gameLoop = (): void => {
  fleetSizeVariable = fleetSizeConstant;
  guessArr = [];
  createGrid(gridSize); // Reset the grid here before starting a new game
  createShipsFunction(fleetSizeVariable, gridSize);
};

const newGameLogic = (): void => {
  console.log("Press any key to start the game.");
  rs.keyInPause();
  gameLoop();
  while (fleetSizeVariable > 0) {
    const guessed = getUserInput();
    checkIfShipIsHit(guessed);
  }
  askToPlayAgain();
};

newGameLogic();
