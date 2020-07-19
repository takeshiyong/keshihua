<template>
    <div class="manage">
        <!-- 账号管理列表 -->
        <template v-if="!edit">
            <div class="search-view">
                <el-input
                    @input="value => searchName = value.replace(/\s/i, '')"
                    prefix-icon="el-icon-search"
                    style="width: 200px;"
                    clearable
                    :value="searchName" placeholder="请输入姓名"></el-input>
                <el-button class="search-btn" @click="searchAccount">查询</el-button>
                <el-button class="search-btn" @click="toggleEditStatus(false)">新增</el-button>
            </div>
            <div class="search-container">
                <el-table
                    :data="tableData"
                    header-row-class-name="search-header"
                    empty-text="暂无数据"
                    max-height="600px"
                    :stripe="true"
                    :highlight-current-row="false"
                    style="width: 100%">
                    <el-table-column
                        prop="fAccount"
                        label="账号"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="fUserName"
                        label="姓名"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="角色"
                        show-overflow-tooltip
                        width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.roles.map(data=>(data.fRoleName)).join(',')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fState"
                        label="状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.fState == 1 ? '可用' : '冻结'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        width="180"
                        label="上次登录时间">
                        <template slot-scope="scope">
                            <span>{{moment(scope.row.fLastLoginTime).format('YYYY-MM-DD HH:mm')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150"
                        >
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                @click="toggleEditStatus(scope.row)"
                            >
                                编辑
                            </el-button>
                            <el-button
                                type="text"
                                @click="deleteAccount(scope.row)"
                            >
                                删除
                            </el-button>
                            <el-button
                                type="text"
                                @click="resetAccountPassword(scope.row)"
                            >
                                重置密码
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="textAlign: right;marginTop: 5px;">
                    <el-pagination
                        small
                        layout="prev, pager, next"
                        :page-size="pageParam.pageSize"
                        @current-change="pageCurrentChange"
                        :total="pageParam.total">
                    </el-pagination>
                </div>
            </div>
        </template>
        <!-- 账号管理编辑表单 -->
        <template v-else>
           <div class="search-view edit-form account_manage">
                <div @click="closeModal" class="header">
                        <i class="el-icon-arrow-left" style="font-size: 18px;"></i>
                        <span >账号编辑</span>
                </div>
                <div style="margin-top: 20px;">
                    <el-form  ref="accountForm" :rules="formRules" label-position="top"  label-width="100px" :model="formLabelAlign">
                        <el-row>
                            <el-col :span="12" class="form-padding">
                                <el-form-item label="账号" prop="fAccount">
                                    <el-input
                                        :disabled="formLabelAlign.fId.length!=0"
                                        @input="value => formLabelAlign.fAccount = value.replace(/\s/i, '')"
                                        :value="formLabelAlign.fAccount" placeholder="请填写"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="form-padding">
                                <el-form-item label="密码" prop="fPassword">
                                    <el-input
                                        type="password" :disabled="formLabelAlign.fId.length!=0" 
                                        @input="value => formLabelAlign.fPassword = value.replace(/\s/i, '')"
                                        :value="formLabelAlign.fPassword" placeholder="请填写"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" class="form-padding">
                                <el-form-item label="姓名" prop="fUserName">
                                    <el-input
                                        @input="value => formLabelAlign.fUserName = value.replace(/\s/i, '')"
                                        :value="formLabelAlign.fUserName" placeholder="请填写"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="form-padding">
                                <el-form-item label="电话" prop="fPhone">
                                    <template slot="label">
                                        <span><span style="color: #FF1F0F">*</span>电话</span>
                                    </template>
                                    <el-input
                                        @input="value => formLabelAlign.fPhone = value.replace(/\s/i, '')"
                                        :value="formLabelAlign.fPhone" placeholder="请填写"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" class="form-padding">
                                <el-form-item label="角色" prop="roles">
                                    <el-checkbox-group v-model="formLabelAlign.roles" style="padding: 0 5px;">
                                        <el-checkbox v-for="item in roles" :label="item.fId" :value="item.fId" :key="item.fId" >{{item.fRoleName}}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="form-padding">
                                <el-form-item label="是否可用" prop="fState">
                                    <el-select v-model="formLabelAlign.fState" style="width: 430px;">
                                        <el-option :value="1" :label="'可用'"></el-option>
                                        <el-option :value="2" :label="'冻结'"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="form-padding">
                            <el-button 
                                style="background: #2483FF;color: #fff;border: 1px solid #2483FF;"
                                @click="commitUserAccount"
                            >保存</el-button>
                        </el-row>
                    </el-form>
                </div>
           </div>
        </template>
    </div>
</template>
<script>
import { roleService, AccountService } from '@/api/system';
import moment from 'moment';
  export default {
      name: 'accountManage',
      components: {},
      data() {
        const checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('必填项'));
            }
            const reg = /^1[0-9]{10}$/;
            if (!reg.test(value)) {
                return callback(new Error('格式不正确'));
            } else {
                return callback();
            }
        };
        return {
            moment,
            edit: false,
            searchName: '',
            cameraSearchName: '', // 查询摄像头名称
            tableData:[], // 账号列表
            roles: [], // 可分配的角色列表
            formLabelAlign: { // 用户账号表单对象
                fAccount: '', // 账号
                fPassword: '',  // 密码
                fUserName: '',  // 用户名称
                fPhone: '', // 手机号
                roles: [], // 角色数组
                fState: 1, // 账号状态 1：可用 2：冻结
                fId: ''
            },
            formRules: { // 用户账号表单校验
                fAccount: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                fPassword: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                fUserName: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                fPhone: [
                    {validator: checkPhone, trigger: 'blur'}
                ],
                roles: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                fState: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ]
            },
            pageParam: { // 翻页参数
                currentPage: 1, // 当前页
                pageSize: 10, // 每页数据条数
                total: 0 // 数据总条数
            },
        }
      },
      mounted() {
        this.viewRoles();
        this.viewAccountByPage();
      },
      methods: {
          /**
           * 修改账号逻辑
           */
          async updateAccount() {
            const res = await AccountService.updateAccount({
                ...this.formLabelAlign
            });
            if (res.success) {
                this.$message.success('修改成功');
                this.closeModal();
                this.$nextTick(()=>this.viewAccountByPage());
            } else {
                this.$message.error(res.msg);
            }
          },
          /**
           * 重置当前账号密码
           * @param row {Object} -- 当前一行数据的对象
           */   
          resetAccountPassword(row) {
            this.$confirm(
            `${row.fAccount} 账号密码将被重置，确认吗？`,
            'warning',
                ()=>{},
                async ()=> {
                    const res = await AccountService.resetAccountPwd(row.fId);
                    if (res.success) {
                        this.$message.success("重置成功，新密码为'000000'");
                        this.viewAccountByPage();
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
          },
          /**
           * 重置当前账号密码
           * @param row {Object} -- 当前一行数据的对象
           */
          deleteAccount(row) {
            this.$confirm(
            `${row.fAccount} 账号将被删除，确认吗？`,
            'warning',
                ()=>{},
                async ()=> {
                    const res = await AccountService.delete(row.fId);
                    if (res.success) {
                        this.$message.success("删除成功");
                        this.viewAccountByPage();
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
          },
          /**
           * 通过用户名称查询账号
           */
          searchAccount() {
              this.pageParam.currentPage = 1;
              this.viewAccountByPage();
          },
          /**
           * 账号翻页
           * @param page {Number}  --- 账号翻页
           */
          pageCurrentChange(page) {
              this.pageParam.currentPage = page;
              this.viewAccountByPage();
          },
          /**
           * 切换至编辑状态
           * @param row {Object} -- 选中的编辑账户数据 如果没有则是新增
           */
          toggleEditStatus(row) {
              this.formLabelAlign = row ? {
                  ...row,
                  roles: row.roles.map(data=>data.fId),
                  fPassword: 123213123123, // 为了在页面上显示出有密码的效果, 所以写的假密码, 修改的时候不提交
              } : {
                    fAccount: '', // 账号
                    fPassword: '',  // 密码
                    fUserName: '',  // 用户名称
                    fPhone: '', // 手机号
                    roles: [], // 角色数组
                    fState: 1, // 账号状态 1：可用 2：冻结
                    fId: ''
              };
              this.edit = true;
          },
          /**
           * 翻页查询账号列表
           */
          async viewAccountByPage() {
              const res = await AccountService.viewAccountByPage({
                  currentPage: this.pageParam.currentPage,
                  fUserName: this.searchName,
                  pageSize: this.pageParam.pageSize,
                  fAccount: '',
                  fUserGroupId: '',
              });
              if (res.success) {    
                this.pageParam.total = res.obj.itemTotal;
                this.tableData = res.obj.items;
              } else {
                  this.$message.error(res.msg);
              }
          },
          /**
             * 关闭编辑状态
             */
            closeModal() {
                this.edit = false;
                this.$refs.accountForm && this.$refs.accountForm.clearValidate();
            },
          /**
           * 获取可选择的角色列表
           */
          async viewRoles() {
              const res = await roleService.viewAllRole();
              if (res.success) {
                this.roles = res.obj;
              } else {
                  this.$message.error(res.msg);
              }
          },
        // 提交表单数据
        commitUserAccount() {
            this.$refs['accountForm'].validate((valid) => {
                if (valid) {
                    // 判断用户账号修改还是新增
                    if (this.formLabelAlign.fId.length==0) {
                        this.insertAccount();
                        return;
                    }
                    this.updateAccount()
                } else {
                    return false;
                }
            });
        },
        /**
         * 新增用户账号
         */
        async insertAccount() {
            const res = await AccountService.insertAccount(this.formLabelAlign);
            if (res.success) {
                this.$message.success(res.msg);
                this.closeModal();
                this.$nextTick(()=>this.viewAccountByPage());
            } else {
                this.$message.error(res.msg);
            }
        }
      }
  }

</script>

<style lang="scss">
    .account_manage {
        .el-input.is-disabled .el-input__inner {
            background-color: #464D5A;
            border-color: #464D5A;
            color: #C0C4CC;
            cursor: not-allowed;
        }
    }

    .search-container {
        .el-table__empty-block {
          background-color: #303640;
          .el-table__empty-text {
            color: #fff;
          }
        }
        .search-header {
            background-color: #1C222B!important;
        }
        .el-table__row--striped {
            
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
                background-color: #1C222B!important;
        }
        .el-table tr {
            background-color: #303640;
        }
        .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: #303640!important;
        }
        .el-table--enable-row-hover .el-table__body tr.el-table__row--striped:hover>td {
            background-color: #1C222B!important;
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
        .search-view {
            padding: 0 10px;
                
        }
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
        .search-container {
            padding: 10px;
        }
        
    }
</style>
