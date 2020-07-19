<template>
    <div class="screen">
        <!-- 显示url或资源组de组件 -->
        <VResourcePreview v-if="previewType == 1 || previewType == 2" :options="{id: previewId}"></VResourcePreview>
        <VPlayGroupPreview v-show="previewType == 3" :id="previewId" :shown="previewType == 3"></VPlayGroupPreview>
        <!-- 摄像头预览组件 cameraType 1：单摄像头、2：摄像头循环组 -->
        <JudgeVideo v-if="previewType == 4 || previewType == 5" :id="previewId" :cameraType="previewType == 4? 1 : 2"></JudgeVideo>
    </div>
</template>
<script>
import moment from 'moment';
import customComponent from './custom-component';
import JudgeVideo from '../../components/videoComponet/judgeVideo';
import VPlayGroupPreview from '@/components/previewComponents/VPlayGroupPreview';
import VResourcePreview from '@/components/previewComponents/VResourcePreview';
import { ShowResourceGroupService } from '@/api/resource';
  export default {
      name: 'preview',
      components: {
          customComponent, JudgeVideo, VPlayGroupPreview, VResourcePreview
      },
      data() {
        return {
            show: false,
            previewType: '', // 窗口预览内容的类型 
            previewId: '', // 窗口预览项的Id
        }
      },
      mounted() {
          this.getWindowIdByUrl();
      },
      methods: {
        /**
         * 通过路由参数获取窗口id
         */
        async getWindowIdByUrl() {
       
            // 如果有这两个参数直接展示
            if (this.$route.query.fId && this.$route.query.type) {
                if(this.$route.query.type == 4) {
                    const tnRes = await ShowResourceGroupService.selectByVideoId(this.$route.query.fId);
                    this.previewType = this.$route.query.type;
                    this.previewId = tnRes.obj.fChannel;
                }else{
                    this.previewType = this.$route.query.type;
                    this.previewId = this.$route.query.fId;
                }
                
                return;
            }
            // 判断路由参数中有没有带窗口id
            if (!this.$route.query.id) {
                this.$message.error('参数错误');
                return
            }
            // 调用接口通过窗口id获取当前窗口所展示内容
            this.getContentByWindowId();
        },
        /**
         * TODO: 通过窗口id获取当前窗口所展示内容 可以得到展示内容的id和类型
         * 通过路由中的窗口id 获取当前窗口下所展示资源的类型，资源id
         * 共5种资源 1：URL、2：图片、3：资源播放组、4：单个摄像头、5：摄像头循环组
         */
        async getContentByWindowId() {
            const res = await ShowResourceGroupService.getResourceInfoByWindowId(this.$route.query.id);
            if (res.success) {
                if(res.obj.fResourceType == 4&&isNaN(res.obj.fResourceId)){
                    const anRes = await ShowResourceGroupService.selectByVideoId(res.obj.fResourceId);
                    this.previewType = res.obj.fResourceType;
                    this.previewId = anRes.obj.fChannel;
                }else{
                    this.previewType = res.obj.fResourceType;
                    this.previewId = res.obj.fResourceId;
                }
            } else {
                this.$message.error(res.msg);
            }
        },
          
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
