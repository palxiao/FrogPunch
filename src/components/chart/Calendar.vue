<!-- 日历控件 -->
<template>
    <div :style='css'>
        <datepicker :value="value" @selected="select" @changedMonth="changedMonth" :inline="true" :language="zh" :highlighted='highlighted' :disabled-dates='disabledDates'></datepicker>
    </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import VueBase from '@/vueBase';
import Datepicker from 'vuejs-datepicker';
import { zh } from 'vuejs-datepicker/dist/locale';
@Component({
  components: { Datepicker }
})
export default class Name extends VueBase {
  public zh: any = zh;
  public value: Date = new Date();
  public get disabledDates(): any {
    return {
      from: new Date()
    };
  }
  public get highlighted(): Type.Object {
    return {
      dates: this.lightDates
    };
  }
  @Prop()
  private css!: Type.Object;

  @Prop()
  private lightDates!: Date[];

  private async mounted() {
    await this.$nextTick();
  }
  private select(e: any) {
    this.$emit('changeDate', e);
  }
  private changedMonth(e: Type.Object) {
    this.$emit('changeDate', e.timestamp || e, 'getMonth');
  }
  // @Emit('change')
  // private change(e: MouseEvent) {}
  // @Watch('field', { immediate: true, deep: true })
  // private onPersonChanged(val: string, oldVal: string) {}
}
</script>
<style>
.vdp-datepicker__calendar .cell {
  border: none !important;
}
.vdp-datepicker__calendar .cell.selected {
  background: #1989fa !important;
  color: #ffffff;
  /* border-radius: 50%; */
}
</style>