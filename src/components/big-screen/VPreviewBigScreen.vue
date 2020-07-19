/*
* @Author: 元实
* @Date:   2019-12-06
* @Description: 投屏的时候预览大屏
*/

<template>
    <div class="screen">
        <!-- 显示url或资源组de组件 -->
        <VResourcePreview v-if="resourceType === 1 || resourceType == 2" :options="{ id: resourceId }"></VResourcePreview>
        <VPlayGroupPreview v-show="resourceType === 3" :id="resourceId" :shown="resourceType === 3"></VPlayGroupPreview>
        <!-- 摄像头预览组件 cameraType 1：单摄像头、2：摄像头循环组 -->
            <JudgeVideo v-if="(resourceType === 4 || resourceType === 5) && resourceId !==''" :id="resourceId" :cameraType="resourceType === 4 ? 1 : 2"></JudgeVideo>
        <VScenePreviewS
                v-if="type === 3 && resourceId !== ''"
                :id="resourceId"
                :castType="castType"
                @currentScreenId="handleCurrentScreenId"></VScenePreviewS>
        <VPrePlanPreview
                v-if="type === 2 && resourceId !== ''"
                :id="resourceId"
                :castType="castType"
                @onScreenItemSelect="handleCurrentScreenId"></VPrePlanPreview>
    </div>
</template>
<script>
    import JudgeVideo from '../../components/videoComponet/judgeVideo';
    import VPlayGroupPreview from '@/components/previewComponents/VPlayGroupPreview';
    import VResourcePreview from '@/components/previewComponents/VResourcePreview';
    import VScenePreviewS from '@/components/previewComponents/VScenePreviewS';
    import VPrePlanPreview from '@/components/previewComponents/VPrePlanPreview';
    import { ShowResourceGroupService } from '@/api/resource';

    export default {
      components: {
          JudgeVideo,
          VPlayGroupPreview,
          VResourcePreview,
          VScenePreviewS,
          VPrePlanPreview
      },

      props: {
          type: { //窗口预览内容的类型
              type: Number,
              required: true
          },

          sourceType: { //资源类型
            type: Number
          },

          id: { //窗口预览项的Id
              type: String,
              required: true
          },

          castType: { //投屏方式
              type: Number
          }
      },

      data() {
        return {
            show: false,
            resourceType: null, //资源类型
            resourceId: '' //资源id
        }
      },

      mounted() {
          this.getBigScreenContent();
      },

      watch: {
          id() {
              this.getBigScreenContent();
          }
      },

      methods: {
          /**
           * 获取大屏内容
           */
          async getBigScreenContent() {
              if (this.type === 1) { //显示组
                   this.getPermanentSource();
                } else if ((this.type === 2) || (this.type === 3)) { //预案组、场景
                   this.resourceId = this.id;
                } else if (this.type === 4) { //临时资源
                    this.getTemporarySource();
                }
          },

          /**
           * 根据id查询显示组信息
           */
          async getPermanentSource() {
              let result = await ShowResourceGroupService.getResourceInfoByWindowId(this.id);

              if (result.success) {
                  if (result.obj) {
                      this.resourceType = result.obj.fResourceType;
                      if (this.resourceType === 4) {
                          this.resourceId = await this.getVideoChannel(result.obj.fResourceId);
                      } else {
                          this.resourceId = result.obj.fResourceId;
                      }
                  }
              } else {
                  this.$message.error(result.msg);
              }
          },

          /**
           * 获取临时资源信息
           */
          async getTemporarySource() {
              this.resourceType = this.sourceType;

              if (this.resourceType === 4) {
                  this.resourceId = await this.getVideoChannel(this.id);
              } else {
                  this.resourceId = this.id;
              }
          },

          /**
           * 获取通道号
           * @param {string} id --- 摄像头id
           * @returns {*}
           */
          async getVideoChannel(id) {
              let res = await ShowResourceGroupService.selectByVideoId(id);

              if (res.success) {
                  if (res.obj) {
                      return res.obj.fRealityChannel;
                  }
              } else {
                  this.$message.error(res.msg);
                  return '';
              }
          },

          /**
           * 获取在场景上选择的元素id
           * @param {Object} item --- 选择的元素对象
           */
          handleCurrentScreenId(item) {
              this.$emit('getSelectSceneItemId', item.fId, item.fSceneId);
          },
      }
      
  }
</script>

<style lang="scss">

</style>
<style lang="scss" scoped>
    .screen {
        width: 100%;
        height: 100%;
        background: #000;
    }
</style>
