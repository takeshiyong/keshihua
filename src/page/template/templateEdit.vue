<template>
    <div class="contents">
        <div class="con-header">
            <div class="back-btn" @click="templateBack">
                <i class="dvIcon dvIcon-left" style="font-size: 18px;"></i>
            </div>
            <div class="header-right">
                <div style="display: flex;flex-direction: row;">
                    <div class="common-top-icon" @click="postName" style="cursor: pointer;">
                        <i class="dvIcon dvIcon-save header-text" ></i>
                        <span class="header-text" >保存</span>
                    </div>
                    
                   
                    <div class="common-top-icon" style="margin-right: 15px;cursor: pointer;" @click="handleRightPanel">
                        <i class="dvIcon dvIcon-dasan header-text" ></i>
                        <span class="header-text">右侧面板</span>
                    </div>
                    <v-layer style="margin-left: 15px;cursor: pointer;"></v-layer>
                </div>
                <div class="center-text">
                    <div>
                        <el-input-number  :value="accMul(currentZoom,100)" @change="changeZoom" size="mini"  :min="0" :max="200"></el-input-number>
                    </div>
                    <span style="margin-left: 5px;font-size: 12px;margin-top: -3px">缩放</span>
                </div>
                
            </div>
        </div>
        <div style="display: flex;flex-direction: row;width: 100%;height: 100%">
            <templateCenter ref='templateCenter' :rightSwitch="rightSwitch" :slider-scale="currentZoom" :unit="screen" />
        </div>
        <DialogModal :showModal="outLeft" @closeModals="outLeft=false" modalTitle="退出编辑">
          <template v-slot:container>
            <span>您将退出模板的编辑,请确认您已保存,否则丢失</span>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="outLeft=false">取消</el-button>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="goBack">确定</el-button>
          </template>
        </DialogModal>
        <DialogModal :showModal="saveName" @closeModals="saveName=false" modalTitle="保存模板名称">
          <template v-slot:container>
            <el-input  v-model="screen.name"  @change="changeScreenName" placeholder="请输入模板名称"></el-input>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="saveScene">确定</el-button>
          </template>
        </DialogModal>
    </div>
</template>

<script>
    import vLayer from "./layer.vue";
    import DialogModal from '../../components/DialogModal.vue';
    import templateCenter from './templateCenter.vue';
    import { mapGetters } from "vuex";
    import {mapState} from 'vuex'
    import { sceneService, templateService } from "@/api/visual.js";
    import bus from "@/common/bus.js";
    // 截图依赖
    import html2canvas from "html2canvas";

    export default {
        components:{
            DialogModal,templateCenter,vLayer
        },
        data(){
            return {
                templateInfo: null,
                rightSwitch: false,
                saveName: false,
                sliderScale: 1,
                screen: {
                    //大屏名字
                    name: "",
                    //大屏高
                    height: 1080,
                    //大屏宽
                    width: 1920,
                },
                currentZoom: 1,
                outLeft: false
            }
        },
        computed: {
            ...mapGetters(["templateList"]),
            
        },
        
        mounted () {
            this.templateInfo = this.$route.query.templateInfo
            ? JSON.parse(this.$route.query.templateInfo)
            : null;
            if (this.templateInfo) {
                this.screen = {
                    width: this.templateInfo.fWidth,
                    height: this.templateInfo.fHeight,
                    name: this.templateInfo.fName
                }
            }
           // 订阅事件
            this.changedScreen();
            this.getTemplateById();
            this.init()
            
        },
        methods: {
            //返回按钮
            templateBack(){
                this.outLeft = true;
            },
            goBack(){
                this.templateList = [];
                this.$store.dispatch("delectTemplateList", []);
                this.$router.replace({ path: '/templateManage' });
            },
            //初始化
            init(){
               
               let fid = this.templateInfo ? this.templateInfo.fId : null; 
               if(!fid){
                   this.currentZoom = 1
               }else{
                   let height = this.$el.querySelector(".center-contents").offsetHeight;
                    let currentZoom = Math.round(((height-65) / this.screen.height)*10);
                    this.currentZoom =  currentZoom/10 > 2? 2: currentZoom/10;
               }
               
               
            },
            //改变值控制右侧显示
            handleRightPanel(){
                this.rightSwitch = !this.rightSwitch;
            },
            
            changedScreen() {
                // bus.$emit('eventFromLayout', this.elements[index]);
                let that = this;
                bus.$on("onScreenTemplateChange", function(screen) {
                    that.screen.width = screen.width || 1920;
                    that.screen.height = screen.height || 1080;
                    that.screen.name = screen.name || '';
                });
            },
            //根据像素换算为百分比
            getRatioSize(size) {
                return {
                    left: (size.left * 100) / this.screen.width,
                    top: (size.top * 100) / this.screen.height,
                    width: (size.width * 100) / this.screen.width,
                    height: (size.height * 100) / this.screen.height
                };
            },
            //根据百分比换算为像素
            getPxSize(size) {
                return {
                    left: (size.fX * this.screen.width) / 100,
                    top: (size.fY * this.screen.height) / 100,
                    width: (size.fWidth * this.screen.width) / 100,
                    height: (size.fHeight * this.screen.height) / 100
                };
            },
            async getTemplateById() {
                let fid = this.templateInfo ? this.templateInfo.fId : null; //"b917a18fccf94067b107badb315ee0db";
                if (!fid) {
                    
                    //新增入口
                    return;
                }
                let res = await templateService.getTemplateById(fid);
                this.templateList = [];
                if (res.success) {
                    if (res.obj != undefined) {
                    // this.templateList = _.clone(res.obj);
                    res.obj.forEach((item, index) => {
                        let pxSize = this.getPxSize(item);
                        this.templateList.push({
                            height: pxSize.height,
                            fId: item.fId,
                            fLayoutNo: item.fLayoutNo,
                            fPresetTemplateId: item.fPresetTemplateId,
                            width: pxSize.width,
                            left: pxSize.left,
                            top: pxSize.top,
                            zIndex: item.fZIndex,
                            active: false,
                            draggable: true,
                            resizable: true
                        });
                    });
                    } else {
                    this.$message.warning(res.msg);
                    }
                } else {
                    this.$message.error(res.msg);
                }
            },
            //验证是否存在名字
            postName(){
                if(this.screen.name == ""){
                    this.saveName = true;
                    return;
                }
                this.saveScene();
            },
            changeScreenName(val) {
                this.screen.name = val;
            },
            //保存场景信息
            async saveScene() {
                let params = {
                    fHeight: this.screen.height, //高度
                    fId: this.templateInfo ? this.templateInfo.fId : "", //修改模板id
                    fName: this.screen.name, //模板名称
                    fWidth: this.screen.width, //宽度
                    templateLayouts: [] //模板布局信息
                }; 
                if(this.templateList.length == 0){
                    this.$message.warning("模板内容不能为空");
                    return;
                }
                this.templateList.forEach((item, index, array) => {
                    let ratioSize = this.getRatioSize(item);
                    params.templateLayouts.push({
                        fHeight: ratioSize.height, //高
                        fLayoutNo: item.zIndex, //布局区域编号
                        fWidth: ratioSize.width, //宽
                        fX: ratioSize.left, //x位置
                        fY: ratioSize.top, //y位置
                        fZIndex: item.zIndex //层级
                    });
                });
                let res;

                if (params.fId) {
                    //编辑
                    res = await templateService.editTemplate(params);
                } else {
                    //新增
                    // delete params.fId;
                    res = await templateService.addTemplate(params);
                    this.templateInfo = {
                        ...this.templateInfo,
                        fId: res.obj
                    }
                }
                if (res.success) {
                    this.saveName = false
                    this.$message.success(res.msg);
                } else {
                    this.$message.error(res.msg);
                }
            },
            ////保存场景信息
            saveTemplateByScene() {
                this.sceneTemplateDialog = true;
            },
            // 截图
            html2canvasPrint() {
                let that = this;
                // 确保无滚动条方可截图完整
                // this.setFitLayout("overflowHidden");
                // let fitSize = this.getFitSize();
                let content_html = this.$el.querySelector(".data-content");
                let width = content_html.offsetWidth;
                let height = content_html.offsetHeight;

                // let scaleBy = Math.ceil(window.devicePixelRatio);

                var opts = {
                    allowTaint: true, //允许加载跨域的图片
                    tainttest: true, //检测每张图片都已经加载完成
                    // scale: scaleBy, // 添加的scale 参数
                    foreignObjectRendering: true,
                    useCORS: true,
                    logging: true, //日志开关，发布的时候记得改成false
                    width: width, //dom 原始宽度
                    height: height //dom 原始高度
                };
                // 进行截图
                html2canvas(content_html, opts).then(function(canvas) {
                    let data = canvas.toDataURL();
                    that.printSceneSubmit(data);
                });
            },
            //场景截图信息
            async printSceneSubmit(data) {
                //
                let stream = data.split(";base64,")[1];
                let params = {
                    fFileStr: stream,
                    fId: this.sceneInfo.fId //场景id
                };

                let res = await sceneService.printscreen(params);
                if (res.success) {
                    this.$message.success(res.msg);
                } else {
                    this.$message.error(res.msg);
                }
            },
            // 最佳缩放比例（即不出现滚动条的情况）
            getFitSize() {
                let container = this.$el.querySelector(".main-container");
                var winWidth = container.offsetWidth - 3 - 30,
                    winHeight = container.offsetHeight - 3 - 30,
                    sourceWidth = this.screen.width,
                    sourceHeight = this.screen.height;
                var winScale = winWidth / winHeight,
                    sourceScale = sourceWidth / sourceHeight;
                var target = {
                    w: winWidth,
                    h: winHeight,
                    scaleX: 0,
                    scaleY: 0
                };
                if (winScale > sourceScale) {
                    target.w = winHeight * sourceScale;
                } else {
                    target.h = winWidth / sourceScale;
                }
                target.scaleX = sourceWidth / target.w;
                target.scaleY = sourceHeight / target.h;
                target.translateX = (sourceWidth * 10) / target.scaleX;
                target.scale =
                    1 / (target.scaleX > target.scaleY ? target.scaleX : target.scaleY);
                return target;
            },
            //乘法 
            accMul(arg1,arg2){  
                var m=0,s1=arg1.toString(),s2=arg2.toString();  
                try{m+=s1.split(".")[1].length}catch(e){}  
                try{m+=s2.split(".")[1].length}catch(e){}  
                return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)  
            },
            //改变当前缩放
            changeZoom(val){
                this.currentZoom = val/100;
            },
            
        },
       
    }
</script>

<style lang="scss" scoped>
    .contents{
        // background: #010305;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: hidden;
        overflow-x: hidden;
        .header-text {
            font-size: 12px;
        }
        .con-header {
            position: relative;
            width: 100%;
            min-width: 1000px;
            height: 45px;
            padding-right: 8px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            user-select: none;
            color: #a1aeb3;
            background: #1d1e1f;
            border-bottom: 1px solid #000;
            z-index: 100;
            .back-btn{
                font-size: 0;
                width: 40px;
                height: 100%;
                line-height: 40px;
                text-align: center;
                border-right: 1px solid #000;
                cursor: pointer;
                color: #2483ff;
                transition: .2s;
            }
            .header-right {
                display: flex;
                flex-direction: row;
                // justify-content: start;
                width: 100%;
                height: 100%;
                padding-left: 15px;
                
                .common-top-icon {
                    display: flex;
                    flex-direction: column;
                    color: #fff;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    margin-right: 15px;
                }
                .center-text {
                    display: flex;
                    flex: 1;
                    flex-direction: row;
                    color: #fff;
                    align-items: center;
                    justify-content: center;

                }
            }
        }
    }
    .modal-content {
        padding-left: 20px;
        padding-right: 20px;
        margin: 0 -20px;
        padding-bottom: 10px;
        overflow-y: auto;
        // min-height: 50px;
        // max-height: 500px;
        .content-input{
            display: block;
            line-height: 30px;
            background: #1c222b;
            color: #fff;
            font-size: 12px;
            width: 100%;
            padding-left: 5px;
            // padding-right: 8px;
            margin-top: 8px;
            height: 30px;
            border: 0
        }
        .content-number {
            line-height: 30px;
            background: #1c222b;
            color: #fff;
            font-size: 12px;
            width: 50px;
            padding-left: 5px;
            height: 30px;
            border: 0
        }
        
    }
</style>
<style>
    .el-input-number--mini{
        line-height: 23px !important;
    }
    .el-input-number__decrease, .el-input-number__increase {
        background: #0e1013 !important;
        top: 2px;
        border: 1px solid #282f3a !important;
    }
    .el-input__inner{
        color: #fff !important;
    }
</style>