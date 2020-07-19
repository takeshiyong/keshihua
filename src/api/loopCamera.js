import req from '@/utils/request'

// 摄像头循环组管理相关接口
export const LoopCameraService = {
    // 新增循环组
    insertLoopCamera: (param) => req.post(`/videoResources/insert`, param),
    // 删除循环组
    deleteLoopCamera: (fId) => req.delete(`/videoResources/delete/${fId}`),
    // 分页查询循环组
    viewLoopCameraByPage: (param) => req.post(`/videoResources/selectByPage`, param),
    // 设置循环组显示摄像头
    setCurrentCameraByLoop: (param) => req.post(`/videoResources/showVido`, param),
    // 切换循环状态
    toogleLoopStatus: (param) => req.post(`/videoResources/switchingCycleState`, param),
    // 修改循环组
    updateLoopCamera: (param) => req.post(`/videoResources/update`, param),
    // 全查摄像头循环组数据
    viewAllLoopCamera: () => req.post(`/videoResources/selectAll`),
    // 给循环组里面批量添加摄像头
    insertCamerasToResources: (param) => req.post(`/cycleVideoInfo/insertBatchCycleVideoInfo`, param),
    // 查询资源组下所有摄像头
    viewCamerasByResourceId: fVideoResourcesId => req.get(`/cycleVideoInfo/selectByVideoResourcesId/${fVideoResourcesId}`),
    // 删除播放循环组下的指定摄像头
    deleteCameraByResourceId: fId => req.delete(`/cycleVideoInfo/deleteById/${fId}`),
    // 修改循环组顺序
    updateCameraSortByResource: param => req.post(`/cycleVideoInfo/sorting`, param), 
};

