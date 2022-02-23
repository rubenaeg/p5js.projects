import p5, { Color, Vector } from 'p5';

export class Canvas extends p5 {
  aspectRatio: number = 5 / 7;
  canvasHeight: number = 1920;
  canvasWidth: number = this.canvasHeight * this.aspectRatio;
  inputField: p5.Element;

  constructor(element?: HTMLElement, public count?: number) {
    super(() => {}, element);
  }

  setup() {
    this.createCanvas(this.canvasWidth, this.canvasHeight);
    this.background(0);
    const rows: number = 5;
    const columns: number = 3;

    for (let i = 0; i < rows * columns; i++) {
      const posX: number =
        200 + (this.canvasWidth / columns) * (i % columns) + this.noise(i) * 50;
      const posY: number = 100 + Math.floor(i / columns) * 500 + this.noise(i) * 100;
      this.stroke('#FCEDF2');
      this.strokeWeight(4);
      this.fill(0, 0, 0, 0);

      // Draw pupil
      this.push();
      const pupil: Vector = new Vector(
        (10 + this.noise(i) * 2) * (Math.random() > 0.5 ? -1 : 1) + posX,
        (10 + this.noise(i) * 2) * (Math.random() > 0.5 ? -1 : 1) + posY,
      );
      this.circle(pupil.x, pupil.y, 40);
      this.pop();

      for (let j = 0; j < 4; j++) {
        this.drawLine(i, j, posX, posY);
      }
    }

    const save = this.createButton('Save');
    save.mousePressed(() => this.save());
    this.inputField = this.createInput();
  }

  drawLine(i: number, j: number, posX: number, posY: number): void {
    const isEyeLid: boolean = j < 2;
    this.beginShape();

    for (
      let x = -this.PI + (!isEyeLid ? Math.random() * 0.4 * (Math.random() > 0.5 ? -1 : 1) : 0);
      x < (!isEyeLid ? -1 * (0.1 + Math.random() * 0.4) : 0);
      x += this.PI / 100
    ) {
      const y: number =
        (0.1 + this.noise(this.noise(x * j + i))) *
        (!isEyeLid ? 0.4 : 0.8) *
        Math.sin(x) *
        (j % 2 === 0 ? 1 : -1) *
        35;

      const mappedX: number = this.map(x, -this.PI, 0, -this.PI, this.PI) * 40 + posX;
      const offset: number = 5 + this.noise(j) * 20;
      const mappedY: number = (y + (j === 2 ? -offset  : j === 3 ? offset : 0)) * 5 + posY;
      this.vertex(mappedX, mappedY);
    }

    this.endShape();
  }

  draw() {}
}
