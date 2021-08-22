<!--  -->
<template>
  <div>
    <van-nav-bar title="时光沙漏" left-text="返回" left-arrow @click-left=" $router.replace('/') " @click-right="info">
      <!-- <div slot="right" @click="">设置</div> -->
      <template #right>
        <van-icon name="info-o" size="26" />
      </template>
    </van-nav-bar>

    <div class="container" :style="{'--topHeight': (saveTime/maxTime)*100+'%', '--fixedTime': fixedTime+'s', '--fixedFunnelRatio': fixedFunnelRatio+'%'}">
      <div @click="startRun" :class="{'hourglass': run}">

        <div class="top" :class="{'top_run': run}"></div>
        <div class="bottom">
          <div :style="{'top': funnelTime+'%'}" class="bottom_sand" :class="{'bottom_sand_run': startDrop}"></div>
        </div>
        <div :class="startDrop?'mid':'mid_empty'"></div>

        <div v-show="startDrop" class="drops">
          <div v-for="drop in 10" :key="'drop'+drop" class="drop"></div>
        </div>

        <div class="woods">
          <div class="wood"></div>
          <div class="wood"></div>
        </div>

        <div class="glares">
          <div v-for="glare in 4" :key="'glare'+glare" class="glare"></div>
        </div>

      </div>
    </div>

    <div :class="{'watch_time-none': saveTime<=1000}" class="watch_time">{{timing[0]}} <span class="semi" :class="{'semi-flash': run}">:</span> {{timing[1]}}</div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { NavBar, Icon, Dialog } from 'vant'
import VueBase from '@/vueBase'

@Component({
  components: { [NavBar.name]: NavBar, [Icon.name]: Icon },
})
export default class Name extends VueBase {
  private run: boolean = false
  private startDrop: boolean = false
  private iCount!: any

  private fixedTime: number = 0 // css动画中的时间，需要固定好
  private fixedFunnelRatio: number = 0
  private saveTime: number = 0
  private maxTime: number = 2 * 60 * 60 * 1000

  get timing() {
    const t = this.saveTime / 1000 / 60
    const h = parseInt(t / 60 + '', 10).toString()
    const m = parseInt((t % 60) + '', 10).toString()
    return [h.padStart(2, '0'), m.padStart(2, '0')]
  }
  get funnelTime() {
    return 100 - (this.saveTime / this.maxTime) * 100
  }
  // private async created() {

  // }
  private async mounted() {
    await this.$nextTick()
    const theSaveTime: any = localStorage.getItem('save_time') || 0
    const stampTime: any = localStorage.getItem('stamp_time') || 0
    const nowTime = new Date().getTime()
    const passageTime = parseInt((nowTime - stampTime) / 1000 + '', 10) * 1000
    if (theSaveTime) {
      const trueTime = theSaveTime - passageTime
      if (trueTime > 0) {
        this.saveTime = trueTime
        this.startRun()
      } else {
        this.saveTime = 1000
        this.stopRun()
      }
    } else {
      const res = await this.$ajax.user.getUser()
      const saveTime = res.hourglass ? res.hourglass - (res.hourglass % 1000) : 0
      this.saveTime = saveTime > this.maxTime ? this.maxTime : saveTime
    }
  }
  private startRun() {
    this.fixedTime = this.saveTime / 1000
    this.fixedFunnelRatio = this.funnelTime + 20
    if (this.run || this.saveTime < 1000) {
      this.stopRun()
      return
    }
    this.stopWatch()
    this.run = !this.run
    setTimeout(() => {
      this.startDrop = true
    }, 400)
    // 记录时间
    localStorage.setItem('save_time', this.saveTime + '')
    localStorage.setItem('stamp_time', new Date().getTime() + '')
  }
  private stopRun() {
    this.run = false
    this.startDrop = false
    clearInterval(this.iCount)
    this.$ajax.user.updateUser({ hourglass: this.saveTime })
    this.$utils.audio.play('endHourglass')
    // 清理时间记录
    localStorage.setItem('save_time', '')
  }
  private stopWatch() {
    this.iCount = setInterval(() => {
      if (this.saveTime <= 1000) {
        this.stopRun()
      }
      this.saveTime -= 1000
    }, 1000)
  }
  private info() {
    Dialog({ message: '当前转换系数 1.8' })
  }
  // @Emit('change')
  // private change(e: MouseEvent) {}
  //   @Watch('style1height', { immediate: true, deep: true })
  //   private onStyle1heightChanged(val: string, oldVal: string) {}
}
</script>
<style scoped lang='less'>
.watch_time {
  width: 100%;
  text-align: center;
  color: #6699cc;
  font-size: 2rem;
  font-family: monospace;
  &-none {
    color: #cccccc;
  }
  .semi {
    font-family: math;
    font-size: 2rem;
    &-flash {
      animation: flashing 1s infinite ease-in-out;
    }
  }
}
@keyframes flashing {
  0% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
/* 配色：#666666  ，#6699CC  ，#CCCCCC */
// infinite
.container {
  position: relative;
  width: 100%;
  transform: scale(0.9);
  height: 420px;
}

.hourglass {
  position: relative;
  width: 100;
  height: 100%;
  -webkit-animation: rotateGlass 0.3s ease-in-out 0s;
  animation: rotateGlass 0.3s ease-in-out 0s;
}
@-webkit-keyframes rotateGlass {
  0%,
  10% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.15));
    filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.15));
  }
  100% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    -webkit-filter: drop-shadow(-2px -4px 8px rgba(0, 0, 0, 0.15));
    filter: drop-shadow(-2px -4px 8px rgba(0, 0, 0, 0.15));
  }
}
@keyframes rotateGlass {
  0%,
  10% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.15));
    filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.15));
  }
  100% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    -webkit-filter: drop-shadow(-2px -4px 8px rgba(0, 0, 0, 0.15));
    filter: drop-shadow(-2px -4px 8px rgba(0, 0, 0, 0.15));
  }
}
.wood {
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  background-color: #666666;
  width: 220px;
  height: 30px;
  border-radius: 5px;
  background-image: linear-gradient(120deg, rgba(255, 255, 255, 0.25), rgba(0, 0, 0, 0.15), rgba(255, 255, 255, 0.25));
  background-size: 200%, 100%;
  //   -webkit-animation: woodGlr 3s infinite linear;
  //   animation: woodGlr 3s infinite linear;
}
.wood:nth-child(1) {
  top: 20px;
}
.wood:nth-child(2) {
  bottom: 20px;
}
@-webkit-keyframes woodGlr {
  0%,
  90% {
    background-position: 0%;
  }
  100% {
    background-position: 100%;
  }
}
@keyframes woodGlr {
  0%,
  90% {
    background-position: 0%;
  }
  100% {
    background-position: 100%;
  }
}
.top {
  position: absolute;
  bottom: 50%;
  left: 50%;
  width: 200px;
  height: 110px;
  border: 2px solid #cccccc;
  border-radius: 20px 20px 200px 200px;
  -webkit-transform: translateX(-50%) scale(1, 1.5);
  transform: translateX(-50%) scale(1, 1.5);
  -webkit-transform-origin: bottom;
  transform-origin: bottom;
  overflow: hidden;
}
.top::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  //   height: 100%;
  background-color: #6699cc;
  -webkit-filter: blur(3px);
  filter: blur(3px);
}
.top_run::before {
  -webkit-animation: sandHeightTop var(--fixedTime) linear 0.4s;
  animation: sandHeightTop var(--fixedTime) linear 0.4s;
}
@-webkit-keyframes sandHeightTop {
  0% {
    height: var(--topHeight);
  }
  90%,
  100% {
    height: 0%;
  }
}
@keyframes sandHeightTop {
  0% {
    height: var(--topHeight);
  }
  90%,
  100% {
    height: 0%;
  }
}
.bottom {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 110px;
  border: 2px solid #cccccc;
  border-radius: 200px 200px 20px 20px;
  -webkit-transform: translateX(-50%) scale(1, 1.5);
  transform: translateX(-50%) scale(1, 1.5);
  -webkit-transform-origin: top;
  transform-origin: top;
  overflow: hidden;
}
.bottom_sand {
  position: absolute;
  //   top: 100%;
  left: 0%;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 3px 1px #6699cc;
  background-color: #6699cc;
  -webkit-transform: scale(3, 1);
  transform: scale(3, 1);
}
.bottom_sand::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 200px;
  height: 200px;
  border-radius: 5px;
  -webkit-transform: translateX(-50%) rotate(45deg);
  transform: translateX(-50%) rotate(45deg);
  -webkit-filter: blur(2px);
  filter: blur(2px);
}
.bottom_sand_run {
  -webkit-animation: sandTop var(--fixedTime) linear;
  animation: sandTop var(--fixedTime) linear;
}
.bottom_sand_run::before {
  background-color: #6699cc;
  -webkit-animation: sandAngle var(--fixedTime) linear;
  animation: sandAngle var(--fixedTime) linear;
}
@-webkit-keyframes sandTop {
  0% {
    top: 135%;
  }
  90%,
  100% {
    // top: var(--funnelRatio);
    top: var(--fixedFunnelRatio);
  }
}
@keyframes sandTop {
  0% {
    top: 135%;
  }
  90%,
  100% {
    top: var(--fixedFunnelRatio);
  }
}
@-webkit-keyframes sandAngle {
  0% {
    border-radius: 5px;
  }
  90%,
  100% {
    border-radius: 50px;
  }
}
@keyframes sandAngle {
  0% {
    border-radius: 5px;
  }
  90%,
  100% {
    border-radius: 50px;
  }
}
.mid,
.mid_empty {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 6px;
  border: solid #cccccc;
  border-width: 0 3px;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transform-origin: center;
  transform-origin: center;
  background-color: #6699cc;
}
.mid::before,
.mid_empty::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #6699cc;
  width: 12px;
  height: 14px;
  border-radius: 50%;
  -webkit-filter: blur(3px);
  filter: blur(3px);
}
.mid_empty {
  background-color: #ffffff;
}
.mid_empty::before {
  background-color: #ffffff;
}

.drop {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #6699cc;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  -webkit-filter: blur(3px);
  filter: blur(3px);
  --dropx: -50%;
  -webkit-animation: sandDrop 0.6s ease-in infinite, dropVis linear infinite;
  animation: sandDrop 0.6s ease-in infinite, dropVis linear infinite;
}
.drop:nth-child(1) {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
  --dropx: -100%;
}
.drop:nth-child(2) {
  -webkit-animation-delay: 0.06s;
  animation-delay: 0.06s;
  --dropx: 30%;
}
.drop:nth-child(3) {
  -webkit-animation-delay: 0.12s;
  animation-delay: 0.12s;
  --dropx: -40%;
}
.drop:nth-child(4) {
  -webkit-animation-delay: 0.18s;
  animation-delay: 0.18s;
  --dropx: 90%;
}
.drop:nth-child(5) {
  -webkit-animation-delay: 0.24s;
  animation-delay: 0.24s;
  --dropx: 20%;
}
.drop:nth-child(6) {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
  --dropx: -50%;
}
.drop:nth-child(7) {
  -webkit-animation-delay: 0.36s;
  animation-delay: 0.36s;
  --dropx: 80%;
}
.drop:nth-child(8) {
  -webkit-animation-delay: 0.42s;
  animation-delay: 0.42s;
  --dropx: 10%;
}
.drop:nth-child(9) {
  -webkit-animation-delay: 0.48s;
  animation-delay: 0.48s;
  --dropx: -60%;
}
.drop:nth-child(10) {
  -webkit-animation-delay: 0.54s;
  animation-delay: 0.54s;
  --dropx: 70%;
}
@-webkit-keyframes sandDrop {
  from {
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  to {
    top: calc(50% + 160px);
    -webkit-transform: translate(var(--dropx), -50%) scale(0.25);
    transform: translate(var(--dropx), -50%) scale(0.25);
  }
}
@keyframes sandDrop {
  from {
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  to {
    top: calc(50% + 160px);
    -webkit-transform: translate(var(--dropx), -50%) scale(0.25);
    transform: translate(var(--dropx), -50%) scale(0.25);
  }
}
@-webkit-keyframes dropVis {
  0% {
    opacity: 0;
  }
  1%,
  100% {
    opacity: 1;
  }
}
@keyframes dropVis {
  0% {
    opacity: 0;
  }
  1%,
  100% {
    opacity: 1;
  }
}
.glare {
  position: absolute;
  -webkit-filter: blur(10px);
  filter: blur(10px);
  // width: 120px;
  // height: 80px;
  width: 7rem;
  height: 1rem;
  border-radius: 50%;
  border-style: solid;
  border-width: 0 0 15px 0;
}
.glare:nth-child(1) {
  // top: 19%;
  // left: 29%;
  top: 28%;
  left: 23%;
  -webkit-transform: rotate(70deg);
  transform: rotate(70deg);
  border-color: rgba(255, 255, 255, 0.85);
  //   -webkit-animation: glrClr1 3s;
  //   animation: glrClr1 3s;
}
.glare:nth-child(2) {
  bottom: 24%;
  left: 22%;
  -webkit-transform: rotate(110deg);
  transform: rotate(110deg);
  border-color: rgba(255, 255, 255, 0.85);
  //   -webkit-animation: glrClr1 3s;
  //   animation: glrClr1 3s;
}
.glare:nth-child(3) {
  top: 27%;
  left: 52%;
  -webkit-transform: rotate(-70deg);
  transform: rotate(-70deg);
  border-color: rgba(0, 0, 0, 0.15);
  //   -webkit-animation: glrClr2 3s;
  //   animation: glrClr2 3s;
}
.glare:nth-child(4) {
  bottom: 26%;
  left: 53%;
  -webkit-transform: rotate(-110deg);
  transform: rotate(-110deg);
  border-color: rgba(0, 0, 0, 0.15);
  //   -webkit-animation: glrClr2 3s;
  //   animation: glrClr2 3s;
}
@-webkit-keyframes glrClr1 {
  0%,
  90% {
    border-color: rgba(255, 255, 255, 0.85);
  }
  100% {
    border-color: rgba(0, 0, 0, 0.15);
  }
}
@keyframes glrClr1 {
  0%,
  90% {
    border-color: rgba(255, 255, 255, 0.85);
  }
  100% {
    border-color: rgba(0, 0, 0, 0.15);
  }
}
@-webkit-keyframes glrClr2 {
  0%,
  90% {
    border-color: rgba(0, 0, 0, 0.15);
  }
  100% {
    border-color: rgba(255, 255, 255, 0.85);
  }
}
@keyframes glrClr2 {
  0%,
  90% {
    border-color: rgba(0, 0, 0, 0.15);
  }
  100% {
    border-color: rgba(255, 255, 255, 0.85);
  }
}
</style>