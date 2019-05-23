<template>
  <div class="canvasEffect" id="particles-js"></div>
</template>

<style scoped>
  .canvasEffect {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: transparent;
    z-index: 501;
    pointer-events: none;
  }
</style>
<script>
  import 'assets/particles';

  export default {
    mounted() {
      particlesJS('particles-js', {
        particles: {
          number: { value: 40, density: { enable: true, value_area: 400 } },
          color: { value: '#7ef2ec' },
          shape: {
            type: 'circle',
            stroke: { width: 0, color: '#000000' }
          },
          opacity: {
            value: 0.3,
            random: false,
            anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 5,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
          },
          line_linked: {
            enable: false,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 0.9000000000000001,
            direction: 'top',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
          }
        },
        interactivity: {
          detect_on: 'window',
          events: {
            onhover: { enable: true, mode: ['bubble'] },
            onclick: { enable: true, mode: 'repulse' },
            resize: true
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: {
              distance: 350,
              size: 4,
              duration: 0,
              opacity: 0.8,
              speed: 0
            },
            repulse: { distance: 350, duration: 1 },
            push: { particles_nb: 1 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
      let update = function() {
        requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }
  };
</script>
