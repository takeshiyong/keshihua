import req from '@/utils/request'

//组件管理页面
export const VehicleService = {
    // 查询组件类型树结构
    getVehicleList:()=>req.get('/compatible/getorganizationdata'),
    clickVehicle:(param)=>req.get('/compatible/vehicleLocation/' + param),
    lookVideo:(param)=>req.get('/compatible/enableVideo/' + param),
    filterVehicle:(param)=>req.get('/compatible/api/v1/ChangeType/' + param),
    // 第三方接口
    compatible_get:(opt,param)=>req.get('/compatible/api/get/v2/' + opt + '/' + param),
    compatible_post:(opt,param)=>req.get('/compatible/api/post/v2/' + opt + '/' + param),
}