<!--  -->
<template>
  <!-- <div class=''> -->
  <router-view></router-view>
  <!-- </div> -->
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import VueBase from '@/vueBase';
@Component({
  components: {}
})
export default class AppMain extends VueBase {
  public get online(): Type.Object {
    return this.$getters.online;
  }
  private async mounted() {
    await this.$nextTick();
    console.log('welcome!');
  }
  // 监听登录状态
  @Watch('online', { immediate: true, deep: true })
  private onOnlineStatusChanged(val: string) {
    if (!val) {
      setTimeout(() => {
        this.$router.push('/login');
      }, 300);
    }
  }
}
</script>
<style scoped lang='less'>
</style>