<!--  -->
<template>
  <div style="width: 100%;  height: 100%;">
    <div class="satic-area" :style="{backgroundPositionX: rate+'%'}">
      <div class="dynamic-area1"></div>
      <div class="dynamic-area2"></div>
    </div>
    <div v-if="mask" class="mask"></div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import VueBase from '@/vueBase';
@Component({
  components: {}
})
export default class Name extends VueBase {
  @Prop(Boolean)
  public mask!: boolean;

  public get rate(): number {
    const d = new Date();
    const mins = d.getHours() * 60 + d.getMinutes();
    const have = 24 * 60;
    return ((have - mins) / have) * 100;
  }

  private async mounted() {
    await this.$nextTick();
  }
  // @Emit('change')
  // private change(e: MouseEvent) {}
  // @Watch('field', { immediate: true, deep: true })
  // private onPersonChanged(val: string, oldVal: string) {}
}
</script>
<style scoped lang='less'>
.mask,
.content {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}
.mask {
  background: rgba(0, 0, 0, 0.3);
}
.satic-area {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(http://fp-img.palxp.com/sky.jpg) no-repeat;
  // background-position-x: 100%;
  background-size: cover;
}

.dynamic-area1 {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(http://fp-img.palxp.com/cloud01.png) repeat-x 0px 0px;
  background-size: cover;
  animation: posterDrop1 6000s linear infinite;
}

@keyframes posterDrop1 {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 4000% 0;
  }
}

.dynamic-area2 {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(http://fp-img.palxp.com/cloud00.png) repeat-x 0px 0px;
  background-size: cover;
  animation: posterDrop2 8000s linear infinite;
}

@keyframes posterDrop2 {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 30000% 0;
  }
}
</style>