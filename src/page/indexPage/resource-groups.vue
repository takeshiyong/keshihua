/*
* @Author: 元实
* @Date:   2019-10-28
* @Description: '播放组'
*
* @修改   武志勇
* @Date:   2019-12-11
* @Description: '新增显示类别的条框'
*/


<template>
    <div>
        <div v-if="groupList" class="resource-main">
        <aside class="resource-groups">
            <nav class="nav">
                <span class="section-header white-font">资源类别</span>
                <div class="group-btn">
                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="新建资源类别">
                        <i class="el-icon-plus" @click="showAddResGroupDialog"></i>
                    </el-tooltip>

                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="修改资源类别">
                        <i v-show="selectedGroupIdx !== null" class="el-icon-edit" @click="showEditResGroupDialog"></i>
                    </el-tooltip>

                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="删除资源类别">
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
                    <el-tooltip v-if="item.fGroupName.length > 6"
                            :open-delay="400"
                            effect="dark"
                            :content="item.fGroupName">
                        <span class="title">{{ truncate(item.fGroupName) }}</span>
                    </el-tooltip>
                    <span v-else class="title">{{ item.fGroupName }}</span>
                    <span >{{ item.fNum }}</span>
                </div>
            </div>
        </aside>

        <section class="resource-list">
            <header class="list-header">
                <el-row type="flex" justify="space-between" class="full-width">
                    <div class="header-left section-header">
                        <h2>{{ selectedGroup.fGroupName }}</h2>
                        <span>{{ resourcesTotal }}</span>
                        <span class="white-font">个</span>
                    </div>

                    <div class="header-right">
                        <div class="search">
                            <el-input v-model="input" placeholder="请输入内容" class="right-input" clearable>
                                <i slot="suffix" class="el-icon-search search-btn" style="color: #bcc9d4;line-height: 34px;" @click="searchCurrentData"></i>
                            </el-input>
                        </div>
                        <div class="dropdown-item">
                            <el-dropdown @command="changeResourcesOrder">
                                <span class="font-12 blueish-font">{{ recourcesOrder.currentOrder }}</span>
                                <i class="el-icon-caret-bottom blueish-font"></i>

                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                            v-for="item in recourcesOrder.dropdownItemsShow"
                                            :command="item.id"
                                            :key="item.id">
                                        {{ item.name }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </el-row>
            </header>

            <main v-if="groupList.length" class="main-list">
                <el-row type="flex" justify="start">
                    <div
                        class="resource-item first-item card"
                        @mouseenter="onAddResouceMouseenter"
                        @mouseleave="onAddResouceMouseleave"
                        @click="showAddResourceDialog">
                        <i class="dvIcon dvIcon-add1 add-resource-icon" ref="addIcon"></i>
                        <span ref="addText">新建资源</span>
                    </div>

                    <div
                        class="resource-item card"
                        v-for="(item, index) in resourceList"
                        :key="item.fId"
                        @mouseenter="onManageResouceMouseenter(index)"
                        @mouseleave="onManageResouceMouseleave(index)">
                        <div class="resource">
                            <div v-if="item.fType == 1" class="recourse-typeTipe">
                                图片
                            </div>
                            <div v-else class="recourse-typeTipe" style="color: #29a19c">
                                U R L
                            </div>
                            <div class="resource-info">
                                <img :src="`${ config.PICTURE_URL }${ item.fPreviewPicture }`" style="width: 100%" />
                                <div class="recourse-modal" :ref="`modal${index}`">
                                    <button class="preview-btn" @click="previewResource(item)">预览</button>

                                    <div class="resource-icons">
                                        <el-tooltip
                                                :open-delay="400"
                                                effect="dark"
                                                :content="`${item.fIsPublish ? '取消发布' : '发布'}`">
                                            <i
                                                    v-if="item.fIsPublish"
                                                    class="dvIcon dvIcon-quxiaofabu resource-icon"
                                                    @click="cancelDistribResouce(item)"></i>
                                            <i v-else class="dvIcon dvIcon-fabu resource-icon" @click="showDistribResDialog(item)"></i>
                                        </el-tooltip>

                                        <el-tooltip
                                                :open-delay="400"
                                                effect="dark"
                                                content="投屏">
                                            <i
                                                    class="dvIcon dvIcon-touping resource-icon ml-15"
                                                    @click="handleCastToBigScreen(item)"></i>
                                        </el-tooltip>

                                        <el-tooltip
                                                :open-delay="400"
                                                effect="dark"
                                                content="删除">
                                            <i
                                                    class="el-icon-delete resource-icon delete-resource-icon"
                                                    style="font-size: 16px;"
                                                    @click="deleteResource(item)"></i>
                                        </el-tooltip>

                                        <el-tooltip
                                                :open-delay="400"
                                                effect="dark"
                                                content="修改 ">
                                            <i class="el-icon-edit resource-icon" style="font-size: 16px;" @click="showEditResDialog(item)"></i>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>

                            <div class="screen-main">
                                <el-tooltip v-if="item.fName.length > 6"
                                            :open-delay="400"
                                            effect="dark"
                                            :content="item.fName">
                                    <span class="font-12">{{ truncate(item.fName) }}</span>
                                </el-tooltip>
                                <span v-else class="font-12">{{ item.fName }}</span>
                                <div>
                                    <div :class="`current-state ${ item.fIsPublish ? 'online' : 'offline'}`"></div>
                                    <span class="font-12">{{ item.fIsPublish ? '已发布' : '未发布' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-row>
            </main>

            <template v-else>
                <div style="width: 100%; padding-top: 10%; text-align: center;">
                    <div class="favorite-empty">
                        <img style="width: 100px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAACACAMAAAD6ZS3TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTAC+/wC7/wC7/wC7/wC9/wC7/wC8/wC6/wPE/gC8/wC7/wC7/wC8//7DAf/DAN3FLMnJP//EAMvBNJnAZv/DALfASKfAWAC6///CANzAafIAAAAYdFJOUwAe2ZfrMsOA+A1JrW9c37EpE0zteoPTv/JHy3IAAARkSURBVGje5ZvZgqsgDIZd6l7X6kz7/i96pu6SgAkCXhxuLX4hJD9BqOdptzyOc++ulsfvvxaXt8DL4D23wLkB2XOFjwY8M6fwx1toD2cGZAmAjwYkLgzww/QtaWno3we3b0BUCLignJJv14rIFXzKeDcGAMqmd5H8kS34cYjQMbkVgZsjDPoXCQtD8GdACm+QFCYMAAL3SHxyVl6VQiBwJy/0we8vSCF05/looMGJbwhe6k2XjhReSaWMGKx0eJFfS1WOFBqRUV0DRLj2KpZraHEZGFxCuQaIMXO5gmFoMRQ4E/UbNAB9K9ALY2tGdK7FfpJipYStEu04qeCx8XoBENJNi0NxdmxUS2By03B+AgpWG9UasjuQ4c0XzMi+SIE3bUCJ7ouO+DgQgsPUpklQ0jRA8YlopJldWy7AwyyR4MEUPZ6XNUeQ/e+cSvEwQB+lScUtxoBS4L8GpIbE1xfg8ZzPSjyUKD0N9EOZkp7g5XYzEl0YQrAbwikembWIJ3GqCSTgYcwWvq7EiflDwsNaiSiEAC6qBxGPSIbPljhEush40tvUEof8iIEn+FI6WzJnsfBkJSbHKg9PE0JGpnLxahVBJU4lE3y8WomZKq2Dlysxe43Sw+PzK67QhAVSF49ENyMtDeCRXSu/OruCRz4ccGvTa3jcAEZlfhUPlJizHJvACwHPK0YM4Pfpzi3FjODX16Sa/f5TfBaVSZzehp+riPhO/Nb+E3zbDXVVfarq9dM3rvFN/dm3V+8S3w4fsb1aZ/im+sBWNY7wC70euq7p+t/XbEDnBN9O9KHd7PnZxm8dX+9cvbR+4jvAdwj9r2xc3G8bP7p+R8/LbB1/ZR0/Dn449HvkO7Ms48eZb4/9Un+zyy6+HTNO7FdsT+ziuzXBD/2y2fuVZfwg+n7qF83TYhtfz+kt9CuXqLCMr8Spn/rl9+J9R86v/toA+o2FnovIx/tFrvIe7ZesetTdgA8daj7sF25FQOceP+5I25er9R7d5Ez1VnMPfhq7o1pPSXePP9Cd42d6f9zlsI8sNfEC3dM9MdTEC3RP8aHcAv5XoHu6R5Za+F6ke7pHlkx8lKyu748PYq0jSxY+Kt7PZfAv8aHGgR0LPx62+Mvgm9PPxBQDyPjpsOVb4DTo4FEDTr+PE/HL19dw8X0v+9TGO5og4beXJkvWNXJDOXc3KPjdiL6aNn5VIHiKIoTn+MN85uieA48TihCe4YV0ouGRA7tcBy+eORUZEQ8P7HAhVOE1lYzTXY6PLl89IVydkOHlV2ZY7UwIcTwIXf17T2ohxPDm7jyhQrg3AOKhbF2986YQQoB/nl64a+qqqhumARJ/CnjCkjV/WubxZUJ4wJMqhvlEoeZOASqEO3xOu7Uyf1ev+DGAKMmKJ0ucPh4RwsUgusTpOh8XQqwpJa7VCj3pGgra2Tal5SeeUgjt3Kkn1k+Gb9XqCaHDf4LiQmjwRrWGENr/C6pCCNPCPXwTQmt/PaUIYXwZ/g8RWG6u5vFIYgAAAABJRU5ErkJggg=="/>
                        <p class="tips">暂无数据</p>
                    </div>
                </div>
            </template>

            <footer>
                <el-row type="flex" justify="end">
                    <div  v-if="pagination.pageCount > 1" class="paginator">
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
            :modalTitle="`${ isEditResGroupMode ? '编辑' : '新建' }资源类别`">
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
                            <el-form-item label="资源类别名称" prop="fGroupName" class="full-width">
                                <el-input
                                    @input="value => addResGroupDialogForm.fGroupName = value.replace(/\s/i, '')"
                                    :value="addResGroupDialogForm.fGroupName" placeholder="请输入资源类别名称"></el-input>
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
                :modalTitle="`${ isShowEditResDialogMode ? '编辑' : '新建' }资源`">
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
                                <el-input
                                    @input="value => addResourceForm.fName = value.replace(/\s/i, '')"
                                    :value="addResourceForm.fName" placeholder="请输入资源名称"></el-input>
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
                                    <el-input
                                        @input="value => addResourceForm.fUrl = value.replace(/\s/i, '')"
                                        :value="addResourceForm.fUrl" placeholder="请输入资源编号"></el-input>
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

        <VPreview :showPreview="isPreviewShown" :type="previewOptions.type" :options="previewOptions" @close="handleClosePreview"></VPreview>
        <VSetBigScreenDialog
                :shown="isBigScreenDialogShown"
                :type="castResourceType"
                :isTemporal="true"
                :options="bigScreenOptions"
                @close="closeBigScreenDialog"></VSetBigScreenDialog>
    </div>
        <template v-else>
            <div style="width: 100%; padding-top: 10%; text-align: center;">
                <div class="favorite-empty">
                    <img style="width: 100px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAACACAMAAAD6ZS3TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTAC+/wC7/wC7/wC7/wC9/wC7/wC8/wC6/wPE/gC8/wC7/wC7/wC8//7DAf/DAN3FLMnJP//EAMvBNJnAZv/DALfASKfAWAC6///CANzAafIAAAAYdFJOUwAe2ZfrMsOA+A1JrW9c37EpE0zteoPTv/JHy3IAAARkSURBVGje5ZvZgqsgDIZd6l7X6kz7/i96pu6SgAkCXhxuLX4hJD9BqOdptzyOc++ulsfvvxaXt8DL4D23wLkB2XOFjwY8M6fwx1toD2cGZAmAjwYkLgzww/QtaWno3we3b0BUCLignJJv14rIFXzKeDcGAMqmd5H8kS34cYjQMbkVgZsjDPoXCQtD8GdACm+QFCYMAAL3SHxyVl6VQiBwJy/0we8vSCF05/looMGJbwhe6k2XjhReSaWMGKx0eJFfS1WOFBqRUV0DRLj2KpZraHEZGFxCuQaIMXO5gmFoMRQ4E/UbNAB9K9ALY2tGdK7FfpJipYStEu04qeCx8XoBENJNi0NxdmxUS2By03B+AgpWG9UasjuQ4c0XzMi+SIE3bUCJ7ouO+DgQgsPUpklQ0jRA8YlopJldWy7AwyyR4MEUPZ6XNUeQ/e+cSvEwQB+lScUtxoBS4L8GpIbE1xfg8ZzPSjyUKD0N9EOZkp7g5XYzEl0YQrAbwikembWIJ3GqCSTgYcwWvq7EiflDwsNaiSiEAC6qBxGPSIbPljhEush40tvUEof8iIEn+FI6WzJnsfBkJSbHKg9PE0JGpnLxahVBJU4lE3y8WomZKq2Dlysxe43Sw+PzK67QhAVSF49ENyMtDeCRXSu/OruCRz4ccGvTa3jcAEZlfhUPlJizHJvACwHPK0YM4Pfpzi3FjODX16Sa/f5TfBaVSZzehp+riPhO/Nb+E3zbDXVVfarq9dM3rvFN/dm3V+8S3w4fsb1aZ/im+sBWNY7wC70euq7p+t/XbEDnBN9O9KHd7PnZxm8dX+9cvbR+4jvAdwj9r2xc3G8bP7p+R8/LbB1/ZR0/Dn449HvkO7Ms48eZb4/9Un+zyy6+HTNO7FdsT+ziuzXBD/2y2fuVZfwg+n7qF83TYhtfz+kt9CuXqLCMr8Spn/rl9+J9R86v/toA+o2FnovIx/tFrvIe7ZesetTdgA8daj7sF25FQOceP+5I25er9R7d5Ez1VnMPfhq7o1pPSXePP9Cd42d6f9zlsI8sNfEC3dM9MdTEC3RP8aHcAv5XoHu6R5Za+F6ke7pHlkx8lKyu748PYq0jSxY+Kt7PZfAv8aHGgR0LPx62+Mvgm9PPxBQDyPjpsOVb4DTo4FEDTr+PE/HL19dw8X0v+9TGO5og4beXJkvWNXJDOXc3KPjdiL6aNn5VIHiKIoTn+MN85uieA48TihCe4YV0ouGRA7tcBy+eORUZEQ8P7HAhVOE1lYzTXY6PLl89IVydkOHlV2ZY7UwIcTwIXf17T2ohxPDm7jyhQrg3AOKhbF2986YQQoB/nl64a+qqqhumARJ/CnjCkjV/WubxZUJ4wJMqhvlEoeZOASqEO3xOu7Uyf1ev+DGAKMmKJ0ucPh4RwsUgusTpOh8XQqwpJa7VCj3pGgra2Tal5SeeUgjt3Kkn1k+Gb9XqCaHDf4LiQmjwRrWGENr/C6pCCNPCPXwTQmt/PaUIYXwZ/g8RWG6u5vFIYgAAAABJRU5ErkJggg=="/>
                    <p class="tips">暂无数据</p>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import { ResourceService } from '@/api/resource'; // 请求api
    import DialogModal from '../../components/DialogModal.vue'; //弹框
    import VPreview from '../../components/VPreview.vue';  //预览弹框
    import VSetBigScreenDialog from '../../components/VSetBigScreenDialog';  //预览弹框
    import config from '@/common/basic-configuration';

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
                config,  // 引入的变量要在html之内使用

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

                input: "", //搜索内容

                groupList: [], //资源分组数组
                selectedGroupIdx: 0, //选择的资源分组的index
                selectedGroup: {}, //选择的资源分组
                isAddResGroupDialogShown: false, //是否显示新建资源组弹框
                isEditResGroupMode: false, //是否编辑资源组
                addResGroupDialogForm: { //新建资源组的form数据
                    fGroupName: '', //资源组名称
                },
                addResGroupDialogRules: {　//验证新建资源组的数据
                    fGroupName: [
                        { required: true, message: '请输入资源组名称', trigger: 'blur' }
                    ]
                },

                resourceList: [], //资源数组
                resourcesTotal: 0, //资源的数量

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

                isBigScreenDialogShown: false, //是否显示投屏弹框
                castResourceType: null, //投屏类型
                bigScreenOptions: {}, //投屏参数

                isPreviewShown: false, //是否显示预览
                previewOptions: { //预览参数
                    type: 1, //资源类型
                    coveringType: 1,  //铺满方式
                    id: '' //资源id
                },

                pagination: {   //分页
                    currentPage: 1,
                    pageCount: 1
                }
            };
        },

        async mounted() {
            await this.getResourceGroups();
            if (this.groupList.length) {
                this.selectGroup(this.groupList[0], 0);
            }
        },

        methods: {
            /**
             * 
             * 点击搜索
             */

            searchCurrentData() {
                this.getResources(this.input);
            },
            /**
             * 获取资源组
             * @returns {Promise<void>}
             */
            async getResourceGroups() {
                let result = await ResourceService.getResourceGroups();

                if (result.success) {
                    this.groupList = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 显示新建资源组的弹框
             */
            showAddResGroupDialog() {
                this.clearAddresGroupForm();
                this.isAddResGroupDialogShown = true;
                this.isEditResGroupMode = false;
            },

            /**
             * 清理资源组数据
             */
            clearAddresGroupForm() {
                this.addResGroupDialogForm.fGroupName = '';
            },

            /**
             * 编辑资源组
             */
            showEditResGroupDialog() {
                this.setResGroupFormForEdit();
                this.isAddResGroupDialogShown = true;
                this.isEditResGroupMode = true;
            },

            /**
             * 编辑资源组的时候设置原来的资源数据
             */
            setResGroupFormForEdit() {
                let form =  this.addResGroupDialogForm;
                let name = this.groupList[this.selectedGroupIdx].fGroupName;

                form.fGroupName = name;
            },

            /**
             * 删除资源组
             */
            deleteResourceGroup() {
                this.$confirm(`${this.groupList[this.selectedGroupIdx].fGroupName} 删除后无法恢复，确认删除？`, 'warning', null, async () => {
                    if (this.selectedGroup.fNum) {
                        this.$message.error('资源组下有资源，不能删除！');
                        return;
                    }

                    let groupId = this.groupList[this.selectedGroupIdx].fId;
                    let result = await ResourceService.deleteResourceGroup(groupId);

                    if (result.success) {
                        await this.getResourceGroups();
                        this.selectGroup(this.groupList[0], 0);
                        this.$message.success('成功！');
                    } else {
                        this.$message.error(result.msg);
                    }
                });
            },

            /**
             * 新建资源组
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
             * 提交资源组数据
             * @param {Object} groupData --- 提交的数据
             */
            async submitResourceGroup(groupData) {
                let res = null;
                if (!this.isEditResGroupMode) {
                    res = await ResourceService.insertResourceGroup(groupData);
                } else {
                    res = await ResourceService.updateResourceGroup(groupData);
                }

                if (res.success) {
                    this.$message.success(res.msg);
                    await this.getResourceGroups();
                    this.closeModal('addResGroupDialogForm', 'isAddResGroupDialogShown');
                    if (this.isEditResGroupMode) {
                        this.resetSelectedResourceGroup();
                    } else {
                        this.selectGroup(this.groupList[0], 0);
                    }
                } else {
                    this.$message.error(res.msg, true);
                }
            },

            /**
             * 修改资源组信息后重新设置选择的资源组
             */
            resetSelectedResourceGroup() {
                this.selectedGroup = this.groupList[this.selectedGroupIdx];
            },

            /**
             * 编辑资源组的时候设置要提交的数据
             */
            setGroupDataForEdit() {
                let groupData = this.groupList[this.selectedGroupIdx];

                groupData.fGroupName = this.addResGroupDialogForm.fGroupName;

                return groupData;
            },

            /**
             * 跳到第几页
             */
            goToPage(page) {
                this.pagination.currentPage = page;
                this.getResources(this.input);
            },

            /**
             * 选择资源组
             * @param {Object} resourceGroup --- 选择的资源
             * @param {number} index ---　选择资源组的index
             */
            selectGroup(resourceGroup, index) {
                this.selectedGroupIdx = index;
                this.selectedGroup = resourceGroup;
                this.getResources(this.input);
            },

            /**
             * 获取属于选择的分组的资源
             */
            async getResources(fName) {
                let params = this.setGetResourcesParams(fName);
                let result = await ResourceService.getResources(params);

                if (result.success) {
                    this.pagination.pageCount = result.obj.pageCount;
                    this.resourceList = result.obj.items;
                    this.resourcesTotal = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置获取资源请求的参数
             */
            setGetResourcesParams(fName) {
                return {
                    currentPage: this.pagination.currentPage,
                    fName,
                    fResourceGroupId: this.selectedGroup.fId,
                    pageSize: 12
                }
            },

            /**
             * 鼠标移入事件 展示新建字体变大
             */
            onAddResouceMouseenter(){
                this.$refs.addText.style.fontSize = '16px';
                this.$refs.addIcon.style.fontSize = '16px'
            },

            /**
             * 鼠标移出事件 展示新建字体变小
             */
            onAddResouceMouseleave(){
                this.$refs.addText.style.fontSize = '12px';
                this.$refs.addIcon.style.fontSize = '12px'
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
             * 显示新建资源的弹框
             */
            showAddResourceDialog() {
                this.clearAddResourceForm();
                this.isAddResDialogShown = true;
                this.isShowEditResDialogMode = false;
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
                    this.$message.success(res.msg);
                    this.getResourceGroups();
                    this.getResources(this.input);
                    this.closeModal('addResourceForm', 'isAddResDialogShown');

                    let fId = this.isShowEditResDialogMode ? this.addResourceForm.fId : res.obj;
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
                    this.getResources(this.input);
                    this.selectedResource.publishClassId = this.distributionForm.fReleaseClassifyId;
                    this.$message.success(`${ isDistribute? '发布' : '取消发布'}成功！`);
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

                distribData.fResourceType = this.selectedResource.fType;
                distribData.type = isDistribute ? 1 : 2; //type为1 - 发布, type为2 - 取消发布
                distribData.fVisitUrl = this.selectedResource.fUrl;
                distribData.fResourceId = this.selectedResource.fId;

                if (isDistribute)  {
                    distribData.fResourceName = this.selectedResource.fName;
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
                this.$confirm(`${resource.fName} 删除后无法恢复，确认删除？`, 'warning', null, async () => {
                    let params = this.setDeleteResourceParams(resource.fId);
                    let result = await ResourceService.deleteResource(params);

                    if (result.success) {
                        this.getResourceGroups();
                        this.getResources(this.input);
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
                options.type = resource.fType; //1 - 图片， 2 - url
                options.id = resource.fId;
                options.name = resource.fName;
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
                let type = item.fType;

                this.castResourceType  = type;
                this.bigScreenOptions = {
                    id: item.fId,
                    name: item.fName
                }
            },

            /**
             * 关闭投放大屏弹框
             */
            closeBigScreenDialog() {
                this.isBigScreenDialogShown = false;
            },

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

        }
    }
</script>

<style lang="scss" >
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
                z-index: 1;
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
                        margin-right: 20px;
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

                            &.ml-15 {
                                margin-left: 15px;
                            }
                        }
                    }

                }

                .card:hover {
                    border: 1px solid #2483FF;
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
                    transform:rotate(39deg);
                    font-size: 16px;
                }
                .resource-info {
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
</style>
