<!--  -->
<template>
  <router-view v-if="done" />
  <div v-else class="black-07">
    <!-- loading... -->
    <strong>Waiting, we also want it to be faster ... </strong>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import VueBase from '@/vueBase';
import { mapMutations } from 'vuex';
import imgsData from '@/assets/data/imgs';

@Component({
  components: {}
})
export default class Ready extends VueBase {
  private done: boolean = false;

  public get isDay(): boolean {
    const h = new Date().getHours();
    return h > 5 && h < 18 ? true : false;
  }

  private async mounted() {
    await this.$nextTick();

    this.$commit('loading', '拼命加载ing..');

    if (this.isDay) {
      const preload = new this.$utils.preload(imgsData);
      const preDone = await preload.imgs();
    }

    // const myUser = localStorage.getItem('username');
    // const res = await this.$ajax.home.login({
    //   user_name: myUser || 'test',
    //   pass: '12345'
    // });
    // const r = res.token && localStorage.setItem('token', res.token);

    this.done = true;
    this.$commit('loading', false);
  }
}
</script>
<style scoped lang='less'>
</style>