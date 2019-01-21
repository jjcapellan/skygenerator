var skyConfig = {
  backgroundColor: 0x000023,
  globalOpacity: 0.5,
  initialPointsQty: 50,
  generatedPointsQty: 140,
  margin: 0,
  cloudRadius: 100,
  starHaloRadius: 8,
  starRadius: 3,
  starAlpha: 0.9,
  haloAlpha: 0.02,
  cloud1Color: 0x65ddf7,
  cloud2Color: 0x830e81,
  scaleStar2: 0.8,
  scaleStar3: 0.4
};

class GenerateSky extends Phaser.Scene {
  constructor() {
    super('generateSky');
  }

  create() {
    this.add.existing(
      new SkyGenerator(this, 800, 600, skyConfig)
    );

    this.add.text(600,500,'Click to refresh');

    this.input.once('pointerup', this.refresh, this);
  }

  refresh() {
    console.log('refresh');
    this.scene.restart();
  }
}

var gui = new dat.GUI({ with: 400 });
gui.addColor(skyConfig, 'backgroundColor');
gui.add(skyConfig, 'globalOpacity', 0, 1, 0.05);
gui.add(skyConfig, 'initialPointsQty', 4, 200, 10);
gui.add(skyConfig, 'generatedPointsQty', 10, 1000, 10);
gui.add(skyConfig, 'margin', 0, 50, 5);
gui.add(skyConfig, 'cloudRadius', 10, 1000, 10);
gui.add(skyConfig, 'starHaloRadius', 2, 800, 2);
gui.add(skyConfig, 'starRadius', 2, 500, 1);
gui.add(skyConfig, 'starAlpha', 0, 1, 0.01);
gui.add(skyConfig, 'haloAlpha', 0, 1, 0.01);
gui.addColor(skyConfig, 'cloud1Color');
gui.addColor(skyConfig, 'cloud2Color');
gui.add(skyConfig, 'scaleStar2', 0, 1, 0.1);
gui.add(skyConfig, 'scaleStar3', 0, 1, 0.1);

var gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  pixelArt: false,
  backgroundColor: 0x000000,
  scene: GenerateSky
};

var game = new Phaser.Game(gameConfig);

window.onload = function() {
  resize();
  window.addEventListener('resize', resize);
};

function resize() {
  let gameRatio = 600 / 800;
  let windowRatio = window.innerHeight / window.innerWidth;
  let canvas = document.getElementsByTagName('canvas')[0];

  if (gameRatio > windowRatio) {
    canvas.style.height = window.innerHeight + 'px';
    canvas.style.width = window.innerHeight / gameRatio + 'px';
  } else {
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerWidth * gameRatio + 'px';
  }
}
