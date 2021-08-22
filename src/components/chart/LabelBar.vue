<!-- 打卡记录 -->
<template>
  <div style="width:100%">
    <canvas style="width: 100%;height: auto;" id="labelBar"></canvas>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import VueBase from '@/vueBase';
// import F2 from '@antv/f2/lib/index-all';
const F2 = (window as any).F2
@Component({
  components: {}
})
export default class Name extends VueBase {
  @Prop()
  private data!: Type.Object;
  private myF2!: Type.Object;

  private async mounted() {
    await this.$nextTick();
    // this.reRender();
  }

  private prepare() {
    const that = this;
    const Util = F2.Util;
    return new Promise(resolve => {
      this.myF2 = F2;
      resolve();
    });
  }

  private async reRender() {
    const that = this;
    if (!this.myF2) {
      await this.prepare();
    }
    const chart = new this.myF2.Chart({
      id: 'labelBar',
      pixelRatio: window.devicePixelRatio,
      padding: [60, 'auto', 'auto']
    });

    chart.source(that.data, {
      time: {
        min: 24 * 60, // 2018-06-29 00:00:00
        max: 0, // 2018-06-29 23:59:59
        nice: false,
        ticks: [0, 24 * 60], // 00:00, 23:59
        formatter: function formatter(val: number) {
          return val === 0 ? '00:00' : '23:59';
        },
        scale: function scale(value: number) {
          if (value === null || value === undefined) {
            return NaN;
          }
          return value / (24 * 60);
        }
      }
    });

    chart.tooltip(false);
    chart.axis('time', {
      position: 'right'
    });

    // 绘制 guide
    that.data.map((obj: Type.Object) => {
      if (typeof obj.time === 'number') {
        const HmTime =
          parseInt(obj.time / 60 + '', 10) + 'h ' + (obj.time % 60) + 'min';
        const formatTime =
          obj.time > 60 ? HmTime : obj.time <= 1 ? '<1min' : obj.time + 'min';
        chart.guide().tag({
          position: [obj.date, 'max'],
          content: formatTime,
          direct: 'tc',
          background: {
            padding: [5], // tag 内边距，使用同 css 盒模型的 padding
            radius: 2, // tag 圆角
            fill: '#1890FF' // tag 背景色
          },
          side: 6,
          withPoint: null
        });

        chart.guide().line({
          start: [obj.date, 'min'],
          end: [obj.date, 'max'],
          top: false
        });
      }
    });

    chart
      .interval()
      .position('date*time')
      .shape('reverse')
      .size(16)
      .animate({
        appear: {
          animation: 'fadeIn'
        }
      });
    chart.render();
  }

  private getRectRange(points: Type.Object, coord: Type.Object) {
    const coordHeight = Math.abs(coord.y.start - coord.y.end);
    const xValues = [];
    const yValues = [];
    for (let i = 0, len = points.length; i < len; i++) {
      const point = points[i];
      xValues.push(point.x);
      yValues.push(point.y);
    }
    const xMin = Math.min.apply(null, xValues);
    const yMin = Math.min.apply(null, yValues);
    const xMax = Math.max.apply(null, xValues);
    const yMax = Math.max.apply(null, yValues);
    return {
      x: xMin,
      y: yMax,
      width: xMax - xMin,
      height: coordHeight - (yMax - yMin)
    };
  }

  @Watch('data', { immediate: true, deep: true })
  private onLabelBarChanged(val: any, oldVal: any) {
    if (val.length > 0) {
      this.reRender();
    }
  }
}
</script>
<style scoped lang='less'>
</style>