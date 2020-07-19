import req from '@/utils/request'
// 播放组管理
export const PlayGroupService = {
    // 查询全部播放组
    getPlayGroups:(params)=>req.get('/playgroupinfo/selectall',params),

    // 新增播放组
    insertPlayGroup:(params)=>req.post('/playgroupinfo/insert',params),

    // 修改播放组
    updatePlayGroup:(params)=>req.post('/playgroupinfo/update',params),

    // 删除播放组
    deletePlayGroup:(params)=>req.post('/playgroupinfo/delete',params),

    // 获取播放组里的资源
    getPlayGroupResources: fId => req.get(`/resourceplayinfo/select/byplaygroupid/${fId}`),

    // 查询全部资源组
    getResourceGroups: (params) => req.get('/viewresourcegroup/selectall', params),

    // 查询资源信息
    getResources: (params) => req.post('/viewresourceinfo/selectByResource', params),

    // 查询资源信息
    insertPlayGroupResources: (params) => req.post('/resourceplayinfo/addresource/forplaygroup', params),

    // 分页查询播放组
    selectByPage:(params)=>req.post('/playgroupinfo/selectbypage',params),

    // 上移、下移播放资源
    updateResourcesOrder:(params)=>req.post('/resourceplayinfo/changesort', params),

    // 移出
    deleteResource:(params)=>req.post('/resourceplayinfo/delete',params),

    //发布播放组
    publishPlayGroup: (params) => req.post('/playgroupinfo/publishresource', params),

    // 查询发布资源的分类树
    getPublishClassify: (params) => req.get('/releaseclassify/selectAll', params),

    // 根据播放组id查询播放组信息
    getPlayGroupInfo: fId => req.get(`/resourceplayinfo/select/byplaygroupid/${fId}`),

    // 查询播放数据
    getPlayData:(params)=>req.post('/playgroupinfo/playresource', params),
    // 修改播放间隔等
    updateResource:(params)=>req.post('/resourceplayinfo/update', params),
    // 资源权限人员信息查询
    listPlayGroupUserRelevamnce:(params)=>req.get('/playgroupinfo/selectplaygroupuserrelevamnce/' + params),
    // 移除资源权限
    removePlayGroupUserRelevamnce:(params)=>req.post('/playgroupinfo/removeplaygroupuserrelevamnce',params),
    // 修改资源权限
    updatePlayGroupUserRelevamnce:(params)=>req.post('/playgroupinfo/updateplaygroupuserrelevamnce',params),

}