<!--  -->
<template>
  <div>
    <van-popup v-model="popupShow" position="bottom" :style="{ height: '35%' }">
      <van-panel>
        <div style="padding:.7rem 1rem;" slot="header">
          <van-button @click="confirm" class="fl-right" type="info" size="small">确定</van-button>
        </div>
        <div class="fl-clear"></div>
        <div>
          <van-field v-model="text" placeholder="点击输入" type="textarea" autosize />
        </div>
      </van-panel>
    </van-popup>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import VueBase from '@/vueBase';
import BloomingMenu from 'blooming-menu';
import { Panel } from 'vant';
@Component({
  components: {
    [Panel.name]: Panel
  }
})
export default class NoteMenu extends VueBase {
  private menu!: Type.Object;
  private popupShow: boolean = false;
  private text: string = '';
  private async mounted() {
    await this.$nextTick();
    this.menu = new BloomingMenu({
      startAngle: 270,
      endAngle: 180,
      radius: 100,
      itemsNum: 3,
      itemAnimationDelay: 0.08
    });
    this.menu.render();
    const btns = this.menu.props.elements.items;
    const fns: Type.Object = {
      0: 'add',
      1: '',
      2: 'exit'
    };
    btns.forEach((btn: Type.Object, index: number) => {
      btn.addEventListener('click', () => {
        this.operation(fns[index]);
      });
    });
  }
  private operation(fn: string) {
    switch (fn) {
      case 'exit':
        this.$router.replace('/');
        break;
      case 'add':
        setTimeout(() => {
          this.popupShow = true;
        }, 100);
        break;
      default:
        break;
    }
  }
  private confirm() {
    if (this.text) {
      this.$emit('add', this.text);
    }
    this.popupShow = false;
    this.text = '';
  }
  private beforeDestroy() {
    this.menu.remove();
  }
}
</script>
<style lang='css'>
body .blooming-menu__container {
  left: auto;
  top: auto;
  right: 0;
  bottom: 0;
  position: fixed;
}
body .blooming-menu__main {
  background-color: #1989fa;
}
body .blooming-menu__main-content {
  font-size: 38px;
}
body .blooming-menu__item-btn-wrapper {
  background-color: rgba(25, 137, 250, 0.76);
}
.blooming-menu__item:nth-of-type(1) .blooming-menu__item-btn {
  background-image: url(icon/bianxie.svg);
  background-size: 65%;
}

.blooming-menu__item:nth-of-type(2) .blooming-menu__item-btn {
  background-image: url(icon/all.svg);
  background-size: 55%;
}

.blooming-menu__item:nth-of-type(3) .blooming-menu__item-btn {
  background-image: url(icon/fanhui.svg);
}

.blooming-menu__item-btn:hover {
  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2);
  opacity: 1;
}
</style>