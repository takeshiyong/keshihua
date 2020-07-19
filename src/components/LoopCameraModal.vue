<template>
    <div class="fullpage-div" ref="fullpage">
        <div ref="loopBorder" class="loopContainer-border">
        <div ref="loopContainer" class="loopContainer-v">
            <div class="allItem">

            </div>
            <div class="selectItem">

            </div>
            <div ref="closeBtn" class="close-div hidden" @click="closePlayVideo()">
                <i class="el-icon-close" style="color: rgba(225, 225,225, 0.6);font-size: 20px;"/>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
  export default {
    data(){ 
      return {
        tip: '',
        modal: false,
        fn: null,
        type: 'info', // warning info
        playUrl: ''
      }
    },
    mounted() {
        setTimeout(()=>{
            // this.showVideo('123');
        }, 500);
    },
    methods: {
      showVideo(url) {
        this.$refs.fullpage.className = "fullpage-div fullpage-div-show";
        setTimeout(()=>{
          this.$refs.loopBorder.className = "loopContainer-border loopContainer-border-height";
          this.$refs.loopContainer.className = "loopContainer-v loopContainer-v-height";
          setTimeout(()=>{
            this.$refs.loopBorder.className = "loopContainer-border loopContainer-border-height loopContainer-border-width";
            this.$refs.loopContainer.className = "loopContainer-v loopContainer-v-height loopContainer-v-width";
            this.$refs.closeBtn.className = "close-div";
          }, 500)
        },500)
        
      },
      closePlayVideo() {
        this.$refs.loopBorder.className = "loopContainer-border loopContainer-border-height-noborder contain-close-anmiate";
        this.$refs.loopContainer.className = "loopContainer-v loopContainer-v-height";
        this.$refs.closeBtn.className = "close-div hidden";
        setTimeout(()=>{
            this.$refs.loopBorder.className = "loopContainer-border";
            this.$refs.loopContainer.className = "loopContainer-v ";
            setTimeout(()=>{
              this.$refs.fullpage.className = "fullpage-div";
            }, 500)
        }, 500)
      },
      showBoxMsg(msg, type = 'info', fn, success) {
        this.modal = true;
        this.fn = fn;
        this.tip = msg;
        this.successfn = success;
        this.type = type;
      },
      closeModal() {
        this.modal = false;
        this.fn && this.fn();
      },
      sureModal() {
        this.modal = false;
        this.successfn && this.successfn();
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
    
    .loopContainer-v {
        width: 0;
        height: 0;
        background: #303640;
        
        background-size: 50% 50%;
        background-repeat: no-repeat;
        border: 0;
        position: absolute;
        // border: 1px solid #409EFF;
        top: 51%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.5s;
        display: flex;
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
    .loopContainer-border-height {
        border: 1px solid #2483ff;
        height: 560px!important;
        animation: borderClose 0.5s;
    }
    .loopContainer-border-height-noborder {
        border: 0px solid #2483ff!important;
        height: 560px!important;
    }
    .loopContainer-border-width {
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
    
    .loopContainer-border {
      width: 0;
      height: 0;
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      background-image: url('../image/index/camera-bg.png');
      background-size: 100% 100%;
      border: 1px solid #2483ff;
      transition: all 0.5s;
    }
    .loopContainer-v-width {
      width: 960px!important;
      background: linear-gradient(135deg, transparent 5px, #303640 0) top left, 
                    linear-gradient(-135deg, transparent 5px, #303640 0) top right, 
                    linear-gradient(-45deg, transparent 5px, #303640 0) bottom right, 
                    linear-gradient(45deg, transparent 5px, #303640 0) bottom left!important;
    }
    .loopContainer-v-height {
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
<style scoped lang="scss">
    .allItem {
        flex: 1;
        height: 100%;
    }
    .selectItem {
        flex: 1;
        height: 100%;
        border-left: 1px solid red;
    }
  .tips-error {
    display: block;
    padding-top: 10px;
    font-size: 14px;
    width: 80%;
    text-align: center;
    margin: auto;
  }
  .modal-style {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.35);
    overflow: hidden;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1111;
    display: flex;
    justify-content: center;
    align-items: center;
    .addModals {
      position: relative;
      min-width: 420px;
      max-width: 80%;
      background: #303640;
      color: #fff;
      padding: 16px 0 0 0;
      z-index: 1;
      text-align: center;
      cursor: default;
        .close-button {
          cursor: pointer;
          width: 16px;
          height: 16px;
          font-size: 0;
          position: absolute;
          top: 10px;
          right: 10px;
          .close-btn {
            transition: transform 0.5s;
          }
        }
        .close-button:hover {
          color: #fff!important;
          .close-btn {
            transform:rotate(90deg);
            -ms-transform:rotate(90deg); 	/* IE 9 */
            -moz-transform:rotate(90deg); 	/* Firefox */
            -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
            -o-transform:rotate(90deg); 	/* Opera */
          }
        }
    }
    .addModals::before {
          content: '';
          position: absolute;
          display: block;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 2px;
          background-image: linear-gradient(270deg,#00deff 0,#2483ff 74%);
    }
  }
  .datav-footers {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #3A4659;
    padding: 0 16px;
    box-sizing: border-box;
    align-items: center;
    height:55px;
    .el-button {
      width: 88px;
    }
    .cancel {
      background: transparent;
      color: #409EFF;
      border: 1px solid #409EFF;
      transition: all 0.5s;
    }
    .cancel:hover {
      background: #409EFF;
      color: #fff;
    }
  }
</style>
