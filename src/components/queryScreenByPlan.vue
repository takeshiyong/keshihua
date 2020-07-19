<template>
    <div style="width: 100%;height: 100%">
        <img :src="pictureUrl + fPreviewUtl" class="full-width" :onerror="defaultImag"/>
    </div>
</template>
<script>
import VScenePreview from './previewComponents/VScenePreview';
import { ScreenServerService } from '@/api/resource';
import { sceneService } from '@/api/visual';
  export default {
      components: {
          VScenePreview
      },
      props: {
            id: String,
            type: Number
      },
      watch: {
            id() {
                this.getWindowIdByUrl();
            }
      },
      data() {
        return {
            fPreviewUtl: '', // 窗口预览项的Id
            defaultImag: 'this.src="' + require('../image/common/noFile.png') + '"', //出错时显示图片
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
            if(this.type == 2){
                if(this.id != ""&&this.id != undefined){
                    let that = this
                    setTimeout(() => {
                        that.getCurrentJpg();
                    },3000);
                }
            }else{
                if(this.id != ""&&this.id != undefined){
                        let currentShow = await sceneService.getSceneById(this.id);
                        if(currentShow.success){
                            this.fPreviewUtl  = currentShow.obj.fImageUrl
                        }
                    }else{
                        this.$message.warning(res.msg)
                    }
            }    
        },
        ///获取当前显示的图片
        async getCurrentJpg(){
            const res = await ScreenServerService.selectByGroupId(this.id);
            
            if(res.success){
                let currentShow = await sceneService.getSceneById(res.obj.fSceneId);
                if(currentShow.success){
                    this.fPreviewUtl  = currentShow.obj.fImageUrl
                }
            }else{
                this.$message.warning(res.msg)
            }
        }
      }
      
  }
</script>


