<template>
  <div class="menu">
    <div v-show="scroll" @click="setMenu" class="back-view">
      <i :class="{'white':timeState==='night'}" class="iconfont fp-xiangshang up-effect"></i>
      <i class="iconfont fp-xiangxia down"></i>
      <i @click.stop="setChange" class="iconfont fp-view"></i>
    </div>
    <van-divider :style="{ borderColor: '#016efb' }" content-position="left">功能菜单</van-divider>
    <van-grid :column-num="3" :gutter="'1.5rem'" clickable>
      <van-grid-item @click="choose(index)" v-for="(item,index) in menus" :key="item.name" :style="{color:item.select?'rgba(1, 110, 251, 0.8)':'rgba(0, 0, 0, 0.8)'}" :icon="item.select?item.icon:typeof item.select=='undefined'?item.icon:item.icon+'-o'" :text="item.name" />
    </van-grid>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
import { Grid, GridItem, Icon } from 'vant'
@Component({
  components: {
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Icon.name]: Icon,
  },
})
export default class Menu extends VueBase {
  public menuIndex: number = 0
  private changeIndex: number = 1

  public get menus(): Type.Object {
    return this.$getters.menus
  }

  public get scroll(): boolean {
    return this.$getters.scroll
  }
  public get timeState(): string {
    return this.$getters.timeState
  }

  private async mounted() {
    await this.$nextTick()
    if (localStorage.getItem('menuConfig')) {
      this.$store.state.menus = JSON.parse(localStorage.getItem('menuConfig') || '')
    }
    this.changeIndex = this.$getters.menus[1].show ? 1 : 2
  }

  private choose(index: number) {
    this.changeIndex = index
    this.$commit('updateMenu', { index })
    this.$emit('changeMain', this.menus[index])
    // 缓存menu
    localStorage.setItem('menuConfig', JSON.stringify(this.menus))
  }
  private setMenu() {
    this.menuIndex = this.menuIndex === 0 ? 1 : 0
    this.$emit('changeMain', this.menuIndex)
  }
  private setChange() {
    this.changeIndex = this.changeIndex === 1 ? 2 : 1
    this.$commit('updateMenu', { index: this.changeIndex })
    // 缓存menu
    localStorage.setItem('menuConfig', JSON.stringify(this.menus))
  }
}
</script>

<style scoped lang="less">
.back-view {
  width: 100%;
  height: 6rem;
  .fp-view {
    position: absolute;
    margin: -3.4rem 0 0 2%;
    padding: 0.4rem;
    font-size: 1.7rem;
    color: #999;
  }
}
@keyframes action {
  0% {
    margin-top: -0.8rem;
    font-size: 1.8rem;
  }
  25% {
    margin-top: -3rem;
    font-size: 2.8rem;
  }
  50% {
    margin-top: -0.8rem;
    font-size: 1.8rem;
  }
  100% {
    margin-top: -0.8rem;
    font-size: 1.8rem;
  }
}
.up-effect {
  position: absolute;
  width: 100%;
  text-align: center;
  animation: action 5.5s ease-in-out infinite;
  -webkit-animation: action 5.5s ease-in-out infinite;
}
.down {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 1.8rem;
  margin-top: 0.6rem;
}
.white {
  color: #ffffff;
}
</style>
