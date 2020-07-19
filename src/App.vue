<template>
  <div id="app" class="app">
    <router-view/>
    <VMessageBox></VMessageBox>
    <VMessage></VMessage>
    <!--<VPreview></VPreview>-->
    <VCmameraPreview></VCmameraPreview>
    <div class="fullpage-div" ref="fullpage">
      <div ref="containerBorder" class="container-border">
        <div ref="container" class="container-v">
          <div ref="closeBtn" class="close-div hidden" @click="closePlayVideo()">
            <i class="el-icon-close" style="color: rgba(225, 225,225, 0.6);font-size: 20px;"/>
          </div>
        </div>
      </div>
      <!-- <div class="modal-left" ref="left"></div>
      <div class="modal-right" ref="right"></div> -->
    </div>
    <LoopCameraModal/>
  </div>
</template>

<script>
import Vue from 'vue'
import LoopCameraModal from './components/LoopCameraModal';
import VMessageBox from './components/VMessageBox';
import VMessage from './components/VMessage';
import VPreview from './components/VPreview';
import VCmameraPreview from './components/VCameraPreview';
  export default {
    data(){ 
      return {
        /*tip: '',
        modal: false,
        fn: null,
        type: 'info', // warning info*/
        playUrl: ''
      }
    },
    components: {
      VMessageBox,
      VMessage,
      VPreview,
      LoopCameraModal,
      VCmameraPreview
    },
    mounted() {
      Vue.prototype.$showVideo = this.showVideo;
      setTimeout(()=>{
        // this.showFullpage();
      }, 2000);
    },
    methods: {
      showVideo(url) {
        this.$refs.fullpage.className = "fullpage-div fullpage-div-show";
        setTimeout(()=>{
          this.$refs.containerBorder.className = "container-border container-border-height";
          this.$refs.container.className = "container-v container-v-height";
          setTimeout(()=>{
            this.$refs.containerBorder.className = "container-border container-border-height container-border-width";
            this.$refs.container.className = "container-v container-v-height container-v-width";
            this.$refs.closeBtn.className = "close-div";
          }, 500)
        },500)
      },
      closePlayVideo() {
        this.$refs.containerBorder.className = "container-border container-border-height-noborder contain-close-anmiate";
        this.$refs.container.className = "container-v container-v-height";
        this.$refs.closeBtn.className = "close-div hidden";
        setTimeout(()=>{
            this.$refs.containerBorder.className = "container-border";
            this.$refs.container.className = "container-v ";
            setTimeout(()=>{
              this.$refs.fullpage.className = "fullpage-div";
            }, 500)
        }, 500)
      }
    },
  }
</script>

<style lang="scss">
  .hidden {
      display: none!important;
  }
  .fullpage-div {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0);
    z-index: -1;
    transition: all .5s;
    
    .container-v {
        width: 0;
        height: 0;
        // background-image: url('./image/index/camera-bg.png');
        background: #000;
        background: linear-gradient(135deg, transparent 5px, #000 0) top left, 
                    linear-gradient(-135deg, transparent 5px, #000 0) top right, 
                    linear-gradient(-45deg, transparent 5px, #000 0) bottom right, 
                    linear-gradient(45deg, transparent 5px, #000 0) bottom left;
        background-size: 50% 50%;
        background-repeat: no-repeat;
        border: 0;
        position: absolute;
        // border: 1px solid #409EFF;
        top: 51%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.5s;
    }
    .close-div {
      position: absolute;
      top: 0px; 
      right: 0px;
      height: 36px;
      width: 36px;
      background: rgba(0, 0, 0, 0.8);
      background: linear-gradient(135deg, transparent 0, rgba(0, 0, 0, 0.8) 0) top left, 
                  linear-gradient(-135deg, transparent 5px, rgba(0, 0, 0, 0.8) 0) top right, 
                  linear-gradient(-45deg, transparent 0, rgba(0, 0, 0, 0.8) 0) bottom right, 
                  linear-gradient(45deg, transparent 0, rgba(0, 0, 0, 0.8) 0) bottom left;
      background-size: 50% 50%;
      background-repeat: no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .container-border-height {
        border: 1px solid #2483ff;
        height: 560px!important;
        animation: borderClose 0.5s;
    }
    .container-border-height-noborder {
        border: 0px solid #2483ff!important;
        height: 560px!important;
    }
    .container-border-width {
        border: 0px solid #2483ff!important;
        width: 970px!important;
        animation: borderS 0.5s;
    }
    @keyframes borderClose {
      0%   {border:0;}
      25%  {border:1px solid #2483ff;}
      100% {border:1px solid #2483ff;}
    }
    @-webkit-keyframes borderClose {
      0%   {border:0;}
      25%  {border:1px solid #2483ff;}
      100% {border:1px solid #2483ff;}
    }
    @keyframes borderS {
      25%  {border:0;}
      100% {border:0;}
    }
    @-webkit-keyframes borderS {
      25%  {border:0;}
      100% {border:0;}
    }
    
    .container-border {
      width: 0;
      height: 0;
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      background-image: url('./image/index/camera-bg.png');
      background-size: 100% 100%;
      border: 1px solid #2483ff;
      transition: all 0.5s;
    }
    .container-v-width {
      width: 960px!important;
    }
    .container-v-height {
      height: 540px!important;
    }
    .modal-right-remove {
      right: -50%;
    }
  }
  .fullpage-div-show {
    background: rgba(0,0,0,0.6);
    z-index: 999;
  }
  .app{
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>