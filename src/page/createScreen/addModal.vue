<template>
    <div class="contents">
        <div class="con-header">
            <div class="back-btn" @click="editDialog='true'">
                <i class="dvIcon dvIcon-left" style="font-size: 18px;"></i>
            </div>
            <span v-if="screen.screenName.length <= 6" style="color: #fff;font-size: 14px;margin-left: 5px;width: 160px;minWidth: 160px;display: inline-block">{{ screen.screenName }}</span>
            <el-tooltip
                :open-delay="400"
                effect="dark"
                :content="screen.screenName">
                    <span v-if="screen.screenName.length > 6" style="color: #fff;font-size: 14px;margin-left: 5px;width: 160px;minWidth: 160px;display: inline-block">{{truncate(screen.screenName)}}</span>
            </el-tooltip>
            <div class="header-right">
                <div style="display: flex;flex-direction: row;">
                    <div class="common-top-icon" @click="saveScene" style="cursor: pointer;">
                        <i class="dvIcon dvIcon-save header-text" ></i>
                        <span class="header-text">保存</span>
                    </div>
                    <div class="common-top-icon" @click="saveTemplateByScene" style="cursor: pointer;">
                        <i class="dvIcon dvIcon-save header-text" ></i>
                        <span class="header-text">保存模板</span>
                    </div>
                    <!-- <div class="common-top-icon" @click="delectLastItem" style="cursor: pointer;">
                        <i class="dvIcon dvIcon-back header-text"></i>
                        <span class="header-text">撤销</span>
                    </div> -->
                    <!-- <div class="common-top-icon">
                        <i class="dvIcon dvIcon-zuoduiqi header-text" ></i>
                        <span class="header-text">对齐</span>
                    </div> -->
                    <div class="common-top-icon" @click="handleLeftPanel" style="cursor: pointer;">
                        <i class="dvIcon dvIcon-zuhe header-text" ></i>
                        <span class="header-text">左侧面板</span>
                    </div>
                    <div class="common-top-icon" @click="handleRightPanel" style="cursor: pointer;">
                        <i class="dvIcon dvIcon-dasan header-text" ></i>
                        <span class="header-text">右侧面板</span>
                    </div>
                    <!-- <div class="common-top-icon">
                        <i class="dvIcon dvIcon-suoding header-text"></i>
                        <span class="header-text">锁定</span>
                    </div> -->
                </div>
                <div class="center-text">
                    <div>
                        <el-input-number  :value="accMul(currentZoom,100)" @change="changeZoom" size="mini"  :min="0" :max="200"></el-input-number>
                    </div>
                    <span style="margin-left: 6px;font-size: 12px;margin-top: -3px">缩放</span>
                </div>
                <div style="display: flex;flex-direction: row;">
                    <div class="common-top-icon" @click="downLoad" style="cursor: pointer;">
                        <i class="dvIcon dvIcon-xiazai header-text" ></i>
                        <span class="header-text">保存并下载</span>
                    </div>
                    <div class="common-top-icon" @click="shares" style="cursor: pointer;">
                        <i class="dvIcon dvIcon-fenxiang header-text"></i>
                        <span class="header-text">保存并分享</span>
                    </div>
                    <div class="common-top-icon" style="cursor: pointer;" @click="handleCastToBigScreen">
                        <i class="dvIcon dvIcon-feiji header-text" ></i>
                        <span class="header-text">保存并上屏</span>
                    </div>
                    <div class="common-top-icon" @click="previewResource" style="cursor: pointer;">
                        <i class="dvIcon dvIcon-yanjing header-text" ></i>
                        <span class="header-text">保存并预览</span>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex;flex-direction: row;width: 100%;height: 100%">
            <modelLeft :leftSwitch="leftSwitch" @chang-left-switch ="changeLeftSwitch"/>
            <modelCenter :rightSwitch="rightSwitch" :slider-scale="currentZoom" :unit="screen" :leftSwitch="leftSwitch"/>
        </div>
        <DialogModal :showModal="sceneTemplateDialog" @closeModals="sceneTemplateDialog=false;sceneTemplateForm.fPresetTemplateName=''" :modalTitle="''">
            <template v-slot:container>
                <div class="modal-content">
                    <el-form  label-position="top" ref="sceneTemplateForm" :inline="true" :model="sceneTemplateForm" :rules="channelRules" style="width: 100%">
                        <el-col :span="24">
                            <el-form-item label="模板名称" prop="screenName" style="width: 100%">
                                <el-input v-model="sceneTemplateForm.fPresetTemplateName" required placeholder="请输入模板名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
            </template>
            <template v-slot:footer>
                <el-button  style="font-size: 12px" @click="sceneTemplateDialog=false;sceneTemplateForm.fPresetTemplateName=''">取消</el-button>
                <el-button type="primary" style="font-size: 12px" @click="submitSceneTemplate">确定</el-button>
            </template>
        </DialogModal>
        <DialogModal :showModal="editDialog" @closeModals="editDialog=false;" :modalTitle="'退出编辑'">
            <template v-slot:container>
                <div class="modal-content">
                    <span style="font-size: 14px">您将离开编辑页面,请确认您已保存,否则丢失</span>
                </div>
            </template>
            <template v-slot:footer>
                <el-button  style="font-size: 12px" @click="editDialog=false;">取消</el-button>
                <el-button type="primary" style="font-size: 12px" @click="goBack">确定</el-button>
            </template>
        </DialogModal>
        <div class="loding" v-if="showDownModal">
            <div class="lodingCenter"></div>
        </div>
        <DialogModal :showModal="showShareDialog" @closeModals="showShareDialog=false;" :modalTitle="'请复制分享链接'">
            <template v-slot:container>
                <div class="modal-content">
                    <a 
                        style="font-size: 14px;color: #fff"
                        :href="currentHerf"
                        target="_blank"
                    >
                        {{baseUrl}}VScenePreview?sceneId={{sceneId}}
                    </a>
                </div>
            </template>
            
        </DialogModal>
        <VPreview :showPreview="isPreviewShown" :type="6" :options="previewOptions" @close="handleClosePreview"></VPreview>
        <VSetBigScreenDialog
                :shown="isBigScreenDialogShown"
                :type="6"
                :isTemporal="false"
                :options="bigScreenOptions"
                @close="closeBigScreenDialog"></VSetBigScreenDialog>
    </div>
</template>

<script>
    import DialogModal from '../../components/DialogModal.vue';
    import domtoimage from 'dom-to-image'
    import modelLeft from './modelLeft.vue';
    import modelCenter from './modelCenter.vue';
    import modelRight from './modelRight';
    import { mapGetters } from "vuex";
    import {mapState} from 'vuex'
    import { CatalogService } from '@/api/service';
    import { sceneService, templateService } from "@/api/visual.js";
    import bus from "@/common/bus.js";
    import VPreview from '../../components/VPreview.vue';  //预览弹框
    import VSetBigScreenDialog from '../../components/VSetBigScreenDialog';  //预览弹框
    import config from '../../common/basic-configuration';
    // 截图依赖
    import html2canvas from "html2canvas";
    const BASE_API= config.BASE_API;

    export default {
        components:{
            modelLeft,modelRight,modelCenter,DialogModal,VPreview, VSetBigScreenDialog
        },
        data(){
            return {
                baseUrl: '', //BASE_API 当前ip
                currentHerf: "",
                leftSwitch: false,
                rightSwitch: false,
                sliderScale: 1,
                sceneTemplateDialog: false,
                editDialog: false,
                screen: {
                    //大屏名字
                    screenName: "",
                    //大屏高
                    height: null,
                    //大屏宽
                    width: null,
                    //大屏信息
                    temInfor: {},
                    //是否展示布局
                    showUnit: true //true 空模板 false 有模板
                },
                showDownModal: false, // 显示下载时的加载
                sceneId: '',
                oldSceneId: '',
                templateId: '',
                templateInfo: '',
                // resourceList: [],
                currentZoom: 1,
                sceneInfo: {},
                sceneTemplateForm: {
                    fPresetTemplateName: "",
                    fWidth: 1920,
                    fWidth: 1080,
                    fId: "",
                    relevamnces: []
                },
                //规则
                channelRules:{
                  fPresetTemplateName: [
                    { required: true, message: '必填项', trigger: 'blur' },
                    { max: 100, message: "模板名称不能超过100个字符", trigger: "blur" }
                  ],
                },
                currentStram: false,
                isPreviewShown: false, //控制窗口显示,
                previewOptions: {  //预览条件id
                    id: ""
                },
                showShareDialog: false,  //展示分享条件

                isBigScreenDialogShown: false, //是否显示投屏弹框
                bigScreenOptions: {}, //投屏参数
            }
        },
        computed: {
            ...mapGetters(["resourceList",'showTemplate']),
        },
        
        mounted () {
            //初始化
            this.init(this.$route.query);
            // 根据场景id获取场景信息
            this.getResourceById();
            // 订阅事件
            this.changedScreen();
            //请求ip
            this.getBaseUrl()
            
        },
        methods: {
            //初始化数据
            init(data) {
                this.$store.dispatch("setData", []);
                if (this.$route.query.param) {
                    
                    let param = JSON.parse(data.param);
                    this.sceneId = param.sceneId;
                    this.oldSceneId = param.oldSceneId;
                    this.templateId = param.templateId;
                    this.templateInfo = param.temInfor;
                    this.screen = {
                        ...this.screen,
                    }
                } else {
                    //场景的编辑入口
                    let param = this.$route.query;
                    this.sceneId = param.sceneId;
                }
                this.sceneTemplateForm.fId = this.sceneId;

                
            },
            //改变值控制左侧显示
            handleLeftPanel(){
                this.leftSwitch = !this.leftSwitch;
            },
            //获取左侧传来的值控制显示
            changeLeftSwitch(value) {
                this.leftSwitch = value.leftSwitch;
            },
            //改变值控制右侧显示
            handleRightPanel(){
                this.rightSwitch = !this.rightSwitch;
            },
            //根据场景id获取场景信息
            async getResourceById() {
                let fid = this.sceneId;
                if (!fid) {
                    return;
                }
                let res = await sceneService.getSceneById(fid);
                if (res.success) {
                    if (res.obj != undefined) {
                    this.sceneInfo = res.obj;

                    this.screen.width = this.sceneInfo.fWidth;
                    this.screen.height = this.sceneInfo.fHeight;
                    this.screen.screenName = this.sceneInfo.fName;
                    this.screen = {
                        ...this.screen,
                    }
                    this.sceneTemplateForm.fWidth = this.screen.width;
                    this.sceneTemplateForm.fHeight = this.screen.height;
                    this.sceneTemplateForm = {
                        ...this.sceneTemplateForm
                    }
                    
                    //设置最佳缩放比
                    let height = this.$el.querySelector(".center-contents").offsetHeight;
                    let currentZoom = Math.round(((height-65) / this.screen.height)*10);
                    this.currentZoom =  currentZoom/10 > 2? 2: currentZoom/10;

                    if (this.templateId && this.templateInfo == undefined) {
                        //模板场景
                        this.getLayoutByTemplateId();
                    } else if (this.oldSceneId) {
                        //选择场景进入
                        this.getSceneLayoutById(this.oldSceneId);
                    } else {
                        //自定义或者编辑
                        this.getSceneLayoutById(this.sceneId);
                    }
                    
                    } else {
                    this.$message.warning(res.msg);
                    }
                } else {
                    this.$message.error(res.msg);
                }
            },
            //查询模板
            async getLayoutByTemplateId() {
                let fid = this.templateId;
                this.anotherGetSceneLayoutById(this.sceneId);
                let res = await templateService.getTemplateById(fid);
                if (res.success) {
                    if (res.obj != undefined) {
                    this.resourceList = [];
                    res.obj.forEach((item, index) => {
                        let pxSize = this.getPxSize(item);
                        let len = this.resourceList.length;

                        this.resourceList.push({
                            fLayoutNo: len,
                            left: pxSize.left,
                            top: pxSize.top,
                            width: pxSize.width,
                            height: pxSize.height,
                            active: false,
                            draggable: this.templateId ? false : true,
                            resizable: this.templateId ? false : true,
                            resource: null, //item,
                            zIndex: len
                        });
                    });
                   
                    this.$store.dispatch("setShowTemplate",false)
                    this.$store.dispatch("setData", this.resourceList);
                    } else {
                    this.$message.warning(res.msg);
                    }
                } else {
                    this.$message.error(res.msg);
                }
            },
            changedScreen() {
                // bus.$emit('eventFromLayout', this.elements[index]);
                let that = this;
                bus.$on("onScreenChange", function(screen) {
                    that.screen.width = screen.width || 1920;
                    that.screen.height = screen.height || 1080;
                    that.sceneTemplateForm.fWidth = that.screen.width;
                    that.sceneTemplateForm.fHeight = that.screen.height;
                    that.isSaveDisable = !(that.screen.width > 0 && that.screen.height > 0);
                });
                bus.$on("onApplyTemplate", function(template) {
                    that.applyTemplate(template);
                });
            },
            //应用模板
            async applyTemplate(template) {
                let that = this;
                that.templateId = template.fId;
                bus.$emit("onApplyTemplateId", that.templateId);
                that.$store.dispatch("setShowTemplate",false)
                this.templateInfo = undefined;
                //场景的分辨率进行赋值
                that.screen.width = that.screen.width || 1920;
                that.screen.height = that.screen.height || 1080;
                //将数组清空
                that.resourceList.splice(0, that.resourceList.length);
                //应用模板后当前场景中的资源进行更新
                template.templateLayouts.forEach((item, index) => {
                    let pxSize = that.getPxSize(item);
                    let len = that.resourceList.length;
                    that.resourceList.push({
                    fLayoutNo: len,
                    left: pxSize.left,
                    top: pxSize.top,
                    width: pxSize.width,
                    height: pxSize.height,
                    active: false,
                    draggable: false,
                    resizable: false,
                    resource: null, //item,
                    zIndex: len
                    });
                });
                that.resourceList = that.resourceList;
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
            //copy
            async anotherGetSceneLayoutById(fid) {
                let res = await sceneService.getSceneLayoutById(fid);
                
                if (res.success) {
                    if (res.obj != undefined) {
                        this.resourceList = [];
                        res.obj.forEach((item, index) => {
                            let pxSize = this.getPxSize(item);
                            let len = this.resourceList.length;
                                this.resourceList.push({
                                    fLayoutNo: len,
                                    left: pxSize.left,
                                    top: pxSize.top,
                                    width: pxSize.width,
                                    height: pxSize.height,
                                    active: false,
                                    draggable: this.templateId ? false : true,
                                    resizable: this.templateId ? false : true,
                                    resource: item,
                                    zIndex: len
                                });
                        });
                    } else {
                    this.$message.warning(res.msg);
                    }
                } else {
                    this.$message.error(res.msg);
                }
            },
            //根据场景id查询场景布局
            async getSceneLayoutById(fid) {
                let res = await sceneService.getSceneLayoutById(fid);
                
                if (res.success) {
                    if (res.obj != undefined) {
                        this.resourceList = [];
                        res.obj.forEach((item, index) => {
                            let pxSize = this.getPxSize(item);
                            let len = this.resourceList.length;
                                this.resourceList.push({
                                    fLayoutNo: "",
                                    left: pxSize.left.toFixed(1)*1,
                                    top: pxSize.top.toFixed(1)*1,
                                    width: pxSize.width.toFixed(1)*1,
                                    height: pxSize.height.toFixed(1)*1,
                                    active: true,
                                    draggable: this.templateId ? false : true,
                                    resizable: this.templateId ? false : true,
                                    resource: item,
                                    zIndex: 1
                                });
                        });
                        this.$store.dispatch("setShowTemplate",true)
                        this.$store.dispatch("setData", this.resourceList);
                    } else {
                    this.$message.warning(res.msg);
                    }
                    if (this.templateInfo&&this.templateInfo!=undefined) {
                        //模板场景
                        this.getStaticLayoutByTemplateId();
                        
                    }
                } else {
                    this.$message.error(res.msg);
                }
            },
            //模板
            getStaticLayoutByTemplateId() {
                let fid = this.templateId;
                let res = this.templateInfo;
                
                if (res&&res != undefined) {
                
                    this.resourceList = [];
                    res.forEach((item, index) => {
                        let pxSize = this.getPxSize(item);
                        let len = this.resourceList.length;

                        this.resourceList.push({
                        fLayoutNo: len,
                        left: pxSize.left,
                        top: pxSize.top,
                        width: pxSize.width,
                        height: pxSize.height,
                        active: false,
                        draggable: false,
                        resizable: false,
                        resource: null, //item,
                        zIndex: len
                        });
                    
                    });
                    this.$store.dispatch("setData", this.resourceList);
                    this.$store.dispatch("setShowTemplate",false)
                } else {
                    this.$message.warning("");
                }
            
            },
            //保存场景信息
            async  saveScene() {
                if(this.templateId.length == 3){
                    this.templateId = "";
                }
                let params = {
                    fHeight: this.screen.height, //高
                    fId: this.sceneInfo.fId, //场景id

                    fIsUseTemplate: this.templateId ? true : false, //是否使用模板
                    fPresetTemplateId: this.templateId, //预置模板id

                    fWidth: this.screen.width, //宽
                    relevamnces: []
                };
                this.resourceList.forEach((item, index, array) => {
                    let ratioSize = this.getRatioSize(item);
                    let resId =
                    item.resource &&
                    (item.resource.fShowResourceGroupId || item.resource.fId);
                    if (resId) {
                        params.relevamnces.push({
                            fHeight: ratioSize.height, //高
                            fShowResourceGroupId: resId, //资源id
                            fWidth: ratioSize.width, //宽
                            fX: ratioSize.left, //x位置
                            fY: ratioSize.top, //y位置
                            fZIndex: params.relevamnces.length //层级
                        });
                    }
                });
                // this.html2canvasPrint();
                let res = await sceneService.saveScene(params);
                if (res.success) {
                    //更换路由参数
                    let param = {
                        templateId: this.templateId,
                        oldSceneId: this.templateId ? "" : this.oldSceneId,
                        sceneId: this.sceneId,
                        temInfor: this.templateInfo
                    };
                    this.$router.replace({
                        path: this.$route.path,
                        query: { param: JSON.stringify(param) }
                    });
                    this.html2canvasPrint();
                    this.$message.success('保存'+res.msg);
                } else {
                    this.$message.error(res.msg);
                }
            },
            ////保存场景信息
            saveTemplateByScene() {
                this.sceneTemplateDialog = true;
            },
            // 资源组弹层提交按钮
            async submitSceneTemplate() {
                let canSubmit = false;
                if(this.sceneTemplateForm.fPresetTemplateName == ''){
                    this.$errorMsg("请填写名称");
                    return;
                }else{
                    canSubmit = true;
                    this.sceneTemplateDialog = false;
                }
                if (canSubmit) {
                    this.sceneTemplateForm.relevamnces = [];
                    this.resourceList.forEach((item, index, array) => {
                        let ratioSize = this.getRatioSize(item);
                        this.sceneTemplateForm.relevamnces.push({
                            fHeight: ratioSize.height, //高
                            fWidth: ratioSize.width, //宽
                            fX: ratioSize.left, //x位置
                            fY: ratioSize.top, //y位置
                            fZIndex: item.zIndex //层级
                        });
                    });
                    let res = await sceneService.saveTemplateByScene(this.sceneTemplateForm);
                    
                    if (res.success) {
                        this.sceneTemplateDialog = false;
                        this.$message.success(res.msg);
                    } else {
                        this.$message.warning(res.msg);
                    }
                }
            },
            // 截图
            html2canvasPrint() {
                let that = this;
                // let fitSize = this.getFitSize();
                let content_html = this.$el.querySelector(".data-content");

                console.log(content_html)
                // let scaleBy = this.sliderScale;
                // 进行截图
                domtoimage.toPng(content_html)
                    .then((dataUrl) => {
                        if(this.currentStram){
                            let link = document.createElement('a');
                            link.download = 'my-image-name.jpeg';
                            link.href = dataUrl;
                            link.click();
                            this.currentStram = false
                        }
                        this.getUrlBase64(dataUrl,'jpeg', function (base64) {
                            that.printSceneSubmit(base64)
                        });
                    })
                    .catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });
                    
            },
            /**
             *
             * @param url 图片路径
             * @param ext 图片格式
             * @param callback 结果回调
             */
            getUrlBase64(url, ext, callback) {
                let width = this.$el.querySelector(".data-content").offsetWidth;
                let height = this.$el.querySelector(".data-content").offsetHeight;
                

                var canvas = document.createElement("canvas");   //创建canvas DOM元素
                var ctx = canvas.getContext("2d");
                // ctx.rect(0,0,150,100);
                var img = new Image;
                img.crossOrigin = 'Anonymous';
                img.src = url;
                let that = this;
                
                img.onload = function () {
                    
                    let heightZ = height*that.currentZoom;
                    let widthZ = width*that.currentZoom;

                    canvas.height = heightZ; //指定画板的高度,自定义
                    canvas.width = widthZ; //指定画板的宽度，自定义
                    ctx.drawImage(img, -60, -40,width, height); //参数可自定义
                    var dataURL = canvas.toDataURL("image/" + ext);
                    callback.call(this, dataURL); //回掉函数获取Base64编码
                    canvas = null;
                };
                // canvas.style.position = 'fixed';
                //                             canvas.style.top = '0';
                //                             canvas.style.left = '0';
                //                             // canvas.style.opacity = '0';
                //                             canvas.style.zIndex = '99999999';
                //                             document.body.appendChild(canvas);
            },

            //场景截图信息
            async printSceneSubmit(data) {
                let stream = data.split(";base64,")[1];
                this.stream = stream;
                let params = {
                    fFileStr: this.stream,
                    fId: this.sceneInfo.fId //场景id
                };
               
                let res = await sceneService.printscreen(params);
                if (res.success) {
                    this.$message.success('截图'+res.msg);
                } else {
                    this.$message.error(res.msg);
                }
            },
            //下载
            downLoad(){
                this.currentStram = true;
                this.saveScene();
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
            setFitLayout(flag) {
                
                // let fitSize = this.getFitSize();
                if (flag == "overflowHidden") {
                    //不出现滚动条

                    this.defaultScale = fitSize.scale;
                    this.sliderScale = fitSize.scale;
                    content_html.style.transformOrigin = "0 0";
                    content_html.style.transform = "scale(" + fitSize.scale + ")";

                    this.isFitLayout = true;
                } else {
                    if (this.sliderScale > this.defaultScale) {
                    //出现滚动条
                    this.isFitLayout = false;

                    // this.sliderScale = fitSize.scale;
                    } else {
                    //不出现滚动条
                    this.isFitLayout = true;
                    }
                    content_html.style.transformOrigin = "0 0";
                    content_html.style.transform = "scale(" + this.sliderScale + ")";
                }
            },
            //缩放
            zoom(type){
                if(type == "add"){
                    if(this.currentZoom >= 2){
                        this.currentZoom == 2;
                        return;
                    }
                    if(this.currentZoom == 0.1){
                        this.currentZoom = 0.2;
                        return;
                    }

                    this.currentZoom = (this.currentZoom *10+2)/10;
                    return;
                }
                if(type == "press"){
                    if(this.currentZoom <= 0.2){
                        this.currentZoom = 0.1;
                        return;
                    }
                    this.currentZoom = (this.currentZoom*10-2)/10;
                    return;
                }
            },
            //返回按钮
            goBack(){
                this.editDialog = false;
                this.$router.replace({
                        path: 'sceneManage',
                });
            },
            //分享
            shares(){
                this.saveScene();
                this.currentHerf = this.baseUrl+'VScenePreview?sceneId='+this.sceneId
                // this.baseApi = window.location.origin
                this.showShareDialog = true;
            },
            //改变当前缩放
            changeZoom(val){
                this.currentZoom = val/100;
            },
            //乘法 
            accMul(arg1,arg2){  
                var m=0,s1=arg1.toString(),s2=arg2.toString();  
                try{m+=s1.split(".")[1].length}catch(e){}  
                try{m+=s2.split(".")[1].length}catch(e){}  
                return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)  
            },
            /**
             * 关闭预览弹框
             */
            handleClosePreview() {
                this.isPreviewShown = false;
            },
            /**
             * 预览资源
             * @param resource
             */
            previewResource(){
                this.saveScene();
                this.previewOptions= {
                  id: this.sceneId
                }
                this.isPreviewShown = true;
            },
            //撤销当前,回复之前的图案
            delectLastItem(){
                let delNum = this.resourceList.length;
                if( delNum > 0){
                    this.resourceList[delNum-1].resource = null;
                    this.resourceList[delNum-1].isDelete = true;
                    let list = [
                        ...this.resourceList
                    ];
                    list.splice(delNum-1, 1);
                    this.$store.dispatch("setData", list);
                }
            },
            /**
             * 
             * 获取打开资源路径
             */
             async getBaseUrl(){
                 let res = await CatalogService.getDictionaryContext("url_screenshare","url");
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

            /**
             * 投屏场景
             */
            async handleCastToBigScreen() {
                if (this.resourceList && this.resourceList.length) {
                    await this.saveScene();
                    this.castToBigScreen();
                } else {
                    this.$message.error('场景没有资源！');
                }
            },

            /**
             * 投屏显示组
             * @param {Object} item --- 显示组对象
             * @author 元实
             */
            castToBigScreen() {
                this.setCastOptions();
                this.isBigScreenDialogShown = true;
            },

            /**
             * 设置投屏参数
             * @param {Object} item --- 显示组对象
             * @author 元实
             */
            setCastOptions() {
                this.bigScreenOptions = {
                    id: this.sceneId,
                    name: this.screen.screenName
                }
            },

            /**
             * 关闭投放大屏弹框
             */
            closeBigScreenDialog() {
                this.isBigScreenDialogShown = false;
            }
        },
       
    }
</script>
<style>
    .el-input-number--mini{
        line-height: 23px !important;
    }
    .el-input-number__decrease, .el-input-number__increase {
        background: #0e1013 !important;
        top: 1px !important;
        border: 1px solid #282f3a !important;
    }
    .el-input__inner{
        color: #fff !important;
    }
</style>
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
            height: 40px;
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
                justify-content: space-between;
                width: 100%;
                height: 100%;
                
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
                    // flex-direction: column;
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
    .loding{
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        right: 0;
        z-Index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.5);
        .lodingCenter{
            border: 3px solid hsla(185, 100%, 62%, 0.2);
            border-top-color: #3cefff;
            border-radius: 50%;
            width: 3em;
            height: 3em;
            animation: spin 1s linear infinite;
        }   
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    }
    
</style>
<style scoped>
    a:visited{
        color: #800080;
    }
    
    .el-input-number--mini{
        line-height: 23px !important;
    }
    .el-input-number__decrease, .el-input-number__increase {
        background: #0e1013 !important;
        top: 1px !important;
        border: 1px solid #282f3a !important;
    }
    .el-input__inner{
        color: #fff !important;
    }
</style>