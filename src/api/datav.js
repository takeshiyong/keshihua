import req from '@/utils/request'

//组件管理页面
export const SubassemblyService = {
    // 查询组件类型树结构
    getSubassemblyTypeInfoByTreen:()=>req.get('/datavsubassemblytype/selectByTreen'),
    //查询一级组件类型信息
    getOneSubassemblyTypeInfos:(param)=>req.get('/datavsubassemblytype/selectSubassemblyByRank/'+param),
    //新增组件类型信息
    addSubassemblyTypeInfo:(param)=>req.post('/datavsubassemblytype/insert',param),
    //编辑组件类型信息
    updateSubassemblyTypeInfo:(param)=>req.post('/datavsubassemblytype/update',param),
     //删除组件类型信息
    deleteSubassemblyTypeInfo:(param)=>req.post('/datavsubassemblytype/delete/'+param),
     //查询组件信息
    getSubassemblys:(param)=>req.post('/datavSubassembly/selectByPageAndTypeId',param),
     //新增组件信息
    addSubassemblyInfo:(param)=>req.post('/datavSubassembly/insert',param),
      //组件更新历史信息查询
    getListSubassemblyHistory:(param)=>req.post('/updatehistory/selectBySearch',param),
    //修改组件宽高信息
    updateSubassemblyHistoryInfo:(param)=>req.post('/updatehistory/updateWidthAndHeight',param),
    //更新组件信息
    updateSubassemblyInfo:(param)=>req.post('/datavSubassembly/update',param)


}


