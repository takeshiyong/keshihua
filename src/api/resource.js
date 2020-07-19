import req from '@/utils/request'
// 资源组管理
export const ResourceService = {
    // 查询全部资源组
    getResourceGroups: (params) => req.get('/viewresourcegroup/selectall', params),
    // 新增资源组
    insertResourceGroup: (params) => req.post('/viewresourcegroup/insert', params),
    // 修改资源组
    updateResourceGroup: (params) => req.post('/viewresourcegroup/update', params),
    // 删除资源组
    deleteResourceGroup: (params) => req.post('/viewresourcegroup/delete/' + params),
    // 查询资源信息
    getResources: (params) => req.post('/viewresourceinfo/selectByResource', params),
    // 查询资源信息
    getResourceInfo: fId => req.get(`/viewresourceinfo/selectByPrimaryKey/${fId}`),
    // 新增资源
    insertResource: (params) => req.post('/viewresourceinfo/insert', params),
    // 修改资源
    updateResource: (params) => req.post('/viewresourceinfo/update', params),
    // 删除资源
    deleteResource: (params) => req.post('/viewresourceinfo/delete', params),
    //发布资源
    publishResource: (params) => req.post('/playgroupinfo/publishresource', params),
    // 查询发布资源的分类树
    getPublishClassify: (params) => req.get('/releaseclassify/selectAll', params),

}

// 显示组管理
export const ShowResourceGroupService = {
    // 全查显示资源
    getAllShowResource:()=>req.get('/showresourcegroup/selectall'),
    // 分页查询显示组
    selectByPage:(params)=>req.post('/showresourcegroup/selectbypage',params),
    // 查询播放数据
    getPlayData:(params)=>req.get('/home/checkresource/' + params),
    //查询全部大屏信息
    selectAllScreenServer:(params)=>req.get('/screenserver/selectall' , params),
    //投放大屏
    putscreen:(params)=>req.post('/showresourcegroup/putscreen' , params),
    // 截取封面
    screenshot:(params)=>req.post('/home/generatePicture' , params),
    // 查询可用的自定义模板资源信息
    getEnableDatavResources:(params)=>req.get('/showresourcegroup/selectDatavResource' , params),
    // 内容类别筛选获取显示组的内容
    getInfoByClassify:(params)=>req.post('/showresourcegroup/selectbypage',params),
    //新增发布类别树节点
    addPublishClassify:(params)=>req.post('/releaseclassify/insert',params),
    //修改发布类别树节点
    updatePublishClassify:(params)=>req.post('/releaseclassify/update',params),
    //删除发布类别树节点
    deletePublishClassify:(params)=>req.get('/releaseclassify/delete/'+params),
    // 通过窗口id获取 大屏窗口下的数据
    getResourceInfoByWindowId: (param) => req.get(`/showresourcegroup/selectById/${param}`),
    //根据摄像头id查询摄像头信息
    selectByVideoId: (fId) => req.get(`/videoChannelConfig/selectByVideoId/${fId}`),


}
// 大屏服务器管理
export const ScreenServerService = {
    // 分页查询大屏服务器信息
    selectByPage:(params)=>req.post('/screenserver/selectbypage',params),
      // 新增大屏服务器信息
    insert:(params)=>req.post('/screenserver/insert',params),
     // 修改大屏服务器信息
     update:(params)=>req.post('/screenserver/update',params),
     // 删除大屏服务器信息
     delete:(params)=>req.post('/screenserver/delete/'+params),
     // 更新大屏服务器IP信息
     getIp:(params)=>req.get('/screenserver/renewalinfo/'+params),
     // 大屏刷新资源
     refresh:(params)=>req.get('/screenserver/refreshresource/'+params),
     //根据预案组id查询正在显示的场景信息
     selectByGroupId:(params)=>req.get('/screenscene/selectByGroupId/'+params),
}


