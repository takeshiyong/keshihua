<!-- 摄像头循环组管理页面 -->
/*
* @Modified: 武志勇、元实 2019-12-16 预览功能
*/

<template>
      <div class="data-main">
        <div class="data-grounp">
          <div class="tip">
            <span style="color: #fff;font-size: 14px">摄像头循环组</span>
            <div class="group-btn">
                <i class="el-icon-plus" @click="insertLoopCameraModal"></i>
            </div>
          </div>
          <img id="canvas-bg" src="../../image/index/1571105628(1).png" style="display: none"/>
          <!-- 摄像头循环组 -->
          <div :class="`${fourceIndex === index? 'manage-title-active':'manage-title'}`" v-for="(item,index) in loopGroundList" :key="index" @click="chooseManage(item, index)">
            <div class="loop_tip">
              <span class="tip_circle" :style="`background: ${item.fIsPublish ? '#67C23A' : '#576369'}`"></span>
              <span v-if="item.fResourcesName.length <= 6" class="title">{{ item.fResourcesName }}</span>
              <el-tooltip
                :open-delay="400"
                effect="dark"
                :content="item.fResourcesName">
                  <span v-if="item.fResourcesName.length > 6" class="title">{{truncate(item.fResourcesName)}}</span>
              </el-tooltip>
            </div>
            <span >{{item.fChannels.length}}</span>
          </div>
        </div>
        <div class="data-screenList" v-if="loopCurrentDto.fId">
          <!-- 摄像头循环组基础信息 -->
          <div class="basic-info">
            <div class="title_info">
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
                      @click="previewMult"
                      type="primary"  
                      style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-right-color: rgba(255,255,255,.5); border-left-color: rgba(255,255,255,.5)"
                      ><i class="el-icon-view" style="font-size: 12px;"></i></el-button>
                  </el-tooltip>
                  <el-tooltip :content="loopCurrentDto.fIsPublish ? '取消发布': '发布'" placement="top">
                    <el-button
                      v-if="!loopCurrentDto.fIsPublish"
                      @click="showDistribPlayGroupDialog"
                      type="primary"  
                      style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-left-color: rgba(255,255,255,.5);border-right-color: rgba(255,255,255,.5)" 
                      ><i class="dvIcon dvIcon-fabu" style="font-size: 12px"></i></el-button>
                    <el-button
                      v-else
                      type="primary"  
                      @click="cancelDistribPlayGroup"
                      style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-left-color: rgba(255,255,255,.5);border-right-color: rgba(255,255,255,.5)" 
                      ><i class="dvIcon dvIcon-quxiaofabu" style="font-size: 12px"></i></el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="top">
                  <el-button 
                    @click="editLoopModal"
                    type="primary"  
                    style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-left-color: rgba(255,255,255,.5);border-right-color: rgba(255,255,255,.5)" 
                    icon="el-icon-edit"></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                    <el-button 
                      @click="deleteLoop"
                      type="primary"  
                      style="background-color: #2483FF;color: #fff;border-color: #2483FF;border-left-color: rgba(255,255,255,.5)" 
                      icon="el-icon-delete"></el-button>
                    </el-tooltip>
                </el-button-group>
            </div>
            <hr />
            <div class="info-content">
              <div class="info" style="width: 200px">
                <p>名称</p>
                <span :title="loopCurrentDto.fResourcesName" class="text-ellipsis">{{loopCurrentDto.fResourcesName}}</span>
              </div>
              <div class="info">
                <p>状态</p>
                <div style="display: flex;align-items:center;justify-content: center;">
                  <div class="circle_push" :style="`background: ${loopCurrentDto.fIsPublish ? '#67C23A' : '#576369'}`"></div>
                  <span>{{loopCurrentDto.fIsPublish?'已发布':'未发布'}}</span>
                </div>
              </div>
              <div class="info">
                <p>循环状态</p>
                <span>{{loopCurrentDto.fIsCycle ? '开启':'关闭'}}</span>
              </div>
              <div class="info">
                <p>循环时间</p>
                <div style="display: flex;align-items:flex-end;justify-content: center;">
                  <span>{{loopCurrentDto.fCycleTime}}</span>
                  <span style="font-size: 16px;margin-left: 3px;">s</span>
                </div>
              </div>
              <div class="info">
                <p>可用状态</p>
                <span>{{loopCurrentDto.fIsAvailable?'可用':'禁用'}}</span>
              </div>
            </div>
            <div class="title_info" style="marginTop: 15px;">
              <p class="title-info">摄像头信息</p>
            </div>
            <hr style="marginTop: 20px;"/>

          </div>
          <div class="main-screen ">
            <div class="my-screen no_drag first-scren" @click="openInsertCameraModal">
              <i class="dvIcon dvIcon-add1" style="color: #fff;marginRight: 5px;transition: .2s;" ref="addIcon"></i>
              <span style="color: #fff;font-size: 12px;marginTop: 10px;transition: .2s;" ref="addText">新增摄像头</span>
            </div>
            <template v-for="(item,index) in cameraListByResource" >
              <div class="my-screen drag" 
                  :data-fid="item.fId"
                  v-if="item"
                  :key="index" 
                  style="opacity: 1; transform: scale(1);" 
                >
                  <div class="screen">
                      <div class="screen-info">
                      <img v-if="item.fState == 1" :src="`${config.PLAY_URL}/api/v1/getsnap?channel=${item.fChannel}`" style="width: 256px;height: 143.69px;"/>
                      <div v-else class="noline-tip">
                        <i class="dvIcon dvIcon-lx"></i>
                      </div>
                      <div class="screen-modal" :ref="`modal${index}`">
                          <button v-if="item.fState == 1" class="resourcev-btn" @click="showCameraPreview(item)">预览</button>
                          <button v-if="item.fState == 0" class="resourcev-btn noline-btn">离线</button>
                          <div class="showIcons">
                            <div class="touch-icon" @click="delCamera(item)">
                              <el-tooltip class="item" :open-delay="400" effect="dark" content="删除" placement="bottom">
                                <i class="edit el-icon-delete showIcon" style="margin-left: 15px;margin-right: 15px;font-size: 16px;"></i>
                              </el-tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="screen-main">
                        <div :class="item.fState == 1 ? 'online' : 'noline'">
                          <span v-if="item.fName.length <= 6" class="input-class" style="width: 120px;">{{ item.fName }}</span>
                          <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            :content="item.fName">
                              <span v-if="item.fName.length > 6" class="input-class" style="width: 120px;">{{truncate(item.fName)}}</span>
                          </el-tooltip>
                        </div>
                        <div>
                          <el-tooltip class="item" :open-delay="400" effect="dark" 
                          :content="`${item.fVideoId == loopCurrentDto.fCurrentShowVido ? '当前显示摄像头' : '设置当前显示摄像头'}`" placement="bottom">
                            <i @click="setCurrentShowChannel(item)" 
                            :class="`dvIcon ${item.fVideoId == loopCurrentDto.fCurrentShowVido ? 'dvIcon-guding2' : 'dvIcon-guding'}`" 
                            :style="`font-size: ${item.fVideoId == loopCurrentDto.fCurrentShowVido ? '14px' : '12px'};cursor: pointer`"></i>
                          </el-tooltip>
                        </div>
                      </div>
                  </div>
              </div>
            </template>
          </div>
        </div>
        <div v-else style="width: 100%;text-align: center;">
          <div class="favorite-empty">
            <img style="width: 100px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAACACAMAAAD6ZS3TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTAC+/wC7/wC7/wC7/wC9/wC7/wC8/wC6/wPE/gC8/wC7/wC7/wC8//7DAf/DAN3FLMnJP//EAMvBNJnAZv/DALfASKfAWAC6///CANzAafIAAAAYdFJOUwAe2ZfrMsOA+A1JrW9c37EpE0zteoPTv/JHy3IAAARkSURBVGje5ZvZgqsgDIZd6l7X6kz7/i96pu6SgAkCXhxuLX4hJD9BqOdptzyOc++ulsfvvxaXt8DL4D23wLkB2XOFjwY8M6fwx1toD2cGZAmAjwYkLgzww/QtaWno3we3b0BUCLignJJv14rIFXzKeDcGAMqmd5H8kS34cYjQMbkVgZsjDPoXCQtD8GdACm+QFCYMAAL3SHxyVl6VQiBwJy/0we8vSCF05/looMGJbwhe6k2XjhReSaWMGKx0eJFfS1WOFBqRUV0DRLj2KpZraHEZGFxCuQaIMXO5gmFoMRQ4E/UbNAB9K9ALY2tGdK7FfpJipYStEu04qeCx8XoBENJNi0NxdmxUS2By03B+AgpWG9UasjuQ4c0XzMi+SIE3bUCJ7ouO+DgQgsPUpklQ0jRA8YlopJldWy7AwyyR4MEUPZ6XNUeQ/e+cSvEwQB+lScUtxoBS4L8GpIbE1xfg8ZzPSjyUKD0N9EOZkp7g5XYzEl0YQrAbwikembWIJ3GqCSTgYcwWvq7EiflDwsNaiSiEAC6qBxGPSIbPljhEush40tvUEof8iIEn+FI6WzJnsfBkJSbHKg9PE0JGpnLxahVBJU4lE3y8WomZKq2Dlysxe43Sw+PzK67QhAVSF49ENyMtDeCRXSu/OruCRz4ccGvTa3jcAEZlfhUPlJizHJvACwHPK0YM4Pfpzi3FjODX16Sa/f5TfBaVSZzehp+riPhO/Nb+E3zbDXVVfarq9dM3rvFN/dm3V+8S3w4fsb1aZ/im+sBWNY7wC70euq7p+t/XbEDnBN9O9KHd7PnZxm8dX+9cvbR+4jvAdwj9r2xc3G8bP7p+R8/LbB1/ZR0/Dn449HvkO7Ms48eZb4/9Un+zyy6+HTNO7FdsT+ziuzXBD/2y2fuVZfwg+n7qF83TYhtfz+kt9CuXqLCMr8Spn/rl9+J9R86v/toA+o2FnovIx/tFrvIe7ZesetTdgA8daj7sF25FQOceP+5I25er9R7d5Ez1VnMPfhq7o1pPSXePP9Cd42d6f9zlsI8sNfEC3dM9MdTEC3RP8aHcAv5XoHu6R5Za+F6ke7pHlkx8lKyu748PYq0jSxY+Kt7PZfAv8aHGgR0LPx62+Mvgm9PPxBQDyPjpsOVb4DTo4FEDTr+PE/HL19dw8X0v+9TGO5og4beXJkvWNXJDOXc3KPjdiL6aNn5VIHiKIoTn+MN85uieA48TihCe4YV0ouGRA7tcBy+eORUZEQ8P7HAhVOE1lYzTXY6PLl89IVydkOHlV2ZY7UwIcTwIXf17T2ohxPDm7jyhQrg3AOKhbF2986YQQoB/nl64a+qqqhumARJ/CnjCkjV/WubxZUJ4wJMqhvlEoeZOASqEO3xOu7Uyf1ev+DGAKMmKJ0ucPh4RwsUgusTpOh8XQqwpJa7VCj3pGgra2Tal5SeeUgjt3Kkn1k+Gb9XqCaHDf4LiQmjwRrWGENr/C6pCCNPCPXwTQmt/PaUIYXwZ/g8RWG6u5vFIYgAAAABJRU5ErkJggg=="/>
            <p class="tips">请选择摄像头循环组</p>
          </div>
        </div>
        <DialogModal :showModal="showModal" @closeModals="closeModal('channelRef','showModal')" :modalTitle="cameraModalTitle">
          <template v-slot:container>
            <div class="modal-contents">
                <el-form ref="channelRef" label-position="top" :inline="true" :model="channelDto" :rules="channelRules" style="width: 100%">
                    <el-col :span="24">
                        <el-form-item label="循环组名称" prop="fResourcesName" style="width: 100%">
                            <el-input
                              @input="value => channelDto.fResourcesName = value.replace(/\s/i, '')"
                              :value="channelDto.fResourcesName" placeholder="请输入循环组名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="循环时间（s）" prop="fCycleTime" style="width: 100%">
                            <el-input-number v-model.trim="channelDto.fCycleTime" :min="1" :step="1" step-strictly style="width: 100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否循环" prop="fIsCycle" style="width: 100%">
                            <el-select v-model="channelDto.fIsCycle"  placeholder="请选择" style="width: 100%">
                              <el-option :label="'开启'" :value="true"></el-option>
                              <el-option :label="'关闭'" :value="false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否可用" prop="fIsAvailable" style="width: 100%">
                            <el-select v-model="channelDto.fIsAvailable" placeholder="请选择" style="width: 100%">
                              <el-option :label="'可用'" :value="true" ></el-option>
                              <el-option :label="'禁用'" :value="false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px" @click="createLoopCamera">
              保存
            </el-button>
          </template>
        </DialogModal>
        <DialogModal :showModal="insertCameraModal" @closeModals="closeModal('insertCameraRef','insertCameraModal')" modalTitle="添加摄像头">
          <template v-slot:container>
            <div class="modal_contents_camera">
                <el-row style="height: 530px;">
                  <el-col :span="7">
                    <!-- 摄像头分组 -->
                    <div class="title_camera">
                      <span>摄像头类别</span>
                    </div>
                    <div style="max-height: 520px;overflow-y: auto;">
                      <div :class="`${fourceTypeIndex === index? 'manage-titles-active':'manage-titles'}`" v-for="(item,index) in screenList" :key="index" @click="chooseTypeManage(item, index)">
                        <div class="loop_tip">
                          <span class="title">{{item.fName}}</span>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="17">
                    <!-- 摄像头列表 -->
                    <div class="title_camera">
                      <span>摄像头列表</span>
                    </div>
                    <div class="camera_list_div" v-if="cameraList.length" style="max-height: 520px;overflow-y: auto;display: flex;flex-wrap: wrap;">
                      <div class="my-screen" 
                        v-for="(item,index) in cameraList" 
                        :key="index" 
                        :style="`opacity: 1; transform: scale(1);${chooseCameraList.map(data=>(data.fId)).join(',').indexOf(item.fId) != -1 ? 'border: 1px solid #1589FB' : ''};cursor: pointer;`" 
                      >
                        <div class="screen" @click="chooseCameraItem(item)">
                            <div class="screen-info">
                              <div v-if="choosedCameraList.map(data=>(data.fVideoId)).join(',').indexOf(item.fId) != -1" class="choosed">
                                <i class="el-icon-check"></i>
                              </div>  
                              <img v-if="item.fState == 1" :src="`${config.PLAY_URL}/api/v1/getsnap?channel=${item.fRealityChannel}`" style="width: 256px;height: 143.69px;"/>
                              <div v-else class="noline-tip">
                                <i class="dvIcon dvIcon-lx"></i>
                              </div>
                              <div v-if="chooseCameraList.map(data=>(data.fId)).join(',').indexOf(item.fId) != -1" class="screen-modals" :ref="`modal${index}`">
                                <div class="circle">
                                  <i class="el-icon-check" style="color: #fff;font-size: 30px;"/>
                                </div>
                              </div>
                            </div>
                            <div class="screen-main">
                              <div :class="item.fState == 1 ? 'online' : 'noline'">
                                <span class="input-class" style="width: 120px;">{{item.fName}}</span>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div v-else style="width: 100%">
                        <span style="width: 100%;text-align:center;display: inline-block;font-size: 14px;marginTop: 20px;">暂无数据</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="choose_item">
                  <span style="display:inline-block;line-height: 30px;">选中的摄像头：</span>
                  <template v-if="chooseCameraList.length">
                    <el-tag
                      class="tags"
                      :key="index"
                      v-for="(tag,index) in chooseCameraList"
                      closable
                      :disable-transitions="false"
                      style="margin-right: 10px;"
                      @close="handleClose(tag)">
                      {{tag.fName}}
                    </el-tag>
                  </template>
                  <span v-else style="color: #c9c9c9">暂无</span>
                </el-row>
            </div>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px" @click="saveCamerasListToResource">
              保存
            </el-button>
          </template>
        </DialogModal>
        <!-- 发布类型选择弹窗 -->
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
        <!-- 12.16  武志勇修改成元实页面 -->
        <VPreview :showPreview="isPreviewShown" :type="4" :options="previewOptions" @close="handleClosePreview"></VPreview>

          <VSetBigScreenDialog
                  :shown="isBigScreenDialogShown"
                  :type="5"
                  :isTemporal="true"
                  :options="bigScreenOptions"
                  @close="closeBigScreenDialog"></VSetBigScreenDialog>
      </div>
</template> 

<script>
    import VPreview from '../../components/VPreview.vue';  //预览弹框
    import VSetBigScreenDialog from '../../components/VSetBigScreenDialog';  //预览弹框
    import DialogModal from '../../components/DialogModal.vue'
    import { CameraService, NvrService, CameraInfoService } from '@/api/camera'; // 摄像头相关api文件
    import { PlayGroupService } from '@/api/play-group'; // 请求api
    import { LoopCameraService } from '@/api/loopCamera';
    import config from '@/common/basic-configuration';
    import Sortable from 'sortablejs';
    export default {
        data(){
            return {
                isPreviewShown: false,  //控制预览按钮
                previewOptions: {},   //控制预览参数
                config, // 引入的变量要在html之内使用
                showGroupModal: false, // 新建分组
                groupModalTitle: '', // 分组标题
                groupName: '',  // 分组编辑变量
                showModal: false,  //新建控制
                cameraModalTitle: '',
                screenData: {}, // 选中的分组数据
                input: '', // 搜索内容
                fixedInputValue: '', // 修改之前的值
                nvrList: [], // nvr配置数据
                nvrPage: { // nvr配置翻页数据
                  currentPage: 1,
                  pageSize: 10,
                  total: 0
                },
                nvrInsertModal: false, // nvr新增修改窗口控制modal
                nvrFormRules: { // nvr表单校验规则
                  fIpAddress: [{ required: true, message: "请填写连接ip", trigger: "change" }],
                  fProvider: [{ required: true, message: "请选择提供商", trigger: "change" }],
                  fUserName: [{ required: true, message: "请填写用户名", trigger: "change" }],
                  fPort: [{ required: true, message: "请填写端口", trigger: "change" }],
                  fPtzPort: [{ required: true, message: "请填写云台控制端口", trigger: "change" }],
                  fPassword: [{ required: true, message: "请填写密码", trigger: "change" }]
                },
                nvrForm: { // nvr配置表单
                  fIpAddress: "", // Ip地址
                  fProvider: "", // 提供商
                  fUserName: "", // 用户名
                  fPort: "", // 端口
                  fPtzPort: "", // 云台端口
                  fPassword: "", // 密码
                  fId: "",
                },
                nvrType: 'add', // 判断框是新增还是编辑
                providerList: [ // nvr提供商
                  { fId: "DAHUA", name: "大华" },
                  { fId: "HIKVISION", name: "海康" }
                ],
                ipList: [], // 创建摄像头ip地址 数组
                cameraType: 'add', // 操作摄像头的类型 add 新增 update 编辑
                cameraPageParam: { // 摄像头列表分页参数
                    currentPage: 1, 
                    fSortType: 1, // 摄像头排序类型
                    fVideoAreaId: "", // 摄像头分类id
                    fVideoName: "", // 摄像头名称
                    pageSize: 16,
                    total: 0, // 摄像头列表查询总数
                    pageCount: 0
                },
                cameraList: [], // 摄像头列表数据
                screenList: [], // 摄像头分类数据
                loopGroundList: [], // 摄像头循环组数据列表
                loopCurrentDto: {}, // 摄像头当前选中对象
                fourceIndex: 0,  // 左侧分组选中特效
                editType: 'add', // 判断本次操作是添加摄像头循环组还是编辑摄像头循环组
                channelDto: { // 摄像头循环组数据结构
                  fCycleTime: 0, // 循环时间
                  fId: '', // 循环组id
                  fResourcesName: '', // 摄像头循环组名称
                  fIsPublish: false, // 发布状态
                  fIsCycle: false, // 是否循环
                  fIsAvailable: true, // 是否可用状态
                },
                channelRules:{ // 摄像头循环组规则校验
                  fCycleTime: [{ required: true, message: '必填项', trigger: 'blur' }],
                  fResourcesName: [{ required: true, message: "必填项", trigger: "blur" }],
                  fIsCycle: [{ required: true, message: "必填项", trigger: "blur" }],
                  fIsAvailable: [{ required: true, message: "必填项", trigger: "blur" }]
                },

                fourceTypeIndex: 0,
                insertCameraModal: false, // 控制循环组添加摄像头的弹窗
                chooseCameraList: [], // 摄像头列表
                screenData: {}, // 选中的摄像头分组对象
                dynamicTags: ['标签一', '标签二', '标签三'],
                cameraListByResource: [],
                cloneSortList: [],
                choosedCameraList: [], // 已经被选中过的摄像头

                distributionForm: { //发布资源的form数据
                    fReleaseClassifyId: '', //资源类型id
                    fResourceId: '', //播放组id
                    fResourceName: '', //播放组名称
                    fResourceType: 5, //资源类型
                    fVisitUrl: '', //访问地址
                    type: 1 //类型
                },
                distributionRules: { //验证发布资源的数据
                    fReleaseClassifyId: [
                        { required: true, message: '请选择发布类型', trigger: 'change' }
                    ]
                },
                isDistribDialogShown: false,  //是否显示选择发布类型的弹框
                distribClasses: [], //发布类型数组

                isBigScreenDialogShown: false, //是否显示投屏弹框
                castResourceType: null, //投屏类型
                bigScreenOptions: {}, //投屏参数
            }
        },
        components: {
          DialogModal,VPreview,
            VSetBigScreenDialog
        },   
        mounted() {
            this.viewNvrListData();
            this.getIpAddressList();
            this.getLoopGroup(true);
            // this.loadClassify(true);
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
                  // 刷新获取摄像头循环组数据
                  const res = await LoopCameraService.viewCamerasByResourceId(this.loopCurrentDto.fId);
                  // console.log('通过摄像头循环组id获取循环组下摄像头1111111', res);
                  if (res.success) {
                    this.cameraListByResource = res.obj.cycleVideoInfoDTOList;
                    this.loopCurrentDto = {
                      ...res.obj.tVideoResourceInfo
                    };
                    this.$nextTick(()=> this.initDrag())
                  } else {
                    this.$message.error(res.msg);
                  }
                  this.loopCurrentDto.publishClassId = this.distributionForm.fReleaseClassifyId;
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
              distribData.fResourceId = this.loopCurrentDto.fId;

              if (!isDistribute) {
                  distribData.fId = this.loopCurrentDto.fResourceGroupId;
              } else {
                  distribData.fResourceName = this.loopCurrentDto.fResourcesName;
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
           * 显示发布播放组弹框
           */
          async showDistribPlayGroupDialog() {
              if(this.loopCurrentDto.fChannels.length == 0){
                this.$message.error('请添加摄像头');
                return
              }
              this.clearDistribForm();
              this.getDistributionClasses();
              this.isDistribDialogShown = true;
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
           * 清理
           */
          clearDistribForm() {
              this.distributionForm.fReleaseClassifyId = '';
          },
          /**
           * 初始化拖拽修改顺序
           */
          initDrag() {
            const screen = document.querySelector('.main-screen')
            if (!screen) {
                return;
            }
            const _this = this
            Sortable.create(screen, {
                filter: '.no_drag',
                draggable: '.drag',
                onEnd({ newIndex, oldIndex }) {
                    // 判断是否交换了位置
                    if (newIndex === oldIndex) {
                        return;
                    }
                    // 修改摄像头顺序
                    _this.updateCameraSort();
                }
            });
          },
          /**
             * 关闭预览弹框
             */
            handleClosePreview() {
                this.isPreviewShown = false;
            },
          /**
           * 修改摄像头循环组中的摄像头的播放排序
           */
          async updateCameraSort() {
            const cameraList = document.querySelectorAll('.main-screen .drag');
            let arr = [];
            // 从dom中获取fid的顺序来决定顺序
            for (let item of cameraList) {
              arr.push(item.getAttribute('data-fid'));
            }
            const res = await LoopCameraService.updateCameraSortByResource({
              list: arr.map((data,index)=>({fId: data, fSort: index}))
            });
            if (res.success) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          },
          /**
           * 设置当前循环组显示摄像头
           * @param {Object} item -- 摄像头数据对象
           */
          async setCurrentShowChannel(item) {
            if (item.fVideoId == this.loopCurrentDto.fCurrentShowVido) {
              return;
            }
            const res = await LoopCameraService.setCurrentCameraByLoop({
              fVideoResourcesId: this.loopCurrentDto.fId,
              fVideoId: item.fVideoId
            });
            if (res.success) {
              this.$message.success(res.msg);
              this.getLoopGroup();
              this.getCamerasByResources();
            } else {
              this.$message.error(res.msg);
            }
          },
          /**
           * 将多个摄像头保存到资源中
           */
          async saveCamerasListToResource() {
            if (!this.chooseCameraList.length) {
              this.$message.error('请选择要添加的摄像头');
              return;
            }
            const res = await LoopCameraService.insertCamerasToResources({
              fVideoResourcesId: this.loopCurrentDto.fId,
              fVideoIds: this.chooseCameraList.map(data=>(data.fId))
            });
            if (res.success) {
              this.$message.success(res.msg);
              this.chooseCameraList = [];
              this.insertCameraModal = false;
              this.getCamerasByResources();
              this.getLoopGroup();
            } else {
              this.$message.error(res.msg);
            }
          },
          /**
           * 通过摄像头循环组id获取循环组下摄像头
           */
          async getCamerasByResources() {
            const res = await LoopCameraService.viewCamerasByResourceId(this.loopCurrentDto.fId);
            // console.log('通过摄像头循环组id获取循环组下摄像头', res);
            if (res.success) {
              this.cameraListByResource = res.obj.cycleVideoInfoDTOList;
              this.$nextTick(()=> this.initDrag())
            } else {
              this.$message.error(res.msg);
            }
          },
          /**
           * 点击标签关闭按钮 
           * @param {Object} tag -- 点击的标签
           */
          handleClose(tag) {
            for (let [key, obj] of this.chooseCameraList.entries()) {
              if (obj.fId == tag.fId) {
                this.chooseCameraList.splice(key, 1);
                return;
              }
            }
            this.$forceUpdate();
          },
          /**
           * 配置选中状态
           * @param {Object} row -- 点击选中对象
           */
          chooseCameraItem(row) {
            for (let [key, obj] of this.chooseCameraList.entries()) {
              if (obj.fId == row.fId) {
                this.chooseCameraList.splice(key, 1);
                return;
              }
            }
            this.chooseCameraList.push(row);
            this.$forceUpdate();
          },
          /**
           * 选中摄像头分组
           * @param {Object} row -- 选中的摄像头分组
           */
          chooseType(row) {
            // console.log('选中摄像头分组', row);
          },  
          /**
           * 打开添加摄像头的弹窗
           */
          openInsertCameraModal() {
            this.insertCameraModal = true;
            this.choosedCameraList = this.cameraListByResource;
            // console.log(this.choosedCameraList, this.cameraList);
            // 获取摄像头分类数据
            this.loadClassify(true);
          },
          /**
           * 打开摄像头循环组编辑页面
           */
          editLoopModal() {
            this.showModal = true
            this.cameraModalTitle = '编辑摄像头循环组';
            this.editType = 'update';
            this.channelDto = {
              ...this.loopCurrentDto,
            };
          },
          /**
           * 创建循环组信息
           */
          createLoopCamera() {
            this.$refs.channelRef.validate((valid) => {
              if (valid) {
                if (this.editType == 'add') {
                  this.insertLoopCamera();
                } else if (this.editType == 'update') {
                  this.updateLoopCamera();
                }
                this.closeModal('channelRef', 'showModal');
              } else {
                this.$message.error('必填项输入为空或错误！');
              }
            });
          },
          /**
           * 编辑摄像头循环组信息
           */
          async updateLoopCamera() {
            const res = await LoopCameraService.updateLoopCamera(this.channelDto);
            if (res.success) {
              this.$message.success(res.msg);
              this.closeModal('channelRef', 'showModal');
              // 更新当前展示数据
              this.loopCurrentDto = {
                ...this.loopCurrentDto,
                ...this.channelDto
              }
              // 获取最新循环组列表
              this.getLoopGroup();
            } else {
              this.$message.error(res.msg);
            }

          },
          /**
             * 通过接口添加循环组数据
             */
            async insertLoopCamera() {
              const res = await LoopCameraService.insertLoopCamera(this.channelDto);
              // console.log('通过接口添加循环组数据', res);
              if (res.success) {
                this.$message.success(res.msg);
                this.closeModal('channelRef', 'showModal');
                this.getLoopGroup();
              } else {  
                this.$message.error(res.msg);
              }
            },
          /**
           * 打开新增摄像头循环组弹窗
           */
          insertLoopCameraModal() {
            this.showModal = true
            this.cameraModalTitle = '新增摄像头循环组';
            this.editType = 'add';
            this.channelDto = {
              fCycleTime: 0, // 循环时间
              fId: '', // 循环组id
              fResourcesName: '', // 摄像头循环组名称
              fIsPublish: false, // 发布状态
              fIsCycle: false, // 是否循环
              fIsAvailable: true, // 是否可用状态
            };
          },
          /**
           * 删除摄像头循环组
           */
          deleteLoop() {
           this.$confirm(`${this.loopCurrentDto.fResourcesName} 删除后无法恢复，确认删除？`, 'warning', ()=>{}, async ()=>{
                const res = await LoopCameraService.deleteLoopCamera(this.loopCurrentDto.fId);
                if (res.success) {
                  this.$message.success(res.msg);
                  this.getLoopGroup(true);
                } else {
                  this.$message.error(res.msg);
                }
              });
          },
          /**
           * 获取摄像头循环组数据
           * @param {Boolean} isFirst -- 如果是第一加载则需要获取第一个数据去获取详情数据
           */
          async getLoopGroup(isFirst) {
            const res = await LoopCameraService.viewAllLoopCamera();
            // console.log('获取摄像头循环组数据', res);
            if (res.success) {
              this.loopGroundList = res.obj;
              if (isFirst) {
                if (res.obj.length) {
                  this.loopCurrentDto = res.obj[0];
                  this.fourceIndex = 0;
                  this.getCamerasByResources();
                }
              } else {
                res.obj.map((data, index)=>{
                  if (data.fId == this.loopCurrentDto.fId) {
                    this.fourceIndex = index;
                    this.loopCurrentDto = data;
                  }
                })
              }
            } else {
              this.$message.error(res.msg);
            }
          },
          /**
           * 预览单个摄像头当前画面
           * @param {Object}  -- item 点击的单个摄像头对象
           */
          showCameraPreview(item) {
            this.isPreviewShown = true;
            this.previewOptions= {
                cameraType: 1,
                id: item.fChannel,
                name: item.fName
            }
            // this.$cameraPreview({
            //   cameraType: 1,
            //   id: item.fChannel
            // })
          },
          /**
           * 预览循环组 
           */
          previewMult() {
            if(this.loopCurrentDto.fChannels.length == 0){
                this.$message.error('请添加摄像头');
                return
            }
            this.isPreviewShown = true;
            this.previewOptions= {
                cameraType: 2,
                id: this.loopCurrentDto.fId
            }
          },  
          /**
           * 翻页获取摄像头
           */
          pageCurrentChange(page) {
            this.cameraPageParam = {
              ...this.cameraPageParam,
              currentPage: page
            };
            this.getCameraInfo();
          },
          /**
           * 根据摄像头名称查询数据
           */
          cameraSearch() {
            this.cameraPageParam = {
              ...this.cameraPageParam,
              fVideoName: this.cameraSearchName,
              currentPage: 1
            };
            this.getCameraInfo();
          },
          /**
           * 切换摄像头列表排序顺序
           * @param {Number} fSort - 排序类型 1.按名称排序 2.按创建时间排序
           */
          toggleCameraInfoListSort(fSort) {
            // 如果没有变化则不请求接口
            if (this.cameraPageParam.fSortType == fSort) return; 
            this.cameraPageParam = {
              ...this.cameraPageParam,
              fSortType:fSort
            }
            this.getCameraInfo()
          },
          /**
           * 通过分类id获取摄像头列表分页参数
           */
          async getCameraInfo() {
            const res = await CameraInfoService.viewCameraPageByClassify({
              ...this.cameraPageParam,
              fVideoAreaId: this.screenData.fId,
            });
            if (res.success) {
              // console.log('通过分类id获取摄像头列表', res);
              this.cameraPageParam.total = res.obj.itemTotal;
              this.cameraPageParam.pageCount = res.obj.pageCount;
              this.cameraList = res.obj.items;
            } else {
              this.$message.error(res.msg);
            }
          },
          /**
           * 通过接口获取所有Ip配置
           */
          async getIpAddressList() {
            const res = await NvrService.viewAllNvr();
            if (res.success) {
              // console.log('通过接口获取所有Ip配置', res);
              this.ipList = res.obj;
            }
          },
          /**
           * 删除nvr配置
           * @param {Object} item - nvr配置列表中一行的数据
           */
          deleteInsertNvrModal(item) {
            this.$boxMsg(`删除将不可恢复`, 'warning',()=>{}, this.deleteNvrAjax.bind(this, item))
          },
          /**
           * 删除nvr配置
           * @param {Object} item - nvr配置列表中一行的数据
           */
          async deleteNvrAjax(item) {
            const res = await NvrService.deleteNvr(item.fId);
            if (res.success) {
              this.$message.success(res.msg);
              this.viewNvrListData();
            } else {
              this.$message.error(res.msg);
            }
          },
          /**
           * 新增，编辑nvr配置
           */
          updateNvrData() {
            this.$refs['accountForm'].validate((valid) => {
              if (valid) {
                  this.updateNvrDataAjax();
              } else {
                this.$message.error('必填项输入为空或错误！')
              }
            });
          },
          /**
           * nvr配置新增修改接口对接
           */
          async updateNvrDataAjax() {
            let res = null;
            if (this.nvrType == 'add') {
              res = await NvrService.insertNvr(this.nvrForm);
            } else {
              res = await NvrService.updateNvr(this.nvrForm);
            }
            if (res.success) {
              this.closeInsertNvrModal();
              if (this.nvrType == 'add') {
                this.nvrPage = {
                  ...this.nvrPage,
                  currentPage: 1
                };
              }
              this.viewNvrListData();
            } else {
              this.$message.error(res.msg);
            }
          },
          /**
           * 打开nvr配置新建窗口
           * @param {String} type - nvr的操作状态 update 编辑, add 新增
           * @param {Object} item - nvr配置列表中一行的数据
           */
          openInsertNvrModal(type, item) {
            this.nvrInsertModal = true;
            this.nvrType = type;
            if (type=='update') {
              this.nvrForm = item;
            } else {
              this.nvrForm = {
                fIpAddress: "", // Ip地址
                fProvider: "", // 提供商
                fUserName: "", // 用户名
                fPort: "", // 端口
                fPtzPort: "", // 云台端口
                fPassword: "", // 密码
                fId: "",
                fVideoAreaId: ''
              }
            }
          },
          /**
           * 关闭nvr配置新建窗口
           */
          closeInsertNvrModal() {
            if (this.$refs.accountForm) 
            this.$refs.accountForm.clearValidate();
            this.nvrInsertModal = false;
            this.$nextTick(() => {
              this.nvrForm = { // nvr配置表单
                fIpAddress: "", // Ip地址
                fProvider: "", // 提供商
                fUserName: "", // 用户名
                fPort: "", // 端口
                fPtzPort: "", // 云台端口
                fPassword: "", // 密码
                fId: "",
                fVideoAreaId: ''
              };
            })
          },
          /**
           * 打开nvr配置页面
           */
          openNvrModal() {
            this.nvrModal = true;
            this.nvrPage = {
              ...this.nvrPage,
              currentPage: 1
            };
            this.viewNvrListData();
          },
          /**
           * 关闭nvr配置页面
           */
          closeNvrModal() {
            if (this.$refs.accountForm) 
            this.$refs.accountForm.clearValidate();
            this.nvrModal = false;
            this.nvrInsertModal = false;
            this.nvrForm = { // nvr配置表单
              fIpAddress: "", // Ip地址
              fProvider: "", // 提供商
              fUserName: "", // 用户名
              fPort: "", // 端口
              fPtzPort: "", // 云台端口
              fPassword: "", // 密码
              fId: "",
              fVideoAreaId: ''
            };
          },
          /**
           * 获取nvr配置数据
           */
          async viewNvrListData() {
            const res = await NvrService.viewNvrByPage({
              currentPage: this.nvrPage.currentPage,
              pageSize: this.nvrPage.pageSize
            });
            if (res.success) {
              // console.log('获取nvr配置数据', res);
              this.nvrPage = {
                ...this.nvrPage,
                total: res.obj.itemTotal
              };
              this.nvrList = res.obj.items;
            } else {
              this.$message.error(res.msg);
            }
          },
          /**
           * 数据翻页
           * @param {String} page - nvr数组翻页改变的当前页
           */
          changePageByNvr(page) {
            this.nvrPage = {
              ...this.nvrPage,
              currentPage: page
            };
            this.viewNvrListData();
          },
            // 发布资源
            pushResource(item) {
              item.isPush = !item.isPush;
              this.screenList = [...this.screenList];
              
            },
            /**
             * 删除摄像头循环组中的摄像头
             */
            delCamera(item) {
              this.$confirm(`${item.fName} 将从摄像头循环组中删除，确认删除？`, 'warning', ()=>{}, async ()=>{
                const res = await LoopCameraService.deleteCameraByResourceId(item.fId);
                if (res.success) {
                  this.getCamerasByResources();
                  this.getLoopGroup();
                  this.$message.success(res.msg);
                } else {
                  this.$message.error(res.msg);
                }
              });
            },
            // 编辑摄像头
            cameraEdit(item) {
              this.channelDto = item;
              this.showModal = true;
              this.cameraType = 'update';
              this.cameraModalTitle = '修改摄像头';
            },
            fixedValue(event) {
              this.fixedInputValue = event.target.value;
            },
            // 修改摄像头名称
            async changChannelName(event, item) {
              let newVal = event.target.value;
              if (newVal == this.fixedInputValue) {
                return;
              }
              const res = await CameraInfoService.updateCameraInfo({
                ...item,
                fName: newVal
              });
              if (res.success) {
                this.$message.success('修改成功');
              } else {
                // 修改失败还原原值
                event.target.value = this.fixedInputValue;
                item.fName = this.fixedInputValue;
                this.$message.error(res.msg);
              }
            },
            // 关闭弹框清空信息
            closeModal(formName, modalProps) {
              this[modalProps] = false;
              if (this.$refs[formName]) 
              this.$refs[formName].clearValidate();
            },
            // 创建摄像头信息
            createCamera() {
              this.$refs.channelRef.validate((valid) => {
                if (valid) {
                  this.closeModal('channelRef', 'showModal');
                  if (this.cameraType == 'add') {
                    this.insertCameraAjax();
                  } else if (this.cameraType == 'update') {
                    this.updateCameraAjax();
                  }
                } else {
                  this.$errorMsg('必填项输入为空或错误！');
                }
              });
            },
            /**
             * 接口对应创建摄像头信息
             */
            async insertCameraAjax() {
              const res = await CameraInfoService.insertCameraInfo(this.channelDto);
              // console.log('创建摄像头信息', res);
              if (res.success) {
                this.$message.success(res.msg);
                this.cameraPageParam = {
                  ...this.cameraPageParam,
                  currentPage: 1
                }
                this.getCameraInfo();
              } else {
                this.$message.error(res.msg);
              }
            },
            /**
             * 接口对应编辑摄像头信息
             */
            async updateCameraAjax() {
              const res = await CameraInfoService.updateCameraInfo(this.channelDto);
              // console.log('编辑摄像头信息', res);
              if (res.success) {
                this.$message.success(res.msg);
                this.getCameraInfo();
              } else {
                this.$message.error(res.msg);
              }
            },
            /**
             * 新增或者编辑摄像头分组
             */
            saveGroup() {
              if (!this.groupName || (this.groupName && this.groupName.trim().length == 0)) {
                this.$message.error('请输入分组名称');
                return;
              }
              if (this.groupModalTitle=='编辑摄像头分组') {
                this.updateCameraClassify();
              } else if (this.groupModalTitle=='新增摄像头分组') {
                this.insertCameraClassify();
              }
            },
            /**
             * 获取摄像头分类列表数据
             * @param {Boolean} isFirst - 是否第一次请求查询接口
             */
            async loadClassify(isFirst) {
              const res = await CameraService.viewCameraClassify({fName:' '});
              if (res.success) {
                // console.log('获取摄像头分类列表数据', res);
                this.screenList = res.obj;
                // 判断是不是页面第一次请求接口
                if (isFirst) {
                  if (this.screenList.length > 0) {
                    this.screenData = this.screenList[0];
                    this.cameraPageParam = {
                      ...this.cameraPageParam,
                      fVideoAreaId: this.screenList[0].fId
                    };
                    this.fourceTypeIndex = 0;
                    this.getCameraInfo();
                  }
                  // 获取第一分组的摄像头列表
                }
              } else {
                this.$message.error(res.msg);
              }
            },
            /**
             * 调用接口编辑摄像头分组数据
             */
            async updateCameraClassify() {
              const res = await CameraService.updateCameraClassify({
                fId: this.screenData.fId,
                fName: this.groupName.trim()
              });
              if (res.success) {
                this.loadClassify();
                this.$message.success(res.msg);
                this.showGroupModal = false;
                this.screenData = {
                  ...this.screenData,
                  fName: this.groupName.trim()
                }
              } else {
                this.$message.error(res.msg);
              }
            },
            /**
             * 调用接口新增摄像头分组数据
             */
            async insertCameraClassify() {
              const res = await CameraService.insertCameraClassify({
                fName: this.groupName.trim()
              });
              if (res.success) {
                this.loadClassify();
                this.$message.success(res.msg);
                this.showGroupModal = false;
              } else {
                this.$message.error(res.msg);
              }
            },  
            // 打开编辑分组模态框
            editGroup() {
              this.groupModalTitle='编辑摄像头分组';
              this.showGroupModal = true;
              this.groupName = this.screenData.fName;
            },
            // 打开删除分组模态框
            delGroup() {
              this.$confirm(`${this.screenData.fName} 删除后无法恢复，确认删除？`, 'warning', ()=>{}, this.deleteCamera);
            },
            /**
             * 删除摄像头接口
             */
            async deleteCamera() {
              const res = await CameraService.deleteCameraClassify(this.screenData.fId);
              if (res.success) {
                this.$message.success(res.msg);
                this.loadClassify(true);
              } else {
                this.$message.error(res.msg);
              }
            },
            /**
             * 点击切换摄像头循环组
             * @param {Object} item -- 选中的摄像头循环组数据对象
             * @param {Number} index -- 选中的摄像头循环组的下标
             */
            chooseManage(item, index) {
              this.fourceIndex = index;
              this.loopCurrentDto = item;
              // this.getCameraInfo();
              this.getCamerasByResources();
            },
            /**
             * 点击切换摄像头分类组
             * @param {Object} item -- 选中的摄像头数据对象
             * @param {Number} index -- 选中的摄像头的下标
             */
            chooseTypeManage(item, index) {
              this.fourceTypeIndex = index;
              this.screenData = item;
              this.getCameraInfo();
            },
            // 点击预览
            review(item) {
                this.$showVideo();
            },
            //鼠标点击 出现弹框
            addBigDemo(){
              this.showModal = true;
              this.cameraType = 'add';
              this.cameraModalTitle = '新增摄像头';
              this.channelDto = {
                fName: '',  // 名称
                fIp: '',  // ip
                fRealityChannel: '', // 真实通道号
                fStreamType: '', // 码流
                fEnable: true, // 是否启用
                fPtzControl: true, // 是否控制
                fVideoAreaId: this.screenData.fId,
                fId: ''
              };
            },

            /**
             * 投屏显示组
             * @param {Object} item --- 显示组对象
             * @author 元实
             */
            handleCastToBigScreen() {
                if(this.loopCurrentDto.fChannels.length == 0){
                  this.$message.error('请添加摄像头');
                  return
                }
                this.setCastOptions(this.loopCurrentDto);
                this.isBigScreenDialogShown = true;
            },

            /**
             * 设置投屏参数
             * @param {Object} item --- 显示组对象
             * @author 元实
             */
            setCastOptions(item) {
                this.bigScreenOptions = {
                    cameraType: 2,
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
  .text-ellipsis{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .page-contral {
    .el-pagination {
        color: #fff;
    }
    .el-pager li {
        background-color: #010305;
        line-height: 20px!important;
    }
    .el-pager li.active {
        color: #2483FF;
    }
    .el-pagination button:disabled,.el-pagination .btn-next, .el-pagination .btn-prev {
        background-color: #010305;
        color: #fff;
    }
  }
  .input-class {
    input {
      border: 0!important;
      caret-color: #BCC9D4;
      background: transparent;
    }
  }
  .showIcons {
    .touch-icon {
      display: inline-block;
      cursor: pointer;
      .edit {
        color: #fff;
      }
      .dvIcon {
        transition: color 0.4s;
      }
    }
    .touch-icon:hover {
      .dvIcon {
        color: #2483ff!important;
      }
    }
  }
  .dropdown-tiem {
    cursor: pointer;
  }
  .dropdown-tiem:hover {
      span,i {
        color: #2483FF!important;
      }
  }
  .modal_contents_camera {
        .search-header {
            background-color: #1C222B!important;
        }
        .el-table__empty-block {
          background-color: #434b55;
          .el-table__empty-text {
            color: #fff;
          }
        }
        .el-table__body tr.current-row>td {
            background-color: #2483ff!important;
        }
        .el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
            background-color: #2483ff!important;    
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
  .tags {
      .el-tag__close{
        color: #fff!important;
      }
  }

  .smaller-icon {
      font-size: 12px;
  }
</style>
<style lang="scss" scoped>

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
  .choose_item {
    width: 900px;
    background: #121515;
    height: 70px;
    border-radius: 2px;
    padding: 8px;
    .tags {
      background-color: #393e46;
      border-color: #393e46;
      color: #fff;
      .el-tag__close{
        color: #fff!important;
      }
    }
  }
  .modal-contents {
    width: 400px;
  }
  .modal_contents_camera {
    width: 900px;
    height: 600px;
    .title_camera {
      background-color: #1C222B;
      padding: 5px;
      height: 30px;
      box-sizing: border-box;
      span {
        font-size: 12px;
        color: #C0C4CC;
        line-height: 23px;
        font-weight: bold;
      }
    }
  }
  .basic-info {
    padding: 18px 4px 8px 4px;


    .title_info {
      display: flex;
      justify-content: space-between;
      margin-right: 30px;
    }
    hr {
      border: 0px;
      border-top: 1px solid #27343E;
      margin-top: 6px;
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
    .loop_tip {
      display: flex;
      align-items: center;
      justify-content: center;
      .tip_circle {
        width: 8px;
        height: 8px;
        background: #576369;
        border-radius: 50px;
        margin-right: 5px;
      }
    }
    .fullpage-div {
      position: fixed;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,81);
    }
    .noline-tip {
      width: 256px;
      height: 143.69px;
      display: flex;
      justify-content: center;
      align-items: center;
      .dvIcon-lx {
        font-size: 50px;
        color: #576369;
      }
    }
    .noline-btn {
      background: #1C222B!important;
      color: rgba(225,225,225,0.8)!important;
      cursor: default!important;
    }
    .danger-btn {
      background: #F56C6C!important;
      color: rgba(225,225,225,1)!important;
      cursor: pointer!important;
    }
    .screen {
      position: relative;
      .online-status {
        width: 25px;
        height: 25px;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 121;
        .status {
          width: 8px;
          height: 8px;
          border-radius: 100px;
          background: rgba(225,225,225, 0.9);
        }
      }
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

    .favorite-empty {
        margin: 160px auto;
        .tips {
            color: #fff;
            margin-top: 15px;
        }
    }
    .manage-titles {
        padding-left: 10px;
        transition: color .2s;
        cursor: pointer;
        line-height: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 10px;
        color: #fff;
        .title {
          transition: color .2s;
        }
      }
      .manage-titless:hover {
        .title {
          color: #2483ff;
        }
      }
      .manage-titles-active {
        background-image: url('../../image/index/screenList.png');
        background-size: 100% 100%;
        padding-left: 10px;
        transition: color .2s;
        cursor: pointer;
        line-height: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 10px;
        color: #fff;
      
      }
    // 页面主题部分
  .data-main {
    display: flex;
    width: 100%;
    margin-bottom: 200px;
    .data-grounp {
      width: 240px;
      height: calc(100vh - 290px);
      flex-direction: column;
      position: sticky;
      z-index: 3;
      top: 60px;
      .tip {
        padding-left: 24px;
        height: 56px;
        border-bottom: 1px solid #27343e;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .manage-title {
        padding-left: 40px;
        transition: color .2s;
        cursor: pointer;
        line-height: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 30px;
        color: #fff;
        .title {
          transition: color .2s;
        }
      }
      .manage-title:hover {
        .title {
          color: #2483ff;
        }
      }
      .manage-title-active {
        background-image: url('../../image/index/screenList.png');
        background-size: 100% 100%;
        padding-left: 40px;
        transition: color .2s;
        cursor: pointer;
        line-height: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 30px;
        color: #fff;
      
      }
    }
    .data-screenList {
      flex: 1;
      .project-header {
        top: 60px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #434b55;
        height: 56px;
        background: #010305;
        z-index: 1;
        min-width: 1024px;
        margin-left: 7px;
        position: sticky;
        padding-right: 20px;
        .header-right {
            display: inline-block;
            align-items: center;
            display: flex;
            flex-direction: row;
            margin-right: 15px;
            .search {
                background: #1d262e;
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
          display: inline-block;
          width: 300px;
          display: flex;
          align-items: center;
          height: 56px;
          h2 {
            color: #fff;
            padding: 0 10px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        
      }
      
    }
  }
  .main-screen,.camera_list_div {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        user-select: none;
        padding-bottom: 10px;
        padding-left: 4px;
        .first-scren{
          display: block;
          display: flex;
          justify-content: center;
          background-image: linear-gradient(-90deg,rgba(0,161,255,.39) 0,rgba(0,137,255,.19) 100%);
          text-align: center;
          cursor: pointer;
          i {
              transition: all 0.7s;
          }
          span {
              transition: all 0.7s;
          }
        }
        .first-scren:hover {
            i {
                font-size: 20px!important;
            }
            span {
                font-size: 14px!important;
            }
        }
        .my-screen {
          box-sizing: border-box;
          margin: 16px;
          display: flex;
          flex-direction: column;
          width: 258px;
          height: 180px;
          border: 1px solid #3a4659;
          transition: .2s;
          .screen-modal {
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
            .showIcons {
                display: block;
                .showIcon {
                color: #fff;
                display: inline-block;
              }
            }
          }
        }
        .my-screen:hover {
          border: 1px solid #2483FF;
          .screen-modal {
              opacity: 1!important;
          }
        }
        .screen-modals {
          position: absolute;
          opacity: 1;
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          transition: opacity .5s;
          background: rgba(0,0,0,.81);
          z-index: 2;
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
          span {
            background-color: #2483ff;
          }
          .showIcons {
              display: block;
              .showIcon {
              color: #fff;
              display: inline-block;
            }
          }
        }
        .screen-info {
          width: 100%;
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
      }
  
  .resourcev-btn {
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
  .currentState {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    display: inline-block;
    background: #576369;
    margin-right: 5px;
  }
  .modal-content {
        padding-left: 20px;
        padding-right: 20px;
        margin: 0 -20px;
        padding-bottom: 10px;
        overflow-y: auto;
        // min-height: 50px;
        // max-height: 500px;
        .content-input{
            display: block;
            line-height: 30px;
            background: #1c222b;
            color: #fff;
            font-size: 12px;
            width: 100%;
            padding-left: 5px;
            // padding-right: 8px;
            margin-top: 8px;
            height: 30px;
            border: 0
        }
    }
  .content-number {
        line-height: 30px;
        background: #1c222b;
        color: #fff;
        font-size: 12px;
        width: 50px;
        padding-left: 5px;
        height: 30px;
        border: 0
  }
  .screen-main > div {
    display: flex;
    justify-content: center;
    align-items: center;
    
  }
  
</style>