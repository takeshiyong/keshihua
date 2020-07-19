/*
* @Author: 
* @Date:   2019-11-22
* @Description: '登录页面'
*
* @Modified:
* 1. 2019-12-19 元实　加上代码雨
*/
<template>
    <div class="login-page">
        <!-- <canvas id="canvas" style="position: absolute;"></canvas> -->
        <canvas id="canvas"></canvas>

        <div class="container">
            <div class="login-form">
                <h3 class="title">
                    数据可视化
                </h3>
                <div style="login-content">
                    <div class="input-div">
                        <i class="dvIcon dvIcon-yunongtongxingming resource-icon" style="color: #409EFF;margin-left: 10px;font-size: 16px"></i>
                        <el-input  v-model="fLoginName" outcompete="off" placeholder="请输入账号" @keyup.enter.native="doLogin" clearable></el-input>
                    </div>
                    <div class="input-div">
                        <i class="dvIcon dvIcon-mima resource-icon" style="color: #409EFF;margin-left: 10px;font-size: 16px"></i>
                        <el-input  type="password" v-model="fPassWord" outcompete="off" placeholder="请输入密码" @keyup.enter.native="doLogin" clearable></el-input>
                    </div>
                    <el-row>
                        <el-button type="primary" class="login-btn" @keyup.enter="doLogin" @click="doLogin">登 录</el-button>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message, MessageBox } from 'element-ui'
    import { LoginService,HomeService } from '@/api/service'
    import {common} from '@/utils/common'
    export default {
        data() {
            return {
                fLoginName: 'admin',
                fPassWord: '',

                canvas: null, //画布
                ctx: null, //画布上下文
                alphaNum: 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789~!@#$%^&*()', //数字
                strings: [], //代码雨的字符串
                counter: 0,
            }
        },

        mounted: function(){
            window.onkeydown = this.handleEnter;
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.ctx.font = '20px serif';
            // this.setCanvasSize();
            // this.setMatrixRainfall();
            // window.onresize = () => {
            //     this.setCanvasSize();
            //     this.setMatrixRainfall();
            // };

        },

        methods: {
            /**
             * 登录
             * @returns {string|*}
             */
            async doLogin(){
                if(!this.fLoginName || this.fLoginName.trim().length==0){
                    Message({
                        message: "账号不能为空！",
                        type: 'error',
                        duration: 5 * 1000
                    });
                    return;
                }
                if(!this.fPassWord || this.fPassWord.trim().length==0){
                    Message({
                        message: "密码不能为空！",
                        type: 'error',
                        duration: 5 * 1000
                    });
                    return;
                }

                let param =  {
                    fLoginName: this.fLoginName,
                    fPassWord: this.fPassWord
                }
                let res = await LoginService.login(param);
                if(res.success){
                    common.setToken(res.obj.webtoken);
                    common.setStore('userName', res.obj.fUserName);
                    common.setStore('userId', res.obj.fId);
                    let menu = await HomeService.getMenu(2);
                    if(menu.success){
                        common.setStore('userMenu', JSON.stringify(menu.obj.menuList))
                    }else{
                        this.$message.warning(menu.msg)
                    }
                    this.$router.replace({ path: '/Index' });
                }else{
                    Message({
                        message: res.msg,
                        type: 'error',
                        duration: 5 * 1000
                    });
                }
            },

            /**
             * 处理按Enter的事件
             */
            // handleEnter(event) {

            //     if (event.code.toLowerCase() === 'enter') {
            //         this.doLogin();
            //     }
            // },

            /**
             * 显示代码雨
             */
            setMatrixRainfall() {
                const strQnty = this.calcStringsQnty();
                const maxSmbQnty = this.calcSymbolsQnty();

                for (let i = 0; i < strQnty; i++) {
                    this.strings.string = [];
                    setTimeout(() => {
                        requestAnimationFrame(() => { this.showStringRain(i, maxSmbQnty, strQnty) });
                    }, Math.round(Math.random() * 30) * strQnty);
                }
            },

            /**
             * 算字符串的数量
             * @returns {number}
             */
            calcStringsQnty() {
                return Math.round(this.canvas.width / 10);
            },

            /**
             * 算一个字符串最大的长度
             * @returns {number}
             */
            calcSymbolsQnty() {
                return Math.round(this.canvas.height / 16);
            },

            /**
             * 显示代码雨字符串的动画
             * @param {number} idx --- 字符串索引
             * @param {number} maxSmbQnty --- 字符串最大的长度
             * @param {number} strQnty　--- 字符串的数量
             */
            showStringRain(idx, maxSmbQnty, strQnty) {
                requestAnimationFrame(() => { this.showStringRain(idx, maxSmbQnty, strQnty) });

                let string = this.strings[idx];
                let symbol = this.getRandomSymbol();

                string += symbol;
                this.strings[idx] = string;

                this.dislayVerticalText(string, idx, true);
                this.dislayVerticalText(string, idx);

                if (string.length > maxSmbQnty + 20) {
                    this.strings[idx] = '';
                }

                this.counter++;
            },

            /**
             * 实现动画迭代的延迟
             * @param {number} strQnty --- 字符串的数量
             */
            delay(strQnty) {
                let maxDelay = 0;
                if (this.counter < strQnty * 50000) {
                    maxDelay = 500000000;
                } else if (this.counter < strQnty * 500000) {
                    maxDelay = 50000;
                } else {
                    maxDelay = 5000;
                }

                for (let i = 0; i < maxDelay; i++) {}
            },

            /**
             * 获取随机字符
             * @returns {string}
             */
            getRandomSymbol() {
                const idx = Math.round(Math.random() * (this.alphaNum.length - 1));
                return this.alphaNum[idx];
            },

            /**
             * 显示竖字符串
             * @param {string} text --- 字符串
             * @param {number} idx --- 字符串的索引
             * @param {boolean} clear ---　是否清空字符　
             */
            dislayVerticalText(text, idx, clear = false) {
                const length = text.length;
                const xcoord = idx * 10;
                let y = 0;


                for (let i = length - 1; i > 0; i--) {
                    if (clear) {
                        this.ctx.clearRect(xcoord, (i - 1) * 16, 16, 16);
                    } else {
                       this. ctx.fillStyle = `rgba(64, 158, 225, ${ 1 - ( 0.06 * y ) })`;
                    }
                    y++;
                    this.ctx.fillText(text[i], xcoord, i * 16);
                }
            },

            /**
             * 设置画布的宽度和高度
             */
            setCanvasSize() {
                const width = document.documentElement.clientWidth;
                const height = document.documentElement.clientHeight;

                this.canvas.setAttribute('width', width + 'px');
                this.canvas.setAttribute('height', height + 'px');
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    $bg: #2d3a4b; // 背景色变量
    $title_color: #eee; // title颜色变量
    $icon_color: #889aa4; // icon颜色变量
    .login-page {
        position: relative;
        height: 100%;
        width: 100%;
        background-image: url('../image/index/loginBg.png');
        background-repeat:no-repeat;
        background-size:100% 100%;
        
        #canvas {
            position: absolute;
            top: 0;
            left: 0;
            opacity: .6;
        }

        // background-color: $bg;
        .container {
            .login-form { // 登录表单
                position: absolute;
                left: 0;
                right: 0;
                width: 450px;
                padding: 35px 35px 45px 35px;
                margin: 190px auto;
                background: #0D1217;
                border-radius: 5px;
                border: 1px solid #173247;
                .title { // 标题
                    font-size: 26px;
                    color: #409EFF;
                    margin: 0px auto 40px auto;
                    text-align: center;
                    font-weight: bold;
                }
                .input-div { // 账号、密码input
                    border: 1px solid #192530;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                    color: #454545;
                    display: inline-block;
                    width: 100%;
                    margin: 10px 0;
                    .redoublefont {
                        padding: 6px 5px 6px 15px;
                        color: $icon_color;
                        vertical-align: middle;
                        width: 30px;
                        display: inline-block;
                        font-size: 26px;
                    }
                }
                .login-btn {
                    width: 100%;
                    margin-top: 15px;
                    font-size: 16px;
                    padding: 10px!important;
                }
            }
            
        }

    }
</style>

<style rel="stylesheet/scss" lang="scss">
    $bg: #2d3a4b; // 背景色变量
    $input_color: #eee; // input字体颜色
    .login-page {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $input_color;
                height: 47px;
                &:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: #fff !important;
                }
            }
        }
    }
    .login-page .el-input input{
        color: #fff !important;
        
    }
    
</style>
