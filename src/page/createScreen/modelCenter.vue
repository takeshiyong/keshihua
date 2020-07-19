<template>
    <div class="center-contents" id="centerContents">
        <div class="ruler">
            <div class="ruler-wrapper h-container" id="hDContainer" style="width: 100%">
                <canvas id="hContainer"></canvas>
            </div>
            <div class="ruler-wrapper v-container" id="vDContainer" style="transform: rotate(90deg)">
                <canvas id="vContainer"></canvas>
            </div>
            <div class="corner">
                <i class="dvIcon dvIcon-biaochi" style="color: #bcc9d4;font-size: 12px"></i>
            </div>
        </div>
        
        <div id="dataContent" class="data-content" v-if="showTemplate" @click="handleClick" :style="{width: screenDetail.width + 'px', height: screenDetail.height + 'px'}">
            <drop  :style="{width: screenDetail.width + 'px', height: screenDetail.height + 'px'}" ref="dataContent" @dragover="over = true" @dragleave="over = false" @drop="handleDrop">
                <span>1111111111</span>
                
                <vue-drag-resize 
                    v-for="(element,index) in resourceList" 
                    style="cursor: pointer;"
                    :key="index" 
                    :id="index"
                    v-contextmenu:contextmenu
                    :z="element.zIndex" 
                    :w="element.width" 
                    :h="element.height" 
                    :x="element.left" 
                    :y="element.top"
                    :isDraggable="element.draggable" 
                    :isResizable="element.resizable" 
                    @clicked="activateEv(index)" 
                    @activated="activateEv(index)" 
                    @dragging="changePosition(arguments,index)" 
                    @resizing="changeSize(arguments, index)"
                    :snap="true"
                    @refLineParams="getRefLineParams"
                    :prevent-deactivation="true"
                    :active="element.dectivation"
                    
                >
                    <img 
                        v-if="element.resource" 
                        :src="pictureUrl + element.resource.fPreviewPicture" 
                        :onerror="defaultImag" alt="" style="width: 100%;height: 100%;">
                </vue-drag-resize>
                <span 
                    class="ref-line v-line" 
                    v-for="(item,index) in vLine" 
                    v-show="item.display"
                    :style="{ left: item.position, top: item.origin, height: item.lineLength}"
                />
                <span class="ref-line h-line"
                    v-for="(item,index) in hLine"
                    v-show="item.display"
                    :style="{ top: item.position, left: item.origin, width: item.lineLength}"
                />
            </drop>
        </div>
        <div v-else id="dataContent" class="data-content" :style="{width: screenDetail.width + 'px', height: screenDetail.height + 'px'}"> 
            <span>222222222222</span>
            
            <drop 
                v-for="(template,index) in resourceList" 
                :key="index" 
                :data-id="index" 
                v-bind:style="{ width: template.width+ 'px', height: template.height + 'px',left:template.left+'px',top:template.top+'px' ,position:'absolute'}" 
                class="drop" 
                :class="{ over }" 
                @dragover="over = true" 
                @dragleave="over = false" 
                @drop="handleDrop"
            >
            
                <VueDragResizes 
                    style="width:100%;height:100%;cursor: pointer;" 
                    v-if="!element.isDelete" 
                    v-for="(element,dragIndex) in templateResource(index)" 
                    :key="dragIndex"  
                    v-contextmenu:contextmenu
                    :isActive="element.true"
                    :isDraggable="element.draggable" 
                    :isResizable="element.resizable" 
                    v-on:clicked="activateEv(index)" 
                    v-on:activated="activateEv(index)" 
                    @deactivated="deactivateEv(index)" 
                    v-on:dragging="changePosition($event, index)" 
                    v-on:resizing="changeSize($event, index)"
                >
                    <img v-if="element.resource" :src="pictureUrl + element.resource.fPreviewPicture" :onerror="defaultImag" alt="" style="width: 100%;height: 100%;">
                </VueDragResizes>
            </drop>
        </div>
        <div class="data-thumbnail" id="dataThumbnail" style="width: 237px; height: 137px;" >
            <div id="canvasThumbnail" style="width: 100%;height: 100%"></div>
            <span id="selectSpan" class="select-span"></span>
        </div>
        <modelRight style="z-index: 10" :showUnit="showUnit" :screen='screenDetail' @change-screen="changeScreenDetail" :rightSwitch="rightSwitch"/>
        
        
        <v-contextmenu ref="contextmenu" theme="dark">
            <v-contextmenu-item @click="handleDelete"><i class="el-icon-delete"></i>删除</v-contextmenu-item>
        </v-contextmenu>
    </div>
    
</template>

<script>
    import VueDragResize from "vue-draggable-resizable-gorkys";
    import VueDragResizes from 'vue-drag-resize';
    import { Drag, Drop } from "vue-drag-drop";
    import modelRight from './modelRight.vue';
    import { mapGetters } from "vuex";
    import bus from "@/common/bus.js";
    import DialogModal from '../../components/DialogModal.vue';
    import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css';

    export default {
        components: {
            modelRight,
            VueDragResize,
            Drag,
            Drop,
            DialogModal,
            VueDragResizes
        },
        props: ['rightSwitch','unit',"leftSwitch",'sliderScale'],
        data(){
            return {
                defaultImag: 'this.src="' + require('../../image/common/noFile.png') + '"',  //出错时显示图片
                vLine: [],
                hLine: [],
                screenDetail:{
                    width: 0,
                    height: 0
                },
                currentPosition: {
                    top: 0,
                    left: 0
                },
                unitScale: {
                    width: 1,
                    height: 1
                },
                mouse: {},
                thumbnail: {},
                moveFlag: false,
                moveEvent: {},
                over: false,
                temInfor: {},
                moveX: 0,
                moveY: 0,
                showUnit: false, //true 不展示 false 展示
                templateId: this.$route.query.param? 
                    JSON.parse(this.$route.query.param).templateId
                    : "",
                cancelScreenChange: false,

                isAlreadyBound: false, //鼠标时间是否已经给场景所列图绑定的 元实　2019-12-31
            }
        },
        mounted() {
            // console.log('mounted');
            this.init()
            window.addEventListener('resize', () => { 
                this.init()
            });
            
        },
        computed: {
            ...mapGetters(["resourceList",'showTemplate']), // 动态计算属性，相当于this.$store.getters.resourceList
            activeIndex() {
                let index = this.$store.getters["getActive"];
                return index;
            }
        },
        methods: {
            //初始化
            init() {
                // console.log('init');
                
                //屏蔽右键菜单
                this.$el.oncontextmenu = function(e) {
                    return false;
                };

                let that = this;
                bus.$on("onApplyTemplateId", function(fId) {
                    that.templateId = fId;
                });
                this.screenDetail.width = this.unit.width;
                this.screenDetail.height = this.unit.height

                let currentWidth = document.getElementById("centerContents").offsetWidth;
                let currentHeight = document.getElementById("centerContents").offsetHeight;
                let hContainer = document.getElementById("hContainer");
                let vContainer = document.getElementById("vContainer");
                
                hContainer.style.transform = 'translateX('+0+'px)';
                vContainer.style.transform = 'translateX('+0+'px)';

                this.drawHCanvas(this.sliderScale>1 ? (this.screenDetail.width*this.sliderScale+200): (this.screenDetail.width+ 300),hContainer)
                this.drawHCanvas(this.sliderScale>1 ? (this.screenDetail.height*this.sliderScale+200): (this.screenDetail.width+ 300),vContainer);
                this.setCurrentCavans(currentWidth,this.screenDetail.width,"width");
                this.setCurrentCavans(currentHeight,this.screenDetail.height,"height");

                //设置小框移动
                if (!this.isAlreadyBound) {
                    this.moveSmallThumbnail()
                    this.isAlreadyBound = true; //元实　2019-12-31
                }

            },
            //自适应设置小屏幕的滑动框宽高
            setCurrentCavans(screenWidth,setWidth,unit){
                let smallWidth = document.getElementById("dataThumbnail").style[unit];
                
                if(screenWidth>=setWidth*this.sliderScale){
                    

                    document.getElementById("selectSpan").style[unit] = parseInt(smallWidth)+"px";
                    return;
                }
                let currentUnit = (screenWidth -80)/(setWidth*this.sliderScale);


                this.unitScale[unit] = currentUnit;
                
                document.getElementById("selectSpan").style[unit] = parseInt(smallWidth)*currentUnit+"px"
                
                let selectSpan = document.getElementById("selectSpan");
                selectSpan.style.left = 0 + 'px';
                selectSpan.style.top = 0 + 'px';

            },
            //设置标尺宽高样式
            drawHCanvas(currentNum,Container){
                Container.width = `${currentNum}`;
                Container.height = "20";
                const ctx=Container.getContext("2d");
                
                ctx.fillStyle="#0e1013";
                ctx.fillRect(0, 0, 40, 20);
                ctx.beginPath();
                ctx.strokeStyle = "#90A0AE";
                ctx.moveTo(40,0);
                ctx.lineTo(40,20);
                ctx.stroke();
                ctx.fillRect(40, 0, currentNum, 20);

                this.drawAxisTicks(currentNum,ctx);
                this.drawAxisLabels(currentNum,ctx);
                
            },
            //绘制小标
            drawAxisTicks(currentNum,ctx) {
                let deltaY;
                ctx.beginPath();
                for (var i = 1; i < currentNum/10; i++) {
                    ctx.strokeStyle = "#90A0AE";
                    // 判断画的是大坐标还是短坐标
                    if (i % 10 == 0) {
                        deltaY = 10;
                    } else {
                        deltaY = 15
                    }
                    if(i % 20 == 0){
                        ctx.moveTo(10*i*this.sliderScale+40,0);
                        ctx.lineTo(10*i*this.sliderScale+40,20);
                        ctx.stroke();
                    }
                    ctx.moveTo(10*i*this.sliderScale+40,deltaY);
                    ctx.lineTo(10*i*this.sliderScale+40,20);
                    ctx.stroke();
                }
            },
            //绘制轴标注
            drawAxisLabels(currentNum,ctx) {
                ctx.fillStyle = "#90A0AE";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
               
                for (var i = 0; i <= currentNum/10; i++) {
                    let currentAdd = i >=100 ?54: 51
                    if (i % 10 === 0) {
                        ctx.fillText(i*10,i * 10*this.sliderScale + currentAdd,5);
                    }
                }
            },
            //
            getContentWidth() {
                let currentWidth = document.getElementById("centerContents").offsetWidth;
            },
            //获取背景屏幕宽高
            changeScreenDetail(value){
                let unit = value.unit[0];
                this.screenDetail[unit] = value[unit]
                document.getElementById("dataContent").style[unit] = this.screenDetail[unit]+'px';
            },
            templateResource(no) {
                let that = this;
                let list = this.resourceList.filter((item, index) => {
                    return item.fLayoutNo == no;
                });
                return list;
            },
            //更新资源对应序号的内容
            updateTemplateResource(no, data) {
                let index = parseInt(no);
                this.resourceList[index].isDelete = false;
                this.resourceList[index].resource = data;
            },
            //拖动放入时
            handleDrop(data, e) {
                this.over = false;
                let dataId = "",
                    len = this.resourceList.length;
                this.currentFLayoutNo = dataId;

                if (this.templateId) {
                    let target = e.currentTarget;
                    dataId = target.getAttribute("data-id");
                    //修改模板序号对应数组
                    this.updateTemplateResource(dataId, data);
                } else {
                    let w = 200,
                    h = 160,
                    x = e.offsetX,
                    y = e.offsetY;
                    // 此处会报错（但不影响）
                    this.resourceList.push({
                        fLayoutNo: dataId,
                        left: x,
                        top: y,
                        width: w,
                        height: h,
                        active: false,
                        draggable: this.templateId ? false : true,
                        resizable: this.templateId ? false : true,
                        resource: data,
                        zIndex: len
                    });
                }
            },
            //点击时
            activateEv(index) {
                this.$store.dispatch("setActive", {
                    id: index
                });
                bus.$emit("isSelectedComponent", true);
            },
            deactivateEv(index) {
                if (this.$refs.contextmenu.$el.style.display != "none") {
                    return;
                }
                this.$store.dispatch("unsetActive", {
                    id: index
                });
                bus.$emit("isSelectedComponent", false);
            },
            //删除当前资源
            handleDelete(vm, event) {
                event.cancelBubble = true;
                event.stopPropagation();
                let targetIndex = this.activeIndex;
                if (targetIndex != undefined) {
                    if (this.templateId) {
                    this.resourceList[targetIndex].resource = null;
                    this.resourceList[targetIndex].isDelete = true;
                        bus.$emit("isSelectedComponent", false);
                    } else {
                    this.resourceList.splice(targetIndex, 1);
                        bus.$emit("isSelectedComponent", false);
                    }
                }
            },
            //改变大小
            changeSize(a,index) {
                let top = a[1].toFixed(1)*1;
                let left = a[0].toFixed(1)*1;
                let width = a[2].toFixed(1)*1;
                let height = a[3].toFixed(1)*1;
                this.$store.dispatch("setTop", {
                    id: index,
                    top: top
                });
                this.$store.dispatch("setLeft", {
                    id: index,
                    left: left 
                });
                this.$store.dispatch("setWidth", {
                    id: index,
                    width: width
                });
                this.$store.dispatch("setHeight", {
                    id: index,
                    height: height
                });
            },
            //改变位置
            changePosition(a,index) {
                let top =a[1].toFixed(1)*1;
                let left = a[0].toFixed(1)*1;
                
                this.$store.dispatch("setTop", {
                    id: index,
                    top: top
                });
                this.$store.dispatch("setLeft", {
                    id: index,
                    left:left
                });
                
            },
            //cavans缩放效果
            cavansScale(dom,sliderScale){
                const newCtx = dom.getContext("2d");
                newCtx.scale(sliderScale)
            },
            //移动小框
            moveSmallThumbnail() {
                // console.log('move small thumbnail');
                let dataThumbnail = document.getElementById("dataThumbnail");
                let centerContents = document.getElementById("centerContents");
                let selectSpan = document.getElementById("selectSpan");
                dataThumbnail.addEventListener("mousedown",($event) =>{

                    this.down($event,dataThumbnail,centerContents,selectSpan);
                },false);
                dataThumbnail.addEventListener("mousemove",($event) =>{
                    this.move($event,dataThumbnail,centerContents,selectSpan);
                },false);
                dataThumbnail.addEventListener("mouseout",($event) =>{
                    this.moveFlag = false;
                },false);
                dataThumbnail.addEventListener("mouseup",($event) =>{
                    this.moveFlag = false;
                    this.end($event,dataThumbnail,centerContents,selectSpan);
                },false);
            },
            //鼠标按下
            down($event,dataThumbnail,centerContents,selectSpan){
                this.moveFlag = true;
                
                this.thumbnail = {
                    clientX:dataThumbnail.offsetLeft,
                    clientY: dataThumbnail.offsetTop
                }
                this.mouse = {
                    clientX: $event.offsetX,//$event.clientX - dataThumbnail.offsetLeft - centerContents.offsetLeft - selectSpan.offsetLeft,
                    clientY: $event.offsetY//$event.clientY - dataThumbnail.offsetTop - centerContents.offsetTop - selectSpan.offsetTop
                }
            },
            //鼠标移动
            move($event,dataThumbnail,centerContents,selectSpan){

                if(this.moveFlag){
                        let mouseClientX = $event.clientX - dataThumbnail.offsetLeft - centerContents.offsetLeft -this.mouse.clientX;
                        let mouseClientY = $event.clientY - dataThumbnail.offsetTop - centerContents.offsetTop -this.mouse.clientY;
                        let moveX = 0;
                        let moveY = 0;

                    if ((0 <= mouseClientX) && (mouseClientX <= dataThumbnail.offsetWidth - parseInt(selectSpan.style['width']))) {
                        moveX = mouseClientX;
                    } else {
                        if (mouseClientX < 0) {
                            moveX = 0;
                        } else {
                            moveX = dataThumbnail.offsetWidth - parseInt(selectSpan.style['width']);
                        }
                    }
                    if ((0 <= mouseClientY) && (mouseClientY <= dataThumbnail.offsetHeight-parseInt(selectSpan.style['height']))) {
                        moveY = mouseClientY;
                    } else {
                        if (mouseClientY < 0) {
                            moveY = 0;
                        } else {
                            moveY = dataThumbnail.offsetHeight-parseInt(selectSpan.style['height']);
                        }
                    }
                    selectSpan.style.transform = `translate(${ moveX }px, ${ moveY }px)`;
                    this.setMove(moveX, moveY)

                }
            },
            //鼠标释放时候的函数
            end($event,dataThumbnail,centerContents,selectSpan){
                // this.mouse = {
                //     clientX: $event.clientX - dataThumbnail.offsetLeft - centerContents.offsetLeft,
                //     clientY: $event.clientY - dataThumbnail.offsetTop - centerContents.offsetTop 
                // }
            },
            //设置移动
            setMove(mouseClientX,mouseClientY){
                let hDContainer = document.getElementById("hContainer");
                let vDContainer = document.getElementById("vContainer");
                
               
                let currentWidth = document.getElementById("centerContents").offsetWidth;
                let currentHeight = document.getElementById("centerContents").offsetHeight;

                this.moveSet(currentWidth-80,this.screenDetail.width,hDContainer,mouseClientX,"left");
                this.moveSet(currentHeight-80,this.screenDetail.height,vDContainer,mouseClientY,"top");
            },
            //匹配宽高
            moveSet(screenUnit,setUnit,currentDom,remove,unit){
                let dataContent = document.getElementById("dataContent");
                let currentUnit = document.getElementById("dataThumbnail").offsetWidth/(this.screenDetail.width*this.sliderScale);
                
                let moveDom = (remove/currentUnit).toFixed(1)*1
                currentDom.style.transform = 'translateX('+-moveDom+'px)'
                
                
                if(unit == "left"){
                    let currentUnitX = document.getElementById("dataThumbnail").offsetWidth/(this.screenDetail.width*this.sliderScale);
                    this.moveX = (remove/currentUnitX).toFixed(1)*1;
                }else{
                    let currentUnitY = document.getElementById("dataThumbnail").offsetHeight/(this.screenDetail.height*this.sliderScale);
                    this.moveY = (remove/currentUnitY).toFixed(1)*1;
                }
                dataContent.style.transform = 'translate('+-this.moveX+'px,'+-this.moveY+'px) scale(' + this.sliderScale + ')';

            },
            // 辅助线回调事件
            getRefLineParams (params) {
                const { vLine, hLine } = params
                this.vLine = vLine
                this.hLine = hLine
            },
            handleClick(){
                this.resourceList.forEach((item) => {
                    item.dectivation = false;
                })
                let list = this.resourceList.map((item) => ({
                    ...item,
                    dectivation: false
                }))
                if(event.target.id){
                    bus.$emit("isSelectedComponent", true);
                    list[event.target.id].dectivation = true;
                }else{
                    bus.$emit("isSelectedComponent", false);
                }
                // this.resourceList = [...this.resourceList];
                this.$store.dispatch("setData", list);

            }
        },
        watch:{
            unit: function (newVal, oldVal){
                // console.log('unit');
                this.init();
            },
            sliderScale() {
                let contenttWidth = document.getElementById("dataContent");
                contenttWidth.style.transform = 'scale(' + this.sliderScale + ')';
                // let hContainer = document.getElementById("hContainer")
                // let vContainer = document.getElementById("vContainer")
                setTimeout(() => {
                    // console.log('slider');
                    this.init()
                },300)
            },
            leftSwitch() {
                setTimeout(() => {
                    this.init()
                },300)
            },
            rightSwitch(){
                if(this.rightSwitch){
                    document.getElementById("dataThumbnail").style.right = 75+'px';
                }else{
                    document.getElementById("dataThumbnail").style.right = 427+'px';
                }
            }
        },
        
    }
</script>

<style lang="scss" scoped>
    .drop {
        width: 100%;
        height: 100%;
        position: relative;
        // background: rgba(0, 231, 255, 0.11);
        border: 1px solid rgba(0, 231, 255, 0.31);
        box-sizing: border-box;
    }

    .center-contents {
        flex: 1;
        // display: flex;
        // display: -webkit-box;
        min-width: 1000px;
        position: relative;
        width: 100%;
        height: 100%;
        user-select: none;
        background: #2A2E33;
        background-image: radial-gradient(rgba(225,225,225,.5) 8%, transparent 0);
        background-size: 18px 18px;
        overflow: hidden;
        .h-container {
            left: 20px;
            cursor: ew-resize;
        }
        .v-container {
            transform: rotate(90deg);
            transform-origin: 0 100% 0;
            cursor: ns-resize;
        }
        .ruler-wrapper{
            position: absolute;
            height: 20px;
            z-index: 1;
        }
        .corner {
            border-right: 1px solid #3a4659;
            border-bottom: 1px solid #3a4659;
            box-sizing: border-box;
            width: 20px;
            height: 20px;
            font-size: 16px;
            z-index: 9999;
            cursor: pointer;
            // position: fixed;
            // z-index: 999;
            align-items: center;
            justify-content: center;
            display: flex;
            color: #bcc9d4;
            background: #0e1013;
        }
        .data-content{
            background-color: rgba(13, 42, 67, 0); 
            transform:  translate(0px, 0px); 
            position: relative; 
            background-image: url("../../image/index/content-box.png");
            transform-origin: 0 0;
            top: 40px;
            left: 60px;
            transition: .2s all ease-in-out;
            background-size: cover,contain;
            background-position: center,right bottom;
            background-repeat: no-repeat,no-repeat;
            box-shadow: rgba(0,0,0,.5) 0 0 30px 0;
            // overflow: hidden;
            // width: 200px;
            // height: 200px;
            .preview-thumbnail-div{
                        position: relative;
                        transform-origin: 0 0;
                        .preview-layout-div {
                            border: 1px solid #fff;
                            position: absolute;
                        }
                    }
        }
        .data-thumbnail{
                position: absolute;
                transition: .3s;
                right: 427px;
                bottom: 25px;
                user-select: none;
                background: #000;
                width: 237px; 
                height: 137px;
                overflow: hidden;
                .select-span{
                    border: 1px solid #2483ff;
                    box-shadow: 0 0 30px 0 #000;
                    z-index: 2;
                    position: absolute;
                    top: 0;
                    left: 0;
                    cursor: move;
                    box-sizing: border-box;
                }
        }
        .module-bottom {
            position: absolute;
            left: 25px;
            bottom: 5px;
            height: 40px;
            width: 30%;
            padding-left:20px;
            z-index: 10;
            border-radius: 5px;
        }
        
    }
    
</style>