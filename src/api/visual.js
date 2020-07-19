import req from '@/utils/request'

// 可视化页面
export const layoutService = {
    // 获取大屏listv
    getBigScreens:(param)=>req.get('/screenserver/selectall'),
    // 获取对应id下的场景列表
    getScene:(param)=>req.post('/screenscene/selectbypage', param),
    // 获取全部场景
    getAllScene:(param)=>req.post('/scene/selectbypage', param),
    // 查询场景基本信息
    getSceneInfor:(param)=>req.get('/scene/selectbypage/' + param),
    // 保存大屏显示场景信息
    saveScreenScene:(param)=>req.post('/screenscene/savescreenscene', param),
    // 删除场景
    deleteScene:(param)=>req.post('/scene/delete/' + param),
    // 根据显示屏服务器id获取场景类型集合
    getTypeByScreenId:(param)=>req.get('/screenscene/getSceneTypeByScreenServerId/' + param),
    // 获取类型集合
    getType:()=>req.get('/scenetype/selectall'),
    // 修改场景名称或者所属场景类型
    updateNameAndType:(param)=>req.post('/scene/updateNameAndType', param),
    // 设置大屏下的场景参数
    setParam:(param)=>req.post('/screenscene/setParam', param),
    // 指定大屏显示场景信息
    appointRunningScene:(param)=>req.post('/screenscene/appointRunningScene', param),
    // 推送大屏显示
    openSceneInfo:(param)=>req.get('/screenscene/openSceneInfo/' + param),
    // 取消推送的大屏
    canceldelivery:(param)=>req.post('/screenscene/canceldelivery/' + param),
    // 获取屏下预案组
    getPlanGroups:(param)=>req.post('/preplangroup/selectbyscreenid/' + param),
    // 获取预案组下场景
    getPGScenes:(param)=>req.post('/screenscene/selectbypage', param),
    // 添加场景到预案组下
    addToPlanGroup:(param)=>req.post('/screenscene/savescreenscene', param),
    // 批量删除预案组下的场景
    delete_GPScenes:(param)=>req.post('/screenscene/deletebatch', param),
    // 单次删除预案组下的场景
    delete_GPScene:(param)=>req.get('/screenscene/delete/' + param),
    // 预案组全部场景参数设置
    setConfig_GPScenes:(param)=>req.post('/screenscene/setParam', param),
    // 预案组下单个场景参数修改
    setConfig_GPScene:(param)=>req.post('/screenscene/update', param),
    // 新增预案组
    insertPlanGroup:(param)=>req.post('/preplangroup/insert', param),
    // 修改预案组
    updatePlanGroup:(param)=>req.post('/preplangroup/update', param),
    // 删除预案组
    deletePlanGroup:(param)=>req.get('/preplangroup/delete/' + param),
    // 新增场景类型
    insertSceneType:(param)=>req.post('/scenetype/insert', param),
    // 修改场景类型
    updateSceneType:(param)=>req.post('/scenetype/update', param),
    // 删除场景类型
    deleteSceneType:(param)=>req.post('/scenetype/delete/' + param),
    // 大屏下场景
    getScreenScene:(param)=>req.get('/preplangroup/selectsencebyscreenid/' + param),
    // 投放
    launching:(id1, id2)=>req.get('/screenscene/openSceneInfo/' + id1 + '&' + id2),
    // 同步
    synchronization:(param)=>req.post('/preplangroup/copygrouptoscreen' ,param),
    //批量删除
    delete_SelectScene:(param)=>req.post('/scene/deletebatch' ,param),
    //拖拽排序
    moveSort:(param)=>req.post('/screenscene/changesort',param),
}

export const sceneService = {
    // 获取所有资源列表
    getAllResources:(param)=>req.get('/showresourcegroup/selectall'),
    // 保存场景信息
    saveScene:(param)=>req.post('/scene/update', param),
    //查询场景基本信息
    getSceneById:(params)=>req.get('/scene/selectByPrimaryKey/'+params),
    //查询场景资源布局信息
    getSceneLayoutById:(params)=>req.get('/scene/selectResourceInfoById/'+params),
    // 场景资源布局信息保存预置模板
    saveTemplateByScene:(param)=>req.post('/presettemplate/saveTemplateByScene', param),
    // 场景截图上传
    printscreen:(param)=>req.post('/scene/printscreen', param),
    // 新增场景
    insertScene:(param)=>req.post('/scene/insert', param),
    //根据资源类型查询显示组信息
    getSceneByType:(fType)=>req.get(`/showresourcegroup/selectByResourceType/${fType}`),
}

export const templateService = {
    // 获取分页列表
    getTemplatePages:(param)=>req.post('/presettemplate/selectbypage',param),
    //删除模板信息
    deleteTemplate:(param)=>req.post('/presettemplate/delete/'+param),
    //查询模板信息
    getTemplateById:(param)=>req.get('/presettemplate/selectByTemplateId/'+param),
    //新增模板信息
    addTemplate:(param)=>req.post('/presettemplate/insert',param),
    //编辑模板信息
    editTemplate:(param)=>req.post('/presettemplate/update',param),
    //获取全部模板
    getAllTemplatePages: ()=>req.get('/presettemplate/selectAll'),
}


