<template>
      <div class="creat-screen-page">
            <div class="module-top">
                <div class="skew-decorator"></div>
                <div class="cancel-btn">
                    <el-button type="text" style="font-size:14px;color: #fff;" @click="cancleInsert">取消创建</el-button>
                </div>
            </div>
            <div class="module-wp">
                <div class="module-outline">
                    <div class="module-inline">
                        <div class="template-preview">
                            <div class="preview-content">
                                <div class="preview-content-div" id="preview-div" @mouseleave="outPreview()" @mouseenter="overPreview()">
                                    <el-button type="primary" plain @click="creatScene" class="creat-btn" v-if="creatBtnState">创建</el-button>
                                    <div v-if="overlayerState" class="overlayer"></div>
                                    <img :src="pictureUrl + temInfor.fImageUrl" :onerror="defaultImag" width="100%" height="100%" v-if="activeName == 'second' && temInfor.fImageUrl != undefined">
                                    <div v-else :style="{width: temInfor.fWidth + 'px', height: temInfor.fHeight + 'px', 'transform': 'scale('+temInfor.wRatio+','+ temInfor.hRatio+')'}" class="preview-thumbnail-div">
                                        <div class="preview-layout-div" :style="{top: ii.fY + '%', left: ii.fX + '%', width: ii.fWidth + '%', height: ii.fHeight + '%'}" v-for="(ii,index) in temInfor.templateLayouts" :key="index">

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="preview-title">
                    <div>
                        {{activeName == 'first'? '请选择模板': '请选择场景'}}
                    </div>
                </div>
                <div class="template-list">
                    <div class="current-data" @mouseleave="hiddenButton" @mouseenter="showButton">
                        <el-tabs v-model="activeName" style="flex-direction: column" type="card" @tab-click="handleClick(activeName)">
                            <el-tab-pane  label="模板布局" name="first" class="template-container" id="template-container">
                                <div  style="width: 140px;height: 100%;margin-left: 20px">
                                    <div  class="template-selector-item blank-template" :class="isSelected_Tem" @click="clicktem_whiteBlank(isSelected_Tem)">
                                        <div class="template-thumbnail-wp">
                                        </div>
                                        <div class="template-desc">
                                            <div class="desc-name ellipsis-2">
                                                空白
                                            </div>
                                            <div class="desc-name ellipsis-2">
                                                尺寸自定义
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div  style="width: 140px;height: 100%;margin-left: 20px">
                                    <div  class="template-selector-item blank-template" :class="isSelected_Edit" @click="clicktem_EditBlank(isSelected_Edit)">
                                        <div class="template-thumbnail-wp box-content">
                                            <span style="font-size: 14px">创建快捷模板</span>
                                        </div>
                                        <div class="template-desc">
                                            <div class="desc-name ellipsis-2">
                                                创建快捷模板
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div v-if="selectShortCutTemp" class="template-selector" >
                                    <div class="template-selector-item blank-template" :class="selectShortCut" @click="clicktem_shortCut(selectShortCut)">
                                        <div class="template-thumbnail-wp">
                                            <div style="width:100%;height:100%;" class="thumbnail-div">
                                                <div :style="{top: ii.fY + '%', left: ii.fX + '%', width: ii.fWidth + '%', height: ii.fHeight + '%'}" v-for="(ii,index) in shortcutTempInfo.templateLayouts" :key="index" class="layout-div">

                                                </div>
                                            </div>
                                        </div>
                                        <div class="template-desc">
                                            <div class="desc-name ellipsis-2">
                                            {{shortcutTempInfo.fName}}
                                            </div>
                                            <div class="desc-name ellipsis-2">
                                            {{shortcutTempInfo.fWidth}} x {{shortcutTempInfo.fHeight}}
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="template-selector">
                                    <div class="template-selector-item" :class="item.isSelected" v-for="(item, index) in templates" :key="index" @click="clicktem(item)">
                                        <div class="template-thumbnail-wp">
                                            <div :style="{width: item.fWidth + 'px', height: item.fHeight + 'px', 'transform': 'scale('+140/item.fWidth+','+ 79/item.fHeight+')'}" class="thumbnail-div">
                                                <div :style="{top: ii.fY + '%', left: ii.fX + '%', width: ii.fWidth + '%', height: ii.fHeight + '%'}" v-for="(ii,index) in item.templateLayouts" :key="index" class="layout-div">
                                                
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
                                            <!-- <div class="desc-name ellipsis-2">
                                                比例
                                            </div> -->
                                            <div class="desc-name ellipsis-2">
                                                {{item.fWidth}} x {{item.fHeight}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="场景布局" name="second" class="template-container" id="scene-container">
                                <div style="width: 140px;height: 100%;margin-left: 20px">
                                    <div class="template-selector-item blank-template" :class="isSelected_Scene" @click="clickScene_whiteScene(isSelected_Scene)">
                                        <div class="template-thumbnail-wp">
                                        </div>
                                        <div class="template-desc">
                                            <div class="desc-name ellipsis-2">
                                                空白
                                            </div>
                                            <div class="desc-name ellipsis-2">
                                                尺寸自定义
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="template-selector">
                                    <div class="template-selector-item" :class="item.isSelected" v-for="(item, index) in scenes" :key="index" @click="clickScene(item)">
                                        <div class="template-thumbnail-wp">
                                            <img :src="pictureUrl + item.fImageUrl" :onerror="defaultImag" width="100%" height="100%" alt="">
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
                                            <!-- <div class="desc-name ellipsis-2">
                                                比例
                                            </div> -->
                                            <div class="desc-name ellipsis-2">
                                                {{item.fWidth}} x {{item.fHeight}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                            
                        </el-tabs>
                        <div class="el-carousel__arrow el-carousel-left"  @click="leftButton" style='display: block'>
                            <i class="dvIcon dvIcon-left" style="font-size: 16px;line-height: 34px"></i>
                        </div>
                        <div class="el-carousel__arrow el-carousel-right" @click="rightButton" style='display: block'>
                            <i class="dvIcon dvIcon-right" style="font-size: 16px;line-height: 34px"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 新建快捷模板 -->
             <DialogModal :showModal="shortCutModel" @closeModals="shortCutModel=false" :modalTitle="'快捷模板'">
                <template v-slot:container>
                    <div class="modal-content">
                        <el-form :model="currentShortCutForm" :rules="shortCutFormRules" ref="currentShortCutForm" label-width="80px">
                            <el-row>
                                <el-col :span="23">
                                    <el-form-item label="模板高" prop="fHeight">
                                        <el-input
                                            size="small" min="1" type="number" maxlength="50"
                                            @input="value => currentShortCutForm.fHeight = value.replace(/\s/i, '')"
                                            :value="currentShortCutForm.fHeight" placeholder="请输入模板的高度(px)"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="23">
                                    <el-form-item label="模板宽" prop="fWidth">
                                        <el-input
                                            size="small" min="1" type="number" maxlength="50"
                                            @input="value => currentShortCutForm.fWidth = value.replace(/\s/i, '')"
                                            :value="currentShortCutForm.fWidth" placeholder="请输入模板的宽度(px)"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="23">
                                    <el-form-item label="行" prop="row">
                                        <el-input
                                            size="small" min="1" type="number" maxlength="50"
                                            @input="value => currentShortCutForm.row = value.replace(/\s/i, '')"
                                            :value="currentShortCutForm.row" placeholder="请输入模板的行数"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="23">
                                    <el-form-item label="列" prop="col">
                                        <el-input
                                            size="small" min="1" type="number" style="width: 100%"
                                            @input="value => currentShortCutForm.col = value.replace(/\s/i, '')"
                                            :value="currentShortCutForm.col" placeholder="请输入模板的列数"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </template>
                <template v-slot:footer>
                    <el-button style="float:right" type="primary" @click="submitNewTemp('currentShortCutForm')" size="small">确定</el-button>
                    <el-button style="float:right" @click="resetNewTemp('currentShortCutForm')" size="small">取消</el-button>
                </template>
            </DialogModal>
            <!-- 新增 -->
            <DialogModal :showModal="showModal" @closeModals="closeCurrentModal" :modalTitle="'创建大屏'">
                <template v-slot:container>
                    <div class="modal-content">
                        <el-form  label-position="top"  ref="unit" :inline="true" :model="unit" :rules="channelRules" style="width: 100%">
                            <el-col :span="24">
                                <el-form-item label="名称" prop="screenName" style="width: 100%">
                                    <el-input
                                            @input="value => unit.screenName = value.replace(/\s/i, '')"
                                            required
                                            :value="unit.screenName" placeholder="请输入场景名称"></el-input>
                                </el-form-item>
                            </el-col>
                            
                            <el-col :span="24">
                                <el-form-item label="类型" prop="type" style="width: 100%">
                                    <el-select v-model="unit.fTypeId" required style="width: 100%" placeholder="请选择场景类型">
                                        <el-option v-for="item in allSceneType" :value="item.fId" :key="item.fId" :label="item.fName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="24">
                                <el-form-item label="大屏"  style="width: 100%">
                                    <el-select v-model="screenDetal"  clearable style="width: 100%" placeholder="请选择要匹配的大屏">
                                        <el-option v-for="item in allScreens" :value="item" :key="item.fId" :label="item.fName">
                                            <span style="float: left">{{ item.fName }}</span>
                                            <span style="margin-left: 20px">ip:{{ item.fIp }}</span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fWidth }} * {{ item.fHeight }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"  style="display:flex;flex-direction: row">
                                    <el-form-item label="高" prop="screenHeight" style="width: 100%">
                                        <el-input
                                            max="20000"  placeholder="px" required
                                            @input="value => unit.screenHeight = value.replace(/\s/i, '')"
                                            :value="unit.screenHeight" ></el-input>
                                    </el-form-item>
                            </el-col>
                            <el-col :span="6"  style="margin-left: 30px;display:flex;flex-direction: row">
                                    <el-form-item label="宽" prop="screenWidth" style="width: 100%">
                                        <el-input
                                            max="20000"  placeholder="px"
                                            @input="value => unit.screenWidth = value.replace(/\s/i, '')"
                                            required
                                            :value="unit.screenWidth" ></el-input>
                                    </el-form-item>
                            </el-col>
                            <el-col :span="6"  style="margin-left: 30px;display:flex;flex-direction: row">
                                    <el-form-item style="width: 100%">
                                        <span style="color: #409EFF" @click="changeAffirmScreen">选择默认尺寸(px)</span>
                                    </el-form-item>
                            </el-col>
                        </el-form>
                        
                    </div>

                </template>
                <template v-slot:footer>
                    <el-button type="primary" style="font-size: 12px" @click="addbutton">创建</el-button>
                </template>
            </DialogModal>
                        
      </div>
</template>

<script>
    import DialogModal from '../../components/DialogModal.vue';
    // 引入api
    import { templateService, layoutService, sceneService }  from '@/api/visual'

    export default {
        data(){
            return{
                defaultImag: 'this.src="' + require('../../image/common/noFile.png') + '"',  //出错时显示图片
                screenDetal: "",
                unit: {
                    //场景名字
                    screenName: "",
                    //场景高
                    screenHeight: 1,
                    //场景宽
                    screenWidth: 1,
                    //场景类型
                    fTypeId:'',
                    //场景名称
                    fName: '',
                    //大屏id
                    screenfId: ""
                },
                //规则
                channelRules:{
                  screenName: [
                    { required: true, message: '必填项', trigger: 'blur' },
                  ],
                  type: [
                    { required: true, message: "必填项", trigger: "blur" }
                  ],
                  screenHeight: [
                    { required: true, message: "必填项", trigger: "blur" },
                  ],
                  screenWidth: [
                    { required: true, message: "必填项", trigger: "blur" }
                  ],
                },
                //类型
                allSceneType: [],
                //新建控制
                showModal: false,
                //控制显示按钮
                activeName: 'first',
                isSelected_Tem: 'selected',
                isSelected_Scene: 'selected',
                creatBtnState: false,
                overlayerState: false,
                //模板列表
                templates: [],
                // 模板请求对象
                templateReqObj: {
                    currentPage: 1, // 当前页
                    fName: '',      // 模板名称
                    pageSize: 10,// 分页大小
                },
                temInfor: {},

                //场景布局列表
                scenes: [],
                // 场景请求对象
                scenesReqObj: {
                    currentPage: 1,          // 当前页
                    fScencName: '',          // 场景名称
                    fSceneTypeId: [],        // 场景类型id集合
                    pageSize: 10,             // 每页条数
                },
                size_st: 0,// 每次应该加载个数

                param: {
                    templateId: '',
                    sceneId: '',
                    oldSceneId: ''
                },
                showUnit: true,
                anotherUnit: true,
                currentScenesData: {},
                currentTemplatesData: {},
                moveNum: 0,
                shortCutModel: false,
                isSelected_Edit: "",
                shortCutFormRules: {
                    fWidth: [
                        {required: true, message: '模板宽不能为空，或输入错误', trigger: 'blur'},
                    ],
                    fHeight: [
                        {required: true, message: '模板高能为空，或输入错误', trigger: 'blur'},
                    ],
                    row: [
                        {required: true, message: '行数不能为空，或输入错误', trigger: 'blur'},
                    ],
                    col: [
                        {required: true, message: '列数不能为空，或输入错误', trigger: 'blur'},
                    ]
                },
                shortCutForm: {},
                currentShortCutForm: {},
                selectShortCutTemp: false,
                shortcutTempInfo: {
                    fWidth:0,
                    fHeight:0,
                    templateLayouts:[],
                },
                //大屏所有数据
                allScreens: [],
                //当前大屏
                currentAllScreens: {},
                //当前存在的值
                currentObj: ""
            }
        },
        mounted() {
            // 获取类型集合
            this.getType();
            // 默认选中模板布局
            this.handleClick('first');
            // 获取所有可选大屏
            this.getBigScreens();
        },
        components: {
          DialogModal,
        },
        methods: {
            // //新建编辑页面
            screenEdit() {
                this.showModal = true
                this.unit.screenName = "";
                this.unit.screenHeight = null;
                this.unit.screenWidth = null;
                this.unit.fTypeId = "";
                this.unit.fName = "";
            },
            //鼠标点击关闭弹框
            closeModal(){
              this.showModal = false
            },
            // 新建按钮
            async addbutton() {
                if(this.unit.screenName == ""){
                    this.$errorMsg("请填写屏幕名字");
                    return;
                }
                if(this.unit.screenHeight == null){
                    this.$errorMsg("请填写屏幕高度");
                    return;
                }
                if(this.unit.screenWidth == null){
                    this.$errorMsg("请填写屏幕宽度");
                    return;
                }
                if(isNaN(this.unit.screenHeight*1)){
                    this.$errorMsg("请检查屏幕高度是否为数字");
                    return;
                }
                if(isNaN(this.unit.screenWidth*1)){
                    this.$errorMsg("请检查屏幕宽度是否为数字");
                    return;
                }
                if(this.unit.fTypeId == ''){
                    this.$errorMsg("请填写选择类型");
                    return;
                }
                let params = {fName: this.unit.screenName,fTypeId: this.unit.fTypeId,fWidth: this.unit.screenWidth,fheight:this.unit.screenHeight}
                let res = await sceneService.insertScene(params);
                if (res.success) {
                    this.param.sceneId = res.obj;
                    this.$message.info(res.msg);
                    this.showModal = false
                    this.$router.replace({
                        path:"/addModal",
                        query:{
                            param: JSON.stringify(this.param),
                        }
                    });
                }else{
                    this.$message.warning(res.msg);
                }
            },
            // 获取大屏信息
            async getBigScreens(){
                const res = await layoutService.getBigScreens();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.allScreens = res.obj;
                    } else {
                        this.allScreens = [];
                    }
                } else {
                    this.allScreens = [];
                }
            },
            //左侧按钮
            leftButton (){
                let content_html = this.$el.querySelector(".el-tabs__content");
                if(this.moveNum == 0) {
                    return;
                }else{
                    this.moveNum -= 1;
                    if(content_html.style.left){
                        content_html.style.left = parseInt(content_html.style.left) + 1000 + "px"
                    }else{
                        content_html.style.left =  1000 + "px"
                    }
                }
            },
            //右侧按钮
            rightButton (){
                    let content_html = this.$el.querySelector(".el-tabs__content");
                    if(this.activeName == 'first'){
                        if(this.templateReqObj.pageSize >= this.currentTemplatesData.itemTotal){
                            this.moveLeft()
                            return;
                        }
                        this.templateReqObj.pageSize = this.templateReqObj.pageSize + 10
                        this.getTemplatePages(this.templateReqObj);
                        setTimeout(() => {
                            this.moveLeft()
                        }, 500);
                    }else{
                        if(this.scenesReqObj.pageSize >= this.currentScenesData.itemTotal){
                            this.moveLeft()
                            return;
                        }
                        this.scenesReqObj.pageSize = this.scenesReqObj.pageSize + 10
                        this.getAllScene(this.scenesReqObj);
                        setTimeout(() => {
                            this.moveLeft()
                        }, 500);
                    }
                    
                    
            },
            //向左移动
            moveLeft(){
                let content_html = this.$el.querySelector(".el-tabs__content");
                if(this.moveNum >= this.maxMoveNum || this.maxMoveNum == 1) {
                    return;
                }else{
                    this.moveNum += 1;
                    setTimeout(() => {
                            if(content_html.style.left){
                                content_html.style.left = parseInt(content_html.style.left) - 1000 + "px"
                            }else{
                                content_html.style.left = - 1000 + "px"
                            }
                    },300)
                        
                }
            },
            //取消创建
            cancleInsert(){
                this.$router.replace({ path: '/sceneManage' });
            },
            //点击交换按钮
            handleClick(name){
                this.temInfor = {};
                this.moveNum = 0;
                this.templateReqObj.pageSize = 10;
                this.scenesReqObj.pageSize = 10;
                this.$el.querySelector(".el-tabs__content").style.left =  0 + "px"
                switch (name) {
                    case 'first':
                        this.getTemplatePages(this.templateReqObj);
                        break;
                    case 'second':
                        this.getAllScene(this.scenesReqObj);
                        break;
                }
            },
            // 获取类型集合
            async getType(){
                let res = await layoutService.getType();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.allSceneType = res.obj;
                    } else {
                        this.allSceneType = [];
                    }
                } else {
                    this.allSceneType = [];
                }
            },
            // 获取模板
            async getTemplatePages(obj){
                let res = await templateService.getTemplatePages(obj);
                if (res.success) {
                    
                    if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length > 0) {
                        for (let a of res.obj.items) {
                            a.wratio = 140/a.fWidth;
                            a.hratio = 79/a.fHeight;
                            // for (let b of a.templateLayouts) {
                            //     // w的缩放比
                            //     b.wratio = b.fWidth/a.fWidth;
                            //     // h的缩放比
                            //     b.hratio = b.fHeight/a.fHeight
                            // }
                        }
                        this.templates = res.obj.items;
                        this.currentTemplatesData= res.obj;
                        this.maxMoveNum =  Math.ceil(this.currentTemplatesData.itemTotal/7);
                    } else {
                       this.templates = [];
                    }
                } else {
                    this.templates = [];
                }
            },
            // 获取场景
            async getAllScene(obj){
                let res = await layoutService.getAllScene(obj);
                if (res.success) {
                    if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length > 0) {
                        this.scenes = res.obj.items;
                        this.currentScenesData = res.obj;
                        this.maxMoveNum =  Math.ceil(this.currentScenesData.itemTotal/7);
                    } else {
                        this.scenes = [];
                    }
                } else {
                    this.scenes = [];
                }
            },
            // 点击空白模板
            clicktem_whiteBlank(val){
                for (let a of this.templates) {
                    a.isSelected = '';
                }
                if (val == '') {
                    this.isSelected_Tem = 'selected';
                }
                
                // 清空空白模板de选中样式
                this.isSelected_Edit = '';
                this.selectShortCut = '';
                this.currentObj = '';

                this.temInfor = {};
                this.showUnit = true;
                this.$forceUpdate();
            },
            //点击编辑模块
            clicktem_EditBlank(val){
                for (let a of this.templates) {
                    a.isSelected = '';
                }
                if (val == '') {
                    this.isSelected_Edit = 'selected';
                }
                
                // 清空空白模板de选中样式
                this.isSelected_Tem = '';
                this.selectShortCut = '';

                this.temInfor = {};
                this.$forceUpdate();

                // 点击创建快捷模板
                this.showUnit = false
                this.shortCutModel = true;
                this.currentShortCutForm = {
                    row: 1,
                    col: 1,
                }
            },
            // 8.点击模板布局
            clicktem(obj){
                //设置当前存在的值
                this.currentObj = obj;
                // 清空其他模板de选中样式
                for (let a of this.templates) {
                    a.isSelected = '';
                    if (obj.fId == a.fId) {
                        this.$nextTick(()=>{
                            obj.isSelected = 'selected';
                            this.param.templateId = obj.fId;
                        })
                        this.$forceUpdate();
                    }
                }
                // 清空空白模板de选中样式
                this.isSelected_Tem = '';
                this.selectShortCut = '';
                 this.isSelected_Edit = '';
                // 赋值给预览
                let w = document.getElementById('preview-div').offsetWidth;
                let h = document.getElementById('preview-div').offsetHeight;
                obj.wRatio = w/obj.fWidth;
                obj.hRatio = h/obj.fHeight;
                this.temInfor = obj;
                this.showUnit = false;
                
            },
            overPreview(){
                this.creatBtnState = true;
                this.overlayerState = true;
            },
            // 创建按钮
            creatScene(){
                // 清空数据
                // this.sceneNameInfor.fName = '';
                // this.sceneNameInfor.fTypeId = '';
                // this.sceneNameForm = this.sceneNameInfor;
                if(this.currentObj){
                    this.unit.screenHeight = this.currentObj.fHeight;
                    this.unit.screenWidth = this.currentObj.fWidth;
                }else{
                    this.unit.screenHeight = 1;
                    this.unit.screenWidth = 1;
                }

                this.showModal = true
                this.unit.screenName = "";
                
                this.unit.fTypeId = "";
                this.unit.fName = "";
            },
            outPreview(){
                this.creatBtnState = false;
                this.overlayerState = false;
            },
            // 场景
            // 1.点击空白场景
            clickScene_whiteScene(val){
                for (let a of this.scenes) {
                    a.isSelected = '';
                }
                if (val == '') {
                    this.isSelected_Scene = 'selected';
                }
                this.$forceUpdate();
                this.currentObj = '';
                this.param.oldSceneId = '';
                this.param.templateId = '';
                this.temInfor = {};
                //设置宽高
                this.showUnit = true;
            },
            // 2.点击场景布局
            clickScene(obj){
                this.currentObj = obj;
                // 清空其他模板de选中样式
                for (let a of this.scenes) {
                    a.isSelected = '';
                    if (obj.fId == a.fId) {
                        this.$nextTick(()=>{
                            obj.isSelected = 'selected';
                            this.param.templateId = '';
                            this.param.oldSceneId = obj.fId;
                        })
                        this.$forceUpdate();
                    }
                }
                // 清空空白模板de选中样式
                this.isSelected_Scene = '';
                // 赋值给预览
                this.temInfor = obj;
                //不展示模板
                this.showUnit = true;
                this.anotherUnit = false;
            },
            hiddenButton(){
                this.$el.querySelector(".el-carousel-left").style.display = "none";
                this.$el.querySelector(".el-carousel-right").style.display = "none";
            },
            showButton(){
                this.$el.querySelector(".el-carousel-left").style.display = "block";
                this.$el.querySelector(".el-carousel-right").style.display = "block";
            },
            //快捷模板
            handleCommand(command) {
                if(command == '1'){
                   
                   this.shortCutNew();
                }
                if(command == ''){
                   this.showUnit = true
                   this.temInfor = {};
                   for (let a of this.templates) {
                    a.isSelected = '';
                    }
                   this.selectShortCutTemp = false;
                   this.isSelected_Tem = 'selected';

                }
                // this.$message('click on item ' + command);
            },
        
            // 确定创建快捷模板
            submitNewTemp(name){
                this.showUnit = false;
                let canSubmit = false;
                this.isSelected_Edit = '';
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        canSubmit = true;
                    } else {
                        this.$message.error('必填项输入为空或错误！');
                        return false;
                    }
                });
                if (canSubmit) {
                    for (let a of this.templates) {
                        a.isSelected = '';
                    }
                    this.isSelected_Tem = '';
                    this.selectShortCut = 'selected';
                    this.shortCutModel = false;
                    this.selectShortCutTemp = true;
                    this.shortCutForm = this.currentShortCutForm;
                    this.clicktem_shortCut();
                }
            },
            //取消新建
            resetNewTemp(){
               this.shortCutModel = false;
               this.currentShortCutForm = {}
            },
            clicktem_shortCut(val){
                this.currentObj = this.shortCutForm
                for (let a of this.templates) {
                    a.isSelected = '';
                }
                if (val == '') {
                    this.selectShortCut = 'selected';
                }

                this.showUnit = false;
                
                // 清空空白模板de选中样式
                this.isSelected_Edit = '';
                this.isSelected_Tem = '';

                this.shortcutTempInfo = {
                    fWidth:0,
                    fHeight:0,
                    templateLayouts:[],
                };
                this.temInfor = {};
                
                this.$forceUpdate();
                this.shortcutTempInfo.fWidth = this.shortCutForm.fWidth;
                this.shortcutTempInfo.fHeight = this.shortCutForm.fHeight;
                let w = this.shortcutTempInfo.fWidth;
                let h = this.shortcutTempInfo.fHeight;
                let a = document.getElementById('preview-div').offsetWidth,
                    b = document.getElementById('preview-div').offsetHeight;

                this.shortcutTempInfo.wRatio = a/this.shortcutTempInfo.fWidth;
                this.shortcutTempInfo.hRatio = b/this.shortcutTempInfo.fHeight;
                let count = 0;
                for(let j = 0;j < this.shortCutForm.row;j++){
                    for(let k = 0;k < this.shortCutForm.col;k++){
                        let tem = {
                            fY:j*h/(this.shortCutForm.row)/h*100,
                            fX:k*(w/this.shortCutForm.col)/w*100,
                            fWidth:(w/this.shortCutForm.col)/w*100,
                            fHeight:(h/this.shortCutForm.row)/h*100,
                            fZIndex:count++
                        };
                        this.shortcutTempInfo.templateLayouts.push(tem);
                   }
                    
                    
                }
                this.shortcutTempInfo.fName = this.shortCutForm.row+'x'+this.shortCutForm.col+"模板"
                this.temInfor = this.shortcutTempInfo;
                this.param.templateId = this.shortCutForm.row+'x'+this.shortCutForm.col;
                this.param.temInfor = this.temInfor.templateLayouts;
                // this.shortCutModel = false;
                // this.selectShortCutTemp = true;
            },
            //关闭当前窗口
            closeCurrentModal(){
                this.unit.screenName="";
                this.unit.screenHeight= 1;
                this.unit.screenWidth= 1;
                this.unit.fTypeId='';
                this.unit.fName= '';
                this.unit.screenfId="";
                this.showModal = false;
                this.screenDetal = ""
            },
            //设置为默认尺寸
            changeAffirmScreen() {
                this.unit.screenHeight= 1080;
                this.unit.screenWidth= 1920;
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
        },
        computed: {
            // screenfId(){
            // }
        },
        watch: {
            //监视获取大屏宽高
           screenDetal(){
               if(this.screenDetal != null){
                   this.unit.screenfId = this.screenDetal.fId;

                   this.unit.screenHeight= this.screenDetal.fHeight;
                   
                   this.unit.screenWidth= this.screenDetal.fWidth;
               }
           },
           'unit.screenWidth':{
               handler(){
                   if(isNaN(this.unit.screenWidth*1)){
                    this.$message.warning('请输入数字类型');
                    }else if(this.unit.screenWidth <= 0){
                    this.$message.warning('宽需要大于0');
                    }
               }
            
            },
            'unit.screenHeight':{
                handler() {
                       if(isNaN(this.unit.screenHeight*1)){
                           this.$message.warning('请输入数字类型');
                       }else if(this.unit.screenHeight <= 0){
                           this.$message.warning('高需要大于0');
                       }
                }
            },
           
        }
    }
</script>

<style lang="scss" scoped>
.preview-title {
    text-align: center;
    color: #bcc9d4;
    font-size: 15px;
    // margin-top: 63px;
    // margin-bottom: 7px;
    // padding: 0 24px;
    }
.currentClass {
    border: 1px solid #12b3ff
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        appearance: none !important; 
        margin: 0 !important; 
    }
/* 火狐 */
input{
        -moz-appearance:textfield !important;
    }
.el-tabs__header {
    border-bottom: 1px solid #12b3ff !important;
}
.creat-screen-page{
    width: 100vw;
    height: 100vh;
    overflow-y: hidden;
    overflow-x: hidden;
    .module-top {
        position: absolute;
        left: 0;
        top: 0;
        height: 20px;
        width: 100%;
        background: url("../../image/screen/moduleTop.png") repeat-x;
        border-bottom: 1px solid #12b3ff;
        z-index: 10;
        box-shadow: 0 5px 28px 0 rgba(52, 59, 70, 0.9);
        .skew-decorator {
            cursor: pointer;
            height: 26px;
            width: 128px;
            margin-top: 20px;
            border-right: 2px solid #12b3ff;
            border-bottom: 1px solid #12b3ff;
            border-bottom-right-radius: 5px;
            transform: skewX(-45deg);
            background: url("../../image/screen/line.png") repeat-x;
            transform-origin: bottom;
            box-shadow: 0 5px 28px 0 rgba(52, 59, 70, 0.9);
        }
        .cancel-btn {
            cursor: pointer;
            position: absolute;
            left: 0;
            top: 0;
            width: 145px;
            color: #fff;
            font-size: 14px;
            line-height: 20px;
            padding: 6px 24px;
            transition: 0.2s;
        }
        .skew-decorator::after {
            content: " ";
            position: absolute;
            left: -50px;
            bottom: 0;
            width: 178px;
            height: 54px;
            border-bottom-right-radius: 5px;
            background: #232730;
        }
    }
    .module-wp {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: linear-gradient(180deg, #0f2038 0%, #091623 100%);
        .module-outline{
            width: 800px;
            height: 450px;
            background: #000000;
            border-radius: 5px;
            margin: 50px auto;
            padding: 15px 20px;
            box-sizing: border-box;
            .module-inline{
                height: 100%;
                width: 100%;
                overflow: hidden;
                background: #0E2A43;
            }
        }
        //列表区域
        .template-list {
          width: 100%;
            // height: 200px;
          position: absolute;
          left: 0;
          bottom: 10px;      
          overflow: hidden;      
          .template-container {
            //   height: calc(100vh - 130px);
              color: #fff;
            //   overflow-x: auto;
              display: flex;
              flex-direction: row;
              .template-selector {
                    
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    margin-left: 25px;
              }
                    .template-selector-item {
                      display: block;
                      width: 100%;
                      margin: 17px 25px 17px 0;
                        //   overflow: hidden;
                      display: flex;
                      flex-direction: column;
                      transition: 0.2s ease-out;
                      cursor: pointer;
                      .template-thumbnail-wp {
                          display: block;
                          position: relative;
                          float: left;
                          width: 140px;
                          height: 79px;
                          border: 1px solid #232730;
                          .thumbnail-div {
                              position: relative;
                              transform-origin: 0 0;
                              overflow: hidden;
                              box-sizing: border-box;
                              .layout-div {
                                  border: 2px solid #05B3B8;
                                  position: absolute;
                              }
                          }
                      }
                      .box-content{
                          text-align: center;
                          line-height: 5.5;
                      }
                      .desc-name {
                          position: relative;
                          display: flex;
                          flex-direction: row;
                          align-items: center;
                          justify-content: flex-start;
                      }
                  }
                  .blank-template .template-thumbnail-wp {
                      box-shadow: inset 0 0 46px 0 rgba(136, 215, 255, 0.45);
                      width: 140px;
                      height: 79px;
                      border: 1px solid #232730;
                  }
                  .template-selector-item:hover {
                      transform: scale(1.1,1.1);
                      .desc-name {
                          color: #2483ff;
                      }
                  }
                  .template-selector-item.selected {
                      transform: scale(1.1,1.1);
                      .template-thumbnail-wp {
                          border: 1px solid #2483ff;
                      }
                      .desc-name {
                            color: #2483ff;
                      }
                  }
                  .template-desc {
                      width: 100%;
                    //   height: 100%;
                    //   padding-left: 148px;
                      color: #bcc9d4;
                      .desc-name {
                          font-size: 14px;
                          line-height: 20px;
                          margin-bottom: 2px;
                      }
                  }
          }
          .el-tabs {
            //   padding-top: 75px !important;
              padding-left: 20px !important;
          }
          .el-carousel__arrow{
            // display: none;
            border: none;
            outline: none;
            padding: 0;
            margin: 0;
            height: 36px;
            width: 36px;
            cursor: pointer;
            transition: .3s;
            border-radius: 50%;
            // background-color: #bcc9d4;
            border: 1px solid #1a8ac0;
            color: #fff;
            position: absolute;
            top: 60%;
            z-index: 10;
            // transform: translateY(-30%);
            text-align: center;
            font-size: 12px;
            box-sizing: border-box;
          }
          .el-carousel-left{
              left: 16px;
          }
          .el-carousel-right{
              right: 16px;
          }
          
        }
        //显示区域
        .template-preview {
            flex: 1;
            height: 100%;
            width: 100%;
            // min-width: 740px;
            display: flex;
            flex-direction: column;
            
            .preview-content {
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                box-sizing: content-box;
                // padding: 0 24px 30px 24px;
                overflow: hidden;
                .preview-content-div {
                    height: calc(100% - 1px);
                    width: 100%;
                    
                    position: relative;
                    text-align: center;
                    .creat-btn {
                        position: absolute;
                        top: 50%;
                        left: calc(50% - 60px);
                        z-index: 2;
                        padding: 9px 50px!important;
                        border-radius: 0px!important;
                        background-image: linear-gradient(-225deg,#00d3f1 0,#12b3ff 100%);
                        color: #fff!important;
                        font-size: 15px!important;
                        border: none!important;
                    }
                    .overlayer{
                        position: absolute;
                        width: 100%;
                        background: #071420;
                        z-index: 1; height:100%;
                    }
                    .preview-thumbnail-div{
                        position: relative;
                        transform-origin: 0 0;
                        box-sizing: border-box;
                        .preview-layout-div {
                            border: 2px solid #05B3B8;
                            position: absolute;
                        }
                    }
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
}
.module-bottom {
        position: absolute;
        left: 251px;
        bottom: 255px;
        // transform: rotate(90deg);
        height: 40px;
        width: 30%;
        padding-left:20px;
        z-index: 10;
}
</style>
<style>
.template-list .el-tabs__item.is-top {
    color: #bcc9d4 !important;
}
.el-tabs--card .el-tabs__header .el-tabs__nav {
    border: 1.1px solid #1a8ac0 !important;
}
.el-tabs--card .el-tabs__header {
    border-bottom: 1.1px solid #1a8ac0 !important;
}
.template-list .el-tabs__item.is-active {
        color: #2483ff !important;
        border-bottom: none!important;
}
.el-tabs--card .el-tabs__header .el-tabs__item{
    border-left: 1.1px solid #1a8ac0  !important;
}
.el-tabs__content{ 
    overflow: visible !important;
    transition: .5s;
    position: relative;
}

</style>