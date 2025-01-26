import { useEffect, useRef, useState } from "react";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../set.css";
import CardClass from "../Card/cardClass";
import CardComponent from "../Card/cardComponent";

enum cardProperties {
  number = "number",
  color = "color",
  shape = "shape",
  pattern = "pattern",
}

const Board = () => {
  const counter = useRef(0);
  const unusedCards = useRef<CardClass[]>([]);
  const numbers = [1, 2, 3];
  const colors = ["red", "blueviolet", "chartreuse"];
  const shapes = ["ellipse", "wave", "rohmbus"];
  const patterns = ["full", "striped", "empty"];
  console.log("Board", counter);

  const features: cardProperties[] = [
    cardProperties.number,
    cardProperties.color,
    cardProperties.shape,
    cardProperties.pattern,
  ];

  const [numSetsFound, setNumSetsFound] = useState(0);
  const [boardCards, setBoardCards] = useState<CardClass[]>([]);

  useEffect(() => {
    console.log("useEffect");
    unusedCards.current = [];
    counter.current = 0;
    // Create set cards array
    console.log(unusedCards.current.length);

    for (let i = 0; i < 81; i++) {
      const number = numbers[i % 3];
      const color = colors[Math.floor(i / 3) % 3];
      const shape = shapes[Math.floor(i / 9) % 3];
      const pattern = patterns[Math.floor(i / 27) % 3];
      unusedCards.current.push(
        new CardClass(counter.current++, number, color, shape, pattern)
      );
    }

    // Shuffle set cards array
    for (let i = 0; i < unusedCards.current.length; i++) {
      const random = Math.floor(Math.random() * unusedCards.current.length);
      const temp = unusedCards.current[random];
      unusedCards.current[random] = unusedCards.current[i];
      unusedCards.current[i] = temp;
    }
    // Push 12 empty cards to the end of the set cards array
    for (let i = 0; i < 12; i++) {
      unusedCards.current.push(new CardClass(counter.current++));
    }
    const tempBoardCards = [];
    for (let i = 0; i < 12; i++) {
      tempBoardCards.push(unusedCards.current.shift()!);
    }
    setBoardCards(tempBoardCards);
  }, []);

  const isSet = (set: CardClass[]) => {
    for (let i = 0; i < features.length; i++) {
      if (!isFeatureGood(features[i], set)) {
        return {
          isValid: false,
          reason: `❌\nThere is a problem with the ${features[i]}.`,
        };
      }
    }
    return {
      isValid: true,
    };
  };
  const cardClicked = (card: CardClass) => {
    if (!card.number) {
      return;
    }
    if (card.isClicked) {
      console.log("cardClicked", card.id);
      card.isClicked = false;
      setBoardCards(boardCards.map((c) => (c.id === card.id ? card : c)));
      return;
    }

    console.log("card not Clicked", card.id);
    card.isClicked = true;
    setBoardCards(boardCards.map((c) => (c.id === card.id ? card : c)));
    const currentSet = boardCards.filter((c) => c.isClicked);
    console.log({ currentSet });

    if (currentSet.length === 3) {
      setTimeout(() => {
        const { isValid, reason } = isSet(currentSet);
        const tempBoardCards = [...boardCards];
        tempBoardCards.forEach((card) => {
          if (currentSet.find((c) => c.id == card.id)) {
            card.isClicked = false;
          }
        });
        if (isValid) {
          setFound(currentSet);
        } else {
          alert(reason);
        }
      }, 500);
    }
  };
  const setFound = (currentSet: CardClass[]) => {
    let tempBoardCards = [...boardCards];
    tempBoardCards = tempBoardCards.map((card) =>
      card.id === currentSet[0].id ||
      card.id === currentSet[1].id ||
      card.id === currentSet[2].id
        ? unusedCards.current.shift()!
        : card
    );
    setBoardCards(tempBoardCards);
    setNumSetsFound(numSetsFound + 1);
    console.log("set found");
  };
  const isFeatureGood = (feature: cardProperties, set: CardClass[]) => {
    if (
      !(
        set[0][feature] === set[1][feature] &&
        set[1][feature] === set[2][feature] &&
        set[0][feature] === set[2][feature]
      ) &&
      (set[0][feature] === set[1][feature] ||
        set[1][feature] === set[2][feature] ||
        set[0][feature] === set[2][feature])
    ) {
      return false;
    }
    return true;
  };
  const replaceCard = () => {
    if (unusedCards.current.length <= 12) {
      return;
    }
    if (boardCards.find((card) => card.isClicked)) {
      alert("Firstly, release the clicked card(s).");
      return;
    }
    const randomBoardCard = Math.floor(Math.random() * 12);
    const randomUnusedCard = Math.floor(
      Math.random() * (unusedCards.current.length - 12)
    );
    const tempBoardCards = [...boardCards];
    const newCard = unusedCards.current[randomUnusedCard];
    unusedCards.current[randomUnusedCard] = tempBoardCards[randomBoardCard];
    tempBoardCards[randomBoardCard] = newCard;
    setBoardCards(tempBoardCards);
    console.log(unusedCards);
  };
  const getSet = () => {
    const tempBoardCards = [...boardCards];
    for (let i = 0; i < tempBoardCards.length; i++) {
      if (!tempBoardCards[i].number) {
        // if card is empty
        continue;
      }
      for (let j = i + 1; j < tempBoardCards.length; j++) {
        if (!tempBoardCards[j].number) {
          // if card is empty
          continue;
        }
        for (let k = j + 1; k < tempBoardCards.length; k++) {
          if (!tempBoardCards[k].number) {
            // if card is empty
            continue;
          }
          const set = [tempBoardCards[i], tempBoardCards[j], tempBoardCards[k]];
          const { isValid } = isSet(set);
          if (isValid) {
            return [i, j, k];
          }
        }
      }
    }
    return null;
  };

  const getHint = () => {
    const tempBoardCards = [...boardCards];
    const set = getSet();
    if (!set) {
      alert("There is no set available on the board.");
      return;
    }
    const random = set[Math.floor(Math.random() * 3)];
    tempBoardCards[random].isHinted = true;
    setBoardCards(tempBoardCards);
    setTimeout(() => {
      tempBoardCards[random].isHinted = false;
      setBoardCards(tempBoardCards);
    }, 1000);
  };
  return (
    <div>
      <div
        className="position-fixed d-flex align-items-start"
        style={{ right: 0, zIndex: 1 }}
      >
        <div className="menu-container rounded-3 bg-white m-4">
          <button className="btn btn-warning dropdown-toggle">
            Menu&nbsp;
          </button>
          <button
            className="btn btn-outline-primary rounded-0 menu-item"
            onClick={replaceCard}
          >
            Replace card
          </button>
          <button
            className="btn btn-outline-info rounded-0 menu-item"
            onClick={getHint}
          >
            Get a hint
          </button>
          <button
            className="btn btn-outline-success rounded-0 rounded-bottom menu-item"
            onClick={() => {
              alert(getSet() ? "✔" : "❌");
            }}
          >
            Is there a set?
          </button>
        </div>
        <span className="badge bg-danger fs-4 m-4">{`Sets: ${numSetsFound}`}</span>
      </div>
      <div
        className="d-flex flex-wrap justify-content-center align-content-center"
        style={{ height: "100vh" }}
      >
        {boardCards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            click={() => cardClicked(card)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
