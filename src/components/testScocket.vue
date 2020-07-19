
<template>
    <div class="record-page">
        <div style="margin-bottom: 15px;">
            <button @click="startRecording">start recording</button>
            <!-- <div @click="stopRecording" id="btn-stop-recording" :disabled="!videoStart">stop recording</div> -->
        </div>
        <video src="" width="0" id="video" height="0" controls muted></video>
        <canvas width="800px" height="320px"></canvas>
        <!-- <img id="image" width="400px" height="300px"> -->
    </div>
</template>
 
<script>
    import RecordRTC from 'recordrtc';
    export default {
        name: "screenRecord",
        data() {
            return {
                websocket: null,
                imgChuncks: [],
                audioChuncks: [],
                img: null,
                ws: null,
                source: null,
                audioCtx: null,
                interval: null,
                mediaDevices: null,
                canvas: null,
                ctx: null
            }
        },
        created() {
            if ('WebSocket' in window) {
                this.ws = new WebSocket("ws://192.168.0.250:8150/websocket/aaa/a");
            }else{
                alert('当前浏览器 Not support websocket')
            }
            
            if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
                let error = 'Your browser does NOT support the getDisplayMedia API.';
                throw new Error(error);
            }
        },
        mounted() {
            this.canvas = document.querySelector('canvas'),
            this.ctx = this.canvas.getContext('2d'),
            this.video = document.getElementById('video');
            //连接发生错误的回调方法
            this.ws.onerror = () =>  {
                this.$message.error("WebSocket连接发生错误")
                clearInterval(this.interval);
            };

            //连接成功建立的回调方法
            this.ws.onopen = () => {
                this.$message.success("WebSocket连接成功")
            }
            //连接成功接收消息
            this.ws.onmessage = function(evt) { 
                //console.log(evt.data.byteLength, 456)
                if(evt.data.byteLength === undefined) {
                    //收到的base64图片
                    this.imgChuncks.push(evt.data);
                }else{
                    //收到的音频二进制pcm数据
                    this.audioChuncks.push(new Float32Array(evt.data));
                }
                //console.log(this.img, this.audioChuncks.length, 123)
                //缓存2帧的数据后开始播放
                if(!this.img && this.audioChuncks.length > 2){
                    //console.log('myplay')
                    console.log('start');
                    //comment
                    this.myplay();
                }
            };
            this.video.onplay = () => {
                //将video绘制到canvas上
                this.interval = setInterval(function(){
                    document.querySelector('canvas').getContext('2d').drawImage(this.video, 0, 0, 800, 320);
                },30);
            };
             this.video.onpause = function(){
                 console.log(12121212);
             };
            //连接关闭的回调方法
            this.ws.onclose = () => {
                this.$message.success("WebSocket连接关闭");
                clearInterval(this.interval);
            }

            //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = () => {
                this.closeWebSocket();
                clearInterval(this.interval);
            }
        },
        methods: {
            //创建播放音频视频函数
            myplay(){
                if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
                //创建img标签来播放base64图片
                this.img = new Image();
                document.body.appendChild(img);
                //创建播放音频对象
                let    myBuffer = this.audioCtx.createBuffer(1, 2048, audioCtx.sampleRate),
                    source = this.audioCtx.createBufferSource(),
                    recorder = this.audioCtx.createScriptProcessor(2048, 1, 1);
                source.connect(recorder);
                recorder.connect(this.audioCtx.destination);
                recorder.onaudioprocess = function(ev){
                    //修改img的src达到视频的效果
                    this.img.src = imgChuncks.shift();
                    //播放audioChuncks里面真正的二进制数据
                    ev.outputBuffer.copyToChannel(this.audioChuncks.shift() || new Float32Array(2048), 0, 0);
                };
            },
            invokeGetDisplayMedia(success, error) {
                let displaymediastreamconstraints = {
                    video: {
                        displaySurface: 'monitor', // monitor, window, application, browser
                        logicalSurface: true,
                        cursor: 'always' // never, always, motion
                    }
                };
                // above constraints are NOT supported YET
                // that's why overridnig them
                displaymediastreamconstraints = {
                    video: true
                };
                if (navigator.mediaDevices.getDisplayMedia) {
                    navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
                }
                else {
                    navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
                }
            },
            captureScreen(callback) {
                let that = this
                this.invokeGetDisplayMedia((screen) => {
                    this.addStreamStopListener(screen, () => {
                        console.log(that.interval)
                       clearInterval(that.interval);
                    });
                    callback(screen);
                }, function (error) {
                    console.error(error);
                    alert('您没有进行选择\n' + error);
                });
            },
            addStreamStopListener(stream, callback) {
                stream.addEventListener('ended', function () {
                    callback();
                    callback = function () {
                        
                     };
                }, false);
                stream.addEventListener('inactive', function () {
                    callback();
                    callback = function () { };
                }, false);
                stream.getTracks().forEach(function (track) {
                    track.addEventListener('ended', function () {
                        callback();
                        callback = function () { };
                    }, false);
                    track.addEventListener('inactive', function () {
                        callback();
                        callback = function () { };
                    }, false);
                });
            },
            startRecording() {
                //let image = document.getElementById('image');
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
                this.captureScreen(stream=>{
                    //视频流转换到video标签播放
                    this.video.srcObject = stream;
                    this.video.play();
                    //音频流转换到AudioNode做数据采集
                    // let source = this.audioCtx.createMediaStreamSource(stream);
                    let recorder = this.audioCtx.createScriptProcessor(2048, 1, 1);
                    // source.connect(recorder);
                    recorder.connect(this.audioCtx.destination);
                    let that = this
                    recorder.onaudioprocess = function(ev){
                        //采集单声道数据
                        // let inputBuffer = ev.inputBuffer.getChannelData(0);
                        //将视频画面转换成base64发送
                        let string = document.querySelector('canvas').toDataURL('image/jpeg');
                        //console.log(string.length);
                        //image.src = string;
                        //debugger
                        //that.ws.send(document.querySelector('canvas').toDataURL('image/jpeg'));
                        that.ws.send(string);
                        // console.log(inputBuffer.buffer, 123)
                        //发送音频pcm数据
                        // that.ws.send(inputBuffer.buffer);
                    };
                });
            },
            closeWebSocket() {
                this.ws.close();
            },
        },
    }
</script>
 
<style scoped>
 
</style>