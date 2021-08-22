<template>
  <div class="index">
    <van-swipe ref="container" :style="'height: ' + $getters.windowHeight + 'px;'" vertical :show-indicators="false" :touchable="scroll" :loop="false">
      <van-swipe-item>
        <component :is="timeState + '-model'">
          <div v-for="(m, mi) in menus" :key="mi">
            <component v-if="m.module" :ref="m.module" :is="m.module" v-show="m.select | m.show"></component>
          </div>
        </component>
      </van-swipe-item>
      <van-swipe-item>
        <div class="second-view">
          <van-notice-bar v-show="mission" class="notice" left-icon="flag-o" color="#1989fa" background="#ecf9ff" mode="closeable"> 正在执行任务 -- {{ mission }} </van-notice-bar>
          <my-menu @changeMain="clickMenu"></my-menu>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
import { Swipe, SwipeItem, NoticeBar } from 'vant'
import { NightModel, DayModel } from '@/components/model'
import MyMenu from '@/components/common/Menu.vue'
import ClockIn from '@/components/clock-in'
import LifeClock from '@/components/life-clock'
import Target from '@/components/target'

@Component({
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [NoticeBar.name]: NoticeBar,
    DayModel,
    NightModel,
    MyMenu,
    ClockIn,
    LifeClock,
    Target,
  },
})
export default class Index extends VueBase {
  public currentTime: number = 0
  public swipe!: Type.Object

  public get mission(): string {
    return this.$getters.clockIn !== 0 ? this.$getters.executing : null
  }
  public get scroll(): boolean {
    return this.$getters.scroll
  }

  public get menus(): Type.Object {
    return this.$getters.menus
  }

  public get routeFrom(): string {
    return this.$getters.routeFrom
  }

  public get timeState(): string {
    return this.$getters.timeState
  }

  // public constructor() {
  //   super();
  // }
  private async created() {
    await this.$nextTick()
    if (this.$route.params && this.$route.params.hasOwnProperty('id')) {
      const { event_id: id, event_name: name } = this.$route.params
      const params: Type.Object = {id, name}
      console.log(params);
      (this.$refs.clockIn as Type.Object)[0].clickTag(params)
      setTimeout(() => {
        this.$commit('updateMenu', { index: 1 })
      }, 100);
    }
  }

  private async mounted() {
    await this.$nextTick()
    this.swipe = this.$refs.container as Type.Object
    if (this.routeFrom !== '/') {
      if (this.routeFrom === '/target') {
        return
      }
      this.swipe.swipeTo(1)
    }
  }
  private beforeDestroy() {
    this.$utils.stopwatch() // 停止计时器
  }
  /**
   * 选择菜单回调
   */
  private async clickMenu(item: any) {
    if (item.action && item.action === 'up') {
      this.swipe.swipeTo(0)
    } else if (item.action === 'jump' && item.path) {
      // this.$router.replace(item.path);
      this.$router.push(item.path)
    } else {
      this.swipe.swipeTo(item)
    }
  }
}
</script>

<style scoped>
.second-view {
  min-height: 100%;
  background-color: rgb(192, 192, 192, 0.2);
}
.notice {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 99;
}
</style>
