var skyConfig = {
  backgroundColor: 0x000023,
  gridUnitSize: 82,
  maxStarsCluster: 46,
  minStarsCluster: 19,
  starHightPassFilter:0.3,
  cloudRadius: 200,
  cloudGradient: 1,
  cloud1Opacity: 0.525,
  cloud2Opacity: 0.865,
  starRadius: 48,
  starsDispersion: 1,
  cloudStarScale: 0.2,
  cloudStarAlpha:0.5,
  starHardness: 0.03,
  starGradient: 0.54,
  starAlpha: 0.9,
  cloud1Color: 0x65ddf7,
  cloud2Color: 0x830e81,
  scaleStar2: 0.6,
  scaleStar3: 0.3
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
    this.scene.restart();
  }
}

var gui = new dat.GUI({ with: 400 });
gui.addColor(skyConfig, 'backgroundColor');
gui.add(skyConfig, 'gridUnitSize', 10, 200, 2);
var f1 = gui.addFolder('Clouds layers');
f1.add(skyConfig, 'cloud1Opacity',0,1,0.005);
f1.add(skyConfig, 'cloud2Opacity',0,1,0.005);
f1.add(skyConfig, 'cloudRadius', 10, 1000, 10);
f1.add(skyConfig, 'cloudGradient', 0, 1, 0.01);
f1.add(skyConfig, 'cloudStarAlpha',0,1,0.005);
f1.add(skyConfig, 'cloudStarScale',0.01,1,0.005);
f1.addColor(skyConfig, 'cloud1Color');
f1.addColor(skyConfig, 'cloud2Color');
f1.open();
var f2 = gui.addFolder('Stars layer');
f2.add(skyConfig, 'maxStarsCluster',0,400,1);
f2.add(skyConfig, 'minStarsCluster',0,400,1);
f2.add(skyConfig,'starHightPassFilter',0.1,0.95,0.05);
f2.add(skyConfig, 'starRadius', 2, 500, 1);
f2.add(skyConfig, 'starsDispersion',1,50,0.01);
f2.add(skyConfig, 'starHardness', 0, 1, 0.01);
f2.add(skyConfig, 'starGradient', 0, 1, 0.01);
f2.add(skyConfig, 'starAlpha', 0, 1, 0.01);
f2.add(skyConfig, 'scaleStar2', 0, 1, 0.1);
f2.add(skyConfig, 'scaleStar3', 0, 1, 0.1);
f2.open();

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
