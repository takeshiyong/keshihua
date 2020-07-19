import Vue from 'vue'

// 设置全局属性
export default {
    // 接口请求地址
    //BASE_API: 'http://1.85.2.95:8219/resource-service',
    BASE_API: 'http://39.98.176.241:8019/resource-service',
    // 第三方接口请求地址
    OTHER_API: 'http://39.98.176.241:7500/api',
    // 摄像头easynvr播放地址
    PLAY_URL: 'http://39.98.176.241:10800',
    // rtmp流地址域名 easynvr部署地址
    RTMP_URL: '39.98.176.241',

    //预览图片路径
    PICTURE_URL: 'http://39.98.176.241:8019',

    //上载图片的路径
    UPLOAD_URL: 'http://39.98.176.241:8019/resource-service/',

    // PLAY_URL: 'http://1.85.2.95:8280',
    // // rtmp流地址域名 easynvr部署地址
    // RTMP_URL: '1.85.2.95',
}
