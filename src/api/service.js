import req from '@/utils/request'

export const LoginService = {
    login:(params)=>req.post('/user/login',params),
    getCode:(params)=>req.post('/login/shortMessage',params),
}

// home页面
export const HomeService = {
    getMenu:(param)=>req.get('/menu/get/current/' + param),
    updatePass:(param)=>req.post('/user/updatepassword',param),
}

// startegy页面
export const StartegyService = {
    getGovernments:(param)=>req.get('/usergroup/selectall'),
    getDepUsers:(params)=>req.post('/user/selectbypage',params),
    insertDep:(params)=>req.post('/usergroup/insert',params),
    updateDep:(params)=>req.post('/usergroup/update',params),
    deleteDep:(param)=>req.post('/usergroup/delete/' + param),
    getUserRoles:(params)=>req.get('/role/selectroles'),
    insertUserInfo:(params)=>req.post('/user/insert',params),
    updateUserInfo:(params)=>req.post('/user/update',params),
    deleteUserInfo:(param)=>req.post('/user/delete/' + param),
    resetPassword:(param)=>req.post('/user/reset/' + param),
    getAllUserNum:(param)=>req.get('/user/selectall'),
    addUserToUserGroup:(param)=>req.post('/usergrouprelevamnce/setusergroup',param),
    removeUserOutGroup:(param)=>req.post('/usergrouprelevamnce/removeuser',param),

}
// rolelimits页面
export const RolelimitsService = {
    // 获取角色列表
    getRole:(param)=>req.get('/role/get/tree'),
    // 获取权限菜单列表（树结构）
    getLimitsMenus:(param)=>req.get('/menu/get/current/1'),
    // 通过角色Id获取角色权限
    getRoleMenus:(param)=>req.get('/menu/get/froleid/' + param),
    // 设置权限
    setLimits:(params)=>req.post('/menu/save',params),
    // 获取全部菜单（不是树结构）
    getAllMenu:(param)=>req.get('/menu/get/all'),
    // 新增角色
    insertRoleForm:(params)=>req.post('/role/add',params),
    // 修改角色
    updateRoleForm:(params)=>req.post('/role/update',params),
    // 删除角色
    deleteRoleForm:(param)=>req.get('/role/delete/' + param),
}
// catalog
export const CatalogService = {
    // 获取字典类别
    getDictionaryCategory:(params)=>req.post('/dictionarycategory/selectall',params),
    // 获取字典类别
    insertDictionaryCategory:(params)=>req.post('/dictionarycategory/insert',params),
    // 获取字典类别
    updateDictionaryCategory:(params)=>req.post('/dictionarycategory/update',params),
    // 获取字典类别
    deleteDictionaryCategory:(params)=>req.get('/dictionarycategory/delete/' + params),
    // 获取字典类型
    getDictionaryType:(params)=>req.post('/dictionarytype/get/all',params),
    // 根据类型获取字典内容
    getDictionaryItems:(params)=>req.post('/dictionaryitems/get/typeid',params),
    // 新增类型
    insertDicItemsForm:(params)=>req.post('/dictionarytype/add',params),
    // 修改类型
    updateDicItemsForm:(params)=>req.post('/dictionarytype/update',params),
    // 删除类型
    deleteDicItems:(param)=>req.post('/dictionarytype/delete/' + param),
    // 新增内容
    insertDicContextForm:(params)=>req.post('/dictionaryitems/add',params),
    // 修改内容
    updateDicContextForm:(params)=>req.post('/dictionaryitems/update',params),
    // 删除内容
    deleteDicContext:(param)=>req.post('/dictionaryitems/delete/' + param),
    // 获取内容
    getDictionaryContext:(param1, param2)=>req.get('/dictionaryitems/get/typeidandpym/' + param1 + '/' + param2),
}
// 菜单管理
export const MenuService = {
    //改变菜单顺序
    changeMenuSort:(params)=>req.post('/menu/changesort',params),
    //修改菜单
    updateMenu:(params)=>req.post('/menu/update',params),
}

//数据录入或者数据查找
export const VisualDataService = {
    upload:(params)=> req.post('/home/upload',params),
    productChainData:(params)=>req.post('/detaentering/dataDispose',params),
}
// 屠宰厂
export const slaughterService = {
    // 出品比率
    getProductionRatio:(params)=>req.get('/slaughterhouse/productionRatio','',true),
    // 出品详情
    getProductionDetails:(params)=>req.get('/slaughterhouse/productionDetails','',true),
    // 屠宰分割数据
    getSlaughterDivision:(params)=>req.get('/slaughterhouse/slaughterDivision','',true),
    // 进猪数据
    getIntoThePigDetail:(params)=>req.get('/slaughterhouse/intoThePigDetail','',true),
    // 分割结构占比
    getSplitStructure:(params)=>req.get('/slaughterhouse/splitStructure','',true),
    // 进猪重量占比
    getPigWeightProportion:(params)=>req.get('/slaughterhouse/get/pig/weight/proportion','',true),
}
// 种猪场
export const boarService = {
    // 仔猪同比分析
    getPigletAnalysis:(params)=>req.get('/breedingPig/pigletAnalysis','',true),
    // 获取仔猪情况
    getPigletSituation:(params)=>req.get('/breedingPig/pigletSituation','',true),
    // 母猪配种情况
    getSowBreeding:(params)=>req.get('/breedingPig/sowBreeding','',true),
    // 母猪养殖数据
    getSowFarming:(params)=>req.get('/breedingPig/sowFarming','',true),
    //  获取手动录入数据
    find:(params)=>req.get('/breedingPig/find?page='+params.page+'&size='+params.size+'&code='+params.code,'',true),
    // 添加数据
    updateData:(params)=>req.post('/breedingPig/merge',params,true),
    //删除GET /breedingPig/deleted
    deleted:(params)=>req.get('/breedingPig/deleted?id='+params,'',true),
}
// 育肥场
export const fattenService = {
    // 获取育肥同比分析
    getFatteningAnalysis:(params)=>req.get('/fatteningFarm/fatteningAnalysis','',true),
    // 获取出存栏情况
    getFatteningOutPutStatus:(params)=>req.get('/fatteningFarm/fatteningOutPutStatus','',true),
    // 获取出栏同期对比
    getFatteningSamePeriodCompared:(params)=>req.get('/fatteningFarm/fatteningSamePeriodCompared','',true),
    // 获取育肥情况数据
    getFatteningSituation:(params)=>req.get('/fatteningFarm/fatteningSituation','',true),
}
// 饲料厂
export const feedService = {
    // 饲料生产详情
    getFeedProduction:(params)=>req.get('/feedFactory/feedProduction','',true),
    // 饲料销售情况
    getFeedSales:(params)=>req.get('/feedFactory/feedSales','',true),
    // 生产情况
    getProductionSituation:(params)=>req.get('/feedFactory/productionSituation','',true),
    // 销售情况
    getSaleSituation:(params)=>req.get('/feedFactory/saleSituation','',true),
    // 查询录入数据
    find:(params)=>req.get('/feedFactory/find?page='+params.page+'&size='+params.size+'&year='+params.year,'',true),
}
// 食品加工厂
export const packingService = {
    // 饺子加工产量
    getProcessingOutPut:(params)=>req.get('/foodProcessing/dumplingProcessingOutPut','',true),
    // 饺子产量趋势
    getProductionTrend:(params)=>req.get('/foodProcessing/dumplingProductionTrend','',true),
    // 饺子销售情况
    getSales:(params)=>req.get('/foodProcessing/dumplingSales','',true),
    // 销售情况
    getSalesTrend:(params)=>req.get('/foodProcessing/dumplingSalesTrend','',true),
    //  获取手动录入数据
    find:(page,size)=>req.get('/foodProcessing/find/'+page+'/'+size,'',true),
    //  删除数据
    deleted:(id)=>req.get('/foodProcessing/deleted/'+id,'',true),
    //  修改数据
    update:(data)=>req.post('/foodProcessing/update',data,true),
    //  检索
    search:(param)=>req.post('/foodProcessing/search',param,true),
}
