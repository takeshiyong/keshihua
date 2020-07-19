/*
* @Modified:
* 1. 2019-12-15 元实  选择资源的时候显示...
* 2. 2019-12-17 元实  整体替换的话，不让选择场景上的项
*/

<template>
        <div style="width:100%;height:100%;background: #1b1f25;" id="sample-div">
            <div  :style="{width: sceneObj.fWidth + 'px', height: sceneObj.fHeight + 'px','transform': 'scale(' + sceneObj.wRatio + ',' + sceneObj.hRatio + ')'}" style="position: relative;transform-origin: 0 0;">
                <div  v-for="(item, index) in sceneArr" :key="index" :ref="`item${index}`" :style="{top: item.fY + '%', left: item.fX + '%', zIndex: item.fZIndex, width: item.fWidth + '%', height: item.fHeight + '%'}" style="position: absolute;">
                    <div @click="handleClick(item, index)" style="width: 100%;height:100%;position: absolute;z-index: 999999999999999"></div>
                    <iframe  :src="baseUrl + item.fVisitUrl" style="border:none;width: 100%;height:100%;"></iframe>

                    <div class="recourse-modal">
                        <div class="circle">
                            <i class="el-icon-check" style="color: #fff;font-size: 18px;"/>
                        </div>
                    </div>
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
            id: String,
            castType: Number
        },
        watch: {
            id() {
              this.getSceneById(this.sceneId);
            }
        },
        data() {
            return {
                sceneId: this.id, // 页面传值过来的场景id
                // 场景基本信息
                sceneObj: {},

                // 场景资源布局信息
                sceneArr: [],
                baseUrl:'',
                IframeOnClick:{
                    resolution: 200,  
                    iframes: [],  
                    interval: null,  
                    Iframe: function() {  
                        this.element = arguments[0];  
                        this.cb = arguments[1];   
                        this.hasTracked = false;  
                    },  
                    track: function(element, cb) {  
                        this.iframes.push(new this.Iframe(element, cb));  
                        if (!this.interval) {  
                            var _this = this;  
                            this.interval = setInterval(function() { _this.checkClick(); }, this.resolution);  
                        }  
                    },  
                    checkClick: function() {  
                        if (document.activeElement) {  
                            var activeElement = document.activeElement;  
                            for (var i in this.iframes) {  
                                if (activeElement === this.iframes[i].element) { // user is in this Iframe  
                                    if (this.iframes[i].hasTracked == false) {   
                                        this.iframes[i].cb.apply(window, []);   
                                        this.iframes[i].hasTracked = true;  
                                    }  
                                } else {  
                                    this.iframes[i].hasTracked = false;  
                                }  
                            }  
                        }  
                    }  
                }
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
            },
            //点击后的提示
            handleClick(item, index){
                if (this.castType === 2) {
                    this.selectItem(index);    //2019-12-15 元实
                }
                this.$emit('currentScreenId', item);
            },

            /**
             * 展示选择的资源
             * @param {number} index  --- 选择的资源的索引
             * @author 元实 2019-12-15
             */
            selectItem(index) {
                const itemDiv = this.$refs[`item${index}`][0];

                for (let key in this.$refs) {
                    this.$refs[key][0].classList.remove('selected');
                }

                if (itemDiv.classList.contains('selected')) {
                    itemDiv.classList.remove('selected');
                } else {
                    itemDiv.classList.add('selected');
                }
            }
        },
    }
</script>
<style lang="scss" scoped>
    .selected {
        .recourse-modal {
            opacity: 1;
        }
    }

    .recourse-modal {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        transition: opacity .5s;
        background: rgba(0,0,0,.81);
        border: 1px solid #2483FF;
        z-index: 2;

        span {
            background-color: #2483ff;
        }

        .circle {
            width: 30px;
            height: 30px;
            border: 1px solid #303640;
            border-radius: 30px;
            background-color: #1589FB;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>
