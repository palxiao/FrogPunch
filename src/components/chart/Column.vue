<!-- 横柱状 -->
<template>
  <div style="width:100%">
    <canvas style="width: 100%;height: auto;" id="column"></canvas>
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

  public get currentData(): Type.Object {
    this.data.forEach((item: Type.Object) => {
      item.const = 100;
    });
    return this.data;
  }

  private async mounted() {
    await this.$nextTick();
    // this.reRender();
  }

  private reRender() {
    const that = this;
    const chart = new F2.Chart({
      id: 'column',
      pixelRatio: window.devicePixelRatio,
      height: this.data.length * 40,
      padding: [20, 20, 5]
    });
    chart.source(that.currentData);
    chart.coord({
      transposed: true
    });
    chart.axis(false);
    chart.tooltip(false);
    chart
      .interval()
      .position('name' + '*' + 'const')
      .color('#d9e4eb')
      .size(10)
      .animate(false);
    chart
      .interval()
      .position('name*after_time')
      .size(10);

    // 绘制文本
    that.data.map((obj: Type.Object) => {
      chart.guide().text({
        position: [obj.name, 'min'],
        content: obj.name,
        style: {
          textAlign: 'start',
          textBaseline: 'bottom'
        },
        offsetY: -8
      });
      chart.guide().text({
        position: [obj.name, 'max'],
        content:
          '时长 : ' + that.numberToMoney(obj.after_time / 60000) + '分钟',
        style: {
          textAlign: 'end',
          textBaseline: 'bottom'
        },
        offsetY: -8
      });
    });
    chart.render();
  }

  private numberToMoney(n: number) {
    return String(Math.floor(n * 100) / 100).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    );
  }
  @Watch('data', { immediate: true, deep: true })
  private onColumnChanged(val: any, oldVal: any) {
    if (val.length > 0) {
      this.reRender();
    }
  }
}
</script>
<style scoped lang='less'>
</style>