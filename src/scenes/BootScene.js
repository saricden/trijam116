import {Scene} from 'phaser';

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  
  preload() {
    // Load any assets here from your assets directory
    this.load.image('cat-like', 'assets/cat-like-creature.png');
    this.load.aseprite('thief', 'assets/thief.png', 'assets/thief.json');
    this.load.image('tiles', 'assets/tiles.png');
    this.load.image('diamond', 'assets/diamond.png');
    this.load.tilemapTiledJSON('level1', 'assets/level1.json');
    this.load.tilemapTiledJSON('level2', 'assets/level2.json');
    this.load.tilemapTiledJSON('level3', 'assets/level3.json');
    this.load.audio('loop1', 'assets/loop1.mp3');
    this.load.audio('loop2', 'assets/loop2.mp3');
    this.load.audio('loop3', 'assets/loop3.mp3');
  }

  create() {
    this.anims.createFromAseprite('thief');

    this.scene.start('scene-game');
  }
}

export default BootScene;