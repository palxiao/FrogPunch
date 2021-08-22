<!-- 生之钟 -->
<template>
  <div class='life-clock' :style="{'margin-top':mt+'px'}">
    <div v-for="(item, index) in times" :key="index">
      <van-divider content-position="left" :dashed="true" :style="styleObj">{{item.title}}</van-divider>
      <van-progress v-if="item.long" :percentage="item.percentage" :pivot-text="item.long" :color="itemColor" />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import VueBase from '@/vueBase';
import { Progress } from 'vant';
@Component({
  components: {
    [Progress.name]: Progress
  }
})
export default class LifeClock extends VueBase {
  public styleObj: {} = { color: '#ffffff', borderColor: '#ffffff' };
  public itemColor: string = 'linear-gradient(to right, #83b9ff, #016efb)';
  @Prop(String)
  private msg!: string;

  public get mt(): number {
    const wh = this.$getters.windowHeight;
    const ratio = wh < 540 ? 9 : 7;
    return wh / ratio;
  }

  public get now(): Type.Object {
    return this.$getters.nowObj;
  }

  private times: object[] = [];

  // private async mounted() {
  //   await this.$nextTick();
  // }
  private created() {
    this.times.push(
      this.timeData(
        '这一年已经过去了',
        this.now.yearDay + '天',
        (this.now.yearDay / 365) * 100
      ),
      this.timeData(
        '这个月你已经度过了',
        this.now.monthDay + '天',
        (this.now.monthDay / this.now.month) * 100
      ),
      this.timeData(
        '今天是这一周的',
        '第' + this.now.weekDay + '天',
        (this.now.weekDay / 7) * 100
      )
    );
  }
  private timeData(title: string, long?: string, percentage?: string | number) {
    return {
      title,
      long,
      percentage
    };
  }
}
</script>
<style scoped lang='less'>
.life-clock {
  background: rgba(0, 0, 0, 0.18);
  padding: 0.1rem 8% 2rem 8%;
  border-radius: 20px;
  // position: absolute;
  width: 84%;
  margin-left: 8%;
}
</style>