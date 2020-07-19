<template>
  <div class="manage">
    <!-- 账号管理列表 -->
    <template v-if="!edit">
      <div class="dictionary_container">
        <el-row>
          <el-col
            :span="12"
            style="paddingRight: 5px;border-right:1px solid #5A6271; height: 690px;"
          >
            <div class="search-view">
              <el-button class="search-btn" @click="openEditDictionaryType">
                <i class="el-icon-plus" style="margin-right: 5px;"></i>新增
              </el-button>
              <el-button v-if="foucsTypeObject.fId" class="search-btn" @click="openEditDictionaryType('update')">
                <i class="el-icon-edit" style="margin-right: 5px;"></i>修改
              </el-button>
              <el-button
                class="del_search_btn"
                v-if="foucsTypeObject.fId"
                @click="deleteDictionaryType"
                style="background-color: #F56C6C"
              >
                <i class="el-icon-delete" style="margin-right: 5px;"></i>删除
              </el-button>
            </div>
            <el-table
              ref="typeTable"
              :data="dictionaryTypeList"
              header-row-class-name="search-header"
              empty-text="暂无数据"
              max-height="600px"
              :stripe="true"
              :highlight-current-row="true"
              @row-click="typeClick"
              style="width: 99%"
            >
              <el-table-column show-overflow-tooltip prop="fDictionaryTypeName" label="字典类型"></el-table-column>
              <el-table-column show-overflow-tooltip prop="fPym" label="参数"></el-table-column>
              <el-table-column show-overflow-tooltip prop="fDescription" label="参数说明"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12" style="paddingLeft: 5px;">
            <div class="search-view" style="height: 32px;">
              <el-button v-if="foucsTypeObject.fId" class="search-btn" @click="openEditDictionaryContent">
                <i class="el-icon-plus" style="margin-right: 5px;"></i>新增
              </el-button>
              <el-button  v-if="foucsContentObject.fId" class="search-btn" @click="openEditDictionaryContent('update')">
                <i class="el-icon-edit" style="margin-right: 5px;"></i>修改
              </el-button>
              <el-button
                class="del_search_btn"
                v-if="foucsContentObject.fId"
                @click="deleteDictionaryContent"
                style="background-color: #F56C6C"
              >
                <i class="el-icon-delete" style="margin-right: 5px;"></i>删除
              </el-button>
            </div>
            <el-table
              ref="contentTable"
              :data="dictionaryContentList"
              header-row-class-name="search-header"
              empty-text="暂无数据"
              max-height="600px"
              :stripe="true"
              @row-click="contentClick"
              :highlight-current-row="true"
              style="width: 100%"
            >
              <el-table-column show-overflow-tooltip prop="fItemName" label="字典内容"></el-table-column>
              <el-table-column show-overflow-tooltip prop="fPym" label="参数"></el-table-column>
              <el-table-column show-overflow-tooltip prop="fItemValue" label="值"></el-table-column>
              <el-table-column show-overflow-tooltip prop="fDescription" label="备注"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </template>
    <!-- 账号管理编辑表单 -->
    <template v-else>
      <div v-show="editType == 'type'" class="search-view edit-form">
        <div @click="closeDictionaryTypeModal(true)" class="header">
          <i class="el-icon-arrow-left" style="font-size: 18px;"></i>
          <span>数据字典类型</span>
        </div>
        <div style="margin-top: 20px;">
          <el-form
            ref="dictionaryType"
            :rules="dictionaryTypeRules"
            label-position="top"
            label-width="100px"
            :model="dictionaryTypeDto"
          >
            <el-row>
              <el-col :span="12" class="form-padding">
                <el-form-item label="类型名称" prop="fDictionaryTypeName">
                  <el-input
                    @input="value => dictionaryTypeDto.fDictionaryTypeName = value.replace(/\s/i, '')"
                    :value="dictionaryTypeDto.fDictionaryTypeName" placeholder="请填写"></el-input>
                </el-form-item> 
              </el-col>
              <el-col :span="12" class="form-padding">
                <el-form-item label="参数" prop="fPym">
                  <el-input
                    @input="value => dictionaryTypeDto.fPym = value.replace(/\s/i, '')"
                    :value="dictionaryTypeDto.fPym" placeholder="请填写"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="form-padding">
                <el-form-item label="类型说明" prop="fDescription">
                  <el-input
                    @input="value => dictionaryTypeDto.fDescription = value.replace(/\s/i, '')"
                    :value="dictionaryTypeDto.fDescription" placeholder="请填写"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-padding">
              <el-button
                style="background: #2483FF;color: #fff;border: 1px solid #2483FF;"
                @click="commitDictionaryTypeData"
              >{{dictionaryTypeDto.fId.length == 0 ? '新增' : '编辑'}}</el-button>
            </el-row>
          </el-form>
        </div>
      </div>
      <div v-show="editType == 'content'" class="search-view edit-form">
        <div @click="closeDictionaryContentModal(true)" class="header">
          <i class="el-icon-arrow-left" style="font-size: 18px;"></i>
          <span>数据字典内容</span>
        </div>
        <div style="margin-top: 20px;">
          <el-form
            ref="dictionaryContent"
            :rules="dictionaryContentRules"
            label-position="top"
            label-width="100px"
            :model="dictionaryContentDto"
          >
            <el-row>
              <el-col :span="12" class="form-padding">
                <el-form-item label="名称" prop="fItemName">
                  <el-input v-model="dictionaryContentDto.fItemName" placeholder="请填写"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="form-padding">
                <el-form-item label="参数" prop="fPym">
                  <el-input v-model="dictionaryContentDto.fPym" placeholder="请填写"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="form-padding">
                <el-form-item label="值" prop="fItemValue">
                  <el-input v-model="dictionaryContentDto.fItemValue" placeholder="请填写"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="form-padding">
                <el-form-item label="备注" prop="fDescription">
                  <el-input v-model="dictionaryContentDto.fDescription" placeholder="请填写"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-padding">
              <el-button
                style="background: #2483FF;color: #fff;border: 1px solid #2483FF;"
                @click="commitDictionaryContentData"
              >保存</el-button>
            </el-row>
          </el-form>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
    import { dictionaryService } from '@/api/system'
  export default {
      name: 'accountManage',
      components: {
      },
      data() {
        return {
            editType: 'type', // type 数据字典类型的增删改 content 数据字典内容的增删改 
            edit: false,
            searchName: '',
            dictionaryTypeList: [], // 数据字典类型列表
            dictionaryContentList: [], // 数据字典内容列表
            foucsTypeObject: {}, // 数组字典类型点击行数据
            foucsContentObject: {}, // 数组字典内容点击行数据
            dictionaryTypeDto: { // 数据字典类型
                fId: '', 
                fPym: '', // 参数
                fDescription: '', // 参数说明
                fDictionaryTypeName: '', // 字典类型名称
            },
            dictionaryContentDto: { // 数据字典内容
                fId: '',
                fItemName: '', // 名称
                fPym: '', // 拼音码
                fItemValue: '', // 值
                fDescription: '', // 备注
            },
            dictionaryTypeRules: { // 数据字典类型校验
                fPym: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                fDescription: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                fDictionaryTypeName: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
            },
            dictionaryContentRules: { // 数据字典内容校验
                fItemName: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                fPym: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                fItemValue: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                fDescription: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
            }
        }
      },
      mounted() {
        this.getDictionaryType();
      },
      methods: {
        /**
         * 获取点击字典内容行数据
         * @param row {Object} -- 数据字典内容一行的对象
         */
        contentClick(row) {
          this.foucsContentObject = row;
        },
        /**
         * 删除数据字典类型
         * @param row {Object} -- 数据字典类型一行的对象
         */
        deleteDictionaryType() {
            this.$confirm(
                `${this.foucsTypeObject.fDictionaryTypeName} 删除后无法恢复，确认删除？`,
                'warning',
                ()=>{},
                async ()=> {
                    const res = await dictionaryService.deleteType(this.foucsTypeObject.fId);
                    if (res.success) {
                        this.$message.success(res.msg);
                        this.getDictionaryType();
                        this.foucsContentObject = {};
                        this.foucsTypeObject = {};
                        this.dictionaryContentList = [];
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            )
        },
        /**
         * 删除数据字典内容
         */
        deleteDictionaryContent() {
            this.$confirm(
                `${this.foucsContentObject.fItemName} 删除后无法恢复，确认删除？`,
                'warning',
                ()=>{},
                async ()=> {
                    const res = await dictionaryService.deleteContent(this.foucsContentObject.fId);
                    if (res.success) {
                        this.$message.success(res.msg);
                        this.getContentListByType(this.foucsTypeObject.fId);
                        this.foucsContentObject = {};
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            )
        },
        /**
         * 打开数据字典类型新增或修改
         * @param type {Object} -- 判断是新增还是修改 update 是修改 不传是新增
         */
        openEditDictionaryType(type) {
            this.dictionaryTypeDto = { 
                fId: '', 
                fPym: '', 
                fDescription: '', 
                fDictionaryTypeName: '', 
            };
            if (type == 'update') {
                this.dictionaryTypeDto = this.foucsTypeObject;
            }
            this.edit = true;
            this.editType = 'type';
        },
         /**
         * 打开数据字典内容新增或修改
         * @param type {String} -- 判断是新增还是修改 update 是修改 不传是新增
         */
        openEditDictionaryContent(type) {
            this.dictionaryContentDto = { 
                fId: '',
                fItemName: '', // 名称
                fPym: '', // 拼音码
                fItemValue: '', // 值
                fDescription: '', // 备注
            };
            if (type == 'update') {
                this.dictionaryContentDto = this.foucsContentObject;
            }
            this.edit = true;
            this.editType = 'content';
        },
        /**
         * 数据字典类型行点击
         * @param row {Object} -- 数据字典类型对象
         */
        typeClick(row) {
            this.foucsTypeObject = row;
            this.foucsContentObject = {};
            this.getContentListByType(row.fId);
        },
        /**
         * 提交数据字典内容数据
         */ 
        commitDictionaryContentData() {
            this.$refs['dictionaryContent'].validate(async (valid) => {
                if (valid) {
                    if (this.dictionaryContentDto.fId.length == 0) {
                        // 新增
                        this.insertDictionaryContent();
                        return;
                    }
                    // 编辑
                    this.editDictionaryContent();
                } else {
                    return false;
                }
            });
        },
        /**
         * 编辑数据字典内容
         */
        async editDictionaryContent() {
            const res = await dictionaryService.updateContent({
              ...this.dictionaryContentDto,
              fDictionaryTypeId: this.foucsTypeObject.fId
            });
            if (res.success) {
                this.$message.success(res.msg);
                this.closeDictionaryContentModal();
                // 返回的dataList数据 遍历获取数据重新渲染选中行
                this.getContentListByType(this.foucsTypeObject.fId, (dataList)=>{
                  for (let item of dataList) {
                    if (item.fId == this.dictionaryContentDto.fId) {
                      this.$refs.contentTable.setCurrentRow(item);
                      break;
                    }
                  }
                });
                this.$nextTick(()=>{
                  
                  this.$refs.typeTable.setCurrentRow(this.foucsTypeObject);
                });
            } else {
                this.$message.error(res.msg);
            }
        },
        /**
         * 增加数据字典内容
         */
        async insertDictionaryContent() {
            const res = await dictionaryService.insertContent({
              ...this.dictionaryContentDto,
              fDictionaryTypeId: this.foucsTypeObject.fId
            });
            if (res.success) {
                this.$message.success(res.msg);
                this.closeDictionaryContentModal();
                this.$nextTick(()=>{
                  this.getContentListByType(this.foucsTypeObject.fId);
                  this.$refs.typeTable.setCurrentRow(this.foucsTypeObject);
                });
            } else {
                this.$message.error(res.msg);
            }
        },
        /**
         * 提交数据字典类型数据
         */ 
        commitDictionaryTypeData() {
            this.$refs['dictionaryType'].validate(async (valid) => {
                if (valid) {
                    if (this.dictionaryTypeDto.fId.length == 0) {
                        // 新增
                        this.insertDictionaryType();
                        return;
                    }
                    // 编辑
                    this.editDictionaryType();
                } else {
                    return false;
                }
            });
        },
        /**
         * 编辑数据字典类型
         */
        async editDictionaryType() {
            const res = await dictionaryService.updateType(this.dictionaryTypeDto);
            if (res.success) {
                this.$message.success(res.msg);
                this.getDictionaryType();
                this.closeDictionaryTypeModal();
                if (!this.foucsTypeObject.fId) return;
                this.$nextTick(()=>{
                  this.$refs.typeTable.setCurrentRow(this.foucsTypeObject);
                });
            } else {
                this.$message.error(res.msg);
            }
        },
        /**
         * 关闭数据字典类型编辑框
         * @param flag {Boolean} -- 如果是true要重新渲染选中的行
         */
        closeDictionaryTypeModal(flag) {
            this.edit = false;
            this.$refs.dictionaryType && this.$refs.dictionaryType.clearValidate();
            if (flag) {
              this.$nextTick(()=>{
                this.$refs.typeTable.setCurrentRow(this.foucsTypeObject);
                this.$refs.contentTable.setCurrentRow(this.foucsContentObject);
              })
            }
        },
        /**
         * 关闭数据字典内容编辑框
         * @param flag {Boolean} -- 如果是true要重新渲染选中的行
         */
        closeDictionaryContentModal(flag) {
            this.edit = false;
            this.$refs.dictionaryContent && this.$refs.dictionaryContent.clearValidate();
            if (flag) {
              this.$nextTick(()=>{
                this.$refs.typeTable.setCurrentRow(this.foucsTypeObject);
                this.$refs.contentTable.setCurrentRow(this.foucsContentObject);
              })
            }
        },
        /**
         * 增加数据字典类型
         */
        async insertDictionaryType() {
            const res = await dictionaryService.insertType(this.dictionaryTypeDto);
            if (res.success) {
                this.$message.success(res.msg);
                this.closeDictionaryTypeModal();
                this.getDictionaryType();
                if (!this.foucsTypeObject.fId) return;
                this.$nextTick(()=>{
                  this.$refs.typeTable.setCurrentRow(this.foucsTypeObject);
                });
            } else {
                this.$message.error(res.msg);
            }
        },
        /**
         * 通过字典类型行获取数据字典内容
         * @param typeId {String} -- 数据字典类型id
         * @param fn {function} -- 获取数据字典内容成功之后需要调用的方法
         */
        async getContentListByType(typeId, fn) {
            const res = await dictionaryService.viewContentByType({ typeId });
            if (res.success) {
                this.dictionaryContentList = res.obj
                fn && fn(res.obj);
            } else {
                this.$message.error(res.msg);
            }
        },
        /**
         * 获取数据字典类型
         */
        async getDictionaryType() {
            const res = await dictionaryService.viewType();
            if (res.success) {
                this.dictionaryTypeList = res.obj;
            } else {
                this.$message.error(res.msg);
            }
        },
        
      }
  }

</script>

<style lang="scss">
.dictionary_container {
        .el-table__empty-block {
          background-color: #303640;
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
        .dictionary_container .el-table--striped .el-table__body tr.el-table__row--striped td {
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
  .search-view {
    padding: 0 0 10px 0;
  }
  .edit-form {
    div.header {
      display: flex;
      align-items: center;
      cursor: pointer;
      width: 130px;
      .el-icon-arrow-left,
      span {
        color: #fff;
        margin-left: 5px;
      }
      span {
        font-size: 15px;
      }
    }
    div.header:hover {
      .el-icon-arrow-left,
      span {
        color: #2483ff;
      }
    }
  }
  .form-padding {
    padding: 0 20px;
  }
  .search-btn {
    background: #2483ff;
    color: #fff;
    border: 1px solid #2483ff;
  }
  .del_search_btn {
    background: #f56c6c;
    color: #fff;
    border: 1px solid #f56c6c;
  }
  .dictionary_container {
    padding: 10px;
  }
}
</style>
