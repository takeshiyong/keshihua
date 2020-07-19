/*
* @Author: 武志勇
* @Date:   2019-10-28
* @Description: '播放组'
*
* @Modified: 元实 2019-12-15 加上投屏功能
*/

<template>
    <div class="resource-main">
        <aside class="resource-groups">
            <nav class="nav">
                <span class="section-header white-font">显示组类别</span>
                <div class="group-btn">
                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="新建显示组类别">
                        <i class="el-icon-plus" @click="showAddResGroupDialog"></i>
                    </el-tooltip>

                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="修改显示组类别">
                        <i v-show="selectedGroupIdx !== null" class="el-icon-edit" @click="showEditResGroupDialog"></i>
                    </el-tooltip>

                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="删除显示组类别">
                        <i v-show="selectedGroupIdx !== null" class="el-icon-delete" @click="deleteResourceGroup"></i>
                    </el-tooltip>
                </div>
            </nav>

            <div class="groups-container">
                <div
                    :class="`${ selectedGroupIdx === index ? 'group-title-active':'group-title' }`"
                    v-for="(item, index) in groupList"
                    :key="item.fId"
                    @click="selectGroup(item, index)">
                    <span v-if="item.fName.length <= 6" class="title">{{ item.fName }}</span>
                    <el-tooltip
                        :open-delay="400"
                        effect="dark"
                        :content="item.fName">
                        <span v-if="item.fName.length > 6" class="title">{{truncate(item.fName)}}</span>
                    </el-tooltip>
                    <span>{{item.countNum}}</span>
                </div>
                
            </div>
        </aside>

        <section class="resource-list">
            <header class="list-header">
                <el-row type="flex" justify="space-between" class="full-width">
                    <div class="header-left section-header">
                        <h2 v-if="this.addResGroupDialogForm.fName.length < 6">{{this.addResGroupDialogForm.fName}}</h2>
                        <h2 v-else>{{truncate(this.addResGroupDialogForm.fName)}}</h2>
                        <span>{{ resourcesTotal }}</span>
                        <span class="white-font">个</span>
                    </div>

                    <div class="header-right">
                        <div class="search">
                            <el-input v-model="groupName" placeholder="请输入内容" class="right-input" clearable>
                                <i slot="suffix" class="el-icon-search search-btn" style="color: #bcc9d4;line-height: 34px;" @click="searchContent"></i>
                            </el-input>
                        </div>
                    </div>
                </el-row>
            </header>

            <main class="main-list">
                <el-row v-if="resourceList.length !=0" type="flex" justify="start">
                    <div
                        class="resource-item card"
                        v-for="(item, index) in resourceList"
                        :key="item.fId"
                        @mouseenter="onManageResouceMouseenter(index)"
                        @mouseleave="onManageResouceMouseleave(index)">
                        <div class="resource">
                            <div v-if="item.fResourceType == 1" class="recourse-typeTipe">
                                {{showType(item.fResourceType)}}
                            </div>
                            <div v-if="item.fResourceType == 2" class="recourse-typeTipe" style="color: #29a19c">
                                {{showType(item.fResourceType)}}
                            </div>
                            <div v-if="item.fResourceType == 3" class="recourse-typeTipe" style="color: #2483ff">
                                {{showType(item.fResourceType)}}
                            </div>
                            <div v-if="item.fResourceType == 4" class="recourse-typeTipe" style="color: #064acb">
                                {{showType(item.fResourceType)}}
                            </div>
                            <div v-if="item.fResourceType == 5" class="recourse-typeTipe" style="color: #009975">
                                {{showType(item.fResourceType)}}
                            </div>
                            <div class="recourse-info">
                                <img :src="pictureUrl + item.fPreviewPicture" class="full-width" :onerror="defaultImag"/>
                                <div class="recourse-modal" :ref="`modal${index}`">
                                    <button class="preview-btn" @click="handleCastToBigScreen(item)">投屏</button>
                                </div>
                            </div>

                            <div class="screen-main">
                                <span v-if="item.fResourceName.length <= 6" class="font-12" style="width: 120px;">{{ item.fResourceName }}</span>
                                <el-tooltip
                                    :open-delay="400"
                                    effect="dark"
                                    :content="item.fResourceName">
                                    <span v-if="item.fResourceName.length > 6" class="font-12" style="width: 120px;">{{truncate(item.fResourceName)}}</span>
                                </el-tooltip>
                                <div @click="showDetail(item)">
                                    <span  style="font-12px;cursor: pointer;color: #0580DC">查看详情</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-row>
                <div v-else style="width: 100%;text-align: center;">
                    <div class="favorite-empty">
                        <img style="width: 100px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAACACAMAAAD6ZS3TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTAC+/wC7/wC7/wC7/wC9/wC7/wC8/wC6/wPE/gC8/wC7/wC7/wC8//7DAf/DAN3FLMnJP//EAMvBNJnAZv/DALfASKfAWAC6///CANzAafIAAAAYdFJOUwAe2ZfrMsOA+A1JrW9c37EpE0zteoPTv/JHy3IAAARkSURBVGje5ZvZgqsgDIZd6l7X6kz7/i96pu6SgAkCXhxuLX4hJD9BqOdptzyOc++ulsfvvxaXt8DL4D23wLkB2XOFjwY8M6fwx1toD2cGZAmAjwYkLgzww/QtaWno3we3b0BUCLignJJv14rIFXzKeDcGAMqmd5H8kS34cYjQMbkVgZsjDPoXCQtD8GdACm+QFCYMAAL3SHxyVl6VQiBwJy/0we8vSCF05/looMGJbwhe6k2XjhReSaWMGKx0eJFfS1WOFBqRUV0DRLj2KpZraHEZGFxCuQaIMXO5gmFoMRQ4E/UbNAB9K9ALY2tGdK7FfpJipYStEu04qeCx8XoBENJNi0NxdmxUS2By03B+AgpWG9UasjuQ4c0XzMi+SIE3bUCJ7ouO+DgQgsPUpklQ0jRA8YlopJldWy7AwyyR4MEUPZ6XNUeQ/e+cSvEwQB+lScUtxoBS4L8GpIbE1xfg8ZzPSjyUKD0N9EOZkp7g5XYzEl0YQrAbwikembWIJ3GqCSTgYcwWvq7EiflDwsNaiSiEAC6qBxGPSIbPljhEush40tvUEof8iIEn+FI6WzJnsfBkJSbHKg9PE0JGpnLxahVBJU4lE3y8WomZKq2Dlysxe43Sw+PzK67QhAVSF49ENyMtDeCRXSu/OruCRz4ccGvTa3jcAEZlfhUPlJizHJvACwHPK0YM4Pfpzi3FjODX16Sa/f5TfBaVSZzehp+riPhO/Nb+E3zbDXVVfarq9dM3rvFN/dm3V+8S3w4fsb1aZ/im+sBWNY7wC70euq7p+t/XbEDnBN9O9KHd7PnZxm8dX+9cvbR+4jvAdwj9r2xc3G8bP7p+R8/LbB1/ZR0/Dn449HvkO7Ms48eZb4/9Un+zyy6+HTNO7FdsT+ziuzXBD/2y2fuVZfwg+n7qF83TYhtfz+kt9CuXqLCMr8Spn/rl9+J9R86v/toA+o2FnovIx/tFrvIe7ZesetTdgA8daj7sF25FQOceP+5I25er9R7d5Ez1VnMPfhq7o1pPSXePP9Cd42d6f9zlsI8sNfEC3dM9MdTEC3RP8aHcAv5XoHu6R5Za+F6ke7pHlkx8lKyu748PYq0jSxY+Kt7PZfAv8aHGgR0LPx62+Mvgm9PPxBQDyPjpsOVb4DTo4FEDTr+PE/HL19dw8X0v+9TGO5og4beXJkvWNXJDOXc3KPjdiL6aNn5VIHiKIoTn+MN85uieA48TihCe4YV0ouGRA7tcBy+eORUZEQ8P7HAhVOE1lYzTXY6PLl89IVydkOHlV2ZY7UwIcTwIXf17T2ohxPDm7jyhQrg3AOKhbF2986YQQoB/nl64a+qqqhumARJ/CnjCkjV/WubxZUJ4wJMqhvlEoeZOASqEO3xOu7Uyf1ev+DGAKMmKJ0ucPh4RwsUgusTpOh8XQqwpJa7VCj3pGgra2Tal5SeeUgjt3Kkn1k+Gb9XqCaHDf4LiQmjwRrWGENr/C6pCCNPCPXwTQmt/PaUIYXwZ/g8RWG6u5vFIYgAAAABJRU5ErkJggg=="/>
                        <p class="tips">暂无数据</p>
                    </div>
                </div>
            </main>

            <footer v-if="resourcesTotal > 12">
                <el-row type="flex" justify="end">
                    <div  v-if="resourceList.length !=0" class="paginator">
                        <el-pagination
                                layout="prev, pager, next"
                                
                                :current-page.sync="pagination.currentPage"
                                :page-count="pagination.pageCount"
                                @current-change="goToPage">
                        </el-pagination>
                    </div>
                </el-row>
            </footer>
        </section>

        <DialogModal
            :showModal="isAddResGroupDialogShown"
            @closeModals="closeModal('addResGroupDialogForm', 'isAddResGroupDialogShown')"
            :modalTitle="`${ isEditResGroupMode ? '编辑' : '新建' }显示组类别`">
            <template v-slot:container>
                <div class="modal-content">
                    <el-form
                            ref="addResGroupDialogForm"
                            label-position="top"
                            :inline="true"
                            :model="addResGroupDialogForm"
                            :rules="addResGroupDialogRules"
                            class="full-width">
                        <el-row>
                            <el-form-item label="显示组类别名称" prop="fName" class="full-width">
                                <el-input
                                    @input="value => addResGroupDialogForm.fName = value.replace(/\s/i, '')"
                                    :value="addResGroupDialogForm.fName" placeholder="请输入显示组类别名称"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>
            </template>

            <template v-slot:footer>
                <el-button type="primary" class="font-12" @click="addResourceGroup">
                    {{ isEditResGroupMode ? '编辑' : '新建' }}
                </el-button>
            </template>
        </DialogModal>

        <DialogModal
                :showModal="isAddResDialogShown"
                @closeModals="closeModal('addResourceForm', 'isAddResDialogShown')"
                :modalTitle="`${ isEditResGroupMode ? '编辑' : '新建' }资源`">
            <template v-slot:container>
                <div class="modal-content">
                    <el-form
                            ref="addResourceForm"
                            label-position="top"
                            :inline="true"
                            :model="addResourceForm"
                            :rules="addResourceRules"
                            class="full-width">
                        <el-row>
                            <el-form-item label="资源名称" prop="fName" class="full-width">
                                <el-input v-model="addResourceForm.fName" placeholder="请输入资源名称"></el-input>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item label="资源组" prop="fResourceGroupId" class="full-width">
                                <el-select class="full-width" v-model="addResourceForm.fResourceGroupId" placeholder="请选择资源组">
                                    <el-option v-for="group in groupList"
                                               :key="group.fId"
                                               :label="group.fGroupName"
                                               :value="group.fId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item label="资源类型" prop="fType" class="full-width">
                                <el-select
                                        class="full-width"
                                        v-model="addResourceForm.fType"
                                        placeholder="请选择资源类型"
                                        @change="clearResourceUrl">
                                    <el-option label="图片" :value="1"></el-option>
                                    <el-option label="网址" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <template v-if="addResourceForm.fType === 1">
                                <el-form-item label="铺满方式" prop="fCoveredType">
                                    <el-switch
                                            v-model="addResourceForm.fCoveredType"
                                            inactive-text="全屏铺满"
                                            active-text="等比铺满"
                                            :inactive-value="1"
                                            :active-value="2"
                                            inactive-color="#2483ff"
                                            active-color="#666">
                                    </el-switch>
                                </el-form-item>

                                <el-form-item label="图片" prop="fUrl" class="full-width">
                                    <el-upload
                                            ref="updloader"
                                            class="image-uploader"
                                            accept=".png,.jpg,.jpeg"
                                            :action="pictureUploadUrl"
                                            :show-file-list="false"
                                            :on-success="handleUploadSuccess"
                                            :before-upload="handleBeforeUpload">
                                        <img v-if="addResourceForm.fUrl" :src="thumbnailImageUrl" class="image-thumb">
                                        <i v-else class="el-icon-plus image-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </template>

                            <template v-if="addResourceForm.fType === 2">
                                <el-form-item label="资源网址" prop="fUrl" class="full-width">
                                    <el-input v-model="addResourceForm.fUrl" placeholder="请输入资源编号"></el-input>
                                </el-form-item>
                            </template>
                        </el-row>
                    </el-form>
                </div>
            </template>

            <template v-slot:footer>
                <el-button type="primary" class="font-12" @click="addResource">
                    {{ isShowEditResDialogMode ? '编辑' : '新建' }}
                </el-button>
            </template>
        </DialogModal>

        <DialogModal
                :showModal="isDistribDialogShown"
                @closeModals="closeModal('distributionForm', 'isDistribDialogShown')"
                modalTitle="发布资源">
            <template v-slot:container>
                <div class="modal-content">
                    <el-form
                            ref="distributionForm"
                            label-position="top"
                            :inline="true"
                            :model="distributionForm"
                            :rules="distributionRules"
                            class="full-width">
                        <el-row>
                            <el-form-item label="发布类别" prop="fReleaseClassifyId" class="full-width">
                                <el-select class="full-width" v-model="distributionForm.fReleaseClassifyId" placeholder="请选择发布类别">
                                    <el-option v-for="distribClass in distribClasses"
                                               :key="distribClass.fId"
                                               :label="distribClass.fName"
                                               :value="distribClass.fId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>
            </template>

            <template v-slot:footer>
                <el-button type="primary" class="font-12" @click="distributeResource">
                    发布
                </el-button>
            </template>
        </DialogModal>
        
        <!-- 展示详细信息 -->
        <DialogModal style="z-index: 999" :showModal="showParamByPreGroup" @closeModals="showParamByPreGroup=false" modalTitle="详细信息">
          <template v-slot:container>
              <div style="width: 900px;min-width: 900px;display: flex; flex-direction: row">
                  <div class="groupDetail">
                    <img :src="pictureUrl+parametersForm.fOriginalPicture" style="width: 100%;height:100%" :onerror="defaultImag">
                  </div>
                  <div class="one-scene-infor">
                      <el-row class="infor-row">
                          <div class="infor-field">资源名称</div>
                          <div class="field-context">{{parametersForm.fResourceName}}</div>
                      </el-row>
                      <el-row class="infor-row">
                          <div class="infor-field">资源类别</div>
                          <div class="field-context">{{showType(parametersForm.fResourceType)}}</div>
                      </el-row>
                      <el-row class="infor-row" style="height: 115px;padding:5px">
                          <div class="infor-field">访问地址</div>
                          <a class="field-link-context" 
                                :href="baseUrl+parametersForm.fVisitUrl"
                                target="_blank" 
                                v-if="parametersForm.fVisitUrl != null && parametersForm.fVisitUrl != '' "> 
                                    {{baseUrl}}{{parametersForm.fVisitUrl}}
                          </a>
                      </el-row>
                      <el-row class="infor-row">
                          <div class="infor-field">发布时间</div>
                          <div class="field-context">{{moment(parametersForm.fCreateTime).format('YYYY-MM-DD')}}</div>
                      </el-row>
                  </div>
              </div>
          </template>
        </DialogModal>

        <VPreview :showPreview="isPreviewShown" :type="1" :options="previewOptions" @close="handleClosePreview"></VPreview>
        <VSetBigScreenDialog
                :shown="isBigScreenDialogShown"
                :type="castResourceType"
                :isTemporal="false"
                :options="bigScreenOptions"
                @close="closeBigScreenDialog"></VSetBigScreenDialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import { ShowResourceGroupService ,ResourceService} from '@/api/resource'
    import { CatalogService } from '@/api/service'
    import DialogModal from '../../components/DialogModal.vue'; //弹框
    import VPreview from '../../components/VPreview.vue';  //预览弹框
    import VSetBigScreenDialog from '../../components/VSetBigScreenDialog';  //预览弹框

    export default {
        components: {
            DialogModal,
            VPreview,
            VSetBigScreenDialog
        },

        data() {
            const validateUrl = (rule, url, callback) => {
                const type = this.addResourceForm.fType;

                if (type === 2) {
                    if (/^(http|https)/i.test(url)) {
                        callback();
                    } else {
                        callback(new Error('路径格式不正确， 正确格式的例子http://www.baidu.com!'));
                    }
                } else {
                    callback();
                }
            };

            return {
                baseApi: "",   //基础路径
                baseUrl: window.location.origin,
                moment,
                defaultImag: 'this.src="' + require('../../image/common/noFile.png') + '"', //出错时显示图片
                recourcesOrder: { //资源排序
                    currentOrder: '按创建时间排序', //选择的排序
                    dropdownItemsShow: [{
                        id: 2,  //排序方式的id
                        name: '按名称排序' //排序方式的name
                    }, /*{
                        id: 3,  //排序方式的id
                        name: '按创建时间排序' //排序方式的name
                    }*/],
                    allDropdownItems: [/*{
                        id: 1, //排序方式的id
                        name: '按修改时间排序' ////排序方式的name
                    }*/, {
                        id: 2,  //排序方式的id
                        name: '按名称排序' //排序方式的name
                    }, {
                        id: 3,  //排序方式的id
                        name: '按创建时间排序' //排序方式的name
                    }]
                },

                groupList: [], //显示组分类数组
                selectedGroupIdx: 0, //选择的显示组分类的index
                selectedGroup: {}, //选择的显示组分类
                isAddResGroupDialogShown: false, //是否显示新建显示组分类弹框
                isEditResGroupMode: false, //是否编辑显示组分类
                addResGroupDialogForm: { //新建显示组分类的form数据
                    fName: '', //显示组分类名称
                },
                addResGroupDialogRules: {　//验证新建显示组分类的数据
                    fName: [
                        { required: true, message: '请输入资源组名称', trigger: 'blur' }
                    ]
                },

                resourceList: [], //资源数组
                resourcesTotal: 0, //资源的数量

                groupName: "",  //显示组名称
                isAddResDialogShown: false, //是否显示新建资源弹框
                isShowEditResDialogMode: false, //是否编辑资源
                BASE_API: this.pictureUrl, //上转图片的url前缀
                pictureUploadUrl: '', //上转图片的url
                thumbnailImageUrl: '', //图片的缩列图
                addResourceForm: {   //新建资源的form数据
                    fName: '', //资源名称
                    fCoveredType: 1, //铺满还是等比满
                    fId: '', //资源id
                    fResourceGroupId: '', //资源组id
                    fType: null, //1 - 图片、2 - url
                    fUrl: '', //资源url
                },
                addResourceRules: {　//验证新建资源的数据
                    fName: [
                        { required: true, message: '请输入资源名称', trigger: 'blur' }
                    ],

                    fType: [
                        { required: true, message: '请选择资源类型', trigger: 'change' }
                    ],

                    fUrl: [
                        { required: true, message: '请选择填写资源网址', trigger: 'blur' },
                        { max: 500, message: '资源URL不能超过500个字符', trigger: 'blur' },
                        { validator: validateUrl, trigger: 'blur' }
                    ]
                },

                selectedResource: {}, //选择的资源

                isDistribDialogShown: false,  //是否显示选择发布类型的弹框
                distribClasses: [], //发布类型数组
                distributionForm: { //发布资源的form数据
                    fReleaseClassifyId: '', //资源类型id
                    fResourceId: '', //资源id
                    fResourceName: '', //资源名称
                    fResourceType: 1, //资源类型
                    fVisitUrl: '', //访问地址
                    type: 1 //类型
                },
                distributionRules: { //验证发布资源的数据
                    fReleaseClassifyId: [
                        { required: true, message: '请选择发布类型', trigger: 'change' }
                    ]
                },

                isPreviewShown: false, //是否显示预览
                previewOptions: { //预览参数
                    type: 1, //资源类型
                    coveringType: 1,  //铺满方式
                    id: '' //资源id
                },

                pagination: {   //分页
                    currentPage: 1,
                    pageCount: 1,
                    fResourceName: ""
                },

                showParamByPreGroup: false,  //展示详情按钮
                parametersForm: {},   //展示详情

                isBigScreenDialogShown: false, //是否展示投屏弹框
                bigScreenOptions: {}, //投屏参数
                castResourceType: null, //投屏显示组类型
            };
        },

        mounted() {
            this.getResourceGroups();
            this.getBaseUrl()
        },

        methods: {
            /**
             * 截断文字
             * @param {string} name --- 文字
             * @param {number} maxlength --- 文字长度
             */
            truncate(name, maxlength = 6) {
                if (name.length > maxlength) {
                    return name.substr(0, 6) + '...';
                } else {
                    return name;
                }
            },
            /**
             * 获取显示组
             * @returns {Promise<void>}
             */
            async getResourceGroups() {
                let result = await ResourceService.getPublishClassify();

                if (result.success) {
                    this.groupList = result.obj;
                    this.selectGroup(this.groupList[0], 0);
                    let name = this.groupList[this.selectedGroupIdx].fName;
                    this.addResGroupDialogForm = {
                        fName: name
                    }
                } else {
                    this.groupList = [];
                    this.$message.error(result.msg);
                }
            },

            /**
             * 显示新建显示组分类的弹框
             */
            showAddResGroupDialog() {
                this.clearAddresGroupForm();
                this.isAddResGroupDialogShown = true;
                this.isEditResGroupMode = false;
            },

            /**
             * 清理显示组分类数据
             */
            clearAddresGroupForm() {
                this.addResGroupDialogForm.fName = '';
            },

            /**
             * 编辑显示组分类
             */
            showEditResGroupDialog() {
                this.setResGroupFormForEdit();
                this.isAddResGroupDialogShown = true;
                this.isEditResGroupMode = true;
            },

            /**
             * 编辑显示组分类的时候设置原来的资源数据
             */
            setResGroupFormForEdit() {
                let form =  this.addResGroupDialogForm;
                let name = this.groupList[this.selectedGroupIdx].fName;
                form.fName = name;
                this.addResGroupDialogForm = {
                    fName: name
                }
            },

            /**
             * 删除显示组分类
             */
            deleteResourceGroup() {
                let name = this.groupList[this.selectedGroupIdx].fName;
               
                this.addResGroupDialogForm = {
                    fName: name
                }
                this.$confirm(`${this.addResGroupDialogForm.fName} 删除后无法恢复，确认删除？`, 'warning', null, async () => {
                    if (this.selectedGroup.fNum) {
                        this.$message.error('此分类下有资源，不能删除！');
                        return;
                    }

                    let groupId = this.groupList[this.selectedGroupIdx].fId;
                    let result = await ShowResourceGroupService.deletePublishClassify(groupId);

                    if (result.success) {
                        this.getResourceGroups();
                        this.selectGroup(this.groupList[0], 0);
                        this.$message.success('成功！');
                    } else {
                        this.$message.error(result.msg);
                    }
                });
            },

            /**
             * 新建显示组分类
             */
            addResourceGroup() {
                this.$refs.addResGroupDialogForm.validate(async valid => {
                    let groupData =  null;

                    if (valid) {
                        if (!this.isEditResGroupMode) {
                            groupData = this.addResGroupDialogForm;
                        } else {
                            groupData = this.setGroupDataForEdit();
                        }

                        this.submitResourceGroup(groupData);
                    }
                });
            },

            /**
             * 提交显示组分类数据
             * @param {Object} groupData --- 提交的数据
             */
            async submitResourceGroup(groupData) {
                let res = null;

                if (!this.isEditResGroupMode) {
                    res = await ShowResourceGroupService.addPublishClassify(groupData);
                } else {
                    res = await ShowResourceGroupService.updatePublishClassify(groupData);
                }

                if (res.success) {
                    this.$message.success(res.msg);
                    this.getResourceGroups();
                    this.closeModal('addResGroupDialogForm', 'isAddResGroupDialogShown');
                } else {
                    this.$message.error(res.msg, true);
                }
            },

            /**
             * 编辑资源组的时候设置要提交的数据
             */
            setGroupDataForEdit() {
                let groupData = this.groupList[this.selectedGroupIdx];

                groupData.fName = this.addResGroupDialogForm.fName;

                return groupData;
            },

            /**
             * 跳到第几页
             */
            goToPage(page) {
                this.pagination.currentPage = page;
                this.getResources();
            },

            /**
             * 选择资源组
             * @param {Object} resourceGroup --- 选择的资源
             * @param {number} index ---　选择资源组的index
             */
            selectGroup(resourceGroup, index) {
                this.selectedGroupIdx = index;
                this.selectedGroup = resourceGroup;
                this.getResources();
                let name = this.selectedGroup.fName;
                    this.addResGroupDialogForm = {
                        fName: name
                }
            },

            /**
             * 获取属于选择的显示组分类的资源
             */
            async getResources() {
                let params = this.setGetResourcesParams();
                let result = await ShowResourceGroupService.getInfoByClassify(params);

                if (result.success) {
                     
                    if(result.obj.items != null){
                        this.pagination.pageCount = result.obj.pageCount;
                        this.resourceList = result.obj.items;
                        this.resourcesTotal = result.obj.itemTotal;
                        
                    }else{
                        this.resourceList = [];
                        this.resourcesTotal = 0;
                    }
                    
                } else {
                    this.resourceList = [];
                    this.resourcesTotal = 0;
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置获取资源请求的参数
             */
            setGetResourcesParams() {
                return {
                    pageCurrent: this.pagination.currentPage,
                    fReleaseClassifyId: this.selectedGroup.fId,
                    pageSize: 12,
                    fResourceName: this.pagination.fResourceName,
                }
            },

           


            /**
             * 鼠标移入事件 展示预览遮罩层
             * @param {number} index --- 资源id
             */
            onManageResouceMouseenter(index) {
                if (this.$refs[`modal${index}`][0]) {
                    this.$refs[`modal${index}`][0].style.opacity = 1;
                }
            },

            /**
             * 鼠标移出事件 关闭预览遮罩层
             * @param {number} index --- 资源id
             */
            onManageResouceMouseleave(index) {
                if (this.$refs[`modal${index}`][0]) {
                    this.$refs[`modal${index}`][0].style.opacity = 0;
                }
            },

            
            /**
             * 清理资源数据
             */
            clearAddResourceForm() {
                const resourceForm = this.addResourceForm;

                resourceForm.fName = '';
                resourceForm.fCoveredType = 1;
                resourceForm.fNo = '';
                resourceForm.fPictureUrl = '';
                resourceForm.fResourceGroupId = this.selectedGroup.fId;
                resourceForm.fUrl = '';
                resourceForm.fType = null;
            },

            /**
             * 关闭弹框清空信息
             * @param {string} formName --- 表单的名称
             * @param {string} modalProps --- 设置是否显示弹框的属性的名称
             */
            closeModal(formName, modalProps) {
                this[modalProps] = false;
                if (this.$refs[formName])
                    this.$refs[formName].clearValidate();
            },

            /**
             * 照片上转成功
             */
            handleUploadSuccess(response) {
                if (response.success) {
                    this.addResourceForm.fUrl = response.obj;
                    this.thumbnailImageUrl = this.pictureUrl + response.obj;
                } else {
                    this.$message.error(response.msg);
                }
            },

            /**
             * 上传图片前的钩子
             * @param {Object} file --- 上传的图片
             */
            handleBeforeUpload(file) {
                return new Promise((resolve) => {
                    this.pictureUploadUrl = this.uploadUrl + 'viewresourceinfo/upload';

                    this.$refs.updloader.$nextTick(() => {
                        resolve(file);
                    });
                });
            },

            /**
             * 清理资源url和类型数据
             */
            clearResourceUrl() {
                let resource = this.addResourceForm;

                resource.fPictureUrl = '';
                resource.fUrl = '';
            },

            /**
             * 添加资源
             */
            addResource() {
                this.$refs.addResourceForm.validate(async valid => {
                    if (valid) {
                        this.submitResourceData(this.addResourceForm);
                    }
                });
            },

            /**
             * 提交资源数据
             * @param resourceData
             */
            async submitResourceData(resourceData) {
                let res = null;

                if (!this.isShowEditResDialogMode) {
                    res = await ResourceService.insertResource(resourceData);
                } else {
                    res = await ResourceService.updateResource(resourceData);
                }

                if (res.success) {
                    this.getResourceGroups();
                    this.getResources();
                    this.closeModal('addResourceForm', 'isAddResDialogShown');
                } else {
                    this.$message.error(res.msg, true);
                }
            },

            /**
             * 显示发布资源弹框
             * @param {Object} resource --- 资源数据
             */
            async showDistribResDialog(resource) {
                this.clearDistribForm();
                this.getDistributionClasses();
                this.selectedResource = resource;
                this.isDistribDialogShown = true;
            },

            /**
             * 清理
             */
            clearDistribForm() {
                this.distributionForm.fReleaseClassifyId = '';
            },

            /**
             * 获取发布类型
             */
            async getDistributionClasses() {
                let res = await ResourceService.getPublishClassify();

                if (res.success) {
                    this.distribClasses = res.obj;
                } else {
                    this.$message.error(res.msg);
                }
            },

            /**
             * 发布资源
             */
            distributeResource() {
                this.$refs.distributionForm.validate(async valid => {
                    if (valid) {
                        let res = await this.setResourceDistribution(true);
                        if (res) {
                            this.closeModal('distributionForm', 'isDistribDialogShown');
                        }
                    }
                });
            },

            /**
             * 发布资源或取消发布资源
             */
            async setResourceDistribution(isDistribute) {
                this.setDistributionData(isDistribute);

                let res = await ResourceService.publishResource(this.distributionForm);

                if (res.success) {
                    this.getResources();
                    //this.selectedResource.fIsPublish =  isDistribute ? true : false;
                    this.selectedResource.publishClassId = this.distributionForm.fReleaseClassifyId;
                } else {
                    this.$message.error(res.msg)
                }

                return res.success;
            },

            /**
             * 设置发布属性
             * @param {number} isDistribute --- 是否发布
             */
            setDistributionData(isDistribute) {
                const distribData = this.distributionForm;

                distribData.type = isDistribute ? 1 : 2; //type为1 - 发布, type为2 - 取消发布
                distribData.fVisitUrl = this.selectedResource.fUrl;
                distribData.fResourceId = this.selectedResource.fId;

                if (!isDistribute) {
                    distribData.fId = this.selectedResource.fResourceId;
                } else {
                    distribData.fResourceName = this.getClassifResourceId(this.distributionForm.fReleaseClassifyId);
                }
            },

            /**
             * 获取发布分类名称
             * @param {string} classId --- 发布类型名称
             */
            getClassifResourceId(classId) {
                let idx = this.distribClasses.findIndex((item) => item.fId === classId);

                return this.distribClasses[idx].fName;
            },

            /**
             * 取消发布资源
             * @param {Object} resource --- 资源数据
             */
            async cancelDistribResouce(resource) {
                this.$confirm('确定取消发布？', 'warning', null, async () => {
                    this.clearDistribForm();
                    this.selectedResource = resource;
                    this.setResourceDistribution(false);
                });
            },

            /**
             * 编辑资源
             * @param {Object} resource --- 资源数据
             */
            showEditResDialog(resource) {
                this.setEditResDialogForm(resource);
                this.isAddResDialogShown = true;
                this.isShowEditResDialogMode = true;
            },

            /**
             * 设置编辑资源的数据
             * @param {Object} resource --- 资源数据
             */
            setEditResDialogForm(resource) {
                this.addResourceForm = Object.assign({}, resource);
                this.thumbnailImageUrl = this.pictureUrl + resource.fUrl;
            },

            /**
             * 删除资源
             * @param {Object} resource --- 资源数据
             */
            deleteResource(resource) {
                this.$confirm('确定删除？', 'warning', null, async () => {
                    let params = this.setDeleteResourceParams(resource.fId);
                    let result = await ResourceService.deleteResource(params);

                    if (result.success) {
                        this.getResourceGroups();
                        this.getResources();
                        this.$message.success('成功！');
                    } else {
                        this.$message.error(result.msg);
                    }
                });
            },

            /**
             * 设置删除资源的请求的参数
             * @param {string} id --- 资源id
             */
            setDeleteResourceParams(id) {
                return {
                    resourceIds: [
                        id
                    ]
                }
            },

            /**
             * 预览资源
             * @param resource
             */
            previewResource(resource){
                let options = this.previewOptions;

                this.isPreviewShown = true;

                options.coveringType = resource.fCoveredType;
                options.type = resource.fType;
                options.id = resource.fId;
            },

            /**
             * 资源排序
             * @param {number} orderTypeId --- 排序方式id
             */
            changeResourcesOrder(orderTypeId) {
                this.setOrderDropdown(orderTypeId);
                this.orderResources(orderTypeId);
            },

            /**
             * 设置选择排序的dropdown
             * @param {number} orderTypeId --- 排序方式id
             */
            setOrderDropdown(orderTypeId) {
                const order = this.recourcesOrder;
                let selectedOrder = order.dropdownItemsShow.filter((item) => item.id === orderTypeId);

                order.currentOrder = selectedOrder[0].name;
                order.dropdownItemsShow = order.allDropdownItems.filter((item) => item.id !== orderTypeId);
            },

            /**
             * 排序资源
             * @param {number} orderTypeId --- 排序方式id
             */
            orderResources(orderTypeId) {
                let resources = this.resourceList;

                switch (orderTypeId) {
                    case 2: resources.sort((item1, item2) => {
                        if (item1.name > item2.name)
                            { return 1; }
                        else
                            { return -1; }
                    });
                    break;

                    case 3: resources.sort((item1, item2) =>
                        new Date(item2.fCreateTime).getTime() - new Date(item1.fCreateTime).getTime());
                        break;
                }
            },

            /**
             * 关闭预览弹框
             */
            handleClosePreview() {
                this.isPreviewShown = false;
            },
            
            /**
             * 
             * 搜索
             */
            searchContent() {
                this.pagination = {
                    ...this.pagination,
                    fResourceName: this.groupName,
                    currentPage: 1
                }
                this.getResources()
            },
            /**
             * 
             * 查看详情
             */
            showDetail(item){
                this.baseApi = window.location.origin
                this.parametersForm = {
                    ...item
                }
                this.showParamByPreGroup = true;
            },
            /**
             * 
             * 查看类型
             */
            showType(type){
                switch(type){
                    case 1:
                       return "图片"
                    case 2:
                       return "URL"
                    case 3:
                       return "播放组"
                    case 4:
                       return "摄像头"
                    case 5:
                       return "循环组"
                }
            },
            /**
             * 
             * 获取打开资源路径
             */
             async getBaseUrl(){
                 let res = await CatalogService.getDictionaryContext("open_resource_url","url");
                 if (res.success) {
                     if (res.obj != null) {
                         this.baseUrl = res.obj.fItemValue;
                     } else {
                         this.baseUrl = "";
                     }
                 } else {
                     this.$message.warning(res.msg)
                 }
             },

            /**
             * 投屏显示组
             * @param {Object} item --- 显示组对象
             * @author 元实
             */
            handleCastToBigScreen(item) {
                this.setCastOptions(item);
                this.isBigScreenDialogShown = true;
            },

            /**
             * 设置投屏参数
             * @param {Object} item --- 显示组对象
             * @author 元实
             */
            setCastOptions(item) {
                let type = item.fResourceType;

                this.castResourceType  = type;
                this.bigScreenOptions = {
                    id: item.fResourceId,
                    displayId: item.fId,
                    name: item.fResourceName
                }
            },

            /**
             * 关闭投放大屏弹框
             */
            closeBigScreenDialog() {
                this.isBigScreenDialogShown = false;
            }
        }
    }
</script>

<style lang="scss">
    .blueish-font {
        cursor: pointer !important;
    }
    .recourse-typeTipe{
        position: absolute;
        top: 0;
        right: -26px;
        width: 100px;
        height: 20px;
        margin-top: 9px;
        box-sizing: border-box;
        background: #1d262e;
        z-index: 1;
        text-align: center;
        line-height: 20px;
        color: #fff;
        transform:rotate(33deg);
        font-size: 16px;
    }

    .el-input {
        .el-input__inner {
            color: #fff;
        }
    }

    .el-radio {
        .el-radio__label {
            color: #ffffff;
        }
    }

    .el-switch {
        .el-switch__label {
            color: #cacaca;

            &.is-active {
                color: #2483ff;
            }
        }
    }

    .el-pagination {
        button {
            background-color: #000 !important;
        }

        .btn-next {
            color: #666;
        }

        .btn-prev {
            color: #666;
        }
    }

    .el-pager {
        .number {
            font-size: 14px;
            color: #666;
            background-color: #000;

            &.active {

            }
        }
    }

    .full-width {
        width: 100%;
    }

    .font-12 {
        color: #ffffff;
        font-size: 12px;
    }

    .blueish-font {
        color: #bcc9d4
    }

    // 页面主题部分
    .resource-main {
        display: flex;
        width: 100%;
        margin-bottom: 200px;

        .section-header {
            font-size: 14px;
        }

        .white-font {
            color: #fff;
        }

        .resource-groups {
            width: 240px;
            min-width: 240px;
            height: calc(100vh - 290px);
            flex-direction: column;
            position: sticky;
            z-index: 3;
            top: 60px;

            .nav {
                padding-left: 24px;
                height: 56px;
                border-bottom: 1px solid #27343e;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .groups-container {
                height: 80vh;
                overflow: auto;
            }

            .group-btn {
                padding-right: 5px;

                i {
                    cursor: pointer;
                    color: #fff;
                    font-size: 14px;
                    margin-left: 5px;
                }
            }

            .groups-list {
                font-size: 14px;
            }

            .group-title {
                padding-left: 50px;
                transition: color .2s;
                cursor: pointer;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-right: 30px;
                font-size: 14px;
                color: #fff;

                .title {
                    transition: color .2s;
                }

                &:hover {
                    .title {
                        color: #2483ff;
                    }
                }
            }

            .group-title-active {
                background-image: url('../../image/index/screenList.png');
                background-size: 100% 100%;
                padding-left: 50px;
                transition: color .2s;
                cursor: pointer;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-right: 30px;
                font-size: 14px;
                color: #fff;

            }
        }

        .resource-list {
            flex: 1;

            .list-header {
                top: 60px;
                border-bottom: 1px solid #434b55;
                height: 56px;
                background: #010305;
                z-index: 2;
                min-width: 1024px;
                margin-left: 7px;
                position: sticky;

                .header-right {
                    display: inline-block;
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    margin-right: 15px;
                    .search {
                        background: #1d262e;
                        border-radius: 5px;
                        .right-input {
                        background: #1d262e;
                        color: #fff;
                        border: 1px solid transparent;
                        }
                        .search-btn {
                        cursor: pointer;
                        } 
                    }
                }

                .header-left {
                    display: flex;
                    width: 300px;
                    align-items: center;
                    height: 56px;
                    color: #2483ff;

                    h2 {
                        max-width: 200px;
                        font-size: 14px;
                        padding: 0 10px;
                        border-left: 2px solid #2483ff;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }

            }

            .main-list {
                padding-top: 8px;
                user-select: none;
                padding-bottom: 50px;
                padding-left: 4px;

                .el-row {
                    &.el-row--flex {
                        flex-wrap: wrap;
                    }
                }

                .card {
                    position: relative;
                    box-sizing: border-box;
                    margin: 16px;
                    display: flex;
                    flex-direction: column;
                    width: 258px;
                    height: 180px;
                    border: 1px solid #3a4659;
                    overflow: hidden;
                    transition: .2s;
                    
                    &:not(:nth-child(1)) {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .first-item {
                    justify-content: center;
                    background-image: linear-gradient(-90deg,rgba(0,161,255,.39) 0,rgba(0,137,255,.19) 100%);
                    text-align: center;
                    cursor: pointer;
                }

                .add-resource-icon {
                    color: #fff;
                    margin-right: 5px;
                    transition: .2s;

                    &+span {
                        color: #fff;
                        font-size: 12px;
                        margin-top: 10px;
                        transition: .2s;
                    }
                }

                .delete-resource-icon {
                    margin-left: 15px; margin-right: 15px
                }

                .recourse-modal {
                    position: absolute;
                    opacity: 0;
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    transition: opacity .5s;
                    background: rgba(0,0,0,.81);
                    z-index: 2;

                    span {
                        background-color: #2483ff;
                    }

                    .resource-icons {
                        display: block;

                        .resource-icon {
                            color: #fff;
                            display: inline-block;

                        }
                    }

                }

                .card:hover {
                    border: 1px solid #2483FF;
                }

                .recourse-info {
                    width: 100%;
                    height: 146px;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .screen-main {
                    box-sizing: border-box;
                    width: 100%;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    position: relative;
                    justify-content: space-between;
                    color: #fff;
                    background: #1d262e;
                    padding: 0 10px;
                }

                .preview-btn {
                    line-height: 16px;
                    font-size: 14px;
                    color: #fff;
                    display: block;
                    vertical-align: middle;
                    height: 32px;
                    line-height: 32px;
                    padding: 0 30px;
                    box-sizing: border-box;
                    outline: 0;
                    text-align: center;
                    background: #2483ff;
                    border: none;
                    font-weight: 700;
                    transition: .3s ease;
                    cursor: pointer;
                    z-index: 999;
                    margin-bottom: 10px
                }

                .current-state {
                    width: 8px;
                    height: 8px;
                    border-radius: 4px;
                    display: inline-block;
                    margin-right: 5px;

                    &.online {
                        background: #16a61e;
                    }

                    &.offline {
                        background: #576369;
                    }
                }
            }
        }

        .image-uploader .el-upload {
            border: 1px dashed #6b6b6b;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            background: #1C222B;
            overflow: hidden;
        }

        .image-uploader .el-upload:hover {
            border-color: #409EFF;
        }

        .image-uploader-icon {
            font-size: 28px;
            color: #6b6b6b;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }

        .image-thumb {
            width: 178px;
            height: 178px;
            display: block;
        }

        .paginator {
            margin-right: 50px;
        }
    }
    .groupDetail{
      width: 580px;
      height: 500px;
      padding: 10px;
      border: 1px dashed #fff;
    }
    .one-scene-infor{
  
        width: 300px;
      .infor-row{
        background: #1c222b;
        width: 100%;
        margin-bottom: 5px;
        margin-left: 10px;
        text-align: center;
        height: 60px;
        padding-top: 5px;
        border-radius: 5px;
        .infor-field{
          font-size: 14px;
          color: #A1AEB3;

        }
        .field-context{ 
          display: block;
          font-size: 20px;
          color: #FDFDFD;
          margin-top: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .field-link-context{ 
          font-size: 20px;
          color: #FDFDFD;
          margin-top: 3px;
          display: block;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .favorite-empty {
        margin: 160px auto;
        .tips {
            color: #fff;
            margin-top: 15px;
        }
    }
</style>
