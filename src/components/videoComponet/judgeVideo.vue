/*
* @Author: 屈云峰
* @Date:   2019-11-19
* @Description: 判断摄像头预览应该用哪一种预览插件，并根据类型获取不同数据的详细信息
*/

<template>
    <div style="width: 100%;height: 100%">
        <singlePlayVideo v-if="cameraType == 1" playType="rtmp" :channel="singleInfo.fChannel" :ptaControl="show?singleInfo.fPtzControl:false"></singlePlayVideo>
        <div v-if="playVideo && cameraType == 2 && ((!multInfo.fIsCycle && !multInfo.fCurrentShowVido) || (multInfo.fIsCycle && multInfo.fChannels.length <= 0))" class="no-channel">
            <div>
                <span>未设置摄像头</span>
            </div>
        </div>
        <multPlayVideo v-else-if="playVideo && cameraType == 2 && multInfo.fChannels.length > 0 && multInfo.fIsCycle" :channels="multInfo.fChannels" :cycTime="multInfo.fCycleTime" style="width: 100%;height: 100%;overflow: hidden;display: flex;align-items: center"
></multPlayVideo>
        <singlePlayVideo v-else-if="playVideo && cameraType == 2 && multInfo.fCurrentShowVido && !multInfo.fIsCycle" :channel="multInfo.fCurrentShowVidoChanel" :cycTime="multInfo.fCycleTime"></singlePlayVideo>
    </div>
</template>

<script>
import singlePlayVideo from './singlePlayVideo';
import multPlayVideo from './multPlayVideo';
import { CameraInfoService } from '@/api/camera';
import { LoopCameraService } from '@/api/loopCamera';
    import Vue from 'vue';
    export default {
        data() {
            return {
                singleInfo: { // 单个摄像头对象
                    fChannel: '', // 通道号
                    fPtzControl: false, // 是否可控制
                },
                multInfo: { // 多个摄像头对象
                    fCycleTime: '', // 循环时间
                    fChannels: [], // 循环组中摄像头的通道号集合
                    fIsCycle: true, // 是否循环
                    fCurrentShowVido: '', // 当前固定显示摄像头Id
                    fCurrentShowVidoChanel: '', // 当前固定显示摄像头通道号
                },
                playVideo: false, // 播放视频
            };
        },
        props: {
            cameraType: { // 判断是哪一类摄像头相关 1.单摄像头 2.循环摄像头
                type: [String, Number]
            },
            id: {  // 如果是单个摄像头直接是通道号 循环摄像头则是循环组id
                type: [String, Number]
            },
            show: {
                type: [Boolean]
            }
        },
        watch: {
            'cameraType':function (newVal,oldVal) {
                    this.judgeCameraType();
            },
            'id':function (newVal,oldVal) {
                    this.judgeCameraType();
            },
            
        },
        components: {
            singlePlayVideo, 
            multPlayVideo
        },

        mounted() {
            this.judgeCameraType();
        },

        methods: {
           
            /**
             * 判断该摄像头类型
             */
            judgeCameraType() {
                switch(this.cameraType) {
                    case 1:
                        this.getSingleCameraInfo()
                        break;
                    case 2:
                        this.getMultCameraInfo()
                        break;
                    default: 
                        return;
                }
            },
            /**
             * 单个摄像头通过通道号获取当前摄像头相关数据
             */
            async getSingleCameraInfo() {
                const res = await CameraInfoService.viewCameraByChannelId(this.id);
                // console.log('单个摄像头通过通道号获取当前摄像头相关数据', res);
                this.playVideo = true;
                if (res.success) {  
                    this.singleInfo = res.obj;
                } else {
                    this.$message.error(res.msg);
                }
            },
            /**
             * 摄像头循环组通过循环组id获取循环组对象数据
             */
            async getMultCameraInfo() {
                const res = await LoopCameraService.viewCamerasByResourceId(this.id);
                // console.log('摄像头循环组通过循环组id获取循环组对象数据', res);
                this.playVideo = true;
                if (res.success) {
                    let currentShowVidoChannel = '';
                    let fCurrentShowVido = "";
                    if (res.obj.tVideoResourceInfo.fCurrentShowVido) {
                        fCurrentShowVido = res.obj.tVideoResourceInfo.fCurrentShowVido;
                        for (let item of res.obj.cycleVideoInfoDTOList) {

                            if (item.fVideoId == res.obj.tVideoResourceInfo.fCurrentShowVido) {
                                currentShowVidoChannel = item.fChannel;
                               
                                break;
                            }
                        }
                    }else{
                        if(res.obj.cycleVideoInfoDTOList[0]){
                            currentShowVidoChannel = res.obj.cycleVideoInfoDTOList[0].fChannel;
                            fCurrentShowVido = res.obj.cycleVideoInfoDTOList[0].fVideoId;
                        }
                    }

                    let fIsCycle = res.obj.tVideoResourceInfo.fIsCycle;
                    this.multInfo = {
                        fCycleTime: res.obj.tVideoResourceInfo.fCycleTime, // 循环时间
                        fIsCycle: fIsCycle, // 是否循环
                        fCurrentShowVido: fCurrentShowVido, // 当前固定显示摄像头Id
                        fCurrentShowVidoChanel: currentShowVidoChannel, // 当前固定显示摄像头通道号
                        fChannels: res.obj.cycleVideoInfoDTOList.map(data=>data.fChannel),    
                    }
                } else {
                    this.$message.error(res.msg);
                }       
            }
        },
        
        
    }
</script>

<style lang="scss" scoped>
    .no-channel {
        width: 100%;
        height: 100%;
        display: flex;
        div {
            width: 100%;
            height: 100%;
            background-color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            span {
                color: #fff;
                font-size: 14px;
            }
        }
    }
</style>