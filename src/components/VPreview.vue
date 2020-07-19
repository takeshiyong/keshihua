/*
* @Author: 元实
* @Date:   2019-12-02
* @Description: 预览弹框
*               参数： showPreview - 是否显示预览弹框
*                      type - 预览的元素的类型: 1 - 图片, 2 - url, 3 - 播放组, 4 - 摄像头, 5 - 摄像头循环组, 6-场景的预览
*                      options - 给要预览的元素传的参数+
*/

<template>
    <transition name="preview" @after-enter="showPreviewScreen">
        <div v-if="isPreviewShown" class="container full-screen">
             <transition 
                     name="screen" 
                     @after-leave="hidePreview" 
                     @after-enter="showButtons"
                     @before-leave="hideButtons">
                <div v-if="isPreviewScreenShown" class="preview-screen">
                    <div ref="buttons" v-if="isButtonsShown" class="button-group">
                        <el-tooltip effect="dark" content="投屏" placement="top">
                            <i class="dvIcon dvIcon-touping push-big-screen button" @click="setForBigScreen" />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="全屏" placement="top">
                            <i class="el-icon-full-screen fullscreen-btn button" @click="showFullScreen" />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="关闭" placement="top">
                            <i class="el-icon-close close-btn button" @click="hidePreviewScreen" />
                        </el-tooltip>
                    </div>

                    <div class="preview-screen-border"></div>

                    <div class="view-container" id="view-container">
                        <div ref="content" class="content">
                            <VResourcePreview v-if="type === 1 || type === 2" :options="options"></VResourcePreview>
                            <VPlayGroupPreview v-show="type === 3" :id="options.id" :shown="type === 3"></VPlayGroupPreview>
                            <div v-if="showCameraVideo" style="width: 100%;height: 100%;">
                                <JudgeVideo v-if="type === 4" :id="options.id" :cameraType="options.cameraType" :show="options.show?options.show: false"/>
                            </div>
                            <VScenePreview v-if="type === 6 && isScenePreviewShown" @currentScreenId="screenId" :id="options.id"/>
                        </div>
                    </div>
                </div>
             </transition>

            <VSetBigScreenDialog
                    :shown="isBigScreenDialogShown"
                    :type="type"
                    :isTemporal="true"
                    :options="bigScreenOptions"
                    @close="closeBigScreenDialog"></VSetBigScreenDialog>
        </div>
    </transition>
</template>

<script>
    import Vue from 'vue';
    import JudgeVideo from './videoComponet/judgeVideo';
    import VResourcePreview from './previewComponents/VResourcePreview.vue';
    import VPlayGroupPreview from './previewComponents/VPlayGroupPreview.vue';
    import VScenePreview from './previewComponents/VScenePreview';
    import VSetBigScreenDialog from './VSetBigScreenDialog';

    export default {
        props: {
            showPreview: {  //是否显示预览弹框
                type: Boolean,
                default: false
            },

            type: {   //预览的元素的类型: 1 - 图片, 2 - url, 3 - 播放组, 4 - 摄像头, 5 - 摄像头循环组, 6-场景的预览
                type: Number,
                required: true
            },

            options: { //给要预览的元素传的参数
                type: Object,
                required: true
            }
        },

        components: {
            VPlayGroupPreview,
            VResourcePreview,
            VScenePreview,
            VSetBigScreenDialog,
            JudgeVideo
        },
    
        data() {
            return {
                isPreviewShown: false, //是否显示预览弹框背景
                isPreviewScreenShown: false, //是否显示预览弹框
                isButtonsShown: false, //是否显示按钮
                isCloseButtonShown: false, //是否显示开关按钮
                isFullScrButtonShown: false, //是否显示全屏幕按钮
                isScenePreviewShown: false,  //是否显示预览场景
                isBigScreenDialogShown: false, //是否显示投放大屏弹框
                showCameraVideo: false,    //// 控制监控画面的显示
            };
        },

        watch: {
            showPreview() {
                if (this.showPreview) {
                    this.isPreviewShown = true;
                    this.isScenePreviewShown = true;
                }else{
                    this.showCameraVideo = false;
                }
            },

        },

        computed: {
            /**
             * 投放大屏的参数
             */
            bigScreenOptions() {
                let options = {};

                options.id = this.options.id;
                options.name = this.options.name;

                if(this.type == 4|| this.type == 5){
                    setTimeout(()=>{
                        this.showCameraVideo = true;
                    }, 2000)
                }
                switch(this.type) {
                    case 1 : options.resourceType = this.options.type; break;
                    case 3 : options.cameraType = this.options.cameraType; break;
                }
                return options;
            },
            
            
        },

        methods: {
            screenId(title){
            },
            /**
             * 显示预览资源的弹框
             */
            showPreviewScreen() {
                this.isPreviewScreenShown = true;
                
            },

            /**
             * 关闭预览资源的弹框
             */
            hidePreviewScreen() {
                this.isScenePreviewShown = false;
                setTimeout(() => {
                    this.hideButtons();
                    this.isPreviewScreenShown = false;
                    this.$emit('close');
                }, 4);
            },

            /**
             * 关闭预览资源的弹框和背景
             */
            hidePreview() {
                this.isPreviewShown = false;
            },

            /**
             * 显示按钮
             */
            showButtons() {
                this.isButtonsShown = true;
            },

            /**
             * 隐藏按钮
             */
            hideButtons() {
                this.$refs.buttons.style.display = 'none';
                this.isButtonsShown = false;
            },

            /**
             * 全屏幕状态
             */
            showFullScreen() {
                const content = this.$refs.content;
                const fullScreen = content.requestFullScreen ||
                    content.webkitRequestFullScreen ||
                    content.mozRequestFullScreen ||
                    content.msRequestFullscreen;

                fullScreen.call(content);
            },

            /**
             * 投放大屏
             */
            setForBigScreen() {
                this.isBigScreenDialogShown= true;
            },

            /**
             * 关闭投放大屏弹框
             */
            closeBigScreenDialog() {
                this.isBigScreenDialogShown = false;
            }
        },
    }
</script>

<style lang="scss" scoped>
    .full-width {
        width: 100%;
        height: 100%;
    }

    .preview-enter-active, .preview-leave-active {
        transition: opacity .8s;
    }

    .preview-enter, .preview-leave-to {
        opacity: 0;
    }

    .screen-enter-active {
        animation: open .8s;
    }

    .screen-leave-active {
        animation: open .8s reverse;
    }

    @keyframes open {
        0% {
            height: 0;
            width: 10px;
            padding: 0;
        }

        50% {
            width: 10px;
            height: 740px;
            padding: 40px 0 165px 0;
        }

        100% {
            width: 1110px;
            padding: 40px 40px 165px 40px;
        }
    }

    .screen-enter, .screen-leave-to {
        height: 0px;
        width: 0px;
    }

    .container {
        &.full-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            /*min-width: 1200px;
            min-height: 600px;*/
            background: rgba(0, 0, 0, 0.7);
            z-index: 999;
        }

        .preview-screen {
            position: absolute;
            top: 50%;
            left: 50%;
            /*width: 1110px;
            height: 740px;*/
            width: 145vh;
            height: 90vh;
            /*min-width: 1000px;
            min-height: 500px;*/
            transform: translate(-50%, -50%);
            padding: 5vh 5vh 20vh 5vh;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .button-group {
                position: absolute;
                top: 7px;
                right: 25px;
                z-index: 1000;
            }

            .button {
                display: inline-block;
                height: 4vh;
                width: 4vh;
                color: rgba(225, 225,225, 0.6);
                font-size: 2.8vh;
                cursor: pointer;
                vertical-align: middle;
                
                &.push-big-screen {
                    padding-right: 3px;
                }
            }

            .preview-screen-border {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('./../image/screen/screen.png') no-repeat;
                -webkit-background-size: 100% 100%;
                background-size: 100% 100%;
                z-index: -1;
            }

            .view-container {
                width: 100%;
                height: 100%;
                background: #000;

                .content {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>