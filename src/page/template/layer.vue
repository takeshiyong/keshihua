<template>
    <div style="display:flex;">
        <li v-for="element in dragElements" :key="element.fId">

            <drag class="drag" :transfer-data="element" :effect-allowed="['copy']" drop-effect="copy">
                <div class="template-box">请拖拽此处进行布局</div>
            </drag>
        </li>
    </div>
</template>

<script>
import { Drag } from "vue-drag-drop";

export default {
  data() {
    return {
      dragElements: [
        {
          fId: "3919e47ed9494a9aa47dcf48d10a0825", //资源id
          fThumbnailPath: "static/img/img.jpg", //图片路径
          fIntactPath: "static/img/img.jpg",
          fResourceName: "资源新增1" //资源名称
        }
      ]
    };
  },
  props: ["dataList"],
  mounted: function() {},
  components: {
    Drag
  },
  methods: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
li {
  display: initial;
}

.template-box {
  width: 120px;
  height: 30px;
  -webkit-box-shadow: inset 0 0 46px 0 rgba(136, 215, 255, 0.45);
  box-shadow: inset 0 0 46px 0 rgba(136, 215, 255, 0.45);
  margin: 6px 0;
  color: #fff;
  text-align: center;
  line-height: 30px;
}
</style>
