<!--  -->
<template>
  <div 
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    style="bigBox"
    >
    <button ref="BUTTON1" @click="changeChannelId('left')" type="button" class="el-carousel__arrow el-carousel__arrow--left"><i class="el-icon-arrow-left"></i></button>
    <button ref="BUTTON2" @click="changeChannelId('right')" type="button" class="el-carousel__arrow el-carousel__arrow--right"><i class="el-icon-arrow-right"></i></button>
    <playVideo :channelId="channelId0" :tem="'1'" :isBig="isBig"></playVideo>
  
  </div>
</template>

<script>
import playVideo from './playVideo';
export default {
  data () {
    return {
      heartbeat: null,
      index: 0,
      cycInterval: null,
      channelId0: '',
    };
  },
  components: {
    playVideo
  },
  props: {
    isBig: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Array
    },
    cycTime: {
      type: Number
    },
    type: {
      type: String,
      default: 'big'
    },
  },
  components: {
    playVideo
  },
  computed: {},
  mounted() {
    this.channelId0 = this.channels[0]; // 开始设置第一个channel
    this.setInitCycInterval();
  },
  destroyed() {
    // this.removeHeartbeat();
    this.closeCyc();
  },
  methods: {
    closeCyc() {
      if (this.cycInterval) {
        clearInterval(this.cycInterval);
      }
    },
    // 设置循环计时器
    setInitCycInterval() {
      this.closeCyc();
      this.cycInterval = setInterval(()=>{
        // 计算真实显示通道号下标
        this.index++;
        let index = this.index % this.channels.length;
        this.setUrl(this.channels[index]);
      }, this.cycTime * 1000);
    },
    // 设置url
    setUrl(channel, flag) {
      this.channelId0 = channel;
    },   
    //鼠标进入
    mouseenter(){
      this.closeCyc();
      this.$refs.BUTTON1.style.display = "block";
      this.$refs.BUTTON2.style.display = "block";
    },
    //鼠标离开
    mouseleave(){
      this.setInitCycInterval()
      this.$refs.BUTTON1.style.display = "none";
      this.$refs.BUTTON2.style.display = "none";
    },
    //改变通道号
    changeChannelId(type){
      if(type == "left"){
        if(this.index > this.channels.length){
          this.index = 0;
        }
        this.index++;
        let index = this.index % this.channels.length;
        this.setUrl(this.channels[index]);
      }else{
        if(this.index == 0){
          this.index = this.channels.length;
        }
        this.index--;
        let index = this.index % this.channels.length;
        this.setUrl(this.channels[index]);
      }
    }
  }
}
</script>
<style scoped>
.bigbox{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow:hidden;
  position:relative;
}
.el-carousel__arrow{
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  height: 36px;
  width: 36px;
  cursor: pointer;
  transition: .3s;
  border-radius: 50%;
  background-color: rgba(31,45,61);
  color: #fff;
  top: 50%;
  z-index: 10;
  transform: translateY(-50%);
  text-align: center;
  font-size: 12px;
  display: none;
}
.el-carousel__arrow--left{
  left: 30px;
}
.el-carousel__arrow--right{
  right: 30px;
}
</style>
