var rs = require("readline-sync");
var gridSize = 10;
var ships = [
  { name: "Carrier", units: 5, CoordOfShip: [] },
  { name: "Battleship", units: 4, CoordOfShip: [] },
  { name: "Cruiser", units: 3, CoordOfShip: [] },
  { name: "Submarine", units: 3, CoordOfShip: [] },
  { name: "Destroyer", units: 2, CoordOfShip: [] },
];
var guessArr = [];
var fleetSizeVariable = 5;
var createGrid = function () {
  var alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  var grid = [];
  for (var i = 0; i < gridSize; i++) {
    grid.push([]);
    for (var j = 0; j < gridSize; j++) {
      grid[i].push(alpha[i] + (j + 1));
    }
  }
  return grid;
};
var getRandomNum = function () {
  return Math.floor(Math.random() * gridSize);
};
var coinFlip = function () {
  return Math.floor(Math.random() * 2);
};
var hasDuplicateCoord = function (coords) {
  for (var _i = 0, ships_1 = ships; _i < ships_1.length; _i++) {
    var ship = ships_1[_i];
    for (var _a = 0, coords_1 = coords; _a < coords_1.length; _a++) {
      var coord = coords_1[_a];
      if (ship.CoordOfShip.includes(coord)) {
        return true;
      }
    }
  }
  return false;
};
var hasOverlapWithOtherShips = function (coords) {
  for (var _i = 0, ships_2 = ships; _i < ships_2.length; _i++) {
    var ship = ships_2[_i];
    if (
      ship.CoordOfShip.some(function (coord) {
        return coords.includes(coord);
      })
    ) {
      return true;
    }
  }
  return false;
};
var placeShip = function (size) {
  var alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  var x, y, direction, firstCoord, coord;
  do {
    x = getRandomNum();
    y = getRandomNum();
    direction = coinFlip();
    firstCoord = alpha[x] + (y + 1);
    coord = [firstCoord];
    for (var i = 1; i < size; i++) {
      if (direction === 0) {
        if (y + 1 < gridSize) {
          y++;
        } else {
          coord = [];
          break;
        }
      } else {
        if (x + 1 < gridSize) {
          x++;
        } else {
          coord = [];
          break;
        }
      }
      var newCoord = alpha[x] + (y + 1);
      if (
        hasDuplicateCoord([newCoord]) ||
        hasOverlapWithOtherShips([newCoord])
      ) {
        coord = [];
        break;
      } else {
        coord.push(newCoord);
      }
    }
  } while (
    coord.length !== size ||
    hasDuplicateCoord(coord) ||
    hasOverlapWithOtherShips(coord)
  );
  return coord;
};
var createShips = function () {
  ships.forEach(function (ship) {
    var CoordOfShip = placeShip(ship.units);
    ship.CoordOfShip = CoordOfShip;
    console.log(
      "".concat(ship.name, " coordinates: ").concat(ship.CoordOfShip.join(", "))
    );
  });
  console.log("Fleet of Ships:");
  ships.forEach(function (ship) {
    console.log("".concat(ship.name, ": ").concat(ship.units));
  });
};
var resetShips = function () {
  ships.forEach(function (ship) {
    ship.CoordOfShip = [];
  });
  guessArr = []; // Reset the array of guessed coordinates
};
var checkIfShipIsHit = function (guessed) {
  for (var _i = 0, ships_3 = ships; _i < ships_3.length; _i++) {
    var ship = ships_3[_i];
    if (ship.CoordOfShip.includes(guessed)) {
      console.log("You have hit a ship");
      var index = ship.CoordOfShip.indexOf(guessed);
      ship.CoordOfShip.splice(index, 1); // Remove the hit coordinate
      if (ship.CoordOfShip.length === 0) {
        console.log("You have sunk the ".concat(ship.name, "!"));
        fleetSizeVariable--;
        console.log(
          "You have ".concat(fleetSizeVariable, " ships left to sink.")
        );
      } else {
        console.log("The ".concat(ship.name, " has been hit but not sunk."));
      }
      return;
    }
  }
  console.log("You have missed");
};
var getUserInput = function () {
  var guessed = rs.question("Enter a location to strike: ");
  while (!isValidLocation(guessed) || guessArr.includes(guessed)) {
    if (!isValidLocation(guessed)) {
      console.log("Invalid location. Please enter a valid location.");
    } else if (guessArr.includes(guessed)) {
      console.log("You already shot there");
    }
    guessed = rs.question("Enter a location to strike: ");
  }
  guessArr.push(guessed);
  return guessed;
};
var isValidLocation = function (location) {
  var alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  var row = location.charAt(0).toUpperCase();
  var col = parseInt(location.substring(1));
  return alpha.includes(row) && !isNaN(col) && col >= 1 && col <= 10;
};
var playGame = function () {
  resetShips();
  createShips();
  while (fleetSizeVariable > 0) {
    var guessed = getUserInput();
    checkIfShipIsHit(guessed);
  }
  console.log("Game Over");
  fleetSizeVariable = 5;
};
var newGameLogic = function () {
  console.log("Press any key to start the game.");
  rs.keyInPause();
  var playAgain = "yes";
  while (playAgain.toLowerCase() === "yes" || playAgain.toLowerCase() === "y") {
    playGame();
    playAgain = rs.question("Do you want to play again? (yes/no): ");
  }
  console.log("Goodbye! Thanks for playing!");
};
newGameLogic();
