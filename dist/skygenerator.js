/**
 * SkyGenerator is a custom image class to create a procedural sky background using the framework Phaser 3.
 * @author       Juan Jose Capellan <soycape@hotmail.com>
 * @license      {@link https://github.com/jjcapellan/skygenerator/blob/master/LICENSE | MIT license}
 * @version      1.0.0
 */



/**
 * 
 * @class SkyGenerator
 * @extends Phaser.GameObjects.Image
 */
class SkyGenerator extends Phaser.GameObjects.Image {
  /**
     * Creates an instance of SkyGenerator.
     * @param  {Phaser.Scene} scene 
     * @param  {number} width 
     * @param  {number} height 
     * @param  {object} [options] 
     * @param  {number} [options.backgroundColor = 0x000023]
     * @param  {number} [options.globalOpacity = 0.5] Number between 0 and 1.
     * @param  {number} [options.initialPointsQty = 50] Initial number of points.
     * @param  {number} [options.generatedPointsQty = 140] Number of points generated using the initial points.
     * @param  {number} [options.margin = 0] Margin in pixels for the generation zone.
     * @param  {number} [options.cloudRadius = 100] Radius of the generated clouds.
     * @param  {number} [options.starHaloRadius = 8] Radius of the stars halo. Must be grater than the radius of the star.
     * @param  {number} [options.starRadius = 3] Maximum radius of the stars.
     * @param  {number} [options.starAlpha = 0.9] Maximum opacity of the stars.
     * @param  {number} [options.haloAlpha = 0.02] Maximum opacity of the halos.
     * @param  {number[]} [options.starColors = [0xfcf9a7, 0xffffff, 0x9ef7fc]] Array of colors to apply to the stars.
     * @param  {number} [options.cloud1Color = 0x65ddf7] Color of the first layer of clouds.
     * @param  {number} [options.cloud2Color = 0x830e81] Color of the second layer of clouds.
     * @param  {number} [options.scaleStar2 = 0.8] Scale of the second star type.
     * @param  {number} [options.scaleStar3 = 0.4] Scale of third star type.
     * @memberof SkyGenerator
     */
  constructor(scene, width, height, options = {}) {
    super(scene, 0, 0);

    this.scene = scene;
    this.width = width;
    this.height = height;
    this.backgroundColor = options.backgroundColor || 0x000023;
    this.globalOpacity = options.globalOpacity || 0.5;
    this.initialPointsQty = options.initialPointsQty || 50;
    this.generatedPointsQty = options.generatedPointsQty || 140;
    this.margin = options.margin || 0;
    this.cloudRadius = options.cloudRadius || 100;
    this.starHaloRadius = options.starHaloRadius || 8;
    this.starRadius = options.starRadius || 3;
    this.starAlpha = options.starAlpha || 0.9;
    this.haloAlpha = options.haloAlpha || 0.02;
    this.starColors = options.starColors || [ 0xfcf9a7, 0xffffff, 0x9ef7fc ];
    this.cloud1Color = options.cloud1Color || 0x65ddf7;
    this.cloud2Color = options.cloud2Color || 0x830e81;
    this.scaleStar2 = options.scaleStar2 || 0.8;
    this.scaleStar3 = options.scaleStar3 || 0.4;

    if(this.starHaloRadius < this.starRadius){
      this.starHaloRadius = this.starRadius;
    }

    

    this.init();
  }

  init() {
    // Arrays where points are stored
    this.skyLayer1 = [];
    this.skyLayer2 = [];

    this.initMap();
    this.initRenderTextures();
    this.initCloudBrush();
    this.initStarBrush();
    this.generatePoints();
    this.scene.cameras.main.setBackgroundColor(this.backgroundColor);
    this.generateTexture();
    this.setTexture('rt_SkyGenerator');
    this.setOrigin(0);
  }

  // Generates firsts points.
  initMap() {
    let rectangle = new Phaser.Geom.Rectangle(
      this.margin,
      this.margin,
      this.width - this.margin,
      this.height - this.margin
    );
    for (let i = 0, j = this.initialPointsQty; i < j; i++) {
      let point = rectangle.getRandomPoint();
      let opacity = Math.random() * this.globalOpacity + 0.05;
      this.skyLayer1.push([ point.x, point.y, opacity ]);

      point = rectangle.getRandomPoint();
      opacity = Math.random() * this.globalOpacity + 0.05;
      this.skyLayer2.push([ point.x, point.y, opacity ]);
    }
  }

  initRenderTextures() {
    // Cloud rendertexture
    let textureWidth = this.cloudRadius * 2;
    this.cloudTexture = this.scene.make
      .renderTexture({ width: textureWidth, height: textureWidth }, false)
      .setVisible(false);

    // Stars rendertextures
    this.star1Texture = this.scene.make
      .renderTexture(
        { width: this.starHaloRadius * 2, height: this.starHaloRadius * 2 },
        false
      )
      .setVisible(false);      
    this.star2Texture = this.scene.make
      .renderTexture(
        {
          width: this.starHaloRadius * 2 * this.scaleStar2,
          height: this.starHaloRadius * 2 * this.scaleStar2
        },
        false
      )
      .setVisible(false);
    this.star3Texture = this.scene.make
      .renderTexture(
        {
          width: this.starHaloRadius * 2.2 * this.scaleStar3,
          height: this.starHaloRadius * 2.2 * this.scaleStar3
        },
        false
      )
      .setVisible(false);
  }

  // Makes a "cloud" based on overlayed semitransparent circles to get a gradient of transparency
  // and draws it on texture.
  initCloudBrush() {
    let brush = this.scene.add.graphics();
    let textureWidth = this.cloudRadius * 2;
    let cloudAlpha = this.globalOpacity / this.cloudRadius;
    if (cloudAlpha < 0.005) cloudAlpha = 0.005;
    brush.setVisible(false);
    for (let i = 2; i < this.cloudRadius + 1; i++) {
      brush.fillStyle(0xffffff, cloudAlpha);
      brush.fillCircle(0, 0, i);
    }

    this.cloudTexture.draw(brush, textureWidth / 2, textureWidth / 2);
  }

  // Makes three "stars" based on overlayed semitransparent circles to get a gradient of transparency.
  // and saves it on textures.
  // The option of scale one star gets a lot of square stars. (phaser v3.15)
  initStarBrush() {
    let brush = this.scene.add.graphics();
    brush.setVisible(false);

    // Star scale 1
    brush.fillStyle(0xffffff, this.haloAlpha);
    brush.fillCircle(0, 0, this.starHaloRadius);
    brush.fillStyle(0xffffff, this.starAlpha);
    brush.fillCircle(0, 0, this.starRadius);

    this.star1Texture.draw(brush, this.starHaloRadius, this.starHaloRadius);

    //Star scale scaleStar2
    let star2Radius = Math.round(this.starRadius*this.scaleStar2);
    brush.clear();
    brush.fillStyle(0xffffff, this.haloAlpha);
    brush.fillCircle(0, 0, this.starHaloRadius * this.scaleStar2);
    brush.fillStyle(0xffffff, this.starAlpha);
    brush.fillCircle(0, 0, star2Radius);

    this.star2Texture.draw(brush, this.star2Texture.width/2, this.star2Texture.width/2);

    //Star scale scaleStar3
    brush.clear();
    brush.fillStyle(0xffffff, this.haloAlpha);
    brush.fillCircle(0, 0, this.starHaloRadius * this.scaleStar3);
    brush.fillStyle(0xffffff, this.starAlpha);
    brush.fillCircle(0, 0, this.starRadius * this.scaleStar3);

    this.star3Texture.draw(brush, this.star3Texture.width/2, this.star3Texture.width/2);
  }

  // Parses skyLayer1 and skyLayer2 arrays and using that data draws the textures of clouds and stars in a new texture.
  generateTexture() {
    let rt = this.scene.make.renderTexture(
      { x: 0, y: 0, width: this.width, height: this.height },
      false
    );
    rt.setOrigin(0, 0);

    for (let i = 0, j = this.skyLayer1.length; i < j; i++) {
      let cloudScale = Math.random() * 0.4 + 0.6;

      // First layer
      this.cloudTexture
        .setPosition(this.skyLayer1[i][0], this.skyLayer1[i][1])
        .setTint(this.cloud1Color)
        .setAlpha(this.skyLayer1[i][2] / 3)
        .setScale(cloudScale, cloudScale)
        .setVisible(false);

      rt.draw(this.cloudTexture);

      // Second layer 
      this.cloudTexture
        .setPosition(this.skyLayer2[i][0], this.skyLayer2[i][1])
        .setTint(this.cloud2Color)
        .setAlpha(this.skyLayer2[i][2] / 3)
        .setScale(cloudScale, cloudScale)
        .setVisible(false);

      let starTexture = Phaser.Math.RND.pick([
        this.star1Texture,
        this.star2Texture,
        this.star3Texture
      ]);

      starTexture
        .setPosition(this.skyLayer2[i][0], this.skyLayer2[i][1])
        .setAlpha(this.skyLayer2[i][2]*(this.starAlpha/this.globalOpacity))
        .setTint(Phaser.Math.RND.pick(this.starColors));

      rt.draw([ this.cloudTexture, starTexture ]);
    }

    // Saves texture in cache
    rt.saveTexture('rt_SkyGenerator');
  }

  // Takes 3 random points and calcs the average for each iteration
  generatePoints() {
    for (let i = 0; i < this.generatedPointsQty; i++) {
      let point1 = Phaser.Math.RND.pick(this.skyLayer1);
      let point2 = Phaser.Math.RND.pick(this.skyLayer1);
      let point3 = Phaser.Math.RND.pick(this.skyLayer1);

      let x = Phaser.Math.Average([ point1[0], point2[0], point3[0] ]);
      let y = Phaser.Math.Average([ point1[1], point2[1], point3[0] ]);
      let opacity =
        Phaser.Math.Average([ point1[2], point2[2], point3[0] ]) +
        (Math.random() * 10 - 10) / 100;
      opacity = Phaser.Math.Clamp(opacity, 0.05, this.globalOpacity);

      this.skyLayer1.push([ x, y, opacity ]);

      point1 = Phaser.Math.RND.pick(this.skyLayer1);
      point2 = Phaser.Math.RND.pick(this.skyLayer1);
      point3 = Phaser.Math.RND.pick(this.skyLayer1);

      x = Phaser.Math.Average([ point1[0], point2[0], point3[0] ]);
      y = Phaser.Math.Average([ point1[1], point2[1], point3[0] ]);
      opacity =
        Phaser.Math.Average([ point1[2], point2[2], point3[0] ]) +
        (Math.random() * 10 - 10) / 100;
      opacity = Phaser.Math.Clamp(opacity, 0.05, this.globalOpacity);

      this.skyLayer2.push([ x, y, opacity ]);
    }
  }
}
