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
  // let TWEEN = require('@tweenjs/tween.js');

  import { ASSETS_MONSTER, ASSETS_SCENE } from 'assets';
  import { mapGetters } from 'vuex';

  const GROUND_HEIGHT = 500;
  const SCREEN_HEIGHT = screen.height;
  const SCREEN_WIDTH = screen.width;
  const WORLD_HEIGHT = 1400;
  const WORLD_WIDTH = 4000;

  const CAMERA_STATE_MENU = 0;
  const CAMERA_STATE_FULL = 1;

  const MENU_WIDTH = 200;

  let app;
  let viewport;
  let loader;
  let resources;
  let spriteBackground;
  let spriteDirt;
  let spriteGrass;
  let displayMonster;
  let animating = false;
  let swingCount = 0;
  export let busPixi = new Vue();

  export default {
    props: {
      camera: Number
    },
    data() {
      return { loaded: false };
    },
    watch: {
      camera(v, o) {
        this.setupCamera(v, o);
      },
      monster(v, o) {
        this.setupMonster(v, o);
      },
      scene(v, o) {
        this.setupScene(v, o);
      }
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
      },
      ...mapGetters('battles', { battle: 'current' }),
      monster() {
        return this.battle && this.loaded ? this.battle.monsterTypeId : undefined;
      },
      scene() {
        return this.battle && this.loaded
          ? (Math.floor(this.battle.level / 5) % 4) + 1
          : undefined;
      }
    },
    methods: {
      setupMonster(name, old) {
        if (!name) {
          return;
        }
        console.log(ASSETS_MONSTER);
        console.log(resources);
        if (displayMonster) {
          viewport.removeChild(displayMonster);
        }
        var monsterFactory = new dragonBones.PixiFactory();
        monsterFactory.parseDragonBonesData(resources[`${name}_ske.json`].data);
        monsterFactory.parseTextureAtlasData(
          resources[`${name}_tex.json`].data,
          resources[`${name}_tex.png`].texture
        );
        displayMonster = monsterFactory.buildArmatureDisplay(
          resources[`${name}_ske.json`].data.armature[0].name
        );
        displayMonster.animation.play('Idle', 0);
        displayMonster.x = WORLD_WIDTH / 2;
        displayMonster.y = WORLD_HEIGHT - GROUND_HEIGHT + 60;
        displayMonster.animation.timeScale = 0.5;

        displayMonster.scale.set(1, 1);
        displayMonster.zIndex = 101;
        displayMonster.on(dragonBones.EventObject.COMPLETE, () => {
          displayMonster.animation.play('Idle', 0);
          animating = false;
        });
        viewport.addChild(displayMonster);
        this.setupCamera(this.camera, this.camera);
      },
      setupScene(scene, old) {
        if (!scene) {
          return;
        }
        console.log(scene);
        if (spriteBackground) {
          viewport.removeChild(spriteBackground);
          viewport.removeChild(spriteDirt);
          viewport.removeChild(spriteGrass);
        }
        spriteBackground = new PIXI.TilingSprite(
          resources[`Background${scene}.png`].texture,
          WORLD_WIDTH,
          WORLD_HEIGHT - GROUND_HEIGHT + 10
        );
        spriteBackground.tileScale.set(
          ((WORLD_HEIGHT + 200 - GROUND_HEIGHT) /
            resources[`Background${scene}.png`].texture.height) *
            1,
          ((WORLD_HEIGHT + 200 - GROUND_HEIGHT) /
            resources[`Background${scene}.png`].texture.height) *
            1
        );
        spriteBackground.x = 0;
        spriteBackground.y = -10;
        spriteBackground.zIndex = 1;
        viewport.addChild(spriteBackground);
        spriteGrass = new PIXI.TilingSprite(
          resources[`Grass${scene}.png`].texture,
          WORLD_WIDTH,
          resources[`Grass${scene}.png`].texture.height - 1
        );
        spriteGrass.x = 0;
        spriteGrass.y = WORLD_HEIGHT - GROUND_HEIGHT;
        spriteGrass.zIndex = 3;
        viewport.addChild(spriteGrass);
        spriteDirt = new PIXI.TilingSprite(
          resources[`Dirt${scene}.png`].texture,
          WORLD_WIDTH,
          GROUND_HEIGHT
        );
        spriteDirt.x = 0;
        spriteDirt.y = WORLD_HEIGHT - GROUND_HEIGHT + spriteGrass.height;
        spriteDirt.zIndex = 2;
        viewport.addChild(spriteDirt);
        let orgY;
        let orgX;
        let zoomed;
        viewport.removeListener('moved');
        viewport.removeListener('zoomed');
        app.ticker.remove(this.swing);
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
        app.ticker.add(this.swing);
      },

      setupCamera(camera, old) {
        if (!displayMonster) {
          return;
        }
        switch (camera) {
          case CAMERA_STATE_MENU:
            viewport.follow(
              {
                x: WORLD_WIDTH / 2,
                y: WORLD_HEIGHT - GROUND_HEIGHT - 150
              },
              { speed: 20, radius: 450, acceleration: 15 }
            );
            viewport.snapZoom({
              height: (displayMonster.height / window.innerHeight) * SCREEN_HEIGHT
            });
            if (old === CAMERA_STATE_FULL) {
              viewport.snap(viewport.center.x - MENU_WIDTH, viewport.center.y, {
                removeOnComplete: true
              });
            }
            break;
          case CAMERA_STATE_FULL:
            viewport.follow(
              {
                x: WORLD_WIDTH / 2,
                y: WORLD_HEIGHT - GROUND_HEIGHT - 150
              },
              { speed: 20, radius: 450, acceleration: 15 }
            );
            viewport.snapZoom({
              height:
                ((displayMonster.height * 3) / window.innerHeight) * SCREEN_HEIGHT
            });
            if (old === CAMERA_STATE_MENU) {
              viewport.snap(viewport.center.x + MENU_WIDTH, viewport.center.y, {
                removeOnComplete: true
              });
            }
            break;
          default:
            break;
        }
      },
      swing() {
        swingCount += 0.003;
        const x = (Math.cos(swingCount) * (1 + Math.random())) / 25;
        const y = (Math.sin(swingCount) * (1 + Math.random())) / 30;
        viewport.moveCenter({
          x: viewport.center.x + x,
          y: viewport.center.y + y
        });
        spriteBackground.tilePosition.set(
          spriteBackground.tilePosition.x + x * 0.4,
          spriteBackground.tilePosition.y + y * 0.4
        );
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

      app.stage.addChild(viewport);

      // Prepare loading
      loader = PIXI.loader;
      loader.reset();
      resources = loader.resources;

      Object.keys(ASSETS_MONSTER)
        .filter(a => !a.endsWith('_ske') && !a.endsWith('_tex'))
        .forEach(name => loader.add(name, ASSETS_MONSTER[name]));
      Object.keys(ASSETS_SCENE).forEach(name =>
        loader.add(name, ASSETS_SCENE[name])
      );
      loader.onProgress.add(v => {
        this.$emit('loading', v.progress);
      });
      loader.load(() => {
        this.loaded = true;
        // Start drawing after loaded...
        viewport.moveCenter({
          x: WORLD_WIDTH / 2,
          y: WORLD_HEIGHT - GROUND_HEIGHT - 150
        });

        viewport.snapZoom({
          height: (WORLD_HEIGHT / 1.2 / window.innerHeight) * SCREEN_HEIGHT
        });
        // requestAnimationFrame(animate);
        // function animate(time) {
        //   requestAnimationFrame(animate);
        //   TWEEN.update(time);
        // }
      });

      // Setup eventbus
      busPixi.$on('knightAttack', () => {
        if (!animating) {
          animating = true;
          displayMonster.animation.play('Damage', 1);
        }
      });
      busPixi.$on('');
    }
  };
</script>
