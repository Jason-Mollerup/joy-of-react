import React, { useEffect, useState } from "react";
import { NUM_OF_GUESSES_ALLOWED } from "../../constants";
import { checkGuess } from "../../game-helpers";

import { sample } from "../../utils";
import { WORDS } from "../../data";

const EMPTY_GUESS = "     ";

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

function Game() {
  const [gameStatus, setGameStatus] = useState("playing");
  const [guesses, setGuesses] = useState([]);
  const [guess, setGuess] = useState("");

  const guessesToMap = new Array(NUM_OF_GUESSES_ALLOWED)
    .fill(EMPTY_GUESS)
    .map((empty, index) => {
      console.log(!!guesses[index]);
      return !!guesses[index] ? guesses[index] : empty;
    });

  const checkWin = () => {
    return guesses.some((guess) => {
      return checkGuess(guess, answer).every(
        ({ status }) => status === "correct"
      );
    });
  };

  useEffect(() => {
    setGameStatus(
      checkWin()
        ? "won"
        : guesses.length === NUM_OF_GUESSES_ALLOWED
        ? "lost"
        : "playing"
    );
  }, [guesses]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (guess.length !== 5) {
      window.alert("Guess must be 5 characters");
    } else {
      setGuesses([...guesses, guess]);
      setGuess("");
    }
  };

  return (
    <>
      <div className="guess-results">
        {guessesToMap.map((guess, guessIndex) => {
          const checkedGuess = checkGuess(guess, answer);
          return (
            <p key={`guess-${guessIndex}`} className="guess">
              {checkedGuess.map(({ letter, status }, letterIndex) => (
                <span
                  key={`guess${guessIndex}-letter${letterIndex}`}
                  className={`cell ${status}`}
                >
                  {letter}
                </span>
              ))}
            </p>
          );
        })}
      </div>
      <form className="guess-input-wrapper" onSubmit={handleSubmit}>
        <label htmlFor="guess-input">Enter guess:</label>
        <input
          id="guess-input"
          type="text"
          value={guess}
          onChange={(event) => setGuess(event.target.value.toUpperCase())}
          maxLength={5}
          disabled={gameStatus !== "playing"}
        />
      </form>
      {gameStatus === "won" && (
        <div className="happy banner">
          <p>
            <strong>Congratulations!</strong> Got it in{" "}
            <strong>{guesses.length} guesses</strong>.
          </p>
        </div>
      )}
      {gameStatus === "lost" && (
        <div className="sad banner">
          <p>
            Sorry, the correct answer is <strong>{answer}</strong>.
          </p>
        </div>
      )}
    </>
  );
}

export default Game;
