<!-- 客户端管理 -->
<template>
    <div class="data-main" >
        <div class="data-grounp">
          <div class="tip">
            <span style="color: #fff;font-size: 14px">客户端服务名称</span>
            
          </div>
          <img id="canvas-bg" src="../../image/index/1571105628(1).png" style="display: none"/>
          <div :class="`${fourceIndex === index? 'manage-title-active':'manage-title'}`" v-for="(item,index) in screenServices" :key="index" @click="chooseManage(item, index)">
            <span v-if="item.fName.length <= 6" class="title">{{ item.fName }}</span>
            <el-tooltip
              :open-delay="400"
              effect="dark"
              :content="item.fName">
                <span v-if="item.fName.length > 6" class="title">{{truncate(item.fName)}}</span>
            </el-tooltip>
            <div v-if="item.fState&&item.fState == 3" class="currentState"> </div>
            <div v-else class="currentState" style='background: #16a61e'> </div>
          </div>
        </div>
        <div class="data-screenList" >
          <el-tabs v-if="screenServices.length!=0" v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="信息管理" name="first" >
                <div style="flex=1;display:flex;flex-direction: row">
                  <div class="big-box">
                      <div class="small-box">
                          <span class="topText">状态</span>
                          <span v-if="currentData.fState&&currentData.fState === 3" class="bottomText" style="color: #e03e36">未在线</span>
                          <span v-else-if="currentData.fState&&currentData.fState === 1" class="bottomText" style="color: #17b978">在线</span>
                          <span v-else class="bottomText" style="color: #17b978">正在显示</span>
                      </div>
                      <div class="small-box">
                          <span class="topText">是否可用</span>
                          <span v-if="currentData.fIsUsable" class="bottomText" style="color: #17b978">可用</span>
                          <span v-else class="bottomText" style="color: #e03e36">不可用</span>
                      </div>
                      
                      
                      <div class="small-box">
                          <span class="topText">分辨率</span>
                          <span class="bottomText">{{currentData.fWidth}}*{{currentData.fHeight}}</span>
                      </div>
                      <div class="small-box">
                          <span class="topText">显示资源类型</span>
                          <span v-if="currentData.fShowResourceType != null" class="bottomText">{{getScreenType(currentData.fShowResourceType)}}</span>
                          <span v-else class="bottomText" style="color: #e03e36">暂无配置</span>
                      </div>
                      <div class="small-box" style="width: 100%">
                          <span class="topText">服务器名称</span>
                          <span class="bottomText">{{currentData.fName}}</span>
                      </div>
                      <div class="small-box" style="width: 100%">
                          <span class="topText">服务器ip</span>
                          <span class="bottomText">{{currentData.fIp != "" ?currentData.fIp: "暂无"}}</span>
                      </div>
                      
                      <div class="small-box" style="width: 100%">
                          <span class="topText">账号</span>
                          <span class="bottomText">{{currentData.fAccount}}</span>
                      </div>
                      <div class="small-box" style="width: 100%">
                          <span class="topText">密码</span>
                          <span class="bottomText">{{currentData.fPassword}}</span>
                      </div>
                  </div>
                  <div style="flex: 1;padding: 15px;padding-top: 0">
                    <div class="image-box">
                      <div  class="full-style" v-if="currentData.fState&&currentData.fState == 2">
                          <Preview class="full-style"  v-if="currentData.fShowResourceType == 1"  :id="currentData.fShowResourceGroupId"/>
                          <QueryScreenByPlan  class="full-style"  v-if="currentData.fShowResourceType == 2||currentData.fShowResourceType == 3" :type= "currentData.fShowResourceType" :id="currentData.fShowResourceType==2?currentData.fCurrentPlanGroupId:currentData.fShowResourceGroupId"/>
                          <div  v-if="currentData.fShowResourceType == 4" class="full-width out-line">临时资源</div>
                      </div>
                      <span v-else class="full-width out-line">服务器未显示</span>
                    </div>
                  </div>
                </div>  
              </el-tab-pane>
              <el-tab-pane label="预案组管理" name="second">
                <div style="display: flex;flex-direction: row" v-if="planGroups.length != 0">
                  <div class="right-data-grounp">
                    <div :class="`${rightfourceIndex === index? 'manage-title-active':'manage-title'}`" v-for="(item,index) in planGroups" :key="index" @click="choosePlanGroups(item, index)">
                      <span v-if="item.fName.length <= 6" class="title">{{ item.fName }}</span>
                      <el-tooltip
                        :open-delay="400"
                        effect="dark"
                        :content="item.fName">
                          <span v-if="item.fName.length > 6" class="title">{{truncate(item.fName)}}</span>
                      </el-tooltip>
                      <div v-if="!item.fIsShow" class="currentShowState"> </div>
                      <div v-else class="currentShowState" style='background: #16a61e'> </div>
                    </div>
                  </div>
                  <div class="main-screen">
                      <div class="my-screen first-scren"  @click="insertPlanGroupButton">
                        <i class="dvIcon dvIcon-add1" style="color: #fff;marginRight: 5px;transition: .2s;" ref="addIcon"></i>
                        <span style="color: #fff;font-size: 12px;marginTop: 10px;transition: .2s;" ref="addText">{{"预案组新增场景"}}</span>
                      </div>
                      <div 
                          class="my-screen" 
                          v-for="(item,index) in planGroupsContent" 
                          :key="index" 
                          style="opacity: 1; transform: scale(1);" 
                        >
                        <div class="screen">
                          <div class="recourse-info">
                            <img :src="pictureUrl + item.fPreviewUtl" class="full-width" :onerror="defaultImag"/>
                            <div class="recourse-modal" :ref="`modal${index}`" >
                              <button class="preview-btn" v-if="!item.fIsRunning == true&&Screening" @click="cutShow(item)">切换</button>
                              <div class="resource-icons" style="display: flex;flex-direction: column;align-items:center">
                                  <span class="currentShowText" :style="{color: item.fIsRunning == true? 'red':'#FDFDFD'}">{{item.fIsRunning == false? '未显示': '正在显示'}}</span>
                                  <el-tooltip
                                    style="cursor: pointer;margin-top: 5px"
                                    :open-delay="400"
                                    effect="dark"
                                    content="删除">
                                  <i
                                      class="dvIcon dvIcon-laji showIcon resource-icon"
                                      @click="setdelectScreen(item)"></i>
                                  </el-tooltip>
                              </div>
                              
                            </div>
                          </div>
                          <div class="screen-main">
                            <div style="display: flex; justify-content: space-between;width: 100%" >
                              <span style="color: #0580DC;font-size: 12px;cursor: pointer;"  @click="setParameters(item,'设置')">参数设置</span>
                              <span v-if="item.fSceneName.length <= 6" style="color: #FDFDFD;font-size: 14px;width: 85px" class="textOverFlow">{{ item.fSceneName }}</span>
                              <el-tooltip
                                :open-delay="400"
                                effect="dark"
                                :content="item.fSceneName">
                                  <span v-if="item.fSceneName.length > 6" style="color: #FDFDFD;font-size: 14px;width: 85px" class="textOverFlow">{{truncate(item.fSceneName)}}</span>
                              </el-tooltip>
                              <span style="color: #0580DC;font-size: 12px;cursor: pointer;"  @click="setParameters(item,'查看')">查看</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                  </div>
                </div>
                <div v-else style="width: 100%;text-align: center;">
                    <div class="favorite-empty">
                      <img style="width: 100px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAACACAMAAAD6ZS3TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTAC+/wC7/wC7/wC7/wC9/wC7/wC8/wC6/wPE/gC8/wC7/wC7/wC8//7DAf/DAN3FLMnJP//EAMvBNJnAZv/DALfASKfAWAC6///CANzAafIAAAAYdFJOUwAe2ZfrMsOA+A1JrW9c37EpE0zteoPTv/JHy3IAAARkSURBVGje5ZvZgqsgDIZd6l7X6kz7/i96pu6SgAkCXhxuLX4hJD9BqOdptzyOc++ulsfvvxaXt8DL4D23wLkB2XOFjwY8M6fwx1toD2cGZAmAjwYkLgzww/QtaWno3we3b0BUCLignJJv14rIFXzKeDcGAMqmd5H8kS34cYjQMbkVgZsjDPoXCQtD8GdACm+QFCYMAAL3SHxyVl6VQiBwJy/0we8vSCF05/looMGJbwhe6k2XjhReSaWMGKx0eJFfS1WOFBqRUV0DRLj2KpZraHEZGFxCuQaIMXO5gmFoMRQ4E/UbNAB9K9ALY2tGdK7FfpJipYStEu04qeCx8XoBENJNi0NxdmxUS2By03B+AgpWG9UasjuQ4c0XzMi+SIE3bUCJ7ouO+DgQgsPUpklQ0jRA8YlopJldWy7AwyyR4MEUPZ6XNUeQ/e+cSvEwQB+lScUtxoBS4L8GpIbE1xfg8ZzPSjyUKD0N9EOZkp7g5XYzEl0YQrAbwikembWIJ3GqCSTgYcwWvq7EiflDwsNaiSiEAC6qBxGPSIbPljhEush40tvUEof8iIEn+FI6WzJnsfBkJSbHKg9PE0JGpnLxahVBJU4lE3y8WomZKq2Dlysxe43Sw+PzK67QhAVSF49ENyMtDeCRXSu/OruCRz4ccGvTa3jcAEZlfhUPlJizHJvACwHPK0YM4Pfpzi3FjODX16Sa/f5TfBaVSZzehp+riPhO/Nb+E3zbDXVVfarq9dM3rvFN/dm3V+8S3w4fsb1aZ/im+sBWNY7wC70euq7p+t/XbEDnBN9O9KHd7PnZxm8dX+9cvbR+4jvAdwj9r2xc3G8bP7p+R8/LbB1/ZR0/Dn449HvkO7Ms48eZb4/9Un+zyy6+HTNO7FdsT+ziuzXBD/2y2fuVZfwg+n7qF83TYhtfz+kt9CuXqLCMr8Spn/rl9+J9R86v/toA+o2FnovIx/tFrvIe7ZesetTdgA8daj7sF25FQOceP+5I25er9R7d5Ez1VnMPfhq7o1pPSXePP9Cd42d6f9zlsI8sNfEC3dM9MdTEC3RP8aHcAv5XoHu6R5Za+F6ke7pHlkx8lKyu748PYq0jSxY+Kt7PZfAv8aHGgR0LPx62+Mvgm9PPxBQDyPjpsOVb4DTo4FEDTr+PE/HL19dw8X0v+9TGO5og4beXJkvWNXJDOXc3KPjdiL6aNn5VIHiKIoTn+MN85uieA48TihCe4YV0ouGRA7tcBy+eORUZEQ8P7HAhVOE1lYzTXY6PLl89IVydkOHlV2ZY7UwIcTwIXf17T2ohxPDm7jyhQrg3AOKhbF2986YQQoB/nl64a+qqqhumARJ/CnjCkjV/WubxZUJ4wJMqhvlEoeZOASqEO3xOu7Uyf1ev+DGAKMmKJ0ucPh4RwsUgusTpOh8XQqwpJa7VCj3pGgra2Tal5SeeUgjt3Kkn1k+Gb9XqCaHDf4LiQmjwRrWGENr/C6pCCNPCPXwTQmt/PaUIYXwZ/g8RWG6u5vFIYgAAAABJRU5ErkJggg=="/>
                      <p class="tips">该服务器下还未配置预案组，请先新建预案组</p>
                    </div>  
                </div>
                <footer v-if="planGroups.length != 0&&planGroups.length>11">
                  <el-row type="flex" justify="end">
                      <el-pagination
                              layout="prev, pager, next"
                              :total="planGroupScenesReqObj.itemTotal"
                              @current-change="goToPage">
                      </el-pagination>
                  </el-row>
                </footer>
              </el-tab-pane>

          </el-tabs>
          <div v-else style="width: 100%;text-align: center;">
              <div class="favorite-empty">
                  <img style="width: 100px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAACACAMAAAD6ZS3TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTAC+/wC7/wC7/wC7/wC9/wC7/wC8/wC6/wPE/gC8/wC7/wC7/wC8//7DAf/DAN3FLMnJP//EAMvBNJnAZv/DALfASKfAWAC6///CANzAafIAAAAYdFJOUwAe2ZfrMsOA+A1JrW9c37EpE0zteoPTv/JHy3IAAARkSURBVGje5ZvZgqsgDIZd6l7X6kz7/i96pu6SgAkCXhxuLX4hJD9BqOdptzyOc++ulsfvvxaXt8DL4D23wLkB2XOFjwY8M6fwx1toD2cGZAmAjwYkLgzww/QtaWno3we3b0BUCLignJJv14rIFXzKeDcGAMqmd5H8kS34cYjQMbkVgZsjDPoXCQtD8GdACm+QFCYMAAL3SHxyVl6VQiBwJy/0we8vSCF05/looMGJbwhe6k2XjhReSaWMGKx0eJFfS1WOFBqRUV0DRLj2KpZraHEZGFxCuQaIMXO5gmFoMRQ4E/UbNAB9K9ALY2tGdK7FfpJipYStEu04qeCx8XoBENJNi0NxdmxUS2By03B+AgpWG9UasjuQ4c0XzMi+SIE3bUCJ7ouO+DgQgsPUpklQ0jRA8YlopJldWy7AwyyR4MEUPZ6XNUeQ/e+cSvEwQB+lScUtxoBS4L8GpIbE1xfg8ZzPSjyUKD0N9EOZkp7g5XYzEl0YQrAbwikembWIJ3GqCSTgYcwWvq7EiflDwsNaiSiEAC6qBxGPSIbPljhEush40tvUEof8iIEn+FI6WzJnsfBkJSbHKg9PE0JGpnLxahVBJU4lE3y8WomZKq2Dlysxe43Sw+PzK67QhAVSF49ENyMtDeCRXSu/OruCRz4ccGvTa3jcAEZlfhUPlJizHJvACwHPK0YM4Pfpzi3FjODX16Sa/f5TfBaVSZzehp+riPhO/Nb+E3zbDXVVfarq9dM3rvFN/dm3V+8S3w4fsb1aZ/im+sBWNY7wC70euq7p+t/XbEDnBN9O9KHd7PnZxm8dX+9cvbR+4jvAdwj9r2xc3G8bP7p+R8/LbB1/ZR0/Dn449HvkO7Ms48eZb4/9Un+zyy6+HTNO7FdsT+ziuzXBD/2y2fuVZfwg+n7qF83TYhtfz+kt9CuXqLCMr8Spn/rl9+J9R86v/toA+o2FnovIx/tFrvIe7ZesetTdgA8daj7sF25FQOceP+5I25er9R7d5Ez1VnMPfhq7o1pPSXePP9Cd42d6f9zlsI8sNfEC3dM9MdTEC3RP8aHcAv5XoHu6R5Za+F6ke7pHlkx8lKyu748PYq0jSxY+Kt7PZfAv8aHGgR0LPx62+Mvgm9PPxBQDyPjpsOVb4DTo4FEDTr+PE/HL19dw8X0v+9TGO5og4beXJkvWNXJDOXc3KPjdiL6aNn5VIHiKIoTn+MN85uieA48TihCe4YV0ouGRA7tcBy+eORUZEQ8P7HAhVOE1lYzTXY6PLl89IVydkOHlV2ZY7UwIcTwIXf17T2ohxPDm7jyhQrg3AOKhbF2986YQQoB/nl64a+qqqhumARJ/CnjCkjV/WubxZUJ4wJMqhvlEoeZOASqEO3xOu7Uyf1ev+DGAKMmKJ0ucPh4RwsUgusTpOh8XQqwpJa7VCj3pGgra2Tal5SeeUgjt3Kkn1k+Gb9XqCaHDf4LiQmjwRrWGENr/C6pCCNPCPXwTQmt/PaUIYXwZ/g8RWG6u5vFIYgAAAABJRU5ErkJggg=="/>
                  <p class="tips">请先新增配置服务器</p>
              </div>  
          </div>
          <div v-if="activeName == 'first'" class="group-btn">
              <el-button class="button-style" style="padding: 9px 15px;" type="text" v-if="currentData.fState&&currentData.fState !== 3" @click="showScreenshot">
                投放截屏
              </el-button>
              <el-button class="button-style" style="padding: 9px 15px;" type="text" v-if="currentData.fState&&currentData.fState !== 3" @click="delGroupModal=true;currentModalTitle='更新ip'">
                更新ip
              </el-button>
              <el-button v-if="currentData.fState&&currentData.fState != 3" @click="refresh" class="button-style">
                刷新
              </el-button>
              <el-button @click="insertScreen" class="button-style">
                新增
              </el-button>
              <el-button v-if="currentData.fState&&currentData.fState == 3" @click="editScreen" class="button-style">
                编辑
              </el-button>
              <el-button v-if="currentData !=''" @click="delScreen" class="button-style">
                删除
              </el-button>
              <el-button v-if="currentData !=''" @click="handleChangeTabs"  class="button-style">
                配置
              </el-button>
              
              <el-button  @click="handleClickDowlond"  class="button-style">
                下载客户端
              </el-button>
          </div>
          <div v-else class="group-btn">
            
              <el-button @click="insertGrounp" class="button-style">
                新增
              </el-button>
              <el-button @click="editGrounp" class="button-style">
                编辑
              </el-button>
              <el-button @click="delGrounp" class="button-style">
                删除
              </el-button>
              <el-button v-if="currentData !=''&&planGroupsContent.length != 0&&planGroups.length != 0" @click="synchro" class="button-style">
                同步
              </el-button>
              <template v-if="currentData !=''&&planGroupsContent.length != 0&&currentData.fState&&currentData.fState !== 3">
                <el-button v-if="!currentPlanGroup.fIsShow"  @click="setProjection" class="button-style">
                  投放
                </el-button>
                <el-button v-else @click="cancelShow" class="button-style">
                  关闭投放
                </el-button>
              </template>
          </div>
          
        </div>
        <!-- 新增服务器编辑模态框 -->
        <DialogModal :showModal="showGroupModal" @closeModals="showGroupModal=false" :modalTitle="groupModalTitle">
          <template v-slot:container>
             <div class="modal-content">
                <el-form :model="screenForm" status-icon :rules="screenFormRules" ref="screenForm" label-width="100px" class="demo-ruleForm">
                    <el-row>
                        <el-form-item label="服务器名称" prop="fName">
                            <el-input
                              @input="value => screenForm.fName = value.replace(/\s/i, '')"
                              :value="screenForm.fName" placeholder="请填写服务器名称"></el-input>
                        </el-form-item>
                        <el-form-item label="服务器ip" prop="fIp">
                            <el-input
                              @input="value => screenForm.fIp = value.replace(/\s/i, '')"
                              :value="screenForm.fIp" placeholder="请填写服务器ip"></el-input>
                        </el-form-item>
                        <el-form-item label="账号" prop="fAccount">
                            <el-input
                              @input="value => screenForm.fAccount = value.replace(/\s/i, '')"
                              :value="screenForm.fAccount" placeholder="请填写登录服务器账号"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="fPassword">
                            <el-input
                              @input="value => screenForm.fPassword = value.replace(/\s/i, '')"
                              :value="screenForm.fPassword" placeholder="请填写登录服务器密码"></el-input>
                        </el-form-item>
                        <el-row>
                            <el-col :span="12">
                            <el-form-item label="分辨率(宽)" prop="fWidth">
                                <el-input
                                  type="number" min="0"
                                  @input="value => screenForm.fWidth = value.replace(/\s/i, '')"
                                  :value="screenForm.fWidth" placeholder="请填写服务器分辨率(宽)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                        <el-form-item label="分辨率(高)" prop="fHeight">
                            <el-input
                              type="number" min="0"
                              @input="value => screenForm.fHeight = value.replace(/\s/i, '')"
                              :value="screenForm.fHeight" placeholder="请填写服务器分辨率(高)"></el-input>
                        </el-form-item>
                        </el-col>
                        </el-row>

                        <el-form-item label="是否可用" prop="fIsUsable">
                        <el-switch  v-model="screenForm.fIsUsable" style="display: block;" active-color="#13ce66" inactive-color="#ff4949" active-text="启 用" inactive-text="禁 用" class="account-swith">
                        </el-switch>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
          </template>
          <template v-slot:footer>
              <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="closeScreenDialog('screenForm')">取消</el-button>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="submitScreen('screenForm')">确定</el-button>
          </template>
        </DialogModal>
        <!-- 删除模态框 -->
        <DialogModal :showModal="delGroupModal" @closeModals="delGroupModal=false" :modalTitle="currentModalTitle">
          <template v-slot:container>
             <div class="modal-content">
                <span v-if="currentModalTitle=='删除服务器'">您将要删除 {{currentData.fName}} 服务器,此操作将不可恢复。</span>
                <span v-if="currentModalTitle=='更新ip'">是否立即更新服务器 {{currentData.fName}} 的IP,是否继续？</span>
                <span v-if="currentModalTitle=='删除预案组'">您将要删除 {{currentPlanGroup.fName}} 预案组,此操作将不可恢复。</span>
                <span v-if="currentModalTitle=='删除场景'">您将要删除 {{parametersForm.fSceneName}} 场景,此操作将不可恢复。</span>
            
            </div>
          </template>
          <template v-slot:footer>
              <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="delGroupModal=false">取消</el-button>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="dispose">确定</el-button>
          </template>
        </DialogModal>
        <!-- 新增预案组编辑模态框 -->
        <DialogModal :showModal="inserPlanGroup" @closeModals="inserPlanGroup=false" :modalTitle="planGroupTitle">
          <template v-slot:container>
                  <el-form :model="planGroup" status-icon :rules="planGroupRules" ref="planGroup" label-width="100px" class="demo-ruleForm">
                    <el-row>
                        <el-form-item label="预案组名称" prop="fName">
                            <el-input type="text" v-model="planGroup.fName" placeholder="请填写预案组名称"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="inserPlanGroup=false">取消</el-button>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="planGroupDispose('planGroup')">确定</el-button>
          </template>
        </DialogModal>
        <!-- 预案组添加编辑窗口 -->
        <DialogModal :showModal="insertCameraModal" @closeModals="insertCameraModal=false" modalTitle="新增预案组">
          <template v-slot:container>
            <div class="modal_contents_camera">
                <el-row style="height: 480px;">
                  <el-col :span="7">
                    <!-- 场景类别分组 -->
                    <div class="title_camera">
                      <span>场景类别</span>
                    </div>
                    <div style="max-height: 520px;overflow-y: auto;">
                      <div :class="`${fourceTypeIndex === index? 'manage-titles-active':'manage-titles'}`" v-for="(item,index) in allSceneType" :key="index" @click="chooseTypeManage(item, index)">
                        <div class="loop_tip">
                          <span class="title">{{item.fName}}</span>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="17">
                    <!-- 场景列表 -->
                    <div class="title_camera">
                      <span>场景列表</span>
                    </div>
                    <div class="camera_list_div" v-if="sences.length" style="max-height: 520px;overflow-y: auto;display: flex;flex-wrap: wrap;">
                      <div class="my-screen" 
                          v-for="(item,index) in sences" 
                          :key="index" 
                          style="opacity: 1; transform: scale(1);" 
                          @click="handleCheckItem(item,index)"
                        >
                        <div class="screen">
                          <div class="recourse-info">
                            
                            <img :src="pictureUrl + item.fPreviewUtl" class="full-width" :onerror="defaultImag"/>
                            <div v-if="dynamicTags.includes(item.fId)" class="screen-modals" :ref="`modal${index}`">
                              <div class="circle">
                                  <i class="el-icon-check" style="color: #fff;font-size: 30px;"/>
                                </div>
                            </div>
                          </div>
                          <div class="screen-main">
                            <span v-if="item.fName.length <= 6" style="color: #fff;font-size: 12px">{{ item.fName }}</span>
                            <el-tooltip
                              :open-delay="400"
                              effect="dark"
                              :content="item.fName">
                                <span v-if="item.fName.length > 6" style="color: #fff;font-size: 12px">{{truncate(item.fName)}}</span>
                            </el-tooltip>
                            <span style="color: #fff;font-size: 12px">{{item.fWidth}}*{{item.fHeight}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else style="width: 100%">
                        <span style="width: 100%;text-align:center;display: inline-block;font-size: 14px;marginTop: 20px;">暂无数据</span>
                    </div>
                  </el-col>
                </el-row>
                <footer style="margin-bottom: 10px" v-if="sences.length">
                  <el-row type="flex" justify="end">
                      <el-pagination
                              layout="prev, pager, next"
                              :total="scenesReqObj.sum"
                              :page-size='4'
                              @current-change="goToScenesPage">
                      </el-pagination>
                  </el-row> 
                </footer>
                <el-row class="choose_item">
                  <span>选中的摄像头：</span>
                  <el-tag
                    class="tags"
                    :key="tag.fSceneId"
                    v-for="tag in selectData"
                    closable
                    :disable-transitions="false"
                    style="margin-right: 10px;"
                    @close="handleClose(tag)">
                    <span v-if="tag.fSceneName.length <= 6">{{ tag.fSceneName }}</span>
                    <el-tooltip
                      :open-delay="400"
                      effect="dark"
                      :content="tag.fSceneName">
                        <span v-if="tag.fSceneName.length > 6">{{truncate(tag.fSceneName)}}</span>
                    </el-tooltip>
                  </el-tag>
                </el-row>
            </div>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px" @click="createLoopCamera">
              保存
            </el-button>
          </template>
        </DialogModal>
        <!-- 预案组参数设置模态框 -->
        <DialogModal :showModal="setParamByPreGroup" @closeModals="setParamByPreGroup=false" modalTitle="设置">
          <template v-slot:container>
                  <el-form :model="parametersForm" :rules="parametersFormRules" ref="parametersForm" label-width="80px">
                <el-row>
                    <el-col :span="23">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="是否显示" prop="fIsShow">
                                    <el-select style="width: 100%" v-model="parametersForm.fIsShow" placeholder="请选择">
                                        <el-option label="是" :value="true"></el-option>
                                        <el-option label="否" :value="false"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否铺满" prop="fIsBespread">
                                    <el-select style="width: 100%" v-model="parametersForm.fIsBespread" placeholder="请选择">
                                        <el-option label="是" :value="true"></el-option>
                                        <el-option label="否" :value="false"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="是否切换" prop="fIsChange">
                                    <el-select style="width: 100%"  v-model="parametersForm.fIsChange" placeholder="请选择">
                                        <el-option label="是" :value="true"></el-option>
                                        <el-option label="否" :value="false"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="parametersForm.fIsChange">
                                <el-form-item label="切换时间" prop="fChangeTime">
                                    <el-input size="small" min="1" type="number" maxlength="50" v-model="parametersForm.fChangeTime" placeholder="请输入切换时间">
                                        <el-button slot="append">秒</el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-form>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="setParamByPreGroup=false">取消</el-button>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="submitParameters('parametersForm')">确定</el-button>
          </template>
        </DialogModal>
        <!-- 展示详细信息 -->
        <DialogModal style="z-index: 999" :showModal="showParamByPreGroup" @closeModals="showParamByPreGroup=false" modalTitle="详细信息">
          <template v-slot:container>
              <div style="width: 900px;min-width: 900px;display: flex; flex-direction: row">
                  <div class="groupDetail">
                    <img :src="pictureUrl + parametersForm.fImageUrl" style="width: 100%;height:100%" :onerror="defaultImag">
                  </div>
                  <div class="one-scene-infor">
                      <el-row class="infor-row">
                          <div class="infor-field">场景名称</div>
                          <div class="field-context">{{parametersForm.fSceneName}}</div>
                      </el-row>
                      <el-row class="infor-row">
                          <div class="infor-field">分 辨 率</div>
                          <div class="field-context">{{parametersForm.fWidth}} x {{parametersForm.fHeight}}</div>
                      </el-row>
                      <el-row class="infor-row">
                          <div class="infor-field">场景顺序</div>
                          <div class="field-context">{{parametersForm.fSort}}</div>
                      </el-row>
                      <el-row class="infor-row">
                          <div class="infor-field">是否显示</div>
                          <div class="field-context">{{parametersForm.fIsShow == true? '是': '否'}}</div>
                      </el-row>
                      <el-row class="infor-row">
                          <div class="infor-field">场景类型</div>
                          <div class="field-context">{{parametersForm.fSceneTypeName}}</div>
                      </el-row>
                      <el-row class="infor-row">
                          <div class="infor-field">是否切换</div>
                          <div class="field-context">{{parametersForm.fIsChange == true? '是': '否'}}</div>
                      </el-row>
                      <el-row class="infor-row" v-if="parametersForm.fIsChange">
                          <div class="infor-field">切换时间</div>
                          <div class="field-context">{{parametersForm.fChangeTime}} 秒</div>
                      </el-row>
                      <el-row class="infor-row">
                          <div class="infor-field">是否铺满</div>
                          <div class="field-context">{{parametersForm.fIsBespread == true? '是': '否'}}</div>
                      </el-row>
                  </div>
              </div>
          </template>
        </DialogModal>
        <!-- 同步 -->
        <DialogModal :showModal="synchronizationModel" @closeModals="synchronizationModel=false" modalTitle="同步">
          <template v-slot:container>
            <div class="modal-content">
              <el-form :model="synchronizationFrom" :rules="synchronizationFromRules" ref="synchronizationFrom" label-width="100px">
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="同步方式" prop="fType">
                            <el-radio-group v-model="synchronizationFrom.fType" >
                                <el-radio :label="1">永久拷贝</el-radio>
                                <el-radio :label="2">临时上屏</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="目标屏幕" prop="fScreenId">
                            <el-select style="width: 100%" v-model="synchronizationFrom.fScreenId" @change="getSyncPlanGroups" placeholder="请选择目标屏幕">
                                <el-option v-for="item in synchronizationServices" :key="item.fId" :label="item.fName"
                                       :value="item.fId"  :disabled="item.fId == currentData.fId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            </div>
          </template>
          <template v-slot:footer>
              <el-button type="primary" style="font-size: 12px;marginTop: 10px;" >取消</el-button>
              <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="submitSynchronizationFrom('synchronizationFrom')">确定</el-button>
          </template>
        </DialogModal>
    </div>
</template>

<script>
    import { layoutService }  from '@/api/visual'
    import { ScreenServerService, ShowResourceGroupService } from '@/api/resource'
    import DialogModal from '../../components/DialogModal.vue';
    import Preview from '../common/preview';
    import VScenePreview from '../../components/previewComponents/VScenePreview';
    import QueryScreenByPlan from '../../components/queryScreenByPlan';

    export default {
        data(){
            return {
                delId: "",
                defaultImag: 'this.src="' + require('../../image/common/noFile.png') + '"', //出错时显示图片
                datalist: [
                    {
                        name: '测试大屏',
                        IP: '192.168.1.13',
                        user: 'admin',
                        password: '000000',
                        px: '1920*1080',
                        status: 'online',
                        enable: true,
                    }
                ],
                screenServices: [], //服务器数据
                fourceIndex: 0,  // 左侧分组选中特效
                currentData: '', //当前数据,
                groupModalTitle:"", //模态框显示
                isEdit: false,  //是否是编辑状态
                showGroupModal: false, //控制模态框显示
                delGroupModal: false,  //控制删除按钮
                currentModalTitle: "", //当前的显示状态
                activeName: 'first', //控制tabs框
                inserPlanGroup: false, //控制新增预案组按钮
                planGroupTitle: '',   //预案组标题
                screenForm:{
                    fId:'',
                    fName:'',//名称
                    fIp:'',//ip
                    fIsUsable:true,//是否启用
                    fAccount:'',//账号
                    fPassword:'',//密码
                    fWidth:0,//分辨率宽度
                    fHeight:0,//分辨率高度
                },
                screenFormRules:{
                   fName: [
                   {required: true, message: '请填写服务器名称', trigger: 'blur'},
                   {max: 50, message: '资源名称不能超过50个字符', trigger: 'blur'},
                   ],
                    fIp: [
                   {max: 50, message: '服务器ip长度不能超过50个字符', trigger: 'blur'},
                   ],
                    fIsUsable: [
                   {required: false, message: '请选择服务器可用状态', trigger: 'change'},
                   ],
                    fAccount: [
                   {required: true, message: '请填写登录服务器账号', trigger: 'blur'},
                   {max: 50, message: '登录账号不能超过50个字符', trigger: 'blur'},
                   ],
                    fPassword: [
                   {required: true, message: '请填写登录服务器密码', trigger: 'blur'},
                   {max: 50, message: '登录密码不能超过50个字符', trigger: 'blur'},
                   ],
                },
                planGroupRules: {   //预案组规则
                  fName: [
                   {required: true, message: '请填写服务器名称', trigger: 'blur'},
                   {max: 50, message: '资源名称不能超过50个字符', trigger: 'blur'},
                   ],
                },   
                planGroup: {
                    fName: "",
                    fId: "",
                    fScreenId: ""
                },  
                planGroups: [],   //预案组列表
                currentPlanGroup: {}, //当前选中的预案组,
                rightfourceIndex: 0, //右侧选中索引
                planGroupsContent: [], //预案组场景信息
                // 分页查询预案组场景信息请求对象
                planGroupScenesReqObj:{
                    itemTotal: 0,            //总页数
                    currentPage: 1,          // 当前页
                    fGroupId: '',            // 预案组id
                    fScencName: '',          // 场景名称
                    fSceneTypeId: [],        // 场景类型id集合
                    pageSize: 10              // 每页条数
                },
                //场景类别
                insertCameraModal: false,
                allSceneType: [],
                screenData: {}, //当前场景类别
                // =========分页查询场景信息请求对象
                scenesReqObj: {
                    currentPage: 1,          // 当前页
                    fScencName: '',          // 场景名称
                    fSceneTypeId: [],        // 场景类型id集合
                    pageSize: 4,             // 每页条数
                    sum: 0,                  // 总条数
                },
                sences: [],              //场景全部
                fourceTypeIndex: 0,  //当前选中场景索引
                dynamicTags: [],    //选中的标签
                selectData: [],   //选中
                currentScreenData: '', //设置当前场景
                setParamByPreGroup: false,  //设置当前场景的按钮
                parametersForm: {},  //设置
                //设置的规则
                parametersFormRules: {
                    fIsShow: [
                        {required: true, message: '请选择是否显示', trigger: 'change'},
                    ],
                    fIsBespread: [
                        {required: true, message: '请选择是否铺满', trigger: 'change'},
                    ],
                    fIsChange: [
                        {required: true, message: '请选择是否切换', trigger: 'change'},
                    ],
                    fChangeTime: [
                        {required: true, message: '切换时间不能为空', trigger: 'blur'},
                    ]
                },
                //展示信息按钮
                showParamByPreGroup: false,

                // 投放
                fourceIssueTypeIndex: 0, //当前选中按钮
                currentScreenGroup: [],   //当前预案组下的数据
                selectPlanGroupScenesReqObj: {
                    itemTotal: 0,            //总页数
                    currentPage: 1,          // 当前页
                    fGroupId: '',            // 预案组id
                    fScencName: '',          // 场景名称
                    fSceneTypeId: [],        // 场景类型id集合
                    pageSize: 10              // 每页条数
                },
                selectCurrentPlanGroup: {},   //当前选中的预案组
                scene: {},


                synchronizationModel: false,    //同步按钮
                synchronizationFromRules: {
                    fType: [
                        {required: true, message: '请选择同步方式', trigger: 'change'},
                    ],
                    fScreenId: [
                        {required: true, message: '请选择目标屏幕', trigger: 'change'},
                    ],
                },
                // 同步
                synchronizationFrom: {
                    fGroupId: '',      // 被操作的预案组id
                    fScreenId: '',     // 屏id
                    fType: 1           // 1.永久 2.临时
                },
                synchronizationPlanGroups: [],           // 预案组集合
                synchronizationServices: [],

                //投放
                Screening: false,    //正在投放
                

                //点击投放后存储当前正在显示的预案组  //
                castCurrentClient: {},
                
                
            }
        },
        components: {
            DialogModal,VScenePreview,Preview,QueryScreenByPlan
        },
        mounted() {
            //获取服务器列表
            this.selectByPage();
            //获取场景类别
            this.getType()
        },
        methods: {
          /**
           *跳转截屏页面
           */
           showScreenshot(){
                let routeData = this.$router.resolve({
                  path: "/castScreenshots",
                  query: {
                    serverId: this.currentData.fId,
                    type: 6
                  }
                });
                window.open(routeData.href, '_blank')
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
             * 鼠标移出事件 关闭预览遮罩层
             * @param {number} index --- 资源id
             */
            mouseenterHandle(item,index) {
                if (this.$refs[`modal${index}`][0]) {
                    this.$refs[`modal${index}`][0].style.opacity = 1;
                }

            },
            /**
             * 显示新建资源的弹框
             */
            mouseleaveHandle(item,index){
                if (this.$refs[`modal${index}`][0]) {
                    this.$refs[`modal${index}`][0].style.opacity = 0;
                }
            },


            
            // 查询服务器
            async selectByPage(currentIndex) {
                let res = await ShowResourceGroupService.selectAllScreenServer();
                if (res.success) {
                    if (res.obj != null&&res.obj.length !=0) {
                        this.screenServices = res.obj;
                        this.synchronizationServices = res.obj;
                        if(currentIndex){
                          this.currentData = this.screenServices[currentIndex]
                        }else{
                          this.currentData = this.screenServices[0]
                        }
                        this.getPlanGroups();
                    } else {
                        this.screenServices = [];
                        this.synchronizationServices = [];
                    }
                } else {
                    this.$message.warning(res.msg)
                }
            },
            //点击选择当前的
            chooseManage(item, index) {
                this.selectByPage(index);
                this.fourceIndex = index;
                this.currentData = item;
                this.getPlanGroups();
            },
            //关闭当前模态框
            closeScreenDialog(state) {
                if(state == 'screenForm'){
                    this.showGroupModal=false;
                    return;
                }
            },
            //新增
            insertScreen(){
                this.showGroupModal=true;
                this.groupModalTitle='新增客户端服务';
                this.isEdit=false;
                this.screenForm = {
                    fId:'',
                    fName:'',
                    fIp:'',
                    fIsUsable:true,
                    fAccount:'',
                    fPassword:'',
                    fWidth:0,
                    fHeight:0,
                } 
            },
            //编辑
            editScreen(){
                this.showGroupModal=true;
                this.groupModalTitle='编辑客户端服务';
                this.isEdit=true;
                this.screenForm = {
                    fId: this.currentData.fId,
                    fName:this.currentData.fName,
                    fIp:this.currentData.fIp,
                    fIsUsable:this.currentData.fIsUsable,
                    fAccount:this.currentData.fAccount,
                    fPassword:this.currentData.fPassword,
                    fWidth:this.currentData.fWidth,
                    fHeight:this.currentData.fHeight,
                }
            },
            //删除
            delScreen(){
              this.delGroupModal=true
              this.currentModalTitle='删除服务器'
            },
            //删除预案组
            delGrounp(){
              this.delGroupModal=true
              this.currentModalTitle='删除预案组'
            },
            dispose() {
              if(this.currentModalTitle=='删除服务器'){
                this.delect()
              }else if(this.currentModalTitle=='更新ip'){
                this.updateScreenIp()
              }else if(this.currentModalTitle=='删除预案组'){
                this.delCurrentGrounp();
              }else if(this.currentModalTitle=='删除场景'){
                this.delectScreen();
              }
            },
            //删除服务器
            async delect() {
              let res = await ScreenServerService.delete(this.currentData.fId);
              if (res.success) {
                  this.$message.success(res.msg);
                  this.selectByPage()
                  this.delGroupModal=false
              } else{
                  this.$message.warning(res.msg);
                  this.delGroupModal=false
              };
            },
            //删除预案组
            async delCurrentGrounp() {
              let res = await layoutService.deletePlanGroup(this.currentPlanGroup.fId);
              if (res.success) {
                  this.$message.success(res.msg);
                  this.getPlanGroups()
                  this.delGroupModal = false;
              } else{
                  this.$message.warning(res.msg);
                  this.delGroupModal = false;
              };
            },
            //删除场景
            setdelectScreen(item){
              this.delGroupModal=true;
              this.currentModalTitle='删除场景';
              this.delId = item.fId
            },
            //删除预案组下的场景
            async delectScreen() {
                let res = await layoutService.delete_GPScene(this.delId);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.chosePlanGroups(this.currentPlanGroup,'show')
                    this.setParamByPreGroup = false;
                    this.showParamByPreGroup = false;
                    this.delGroupModal=false;
                    this.delId = "";
                } else{
                    this.$message.warning(res.msg);
                    this.chosePlanGroups(this.currentPlanGroup,'show')
                    this.setParamByPreGroup = false;
                    this.showParamByPreGroup = false;
                    this.delGroupModal=false;

                };
            },
            //提交模态框
            submitScreen(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isEdit == false) {
                            this.insertScreenServer(formName);
                        }
                        if (this.isEdit == true) {
                            this.updateScreenServer(formName);
                        }
                    } else {
                        this.$message.error('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
             // 新增
            async insertScreenServer(formName) {
                let res = await ScreenServerService.insert(this.screenForm);
                if (res.success) {
                    this.$message(res.msg);
                    this.showGroupModal=false;
                    this.selectByPage()
                } else{
                    this.$message.warning(res.msg);
                };
            },
             //编辑
            async updateScreenServer(formName) {
                let res = await ScreenServerService.update(this.screenForm);
                if (res.success) {
                    this.$message(res.msg);
                    this.showGroupModal=false;
                    this.selectByPage(this.fourceIndex)
                } else{
                    this.$message.warning(res.msg);
                };
            },
            //更新服务器ip
            async updateScreenIp() {
              let res = await ScreenServerService.getIp(this.currentData.fId);
              if (res.success) {
                  this.$message.success(res.msg);
                  this.delGroupModal=false

                  let index=this.screenServices.findIndex((item)=>item.fId==this.currentData.fId);
                  this.selectByPage(index);
              } else{
                  this.$message.warning(res.msg);
                  this.delGroupModal=false
              };
            },
            // 刷新资源
            async refresh(){
                let res = await ScreenServerService.refresh(this.currentData.fId);
                if (res.success) {
                    this.$message.success(res.msg);
                } else{
                    this.$message.warning(res.msg);
                };
            },


            /**
             * 
             * 投放
             */
            //投放配置
            setProjection(){
                if(this.currentData.fState&&this.currentData.fState === 3){
                  this.$message.warning('服务器未在线');
                  return;
                }
                let id1 = this.currentData.fId;
                let id2 = this.currentPlanGroup.fId
                this.launching(id1,id2);
            },
            chooseIssueTypeManage(item, index){
              this.fourceIssueTypeIndex = index;
              this.selectCurrentPlanGroup = item
              this.chosePlanGroups(this.selectCurrentPlanGroup,'select')
            },
            // 投放大屏
            // 投放按钮
            async launching(id1,id2){
                let res = await layoutService.launching(id1,id2);
                if (res.success) {
                    this.$message(res.msg);

                    let index=this.screenServices.findIndex((item)=>item.fId==id1);

                    this.selectByPage(index);
                    // this.chosePlanGroups(this.currentPlanGroup,'show')
                    this.Screening = true
                } else {
                    this.$message.warning(res.msg);
                }
            },
            // 切换场景的显示
            async cutShow(row){
                let param = {
                    fSceneId: row.fSceneId,  // 场景id
                    fScreneServerId: this.currentData.fId,   // 大屏id
                    fPrePlanGroupId: row.fGroupId,// 预案组id
                }
                let res = await layoutService.appointRunningScene(param);
                if (res.success) {
                        this.chosePlanGroups(this.currentPlanGroup,'show')
                        this.$message.info(res.msg);
                } else {
                    this.$message.warning(res.msg);
                }
            },
            // 关闭投放
            async cancelShow(){
                let res = await layoutService.canceldelivery(this.currentData.fId);
                if (res.success) {
                    this.$message.info(res.msg);

                    let index=this.screenServices.findIndex((item)=>item.fId==this.currentData.fId);
                    this.selectByPage(index);

                    this.chosePlanGroups(this.currentPlanGroup,'show')
                    this.Screening = false;
                } else {
                    this.$message.warning(res.msg);
                }
            },


            /**
             * 
             * 同步
             */
            synchro(){
              this.synchronizationModel = true;

            },
            // 确定
            async submitSynchronizationFrom(formName){
                let canSubmit = false;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        canSubmit = true;
                    } else {
                        this.$message.error('必填项输入为空或错误！');
                        return false;
                    }
                });
                if (canSubmit) {
                    this.synchronizationFrom = {
                      ...this.synchronizationFrom,
                      fGroupId:this.currentPlanGroup.fId
                    }
                    // 同步预案组到其他大屏
                    let res = await layoutService.synchronization(this.synchronizationFrom);
                    if (res.success) {
                        this.$message.info(res.msg);
                        this.synchronizationModel = false;
                        this.synchronizationFrom = {}
                    } else {
                        this.$message.warning(res.msg);
                        this.synchronizationModel = false;
                    }
                }

            },
            // 获取需要同步的大屏下的预案组
            async getSyncPlanGroups(screenId){
                let res = await layoutService.getPlanGroups(screenId);
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length) {
                        this.synchronizationPlanGroups = res.obj;
                    } else {
                        this.synchronizationPlanGroups = [];
                    }
                } else {
                    this.synchronizationPlanGroups = [];
                }
            },

            //目标预案组选中
            tartgetPlanGroupChange(val){
                this.synchronizationFrom.fParentId = val[val.length - 1]
            },
            /**
             * 
             * 
             * 
             */
            //标签页变化
            handleClick(tab, event){
              this.activeName = tab.name
              this.selectByPage(this.fourceIndex);
            },

            //控制页面变化
            handleChangeTabs(){
              this.activeName = 'second'
            },

            // 点击预案组
            choosePlanGroups(item, index){
              this.rightfourceIndex = index;
              this.currentPlanGroup = item
              
              this.chosePlanGroups(this.currentPlanGroup,'show')
            },
            // 1.3获取预案组tree
            async getPlanGroups(){
                let res = await layoutService.getPlanGroups(this.currentData.fId);
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length) {
                        this.planGroups = res.obj;

                        // if(this.currentPlanGroup.fId != undefined)
                        let key = this.planGroups.findIndex((item) => item.fId == this.currentPlanGroup.fId);
                        if(key != -1) {
                          this.currentPlanGroup = this.planGroups[key];
                          this.rightfourceIndex = key;
                        }else{
                          this.currentPlanGroup = this.planGroups[0];
                          this.rightfourceIndex = 0;
                        }
                        this.chosePlanGroups(this.currentPlanGroup,'show')
                        
                    } else {
                        this.planGroups = [];
                    }
                } else {
                    this.planGroups = [];
                }
            },
            //预案组提交
            planGroupDispose(planGroup){
              this.$refs[planGroup].validate((valid) => {
                    if (valid) {
                        if (this.planGroupTitle == '新增预案组') {
                            this.InsertPlanGroup();
                        }
                        if (this.planGroupTitle == '编辑预案组') {
                            this.UpdatePlanGroup();
                        }
                    } else {
                        this.$message.error('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            //新增预案组
            insertGrounp(){
              this.inserPlanGroup=true;
              this.planGroupTitle='新增预案组';
              this.planGroup = {
                    fName: "",
                    fScreenId: this.currentData.fId
              }
            },
            //编辑预案组
            editGrounp(){
              this.inserPlanGroup=true;
              this.planGroupTitle='编辑预案组';
              this.planGroup = {
                    fName: this.currentPlanGroup.fName,
                    fId: this.currentPlanGroup.fId,
                    fScreenId: this.currentData.fId
              }
            },
            //确定新增预案组
            async InsertPlanGroup(){
                let res = await layoutService.insertPlanGroup(this.planGroup);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.inserPlanGroup = false;
                    this.getPlanGroups();
                } else{
                    this.$message.warning(res.msg);
                };
            },
             //确定编辑预案组
            async UpdatePlanGroup(){
                let res = await layoutService.updatePlanGroup(this.planGroup);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.inserPlanGroup = false;
                    this.getPlanGroups();
                } else{
                    this.$message.warning(res.msg);
                };
            },

            // 预案组场景的跳转页面
            goToPage(page){
              this.planGroupScenesReqObj = {
                ...this.planGroupScenesReqObj,
                currentPage: page
              };
              this.chosePlanGroups(this.currentPlanGroup,'show')
            },
            // 1.4获取预案组下的场景(即选中预案组)
            async chosePlanGroups(item,type){
                if(type == "show"){
                  this.planGroupScenesReqObj = {
                      ...this.planGroupScenesReqObj,
                      fGroupId: item.fId,
                  };
                  let res = await layoutService.getPGScenes(this.planGroupScenesReqObj);
                  if (res.success){
                    if(res.obj != null){
                      this.planGroupScenesReqObj.itemTotal = res.obj.itemTotal;
                      if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length > 0) {
                        this.planGroupsContent = res.obj.items
                        this.dynamicTags = res.obj.items.map((item) => {return item.fSceneId})    //选中的标签
                        this.selectData = [...res.obj.items]  //选中
                      } else {
                          this.planGroupsContent = [];
                          this.dynamicTags= [];   //选中的标签
                          this.selectData  = []; //选中
                      }
                    }else{
                        this.planGroupsContent = [];
                        this.dynamicTags= [];   //选中的标签
                        this.selectData  = []; //选中
                    }
                      
                  } else {
                      this.planGroupsContent = [];
                      this.dynamicTags= [];   //选中的标签
                      this.selectData  = []; //选中
                      this.$message.warning(res.msg);
                  }
                }else{
                  this.selectPlanGroupScenesReqObj = {
                      ...this.selectPlanGroupScenesReqObj,
                      fGroupId: item.fId,
                  };
                  let res = await layoutService.getPGScenes(this.selectPlanGroupScenesReqObj);
                  if (res.success){
                      // this.$message.success(res.msg);
                      if(res.obj != null){
                        this.selectPlanGroupScenesReqObj.itemTotal = res.obj.itemTotal;
                        if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length > 0) {
                          this.currentScreenGroup = res.obj.items
                        } else {
                          this.currentScreenGroup = [];
                        }
                      }else{
                        this.currentScreenGroup = [];
                      }
                  } else {
                      this.currentScreenGroup = [];
                      this.$message.warning(res.msg);
                  }
                }
            },
            /**
             * 获取场景类型
             * @param {Boolean} isFirst - 是否第一次请求查询接口
             *  
             * */ 
            async getType(){
                let res = await layoutService.getType();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.allSceneType = res.obj;
                        this.screenData = this.allSceneType[0];
                        let fSceneTypeId = [this.screenData.fId]
                        this.scenesReqObj = {
                            ...this.scenesReqObj,
                            fSceneTypeId
                        }
                        this.getAllScene();
                    } else {
                        this.allSceneType = [];
                    }
                } else {
                    this.allSceneType = [];
                }
            },
            //跳转页面
            goToScenesPage(page){
              let fSceneTypeId = [this.screenData.fId]
              this.scenesReqObj = {
                  ...this.scenesReqObj,
                  currentPage: page,
                  fSceneTypeId
              }
              this.getAllScene()
              
            },
            //获取全部场景
            async getAllScene(){
                let res = await layoutService.getAllScene(this.scenesReqObj);
                
                if (res.success) {
                    this.scenesReqObj.sum = res.obj.itemTotal;
                    if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length > 0) {
    
                        for (let obj of res.obj.items) {
                            obj.checkModel = false;
                            obj.checkState = false;
                            obj.isUse = false;
                            obj.isHover = false;
                            obj.pencilState = false;
                            obj.opearbtnState = false;
                        }
                        this.sences = res.obj.items;
                    } else {
                        this.sences = [];
                    }
                } else {
                    this.sences = [];
                }
            },
            //修改选中
            chooseTypeManage(item, index){
              this.fourceTypeIndex = index;
              this.screenData= item; 
              let fSceneTypeId = [this.screenData.fId]
              this.scenesReqObj = {
                ...this.scenesReqObj,
                fSceneTypeId
              }
              this.getAllScene();
            },
            //保存提交
            async createLoopCamera(){
              // if(this.selectData.length == 0){
              //   this.$message.warning('场景不能为空');
              //   return;
              // }
              let params = {
                fGroupId:this.currentPlanGroup.fId,
                tScreenScenes:this.selectData
              }
              let res = await layoutService.addToPlanGroup(params);
              if (res.success) {
                    // 成功提示
                    this.$message.success(res.msg);
                    // 页面变化
                    this.insertCameraModal = false;
                    this.selectData = [];
                    this.chosePlanGroups(this.currentPlanGroup,'show')
                } else {
                    return this.$message.warning(res.msg);
                }
            },
            //删除选中
            handleClose(tag){
              let dynamicTags = this.dynamicTags;
              let selectData = this.selectData;
              dynamicTags.splice(dynamicTags.indexOf(tag.fSceneId),1);
                for(let key in selectData){
                    if(selectData[key].fSceneId == tag.fSceneId){
                        selectData.splice(key,1)
                    }
              }
              this.dynamicTags = [...dynamicTags];
              this.selectData = [...selectData];
            },
            //选中当前元素
            handleCheckItem(item,index){
              let dynamicTags = this.dynamicTags;
              let selectData = this.selectData;
              if(dynamicTags.includes(item.fId)){
                dynamicTags.splice(dynamicTags.indexOf(item.fId),1);
                for(let key in selectData){
                    if(selectData[key].fSceneId == item.fId){
                        selectData.splice(key,1)
                    }
                }   
              }else{
                dynamicTags.push(item.fId)
                selectData.push(this.packData(item))
              }
              this.dynamicTags = [...dynamicTags];
              this.selectData = [...selectData];
            },
            //新增场景按钮
            insertPlanGroupButton(){
              this.insertCameraModal = true;
              this.chosePlanGroups(this.currentPlanGroup,'show')
            },
            // 组装数据
            packData(obj){
                let param = {
                    bacColor: "rgba(255,255,255,1)",
                    checkModel: false,
                    checkState: false,
                    fChangeTime: 0,                              // 切换时间间隔
                    fHeight: obj.fHeight,                        // 高度
                    fId: '',                                     // 关联id
                    fIsBespread: true,                           // 是否铺满
                    fIsChange: true,                             // 是否切换
                    fIsShow: true,                               // 是否显示
                    fSceneId: obj.fId,                           // 场景id
                    fSceneName: obj.fName,                       // 场景名称
                    fSceneTypeName: obj.fSceneTypeName,          // 场景类型名称
                    fScreenId: this.chosedBigScreenId,           // 大屏服务器id
                    fSort: '',                                   // 顺序
                    fWidth: obj.fWidth,                          // 宽度
                };
                return param;
            },
            //点击参数设置按钮
            setParameters(item,type){
              if(type == '设置'){
                this.parametersForm = {
                  ...item
                };
                this.setParamByPreGroup = true;
              }else if(type == '查看'){
                this.parametersForm = {
                  ...item
                };
                this.showParamByPreGroup = true;
              }
              
            },
            //参数设置提交
            submitParameters(parametersForm){
               let that = this;
               this.$refs[parametersForm].validate((valid) => {
                    if (valid) {
                      let parametersForm = that.parametersForm
                      let params = {
                        "fChangeTime": parametersForm.fIsChange?parametersForm.fChangeTime: 0,
                        "fId": parametersForm.fGroupId,
                        "fIsBespread": parametersForm.fIsBespread,
                        "fIsChange": parametersForm.fIsChange,
                        "fIsShow": parametersForm.fIsShow,
                        "fSceneIds": [
                          parametersForm.fSceneId
                        ]
                      }
                      that.setParam(params);
                    } else {
                      that.$message.error('必填项输入为空或错误！');
                      return false;
                    }
                })
            },
            //参数确认
            async setParam(params){
                let res = await layoutService.setConfig_GPScenes(params);
                if (res.success) {
                    this.$message(res.msg);
                    this.chosePlanGroups(this.currentPlanGroup,'show')
                    this.setParamByPreGroup = false;
                    this.getPlanGroups();
                    // this.showParamByPreGroup = false;
                } else{
                    this.$message.warning(res.msg);
                };
            },
            //获取当前资源的类型
            getScreenType(type) {
              switch (type) {
                    case 1:
                        return "显示组"
                    case 2:
                        return "预案组"
                    case 3:
                        return "场景"
                    case 4:
                        return "临时资源"
              }
            },
            handleClickDowlond(){
              window.open("http://39.98.176.241:8019/zip/screenServer.zip")
            }
        }
    }
</script>
<style lang="scss" >
  .out-line{
    display: block;
    color: #fff;
    font-size: 22px;
    text-align: center;
    line-height: 90px;
  }
  .el-radio{
    color: #A1AEB2;
  }
  .el-dialog, .el-pager li {
    background: #000 !important;
  }
  .el-radio__inner::after{
    background-color: #409EFF !important;
    width: 7px !important;
    height: 7px !important;
  }
  .el-radio__inner{
      background-color:#1C222B !important; 
      border: 1px solid #1C222B !important;
  }
  .el-input-group__append,
  .el-input-group__prepend{
    background-color: #1C222B !important;
    border: 1px solid  #1C222B !important;
  }
  .el-tabs--card {
      .el-tabs__header{
        border-bottom: 1px solid #27343e !important;
        .el-tabs__nav{
          border: 1px solid #27343e !important;
        }
      }
      .el-tabs__item{
        border-left: 1px solid  #27343e !important;
        color: #fff;
      }
      .el-tabs__item.is-active {
          border-bottom-color:  #27343e !important;
          color: #0580DC;
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
  
</style>
<style lang="scss" scoped>
    .full-style{
      width: 100%;
      height: 100%;
      min-width: 590px;
      max-height: 560px;
    }
    .textOverFlow{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .groupDetail{
      width: 580px;
      height: 500px;
      padding: 10px;
      border: 1px dashed #fff;
    }
    .one-scene-infor{
      // margin-left: 20px;
      flex: 1;
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
          font-size: 20px;
          color: #FDFDFD;
          margin-top: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
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
    .currentShowText{
      font-size: 18px;
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
      .camera_list_div{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        padding-top: 8px;
        user-select: none;
        padding-bottom: 50px;
        padding-left: 4px;
        .my-screen {
          box-sizing: border-box;
          margin: 16px;
          display: flex;
          flex-direction: column;
          width: 258px;
          height: 182px;
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
          .recourse-modal{
              opacity: 1!important;
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
    .button-style{
      border: 1px solid #2483FF;
      background-color: #2483FF;
      color: #fff;
    }
    .big-box{
        width: 400px;
        height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-left: 6px;
        .small-box{
          width: 198px;
          padding: 15px;
          margin-top: 5px;
          border-radius: 3px;
          background: #1c222b;
          box-sizing:border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
    }
    .image-box{
      width: 100%;
      height: 100%;
      border: 1px dashed #ccc;
    }
    .topText{
      font-size: 14px;
      color: #A1AEB3;
      margin-bottom: 5px;
    }
    .bottomText{
      font-size: 24px;
      color: #FDFDFD;
    }
    .recourse-info {
       width: 100%;
       height: 146px;
       position: relative;
       display: flex;
       align-items: center;
       justify-content: center;
    }
    .full-width {
        width: 100%;
        height: 100%;
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

      // span {
      //     background-color: #2483ff;
      // }
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
      .resource-icons {
          display: block;

          .resource-icon {
              color: #fff;
              display: inline-block;

          }
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
        position: absolute;
        top: 0;
        right: 0;
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
        position: relative;
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
        position: relative;
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
    .right-data-grounp {
      width: 150px;
      height: calc(100vh - 290px);
      flex-direction: column;
      position: sticky;
      z-index: 3;
      top: 60px;
      // border-right: 1px solid #27343e;
      // border-left: 1px solid #27343e;
      .manage-title {
        position: relative;
        transition: color .2s;
        cursor: pointer;
        line-height: 36px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        background: #1D2329;
        border-radius: 5px;
        margin-bottom: 5px;
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
        position: relative;
        transition: color .2s;
        cursor: pointer;
        line-height: 45px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0580DC;
        font-size: 20px;
        font-weight: 600;
        border: 1px solid #1D2329;
        border-radius: 5px;
        margin-bottom: 5px;
      }
    }
    .right-data-grounp-content{
      flex: 1;
      // background: #16191C;
      // // margin-left:  5px;
      // border-radius: 8px;
      // border-top-left-radius: 0;
    }
    .data-screenList {
      flex: 1;
      position: relative;
      margin-top: 15px;
      padding-left: 10px;
      padding-right: 10px;
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
        padding-bottom: 50px;
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
          height: 182px;
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
          .recourse-modal{
              opacity: 1!important;
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
  .currentShowState{
    width: 8px;
    height: 8px;
    border-radius: 4px;
    display: inline-block;
    background: #576369;
    margin-right: 5px;
    position: absolute;
    right: 5px;
    top: 5px;
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
