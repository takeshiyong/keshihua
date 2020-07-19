<!-- 摄像头管理 -->
/*
* @Modified: 武志勇、元实 2019-12-16 预览功能
*/

<template>
      <div class="data-main">
        <div class="data-grounp">
          <div class="tip">
            <span style="color: #fff;font-size: 14px">摄像头类别</span>
            <div class="group-btn">
                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="新建摄像头类别">
                        <i class="el-icon-plus" @click="showGroupModal=true;groupModalTitle='新增摄像头类别';groupName=''"></i>
                    </el-tooltip>

                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="修改摄像头类别">
                        <i v-show="fourceIndex!==''" class="el-icon-edit" @click="editGroup()"></i>
                    </el-tooltip>

                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="删除摄像头类别">
                        <i v-show="fourceIndex!==''" class="el-icon-delete" @click="delGroup()"></i>
                    </el-tooltip>
            </div>
          </div>
          <img id="canvas-bg" src="../../image/index/1571105628(1).png" style="display: none"/>
          <div :class="`${fourceIndex === index? 'manage-title-active':'manage-title'}`" v-for="(item,index) in screenList" :key="index" @click="chooseManage(item, index)">
            <span v-if="item.fName&&item.fName.length <= 6" class="title">{{ item.fName }}</span>
            <el-tooltip
              :open-delay="400"
              effect="dark"
              :content="item.fName">
                <span v-if="item.fName&&item.fName.length > 6" class="title">{{truncate(item.fName)}}</span>
            </el-tooltip>
            
            <span >{{item.fNum}}</span>
          </div>
        </div>
        <div class="data-screenList" >
          <div class="project-header">
              <div class="header-left">
                <h2 v-if="screenData.fName&&screenData.fName.length <= 6">{{screenData.fName}}</h2>
                <el-tooltip
                  :open-delay="400"
                  effect="dark"
                  :content="screenData.fName">
                    <h2 v-if="screenData.fName&&screenData.fName.length > 6">{{truncate(screenData.fName)}}</h2>
                </el-tooltip>
                
                <span style="color: #2483ff;font-size: 14px">{{screenData.fNum}}</span>
                <span style="color: #fff">个</span>
              </div>
              <div class="header-right">
                <el-button style="marginRight: 10px;border: 1px solid #2483FF;background-color: #2483FF;color: #fff;" @click="refreshNvrModal">
                  重启NVR
                </el-button>
                <el-button style="marginRight: 15px;border: 1px solid #2483FF;background-color: #2483FF;color: #fff;" @click="openNvrModal">
                  NVR配置
                </el-button>
                <div class="search">
                  <el-input v-model="cameraSearchName" placeholder="请输入内容" class="right-input" clearable>
                    <i slot="suffix" class="el-icon-search search-btn" style="color: #bcc9d4;line-height: 34px;" @click="cameraSearch"></i>
                  </el-input>
                </div>
                <div class="dropdown-tiem" style="display: inline-block;margin-left: 20px">
                  <el-dropdown @command="toggleCameraInfoListSort">                                                                              
                    <span style="color: #bcc9d4;font-size: 12px">{{cameraPageParam.fSortType == 1 ? '按名称排序' : '按创建时间排序'}}</span>
                    <i class="el-icon-caret-bottom" style="color: #bcc9d4"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                            v-for="item in recourcesOrder.dropdownItemsShow"
                            :command="item.id"
                            :key="item.id">
                          {{ item.name }}
                      </el-dropdown-item>
                      <!-- <el-dropdown-item command="1">按名称排序</el-dropdown-item>
                      <el-dropdown-item command="2">按创建时间排序</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
          </div>
          <div class="main-screen" v-if="screenData.fId">
            <div class="my-screen first-scren" @click="addBigDemo">
              <i class="dvIcon dvIcon-add1" style="color: #fff;marginRight: 5px;transition: .2s;" ref="addIcon"></i>
              <span style="color: #fff;font-size: 12px;marginTop: 10px;transition: .2s;" ref="addText">新增摄像头</span>
            </div>
            
            <div  class="my-screen" 
                v-for="(item,index) in cameraList" 
                :key="index" 
                style="opacity: 1; transform: scale(1);" 
              >
                <div class="screen">
                    <div v-if="item.fState == 1" class="recourse-typeTipe" style="color: #0c9463">
                      在   线
                    </div>
                    <div v-else class="recourse-typeTipe" style="color: #9d0b0b">
                      离   线
                    </div>
                    <div class="screen-info">
                      <img v-if="item.fState == 1" :src="`${config.PLAY_URL}/api/v1/getsnap?channel=${item.fRealityChannel}`" style="width: 256px;height: 143.69px;"/>
                      <div v-else class="noline-tip">
                        <i class="dvIcon dvIcon-lx"></i>
                      </div>
                      <div class="screen-modal" :ref="`modal${index}`">
                          <button v-if="item.fState == 1&&item.fEnable == true" class="resourcev-btn" @click="showCameraPreview(item)">预览</button>
                          <button v-if="item.fState == 0&&item.fEnable == true" class="resourcev-btn noline-btn">离线</button>
                          <button v-if="item.fEnable == false" class="resourcev-btn noline-btn">禁用</button>
                          <div class="showIcons">
                              <div class="touch-icon" v-if="item.fEnable == true" @click="pushResource(item)">
                                <el-tooltip class="item" :open-delay="400" effect="dark" :content="item.fIsPublish ? '取消发布' : '发布'" placement="bottom">
                                  <i :class="`dvIcon ${item.fIsPublish ? 'dvIcon-quxiaofabu' : 'dvIcon-fabu'} showIcon`"></i>
                                </el-tooltip>
                              </div>
                              <div class="touch-icon" @click="handleCastToBigScreen(item)">
                                  <el-tooltip class="item" :open-delay="400" content="投屏" effect="dark" placement="bottom">
                                      <i class="dvIcon dvIcon-touping showIcon ml-15"></i>
                                  </el-tooltip>
                              </div>
                              <div class="touch-icon" @click="delCamera(item)">
                                <el-tooltip class="item" :open-delay="400" effect="dark" content="删除" placement="bottom">
                                  <i class="edit el-icon-delete showIcon" style="margin-left: 15px;margin-right: 15px;font-size: 16px;"></i>
                                </el-tooltip>
                              </div>
                              <div class="touch-icon" @click="cameraEdit(item)">
                                <el-tooltip class="item" :open-delay="400" effect="dark" content="编辑" placement="bottom">
                                  <i class="edit el-icon-edit" style="font-size: 16px;"></i>
                                </el-tooltip>
                              </div>
                          </div>
                      </div>
                    </div>
                    <div class="screen-main">
                      <div :class="item.fState == 1 ? 'online' : 'noline'">
                        <i class="el-icon-edit" style="margin-top: -1px;"></i>
                        <el-input
                          @input="value => item.fName = value.replace(/\s/i, '')"
                          @focus="fixedValue"
                          @blur="changChannelName($event, item)"
                          class="input-class" style="width: 120px;"
                          :value="item.fName" placeholder="请输入资源类别名称"></el-input>
                      </div>
                    <div>
                        <div class="currentState" :style="`backgroundColor: ${item.fIsPublish ? '#4FB784' : '#576369'}`"></div>
                        <span style="color: #fff;font-size: 12px">{{item.fIsPublish ? '已发布' : '未发布'}}</span>
                    </div>
                    </div>
                </div>
            </div>
              
          </div>
          <div v-else style="width: 100%;text-align: center;">
              <div class="favorite-empty">
                <img style="width: 100px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAACACAMAAAD6ZS3TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTAC+/wC7/wC7/wC7/wC9/wC7/wC8/wC6/wPE/gC8/wC7/wC7/wC8//7DAf/DAN3FLMnJP//EAMvBNJnAZv/DALfASKfAWAC6///CANzAafIAAAAYdFJOUwAe2ZfrMsOA+A1JrW9c37EpE0zteoPTv/JHy3IAAARkSURBVGje5ZvZgqsgDIZd6l7X6kz7/i96pu6SgAkCXhxuLX4hJD9BqOdptzyOc++ulsfvvxaXt8DL4D23wLkB2XOFjwY8M6fwx1toD2cGZAmAjwYkLgzww/QtaWno3we3b0BUCLignJJv14rIFXzKeDcGAMqmd5H8kS34cYjQMbkVgZsjDPoXCQtD8GdACm+QFCYMAAL3SHxyVl6VQiBwJy/0we8vSCF05/looMGJbwhe6k2XjhReSaWMGKx0eJFfS1WOFBqRUV0DRLj2KpZraHEZGFxCuQaIMXO5gmFoMRQ4E/UbNAB9K9ALY2tGdK7FfpJipYStEu04qeCx8XoBENJNi0NxdmxUS2By03B+AgpWG9UasjuQ4c0XzMi+SIE3bUCJ7ouO+DgQgsPUpklQ0jRA8YlopJldWy7AwyyR4MEUPZ6XNUeQ/e+cSvEwQB+lScUtxoBS4L8GpIbE1xfg8ZzPSjyUKD0N9EOZkp7g5XYzEl0YQrAbwikembWIJ3GqCSTgYcwWvq7EiflDwsNaiSiEAC6qBxGPSIbPljhEush40tvUEof8iIEn+FI6WzJnsfBkJSbHKg9PE0JGpnLxahVBJU4lE3y8WomZKq2Dlysxe43Sw+PzK67QhAVSF49ENyMtDeCRXSu/OruCRz4ccGvTa3jcAEZlfhUPlJizHJvACwHPK0YM4Pfpzi3FjODX16Sa/f5TfBaVSZzehp+riPhO/Nb+E3zbDXVVfarq9dM3rvFN/dm3V+8S3w4fsb1aZ/im+sBWNY7wC70euq7p+t/XbEDnBN9O9KHd7PnZxm8dX+9cvbR+4jvAdwj9r2xc3G8bP7p+R8/LbB1/ZR0/Dn449HvkO7Ms48eZb4/9Un+zyy6+HTNO7FdsT+ziuzXBD/2y2fuVZfwg+n7qF83TYhtfz+kt9CuXqLCMr8Spn/rl9+J9R86v/toA+o2FnovIx/tFrvIe7ZesetTdgA8daj7sF25FQOceP+5I25er9R7d5Ez1VnMPfhq7o1pPSXePP9Cd42d6f9zlsI8sNfEC3dM9MdTEC3RP8aHcAv5XoHu6R5Za+F6ke7pHlkx8lKyu748PYq0jSxY+Kt7PZfAv8aHGgR0LPx62+Mvgm9PPxBQDyPjpsOVb4DTo4FEDTr+PE/HL19dw8X0v+9TGO5og4beXJkvWNXJDOXc3KPjdiL6aNn5VIHiKIoTn+MN85uieA48TihCe4YV0ouGRA7tcBy+eORUZEQ8P7HAhVOE1lYzTXY6PLl89IVydkOHlV2ZY7UwIcTwIXf17T2ohxPDm7jyhQrg3AOKhbF2986YQQoB/nl64a+qqqhumARJ/CnjCkjV/WubxZUJ4wJMqhvlEoeZOASqEO3xOu7Uyf1ev+DGAKMmKJ0ucPh4RwsUgusTpOh8XQqwpJa7VCj3pGgra2Tal5SeeUgjt3Kkn1k+Gb9XqCaHDf4LiQmjwRrWGENr/C6pCCNPCPXwTQmt/PaUIYXwZ/g8RWG6u5vFIYgAAAABJRU5ErkJggg=="/>
                <p class="tips">请选择摄像头分组</p>
              </div>
          </div>
          <div class="page-contral" v-if="screenData.fId && cameraPageParam.pageCount > 1 && cameraList.length > 0" style="textAlign: right;width: 85%">
            <el-pagination
                small
                layout="prev, pager, next"
                :current-page="cameraPageParam.currentPage"
                :page-size="cameraPageParam.pageSize"
                @current-change="pageCurrentChange"
                :total="cameraPageParam.total">
            </el-pagination>
          </div>
        </div>
        <DialogModal :showModal="nvrModal" @closeModals="closeNvrModal()" :modalTitle="'NVR配置'">
          <template v-slot:container>
            <div v-if="!nvrInsertModal" class="modal-content nvr_table" style="width: 700px;max-height: 600px;">
                <el-button type="primary" style=" background: #2483FF;color: #fff;border: 1px solid #2483FF;margin-bottom: 10px;" @click="openInsertNvrModal('add')">新增</el-button>
                <el-table
                  :data="nvrList"
                  style="width: 100%"
                  :stripe="true"
                  max-height="500">
                <el-table-column
                  prop="fProvider"
                  label="提供商">
                    <template slot-scope="scope">
                      <div>{{scope.row.fProvider == 'DAHUA' ? '大华' : '海康'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="fIpAddress"
                  label="连接ip">
                    <template slot-scope="scope">
                      <div>{{scope.row.fIpAddress || '--'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="fPort"
                  label="端口">
                    <template slot-scope="scope">
                      <div>{{scope.row.fPort || '--'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="fPtzPort"
                  label="云台控制端口">
                    <template slot-scope="scope">
                      <div>{{scope.row.fPtzPort || '--'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="fUserName"
                  label="用户名">
                    <template slot-scope="scope">
                      <div>{{scope.row.fUserName || '--'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                prop="fPassword"
                label="密码">
                    <template slot-scope="scope">
                        <div>{{scope.row.fPassword || '--'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="openInsertNvrModal('update', scope.row)">
                          编辑
                        </el-button>
                        <el-button type="text" @click="deleteInsertNvrModal(scope.row)">
                          删除
                        </el-button>
                    </template>
                </el-table-column>
              </el-table>
              <div style="display: flex;justify-content:flex-end;marginTop: 10px;">
                <el-pagination
                    small
                    @current-change="changePageByNvr"
                    :current-page="nvrPage.currentPage"
                    :page-size="nvrPage.pageSize"
                    layout="prev, pager, next"
                    :total="nvrPage.total">
                </el-pagination>
              </div>
            </div>
            <div v-else class="modal-content nvr_table" style="width: 700px;max-height: 600px;">
              <el-form  ref="accountForm" :rules="nvrFormRules" label-position="top"  label-width="100px" :model="nvrForm">
                  <el-row>
                      <el-col :span="12" class="form-padding">
                          <el-form-item label="提供商" prop="fProvider">
                              <el-select filterable v-model="nvrForm.fProvider" clearable placeholder="请选择" style="width:95%;">
                                    <el-option
                                        v-for="item in providerList"
                                        :key="item.fId"
                                        :label="item.name"
                                        :value="item.fId">
                                    </el-option>
                                </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12" class="form-padding">
                          <el-form-item label="连接Ip" prop="fIpAddress">
                              <el-input
                                  @input="value => nvrForm.fIpAddress = value.replace(/\s/i, '')"
                                  :value="nvrForm.fIpAddress" placeholder="请填写"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row>
                      <el-col :span="12" class="form-padding">
                          <el-form-item label="端口" prop="fPort">
                              <el-input
                                  @input="value => nvrForm.fPort = value.replace(/\s/i, '')"
                                  type="number"
                                  style="width: 95%"
                                  :value="nvrForm.fPort" placeholder="请填写"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12" class="form-padding">
                          <el-form-item label="云台控制端口" prop="fPtzPort">
                              <el-input
                                  @input="value => nvrForm.fPtzPort = value.replace(/\s/i, '')"
                                  type="number"
                                  style="width: 95%"
                                  :value="nvrForm.fPtzPort" placeholder="请填写"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row>
                      <el-col :span="12" class="form-padding">
                          <el-form-item label="用户名" prop="fUserName">
                              <el-input
                                  @input="value => nvrForm.fUserName = value.replace(/\s/i, '')"
                                  style="width: 95%"
                                  :value="nvrForm.fUserName" placeholder="请填写"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12" class="form-padding">
                          <el-form-item label="密码" prop="fPassword">
                              <el-input
                                  @input="value => nvrForm.fPassword = value.replace(/\s/i, '')"
                                  :value="nvrForm.fPassword" placeholder="请填写"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <div style="display: flex;justify-content: flex-end;">
                      <el-button 
                           style="background: #2483FF;color: #fff;border: 1px solid #2483FF;margin-bottom: 10px;" 
                          @click="updateNvrData"
                      >{{nvrType == 'add' ? '新增' : '编辑'}}</el-button>
                      <el-button 
                           style="background: #666A71;color: #fff;border: 1px solid #666A71;margin-bottom: 10px;" 
                          @click="closeInsertNvrModal"
                      >取消</el-button>
                  </div>
              </el-form>
            </div>
          </template>
        </DialogModal>
        <DialogModal :showModal="showModal" @closeModals="closeModal('channelRef','showModal')" :modalTitle="cameraModalTitle">
          <template v-slot:container>
            <div class="modal-content" style="width: 450px;">
                <el-form ref="channelRef" label-position="top" :inline="true" :model="channelDto" :rules="channelRules" style="width: 100%">
                    <el-col :span="24">
                        <el-form-item label="摄像机名称" prop="fName" style="width: 100%">
                            <el-input
                                  @input="value => channelDto.fName = value.replace(/\s/i, '')"
                                  :value="channelDto.fName" placeholder="请填写"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="IP地址" prop="fIp" style="width: 100%">
                            <el-select filterable v-model="channelDto.fIp" clearable placeholder="请选择" style="width: 100%">
                                <el-option
                                  v-for="item in ipList"
                                  :key="item.fIpAddress"
                                  :label="item.fIpAddress"
                                  :value="item.fIpAddress">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="nvr真实通道" prop="fRealityChannel" style="width: 100%">
                            <el-input
                                  @input="value => channelDto.fRealityChannel = value.replace(/\s/i, '')"
                                  style="width: 100%"
                                  :value="channelDto.fRealityChannel" placeholder="请填写"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="码流类型" prop="fStreamType" style="width: 100%">
                            <el-select v-model="channelDto.fStreamType" style="width: 100%" placeholder="请选择">
                              <el-option label="主码流" :value="1"></el-option>
                              <el-option label="子码流" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否启用" prop="fEnable" style="width: 100%">
                            <el-select v-model="channelDto.fEnable" style="width: 100%" placeholder="请选择">
                              <el-option label="是" :value="true"></el-option>
                              <el-option label="否" :value="false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否控制" prop="fPtzControl" style="width: 100%">
                            <el-select v-model="channelDto.fPtzControl" style="width: 100%" placeholder="请选择">
                              <el-option label="是" :value="true"></el-option>
                              <el-option label="否" :value="false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px" @click="createCamera">
              {{channelDto.fId ? '保存':'新增'}}
            </el-button>
          </template>
        </DialogModal>
        <DialogModal :showModal="showGroupModal" @closeModals="showGroupModal=false" :modalTitle="groupModalTitle">
          <template v-slot:container>
             <div >
              <span style="color: #fff;font-size: 14px;display: block;">摄像头类别名称</span>
              <el-input
                @input="value => groupName = value.replace(/\s/i, '')"
                class="content-input" style="margin-top: 10px"
                :value="groupName" placeholder="请输入摄像头类别名称"></el-input>
            </div>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="saveGroup">保存</el-button>
          </template>
        </DialogModal>
        <!-- 发布弹窗 -->
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
        <!-- 12.16  武志勇修改成元实页面 -->
        <VPreview :showPreview="isPreviewShown" :type="4" :options="previewOptions" @close="handleClosePreview"></VPreview>
          <VSetBigScreenDialog
                  :shown="isBigScreenDialogShown"
                  :type="4"
                  :isTemporal="true"
                  :options="bigScreenOptions"
                  @close="closeBigScreenDialog"></VSetBigScreenDialog>
      </div>
</template> 

<script>
    import DialogModal from '../../components/DialogModal.vue'
    import VPreview from '../../components/VPreview.vue';  //预览弹框
    import VSetBigScreenDialog from '../../components/VSetBigScreenDialog';  //预览弹框
    import { CameraService, NvrService, CameraInfoService } from '@/api/camera'; // 摄像头相关api文件
    import { ResourceService } from '@/api/resource'; // 请求api
    import config from '@/common/basic-configuration';
    export default {
        data(){
            return {
                previewOptions: {},
                isPreviewShown: false, //显示当前的按钮框
                config, // 引入的变量要在html之内使用
                tableData: [{date: '2019', name: '屈', address: '地址'}],
                nvrModal: false, // nvr弹窗控制
                channelRules:{ // 摄像头规则校验
                  fName: [{ required: true, message: '必填项', trigger: 'blur' }],
                  fIp: [{ required: true, message: "必填项", trigger: "blur" }],
                  fRealityChannel: [{ required: true, message: "必填项", trigger: "blur" }],
                  fStreamType: [{ required: true, message: "必填项", trigger: "blur" }],
                  fEnable: [{ required: true, message: "必填项", trigger: "blur" }],
                  fPtzControl: [{ required: true, message: "必填项", trigger: "blur" }]
                },
                cameraSearchName: '', // 摄像头搜索名称
                channelDto: { // 摄像头数据结构
                  fName: '',  // 名称
                  fIp: '',  // ip
                  fRealityChannel: '', // 真实通道号
                  fStreamType: '', // 码流
                  fEnable: true, // 是否启用
                  fPtzControl: true, // 是否控制
                  fVideoAreaId: '' // 分类id
                },
                showGroupModal: false, // 新建分组
                groupModalTitle: '', // 分组标题
                groupName: '',  // 分组编辑变量
                showModal: false,  //新建控制
                cameraModalTitle: '',
                screenList: [],  // 摄像头分组数据
                fourceIndex: 0,  // 左侧分组选中特效
                screenData: {}, // 选中的分组数据
                showModalIndex: '', // 显示遮罩层的下标
                scrollBar: { // 滑动条
                    x: 300,
                    point: 180,
                    currentWidth: 0
                },
                screenName: "", // 大屏名字
                screenHeight: "", // 大屏高
                screenWidth: "", // 大屏宽
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
                distributionForm: { //发布资源的form数据
                    fReleaseClassifyId: '', //资源类型id
                    fResourceId: '', //资源id
                    fResourceName: '', //资源名称
                    fResourceType: 4, //资源类型
                    fVisitUrl: '', //访问地址
                    type: 1 //类型
                },
                distributionRules: { //验证发布资源的数据
                    fReleaseClassifyId: [
                        { required: true, message: '请选择发布类型', trigger: 'change' }
                    ]
                },
                distribClasses: [], // 发布类型数据
                isDistribDialogShown: false,  //是否显示选择发布类型的弹框
                selectedResource: {}, //选择的资源

                isBigScreenDialogShown: false, //是否显示投屏弹框
                //castResourceType: null, //投屏类型
                bigScreenOptions: {}, //投屏参数
                recourcesOrder: { //资源排序
                    dropdownItemsShow: [{
                        id: 2,  //排序方式的id
                        name: '按创建时间排序' //排序方式的name
                    }],
                    allDropdownItems: [{
                        id: 1,  //排序方式的id
                        name: '按名称排序' //排序方式的name
                    }, {
                        id: 2,  //排序方式的id
                        name: '按创建时间排序' //排序方式的name
                    }]
                },
            }
        },
        components: {
          DialogModal,VPreview,
            VSetBigScreenDialog
        },   
        mounted() {
            this.loadClassify(true);
            this.viewNvrListData();
            this.getIpAddressList();
        },
        methods: {
            /**
             * 重启刷新重启easynvr
             */
            async refreshNvrModal(){
              const res = await CameraInfoService.viewCameraRestart();
              if(res.success){
                this.$message.success(res.msg);
              }else{
                this.$message.error(res.msg);
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
           * 预览单个摄像头当前画面
           * @param {Object}  -- item 点击的单个摄像头对象
           */
          showCameraPreview(item) {
            this.isPreviewShown = true;
            this.previewOptions= {
                cameraType: 1,
                id: item.fRealityChannel,
                name: item.fName,
                show: true
            }
            // this.$cameraPreview({
            //   cameraType: 1,
            //   id: item.fRealityChannel
            // })
          },
          /**
             * 关闭预览弹框
             */
            handleClosePreview() {
                this.isPreviewShown = false;
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
            this.getCameraInfo();

            let show = this.recourcesOrder.allDropdownItems.filter((item) => {
              if(item.id !== fSort) return item;
            })
            this.recourcesOrder.dropdownItemsShow = [
              ...show
            ]
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
            if (!(/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/).test(this.nvrForm.fIpAddress)) {
              this.$message.error('IP地址不规范')
              return
            } 
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
              if (item.fIsPublish) {
                this.cancelDistribResouce(item);
                return;
              }
              this.clearDistribForm();
              this.getDistributionClasses();
              this.selectedResource = item;
              this.isDistribDialogShown = true;
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
             * 发布摄像头资源
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
                    this.getCameraInfo();
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

                distribData.type = isDistribute ? 1 : 2; //type为1 - 发布, type为2 - 取消发布
                distribData.fResourceId = this.selectedResource.fId;

                if (!isDistribute) {
                    distribData.fId = this.selectedResource.fResourceId;
                } else {
                    distribData.fResourceName = this.selectedResource.fName
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
             * 清理
             */
            clearDistribForm() {
                this.distributionForm.fReleaseClassifyId = '';
            },
            // 删除摄像头
            delCamera(item) {
              this.$confirm(`${item.fName} 删除后无法恢复，确认删除？`, 'warning', ()=>{}, async ()=>{
                const res = await CameraInfoService.deleteCameraInfo(item.fId);
                if (res.success) {
                  this.getCameraInfo();
                  this.loadClassify();
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
                  this.$message.error('必填项输入为空或错误！');
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
                this.loadClassify();
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
              debugger
              if (!this.groupName || (this.groupName && this.groupName.trim().length == 0)) {
                this.$message.error('请输入分类名称');
                return;
              }
              if (this.groupModalTitle=='编辑摄像头分类') {  
                this.updateCameraClassify();
              } else if (this.groupModalTitle=='新增摄像头类别') {  
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
                    this.getCameraInfo();
                  }
                  // 获取第一分组的摄像头列表
                }else{
                  this.screenList.map((item) => {
                    if(item.fId == this.screenData.fId){
                      this.screenData = {
                        ...item
                      }
                    }
                  })
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
              this.groupModalTitle='编辑摄像头分类';
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
                this.chooseManage(this.screenList[0], 0);
              } else {
                this.$message.error(res.msg);
              }
            },
            // 点击分组 
            chooseManage(item, index) {
              this.fourceIndex = index;
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
              this.getIpAddressList();
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
                this.bigScreenOptions = {
                    cameraType: 1,
                    id: item.fChannel,
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
  .nvr_table {
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
</style>
<style lang="scss" scoped>
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
        padding-left: 50px;
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
        padding-left: 50px;
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
            max-width: 200px;
            font-size: 14px;
            color: #2483ff;
            padding: 0 10px;
            border-left: 2px solid #2483ff;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        
      }
      .main-screen {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        padding-top: 8px;
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
          overflow: hidden;
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

                    &.ml-15 {
                        margin-left: 15px;
                    }
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
        .recourse-longTypeTipe{
          // position: absolute;
            // top: 0;
            // right: -26px;
            width: 100px;
            height: 20px;
            margin-top: 9px;
            box-sizing: border-box;
            background: #1d262e;
            z-index: 1;
            text-align: center;
            line-height: 20px;
            color: red;
            // transform:rotate(39deg);
            font-size: 16px;

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