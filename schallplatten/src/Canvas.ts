// @ts-nocheck
import p5, { Color, Font } from 'p5';

export type Colors = Record<string, Color>;

export class Canvas extends p5 {
  aspectRatio: number = 4 / 5;
  canvasHeight: number = 1080;
  canvasWidth: number = this.canvasHeight * this.aspectRatio;
  font: Font = this.loadFont('assets/fonts/Monoton/Monoton-Regular.ttf');
  colors: Colors = {
    // Thanks to https://www.schemecolor.com/vintage-newspaper.php
    paper: this.color('#f3dfc1'),
    red: this.color('#c7392b'),
    black: this.color('#1c1a1c'),
  };

  constructor(element?: HTMLElement) {
    super(() => {}, element);
  }

  setup() {
    this.createCanvas(this.canvasWidth, this.canvasHeight, 'svg');
    this.translate(this.width / 2, this.height / 2);

    this.background(this.colors.paper);

    const radiusMultiplier: number = 20;
    const radiusOffset: number = 8;
    const margin: number = 100;
    const x: number = this.canvasWidth / 2 - radiusMultiplier * radiusOffset - margin;
    const y: number = 50;

    for (let i = 1; i <= 50; i++) {
      this.drawSchallplatte(x, y, (i + radiusOffset) * radiusMultiplier);
    }

    this.push();
    // Schallplatten
    this.textFont(this.font);
    this.rotate(this.TWO_PI * 0.75);
    this.fill(this.colors.red);
    this.noStroke();
    const textSize: number = 130;
    this.textSize(textSize);
    this.textAlign(this.LEFT, this.BOTTOM);
    this.text(
      'schallplatten',
      (this.canvasHeight / 2) * -1 - 40,
      (this.canvasWidth / 2) * -1 + textSize + margin,
    );
    this.pop();

    // Set 0-coordinates to center of circles
    this.textFont('Arial');
    this.translate(x, y);
    this.fill(this.colors.red);
    this.stroke(this.colors.red);
    this.strokeWeight(1);
    this.textSize(16);
    this.textStyle(this.BOLD);
    this.textAlign(this.LEFT, this.CENTER);
    this.text(
      'Volkseigener Einzelhandelsbetrieb Dresden\n\nIndustriewaren'.toUpperCase(),
      -53,
      -98,
      0,
      200,
    );

    this.strokeWeight(4);
    this.fill(0, 0, 0, 0);
    const circleX: number = -80;
    const circleMargin: number = 40;
    for (let i = 0; i < 3; i++) {
      this.drawShape(circleX - 40, -circleMargin + i * circleMargin, 25, 25);
      this.circle(circleX, -circleMargin + i * circleMargin, 25);
    }

    const save = this.createButton('Save');
    save.mousePressed(() => {
      this.save();
    });
  }

  draw() {}

  drawShape(x: number, y: number, width: number, height: number) {
    this.push();

    this.beginShape();

    const x0: number = x - width / 2;
    const y0: number = y - height / 2;
    const x1: number = x + width / 2;
    const y1: number = y + height / 2;

    // Draw left line
    this.vertex(x0, y0);
    this.vertex(x0, y1);

    // Draw lower arc
    for (let i = 0; i < this.PI; i += this.PI / 200) {
      const arcX: number = x + (Math.cos(i + this.PI) * width) / 2;
      const arcY: number = y1 + Math.sin(-i) * height * 0.3;
      this.vertex(arcX, arcY);
    }

    // Draw right line
    this.vertex(x1, y1);
    this.vertex(x1, y0);

    // Draw upper arc
    for (let i = 0; i < this.PI; i += this.PI / 200) {
      const arcX: number = x + (Math.cos(i) * width) / 2;
      const arcY: number = y0 + Math.sin(i) * height * 0.3;
      this.vertex(arcX, arcY);
    }

    this.endShape();

    this.pop();
  }

  drawSchallplatte(x: number, y: number, radius: number) {
    const step: number = this.TWO_PI / 200;

    this.fill(0, 0, 0, 0);
    this.stroke(this.colors.black);
    const minStrokeWeight: number = 7;
    const offset: number = 0.1;
    const rotation: number = offset * this.noise(radius) * (Math.round(Math.random()) ? 1 : -1);
    for (let i = 0; i < this.TWO_PI; i += step) {
      this.beginShape();

      let strokeWeight: number = 1 + Math.abs(Math.sin(i + rotation)) * 30;
      if (strokeWeight <= minStrokeWeight) {
        strokeWeight = minStrokeWeight;
      }
      this.strokeWeight(strokeWeight);

      // Calculate offset to warp circle
      const x1: number = Math.sin(i) * radius + x;
      const y1: number = Math.cos(i) * radius + y;
      this.vertex(x1, y1);

      const x2: number = Math.sin(i + step) * radius + x;
      const y2: number = Math.cos(i + step) * radius + y;
      this.vertex(x2, y2);

      this.endShape();
    }
  }
}
