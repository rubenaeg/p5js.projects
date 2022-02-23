import p5 from 'p5';

export class Canvas extends p5 {
  canvasHeight: number = 1920;
  canvasWidth: number = 1080;
  colours: string[][] = [
    ['448a9a', 'e1b10f', 'e0cdd0', 'fb9ab6'],
    ['688052', 'c4e2e2', 'fa9584', 'f9ae54'],
    ['352921', '344126', 'bb6c5d', 'f3b87b'],
    ['56432d', '65b0bb', 'e1aa46', 'e1dac7'],
    ['38150f', '53838b', '859ca2', 'd3cdc6'],
    ['2e465e', '9e3532', '59a8a3', 'eaded0'],
    ['60534c', 'a7ada6', 'fadb6a', 'a0cbd8'],
  ];

  constructor(element?: HTMLElement, public count?: number) {
    super(() => {}, element);
  }

  setup() {
    this.createCanvas(this.canvasWidth, this.canvasHeight);
    this.background(255);
    this.rotate(-1);

    const colourScheme = this.colours[Math.round(Math.random() * (this.colours.length - 1))];
    const waves: number = colourScheme.length * 20;
    for (let i = 0; i < colourScheme.length; i++) {
      for (let x = i; x < waves; x += colourScheme.length) {
        const colour: string = `#${
          colourScheme[Math.round(Math.abs(Math.sin(i)) * 4) % colourScheme.length]
        }`;
        this.drawWave(x, colour);
      }
    }

    const save = this.createButton('Save');
    save.mousePressed(() => this.save());
  }

  draw() {}

  drawWave(pos: number, colour: string) {
    let amplitude: number = 0.1;
    const frequency: number = 200;
    this.beginShape();
    this.stroke(colour);
    this.fill(0, 0, 0, 0);
    this.strokeWeight(10 + Math.abs(Math.sin(pos)) * 30);
    for (let i = 0; i < this.canvasHeight + 200; i += this.TWO_PI / 10) {
      const x: number =
        Math.pow(Math.abs(Math.sin(i * amplitude)), 0.9) *
          frequency *
          Math.sign(Math.sin(i * amplitude)) +
        pos * 30 + Math.sin(pos) * 40;
      this.vertex(x - 1800, Math.abs(Math.sin(i * .3)  * 900));
    }
    this.endShape();
  }
}
