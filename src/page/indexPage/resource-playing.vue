/*
* @Author: 元实
* @Date:   2019-11-19
* @Description: '播放组管理'
* @修改   武志勇
* @Date:   2019-12-11
* @Description: '新增显示类别的条框'
*/

<template>
    <div>
        <div v-if="playGroupList" class="play-main">
            <aside class="play-groups">
                <nav class="nav">
                    <span class="section-header white-font">播放组</span>
                    <div class="group-btn">
                        <el-tooltip
                                :open-delay="400"
                                effect="dark"
                                content="新建播放组">
                            <i class="el-icon-plus" @click="showAddPlayGroupDialog"></i>
                        </el-tooltip>
                    </div>
                </nav>

                <div class="groups-container">
                    <div
                        v-for="(item, index) in playGroupList"
                        :class="`${ selectedPlayGroupIdx === index ? 'group-title-active' : 'group-title' }`"
                        :key="item.fId"
                        @click="selectPlayGroup(item, index)">
                        <span v-if="item.fName.length <= 6" class="title">{{ item.fName }}</span>
                        <el-tooltip
                                :open-delay="400"
                                effect="dark"
                                :content="item.fName">
                            <span v-if="item.fName.length > 6" class="title">{{ truncate(item.fName) }}</span>
                        </el-tooltip>
                        <div>
                            <span class="mr-10">{{ item.count || 0 }}</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main class="resource-list">
                <section v-if="hasResources" class="resources-section">
                    <header class="title_info">
                        <p class="title-info">基础信息</p>
                        <el-button-group>
                            <el-tooltip content="投屏" placement="top">
                                <el-button
                                        type="primary"
                                        style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-right-color: rgba(255,255,255,.5);"
                                        icon="dvIcon dvIcon-touping smaller-icon"
                                        @click="handleCastToBigScreen"></el-button>
                            </el-tooltip>

                            <el-tooltip content="预览" placement="top">
                                <el-button
                                        v-if="hasResources"
                                        type="primary"
                                        icon="el-icon-view"
                                        style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-right-color: rgba(255,255,255,.5);  border-left-color: rgba(255,255,255,.5);"
                                        @click="previewPlayGroup">
                                </el-button>
                            </el-tooltip>

                            <el-tooltip :content="`${selectedPlayGroup.fIsPublish ? '取消发布' : '发布'}`" placement="top">
                                <el-button
                                        v-if="!selectedPlayGroup.fIsPublish && hasResources"
                                        type="primary"
                                        style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-right-color: rgba(255,255,255,.5); border-left-color: rgba(255,255,255,.5);"
                                        @click="showDistribPlayGroupDialog">
                                    <i class="dvIcon dvIcon-fabu" style="font-size: 12px"></i>
                                </el-button>
                                <el-button
                                        v-if="selectedPlayGroup.fIsPublish && hasResources"
                                        type="primary"
                                        style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-right-color: rgba(255,255,255,.5); border-left-color: rgba(255,255,255,.5);"
                                        @click="cancelDistribPlayGroup">
                                    <i class="dvIcon dvIcon-quxiaofabu" style="font-size: 12px"></i>
                                </el-button>
                            </el-tooltip>

                            <el-tooltip content="编辑" placement="top">
                                <el-button
                                        type="primary"
                                        style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-left-color: rgba(255,255,255,.5);border-right-color: rgba(255,255,255,.5);"
                                        icon="el-icon-edit"
                                        @click="showEditPlayGroupDialog"></el-button>
                            </el-tooltip>

                            <el-tooltip content="删除" placement="top">
                                <el-button
                                        type="primary"
                                        style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-left-color: rgba(255,255,255,.5);"
                                        icon="el-icon-delete"
                                        @click="deletePlayGroup"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </header>
                    <hr />
                    <div v-if="selectedPlayGroup.fName" class="info-content">
                        <div class="info">
                            <p>名称</p>
                            <span v-if="selectedPlayGroup.fName.length <= 6">{{ selectedPlayGroup.fName }}</span>
                            <el-tooltip
                                    :open-delay="400"
                                    effect="dark"
                                    :content="selectedPlayGroup.fName">
                                <span v-if="selectedPlayGroup.fName.length > 6">{{ truncate(selectedPlayGroup.fName) }}</span>
                            </el-tooltip>
                        </div>

                        <div class="info">
                            <p>状态</p>
                            <div style="display: flex;align-items:center;justify-content: center;">
                                <div class="circle_push" :style="`background: ${ selectedPlayGroup.fIsPublish ? '#67C23A' : '#576369'}`"></div>
                                <span>{{ selectedPlayGroup.fIsPublish ? '已发布' : '未发布' }}</span>
                            </div>
                        </div>

                        <div class="info">
                            <p>播放状态</p>
                            <span>{{ selectedPlayGroup.fIsPlay ? '开启' : '关闭'}}</span>
                        </div>

                        <div class="info">
                            <p>播放时间</p>
                            <div style="display: flex;align-items:flex-end;justify-content: center;">
                                <span>{{ selectedPlayGroup.fChangeTime }}</span>
                                <span style="font-size: 16px;margin-left: 3px;">s</span>
                            </div>
                        </div>

                        <div class="info">
                            <p>自动切换</p>
                            <span>{{ selectedPlayGroup.fIsChange ? '是': '否' }}</span>
                        </div>
                    </div>
                </section>

                <section v-if="playGroupList.length" class="resources-section">
                    <header class="title_info">
                        <p class="title-info">资源列表</p>
                        <el-button-group v-if="!hasResources">
                            <el-tooltip content="编辑" placement="top">
                                <el-button
                                        type="primary"
                                        style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-left-color: rgba(255,255,255,.5);border-right-color: rgba(255,255,255,.5)"
                                        icon="el-icon-edit"
                                        @click="showEditPlayGroupDialog"></el-button>
                            </el-tooltip>

                            <el-tooltip content="删除" placement="top">
                                <el-button
                                        type="primary"
                                        style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-left-color: rgba(255,255,255,.5)"
                                        icon="el-icon-delete"
                                        @click="deletePlayGroup"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </header>
                    <hr />

                    <section class="main-list">
                        <div
                                class="resource-item first-item card not-draggable"
                                @mouseenter="onAddResouceMouseenter"
                                @mouseleave="onAddResouceMouseleave"
                                @click="showAddResourcesDialog">
                            <i class="dvIcon dvIcon-add1 add-resource-icon" ref="addIcon"></i>
                            <span ref="addText">添加资源</span>
                        </div>

                        <div
                                class="resource-item card draggable"
                                v-for="(item, index) in playResourceList"
                                :key="item.fId"
                                @mouseenter="onManageResouceMouseenter(index)"
                                @mouseleave="onManageResouceMouseleave(index)">
                                <div class="resource">
                                    <div v-if="item.fType == 1" class="recourse-typeTipe" >
                                        图片
                                    </div>
                                    <div v-else class="recourse-typeTipe" style="color: #29a19c">
                                        U R L
                                    </div>
                                    <div class="resource-info">
                                        <img :src="`${ config.PICTURE_URL }${ item.fPreviewPicture }`" style="width: 100%" />
                                        <div class="recourse-modal" :ref="`modal${index}`">
                                            <button class="resourcev-btn" @click="previewResource(item)">预览</button>
                                            <div class="resource-icons">
                                                <el-tooltip
                                                        :open-delay="400"
                                                        effect="dark"
                                                        content="删除">
                                                    <i
                                                            class="el-icon el-icon-delete resource-icon delete-resource-icon"
                                                            style="font-size: 16px;"
                                                            @click="deleteResource(item.fId, item.fName)"></i>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="screen-main">
                                        <span v-if="item.fName.length <= 6" class="font-12">{{ item.fName }}</span>

                                        <el-tooltip
                                                v-else
                                                :open-delay="400"
                                                effect="dark"
                                                :content="item.fName">
                                            <span class="font-12">{{ truncate(item.fName) }}</span>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                     </section>
                </section>
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
            </main>

            <DialogModal
                    :showModal="isAddPlayGroupDialogShown"
                    @closeModals="closeModal('addPlayGroupDialogForm', 'isAddPlayGroupDialogShown')"
                    :modalTitle="`${ isEditPlayGroupMode ? '编辑' : '新建' }播放组`">
                <template v-slot:container>
                    <div class="modal-content">
                        <el-form
                                ref="addPlayGroupDialogForm"
                                label-position="top"
                                :inline="true"
                                :model="addPlayGroupDialogForm"
                                :rules="addPlayGroupDialogRules"
                                class="full-width">
                            <el-row>
                                <el-form-item label="播放组名称" prop="fName" class="full-width">
                                    <el-input
                                        @input="value => addPlayGroupDialogForm.fName = value.replace(/\s/i, '')"
                                        :value="addPlayGroupDialogForm.fName" placeholder="请输入播放组名称"></el-input>
                                </el-form-item>
                            </el-row>

                            <el-row>
                                <el-form-item label="自动切换" prop="fIsChange" class="full-width">
                                    <el-switch
                                            v-model="addPlayGroupDialogForm.fIsChange"
                                            active-color="#2483ff"
                                            inactive-color="#ff4949"
                                            active-text="是"
                                            inactive-text="否">
                                    </el-switch>
                                </el-form-item>
                            </el-row>

                            <el-row v-if="addPlayGroupDialogForm.fIsChange">
                                <el-form-item label="播放时间（s）" prop="fChangeTime" class="full-width">
                                    <el-input-number
                                            v-model="addPlayGroupDialogForm.fChangeTime"
                                            :min="1"
                                            :step="1"
                                            step-strictly
                                            class="full-width">
                                    </el-input-number>
                                </el-form-item>
                            </el-row>

                            <el-row>
                                <el-form-item label="是否播放" prop="fIsPlay" class="full-width">
                                    <el-switch
                                            v-model="addPlayGroupDialogForm.fIsPlay"
                                            active-color="#2483ff"
                                            inactive-color="#ff4949"
                                            active-text="开启"
                                            inactive-text="关闭">
                                    </el-switch>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </div>
                </template>

                <template v-slot:footer>
                    <el-button type="primary" class="font-12" @click="addPlayGroup">
                        {{ isEditPlayGroupMode ? '编辑' : '新建' }}
                    </el-button>
                </template>
            </DialogModal>

            <DialogModal
                    class="add-resource-dialog"
                    :showModal="isAddResourcesDialogShown"
                    @closeModals="closeModal('addResourceDialogForm', 'isAddResourcesDialogShown')"
                    modalTitle="添加资源">
                <template v-slot:container>
                    <div class="add-resource-container">
                        <el-row class="resource-container">
                            <el-col :span="5">
                                <aside class="resource-groups">
                                    <div
                                                v-for="(item, index) in groupList"
                                                :class="`${ selectedResourceGroupIdx === index ? 'group-title-active' : 'group-title' }`"
                                                :key="item.fId"
                                                @click="selectResourceGroup(item, index)">
                                            <span v-if="item.fGroupName.length <= 6" class="title">{{ item.fGroupName }}</span>
                                            <el-tooltip
                                                    :open-delay="400"
                                                    effect="dark"
                                                    :content="item.fGroupName">
                                                <span v-if="item.fGroupName.length > 6" class="title">{{ truncate(item.fGroupName) }}</span>
                                            </el-tooltip>
                                            <div>
                                                <span class="mr-10">{{ item.fNum || 0 }}</span>
                                            </div>
                                        </div>
                                </aside>
                            </el-col>

                            <el-col :span="19">
                                <header>
                                    <el-form
                                            ref="addResourceDialogForm"
                                            :inline="true"
                                            :model="searchResourceForm"
                                            class="full-width">
                                        <el-row type="flex" justify="start">
                                            <el-form-item>
                                                <el-input
                                                        v-model="searchResourceForm.fName"
                                                        prefix-icon="el-icon-search"
                                                        clearable
                                                        placeholder="请输入资源名称"></el-input>
                                            </el-form-item>

                                            <el-form-item>
                                                <el-button type="primary" small class="font-12" @click="searchResourceByName">查询</el-button>
                                            </el-form-item>
                                        </el-row>
                                    </el-form>
                                </header>

                                <main class="add-resource-list">
                                    <el-row v-if="allResourceList.length" type="flex" justify="start">
                                        <div
                                                class="resource-item card smaller"
                                                :class="{
                                                    selected: isSelected(item.fId)
                                                }"
                                                v-for="(item, index) in allResourceList"
                                                :key="item.fId"
                                                :ref="`resCard${index}`"
                                                @click="selectResource(item, index)">

                                            <div class="resource">
                                                <div class="resource-info">
                                                    <div v-if="playResourceList.findIndex(data => data.fViewResourceId === item.fId) !== -1" class="choosed">
                                                        <i class="el-icon-check"></i>
                                                    </div>

                                                    <img :src="item.fPreviewPicture" style="width: 100%" />

                                                    <div class="recourse-modal" :ref="`allResModal${index}`">
                                                        <div class="circle">
                                                            <i class="el-icon-check" style="color: #fff;font-size: 30px;"/>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="screen-main">
                                                    <span v-if="item.fName.length <= 6" class="font-12">{{ item.fName }}</span>
                                                    <el-tooltip
                                                            :open-delay="400"
                                                            effect="dark"
                                                            :content="item.fName">
                                                        <span v-if="item.fName.length > 6" class="font-12">{{ truncate(item.fName) }}</span>
                                                    </el-tooltip>
                                                    <div>
                                                        <div :class="`current-state ${ item.fIsPublish ? 'online' : 'offline'}`"></div>
                                                        <span class="font-12">{{ item.fIsPublish ? '已发布' : '未发布' }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </el-row>
                                    <el-row v-else>
                                        <span style="width: 100%;text-align:center;display: inline-block;font-size: 14px;marginTop: 20px;">暂无数据</span>
                                    </el-row>
                                </main>

                                <footer>
                                    <el-row type="flex" justify="end">
                                        <div  v-if="pagination2.pageCount > 1" class="paginator">
                                            <el-pagination
                                                    small
                                                    layout="prev, pager, next"
                                                    :current-page.sync="pagination2.currentPage"
                                                    :page-count="pagination2.pageCount"
                                                    @current-change="goToAddResourcePage">
                                            </el-pagination>
                                        </div>
                                    </el-row>
                                </footer>
                            </el-col>
                        </el-row>

                        <el-row>
                            <footer class="selected-res-container">
                                <span style="display:inline-block;line-height: 30px;">选中的资源：</span>
                                <template v-if="selectedResources.length">
                                    <el-tag
                                            class="tags"
                                            :key="index"
                                            v-for="(resource,index) in selectedResources"
                                            closable
                                            :disable-transitions="false"
                                            style="margin-right: 10px;"
                                            @close="clearSelectedResource(resource)">
                                        {{ resource.fName }}
                                    </el-tag>
                                </template>
                                <span v-else style="color: #c9c9c9">暂无</span>

                                <el-tooltip
                                        :open-delay="400"
                                        effect="dark"
                                        content="清理所有资源">
                                    <el-button icon="el-icon-close" class="clear-button" @click="clearAllSelectedResource"></el-button>
                                </el-tooltip>
                            </footer>
                        </el-row>
                    </div>
                </template>

                <template v-slot:footer>
                    <el-button type="primary" class="font-12" @click="savePlayGroupResources">
                        保存
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
                    <el-button type="primary" class="font-12" @click="distributePlayGroup">
                        发布
                    </el-button>
                </template>
            </DialogModal>

            <VPreview :showPreview="isPlayGroupPreviewShown" :type="3" :options="{ id: selectedPlayGroup.fId, name: selectedPlayGroup.fName }" @close="handleClosePlayGroupPreview"></VPreview>
            <VPreview :showPreview="isResourcePreviewShown" :type="previewResourceOptions.type" :options="previewResourceOptions" @close="handleCloseResourcePreview"></VPreview>
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
    import { PlayGroupService } from '@/api/play-group'; // 请求api
    import DialogModal from '../../components/DialogModal.vue'; //弹框
    import VPreview from '../../components/VPreview.vue'; //预览弹框
    import VSetBigScreenDialog from '../../components/VSetBigScreenDialog';  //预览弹框
    import Sortable from 'sortablejs';
    import config from '@/common/basic-configuration';

    export default {
        components: {
            DialogModal,
            VPreview,
            VSetBigScreenDialog
        },

        data() {
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

                playGroupList: [], //播放组数组
                selectedPlayGroupIdx: 0, //选择的播放组的index
                selectedPlayGroup: {}, //选择的播放组
                hasResources: true, //播放组是否有资源

                isDistribDialogShown: false,  //是否显示选择发布类型的弹框
                distribClasses: [], //发布类型数组
                distributionForm: { //发布资源的form数据
                    fReleaseClassifyId: '', //资源类型id
                    fResourceId: '', //播放组id
                    fResourceName: '', //播放组名称
                    fResourceType: 3, //资源类型
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

                isAddPlayGroupDialogShown: false, //是否显示新建播放组弹框
                isEditPlayGroupMode: false, //是否编辑播放组
                addPlayGroupDialogForm: { //新建播放组的form数据
                    fName: '', //播放组名称
                    fChangeTime: 1, //播放时间
                    fIsPlay: true, //是否播放
                    fIsChange: true, //自动切换
                },
                addPlayGroupDialogRules: {　//验证新建播放组的数据
                    fName: [
                        { required: true, message: '请输入播放组名称', trigger: 'blur' }
                    ],

                    fIsPlay: [
                        { required: true, message: '请选择播放状态', trigger: 'blur' }
                    ],

                    fChangeTime: [
                        { required: true, message: '请输入播放时间', trigger: 'blur' }
                    ],

                    fIsChange: [
                        { required: true, message: '请选择切换方式', trigger: 'blur' }
                    ],
                },

                playResourceList: [], //播放组资源数组

                isAddResourcesDialogShown: false, //是否显示添加资源的弹框
                groupList: [], //资源组数组
                allResourceList: [], //所有资源
                lastSelectedResourceId: 0, //选择资源的索引

                searchResourceForm: { //搜索资源form
                    fName: '', //资源名称
                    fResourceGroupId: '' //资源id
                },

                selectedResourceGroupIdx: 0, //选择的资源组的index
                selectedResourceGroup: {}, //选择的资源组
                selectedResources: [], //选择的资源
                
                isPlayGroupPreviewShown: false,
                isResourcePreviewShown: false,

                isBigScreenDialogShown: false, //是否显示投屏弹框
                castResourceType: null, //投屏类型
                bigScreenOptions: {}, //投屏参数

                previewResourceOptions: {
                    id: '', //资源id
                    coveringType: 1, //铺满方式
                    type: 1 //资源类型
                },

                pagination: {   //分页
                    currentPage: 1,
                    pageCount: 1
                },

                pagination2: {   //分页
                    currentPage: 1,
                    pageCount: 1
                },
            };
        },

        async mounted() {
            await this.getPlayGroups();
            if (this.playGroupList.length) {
                this.selectPlayGroup(this.playGroupList[0], 0);
                this.initDragging();
            }
        },

        methods: {
            /**
             * 获取播放组
             * @returns {Promise<void>}
             */
            async getPlayGroups() {
                let result = await PlayGroupService.getPlayGroups();

                if (result.success) {
                    this.playGroupList = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
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

            /**
             * 显示新建播放组的弹框
             */
            showAddPlayGroupDialog() {
                this.clearAddPlayGroupForm();
                this.isAddPlayGroupDialogShown = true;
                this.isEditPlayGroupMode = false;
            },

            /**
             * 清理播放组数据
             */
            clearAddPlayGroupForm() {
                this.addPlayGroupDialogForm.fName = '';
                this.addPlayGroupDialogForm.fChangeTime = 1;
                this.addPlayGroupDialogForm.fIsChange = true;
                this.addPlayGroupDialogForm.fIsPlay = true;
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
             * 预览播放组
             */
            previewPlayGroup() {
                if (!this.selectedPlayGroup.count) {
                    this.$message.error('请添加资源！');
                    return;
                }

                this.isPlayGroupPreviewShown = true;
            },

            /**
             * 关闭预览弹框
             */
            handleClosePlayGroupPreview() {
                this.isPlayGroupPreviewShown = false;
            },

            /**
             * 预览资源
             * @param resource
             */
            previewResource(resource){
                let options = this.previewResourceOptions;

                this.isResourcePreviewShown = true;

                options.coveringType = resource.fCoveredType;
                options.type = resource.fType;
                options.id = resource.fViewResourceId;
                options.name = resource.fName;
            },

            /**
             * 关闭预览弹框
             */
            handleCloseResourcePreview() {
                this.isResourcePreviewShown = false;
            },


            /**
             * 显示发布播放组弹框
             */
            async showDistribPlayGroupDialog() {
                if (!this.selectedPlayGroup.count) {
                    this.$message.error('请添加资源！');
                    return;
                }

                this.clearDistribForm();
                this.getDistributionClasses();
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
                let res = await PlayGroupService.getPublishClassify();

                if (res.success) {
                    this.distribClasses = res.obj;
                } else {
                    this.$message.error(res.msg);
                }
            },

            /**
             * 发布播放组
             */
            distributePlayGroup() {
                this.$refs.distributionForm.validate(async valid => {
                    if (valid) {
                        let res = await this.setPlayGroupDistribution(true);
                        if (res.success) {
                            this.closeModal('distributionForm', 'isDistribDialogShown');
                        }
                    }
                });
            },

            /**
             * 发布播放组或取消发布播放组
             */
            async setPlayGroupDistribution(isDistribute) {
                this.setDistributionData(isDistribute);

                let res = await PlayGroupService.publishPlayGroup(this.distributionForm);

                if (res.success) {
                    await this.getPlayGroups();
                    this.selectPlayGroup(this.playGroupList[this.selectedPlayGroupIdx], this.selectedPlayGroupIdx);
                    this.selectedPlayGroup.publishClassId = this.distributionForm.fReleaseClassifyId;
                    this.$message.success(`${ isDistribute? '发布' : '取消发布'}成功！`);
                } else {
                    this.$message.error(res.msg)
                }

                return res;
            },

            /**
             * 设置发布属性
             * @param {number} isDistribute --- 是否发布
             */
            setDistributionData(isDistribute) {
                const distribData = this.distributionForm;

                distribData.type = isDistribute ? 1 : 2; //type为1 - 发布, type为2 - 取消发布
                distribData.fResourceId = this.selectedPlayGroup.fId;

                if (!isDistribute) {
                    distribData.fId = this.selectedPlayGroup.fResourceGroupId;
                } else {
                    distribData.fResourceName = this.selectedPlayGroup.fName;
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
             * 取消发布播放组
             * @param {Object} playGroup --- 播放组数据
             */
            async cancelDistribPlayGroup(playGroup) {
                this.$confirm('确定取消发布？', 'warning', null, async () => {
                    this.clearDistribForm();
                    this.setPlayGroupDistribution(false);
                });
            },

            /**
             * 编辑播放组
             */
            showEditPlayGroupDialog() {
                this.setPlayGroupFormForEdit();
                this.isAddPlayGroupDialogShown = true;
                this.isEditPlayGroupMode = true;
            },

            /**
             * 编辑播放组的时候设置原来的资源数据
             */
            setPlayGroupFormForEdit() {
                let form =  this.addPlayGroupDialogForm;

                form.fName = this.selectedPlayGroup.fName;
                form.fChangeTime = this.selectedPlayGroup.fChangeTime;
                form.fIsPlay = this.selectedPlayGroup.fIsPlay;
                form.fIsChange = this.selectedPlayGroup.fIsChange;
            },

            /**
             * 删除播放组
             */
            deletePlayGroup() {
                this.$confirm(`${ this.selectedPlayGroup.fName } 删除后无法恢复，确认删除？`, 'warning', null, async () => {
                    let params = this.setParams(this.selectedPlayGroup.fId);
                    let result = await PlayGroupService.deletePlayGroup(params);

                    if (result.success) {
                        this.$message.success(result.msg);
                        this.getPlayGroups();
                        this.selectPlayGroup(this.playGroupList[0], 0);
                    } else {
                        this.$message.error(result.msg);
                    }
                });
            },

            /**
             * 删除播放组
             * @param {string} groupId --- 播放组id
             */
            setParams(groupId) {
                return {
                    ids: [ groupId ]
                };
            },

            /**
             * 新建播放组
             */
            addPlayGroup() {
                this.$refs.addPlayGroupDialogForm.validate(async valid => {
                    let playGroupData =  null;

                    if (valid) {
                        if (!this.isEditPlayGroupMode) {
                            playGroupData = this.addPlayGroupDialogForm;
                        } else {
                            playGroupData = this.setPlayGroupDataForEdit();
                        }

                        this.submitPlayGroup(playGroupData);
                    }
                });
            },

            /**
             * 编辑播放组的时候设置要提交的数据
             */
            setPlayGroupDataForEdit() {
                let playGroupData = {
                    ...this.selectedPlayGroup,
                    ...this.addPlayGroupDialogForm
                };

                return playGroupData;
            },

            /**
             * 提交播放组数据
             * @param {Object} playGroupData --- 提交的数据
             */
            async submitPlayGroup(playGroupData) {
                let res = null;

                if (!this.isEditPlayGroupMode) {
                    res = await PlayGroupService.insertPlayGroup(playGroupData);
                } else {
                    res = await PlayGroupService.updatePlayGroup(playGroupData);
                }

                if (res.success) {
                    this.$message.success(res.msg);
                    await this.getPlayGroups();
                    this.closeModal('addPlayGroupDialogForm', 'isAddPlayGroupDialogShown');
                    if (this.isEditPlayGroupMode) {
                        this.resetSelectedPlayGroup();
                    } else {
                        this.selectPlayGroup(this.playGroupList[0], 0);
                    }
                } else {
                    this.$message.error(res.msg, true);
                }
            },

            /**
             * 修改播放组信息后重新设置选择的播放组属性
             */
            resetSelectedPlayGroup() {
                this.selectedPlayGroup = this.playGroupList[this.selectedPlayGroupIdx];
            },


            /**
             * 选择播放组
             * @param {Object} item --- 选择的资源
             * @param {number} index ---　选择播放组的index
             */
            async selectPlayGroup(resourceGroup, index) {
                this.selectedPlayGroupIdx = index;
                this.selectedPlayGroup = resourceGroup;
                await this.getPlayGroupResources();
                this.sortBySlideOrder();
            },

            /**
             * 获取属于选择的分组的资源
             */
            async getPlayGroupResources() {
                let result = await PlayGroupService.getPlayGroupResources(this.selectedPlayGroup.fId);

                if (result.success) {
                    this.playResourceList = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 根据资源的播放顺序排序资源
             */
            sortBySlideOrder() {
                this.playResourceList.sort((resourceA, resourceB) => resourceA.fPlayDesc - resourceB.fPlayDesc);
            },

            /**
             * 初始化拖拽修改顺序
             */
            initDragging() {
                const mainList = document.querySelector('.main-list');
                if (!mainList) {
                    return;
                }

                const self = this;
                Sortable.create(mainList, {
                    filter: '.not-draggable',
                    draggable: '.draggable',
                    onEnd({ newIndex, oldIndex }) {
                        if (newIndex === oldIndex) {
                            return;
                        }

                        const firstItem = Object.assign({}, self.playResourceList[oldIndex - 1]);
                        const secondItem = Object.assign({}, self.playResourceList[newIndex - 1]);
                        self.playResourceList.splice(oldIndex - 1, 1, secondItem);
                        self.playResourceList.splice(newIndex - 1, 1, firstItem);
                        self.updateResourcesOrder();
                    }
                });
            },

            /**
             * 修改摄像头循环组中的摄像头的播放排序
             */
            async updateResourcesOrder() {
                let params = this.setResourceOrderParams();
                let result = await PlayGroupService.updateResourcesOrder(params);

                if (result.success) {
                    this.$message.success('成功！');
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置要提交的资源顺序数据
             */
            setResourceOrderParams() {
                return {
                    fPlayGroupId: this.selectedPlayGroup.fId,
                    ids: this.playResourceList.map(item => item.tResourcePlayInfo)
                };
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
             * 移出资源
             * @param {string} id --- 资源id
             * @param {string} id --- 资源名称
             */
            async deleteResource(id, name) {
                this.$confirm(`${ name } 删除后无法恢复，确认删除？`, 'warning', null, async () => {
                    let params = this.setDeleteResourceParams(id);
                    let result = await PlayGroupService.deleteResource(params);

                    if (result.success) {
                        this.$message.success(result.msg);
                        this.getPlayGroupResources();
                        this.getPlayGroups();
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
                    resourcePlayInfoIds: [
                        id
                    ]
                }
            },

            /**
             * 展示添加资源的弹框
             */
            async showAddResourcesDialog() {
                this.clearResourceData();
                this.isAddResourcesDialogShown = true;
                await this.getResourceGroups();
                this.selectedResourceGroup = this.groupList[0];
                this.getAllResources();
            },

            /**
             * 清理资源数据
             */
            clearResourceData() {
                this.allResourceList = [];
                this.selectedResources = [];
            },

            /**
             * 获取资源组
             * @returns {Promise<void>}
             */
            async getResourceGroups() {
                let result = await PlayGroupService.getResourceGroups();

                if (result.success) {
                    this.groupList = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 选择资源
             * @param {Object} resource --- 资源
             * @param {number} idx --- 资源索引
             */
            selectResource(resource, idx) {
                let card = this.$refs[`resCard${idx}`][0];
                let className = card.className;

                if (className.indexOf('selected') !== -1) {
                    card.className = 'resource-item card smaller';
                    this.clearSelectedResource(resource);
                } else {
                    card.className = 'resource-item card smaller selected';
                    this.addSelectedResource(resource);
                }
            },

            /**
             * 把选择的资源添加到数组里
             * @param {Object} resource --- 资源
             */
            addSelectedResource(resource) {
                this.selectedResources.push(resource);
            },

            /**
             * 播放组是否已经有这个资源
             * @param {string} id --- 资源id
             */
            isAreadyPresent(id) {
                console.log(this.playResourceList);
                let idx = this.playResourceList.findIndex(item => item.fViewResourceId === id);

                return idx !== -1;
            },

            /**
             * 资源是否已经选择的
             * @param {string} id --- 资源id
             */
            isSelected(id) {
                let idx = this.selectedResources.findIndex(item => item.fId === id);

                return idx !== -1;
            },

            /**
             * 选择资源组
             * @param {Object} resourceGroup --- 选择的资源
             * @param {number} index ---　选择资源组的index
             */
            selectResourceGroup(resourceGroup, index) {
                this.selectedResourceGroupIdx = index;
                this.selectedResourceGroup = resourceGroup;
                this.pagination2.currentPage = 1;
                this.getAllResources();
            },

            /**
             * 获取属于选择的分组的资源
             * @param {boolean} byResourceGroup --- 是否根据资源组id获取资源
             */
            async getAllResources(byResourceGroup = true) {
                this.setAllResourcesParams(byResourceGroup);
                let result = await PlayGroupService.getResources(this.searchResourceForm);

                if (result.success) {
                    this.pagination2.pageCount = result.obj.pageCount;
                    this.allResourceList = result.obj.items;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置获取资源请求的参数
             * @param {boolean} byResourceGroup --- 是否根据资源组id获取资源
             */
            setAllResourcesParams(byResourceGroup) {
                this.searchResourceForm.pageSize = 8;
                this.searchResourceForm.currentPage = this.pagination2.currentPage;
                if (byResourceGroup) {
                    this.searchResourceForm.fResourceGroupId = this.selectedResourceGroup.fId;
                    this.searchResourceForm.fName = '';
                } else {
                    this.searchResourceForm.fResourceGroupId = '';
                }
            },

            /**
             * 根据资源名称搜索资源
             */
            searchResourceByName() {
                if (this.searchResourceForm.fName) {
                    this.getAllResources(false);
                } else {
                    this.getAllResources(true);
                }
            },

            /**
             * 跳到第几页
             */
            async goToAddResourcePage() {
                this.getAllResources();
            },


            /**
             * 删掉选择的资源
             * @param resource
             */
            clearSelectedResource(resource) {
                let qnty = this.selectedResources.length;

                for (let i = 0; i < qnty; i++) {
                    if (this.selectedResources[i].fId === resource.fId) {
                        this.selectedResources.splice(i, 1);
                    }
                }
            },

            /**
             * 删掉所有的选择的资源
             */
            clearAllSelectedResource() {
                this.selectedResources = [];
            },

            /**
             * 把资源保存到播放组
             */
            savePlayGroupResources() {
                if (!this.selectedResources.length) {
                    this.$message.error('请选择要添加的资源');
                    return;
                }

                let params = this.setSavePlayGroupResourcesParams();
                this.submitPlayGroupResources(params);
            },

            /**
             * 设置保存资源的请求的参数
             */
            setSavePlayGroupResourcesParams() {
                return  {
                    playGroupIds: this.selectedPlayGroup.fId,
                    resourceIds: this.selectedResources.map(item => item.fId)
                };
            },

            /**
             * 提交播放组资源
             * @param {Object} playGroupResourcesData --- 添加资源请求的参数
             */
            async submitPlayGroupResources(playGroupResourcesData) {
                let result = await PlayGroupService.insertPlayGroupResources(playGroupResourcesData);

                if (result.success) {
                    this.getPlayGroupResources();
                    this.getPlayGroups();
                    this.closeModal('addResourceDialogForm', 'isAddResourcesDialogShown');
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 投屏显示组
             * @param {Object} item --- 显示组对象
             * @author 元实
             */
            handleCastToBigScreen() {
                if (!this.selectedPlayGroup.count) {
                    this.$message.error('请添加资源！');
                    return;
                }

                this.setCastOptions(this.selectedPlayGroup);
                this.isBigScreenDialogShown = true;
            },

            /**
             * 设置投屏参数
             * @param {Object} item --- 显示组对象
             * @author 元实
             */
            setCastOptions(item) {
                this.castResourceType  = 3;
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
            }
        }
    }
</script>

<style lang="scss">
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

    .el-row {
        &.el-row--flex {
            flex-wrap: wrap;
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

    .mr-10 {
        margin-right: 10px;
    }

    .choosed {
        width: 0;
        height: 0;
        border-top: 35px solid #1589FB;
        border-left: 35px solid transparent;
        position: absolute;
        top: 0;
        right: 0;

        i {
            color: #fff;
            position: absolute;
            top: -33px;
            right: 2px;
            font-size:17px;
        }
    }

    // 页面主题部分
    .play-main {
        display: flex;
        width: 100%;
        margin-bottom: 200px;

        .section-header {
            font-size: 14px;
        }

        .white-font {
            color: #fff;
        }

        .resource-list {
            flex: 1;
            /*width: 100%;*/

            .resources-section {
                padding: 18px 4px 8px 4px;

                .title_info {
                    display: flex;
                    justify-content: space-between;
                    height: 35px;
                    margin-right: 30px;
                }

                .smaller-icon {
                    font-size: 12px;
                }

                hr {
                    border: 0px;
                    border-top: 1px solid #27343E;
                    margin-top: 3px;
                    background: #27343E;
                }

                .title-info {
                    color: #fff;
                    font-size: 14px;
                    margin-left: 15px;
                    border-left: 2px solid #2483FF;
                    padding-left: 10px;
                    line-height: 20px;
                    height: 20px;
                }

                .info-content {
                    display: flex;
                    flex: 1;
                    margin-left: 15px;
                    border-radius: 4px;
                    padding: 0 20px 0 0px;

                    .info {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        text-align: center;
                        margin-right: 5px;
                        background: rgba(225, 225,225, 0.1);
                        padding-top: 15px;
                        padding-bottom: 15px;
                        box-sizing: border-box;

                        .circle_push {
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            border-radius: 50px;
                            margin-right: 5px;
                            background: #67C23A;
                        }

                        span {
                            display: block;
                            font-size: 24px;
                            color: #fff;
                        }

                        p {
                            color: #E3E3E3;
                            font-size: 14px;
                            margin-bottom: 5px;
                        }

                        div {

                            span {
                                color: #fff;
                                font-size: 24px;
                            }
                        }
                        span {

                        }
                    }
                }
            }

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
                    display: flex;
                    align-items: center;
                    flex-direction: row;
                    margin-right: 15px;

                    .search {
                        background: #1d262e;
                        padding-right: 10px;
                        border-radius: 5px;

                        .right-input {
                            background: #1d262e;
                            color: #fff;
                            padding: 0 10px;
                            line-height: 30px;
                            height: 30px;
                            border: 1px solid transparent;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            transition: .2s;
                            border-radius: 5px;
                        }
                    }

                    .dropdown-item {
                        display: inline-block;
                        margin-left: 10px;
                        cursor: pointer;

                        &:hover {
                            span,i {
                                color: #2483FF!important;
                            }
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
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                padding-top: 8px;
                user-select: none;
                padding-bottom: 50px;
                padding-left: 4px;

                .items-transition-enter, .items-transition-leave-to {
                    opacity: 0;
                    transform: translateY(30px);
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
            }

            .favorite-empty {
                margin: 160px auto;

                .tips {
                    color: #fff;
                    margin-top: 15px;
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

    .add-resource-dialog {
         .addModal {
             max-width: 1500px !important;
         }

        .limit-height {
            max-width: 1500px;
        }

        .resource-groups {
            overflow-y: auto;
            height: 400px;
            padding-top: 71px;

            .group-title {
                padding-left: 10px;
            }

            .group-title-active {
                padding-left: 10px;
            }
        }
    }

    .add-resource-container {
        width: 1200px;
    }

    .resource-container {
        height: 510px;

        aside {
            border-top: 1px solid #5A6271;
        }

        header {
            height: 55px;
            border-top: 1px solid #5A6271;
            padding-left: 16px;
            padding-top: 16px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }

        .el-input {
            &.el-input--small {
                width: 200px;
            }
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

    .add-resource-list {
        height: 400px;
    }

    .main-list,
    .add-resource-list {
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

            &:hover {
                border: 1px solid #2483FF;
            }

            &:not(:nth-child(1)) {
                opacity: 1;
                transform: scale(1);
            }

            &.smaller {
                width: 200px;
                height: 140px;

                .resource-info {
                    height: 113px;
                }

                .screen-main {
                    height: 25px;
                }
            }

            &.selected {
                border: 1px solid #2483FF;

                .recourse-modal {
                    opacity: 1;
                }
            }

            &.present {
                position: relative;

                &:after {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 20px;
                    height: 20px;
                    background: red;
                    transform: rotate(45deg);
                    -webkit-transform-origin: 27px 18px;
                    -moz-transform-origin: 27px 18px;
                    -ms-transform-origin: 27px 18px;
                    -o-transform-origin: 27px 18px;
                    transform-origin: 27px 18px;
                }
            }
        }

        .first-item {
            justify-content: center;
            background-image: linear-gradient(-90deg,rgba(0,161,255,.39) 0,rgba(0,137,255,.19) 100%);
            text-align: center;
            cursor: pointer;
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

            .resourcev-btn {
                font-size: 14px;
                color: #fff;
                display: block;
                vertical-align: middle;
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
                margin-bottom: 10px;

                &.delete-resource {
                    background: #F56C6C;
                    color: rgba(225,225,225,1);
                }
            }

            .circle {
                width: 40px;
                height: 40px;
                border: 1px solid #303640;
                border-radius: 50px;
                background-color: #1589FB;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

    .main-list {
        .card:hover {
            border: 1px solid #2483FF;
        }
    }

    .play-groups,
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

    .play-groups {
        .groups-container {
            height: 80vh;
        }
    }

    .selected-res-container {
        position: relative;
        background: #121515;
        height: 70px;
        border-radius: 2px;
        padding: 8px 50px 8px 8px;

        .tags {
            background: #393e46;
            border-color: #393e46;
            color: #fff;
            .el-tag__close{
                color: #fff!important;
            }
        }

        .clear-button {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 15px;
            height: 15px;
            padding: 0;
            color: #fff;
            background: #393e46;
            border-color: #393e46;
            border-radius: 4px;
        }
    }
</style>
