import Die from "./components/Die";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(generateDice());
  const [tenzies, setTenzies] = useState(false);

  useEffect(() => {
    const firstDieValue = dice[0].value;

    let allHeld = dice.every((die) => die.isHeld);
    let allSame = dice.every((die) => die.value === firstDieValue);

    if (allSame && allHeld) {
      setTenzies(true);
      console.log("You won");
    }
  }, [dice]);

  function generateRandomNumber(upperLimit) {
    return Math.ceil(Math.random() * upperLimit);
  }

  function generateNewDie() {
    return {
      id: nanoid(),
      value: generateRandomNumber(6),
      isHeld: false,
    };
  }

  function generateDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (tenzies) {
      setDice(generateDice());
      setTenzies(false);
    } else {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    }
  }

  function holdDie(dieId) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === dieId ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceToShow = dice.map((die, index) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDie(die.id)}
    />
  ));

  return (
    <main onClick={generateDice}>
      <div className="description">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      </div>

      <div className="die-container">{diceToShow}</div>
      <button className="roll-button" onClick={rollDice}>
        {tenzies ? "New game" : "Roll!"}
      </button>
      {tenzies && <Confetti />}
    </main>
  );
}
