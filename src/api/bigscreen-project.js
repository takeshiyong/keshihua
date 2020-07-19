/*
* @Author: 元实
* @Date:   2019-12-09
* @Description: '投放大屏请求'
*/

import req from '@/utils/request'
// 播放组管理
export const SetBigScreenService = {
    // 查询全部大屏信息
    getBigScreenServers: () => req.get('/screenserver/selectAllUsable'),

    // 查询资源信息
    getResources: (params) => req.post('/viewresourceinfo/selectbypage', params),

    // 查询资源播放组信息
    getResourcePlayGroups: (params) => req.post('/playgroupinfo/selectbypage', params),

    // 查询摄像头信息
    getVideoCameras: (params) => req.post('/videoChannelConfig/selectVideoByPage', params),

    // 查询摄像头循环信息
    getVideoCamerasLoops: (params) => req.post('/videoResources/selectVideoResourceByPage', params),

    // 场景投屏
    castSceneToBigScreen: (params) => req.post('/scene/putScreen', params),

    // 资源投屏
    castTempSourceToBigScreen: (params) => req.post('/viewresourceinfo/castScreen', params),

    // 显示组投屏
    castPermSourceToBigScreen: (params) => req.post('/showresourcegroup/putscreen', params),

}