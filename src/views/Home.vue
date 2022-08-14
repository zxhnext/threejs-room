<template>
  <div class='scene' ref='sceneDiv'></div>
  <div class="tooltip-box" :style="tooltipPosition" ref="tooltipBox">
    <div class="container">
      <div class="title">标题：{{ tooltipContent.title }}</div>
      <div class="explain">说明：{{ tooltipContent.text }}</div>
    </div>
  </div>
  <p class="title-text" ref="titleBox" :style="titlePosition">
    {{ tooltipContent.title }}
  </p>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue';
import * as THREE from 'three';

// 导入场景
import scene from '@/three/scene';
import camera from '@/three/camera';
// 导入控制器
// import controls from '@/three/controls';
// 导入辅助坐标轴
import axesHelper from '@/three/axesHelper';
// 导入渲染器
import renderer from '@/three/renderer';
// 初始化调整屏幕
import '@/three/init';
// 导入每一帧的执行函数
import animate from '@/three/animate';
import { createSphere, addSprite, changeContentAndTips } from '@/three/mesh';

export default defineComponent({
  name: 'Home',
  setup() {
    const sceneDiv = ref<null | HTMLElement>(null);
    const tooltipBox = ref<null | HTMLElement>(null);
    const tooltipContent = ref({});
    const titlePosition = ref({
      top: '-100%',
      left: '-100%',
    });
    const tooltipPosition = ref({
      top: '-100%',
      left: '-100%',
    });
    // 添加相机
    scene.add(camera);
    // 添加辅助坐标轴
    scene.add(axesHelper);
    const sphere = createSphere();
    let spriteList = addSprite();

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const handleTooltipHide = (event: MouseEvent) => {
      event.preventDefault();
      tooltipPosition.value = {
        top: '-100%',
        left: '-100%',
      };
      titlePosition.value = {
        top: '-100%',
        left: '-100%',
      };
      tooltipContent.value = {};
    };

    const mouseClick = (event: MouseEvent) => {
      event.preventDefault();
      mouse.x = (event.clientX / (sceneDiv.value as HTMLElement).clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / (sceneDiv.value as HTMLElement).clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spriteList, true);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (intersects.length > 0 && intersects[0].object.content.showTitle) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        spriteList = changeContentAndTips(sphere, intersects[0].object.content.image);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        handleTooltipHide(event);
      }
    };

    const mouseMove = (event: MouseEvent) => {
      event.preventDefault();
      mouse.x = (event.clientX / (sceneDiv.value as HTMLElement).clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / (sceneDiv.value as HTMLElement).clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spriteList, true);
      if (intersects.length > 0) {
        const elementWidth = (sceneDiv.value as HTMLElement).clientWidth / 2;
        const elementHeight = (sceneDiv.value as HTMLElement).clientHeight / 2;
        const worldVector = new THREE.Vector3(
          intersects[0].object.position.x,
          intersects[0].object.position.y,
          intersects[0].object.position.z,
        );
        const position = worldVector.project(camera);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tooltipContent.value = intersects[0].object.content;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (intersects[0].object.content.showTip) {
          const left = Math.round(
            elementWidth * position.x
              + elementWidth
              - (tooltipBox.value as HTMLElement).clientWidth / 2,
          );
          const top = Math.round(
            -elementHeight * position.y
              + elementHeight
              - (tooltipBox.value as HTMLElement).clientHeight / 2,
          );
          tooltipPosition.value = {
            left: `${left}px`,
            top: `${top}px`,
          };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        } else if (intersects[0].object.content.showTitle) {
          const left = Math.round(
            elementWidth * position.x
              + elementWidth
              - (tooltipBox.value as HTMLElement).clientWidth / 2,
          );
          const top = Math.round(-elementHeight * position.y + elementHeight);
          titlePosition.value = {
            left: `${left}px`,
            top: `${top}px`,
          };
        }
      } else {
        handleTooltipHide(event);
      }
    };

    onMounted(() => {
      (sceneDiv.value as HTMLElement).appendChild(renderer.domElement);
      window.addEventListener('click', mouseClick, false);
      (sceneDiv.value as HTMLElement).addEventListener('mousemove', mouseMove, false);
      (tooltipBox.value as HTMLElement).addEventListener('mouseleave', handleTooltipHide, false);
      animate();
    });

    return {
      sceneDiv,
      tooltipBox,
      titlePosition,
      tooltipPosition,
      tooltipContent,
    };
  },
});
</script>

<style lang='less' scoped>
.title-text {
  position: absolute;
  width: 66px;
  color: #382129;
}
.tooltip-box {
  position: absolute;
  padding: 0px 0px 40px 0px;
  line-height: 30px;
  border-radius: 4px;
  color: #ffffff;
  z-index: 100;
  cursor: pointer;
  .container {
    position: relative;
    width: 240px;
    max-height: 200px;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    .title {
      width: 100%;
      padding: 6px 0;
    }
    .explain {
      width: 100%;
      max-height: 100px;
      font-size: 14px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      &::-webkit-scrollbar-track {
        background: #353535;
        border-radius: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background: #cdcdcd;
        border-radius: 2px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #9c9c9c;
      }
      &::-webkit-scrollbar-corner {
        background: #f6f6f6;
      }
    }
  }
}
</style>
