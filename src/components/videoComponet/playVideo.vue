<template>
    <video
      id="new"
      class="video-js
            vjs-default-skin
            vjs-big-play-centered"
      >
    </video>
</template>

<script>
    /*  下载的包
        "video.js": "^6.6.0",
        "videojs-flash": "^2.2.0"
        "videojs-swf": "^5.4.2",
        vue-video-player
    */
    import videojs from 'video.js'
    import 'video.js/dist/video-js.css'
    import 'vue-video-player/src/custom-theme.css'
    import 'videojs-flash'
    import SWF_URL from 'videojs-swf/dist/video-js.swf'
    import { channelService } from '@/api/camera';
    import config from '@/common/basic-configuration';
    videojs.options.flash.swf = SWF_URL // 设置flash路径，Video.js会在不支持html5的浏览中使用flash播放视频文件

    export default {
        name: 'videojsTest',
        data () {
            return {
                player1: null,
                VideoOptions: {
                    autoplay: true, // 是否自动播放
                    muted: true, // 是否静音
                    controls: false,
                    techOrder: ["flash"],
                    sources: [{
                        src: 'rtmp://10.101.234.39:10935/hls/stream_32',
                        type: 'rtmp'
                    }],
                },
                fchannel: '',
                loadNum: 0
            }
        },
        props: {
            channelId: {
                type: [String, Number]
            },
            tem: {
                type: String
            },
            isBig: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            'channelId':function(newVal, oldVal) {
                if (newVal || newVal == 0) {
                    this.fchannel = newVal;
                    this.loadNum = 0;
                    this.iniVideo();
                }
            },
        },
        mounted(){
          if (!this.channelId) return;
          this.fchannel = this.channelId;
          this.iniVideo();
        },
        beforeDestroy() {
            if (this.player1) {
                this.player1.dispose()
            }
        },
        methods: {
            resizeRatio() {
                setTimeout(()=>{
                    let parentNode = document.getElementById('new').parentNode.parentNode;
                    let currentNode = document.getElementById('new');
                    if (this.isBig) {
                        let mutH = parentNode.offsetHeight/currentNode.offsetHeight;
                        let mutW = 1*1.45;
                        currentNode.style.transform = `scale(${mutW}, ${mutH})`;
                    } else {
                       
                        let mut = parentNode.offsetHeight/currentNode.offsetHeight;
                        currentNode.style.transform = `scale(1, ${mut})`;
                        
                    }
                }, 200);
            },
          async iniVideo() {
            let url = `rtmp://${config.RTMP_URL}:10935/hls/stream_` + this.fchannel;
            this.setVideoPlay(url);
            const res = await channelService.initVideo(this.fchannel);
            if (res.success) {
            } else {
                if (this.loadNum == 10) {
                    return;
                }
                setTimeout(()=>{
                    this.loadNum = this.loadNum + 1;
                    this.iniVideo();
                }, 1000);
            }
          },
          setVideoPlay(rtmpSrc) {
              let _this = this;
              if (this.player1) {
                  this.player1.src(rtmpSrc);
                  this.player1.load(rtmpSrc);
                  this.player1.player();
                  return;
              }
              this.player1 = videojs(
                  document.getElementById('new'),
                {...this.VideoOptions,
                    fluid: true,
                    sources: [{
                        src: rtmpSrc,
                        type: 'rtmp/flv',
                    }]}
               ,function onPlayerReady() {
                  this.play();
                  this.playsinline(true);
                  this.on('play', function() {
                    //   _this.$nextTick(()=>{
                        _this.resizeRatio();
                    //   })
                  })
                  
              });
          }
        }
    }
</script>
<style>
video {
    object-fit:fill;
    width:800px;
    height:320px;
}
</style>
