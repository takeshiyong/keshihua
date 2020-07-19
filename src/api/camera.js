import req from '@/utils/request'

//摄像头管理相关接口
export const CameraService = {
    // 新增摄像头分组
    insertCameraClassify: param => req.post(`/videoArea/insert`, param),
    // 查询摄像头分组
    viewCameraClassify: param => req.get(`/videoArea/selectAll`, param),
    // 修改摄像头分组
    updateCameraClassify: param => req.put(`/videoArea/update`, param),
    // 删除摄像头分组
    deleteCameraClassify: fId => req.delete(`/videoArea/delete/${fId}`),
}

// Nvr配置管理相关接口
export const NvrService = {
    // 查询全部nvr信息
    viewAllNvr: () => req.get(`/videoConnectPoolConfig/selectAll`),
    // 分页查询nvr配置信息
    viewNvrByPage: (param) => req.post(`/videoConnectPoolConfig/selectBySearch`, param),
    // 新增nvr配置信息
    insertNvr: (param) => req.post(`/videoConnectPoolConfig/insert`, param),
    // 修改nvr配置信息
    updateNvr: (param) => req.post(`/videoConnectPoolConfig/update`, param),
    // 删除nvr配置信息
    deleteNvr: (fId) => req.post(`/videoConnectPoolConfig/delete/${fId}`),
}


// 摄像头信息管理接口
export const CameraInfoService = {
    // 新增摄像头信息
    insertCameraInfo: (param) => req.post(`/videoChannelConfig/insert`, param),
    // 删除摄像头信息
    deleteCameraInfo: (fId) => req.post(`/videoChannelConfig/delete/${fId}`),
    // 修改摄像头信息
    updateCameraInfo: (param) => req.post(`/videoChannelConfig/update`, param),
    // 根据通道号查询摄像头信息
    viewCameraByChannelId: (fChannel) => req.get(`/videoChannelConfig/selectByChannel/${fChannel}`),
    // 根据分类id查相关摄像头信息分页
    viewCameraPageByClassify: (param) => req.post(`/videoChannelConfig/selectByPage`, param),
    //重启easynvr
    viewCameraRestart: (fChannel) => req.get(`/videoChannelConfig/restart`),
}

// 摄像头上下左右控制
export const cloudControlService = {
    cloudControlOpe: (nvrip, channel, command, isStop) => req.post(`/videocontrol/ptzControl/${nvrip}/${channel}/${command}/${isStop}`,),
}

// easyNVR相关接口
export const channelService = {
    initVideo: (fId) => req.get(`/videoChannelConfig/resetChannelStream/${fId}`),
};