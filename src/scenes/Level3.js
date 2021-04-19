import {Scene, Geom, Curves, Math as pMath} from 'phaser';

class Level2 extends Scene {
  constructor() {
    super("level3");
  }

  create() {
    this.bgm = this.sound.add('loop3', {
      loop: true
    });
    this.bgm.play();

    this.lightspeed = 15;
    this.mcMoving = false;

    this.tilemap = this.add.tilemap("level3");
    const tileset = this.tilemap.addTilesetImage("tiles", "tiles");
    const floorLayer = this.tilemap.createLayer("floor", tileset);
    floorLayer.setDepth(1);
    const wallLayer = this.tilemap.createLayer("walls", tileset);
    wallLayer.setDepth(5);
    wallLayer.setCollisionByProperty({ collides: true });

    const navMesh = this.navMeshPlugin.buildMeshFromTilemap("mesh", this.tilemap, [wallLayer]);

    const mcSpawn = this.tilemap.getObjectLayer("spawn").objects[0];

    const diamondSpawn = this.tilemap.getObjectLayer("diamond_spawn").objects[0];

    this.path = null;

    this.diamond = this.add.image(diamondSpawn.x, diamondSpawn.y, "diamond");
    this.diamond.setDepth(3);

    this.mc = this.add.follower(this.path, mcSpawn.x, mcSpawn.y, 'thief');
    this.mc.setDepth(2);

    // Lights
    floorLayer.setPipeline('Light2D');
    wallLayer.setPipeline('Light2D');
    this.mc.setPipeline('Light2D');
    this.diamond.setPipeline('Light2D');

    this.lights.enable().setAmbientColor(0x555555);

    this.playerLight = this.lights.addLight(mcSpawn.x, mcSpawn.y, 200).setIntensity(0);

    this.light1 = this.lights.addLight(pMath.Between(0, this.tilemap.widthInPixels), pMath.Between(0, this.tilemap.heightInPixels), 500).setIntensity(3);
    this.light1.dirX = 1;
    this.light1.dirY = 1;

    this.light2 = this.lights.addLight(pMath.Between(0, this.tilemap.widthInPixels), pMath.Between(0, this.tilemap.heightInPixels), 500).setIntensity(3);
    this.light2.dirX = 1;

    this.light3 = this.lights.addLight(pMath.Between(0, this.tilemap.widthInPixels), pMath.Between(0, this.tilemap.heightInPixels), 500).setIntensity(3);
    this.light3.dirY = 1;

    this.light4 = this.lights.addLight(0, 0, 300).setIntensity(3);

    this.gfx = this.add.graphics();
    this.gfx.setDepth(10);
    this.gfx.lineStyle(4, 0xFF33CC, 1);

    this.input.on('pointerdown', (pointer) => {
      const {worldX, worldY} = pointer;

      const path = navMesh.findPath({ x: this.mc.x, y: this.mc.y }, { x: worldX, y: worldY });

      let pointsArray = [];

      if (path !== null) {
        this.mc.play({ key: 'Thief-Run', repeat: -1 });
        this.mcMoving = true;

        path.forEach((point) => {
          pointsArray = [
            ...pointsArray,
            point.x,
            point.y
          ];
        });

        this.path = new Curves.Path(this.mc.x, this.mc.y).splineTo(pointsArray);

        this.path.draw(this.gfx, 128);

        this.mc.setPath(this.path);

        this.mc.startFollow({
          positionOnPath: true,
          duration: 3000,
          yoyo: false,
          repeat: 0,
          rotateToPath: true,
          verticalAdjust: true,
          onComplete: () => {
            this.mc.play({ key: 'Thief-Idle', repeat: 0 });
            this.mcMoving = false;
          }
        });

        this.mc.pathRotationOffset = 90;
      }

    });

    this.cameras.main.startFollow(this.mc);
    this.cameras.main.setZoom(0.5);
  }

  update() {
    // Bouncey light
    if (this.light1.x >= this.tilemap.widthInPixels) {
      this.light1.dirX = -1;
    }
    else if (this.light1.x <= 0) {
      this.light1.dirX = 1;
    }

    if (this.light1.y >= this.tilemap.heightInPixels) {
      this.light1.dirY = -1;
    }
    else if (this.light1.y <= 0) {
      this.light1.dirY = 1;
    }

    // Line up with thief Y value
    if (this.light2.x >= this.tilemap.widthInPixels) {
      this.light2.dirX = -1;
      this.light2.y = this.mc.y;
    }
    else if (this.light2.x <= 0) {
      this.light2.dirX = 1;
      this.light2.y = this.mc.y;
    }

    // Line up with thief X value
    if (this.light3.y >= this.tilemap.heightInPixels) {
      this.light3.dirY = -1;
      this.light3.x = this.mc.x;
    }
    else if (this.light3.x <= 0) {
      this.light3.dirY = 1;
      this.light3.x = this.mc.x;
    }

    // Light "collision"
    const light1Circle = new Geom.Circle(this.light1.x, this.light1.y, 300);
    const light2Circle = new Geom.Circle(this.light2.x, this.light2.y, 300);
    const light3Circle = new Geom.Circle(this.light3.x, this.light3.y, 300);
    const mcCircle = new Geom.Circle(this.mc.x, this.mc.y, 50);
    const diamondCircle = new Geom.Circle(this.diamond.x, this.diamond.y, 50);
    
    if (
      Geom.Intersects.CircleToCircle(light1Circle, mcCircle) ||
      Geom.Intersects.CircleToCircle(light2Circle, mcCircle) ||
      Geom.Intersects.CircleToCircle(light3Circle, mcCircle)
    ) {
      if (this.mcMoving) {
        this.scene.start("game-over");
        this.bgm.stop();
      }
    }

    if (Geom.Intersects.CircleToCircle(diamondCircle, mcCircle)) {
      this.scene.start("winnerwinner");
      this.bgm.stop();
    }

    this.light1.x += this.lightspeed * this.light1.dirX;
    this.light1.y += this.lightspeed * this.light1.dirY;

    this.light2.x += this.lightspeed * this.light2.dirX;

    this.light3.y += this.lightspeed * this.light3.dirY;

    this.playerLight.x = this.mc.x;
    this.playerLight.y = this.mc.y;
  }

}
export default Level2;