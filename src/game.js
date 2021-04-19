import './main.css';
import Phaser, {Game} from 'phaser';
import PhaserNavMeshPlugin from "phaser-navmesh";

import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import Level2 from './scenes/Level2';
import Level3 from './scenes/Level3';
import GameOver from './scenes/GameOver';
import Winner from './scenes/Winner';

const canvas = document.getElementById('game-canvas');
const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  canvas,
  plugins: {
    scene: [
      {
        key: "PhaserNavMeshPlugin", // Key to store the plugin class under in cache
        plugin: PhaserNavMeshPlugin, // Class that constructs plugins
        mapping: "navMeshPlugin", // Property mapping to use for the scene, e.g. this.navMeshPlugin
        start: true
      }
    ]
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: [
    BootScene,
    GameScene,
    GameOver,
    Winner,
    Level2,
    Level3
  ]
};

const game = new Game(config);