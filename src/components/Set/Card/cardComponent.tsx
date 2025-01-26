import { Component, ReactNode } from "react";
import CardClass from "./cardClass";
interface CardComponentProps {
  card: CardClass;
  click: () => void;
}

class CardComponent extends Component<CardComponentProps> {
  innerComponents: ReactNode[];
  constructor(props: CardComponentProps) {
    super(props);
    this.innerComponents = [];
    this.fillComponents();
  }
  fillComponents = () => {
    const { card } = this.props;
    for (let i = 0; i < card.number!; i++) {
      this.innerComponents.push(
        <div
          key={i}
          className={card.shape + " m-2"}
          style={{
            border: `5px solid ${card.color}`,
            backgroundImage: `repeating-linear-gradient(${
              card.shape === "rohmbus" ? 45 : 90
            }deg,${card.firstColor}, ${card.firstColor} 2px, ${
              card.secondColor
            } 2px, ${card.secondColor} 4px`,
          }}
        ></div>
      );
    }
  };
  state = {};
  render() {
    const { card, click } = this.props;
    return (
      <div
        className={`rounded setCard p-3 m-2 bg-black ${
          !card.isClicked && !card.isHinted && "bg-opacity-75"
        }`}
        style={{ border: `5px solid ${card.color}` }}
        onClick={click}
      >
        {this.innerComponents}
      </div>
    );
  }
}

export default CardComponent;
