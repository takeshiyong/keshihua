<template>
    <div v-if="showScreen" style="width: 100%;height: 100%">
        <VScenePreviewS :id="sceneId" @currentScreenId="handleCurrentScreenId" :castType="castType"></VScenePreviewS>
    </div>
</template>

<script>
    import { ScreenServerService } from '@/api/resource';
    import VScenePreviewS from '@/components/previewComponents/VScenePreviewS';
    import { layoutService } from '@/api/visual';

    export default {
        props: {
            id: {
                type: String,
                required: true
            },

            castType: Number
        },

        components: {
            VScenePreviewS
        },

        data() {
            return {
                scenes: [], //预案组包括的场景
                sceneId: '', //当前场景id,
                showScreen: false
            };
        },

        async mounted() {
            this.getPreplanScenes();
        },

        methods: {
            /**
             * 获取预案组的场景
             */
            async getPreplanScenes() {
                const res = await ScreenServerService.selectByGroupId(this.id);
                if(res.success){
                    this.showScreen = true
                    this.sceneId = res.obj.fSceneId
                }else{
                    this.$message.warning(res.msg)
                }
            },

            handleCurrentScreenId(item) {
                this.$emit('onScreenItemSelect', item);
            }
        }
    }
</script>

<style scoped>
       .preplan-container{
           width: 100%;
           height: 100%;
           position: relative;
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