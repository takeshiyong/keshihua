<template>
    <div class="screen">
        <span @click="updateIsShow" style="color: #fff">{{isShow?'true':'false'}}</span>
    </div>
</template>
<script>
import moment from 'moment';
  export default {
      name: 'preview',
      components: {},
      data() {
        return {

        }
      },
      props: ['isShow'],
      mounted() {
      },
      methods: {
        updateIsShow() {
            this.$emit('update:isShow', !this.isShow);
        }
      }
  }
</script>

<style lang="scss">

</style>
<style lang="scss" scoped>
    .screen {
        width: 100vw;
        height: 100vh;
        background: #000;
    }
</style>
