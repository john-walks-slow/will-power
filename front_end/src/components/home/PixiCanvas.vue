<template>
  <div id="divPixi" :style="style"></div>
</template>
<style scoped>
  #divPixi {
    background-color: #ffffff;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -250px;
    z-index: -100;
  }
</style>
<script>
  import Vue from 'vue';
  import * as PIXI from 'pixi.js';
  import 'assets/dragonBones.js';
  let Viewport = require('pixi-viewport');
  let TWEEN = require('@tweenjs/tween.js');

  import monstersMap from 'models/monsters.js';
  import knightsMap from 'models/knights.js';
  import scenesMap from 'models/scenes.js';

  import { ASSETS_KNIGHT, ASSETS_MONSTER, ASSETS_SCENE } from 'assets';

  const GROUND_HEIGHT = 800;
  const SCREEN_HEIGHT = screen.height;
  const SCREEN_WIDTH = screen.width;
  const WORLD_HEIGHT = 1400;
  const WORLD_WIDTH = 4000;

  const CAMERA_STATE_MENU = 0;
  const CAMERA_STATE_FULL = 1;
  const CAMERA_STATE_KNIGHT = 2;
  const CAMERA_STATE_MONSTER = 3;

  const MENU_WIDTH = 200;

  let app;
  let viewport;
  let loader;
  let resources;
  let spriteBackground;
  let spriteDirt;
  let spriteGrass;
  let displayKnight;
  let displayMonster;
  export let busPixi = new Vue();

  export default {
    props: {
      knight: String,
      monster: String,
      scene: String,
      camera: Number,
      equipmentAnim: String
    },
    data() {
      return {};
    },
    watch: {
      camera: setupCamera,
      knight: setupKnight,
      monster: setupMonster,
      scene: setupScene
    },
    computed: {
      style: function() {
        return {
          height: `${screen.height}px`,
          width: `${screen.width}px`,
          top: '50%',
          left: '50%',
          marginTop: `-${screen.height / 2}px`,
          marginLeft: `-${screen.width / 2}px`
        };
      }
    },
    mounted() {
      // Init the PIXI canvas
      app = new PIXI.Application({
        resolution: 1,
        antialias: true,
        forceFXAA: false,
        forceCanvas: false,
        autoResize: true,
        transparent: false,
        backgroundColor: 0x000000,
        clearBeforeRender: true,
        preserveDrawingBuffer: false,
        roundPixels: false
      });
      app.renderer.view.style.position = 'absolute';
      app.renderer.view.style.display = 'block';
      app.renderer.autoResize = true;
      app.renderer.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
      document.getElementById('divPixi').appendChild(app.view);

      // setup viewport
      viewport = new Viewport({
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
        worldWidth: WORLD_WIDTH,
        worldHeight: WORLD_HEIGHT,
        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
      });
      viewport.updateLayersOrder = function() {
        viewport.children.sort(function(a, b) {
          a.zIndex = a.zIndex || 0;
          b.zIndex = b.zIndex || 0;
          return a.zIndex - b.zIndex;
        });
      };

      viewport.onChildrenChange = () => {
        viewport.updateLayersOrder();
      };

      viewport
        .drag({ wheel: false })
        // .bounce({ sides: 'all', friction: 0.1, underflow: 'all' })
        .clampZoom({
          maxHeight: viewport.worldHeight,
          maxWidth: viewport.worldWidth,
          minHeight: 450
        })
        .clamp({ left: true, right: true, top: true, bottom: true })
        // .wheel({
        //   smooth: 30,
        //   percent: -0.95
        // })
        .pinch()
        .decelerate();
      let orgY;
      let orgX;
      let orgW;
      let zoomed;
      viewport.on('moved', t => {
        if (t != 'clamp') {
          // console.log('m ' + t);
          if (zoomed) {
            zoomed = false;
          } else {
            let deltaX = viewport.center.x - orgX;
            let deltaY = viewport.center.y - orgY;
            if (orgX && orgY) {
              spriteBackground.tilePosition.set(
                spriteBackground.tilePosition.x + deltaX * 0.4,
                spriteBackground.tilePosition.y + deltaY * 0.4
              );
            }
          }
        }
        orgX = viewport.center.x;
        orgY = viewport.center.y;
      });
      viewport.on('zoomed', t => {
        zoomed = true;
      });
      app.stage.addChild(viewport);

      // Prepare loading
      loader = PIXI.loader;
      loader.reset();
      resources = loader.resources;
      function addScene(name) {
        loader.add(`Background${name}`, ASSETS_SCENE[`Background${name}.png`]);
        loader.add(`Grass${name}`, ASSETS_SCENE[`Grass${name}.png`]);
        loader.add(`Dirt${name}`, ASSETS_SCENE['Dirt.png']);
      }
      function addKnight(name) {
        loader.add(`${name}Data`, ASSETS_KNIGHT[name + '_ske.json']);
        loader.add(`${name}Atlas`, ASSETS_KNIGHT[name + '_tex.json']);
        loader.add(`${name}Texture`, ASSETS_KNIGHT[name + '_tex.png']);
      }

      function addMonster(name) {
        loader.add(`${name}Data`, ASSETS_MONSTER[name + '_ske.json']);
        loader.add(`${name}Atlas`, ASSETS_MONSTER[name + '_tex.json']);
        loader.add(`${name}Texture`, ASSETS_MONSTER[name + '_tex.png']);
      }

      Object.keys(knightsMap).forEach(name => addKnight(name));
      Object.keys(monstersMap).forEach(name => addMonster(name));
      Object.keys(scenesMap).forEach(name => addScene(name));
      loader.onProgress.add(v => {
        this.$emit('loading', v.progress);
      });
      loader.load(() => {
        // Start drawing after loaded...
        setupScene(this.scene);
        setupKnight(this.knight);
        setupMonster(this.monster);
        viewport.moveCenter({
          x: (displayKnight.x + displayMonster.x) / 2,
          y: WORLD_HEIGHT - GROUND_HEIGHT - 150
        });
        viewport.follow(
          {
            x: (displayKnight.x + displayMonster.x) / 2,
            y: WORLD_HEIGHT - GROUND_HEIGHT - 150
          },
          { speed: 8, radius: 450, acceleration: 15 }
        );
        viewport.snapZoom({
          height: (WORLD_HEIGHT / 1.95 / window.innerHeight) * SCREEN_HEIGHT
        });
        setTimeout(() => {
          setupCamera(this.camera);
        }, 1500);

        app.ticker.add(swing);

        requestAnimationFrame(animate);
        function animate(time) {
          requestAnimationFrame(animate);
          TWEEN.update(time);
        }
      });
      // Setup eventbus
      let animating = false;
      let orgCamera;
      busPixi.$on('knightAttack', () => {
        animating = true;
        // viewport.snap(displayKnight.x, WORLD_HEIGHT - GROUND_HEIGHT - 100, {
        //   removeOnComplete: true
        // });
        // viewport.snapZoom({
        //   height: (WORLD_HEIGHT / 3 / window.innerHeight) * SCREEN_HEIGHT
        // });
        setTimeout(() => {
          displayKnight.animation.play(this.equipmentAnim, 1);
        }, 200);
        setTimeout(() => {
          displayMonster.animation.play('Damage', 1);
        }, 1040);
        setTimeout(() => {
          animating = false;
          setupCamera(this.camera, 5);
        }, 2000);
      });
      busPixi.$on('monsterAttack', () => {
        animating = true;
        viewport.snap(displayKnight.x, WORLD_HEIGHT - GROUND_HEIGHT - 200, {
          removeOnComplete: true
        });
        viewport.snapZoom({
          height: (WORLD_HEIGHT / 3 / window.innerHeight) * SCREEN_HEIGHT
        });
        // viewport.snapZoom({
        //   height: (WORLD_HEIGHT / 3 / window.innerHeight) * SCREEN_HEIGHT
        // });
        setTimeout(() => {
          displayMonster.animation.play('Attack A', 1);
        }, 200);
        setTimeout(() => {
          displayKnight.animation.play('Damage', 1);
        }, 1040);
        setTimeout(() => {
          animating = false;
          setupCamera(orgCamera, 5);
        }, 2000);
      });

      busPixi.$on('');
    }
  };

  function setupDragonBones(name) {
    var monsterFactory = new dragonBones.PixiFactory();
    monsterFactory.parseDragonBonesData(resources[`${name}Data`].data);
    monsterFactory.parseTextureAtlasData(
      resources[`${name}Atlas`].data,
      resources[`${name}Texture`].texture
    );
    return monsterFactory.buildArmatureDisplay(
      resources[`${name}Data`].data.armature[0].name
    );
  }
  function setupKnight(name, old) {
    if (displayMonster) {
      viewport.removeChild(displayKnight);
    }
    displayKnight = setupDragonBones(name);
    displayKnight.animation.play('Idle', 0);
    displayKnight.x = WORLD_WIDTH / 2;
    displayKnight.y = WORLD_HEIGHT - GROUND_HEIGHT + 50;
    displayKnight.animation.timeScale = 0.7;
    displayKnight.scale.set(-1, 1);
    displayKnight.zIndex = 100;
    displayKnight.on(dragonBones.EventObject.COMPLETE, () => {
      displayKnight.animation.play('Idle', 0);
    });

    viewport.addChild(displayKnight);
  }

  function setupMonster(name, old) {
    if (displayMonster) {
      viewport.removeChild(displayMonster);
    }
    displayMonster = setupDragonBones(name);
    displayMonster.animation.play('Idle', 0);
    displayMonster.x = WORLD_WIDTH / 2 + 400;
    displayMonster.y = WORLD_HEIGHT - GROUND_HEIGHT + 50;
    displayMonster.animation.timeScale = 0.7;

    displayMonster.scale.set(1.4, 1.4);
    displayMonster.zIndex = 101;
    displayMonster.on(dragonBones.EventObject.COMPLETE, () => {
      displayMonster.animation.play('Idle', 0);
    });
    viewport.addChild(displayMonster);
  }

  function setupScene(scene, old) {
    if (spriteBackground) {
      viewport.removeChild(spriteBackground);
      viewport.removeChild(spriteDirt);
      viewport.removeChild(spriteGrass);
    }
    spriteBackground = new PIXI.TilingSprite(
      resources[`Background${scene}`].texture,
      WORLD_WIDTH,
      WORLD_HEIGHT - GROUND_HEIGHT + 10
    );
    spriteBackground.tileScale.set(
      ((WORLD_HEIGHT + 200 - GROUND_HEIGHT) /
        resources[`Background${scene}`].texture.height) *
        1,
      ((WORLD_HEIGHT + 200 - GROUND_HEIGHT) /
        resources[`Background${scene}`].texture.height) *
        1
    );
    spriteBackground.x = 0;
    spriteBackground.y = -10;
    spriteBackground.zIndex = 1;
    viewport.addChild(spriteBackground);
    spriteGrass = new PIXI.TilingSprite(
      resources[`Grass${scene}`].texture,
      WORLD_WIDTH,
      resources[`Grass${scene}`].texture.height - 1
    );
    spriteGrass.x = 0;
    spriteGrass.y = WORLD_HEIGHT - GROUND_HEIGHT;
    spriteGrass.zIndex = 3;
    viewport.addChild(spriteGrass);
    spriteDirt = new PIXI.TilingSprite(
      resources[`Dirt${scene}`].texture,
      WORLD_WIDTH,
      GROUND_HEIGHT
    );
    spriteDirt.x = 0;
    spriteDirt.y = WORLD_HEIGHT - GROUND_HEIGHT + spriteGrass.height;
    spriteDirt.zIndex = 2;
    viewport.addChild(spriteDirt);
  }

  function setupCamera(camera, old) {
    switch (old) {
      case CAMERA_STATE_KNIGHT:
        // zoomBack.start();
        // app.ticker.add(swing);
        // viewport.drag({ factor: 1, wheel: false });
        break;
      case CAMERA_STATE_MONSTER:
        // zoomBack.start();
        // app.ticker.add(swing);
        // viewport.drag({ factor: 1, wheel: false });
        break;
      default:
        break;
    }
    switch (camera) {
      case CAMERA_STATE_MENU:
        viewport.snapZoom({
          height: (WORLD_HEIGHT / 2 / window.innerHeight) * SCREEN_HEIGHT
        });
        if (old === CAMERA_STATE_FULL) {
          viewport.snap(viewport.center.x - MENU_WIDTH, viewport.center.y, {
            removeOnComplete: true
          });
        }
        break;
      case CAMERA_STATE_FULL:
        // viewport.follow(
        //   {
        //     x: (displayKnight.x + displayMonster.x) / 2,
        //     y: WORLD_HEIGHT - GROUND_HEIGHT - 150
        //   },
        //   { speed: 10, radius: 500, acceleration: 5 }
        // );
        viewport.snapZoom({
          height: (WORLD_HEIGHT / 2.5 / window.innerHeight) * SCREEN_HEIGHT
        });
        if (old === CAMERA_STATE_MENU) {
          viewport.snap(viewport.center.x + MENU_WIDTH, viewport.center.y, {
            removeOnComplete: true
          });
        }
        break;
      case CAMERA_STATE_KNIGHT:
        viewport
          // .follow(
          //   {
          //     x: (displayKnight.x + displayMonster.x) / 2 - window.innerWidth / 7,
          //     y: WORLD_HEIGHT - GROUND_HEIGHT - 100
          //   },
          //   { speed: 3, radius: 50, acceleration: 30 }
          // )
          .wheel({ percent: -1 })
          .drag({ factor: 0.0001 });
        viewport.snap(displayKnight.x, WORLD_HEIGHT - GROUND_HEIGHT - 100);
        viewport.snapZoom({
          height: (WORLD_HEIGHT / 3 / window.innerHeight) * SCREEN_HEIGHT
        });
        app.ticker.remove(swing);

        // zoomToKnight.start();
        break;
      case CAMERA_STATE_MONSTER:
        viewport
          // .follow(
          //   {
          //     x: displayMonster.x,
          //     y: WORLD_HEIGHT - GROUND_HEIGHT - 200
          //   },
          //   { speed: 3, radius: 50, acceleration: 30 }
          // )
          .wheel({ percent: -1 })
          .drag({ factor: 0.0001 });
        viewport.snap(displayMonster.x, WORLD_HEIGHT - GROUND_HEIGHT - 200);
        viewport.snapZoom({
          height: (WORLD_HEIGHT / 3 / window.innerHeight) * SCREEN_HEIGHT
        });
        app.ticker.remove(swing);

        // zoomToMonster.start();
        break;
      default:
        break;
    }
  }
  let count = 0;
  function swing() {
    count += 0.01;
    const x = (Math.cos(count) * (1 + Math.random())) / 15;
    const y = (Math.sin(count) * (1 + Math.random())) / 18;
    viewport.moveCenter({
      x: viewport.center.x + x,
      y: viewport.center.y + y
    });
    spriteBackground.tilePosition.set(
      spriteBackground.tilePosition.x + x * 0.4,
      spriteBackground.tilePosition.y + y * 0.4
    );
  }
</script>
