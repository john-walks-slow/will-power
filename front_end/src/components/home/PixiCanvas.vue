<template>
  <div id="divPixi" :style="style" ref="divPixi"></div>
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

  import {
    ASSETS_MONSTER,
    ASSETS_SCENE,
    ASSETS_FX,
    ASSETS_EQUIPMENT
  } from 'assets';
  import { mapGetters, mapActions } from 'vuex';
  const GROUND_HEIGHT = 500;
  const SCREEN_HEIGHT = screen.height;
  const SCREEN_WIDTH = screen.width;
  const WORLD_HEIGHT = 1800;
  const WORLD_WIDTH = 4000;

  const CAMERA_STATE_MENU = 0;
  const CAMERA_STATE_FULL = 1;

  const MENU_WIDTH = window.innerWidth <= 400 ? 0 : 200;

  let app;
  let viewport;
  let loader;
  let resources;
  let spriteBackground;
  let spriteDirt;
  let spriteGrass;
  let spriteFx;
  let displayMonster;
  let animating = false;
  let swingCount = 0;

  let orgX;
  let orgY;
  let clickX;
  let clickY;

  let zoomed = false;
  let moved = false;

  export let busPixi = new Vue();

  let vm = {
    props: {
      camera: Number
    },
    data() {
      return { loaded: false, isMonsterHover: false };
    },
    watch: {
      camera(v, o) {
        this.setupCamera(v, o);
      },
      monster(v, o) {
        this.setupMonster(v, o);
      },

      cursor(v, o) {
        this.$refs.divPixi.style.cursor = v;
      },
      scene(v, o) {
        this.setupScene(v, o);
      },
      fx(v, o) {
        this.setupFx(v, o);
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
      ...mapGetters('equipments', { equipments: 'list' }),
      ...mapGetters('knights', { knight: 'current' }),
      weapon() {
        let weapons = this.equipments.filter(
          w => w.equipped && w.cat === 'weapon'
        );
        if (weapons.length > 0) {
          return weapons[0];
        } else {
          return null;
        }
      },
      weaponType() {
        let weapons = this.equipments.filter(
          w => w.equipped && w.cat === 'weapon'
        );
        if (weapons.length > 0) {
          return weapons[0].typeId;
        } else {
          return null;
        }
      },
      attackable() {
        if (this.weapon) {
          return this.knight.wp >= this.weapon.wpConsumption;
        } else {
          return this.knight.wp >= 25;
        }
      },
      fx() {
        if (!this.loaded) {
          return null;
        }
        if (this.weaponType) {
          if (Object.keys(ASSETS_FX).includes(this.weaponType + 'FX.png')) {
            return this.weaponType + 'FX.png';
          } else {
            return this.weaponType.replace(/^[A-Z][a-z]*/, '') + 'FX.png';
          }
        } else {
          return 'DefaultFX.png';
        }
      },
      monster() {
        return this.battle && this.loaded ? this.battle.monsterTypeId : undefined;
      },
      isMonsterLowHp() {
        return this.battle && this.loaded
          ? this.battle.hp < this.battle.maxHp / 2
          : false;
      },
      cursor() {
        let cursor;
        if (this.isMonsterHover) {
          if (this.attackable) {
            if (this.weapon) {
              cursor = `url(${
                ASSETS_EQUIPMENT[this.weapon.typeId + '.png']
              }), auto`;
            } else {
              cursor = 'pointer';
            }
          } else {
            cursor = 'not-allowed';
          }
        } else cursor = '';
        return cursor;
      },
      scene() {
        return this.battle && this.loaded
          ? (Math.floor(this.battle.level / 5) % 4) + 1
          : undefined;
      }
    },
    methods: {
      ...mapActions('knights', { patchKnight: 'patch' }),
      setupFx(name, old) {
        function getFramesFromSpriteSheet(texture, frameWidth, frameHeight) {
          var frames = [];
          for (var i2 = 0; i2 < texture.height; i2 += frameHeight) {
            for (var i = 0; i < texture.width; i += frameWidth) {
              frames.push(
                new PIXI.Texture(
                  texture.baseTexture,
                  new PIXI.Rectangle(i, i2, frameWidth, frameHeight)
                )
              );
            }
          }
          return frames;
        }
        console.log(name);
        spriteFx = new PIXI.extras.AnimatedSprite(
          getFramesFromSpriteSheet(resources[name].texture, 192, 192)
        );
        spriteFx.zIndex = 9999;
        spriteFx.loop = false;
        spriteFx.animationSpeed = 0.5;
        spriteFx.scale.set(2.5, 2.5);
        spriteFx.blendMode = PIXI.BLEND_MODES.ADD;
        spriteFx.onComplete = () => {
          viewport.removeChild(spriteFx);
        };
      },
      playFx(x, y) {
        viewport.addChild(spriteFx);
        if (this.fx.includes('Hook')) {
          spriteFx.scale.set(2, 2);
          x += spriteFx.width / 5;
        }
        if (this.fx.includes('Bow')) {
          spriteFx.scale.set(5, 5);
          x += spriteFx.width / 5;
          y -= spriteFx.height / 7;
        }
        if (this.fx.includes('Dagger')) {
          spriteFx.scale.set(1.5, 1.5);
          spriteFx.animationSpeed = 0.7;
        }
        if (this.fx.includes('Hammer')) {
          spriteFx.scale.set(4, 4);
        }
        spriteFx.x = x - spriteFx.width / 2;
        spriteFx.y = y - spriteFx.height / 2;
        spriteFx.gotoAndPlay(0);
      },

      setupMonster(name, old) {
        if (displayMonster) {
          displayMonster.removeAllListeners();
        }
        console.log(displayMonster);
        if (!name) {
          return;
        }
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
        displayMonster.defaultAnim = 'Idle';
        displayMonster.attackAnims = Object.keys(
          displayMonster.animation.animations
        ).filter(anim => anim.includes('Attack') || anim.includes('Skill'));
        displayMonster.animation.play(displayMonster.defaultAnim, 0);
        displayMonster.x = WORLD_WIDTH / 2;
        displayMonster.y = WORLD_HEIGHT - GROUND_HEIGHT + 50;
        displayMonster.animation.timeScale = 0.5;

        displayMonster.scale.set(1, 1);
        displayMonster.zIndex = 101;
        displayMonster.on(dragonBones.EventObject.COMPLETE, () => {
          displayMonster.animation.play(displayMonster.defaultAnim, 0);
          animating = false;
        });

        displayMonster.interactive = true;
        viewport.addChild(displayMonster);
        this.setupCamera(this.camera, this.camera);

        displayMonster.attack = e => {
          animating = true;
          displayMonster.animation.play(
            displayMonster.attackAnims[
              Math.floor(Math.random() * displayMonster.attackAnims.length)
            ],
            1
          );
        };
        displayMonster.damaged = e => {
          console.log('dsd');
          animating = true;
          displayMonster.animation.play('Damage', 1);
        };
        // Setup eventbus
        busPixi.$on('monsterAttack', displayMonster.attack);
        busPixi.$on('knightAttack', displayMonster.damaged);
        displayMonster.on('mouseover', () => {
          this.isMonsterHover = true;
        });
        displayMonster.on('mouseout', event => {
          this.isMonsterHover = false;
        });
        displayMonster.on('mousedown', event => {
          clickX = viewport.center.x;
          clickY = viewport.center.y;
        });
        displayMonster.on('touchstart', event => {
          clickX = viewport.center.x;
          clickY = viewport.center.y;
        });
        let attack = ({ data }) => {
          let clickDeltaX = viewport.center.x - clickX;
          let clickDeltaY = viewport.center.y - clickY;
          console.log(clickDeltaX);
          console.log(clickDeltaY);
          if (Math.abs(clickDeltaX) <= 5 && Math.abs(clickDeltaY) <= 5) {
            if (this.attackable) {
              this.patchKnight([
                this.knight._id,
                {},
                { query: { action: 'attack' } }
              ]);
              busPixi.$emit('knightAttack');
              this.playFx(
                data.getLocalPosition(viewport).x,
                data.getLocalPosition(viewport).y
              );
            }
          }
        };
        displayMonster.on('click', attack);
        displayMonster.on('tap', attack);
      },
      setupScene(scene, old) {
        if (!scene) {
          return;
        }
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
            1.1,
          ((WORLD_HEIGHT + 200 - GROUND_HEIGHT) /
            resources[`Background${scene}.png`].texture.height) *
            1.1
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
              height: (WORLD_HEIGHT / 2.2 / window.innerHeight) * SCREEN_HEIGHT
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
              height: (WORLD_HEIGHT / 2.5 / window.innerHeight) * SCREEN_HEIGHT
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
      this.$refs.divPixi.appendChild(app.view);
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
        .wheel({
          smooth: 30,
          percent: -0.95
        })
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
      Object.keys(ASSETS_FX).forEach(name => loader.add(name, ASSETS_FX[name]));
      loader.onProgress.add(v => {
        this.$emit('loading', v.progress);
      });
      loader.load(() => {
        this.loaded = true;
        this.setupFx(this.fx, this.fx);
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
        viewport.on('moved', t => {
          if (!spriteBackground) {
            return;
          }
          moved = true;
          setTimeout(function() {
            // body
          });
          if (t != 'clamp') {
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
      });
    }
  };
  export default vm;

  // TODO: Support animation fade in
  // TODO: PIXI Canvas should be based on event rather than pure data.
</script>
