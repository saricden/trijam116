import {Scene} from 'phaser';

class GameOver extends Scene {
  constructor() {
    super("game-over");
  }

  create() {
    const title = this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'STOP THERE, DON\'T MOVE!', {
      fontSize: 40,
      fontFamily: 'sans-serif'
    });

    title.setOrigin(0.5);

    this.input.on('pointerdown', () => {
      this.scene.start("scene-game");
    });
  }
}

export default GameOver;