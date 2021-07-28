import {Component, OnInit} from '@angular/core';
import {Square} from '../square/square';
import {ScoreService} from '../score.service';
import {ScoreSheet} from '../scoresheet/scoreSheet';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  squares: Square[];
  playerTurn: boolean;
  winner: string;
  isDraw: boolean;
  playerXwins: number;
  playerOwins: number;
  disable = false;
  possibleWins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Injecting ScoreService
  constructor(private scoreService: ScoreService) {
  }

  ngOnInit() {
    this.newGame();
    this.playerXwins = 0;
    this.playerOwins = 0;
  }

  // Initialises a new game
  newGame() {
    // Resetting Game
    this.squares = Array(9).fill(null);
    this.playerTurn = true;
    this.winner = null;
    this.isDraw = false;
    this.disable = false;
  }

  // Gets the current player's marker
  get playerMarker() {
    return this.playerTurn ? 'X' : 'O';
  }

  // Checks if the user can make the attempted move
  makeMove(index: number) {
    // Checks whether square is empty
    if (this.squares[index] === null) {
      // Replaces empty square with playerMarker
      this.squares.splice(index, 1, {player: this.playerMarker, win: false});
      // Switches turn
      this.playerTurn = !this.playerTurn;
    }
    // Check for Winner
    this.winner = this.isWinner();
    if (this.winner === 'X') {
      this.playerXwins += 1;
    } else if (this.winner === 'O') {
      this.playerOwins += 1;
    }
    // Check for Tie
    this.isDraw = this.checkTie();
    this.scoreService.publish(
      new ScoreSheet(this.playerXwins, this.playerOwins)
    );
  }

  // Returns playerMarker at specified square
  valueAtSquare(square: Square): string {
    return square && square.player;
  }

  // Checks if there is a winner
  isWinner(): string {
    // Iterates through all possible win combinations
    for (const winCondition of this.possibleWins) {
      // Selecting the three index combination
      const [a, b, c] = winCondition;
      // Checks if all three squares have same playerMarker/ player has won
      if (
        this.squares[a] &&
        this.squares[a].player === this.valueAtSquare(this.squares[b]) &&
        this.squares[a].player === this.valueAtSquare(this.squares[c])
      ) {
        this.disable = true;
        this.squares[a] = {...this.squares[a], win: true};
        this.squares[b] = {...this.squares[b], win: true};
        this.squares[c] = {...this.squares[c], win: true};
        return this.squares[a].player;
      }
    }
    // Condition if no players won
    return null;
  }

  // Checks if there is a draw/ tie
  checkTie() {
    // Checks whether all squares are filled
    if (
      this.winner === null &&
      this.squares.every(square => {
        return (
          this.valueAtSquare(square) === 'X' ||
          this.valueAtSquare(square) === 'O'
        );
      })
    ) {
      return true;
    }
  }
}
