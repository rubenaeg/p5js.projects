import p5, { Vector } from 'p5';

export interface Pill {
  x: number;
  y: number;
  color: Vector;
}

export class Canvas extends p5 {
  canvasWidth: number = 500;
  canvasHeight: number = 500;
  keyColors: Vector[] = [];
  pillQuantity: number = 300;
  pillWidth: number = 20;
  pillHeight: number = 30;
  rowWidth: number = Math.round(this.canvasWidth / this.pillWidth / 2);
  pills: Pill[] = [];

  constructor(element?: HTMLElement) {
    super(() => {}, element);

    // Generate key colors
    for (let i = 0; i < 2; i++) {
      const keyColor = this.getKeyColor();
      this.keyColors.push(keyColor);
    }
  }

  setup() {
    this.createCanvas(this.canvasWidth, this.canvasHeight);
    this.colorMode(this.HSB, 1);

    let y: number = -1;
    for (let i = 0; i < this.pillQuantity; i++) {
      // Only allow a specific number of pills in one row
      const x: number = i % this.rowWidth;
      // Increment y whenever a new row begins
      y = x === 0 ? y + 1 : y;
      let mappedX: number = this.map(x, 0, this.rowWidth, 0, this.canvasWidth) + this.pillWidth;
      let mappedY: number =
        this.map(y, 0, this.pillQuantity / this.rowWidth, -50, this.canvasWidth) + this.pillHeight;

      // Create a pseudo-random offset
      const offset: number = 20;
      const createPseudoOffset = (i: number): number => {
        return i % 2 === 0 ? i : i + -offset + Math.random() * offset;
      };
      mappedX = createPseudoOffset(mappedX);
      mappedY = createPseudoOffset(mappedY);

      this.pills.push({
        x: mappedX,
        y: mappedY,
        color: this.getSampleColor(),
      });
    }
  }

  draw() {
    this.background(255);
    for (const pill of this.pills) {
      this.drawPill(
        pill.x,
        pill.y,
        this.pillWidth,
        // Vary height each frame
        this.pillHeight + 10 * (0.4 + this.sin(pill.x * pill.y + this.frameCount * 0.1) * 0.6),
        0.7,
        pill.color,
      );
    }
    this.applyGrain();
  }

  /**
   * Creates a new vertex shape in form of a pill
   */
  drawPill(
    posX: number,
    posY: number,
    width: number,
    height: number,
    cornerRadius: number,
    color: Vector,
  ): void {
    // Set stroke color to black
    this.stroke(0);
    this.strokeWeight(3);
    this.fill(color.x, color.y, color.z);

    this.beginShape();

    for (let i = 0; i < this.TWO_PI; i += this.TWO_PI / 150) {
      const x: number =
        Math.pow(Math.abs(Math.sin(i)), cornerRadius) * width * Math.sign(Math.sin(i)) + posX;
      const y: number =
        Math.pow(Math.abs(Math.cos(i)), cornerRadius) * height * Math.sign(Math.cos(i)) + posY;

      this.vertex(x, y);
    }

    this.endShape();
  }

  /**
   * Generates and applies a simple grain filter using Perlin noise
   */
  applyGrain(): void {
    this.loadPixels();
    for (let x = 0; x < this.canvasWidth; x++) {
      for (let y = 0; y < this.canvasWidth; y++) {
        const index: number = 4 * (y * this.canvasWidth + x);
        const noise = this.map(this.noise(index), 0, 1, 0, 255);
        const noiseStrength: number = 0.3;
        const r: number = this.pixels[index];
        const g: number = this.pixels[index + 1];
        const b: number = this.pixels[index + 2];
        this.pixels[index] = r - noise * noiseStrength;
        this.pixels[index + 1] = g - noise * noiseStrength;
        this.pixels[index + 2] = b - noise * noiseStrength;
      }
    }
    this.updatePixels();
  }

  /**
   * Returns a random HSB color value
   */
  getKeyColor(): Vector {
    return new Vector(Math.random(), 0.3 + Math.random() * 0.7, 1);
  }

  /**
   * Returns a random color within the color range defined by this.keyColors
   */
  getSampleColor(): Vector {
    const color: Vector = this.keyColors.reduce(
      (acc: Vector, curr: Vector) => Vector.lerp(acc, curr, Math.random()),
      this.keyColors[0],
    );
    return color;
  }
}
