<template>
    <div v-show="modal" class="modal-style">
        <div class="addModals">
            <div class="close-button" @click="closeModal()">

                <i style="color: #2483ff;font-size:18px;" class="el-icon-close close-btn" ></i>
            </div>
            <div style="width: 100%;text-align: center;padding: 10px 0 40px 0">
                <i v-if="type=='warning'"  class="dvIcon dvIcon-jinggao_o" style="color: #ff4f43;font-size: 76px;"/>
                <i v-else-if="type=='info'"  class="dvIcon dvIcon-tishi" style="color: #fff;font-size: 70px;"/>
                <span class="tips-error">{{tip}}</span>
            </div>
            <div class="datav-footers">
                <el-button class="cancel" style="font-size: 12px" @click="closeModal()">取消</el-button>
                <el-button type="primary" style="font-size: 12px" @click="sureModal()">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
       data() {
            return {
                tip: '',
                modal: false,
                fn: null,
                type: 'info', // warning info
            }
        },

        mounted() {
            Vue.prototype.$boxMsg = Vue.prototype.$confirm = this.showBoxMsg;
        },

        methods: {
            showBoxMsg(msg, type = 'info', fn, success) {
                this.modal = true;
                this.fn = fn;
                this.tip = msg;
                this.successfn = success;
                this.type = type;
            },

            closeModal() {
                this.modal = false;
                this.fn && this.fn();
            },

            sureModal() {
                this.modal = false;
                this.successfn && this.successfn();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tips-error {
        display: block;
        padding-top: 10px;
        font-size: 14px;
        width: 80%;
        text-align: center;
        margin: auto;
    }
    .modal-style {
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.35);
        overflow: hidden;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 1111;
        display: flex;
        justify-content: center;
        align-items: center;
    .addModals {
        position: relative;
        min-width: 420px;
        max-width: 80%;
        background: #303640;
        color: #fff;
        padding: 16px 0 0 0;
        z-index: 1;
        text-align: center;
        cursor: default;
    .close-button {
        cursor: pointer;
        width: 16px;
        height: 16px;
        font-size: 0;
        position: absolute;
        top: 10px;
        right: 10px;
    .close-btn {
        transition: transform 0.5s;
    }
    }
    .close-button:hover {
        color: #fff!important;
    .close-btn {
        transform:rotate(90deg);
        -ms-transform:rotate(90deg); 	/* IE 9 */
        -moz-transform:rotate(90deg); 	/* Firefox */
        -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
        -o-transform:rotate(90deg); 	/* Opera */
    }
    }
    }
    .addModals::before {
        content: '';
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 2px;
        background-image: linear-gradient(270deg,#00deff 0,#2483ff 74%);
    }
    }
    .datav-footers {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid #3A4659;
        padding: 0 16px;
        box-sizing: border-box;
        align-items: center;
        height:55px;
    .el-button {
        width: 88px;
    }
    .cancel {
        background: transparent;
        color: #409EFF;
        border: 1px solid #409EFF;
        transition: all 0.5s;
    }
    .cancel:hover {
        background: #409EFF;
        color: #fff;
    }
    }
</style>