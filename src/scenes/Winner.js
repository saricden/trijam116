import {Scene} from 'phaser';

class Winner extends Scene {
  constructor() {
    super("winnerwinner");
  }

  create() {
    const title = this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Deez nuts (u win)', {
      fontSize: 40,
      fontFamily: 'sans-serif'
    });

    title.setOrigin(0.5);

    this.input.on('pointerdown', () => {
      this.scene.start("scene-game");
    });
  }
}

export default Winner;