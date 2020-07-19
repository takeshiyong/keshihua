/*
* @Author: 屈云峰
* @Date:   2019-11-19
* @Description: 预览资源、播放组等的弹框*
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
                        <div class="close-btn-frame" @click="hidePreviewScreen">
                            <i class="el-icon-close" />
                        </div>
                    </div>
                    <div class="preview-screen-border"></div>
                    <div class="view-container">
                        <div v-if="showCameraVideo" ref="content" class="content">
                            <JudgeVideo :id="resource.id" :cameraType="resource.cameraType"/>
                            <!-- <iframe v-if="resourceType === 2" :src="url" frameborder="0" class="full-width"></iframe>
                            <div v-else class="image full-width" :style="imageStyle"></div> -->
                        </div>
                    </div>
                </div>
             </transition>
        </div>
    </transition>
</template>

<script>
    import JudgeVideo from './videoComponet/judgeVideo';
    import Vue from 'vue';
    export default {
        data() {
            return {
                isPreviewShown: false, //是否显示预览弹框背景
                isPreviewScreenShown: false, //是否显示预览弹框
                isButtonsShown: false, //是否显示按钮
                isCloseButtonShown: false, //是否显示开关按钮
                isFullScrButtonShown: false, //是否显示全屏幕按钮

                resourceType: 1, //资源类型: 1 - 图片, 2 - url
                coverType: 1, //铺满方式
                imageStyle: { //预览图片样式
                    backgroundColor: '#000',
                    backgroundImage: '',
                    backgroundSize: '',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                },
                resource: { // 接收到的摄像头相关资源数据
                    id: '',
                    cameraType: '1'
                },
                showCameraVideo: false, // 控制监控画面的显示
            };
        },
        components: {
            JudgeVideo,
        },
        mounted() {
            Vue.prototype.$cameraPreview = this.showCameraPreview;
        },

        methods: {
            /**
             * 显示摄像头资源内容
             * @param {id: '', cameraType: ''} resource --- id 若单个摄像头则是摄像头通道号，若是循环组则是循环组id
             * cameraType 1.单摄像头 2.循环摄像头
             */
            showCameraPreview(resource) {
                this.resource = resource;
                this.isPreviewShown = true;
                // this.resourceType = resourceType;
                // this.url = url;
                
                // 因为动画原因需要延迟1.5s打开摄像头监控画面
                setTimeout(()=>{
                    this.showCameraVideo = true;
                }, 2000)
            },

            /**
             * 清理背景
             */
            clearBackgroundStyle() {
                let style = this.imageStyle;

                style.backgroundImage = '';
                style.backgroundSize = '';
            },

            /**
             * 设置预览图片的样式
             * @param {string} url --- 图片url
             * @param {number} coverType --- 铺满方式
             */
            setBackgroundStyle(url, coverType) {
                let style = this.imageStyle;

                if (url) {
                    style.backgroundImage = `url(${this.url})`;
                } else {
                    style.backgroundImage = '';
                }
                switch (coverType) {
                    case 1:
                        style.backgroundSize = '100% 100%';
                        break;

                    case 2:
                        style.backgroundSize = 'contain';
                        break;
                }
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
                // 优先关闭摄像头监控画面
                this.showCameraVideo = false;
                setTimeout(() => {
                    this.hideButtons();
                    this.isPreviewScreenShown = false;
                }, 4);
            },

            /**
             * 关闭预览资源的弹框和背景
             */
            hidePreview() {
                this.isPreviewShown = false;
                this.showCameraVideo = false;
            },

            /**
             * 显示按钮
             */
            showButtons() {
                this.isButtonsShown = true;
                /*this.isCloseButtonShown = true;
                this.isFullScrButtonShown = true;*/
            },

            /**
             * 隐藏按钮
             */
            hideButtons() {
                /*this.$refs.closeButton.style.display = 'none';
                this.$refs.fullScreenButton.style.display = 'none';*/
                this.$refs.buttons.style.display = 'none';
                this.isButtonsShown = false;
                /*this.isCloseButtonShown = false;
                this.isFullScrButtonShown = false;*/
            },
        }
    }
</script>

<style lang="scss" scoped>
    .close-btn-frame {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,0.7);
        cursor: pointer;
        i {
            font-size: 16px;
            color: #D5D5D5;
        }
    }
    .full-width {
        width: 100%;
        height: 100%;
    }

    .preview-enter-active, .preview-leave-active {
        transition: opacity 1s;
    }

    .preview-enter, .preview-leave-to {
        opacity: 0;
    }

    .screen-enter-active {
        animation: open 1s;
    }

    .screen-leave-active {
        animation: open 1s reverse;
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
            padding: 40px 0 15px 0;
        }

        100% {
            width: 1110px;
            padding: 28px 16px 15px 16px;
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
            background: rgba(0, 0, 0, 0.7);
            z-index: 999;
        }

        .preview-screen {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1110px;
            height: 740px;
            transform: translate(-50%, -50%);
            padding: 28px 16px 15px 16px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .button-group {
                position: absolute;
                top: 28px;
                right: 16px;
                /*top: -30px;
                right: 5px;*/
                z-index: 1000;
            }

            .button {
                height: 36px;
                width: 36px;
                color: rgba(225, 225,225, 0.6);
                font-size: 24px;
                cursor: pointer;
            }

            .fullscreen-btn {
                /*margin-right: 10px;*/
            }

            /*.close-btn {
                right: 7px;
            }*/

            .preview-screen-border {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('./../image/index/camera-bg.png') no-repeat;
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