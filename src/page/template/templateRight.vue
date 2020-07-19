<template>
    <div class="right-contents" ref="rightContent"  @mousedown.stop>
        <div class="right-left-content">

        </div>
        <div class="right-r-content">
            <div class="right-r-top">
                <span>页面设置</span>
            </div>
            <div style="padding: 0 20px">
                <div v-if="isSelectedTemplate">
                    <div class="toolbar-wh-row">
                        <p class="toolbar-row-title">位置</p>
                        <span class="toolbar-position-inp">top
                        <el-input-number  :value="top" @change="changeTop" size="mini" controls-position="right" :min="0" :max="20000"></el-input-number>
                        </span>
                        <span class="toolbar-position-inp">left
                        <el-input-number  :value="left" @change="changeLeft" size="mini" controls-position="right" :min="0" :max="20000"></el-input-number>

                        </span>
                    </div>
                    <div class="toolbar-wh-row">
                        <p class="toolbar-row-title">尺寸</p>
                        <span class="toolbar-size-inp">width
                        <el-input-number  :value="width" @change="changeWidth" size="mini" controls-position="right" :min="0" :max="20000"></el-input-number>
                        </span>
                        <span class="toolbar-size-inp">height
                        <el-input-number  :value="height" @change="changeHeight" size="mini" controls-position="right" :min="0" :max="20000"></el-input-number>
                        </span>
                    </div>

                    <!-- <div class="toolbar-wh-row">
                        <p class="toolbar-row-title">层级</p>

                        <svgicon name="toBottom" :color="activeRect!==null && zIndex !== 'isFirst' ? '#35495e' : '#AAA'" width="30" height="30" class="to-bottom-icon" @click.native="toBottom"></svgicon>
                        <svgicon name="toTop" :color="activeRect!==null && zIndex !== 'isLast' ? '#35495e' : '#AAA'" width="30" height="30" class="to-top-icon" @click.native="toTop"></svgicon>
                    </div> -->
                </div>
                <div v-if="!isSelectedTemplate">
                    <div class="toolbar-wh-row">
                        <p class="toolbar-row-title">分辨率</p>
                        <span class="toolbar-size-inp">width
                        <el-input-number :value="screen.width" @change="changeScreenWidth" size="mini" controls-position="right" :min="100" :max="20000"></el-input-number>
                        </span>
                        <span class="toolbar-size-inp">height
                        <el-input-number :value="screen.height" @change="changeScreenHeight" size="mini" controls-position="right" :min="100" :max="20000"></el-input-number>
                        </span>
                    </div>
                     <div class="toolbar-wh-row">
                        <p class="toolbar-row-title">模板名称</p>
                        <span class="toolbar-size-inp" style="width: 100%">
                        <el-input
                            @input="value => screen.name = value.replace(/\s/i, '')"
                            @change="changeScreenName"
                            :value="screen.name" placeholder="请输入模板名称"></el-input>
                        </span>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
                    
</template>

<script>
    import { mapGetters } from "vuex";
    import bus from "@/common/bus.js";
    export default {
        
        data(){
            return {
                num: 1,
                isSelectedTemplate: false,
               
            }
        },
        props: ['screenDetail','rightSwitch','showUnit',"screen"],
        mounted(){
            this.getActiveValue();
        },
        computed: {
            ...mapGetters(["templateList"]),
            activeRect() {
            return this.$store.getters["getActiveTemplate"];
            },
            activeName() {
            this.activeRect === null
                ? ""
                : this.templateList[this.activeRect].fLayoutNo;
            },
            width() {
            return this.activeRect === null
                ? ""
                : Math.round(this.templateList[this.activeRect].width);
            },

            height() {
            return this.activeRect === null
                ? ""
                : Math.round(this.templateList[this.activeRect].height);
            },

            top() {
            return this.activeRect === null
                ? ""
                : Math.round(this.templateList[this.activeRect].top);
            },

            left() {
            return this.activeRect === null
                ? ""
                : Math.round(this.templateList[this.activeRect].left);
            },
            zIndex() {
            if (this.activeRect === null) {
                return null;
            }

            return this.templateList[this.activeRect].zIndex === 1
                ? "isFirst"
                : this.templateList[this.activeRect].zIndex === this.templateList.length
                ? "isLast"
                : "normal";
            }
        },
        methods: {
            handleChange(value) {

            },
            
            //隐藏右侧
            handleRight() {
                this.$refs.rightContent.style.width = 0;
                this.$refs.rightContent.style.minWidth = 0;
                this.$refs.rightContent.style.zIndex = -1;
            },
            //显示右侧
            handleShowRight(){
                this.$refs.rightContent.style.width = 332+"px";
                this.$refs.rightContent.style.minWidth = 332+"px";
                this.$refs.rightContent.style.zIndex = 1;
            },
            //点击增加宽高
            addScreen(type){
                if(this.screenDetail[type] >= 20000){
                    this.screenDetail[type] = 20000
                }else{
                    this.screenDetail[type] += 1
                    let unit = type
                    this.$emit('change-screen', {unit: [unit],[unit]:this.screenDetail[type]});
                }
            },
             //点击减少宽高
            cutScreen(type){
                if(this.screenDetail[type] <= 0){
                    this.screenDetail[type] = 0
                }else{
                    this.screenDetail[type] -= 1
                    let unit = type
                    this.$emit('change-screen', {unit: [unit],[unit]:this.screenDetail[type]});
                }
            },
            //input失去焦点改变内容
            inputSetSecreen(type){
                if(this.screenDetail[type] <= 0){
                    this.screenDetail[type] = 0
                }else if(this.screenDetail[type] >= 20000){
                    this.screenDetail[type] = 20000
                }else{
                    let unit = type
                    this.$emit('change-screen', {unit: [unit],[unit]:this.screenDetail[type]});
                }
            },
            getActiveValue() {
                let that = this;
                bus.$on("isSelectedTemplate", function(val) {
                    that.isSelectedTemplate = val;
                });
            },
            toTop() {
                this.$store.dispatch("changeZToTop", {
                    type: "template",
                    id: this.activeRect
                });
            },
            toBottom() {
                this.$store.dispatch("changeZToBottom", {
                    type: "template",
                    id: this.activeRect
                });
            },
            changeTop(val) {
                let top = val;

                if (typeof top !== "number" || isNaN(top)) {
                    top = this.templateList[this.activeRect].top;
                    ev.target.value = top;
                    return;
                }
                this.$store.dispatch("setTop", {
                    type: "template",
                    id: this.activeRect,
                    top: top
                });
            },
            changeLeft(val) {
                let left = val;

                if (typeof left !== "number" || isNaN(left)) {
                    left = this.templateList[this.activeRect].left;
                    ev.target.value = left;
                }

                this.$store.dispatch("setLeft", {
                    type: "template",
                    id: this.activeRect,
                    left: left
                });
            },
            changeWidth(val) {
                let width = parseInt(val);

                if (typeof width !== "number" || isNaN(width)) {
                    width = this.templateList[this.activeRect].width;
                    ev.target.value = width;
                }

                this.$store.dispatch("setWidth", {
                    type: "template",
                    id: this.activeRect,
                    width: width
                });
            },

            changeHeight(val) {
                let height = parseInt(val);

                if (typeof height !== "number" || isNaN(height)) {
                    height = this.templateList[this.activeRect].height;
                    ev.target.value = height;
                }

                this.$store.dispatch("setHeight", {
                    type: "template",
                    id: this.activeRect,
                    height: height
                });
            },
            changeScreenWidth(val) {
                let width = parseInt(val);
                this.screen.width = width;
                bus.$emit("onScreenTemplateChange", this.screen);
            },
            changeScreenHeight(val) {
                let height = parseInt(val);
                this.screen.height = height;
                bus.$emit("onScreenTemplateChange", this.screen);
            },
            changeScreenName(val) {
                this.screen.name = val;
                bus.$emit("onScreenTemplateChange", this.screen);
            },
            //右侧按钮被点击后
            handleRightClick(){
                bus.$emit("isScreenChange", {status: true});
            },
        },
        watch: {
            screenDetail: function(newVal,oldVal){
                this.newScreenDetail = newVal;  //newVal即是chartData
            },
            rightSwitch: function(){
                if(this.rightSwitch){
                    this.handleRight()
                }else{
                    this.handleShowRight()
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .disabled{
        background: #1c1f25 !important;
        color: #bcc9d4 !important;
    }
    .right-contents {
        width: 332px;
        min-width:332px;
        height: 100%;
        z-index: 90;
        background: #1c1f25;
        position: absolute;
        top: 0;
        right: 0;
        transition: .3s ease;
        overflow: hidden;
        box-shadow: -1px 0 #000;
        display: flex;
        flex-direction: row;
        .right-left-content {
            width: 50px;
            height: 100%;
            background: #1d1e1f;
            border-right: 1px solid #000;
        }
        .right-r-content {
            width: 100%;
            height: 100%;
            .right-r-top {
                width: 100%;
                height: 30px;
                line-height: 30px;
                background: #2e343c;
                color: #bcc9d4;
                text-align: center;
                user-select: none;
                font-size: 12px;
                align-items: center;
                justify-content: center;
            }
        }
    }
    
</style>
<style scoped>
:root {
  --toolbar-width: 220px;
}

.toolbar {
  /* position: absolute; */
  right: 0;
  top: 0;
  width: var(--toolbar-width);
  padding: 10px 10px 0 10px;
  box-shadow: 0 0 2px #111;
  color: #bcc9d4;
  box-sizing: border-box;
  background: #1b1f25;
}

.toolbar-wh-row {
  margin-bottom: 20px;
}

.toolbar-row-title {
  width: var(--toolbar-width);
  font-size: 14px;
  font-family: "Lato", sans-serif;
  font-weight: 500;
  color: rgb(255, 255, 255);
  border-bottom: 1px solid #282f3a;
  background: #1b1f25;
  line-height: 26px;
  padding: 6px 5px;
}
.toolbar-position-inp {
    margin-right: 15px
}
.toolbar-position-inp,
.toolbar-size-inp {
  width: 90px;
  font-size: 12px;
  font-weight: 300;
  display: inline-block;
  position: relative;
  color: #bcc9d4;
  line-height: 24px;
  margin-right: 15px;
}

.toolbar-size-inp input,
.toolbar-position-inp input {
  width: 70px;
  display: inline-block;
  border: 1px solid #bfbfca;
  margin-top: 2px;
  height: 16px;
}

.toolbar-size-inp input[disabled],
.toolbar-position-inp input[disabled] {
  border: 1px solid #dcdce7;
  color: #aaaaaa;
}

.position-lock-icon,
.size-lock-icon {
  position: absolute;
  bottom: 3px;
  right: 17px;
  cursor: pointer;
}

.size-lock-icon {
  bottom: 2px;
  right: -3px;
}

.toolbar-check-inp {
  color: #445477;
  font-size: 13px;
  width: 180px;
  display: inline-block;
  margin: 2px 0;
}

.toolbar-row-title + label {
  margin-top: 5px;
}

.toolbar-check-inp input {
  border: 1px solid #bfbfca;
}

.to-top-icon,
.to-bottom-icon {
  margin: 10px 30px;
  cursor: pointer;
}
.el-input-number--mini {
  width: 100px;
}

.activeName {
  line-height: 50px;
  height: 50px;
  font-size: 24px;
  color: #333;
}
</style>
<style>
    .el-input-number.is-controls-right .el-input-number__decrease {
        color: #bcc9d4;
        border-left: 1px solid #282f3a !important;
        background: #0e1013 !important;
    }
    .el-input-number.is-controls-right .el-input-number__increase {
        color: #bcc9d4;
        border-bottom: 1px solid #282f3a !important;
        background: #0e1013 !important;
        border-left: 1px solid #282f3a !important;
    }
    .el-input-number.is-controls-right .el-input__inner {
        border: 1px solid #282f3a;
        color: #bcc9d4;
        background: #0e1013;
    }
    .el-input__inner {
        background: #0e1013 !important;
    }
    .el-input .el-input--small .el-input__inner{
        
    }
</style>