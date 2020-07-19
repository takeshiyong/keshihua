<template>
    <div class="left-contents" ref="leftContent">
        <div class="layer-manager-top">
            <span class="layer-num">模块名称</span>
            <i class="dvIcon dvIcon-left" style="font-size: 14px;" @click="handleChangeLeft"></i>
        </div>
        <div class="center-content">
            <div class="content-left">
                <div class="content-icon" 
                    v-for="(item,index) in dataList"
                    :key="index"
                    style="cursor: pointer;"
                    :ref='`icon${index}`'
                    @click="changeDataSourse(item,index)"
                >
                    <i :class='`${item.name}`' style="font-size: 18px;" :title="item.title" @click="changeContent"></i>
                </div>
            </div>
            <div class="content-right">
                <div @click='showCurrentItem()'>
                    <div v-if="currentIndex == 0" class="current-box">
                        <div
                            v-for="(item,index) in sourseItem"
                            :key="index"
                            @click='showDetail(item,index)'
                            class="item-list-show">
                            <div class="template-selector-item blank-template">
                                <div class="template-thumbnail-wp">
                                    <div style="width:100%;height:100%;" class="thumbnail-div">
                                        <div 
                                            :style="{top: ii.fY + '%', left: ii.fX + '%', width: ii.fWidth + '%', height: ii.fHeight + '%'}" 
                                            v-for="(ii,index) in item.templateLayouts" 
                                            :key="index" 
                                            class="layout-div"
                                        >
                                        </div>
                                    </div>
                                </div>
                                <div class="template-desc">
                                    <div class="desc-name ellipsis-2">
                                            <span v-if="item.fName.length <= 6" >{{ item.fName }}</span>
                                            <el-tooltip
                                                :open-delay="400"
                                                effect="dark"
                                                :content="item.fName">
                                                <span v-if="item.fName.length > 6">{{truncate(item.fName)}}</span>
                                            </el-tooltip>
                                    </div>
                                    <div class="desc-name ellipsis-2">
                                            {{item.fWidth}} x {{item.fHeight}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="currentIndex != 0&&sourseItem.length !=0" class="current-box">
                        <div
                            v-for="(item,index) in sourseItem"
                            :key="index"
                            class="item-list-show"
                        >   
                            <drag class="drag" style="width: 90px;height: 50px;cursor: pointer;" :transfer-data="item" :effect-allowed="['copy']" drop-effect="copy">
                                <!-- <div style="width: 90px;height: 50px;background: #2e343c"> -->
                                    <img 
                                        :src="pictureUrl + item.fPreviewPicture" 
                                        width="90px" height="50px"
                                        style="width: 100%;height: 100%;background: #2e343c"
                                        :onerror="defaultImag" 
                                        alt="" 
                                    >
                                <!-- </div> -->
                                
                            </drag>
                            <span v-if="item.fResourceName.length <= 6" class='item-list-text-show'>{{ item.fResourceName }}</span>
                            <el-tooltip
                                :open-delay="400"
                                effect="dark"
                                :content="item.fResourceName">
                                <span v-if="item.fResourceName.length > 6" class='item-list-text-show'> {{truncate(item.fResourceName)}}</span>
                            </el-tooltip>
                        </div>
                        
                    </div>
                    <div v-else>
                        <span class="unDataClass">暂无数据</span>
                    </div>
                </div>
            </div>
        </div>
        <DialogModal :showModal="showModal" @closeModals="showModal=false" :modalTitle="'切换模板'">
                <template v-slot:container>
                    <span style="font-size: 14px;padding:10px;display: block">应用模板后现有的场景不可恢复，是否确定应用模板?</span>
                </template>
                <template v-slot:footer>
                    <el-button  style="font-size: 12px" @click="showModal=false;currentItem = {}">取消</el-button>
                    <el-button type="primary" style="font-size: 12px" @click="replaceSure">确定</el-button>
                </template>
        </DialogModal>
    </div>
</template>

<script>
    import { Drag } from "vue-drag-drop";
    import { sceneService, templateService } from "@/api/visual.js";
    import DialogModal from '../../components/DialogModal.vue';
    import bus from "@/common/bus.js";
    
    export default {
        data(){
            return {
                defaultImag: 'this.src="' + require('../../image/common/noFile.png') + '"',  //出错时显示图片
                dataList: [
                    // {title: "常用",name: 'dvIcon dvIcon-huo dvIcon-leftStyle'},
                    {title: '模板',name: 'dvIcon dvIcon-mobanguanli dvIcon-leftStyle'},
                    {title: '图片',name: 'dvIcon dvIcon-pic dvIcon-leftStyle'},
                    {title: 'url',name: 'dvIcon dvIcon-link dvIcon-leftStyle'},
                    {title: '播放组',name: 'dvIcon dvIcon-book2fuben dvIcon-leftStyle'},
                    {title: '摄像头',name: 'dvIcon dvIcon-icon- dvIcon-leftStyle'},
                    {title: '循环摄像头',name: 'dvIcon dvIcon-xunhuan dvIcon-leftStyle'},
                ],
                sourseList: {
                    0: [],
                    1: [],
                    2: []
                },
                sourseItem: [],
                currentIndex: 0,
                currentItem: {},
                showModal: false
            }
        },
        components: {
            Drag,
            DialogModal
        },
        props: ['leftSwitch'],
        mounted () {
            this.getAllTemplatePages();
            this.$refs[`icon0`][0].classList.add("actived");
        },
        methods: {
            /**
             * 截断文字
             * @param {string} name --- 文字
             * @param {number} maxlength --- 文字长度
             */
            truncate(name, maxlength = 6) {
                if (name.length > maxlength) {
                    return name.substr(0, 6) + '...';
                } else {
                    return name;
                }
            },
            //获取全部资源列表
            //异步请求所有的资源
            async getSceneById(type) {
                let res = await sceneService.getSceneByType(type);
                if (res.success) {
                    if (res.obj != undefined) {
                        this.sourseItem = res.obj
                    }
                } else {
                    this.$message.warning(res.msg);
                }
            },
            // 获取模板资源信息
            async getAllTemplatePages() {
                let res = await templateService.getAllTemplatePages();
                if (res.success) {
                    if (res.obj != null) {
                        this.sourseList = {
                            ...this.sourseList,
                            0: res.obj
                        }
                        this.sourseItem = this.sourseList[0];
                    } else {
                        this.sourseList[0] = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                }
            },
            //隐藏左侧
            handleLeft() {
                this.$refs.leftContent.style.width = 0;
                this.$refs.leftContent.style.minWidth = 0;
                this.$refs.leftContent.style.zIndex = -1;
            },
            //显示左侧
            handleShowLeft(){
                this.$refs.leftContent.style.width = 270+"px";
                this.$refs.leftContent.style.minWidth = 270+"px";
                this.$refs.leftContent.style.zIndex = 1;
            },
            //点击向外传入控制左侧值
            handleChangeLeft() {
                this.$emit('chang-left-switch',{leftSwitch:true})
            },
            changeContent(){

            },
            //点击icon显示当前内容
            changeDataSourse(item,index){
                for(let i = 0; i< this.dataList.length; i++){
                    if(this.$refs[`icon${i}`][0].classList.contains("actived")){
                        this.$refs[`icon${i}`][0].classList.remove("actived")
                    }
                }
                this.currentIndex = index;
                this.$refs[`icon${index}`][0].classList.add("actived");
                if(index != 0){
                    this.getSceneById(index);
                    return;
                }
                this.sourseItem = this.sourseList[index]
                
            },
            //展示当先类别条目
            showCurrentItem(){

            },
            //点击条目显示当前信息
            showDetail(item,index){
                this.showModal = true;
                this.currentItem = item;
            },
            replaceSure(){
                bus.$emit("onApplyTemplate", this.currentItem);
                this.showModal = false;
                this.currentItem = {}
            }
        },
        watch: {
            leftSwitch: function(){
                if(this.leftSwitch){
                    this.handleLeft()
                }else{
                    this.handleShowLeft()
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .unDataClass{
        color: #fff;
        font-size: 16px;
        width: 100%;
        text-align: center;
        display: block;
        margin-top: 10px
    }
    .left-contents{
        width: 270px;
        min-width: 270px;
        height: 100%;
        background: #13161a;
        display: flex;
        flex-direction: column;
        transition:  .3s ease;
        // z-index: 5;
        overflow: hidden;
        border-right: 1px solid #000;
        .layer-manager-top{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding-left: 5px;
            padding-right: 5px;
            box-sizing: border-box;
            background: #2e343c;
            height: 30px;
            width: 100%;
            color: #bcc9d4;
            line-height: 30px;
            position: relative;
            user-select: none;
            .layer-num {
                font-size: 14px;
            }
            
        }
        .center-content{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            .content-left{
                width: 48px;
                height: 100%;
                background: #1d1f26;
                align-items: center;
                display: flex;
                flex-direction: column;
                color: #bcc9d4;
                .actived{
                    background: #14161a;
                    border-top: none;
                    border-left:5px solid #2483ff !important;
                    z-index: 999;
                 }
                .content-icon {
                    width: 100%;
                    height: 48px;
                    display: flex;
                    flex-direction: row;
                    border-left: 5px solid transparent;
                    box-sizing: border-box;
                    .dvIcon-leftStyle {
                        font-size: 18px;
                        padding: 15px 10px;
                    }
                }
                
            }
            .item-top{
                height: 36px;
                padding-left: 8px;
                color: #bcc9d4;
                display: flex;
                // justify-content: center;
                align-items: center;
                border-bottom: 1px solid #2c2e33;

            }
            .item-list-show{
                display: flex;
                flex-direction: column;
                width: 100px;
                // height: 71px;
                align-items: center;
                margin-left: 10px;
                margin-top: 10px;
                margin-bottom: 5px;
                text-align: center;
                .item-list-text-show{
                    color: #bcc9d4;
                    font-size: 12px;
                    margin-top: 5px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    width: 90px
                    
                }
            }
            .content-right{
                width: 100%;
                height: 100%;
                overflow-y: auto;
                scrollbar-width: none;
                .current-box{
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    flex-wrap:wrap;
                }
            }
            .content-right::-webkit-scrollbar{
                display: none;
            }
        }
        .template-selector-item {
            display: block;
            width: 100%;
            // margin: 17px 25px 17px 0;
              //   overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: 0.2s ease-out;
            cursor: pointer;
            .template-thumbnail-wp {
                display: block;
                position: relative;
                float: left;
                width: 100%;
                height: 59px;
                border: 1px solid #232730;
                .thumbnail-div {
                    position: relative;
                    transform-origin: 0 0;
                    overflow: hidden;
                    box-sizing: border-box;
                    .layout-div {
                        border: 1px solid #0A657D;
                        position: absolute;
                    }
                }
            }
            .template-desc{
                color: #bcc9d4;
                margin-top: 5px;
                .desc-name {
                    // position: relative;
                    // display: flex;
                    // flex-direction: row;
                    // align-items: center;
                    // justify-content: flex-start;
                    color: #bcc9d4;
                    width: 99px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
            
        }
    }
</style>