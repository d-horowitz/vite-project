class CardClass {
  id: number;
  number?: number;
  color?: string;
  shape?: string;
  style?: string;
  firstColor?: string;
  secondColor?: string;
  isClicked = false;
  isHinted = false;
  constructor(
    _id: number,
    _number?: number,
    _color?: string,
    _shape?: string,
    _style?: string
  ) {
    this.id = _id;
    this.number = _number;
    this.color = _color;
    this.shape = _shape;
    this.style = _style;
    this.firstColor = _style === "empty" ? "white" : _color;
    this.secondColor = _style === "full" ? _color : "white";
  }
}

export default CardClass;
