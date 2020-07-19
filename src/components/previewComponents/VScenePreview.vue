<template>
        <div style="width:100%;height:100%;background: #1b1f25;" id="sample-div">
            <div  :style="{width: sceneObj.fWidth + 'px', height: sceneObj.fHeight + 'px','transform': 'scale(' + sceneObj.wRatio + ',' + sceneObj.hRatio + ')'}" style="position: relative;transform-origin: 0 0;">
                <div v-for="(item, index) in sceneArr" :key="index" :style="{top: item.fY + '%', left: item.fX + '%', zIndex: item.fZIndex, width: item.fWidth + '%', height: item.fHeight + '%'}" style="position: absolute;">
                    <iframe :src="baseUrl + item.fVisitUrl" style="border:none;width: 100%;height:100%;"></iframe>
                </div>
            </div>
        </div>
</template>
<script>
    // 引入api
    import { sceneService }  from '@/api/visual'
    import { CatalogService } from '@/api/service'
    // import
    export default {
        props: {
            id: String
        },
        data() {
            return {
                sceneId: this.id?this.id:this.$route.query.sceneId, // 页面传值过来的场景id
                // 场景基本信息
                sceneObj: {},

                // 场景资源布局信息
                sceneArr: [],
                baseUrl:'',
            }
        },
        mounted: function(){
            // 获取打开资源路径
            this.getBaseUrl();
            window.onresize = () => {
                return(() => {
                    let a = document.getElementById('sample-div').offsetHeight,
                        b = document.getElementById('sample-div').offsetWidth;
                    this.sceneObj.hRatio = a/this.sceneObj.fHeight;
                    this.sceneObj.wRatio = b/this.sceneObj.fWidth;
                })()
            }
            // 查询场景基本信息
            this.getSceneById(this.sceneId);
        },
        
        methods: {
            // 获取打开资源路径
            async getBaseUrl(){
                let res = await CatalogService.getDictionaryContext("open_resource_url","url");
                if (res.success) {
                    if (res.obj != null) {
                        this.baseUrl = res.obj.fItemValue;
                    } else {
                        this.baseUrl = "";
                    }
                } else {
                    this.$message.warning(res.msg)
                }
            },
            // 查询场景基本信息
            async getSceneById(id){
                let res = await sceneService.getSceneById(id);
                if (res.success) {
                    if (res.obj != undefined && res.obj != null && Object.keys(res.obj) !== 0) {
                        setTimeout(() => {
                            let a = document.getElementById('sample-div').offsetHeight,
                            b = document.getElementById('sample-div').offsetWidth;
                            res.obj.hRatio = a/res.obj.fHeight;
                            res.obj.wRatio = b/res.obj.fWidth;
                            this.sceneObj = res.obj;
                            this.getSceneLayoutById(this.sceneId);
                        }, 1000);
                    }
                } else {
                    this.sceneObj = {};
                    this.$message.warning(res.msg);
                }
            },
            // 查询场景资源布局信息
            async getSceneLayoutById(id){
                let res = await sceneService.getSceneLayoutById(id);
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.sceneArr = res.obj;
                    } else {
                        return this.sceneArr = [];
                    }
                } else {
                    this.sceneArr = [];
                    this.$message.warning(res.msg);
                }
            },
            //初始化
            init(){
                let a = document.getElementById('sample-div').offsetHeight,
                        b = document.getElementById('sample-div').offsetWidth;
                    this.sceneObj.hRatio = 535/this.sceneObj.fHeight;
                    this.sceneObj.wRatio = 1030/this.sceneObj.fWidth;
            }
        },
        
    }
</script>
<style lang="scss" scoped>
    
</style>
