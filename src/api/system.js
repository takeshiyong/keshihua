import req from '@/utils/request'

// 账号管理
export const AccountService = {
    // 添加账号
    insertAccount: (param) => req.post(`/user/insert`, param),
    // 查询账号分页
    viewAccountByPage: (param) => req.post(`/user/selectbypage`, param),
    // 编辑账号
    updateAccount: (param) => req.post(`/user/update`, param),
    // 重置密码
    resetAccountPwd: (fid) => req.post(`/user/reset/${fid}`),
    // 删除账号
    delete: (fid) => req.post(`/user/delete/${fid}`),
}

// 角色管理
export const roleService = {
    // 新增角色
    insertRole: (param) => req.post(`/role/add`, param),
    // 删除角色
    deleteRole: (fid) => req.get(`/role/delete/${fid}`),
    // 全查角色
    viewAllRole: () => req.get(`/role/get/all`),
    // 修改角色
    updateRole: (param) => req.post(`/role/update`, param),
    // 获取当前用户可分配的角色列表
    getCurrentUserRoleList: () => req.get(`/role/get/usable`),
    //查询当前登录用户的角色列表
    getCurrentRole: () => req.get(`/role/get/current`),

}

// 菜单管理
export const menuService = {
    // 查询全部菜单
    viewAllMenu: () => req.get(`/menu/get/all`),
    // 根据角色id查询菜单列表
    viewMenuByRoleId: (fId) => req.get(`/menu/get/froleid/${fId}`),
    // 获取当前用户下可配置的菜单列表 1 不带按钮 2 带按钮 权限
    getMenuListByAll: (type) => req.get(`/menu/get/current/${type}`),
    // 保存角色下的权限
    saveMenuByRole: (param) => req.post(`/menu/save`, param),
}

// 数据字典相关接口
export const dictionaryService = {
    // 新增字典类型
    insertType: param => req.post(`/dictionarytype/add`, param),
    // 删除字典类型
    deleteType: param => req.post(`/dictionarytype/delete/${param}`),
    // 查询数据字典类型
    viewType: param => req.post(`/dictionarytype/get/all`, param),
    // 修改数据字典类型
    updateType: param => req.post(`/dictionarytype/update`, param),
    // 通过数据字典类型获取内容
    viewContentByType: param => req.post(`/dictionaryitems/get/typeid`, param),
    // 删除字典内容
    deleteContent: param => req.post(`/dictionaryitems/delete/${param}`),
    // 新增数据字典内容接口
    insertContent: param => req.post(`/dictionaryitems/add`, param),
    // 修改数据字典内容接口
    updateContent: param => req.post(`/dictionaryitems/update`, param),
}
