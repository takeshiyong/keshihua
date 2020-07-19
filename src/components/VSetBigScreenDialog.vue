/*
* @Author: 元实
* @Date:   2019-12-06
* @Description: 投放大屏
*/


<template>
    <DialogModal
            :showModal="isDialogShown"
            @closeModals="closeDialog"
            modalTitle="投放大屏">
        <template v-slot:container>
            <div class="dispatch-container">
                <aside class="resources">
                    <header class="aside-header">
                        <el-input
                            v-model="searchResourceForm.fName"
                            suffix-icon="el-icon-search"
                            style="width: 100%"
                            placeholder="请输入资源名称"
                            @input="searchByName"></el-input>
                    </header>

                    <nav class="resources-nav mt-15">
                        <div class="nav-left">
                            <template v-if="selectedSourceType !== 6">
                                <i
                                        v-for="(item,index) in dataSourceList"
                                        :key="index"
                                        :ref="`icon${index + 1}`"
                                        :class="`content-icon dvIcon ${item.name} nav-icon ${ selectedSourceType === index + 1 ? 'active' : '' }`"
                                        style="font-size: 18px;"
                                        :title="item.title"
                                        @click="selectSourceType(index + 1)"></i>
                            </template>

                            <i
                                    v-else
                                    ref="icon6"
                                    class="content-icon dvIcon dvIcon-changjingguanli nav-icon active"
                                    style="font-size: 18px;"
                                    title="场景"></i>
                        </div>

                        <div class="nav-right">
                            <div class="nav-body">
                                <div
                                    v-for="(source, idx) in sources"
                                    class="source-card"
                                    :ref="`source${idx}`"
                                    :key="source.fId"
                                    @click="selectSource(source, idx)">
                                <div class="card-container">
                                    <div class="card-main">
                                        <img
                                                v-if="selectedSourceType === 4"
                                                :src="`${ config.PLAY_URL }/api/v1/getsnap?channel=${ source.fRealityChannel }`"
                                                class="source-thumbnail">
                                        <img
                                                v-else-if="selectedSourceType === 3 && source.resources"
                                                :src="`${ config.PICTURE_URL }${ source.resources[0].fPreviewPicture }`"
                                                class="source-thumbnail">
                                        <img
                                                v-else-if="selectedSourceType === 6"
                                                :src="`${ config.PICTURE_URL }${ source.fPreviewUtl }`"
                                                class="source-thumbnail">
                                        <img
                                                v-else
                                                :src="`${ config.PICTURE_URL }${ source.fPreviewPicture }`"
                                                class="source-thumbnail">
                                    </div>

                                    <div class="card-footer">
                                        <template v-if="selectedSourceType === 5">
                                            <el-tooltip v-if="source.fResourcesName.length > 6"
                                                        :open-delay="400"
                                                        effect="dark"
                                                        :content="source.fResourcesName">
                                                <span class="font-12">{{ truncate(source.fResourcesName) }}</span>
                                            </el-tooltip>
                                            <span v-else class="font-12">{{ source.fResourcesName }}</span>
                                        </template>
                                        <template v-else>
                                            <el-tooltip v-if="source.fName.length > 6"
                                                        :open-delay="400"
                                                        effect="dark"
                                                        :content="source.fName">
                                                <span class="font-12">{{ truncate(source.fName) }}</span>
                                            </el-tooltip>
                                            <span v-else class="font-12">{{ source.fName }}</span>
                                        </template>
                                        <!--<p v-if="selectedSourceType === 5">{{ source.fResourcesName }}</p>
                                        <p v-else>{{ source.fName }}</p>-->
                                    </div>

                                    <div class="recourse-modal">
                                        <div class="circle">
                                            <i class="el-icon-check" style="color: #fff;font-size: 18px;"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>

                            <footer class="paginator-footer">
                                <el-row type="flex" justify="center">
                                    <div  v-if="pagination.pageCount > 1" class="paginator">
                                        <el-pagination
                                                small
                                                layout="prev, pager, next"
                                                :current-page.sync="pagination.currentPage"
                                                :page-count="pagination.pageCount"
                                                @current-change="goToPage">
                                        </el-pagination>
                                    </div>
                                </el-row>
                            </footer>
                        </div>
                    </nav>
                </aside>

                <main class="screen-part">
                    <section class="screens-list mt-15">
                        <div class="screens-inner">
                            <div
                                v-for="(server, idx) in servers"
                                :ref="`server${idx}`"
                                :class="`server-card ${ server.fState === 3 ? 'inactive' : ''}`"
                                @click="selectServer(server, idx)">

                                <div class="server-state">
                                    <el-tooltip
                                            v-if="server.fState === 3"
                                            effect="dark"
                                            :open-delay="400"
                                            content="未在线">
                                        <div class="state-mark off-line"></div>
                                    </el-tooltip>
                                    <el-tooltip
                                            v-else-if="server.fState === 1"
                                            effect="dark"
                                            :open-delay="400"
                                            content="在线">
                                        <div class="state-mark on-line"></div>
                                    </el-tooltip>
                                    <el-tooltip
                                            v-else
                                            effect="dark"
                                            :open-delay="400"
                                            content="正在显示">
                                        <div class="state-mark on-display"></div>
                                    </el-tooltip>
                                </div>

                                <el-row class="ta-center">
                                    <span class="server-name">{{ server.fName }}</span>
                                </el-row>

                                <el-row class="mt-5">
                                    <span>分辨率：</span>
                                    <span>{{ server.fWidth }} * {{ server.fHeight }}</span>
                                </el-row>

                                <el-row class="mt-5">
                                    <span>服务器ip：</span>
                                    <span>{{ server.fIp }}</span>
                                </el-row>

                                <el-row class="mt-5">
                                    <span>显示资源类型：</span>
                                    <span v-if="server.fShowResourceType != null" class="bottomText">
                                        <template v-if="server.fShowResourceType === 1">显示组</template>
                                        <template v-if="server.fShowResourceType === 2">预案组</template>
                                        <template v-if="server.fShowResourceType === 3">场景</template>
                                        <template v-if="server.fShowResourceType === 4">临时资源</template>
                                    </span>
                                    <span v-else class="bottomText" style="color: #e03e36">暂无配置</span>
                                </el-row>
                            </div>
                        </div>

                        <el-tooltip content="刷新服务器">
                            <div class="resfresh-servers" @click="resetServers(true)"><i class="el-icon el-icon-refresh"  :class="{ clicked: isResetBigScreen }"></i></div>
                        </el-tooltip>
                    </section>

                    <section class="cast-type">
                        <el-row type="flex" justify="start" class="mt-5">
                            <span>整体替换：</span>
                            <el-switch
                                    v-model="userCastType"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value="1"
                                    :inactive-value="2"
                                    :disabled="isOnlyFullScreenCast"></el-switch>
                        </el-row>
                    </section>

                    <section class="screen-container">
                        <div v-if="resourceId !== '' && servers.length && (isCasted || servers[selectedServerIdx].fShowResourceType !== 4) " class="screen-inner">
                            <VPreviewBigScreen
                                    v-if="isTemporalyCast"
                                    :type="servers[selectedServerIdx].fShowResourceType"
                                    :sourceType="selectedSourceType"
                                    :id="resourceId"
                                    :castType="userCastType"
                                    @getSelectSceneItemId="handleSelectSceneItemId">
                            </VPreviewBigScreen>

                            <VPreviewBigScreen
                                    v-else
                                    :type="servers[selectedServerIdx].fShowResourceType"
                                    :id="resourceId"
                                    @getSelectSceneItemId="handleSelectSceneItemId">
                            </VPreviewBigScreen>
                        </div>
                        <p v-else class="no-bigscreen-data">未投屏</p>
                    </section>
                </main>
            </div>
        </template>

        <template v-if="isCastButtonShown" v-slot:footer><el-button type="primary" @click="handleCastToScreen(1)">投屏</el-button></template>
    </DialogModal>
</template>

<script>
    import { SetBigScreenService } from '@/api/bigscreen-project'; // 请求api
    import { ResourceService } from '@/api/resource'; // 请求api
    import { sceneService, layoutService } from '@/api/visual'; // 请求api
    import DialogModal from './DialogModal.vue'; //弹框
    import VPreviewBigScreen from './big-screen/VPreviewBigScreen.vue'; //投放大屏的时候显示大屏的组件
    import config from '@/common/basic-configuration';

    export default {
        props: {
            shown: {              //弹框时候是否显示
                type: Boolean,
                required: true
            },

            type: {               //资源类型
              type: Number
            },

            options: {          //资源参数
                type: Object,
                required: true
            },

            id: {              //资源fDd
                type: String
            },

            isTemporal: {     //是否临时投屏
                type: Boolean
            }
        },

        components: {
            DialogModal,
            VPreviewBigScreen
        },

        data() {
            return {
                config, // 引入的变量要在html之内使用

                isDialogShown: this.shown, //是否显示弹框

                searchResourceForm: {  //搜索资源的属性
                    fName: '',   //资源名称
                    currentPage: 1, //当前页
                    pageSize: 12 //一页有几个资源
                },

                dataSourceList: [  //投放资源的类型
                    { title: '图片', name: 'dvIcon-pic' },
                    { title: 'url', name: 'dvIcon-link' },
                    { title: '播放组', name: 'dvIcon-book2fuben' },
                    { title: '摄像头', name: 'dvIcon-icon-' },
                    { title: '循环摄像头', name: 'dvIcon-xunhuan' }
                ],
                isSourcesShown: true, //是否显示可选的资源项

                isTemporalyCast: true, //是否暂时投屏

                selectedSourceType: null, //选择的资源类型
                sources: [], //资源
                selectedSourceIdx: null, //选择的资源索引
                isSourceSelected: false, //资源是否选择的

                servers: [], //服务器
                selectedServerIdx: 0, //选择的大屏服务器的索引
                selectedSceneId: '', //选择的场景的fId
                isResetBigScreen: false, //刷新
                userCastType: 1, //替换投屏类型 1.整体替换 2.替换某一块
                resourceId: '', //资源id

                url: '', //预览的大屏url

                isOnlyFullScreenCast: false, //是否只能整体替换
                selectedScreenItemId: '', //选择的场景资源关联ID

                isCasted: false, //是否投屏的

                pagination: {   //分页
                    currentPage: 1,
                    pageCount: 2
                }
            };
        },

        watch: {
            async shown() {    //展示投放大屏弹框的时候获取资源和服务器信息
                this.isDialogShown = this.shown;
                this.sources = [];

                this.isTemporalyCast = this.isTemporal;
                if (!this.isTemporal) {
                    this.isOnlyFullScreenCast = true;
                }

                if (this.shown) {
                    this.clearSearchForm();
                    await this.selectSourceType(this.type);
                    if (this.options.id) {
                        if (this.type !== 4 || !this.isTemporal) {
                            this.selectById();
                        } else {
                            this.selectByChannel();
                        }
                    }
                    if (this.options.name) {
                        this.setSearchName();
                    }
                    await this.getServers();
                    this.selectFirstActiveServer();
                 }
            }
        },

        computed: {
             /**
             * 是否显示投屏按钮
             */
            isCastButtonShown() {
                const serverIdx = this.selectedServerIdx;

                if (this.servers.length) {
                    const sourceType = this.servers[serverIdx].fShowResourceType;

                    if (((this.type === 6) && ((this.userCastType === 1))) ||
                        (sourceType !== 2 && sourceType !== 3) ||
                        (this.userCastType === 1)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
        },

        methods: {
            clearSearchForm() {
                this.searchResourceForm = {  //搜索资源的属性
                    fName: '',   //资源名称
                    currentPage: 1, //当前页
                    pageSize: 12 //一页有几个资源
                };
            },


            /**
             * 选择投放大屏的元素的类型
             * @param {number} idx --- 类型索引
             */
            async selectSourceType(type) {
               if (this.selectedSourceType === type) {
                   return;
               }

               if (this.selectedSourceType !== 6 && this.selectedSourceType != null) {
                   this.$refs[`icon${this.selectedSourceType}`][0].classList.remove('active');
               }

               this.selectedSourceType = type;
               if (type === 6) {
                   this.isOnlyFullScreenCast = true;
               }

               await this.getSources(type);
               this.isSourceSelected = false;
            },

            /**
             * 设置筛选的name条件
             */
            setSearchName() {
                this.searchResourceForm.fName = this.options.name;
            },

            /**
             * 获取资源
             * @param {number} type --- 资源类型
             */
            async getSources(type) {
                this.setSourcesParams();

                switch (type) {
                    case 1: await this.getResources(1); break;
                    case 2: await this.getResources(2); break;
                    case 3: await this.getResourcePlayGroups(); break;
                    case 4: await this.getVideoCameras(); break;
                    case 5: await this.getCameraLoops(); break;
                    case 6: await this.getScene(); break;
                }
            },

            /**
             * 设置获取资源请求的参数
             * @param {number} type --- 资源类型
             */
            setSourcesParams(type) {
                this.searchResourceForm.currentPage = this.pagination.currentPage;
                this.searchResourceForm.pageSize = 12;
            },

            /**
             * 获取资源
             * @param {number} type --- 资源类型
             */
            async getResources(type) {
                let result = await ResourceService.getResources(this.searchResourceForm);

                if (result.success) {
                    this.pagination.pageCount = result.obj.pageCount;
                    this.sources = result.obj.items.filter(item => item.fType === type);
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取播放组
             */
            async getResourcePlayGroups() {
                let result = await SetBigScreenService.getResourcePlayGroups(this.searchResourceForm);

                if (result.success) {
                    this.pagination.pageCount = result.obj.pageCount;
                    this.sources = result.obj.items;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取摄像头
             */
            async getVideoCameras() {
                let result = await SetBigScreenService.getVideoCameras(this.searchResourceForm);

                if (result.success) {
                    this.pagination.pageCount = result.obj.pageCount;
                    this.sources = result.obj.items;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 查询摄像头循环信息
             */
            async getCameraLoops() {
                let result = await SetBigScreenService.getVideoCamerasLoops(this.searchResourceForm);

                if (result.success) {
                    this.pagination.pageCount = result.obj.pageCount;
                    this.sources = result.obj.items;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取场景
             */
            async getScene() {
                this.setSearchSceneNameParam();
                let result = await layoutService.getAllScene(this.searchResourceForm);

                if (result.success) {
                    this.pagination.pageCount = result.obj.pageCount;
                    this.sources = result.obj.items;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置场景名称筛选参数
             */
            setSearchSceneNameParam() {
                if (this.options.name) {
                    this.searchResourceForm.fScencName = this.options.name;
                }
            },

            /**
             * 根据id选择资源
             */
            selectById() {
                let sourceIdx = this.sources.findIndex(source => source.fId === this.options.id);

                if (sourceIdx !== -1) {
                    this.sources = [this.sources[sourceIdx]];
                    setTimeout(() => {
                        this.selectSource(this.sources[0], 0);
                    }, 100);
                }
            },

            /**
             * 根据通道id选择摄像头
             */
            selectByChannel() {
                let sourceIdx = this.sources.findIndex(source => source.fChannel === this.options.id);

                if (sourceIdx !== -1) {
                    this.sources = [this.sources[sourceIdx]];
                    setTimeout(() => {
                        this.selectSource(this.sources[0], 0);
                    }, 100);
                }
            },

            /**
             * 根据资源名称获取资源
             */
            searchByName() {
                this.getSources(this.selectedSourceType);
            },

            /**
             * 选择要投放的资源
             * @param {Object} source --- 资源对象
             * @param {number} idx --- 索引
             */
            selectSource(source, idx) {
                let sourceDiv = this.$refs[`source${idx}`][0];
                let classList = sourceDiv.classList;

                if (this.selectedSourceIdx !== null && this.selectedSourceIdx !== idx) {
                    this.$refs[`source${this.selectedSourceIdx}`][0].classList.remove('selected');
                }

                if (classList.contains('selected')) {
                    classList.remove('selected');
                    this.selectedSourceIdx = null;
                    this.isSourceSelected = false;
                } else {
                    classList.add('selected');
                    this.selectedSourceIdx = idx;
                    this.isSourceSelected = true;
                }
            },

            /**
             * 资源分页
             * @param {number} page --- 页数
             */
            goToPage(page) {
                this.pagination.currentPage = page;
                this.getSources(this.selectedSourceType);
            },

            /**
             * 获取服务器信息
             */
            async getServers() {
                let result = await SetBigScreenService.getBigScreenServers();

                if (result.success) {
                    this.servers = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 选择第一个在线的服务器
             */
            selectFirstActiveServer() {
                let activeIdx = this.servers.findIndex((server, idx) => { return server.fState !== 3; });

                if (activeIdx !== -1) {
                    this.selectServer(this.servers[activeIdx], activeIdx);
                }
            },

            /**
             * 选择大屏服务器
             * @param {Object} server --- 包括大屏服务器属性的对象
             * @param {number} idx --- 索引
             */
            selectServer(server, idx) {
                if (server.fState !== 3) {
                    this.$refs[`server${this.selectedServerIdx}`][0].classList.remove('selected');
                    this.$refs[`server${idx}`][0].classList.add('selected');
                    this.selectedServerIdx = idx;

                    if (server.fShowResourceType === 2 || server.fShowResourceType === 3) {
                        this.getSceneId(server);
                        if (this.isTemporalyCast) {
                            this.isOnlyFullScreenCast = false;
                        }
                    } else {
                        this.isOnlyFullScreenCast = true;
                    }

                    this.isCasted = false;
                    this.resourceId = '';
                    this.resourceId = this.getBigScreenResourceId();
                }
            },

            /**
             * 获取场景fId
             */
            getSceneId(server) {
                if (server.fShowResourceType === 3) {
                    this.selectedSceneId = server.fShowResourceGroupId;
                } else if (server.fShowResourceType === 2) {
                    this.selectedSceneId = server.fCurrentPlanGroupId;
                }
            },

            /**
             * 获取资源id
             */
            getBigScreenResourceId() {
                if (this.servers.length) {
                       return this.servers[this.selectedServerIdx].fShowResourceType === 2 ?
                            this.servers[this.selectedServerIdx].fCurrentPlanGroupId || '' :
                            this.servers[this.selectedServerIdx].fShowResourceGroupId || '';
                } else {
                    return '';
                }
            },

            /**
             * 获取在场景上选择的项id
             * @param {String} itemId --- 场景上选择的项fId
             * @param {String} scene --- 当前场景fId
             */
            async handleSelectSceneItemId(itemId, sceneId) {
                this.selectedScreenItemId = itemId;
                this.selectedSceneId = sceneId;

                if (!this.isSourceSelected) {
                    this.$message.error('请选择资源！');
                    return;
                }

                if (this.userCastType === 2) {
                    await this.castSourceToScreen();
                    this.resourceId = this.getCastedResourceId();
                } else {
                    this.$message.warning('替换投屏类型是整体替换！');
                }

                this.resourceId = '';
                await this.resetServers();
                this.resourceId = this.getCastedResourceId();
                this.isCasted = true;
            },

            /**
             * 如果大屏上显示的场景或唯一的资源、摄像头，处理投放大屏的事件
             */
            async handleCastToScreen(castType) {
                if (!this.isSourceSelected) {
                    this.$message.error('请选择资源！');
                    return;
                }


                if (this.selectedSourceType === 6) {
                    await this.castSceneToScreen();
                    this.clearSearchForm();
                    this.isTemporalyCast = true;
                    setTimeout(() => this.selectSourceType(1),  10);
                } else {
                    await this.castSourceToScreen(castType);
                }

                this.resourceId = '';
                await this.resetServers();
                this.resourceId = this.getCastedResourceId();
                this.isCasted = true;
            },

            /**
             * 投屏资源、播放组、摄像头、循环组
             */
            async castSourceToScreen() {
                if (this.userCastType === 2 && !this.selectedScreenItemId) {
                    this.$message.error('请选择场景资源！');
                    return;
                }

                let params = {};
                let res = {};

                if (this.isTemporalyCast) {
                    params = this.setTempSourceBigScreenParams();
                    res = await SetBigScreenService.castTempSourceToBigScreen(params);
                } else {
                    params = this.setPermSourceBigScreenParams();
                    res = await SetBigScreenService.castPermSourceToBigScreen(params);
                }

                if (res.success) {
                    this.$message.success('成功！');
                    //this.isSourceSelected = false;
                    if (this.userCastType === 1) {
                        this.isOnlyFullScreenCast = true;
                    } else {
                        this.isOnlyFullScreenCast = false;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            },

            /**
             * 设置临时投屏参数
             */
            setTempSourceBigScreenParams() {
                const serverIdx = this.selectedServerIdx;
                const server = this.servers[serverIdx];
                const sourceIdx = this.selectedSourceIdx;
                const source = this.sources[sourceIdx];
                let params = {
                    fScreenServerId: server.fId,
                    resourceId: source.fId,
                    resourceType: this.selectedSourceType,
                    replaceType: this.userCastType
                };

                if (this.userCastType === 2) {
                    params.fSceneId = this.selectedSceneId;
                    params.sceneResourceId = this.selectedScreenItemId;
                }

                return params;
            },

            /**
             * 设置投屏参数
             */
            setPermSourceBigScreenParams() {
                const serverIdx = this.selectedServerIdx;
                const server = this.servers[serverIdx];

                return {
                    fScreenServerId: [ server.fId ],
                    fResourceId: this.options.displayId
                };
            },

            /**
             * 投放场景
             */
            async castSceneToScreen() {
                let params = this.setSceneBigScreenParams();
                let res = await SetBigScreenService.castSceneToBigScreen(params);

                if (res.success) {
                    this.$message.success('成功！');
                    this.isOnlyFullScreenCast = false;
                    this.isSourceSelected = false;
                    this.selectedSceneId = this.sources[this.selectedSourceIdx].fId;
                } else {
                    this.$message.error(res.msg);
                }
            },

            /**
             * 刷新服务器和大屏信息
             * @param {boolean} animate --- 是否显示刷新图标的动画
             */
            async resetServers(animate = false) {
                if (animate) {
                    this.setResetServersAnimation();
                }
                await this.getServers();
            },

            /**
             * 显示刷新服务器的
             */
            setResetServersAnimation() {
                this.isResetBigScreen = true;
                setTimeout(() => this.isResetBigScreen = false, 1000);
            },

            /**
             * 获取投屏的资源id
             */
            getCastedResourceId() {
                const serverIdx = this.selectedServerIdx;

                if (this.servers.length) {
                    const sourceType = this.servers[serverIdx].fShowResourceType;

                    if ((this.type === 6) || (this.userCastType === 1)) {
                        if (sourceType !== 1) {
                            return this.sources[this.selectedSourceIdx].fId;
                        } else {
                            return this.options.displayId;
                        }
                    } else {
                        return this.getBigScreenResourceId();
                    }
                }
            },

            /**
             * 设置场景投屏的参数
             */
            setSceneBigScreenParams() {
                return {
                    fSceneId: this.options.id,
                    fScreenServerId: this.servers[this.selectedServerIdx].fId
                };
            },

            /**
             * 清理查询资源的属性
             */
            clearSearchForm() {
                this.searchResourceForm.fName = '';
            },

            /**
             * 关闭弹框清空信息
             */
            closeDialog() {
                this.isDialogShown = false;
                this.resourceId = '';
                this.selectedSourceType = null;
                this.$emit('close');
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

<style lang="scss">
    .modal-style {
        .addModal {
            max-width: 1900px !important;
            min-width: 400px !important;
        }
    }

    .limit-height {
        max-width: 1800px !important;
        max-height: 1000px !important;
    }

    .small-switch {
        .el-switch__label * {
            font-size: 12px;
        }

        .el-switch__label--left {
            margin-right: 5px;
        }

        .el-switch__label--right {
            margin-left: 5px;
        }

        .el-switch__core {
            height: 15px;

            &:after {
                width: 12px;
                height: 12px;
            }
        }
    }
</style>

<style lang="scss">
    .el-pagination {
        color: #fff;
    }

    .el-pager li {
        background-color: transparent;
        //line-height: 20px!important;
    }

    .el-pager li.active {
        color: #2483FF;
    }

    .el-pagination button:disabled,.el-pagination .btn-next, .el-pagination .btn-prev {
        background-color: #303640;
        color: #fff;
    }


    .mt-15 {
        margin-top: 15px;
    }

    .mt-5 {
        margin-top: 5px;
    }

    .full-width {
        width: 100% !important;
    }

    .full-height {
        height: 100%;
    }

    .ta-center {
        text-align: center;
    }

    .dispatch-container {
        display: flex;
        justify-content: flex-start;
        width: calc(100vw - 110px);
        min-width: 400px;
        min-height: 570px;
        border-top: 1px solid #5A6271;
    }

    .resource-container {
        height: 690px;
        border-top: 1px solid #5A6271;


        header {
            height: 55px;
            /*border-top: 1px solid #5A6271;*/
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
    }

    .screen-part {
        height: 100%;
        width: 100%;
        min-width: 400px;
        margin-left: 15px;
        overflow-x: auto;

        .screen-part-container {
            min-width: 1000px;
        }

        .screens-list {
            position: relative;
            background: #1C222B;
            overflow: auto;

            .resfresh-servers {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 5px;
                right: 5px;
                width: 25px;
                height: 25px;
                font-size: 18px;
                background: #303640;
                -webkit-border-radius: 100%;
                -moz-border-radius: 100%;
                border-radius: 100%;
                cursor: pointer;

                .clicked {
                    animation: resetAnimation 1s;
                }

                @keyframes resetAnimation {
                    0% {
                        transform: rotate(0deg);
                    }

                    100% {
                        transform: rotate(360deg);
                    }
                }
            }

            .screens-inner {
                display: flex;
                justify-content: flex-start;
                width: 100%;
                height: 100%;
                min-width: 1000px;
                padding: 10px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
            }

            .server-card {
                position: relative;
                width: 170px;
                margin-right: 10px;
                padding: 25px 10px;
                background: #303640;
                cursor: pointer;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;

                .server-state {
                    position: absolute;
                    top: 0;
                    right: 0;

                    .state-mark {
                        width: 8px;
                        height: 8px;
                        margin: 10px 10px 0 0;
                        -webkit-border-radius: 50%;
                        -moz-border-radius: 50%;
                        border-radius: 50%;

                        &.off-line {
                            background: #576369;
                        }

                        &.on-line {
                            background: #16a61e;
                        }

                        &.on-display {
                            background: #a66800;
                        }
                    }
                }

                .use-state {
                    position: absolute;
                    top: 0;
                    left: 0;
                    padding: 10px;
                    font-size: 12px;

                    span {
                        line-height: 1;

                        &.can-use {
                            color: rgb(23, 185, 120);
                        }

                        &.no-use {
                            color: rgb(224, 62, 54);
                        }
                    }
                }

                .server-name {
                    font-size: 14px;
                    font-weight: bold;
                }

                &.selected {
                    border: solid 1px #2483FF;
                }

                &.inactive {
                    color: #666666;
                    background: #3d454f;
                }
            }
        }
    }

.main-list,
.screen-part {
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

    .cast-type {
        padding: 7px 0;
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

    .resource-info {
        width: 100%;
        height: 146px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .screen-container {
        width: 100%;
        height: calc(100vh - 377px);
        text-align: center;
        overflow: auto;
        border: dashed 1px white;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        .screen-inner {
            width: 100%;
            height: 100%;
            /*min-width: 1000px;
            min-height: 710px;*/
        }

        .no-bigscreen-data {
            margin-top: 200px;
            font-size: 14px;
            text-align: center;
        }

        .screen-iframe {
            width: 100%;
            height: 100%;
        }
    }
}

.main-list {
    .card:hover {
        border: 1px solid #2483FF;
    }
}

.play-groups,
.resources {
    width: 250px;
    min-width: 250px;
    height: 100%;
    z-index: 3;
    top: 60px;

    header {
        padding-top: 15px;
    }


    .resources-nav {
        display: flex;
        height: calc(100% - 62px);

        .nav-left {
            display: flex;
            flex-direction: column;
            width: 48px;
            height: calc(100vh - 200px);

            .content-icon {
                display: flex;
                justify-content: center;
                padding: 15px 0;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                cursor: pointer;

                &.active {
                    border-left: solid 5px #2483ff;
                    background: #1C222B;
                }
            }
        }

        .nav-right {
            position: relative;
            width: 100%;
            background: #1C222B;

            .nav-body {
                display: flex;
                justify-content: space-between;
                align-content: flex-start;
                flex-wrap: wrap;
                padding: 10px;
            }

            .recourse-modal {
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
                display: flex;
                width: 100%;
                height: 100%;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                transition: opacity .5s;
                background: rgba(0,0,0,.81);
                border: 1px solid #2483FF;
                z-index: 2;

                span {
                    background-color: #2483ff;
                }

                .circle {
                    width: 30px;
                    height: 30px;
                    border: 1px solid #303640;
                    border-radius: 30px;
                    background-color: #1589FB;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .source-card {
                position: relative;
                width: 90px;
                height: 70px;
                margin-bottom: 10px;
                background: #303640;

                .card-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                &.selected {
                    //border: 1px solid #2483FF;

                    .recourse-modal {
                        opacity: 1;
                    }
                }

                .card-main {
                    height: 75%;
                }

                .source-thumbnail {
                    width: 100%;
                    height: 100%;
                }

                .card-footer {
                    text-align: center;
                }
            }

            .paginator-footer {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                padding-bottom: 15px;
            }
        }
    }

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
        background-image: url('../image/index/screenList.png');
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