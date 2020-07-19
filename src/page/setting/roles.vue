<template>
    <div class="manage">
        <!-- 账号管理列表 -->
        <template v-if="!edit">
            <div class="search-containers">
                <el-row style="height: 100%">
                    <el-col :span="8" style="borderRight: 1px solid #5A6271;height: 100%">
                        <div class="search-view">
                            <el-input
                                placeholder="请输入角色名称"
                                :style="`width: ${editRoleStatus ? '170px' : '235px'};`"
                                @input="value => editRoleName = value.replace(/\s/i, '')"
                                :value="editRoleName" ></el-input>
                            <el-button v-if="!editRoleStatus" class="search-btn" @click="insertRoleName">新增</el-button>
                            <template v-else>
                                <el-button class="search-btn" @click="updateRoleName">编辑</el-button>
                                <el-button class="search-btn" style="background:#DEE1E6;border: 1px solid #DEE1E6;color: #000" @click="cancelEditRoleName">取消</el-button>
                            </template>
                        </div>
                        <el-table
                            :data="tableData"
                            header-row-class-name="search-header"
                            empty-text="暂无数据"
                            max-height="600px"
                            :stripe="true"
                            :highlight-current-row="true"
                            @row-click="getRolesIds"
                            style="width: 302px;margin-top: 10px;"
                            >
                            <el-table-column
                                prop="fRoleName"
                                label="角色名称"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="date"
                                width="70"
                                label=" "
                                align="right"
                            >
                                <template slot-scope="scope">
                                    <template v-if="scope.row.fType != 1">
                                        <el-tooltip v-if="scope.row.fType != 1" class="item" :open-delay="400" effect="dark" :content="'编辑'" placement="bottom">
                                            <i class="el-icon-edit" style="cursor: pointer;" @click="showEditRole(scope.row)"></i>
                                        </el-tooltip>
                                        <el-tooltip class="item" :open-delay="400" effect="dark" :content="'删除'" placement="bottom">
                                            <i class="el-icon-delete" style="marginLeft: 10px;cursor:pointer"  @click="delRoleName(scope.row)"></i>
                                        </el-tooltip>
                                    </template>
                                    <template v-else>
                                        <span style="color: #c9c9c9">系统角色</span>
                                    </template>
                                </template>
                            </el-table-column> 
                        </el-table>
                    </el-col>
                    <el-col :span="16" style="height: 100%;padding: 0 10px;box-sizing: border-box;">
                        <div style="display: flex;align-items: center;justify-content: space-between">
                            <div style="display: flex;align-items: center;">
                                <i class="el-icon-s-grid" style="font-size:19px;"/>
                                <span style="margin-left: 5px;font-size: 16px;">菜单列表</span>
                            </div>
                            <el-button v-if="tableRow.fId" class="search-btn" @click="saveMenu">保存</el-button>
                        </div>
                        <div style="paddingTop: 5px;padding-left: 2px;" class="menu_list">
                            <el-tree   ref="menu" @check="checkMenu" node-key="fId" :highlight-current="false" :data="limitMenus" :props="limitMenusProps" :show-checkbox="!!tableRow.fId" class="limitsTree"></el-tree>
                        </div>
                    </el-col>
                </el-row>
                <!-- <el-table
                    :data="tableData"
                    header-row-class-name="search-header"
                    empty-text="暂无数据"
                    max-height="600px"
                    :stripe="true"
                    :highlight-current-row="false"
                    style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <div class="expend-header">
                                <el-tooltip class="item" :open-delay="400" effect="dark" :content="'保存'" placement="bottom" @click="saveRole(scope.row)">
                                    <i class="dvIcon dvIcon-save"></i>
                                </el-tooltip>       
                                <span style="marginLeft: 5px;font-size: 14px;color: #C0C4CC">权限列表</span>
                            </div>
                            <el-checkbox-group v-model="checkList" style="margin-top: 10px;">
                                <el-checkbox v-for="item in roleList" :key="item.key" :label="item.fName" :value="item.fId"></el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="角色名称"
                    >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                            <el-button type="text">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="textAlign: right;marginTop: 5px;">
                    <el-pagination
                        small
                        layout="prev, pager, next"
                        :total="50">
                    </el-pagination>
                </div> -->
            </div>
        </template>
    </div>
</template>
<script>
    import { menuService, roleService } from '@/api/system';
    import { CatalogService } from '@/api/service';

    export default {
        name: 'accountManage',
        components: {},
        data() {
            return {
                edit: false,
                editRoleName: '', // 添加或编辑角色名称时候的变量
                editRoleStatus: false, // 处于角色名称编辑状态
                editRoleObject: {}, // 临时选中的角色对象数据
                tableData:[], // 角色列表
                checkList: [],
                checkedKeys: [], // 选中菜单列表的id
                limitMenusProps:{ // 树结构数据转换
                    children: 'children',
                    label: 'fName',
                    levelNames: ['一级', '二级']
                },
                limitMenus: [],
                roleList: [],
                formLabelAlign: {
                    username: '',
                    password: '',
                    name: '',
                    telephone: '',
                    roles: [],
                    enable: false
                },
                tableRow: {},// 角色名称列表点击获取一行数据
                formRules: {
                    username: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    telephone: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    roles: [
                        {required: true, message: '必填项', trigger: 'change'}
                    ],
                    enable: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ]
                },
                masterId: "",
            }
        },
        mounted() {
            this.getMenuList();
            this.getRoleList();
            this.getMasterId();
        },
        methods: {
            /**
             * 点击复选框的事件
             */
            checkMenu(param, checks) {
                this.checkedKeys = checks.checkedKeys;
            },
            /**
             * 保存菜单权限
             */
            async saveMenu() {
                const res = await menuService.saveMenuByRole({
                    fRoleId: this.tableRow.fId,
                    fMenuIdList: this.checkedKeys
                });
                if (res.success) {
                    this.$message.success(res.msg);
                } else {
                    this.$message.error(res.msg);
                }
            },
            /**
             * 获取当前角色中的权限
             * @param {Object} -- 选中的角色列表一行的对象
             */
            async getRolesIds(row) {
                this.tableRow = row;
                const res = await menuService.viewMenuByRoleId(row.fId);
                if (res.success) {
                    this.$refs.menu.setCheckedKeys(res.obj);
                    if(row.fId == this.masterId){
                        this.limitMenus.map((item) => {
                            item.disabled = true;
                        })
                    }else{
                        this.limitMenus.map((item) => {
                            item.disabled = false;
                        })
                    }
                    this.checkedKeys = res.obj;
                } else {
                    this.$message.error(res.msg);
                }
            },
            /**
             * 删除角色名称
             * @param {Object} -- 角色列表一行的对象
             */
            delRoleName(row) {
                this.$confirm(
                    `${row.fRoleName} 删除后无法恢复，确认删除？`,
                    'warning',
                    ()=>{},
                    async ()=> {
                        const res = await roleService.deleteRole(row.fId);
                        if (res.success) {
                            this.$message.success('角色删除成功');
                            this.getRoleList();
                            if (this.tableRow.fId == row.fId) {
                                this.checkedKeys = [];
                                this.tableRow = {};
                                this.$refs.menu.setCheckedKeys([]);
                            }
                        } else {
                            this.$message.error(res.msg);
                        }
                    }
                )
            },
            /**
             * 编辑角色名称
             */
            async updateRoleName() {
                if (this.editRoleName.trim().length == 0) {
                    this.$message.error('角色名称不能为空');
                    return;
                }
                const res = await roleService.updateRole({
                    fId: this.editRoleObject.fId,
                    fRoleName: this.editRoleName.trim(),
                    fType: this.editRoleObject.fType
                });
                if (res.success) {
                    this.editRoleName = '';
                    this.editRoleStatus = false;
                    this.editRoleObject = {};
                    this.$message.success('角色名称编辑成功');
                    this.getRoleList();
                    this.tableRow = {};
                } else {
                    this.$message.error(res.msg);
                }
            },
            /**
             * 开启角色编辑状态
             * @param {Object} -- 角色列表一行的对象
             */
            showEditRole(row) {
                this.editRoleStatus = true;
                this.editRoleName = row.fRoleName;
                this.editRoleObject = row;
            },
            /**
             * 取消角色编辑状态
             */
            cancelEditRoleName() {
                this.editRoleStatus = false;
                this.editRoleName = '';
                this.editRoleObject = {};
            },
            /**
             * 新增最新角色
             */
            async insertRoleName() {
                if (this.editRoleName.trim().length == 0) {
                    this.$message.error('角色名称不能为空');
                    return;
                }
                const res = await roleService.insertRole({
                    fRoleName: this.editRoleName.trim(),
                    fType: 2
                });
                if (res.success) {
                    this.getRoleList();
                    this.editRoleName = '';
                    this.$message.success(res.msg);
                    this.tableRow = {};
                } else {
                    this.$message.error(res.msg);
                }
            },
            /**
             * 获取全部角色
             */
            async getRoleList() {
                const res = await roleService.viewAllRole();
                if (res.success) {
                    this.tableData = res.obj;
                } else {
                    this.$message.error(res.msg);
                }
            },
            /**
             * 
             * 获取打开资源路径
             */
            async getMasterId(){
            let res = await CatalogService.getDictionaryContext("roleId","master");
                if (res.success) {
                    if (res.obj != null) {
                        this.masterId = res.obj.fItemValue;
                    } else {
                        this.masterId = "";
                    }
                } else {
                    this.$message.warning(res.msg)
                }
            },
            // 获取菜单列表
            async getMenuList() {
                const res = await menuService.getMenuListByAll(2);
                if (res.success) {
                    this.limitMenus = res.obj.menuList;
                } else {
                    this.$message.error(res.msg);
                }
            },
            // 提交表单数据
            commitData() {
                this.$refs['accountForm'].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss">
    .menu_list {
        .el-tree__empty-block {
            background-color: #303640!important;
        }
        .el-tree.limitsTree {
            background-color: #303640!important;
        }
        .el-tree-node__content:hover {
            background-color: transparent;
        }
        .el-tree-node__label {
            color: #fff;
        }
        .el-tree-node.is-current>.el-tree-node__content{
            background-color: transparent!important;

        }
        .menu_list .el-tree-node__content:hover {
            background-color: #303640!important;
        }
        .el-tree-node:focus>.el-tree-node__content {
            background-color: #303640!important;
        }
    }

    .el-table__expand-icon {
        color: #fff;
    }

    .search-containers .el-table__expanded-cell {
        background-color: transparent;
        border: 1px solid #404040;
        padding: 20px;
    }
    .expend-header {
        i,span {
            color: #fff;
        }
        .dvIcon-save {
            cursor: pointer;
        }
        .dvIcon-save:hover {
            color: #2483FF;
        }
    }
    .search-containers {
        .el-table__empty-block {
          background-color: #434b55;
          .el-table__empty-text {
            color: #fff;
          }
        }
        .search-header {
            background-color: #1C222B!important;
        }
        .el-table th {
            div { 
                color: #C0C4CC;
            }
            background-color: #1C222B;
        }
        .el-table td, .el-table th.is-leaf {
            border-bottom: 0px;
        }
        .el-table--striped .el-table__body tr.el-table__row--striped td {
             background-color: #1C222B
        }
        .el-table tr {
            background-color: #303640;
        }
        .el-table__row.current-row>td {
            background-color: #2483FF!important;
        }
        .el-table__row.current-row.el-table__row--striped {
            background-color: #2483FF!important;
        }
        .el-table__row.el-table__row--striped.current-row>td {
            background-color: #2483FF!important;
        }
        .search-containers .el-table--striped .el-table__body tr.el-table__row--striped td {
            background-color: #2483FF!important;
        }
        .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: #2483FF!important;
        }
        .el-table--enable-row-hover .el-table__body tr.el-table__row--striped:hover>td {
            background-color: #2483FF!important;
        }   
        .el-table--border::after, .el-table--group::after, .el-table::before {
            background-color: #1C222B;
        }
        .cell {
            color: #fff;
        }
        .el-pagination {
            color: #fff;
        }
        .el-pager li {
            background-color: #303640;
            line-height: 20px!important;
        }
        .el-pager li.active {
            color: #2483FF;
        }
        .el-pagination button:disabled,.el-pagination .btn-next, .el-pagination .btn-prev {
            background-color: #303640;
            color: #fff;
        }
    }
</style>
<style lang="scss" scoped>
    .manage {
        width: 100%;
        height: 100%;
        
        .edit-form {
            div.header {
                display: flex;
                align-items: center;
                cursor: pointer;
                width: 100px;
                .el-icon-arrow-left,span {
                    color: #fff;
                    margin-left: 5px;
                }
                span {
                    font-size: 15px;
                }
            }
            div.header:hover {
                .el-icon-arrow-left,span {
                    color: #2483FF;
                } 
            }
        }
        .form-padding {
            padding: 0 20px;
        }
        .search-btn {
            margin-left: 10px;
            background: #2483FF;
            color: #fff;
            border: 1px solid #2483FF;
        }
        .search-containers {
            height: 700px;
            box-sizing: border-box;
            padding-right: 10px;
            padding-left: 10px;
        }
        
    }
</style>
