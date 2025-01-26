class CardClass {
  id: number;
  number?: number;
  color?: string;
  shape?: string;
  pattern?: string;
  firstColor?: string;
  secondColor?: string;
  isClicked = false;
  isHinted = false;
  constructor(
    _id: number,
    _number?: number,
    _color?: string,
    _shape?: string,
    pattern?: string
  ) {
    this.id = _id;
    this.number = _number;
    this.color = _color;
    this.shape = _shape;
    this.pattern = pattern;
    this.firstColor = pattern === "empty" ? "white" : _color;
    this.secondColor = pattern === "full" ? _color : "white";
  }
}

export default CardClass;
