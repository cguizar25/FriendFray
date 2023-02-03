class Collision {
  static width = 64
  static height = 64
  constructor({ position }) {
    this.position = position
    this.width = 64
    this.height = 64
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0.5)';
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
};

class Character {
  constructor({ position, velocity, image, movements = { max: 1 }, frames }) {
    this.position = position
    this.image = image
    this.movements = { ...movements, val: 0, elapsed: 0 }
    this.frames = frames

    this.image.onload = () => {
      this.width = this.image.width / this.movements.max;
      this.height = this.image.height;
    }
    this.inMotion = false
  }

  draw() {
    c.drawImage(
      this.image,
      this.movements.val * this.width,
      0,
      this.image.width / this.movements.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.movements.max,
      this.image.height
    )

    if (!this.inMotion) return

    if (this.movements.max > 1) this.movements.elapsed++;

    if (this.movements.elapsed % 10 === 0) {
      if (this.movements.val < this.movements.max - 1) this.movements.val++
      else this.movements.val = 0
    }

  }
};
