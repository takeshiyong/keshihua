<!-- 场景管理 -->
/*
* @Modified: 元实 2019-12-12 预览组件VPreview要name参数
*/

<template>
      <div class="data-main">
        <div class="data-grounp">
          <div class="tip">
            <span style="color: #fff;font-size: 14px">场景类别</span>
            <div class="group-btn">
                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="新建场景类别">
                        <i class="el-icon-plus" @click="showGroupModal=true;isEdit=false;groupModalTitle='新增场景类别';groupName=''"></i>
                    </el-tooltip>

                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="修改场景类别">
                        <i v-show="fourceIndex!==''" class="el-icon-edit" @click="editGroup()"></i>
                    </el-tooltip>

                    <el-tooltip
                            :open-delay="400"
                            effect="dark"
                            content="删除场景类别">
                        <i v-show="fourceIndex!==''" class="el-icon-delete" @click="delGroup()"></i>
                    </el-tooltip>
            </div>
          </div>
          <img id="canvas-bg" src="../../image/index/1571105628(1).png" style="display: none"/>
          <div :class="`${fourceIndex === index? 'manage-title-active':'manage-title'}`" v-for="(item,index) in allSceneType" :key="index" @click="chooseManage(item, index)">
            <span v-if="item.fName.length <= 6" class="title">{{ item.fName }}</span>
            <el-tooltip
                :open-delay="400"
                effect="dark"
                :content="item.fName">
                <span v-if="item.fName.length > 6" class="title">{{truncate(item.fName)}}</span>
            </el-tooltip>
            <span >{{item.num}}</span>
          </div>
        </div>
        <div class="data-screenList" >
          <div class="project-header">
              <div class="header-left">
                <h2>{{screenData.fName}}</h2>
                <span style="color: #2483ff;font-size: 14px">{{screenData.num}}个</span>
                <span style="color: #fff"></span>
              </div>
              <div class="header-right">
                
                <div class="search">
                  <el-input v-model="input" placeholder="请输入内容" class="right-input" clearable>
                    <i slot="suffix" class="el-icon-search search-btn" style="color: #bcc9d4;line-height: 34px;" @click="searchCurrentData"></i>
                  </el-input>
                </div>
                <div class="dropdown-tiem" style="display: inline-block;margin-left: 20px">
                    <!-- <span style="color: #bcc9d4;font-size: 12px">创建时间排序</span> -->
                </div>
              </div>
          </div>
          <div class="main-screen" v-if="sences">
            <div class="my-screen first-scren" @click="addBigDemo">
              <i class="dvIcon dvIcon-add1" style="color: #fff;marginRight: 5px;transition: .2s;" ref="addIcon"></i>
              <span style="color: #fff;font-size: 12px;marginTop: 10px;transition: .2s;" ref="addText">新增场景</span>
            </div>
            <div 
              class="my-screen" 
              v-for="(item,index) in sences" 
              :key="index" 
              style="opacity: 1; transform: scale(1);" 
              @mouseenter="mouseenterHandle(item,index)" 
              @mouseleave="mouseleaveHandle(item,index)"
            >
              <div class="screen">
                <div class="recourse-info">
                  <img :src="pictureUrl+item.fPreviewUtl" class="full-width" :onerror="defaultImag" />
                  <div class="recourse-modal" :ref="`modal${index}`">
                      <button class="preview-btn" @click="handleCastToBigScreen(item)">投屏</button>
                      <!--<button class="preview-btn" @click="previewResource(item)">预览</button>-->

                      <div class="resource-icons">
                          <el-tooltip
                                  :open-delay="400"
                                  effect="dark"
                                  style="cursor: pointer;"
                                  content="预览">
                              <i
                                      class="el-icon el-icon-view button"
                                      style="color: white;font-size: 14px;"
                                      @click="previewResource(item)"
                                      ></i>
                          </el-tooltip>

                          <el-tooltip
                                  :open-delay="400"
                                  effect="dark"
                                  style="margin-left: 15px;margin-right: 15px;cursor: pointer;"
                                  content="删除">
                              <i
                                      class="dvIcon dvIcon-laji showIcon resource-icon"
                                      @click="delectScreen=true;delectObj=item"></i>
                          </el-tooltip>

                          <el-tooltip
                                  :open-delay="400"
                                  style="cursor: pointer;"
                                  effect="dark"
                                  content="编辑">
                              <i class="el-icon-edit resource-icon" style="font-size: 16px;" @click="editScene(item)" ></i>
                          </el-tooltip>
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
                </div>
              </div>
            </div>
          </div>
          <div v-else style="width: 100%;text-align: center;">
              <div class="favorite-empty">
                <img style="width: 100px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAACACAMAAAD6ZS3TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTAC+/wC7/wC7/wC7/wC9/wC7/wC8/wC6/wPE/gC8/wC7/wC7/wC8//7DAf/DAN3FLMnJP//EAMvBNJnAZv/DALfASKfAWAC6///CANzAafIAAAAYdFJOUwAe2ZfrMsOA+A1JrW9c37EpE0zteoPTv/JHy3IAAARkSURBVGje5ZvZgqsgDIZd6l7X6kz7/i96pu6SgAkCXhxuLX4hJD9BqOdptzyOc++ulsfvvxaXt8DL4D23wLkB2XOFjwY8M6fwx1toD2cGZAmAjwYkLgzww/QtaWno3we3b0BUCLignJJv14rIFXzKeDcGAMqmd5H8kS34cYjQMbkVgZsjDPoXCQtD8GdACm+QFCYMAAL3SHxyVl6VQiBwJy/0we8vSCF05/looMGJbwhe6k2XjhReSaWMGKx0eJFfS1WOFBqRUV0DRLj2KpZraHEZGFxCuQaIMXO5gmFoMRQ4E/UbNAB9K9ALY2tGdK7FfpJipYStEu04qeCx8XoBENJNi0NxdmxUS2By03B+AgpWG9UasjuQ4c0XzMi+SIE3bUCJ7ouO+DgQgsPUpklQ0jRA8YlopJldWy7AwyyR4MEUPZ6XNUeQ/e+cSvEwQB+lScUtxoBS4L8GpIbE1xfg8ZzPSjyUKD0N9EOZkp7g5XYzEl0YQrAbwikembWIJ3GqCSTgYcwWvq7EiflDwsNaiSiEAC6qBxGPSIbPljhEush40tvUEof8iIEn+FI6WzJnsfBkJSbHKg9PE0JGpnLxahVBJU4lE3y8WomZKq2Dlysxe43Sw+PzK67QhAVSF49ENyMtDeCRXSu/OruCRz4ccGvTa3jcAEZlfhUPlJizHJvACwHPK0YM4Pfpzi3FjODX16Sa/f5TfBaVSZzehp+riPhO/Nb+E3zbDXVVfarq9dM3rvFN/dm3V+8S3w4fsb1aZ/im+sBWNY7wC70euq7p+t/XbEDnBN9O9KHd7PnZxm8dX+9cvbR+4jvAdwj9r2xc3G8bP7p+R8/LbB1/ZR0/Dn449HvkO7Ms48eZb4/9Un+zyy6+HTNO7FdsT+ziuzXBD/2y2fuVZfwg+n7qF83TYhtfz+kt9CuXqLCMr8Spn/rl9+J9R86v/toA+o2FnovIx/tFrvIe7ZesetTdgA8daj7sF25FQOceP+5I25er9R7d5Ez1VnMPfhq7o1pPSXePP9Cd42d6f9zlsI8sNfEC3dM9MdTEC3RP8aHcAv5XoHu6R5Za+F6ke7pHlkx8lKyu748PYq0jSxY+Kt7PZfAv8aHGgR0LPx62+Mvgm9PPxBQDyPjpsOVb4DTo4FEDTr+PE/HL19dw8X0v+9TGO5og4beXJkvWNXJDOXc3KPjdiL6aNn5VIHiKIoTn+MN85uieA48TihCe4YV0ouGRA7tcBy+eORUZEQ8P7HAhVOE1lYzTXY6PLl89IVydkOHlV2ZY7UwIcTwIXf17T2ohxPDm7jyhQrg3AOKhbF2986YQQoB/nl64a+qqqhumARJ/CnjCkjV/WubxZUJ4wJMqhvlEoeZOASqEO3xOu7Uyf1ev+DGAKMmKJ0ucPh4RwsUgusTpOh8XQqwpJa7VCj3pGgra2Tal5SeeUgjt3Kkn1k+Gb9XqCaHDf4LiQmjwRrWGENr/C6pCCNPCPXwTQmt/PaUIYXwZ/g8RWG6u5vFIYgAAAABJRU5ErkJggg=="/>
                <p class="tips">暂无数据</p>
              </div>
          </div>
          <footer v-if="scenesReqObj.sum > 11">
                <el-row type="flex" justify="end">
                    <el-pagination
                            layout="prev, pager, next"
                            :total="scenesReqObj.sum"
                            :page-size='11'
                            @current-change="goToPage">
                    </el-pagination>
                </el-row>
          </footer>
        </div>
        
        
        <DialogModal :showModal="showGroupModal" @closeModals="showGroupModal=false" :modalTitle="groupModalTitle">
          <template v-slot:container>
             <div >
              <span style="color: #fff;font-size: 14px;display: block;">场景类别名称</span>
              <el-input
                  @input="value => groupName = value.replace(/\s/i, '')"
                  class="content-input" style="margin-top: 10px;"
                  :value="groupName" placeholder="请输入场景类别名称"></el-input>
            </div>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="handleInputConfirm">保存</el-button>
          </template>
        </DialogModal>
        <DialogModal :showModal="delectScreen" @closeModals="delectScreen=false" modalTitle="删除场景">
          <template v-slot:container>
             <div class="modal-content">
              <!-- <span style="color: #fff;font-size: 14px;display: block;">场景名称</span> -->
              <span style="color: #fff;font-size: 16px;display: block;margin-top: 10px">您将删除   {{delectObj.fName}} 这个场景 ?</span>
            </div>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="delectScreen=false;delectObj={}">取消</el-button>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="deleteScene">确定</el-button>
          </template>
        </DialogModal>
        <VPreview :showPreview="isPreviewShown" :type="6" :options="previewOptions" @close="handleClosePreview"></VPreview>
          <VSetBigScreenDialog
                  :shown="isBigScreenDialogShown"
                  :type="6"
                  :isTemporal="false"
                  :options="bigScreenOptions"
                  @close="closeBigScreenDialog"></VSetBigScreenDialog>
      </div>
</template> 

<script>
    import DialogModal from '../../components/DialogModal.vue';
    import VPreview from '../../components/VPreview.vue';  //预览弹框
    import VSetBigScreenDialog from '../../components/VSetBigScreenDialog';  //预览弹框
    // 引入api
    import { layoutService }  from '@/api/visual'
    export default {
        data(){
            return {
                defaultImag: 'this.src="' + require('../../image/common/noFile.png') + '"', //出错时显示图片
                showGroupModal: false, // 新建分组
                groupModalTitle: '', // 分组标题
                groupName: '',  // 分组编辑变量
                showModal: false,  //新建控制
                allSceneType: [],  // 场景列表数据
                fourceIndex: 0,  // 左侧分组选中特效
                screenData: {}, // 选中的分组数据
                showModalIndex: '', // 显示遮罩层的下标
                delectScreen: false, //删除按钮
                delectObj: {}, //删除对象
                scrollBar: { // 滑动条
                    x: 300,
                    point: 180,
                    currentWidth: 0
                },
                // ======场景类型配置
                SceneType: {
                    fId: '',
                    fName: ''
                },
                input: "", //搜索内容
                isEdit: false, // true 编辑  false 新建
                // =========分页查询场景信息请求对象
                scenesReqObj: {
                    currentPage: 1,          // 当前页
                    fScencName: '',          // 场景名称
                    fSceneTypeId: [],        // 场景类型id集合
                    pageSize: 11,             // 每页条数
                    sum: 0,                  // 总条数
                },
                sences: [],
                isPreviewShown: false,    //控制窗口显示
                previewOptions: {
                  id: "",
                  name: ''  //场景名称  元实 2019-12-12
                },

                isBigScreenDialogShown: false, //是否显示投屏弹框
                bigScreenOptions: {}, //投屏参数

            }
        },
        components: {
          DialogModal,VPreview,
            VSetBigScreenDialog
        },   
        mounted() {
            this.getType();
            // this.loadClassify(true);
            // this.getIpAddressList();
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
            //点击选择当前的
            chooseManage(item, index) {
                this.fourceIndex = index;
                this.screenData = item;

                let fSceneTypeId = [this.screenData.fId]
                  this.scenesReqObj = {
                  ...this.scenesReqObj,
                  fSceneTypeId
                }
                this.getAllScene()
            },
            //编辑场景类别
            async editGroup () {
              this.isEdit = true
              this.showGroupModal = true;
              this.groupName = this.screenData.fName
              this.groupModalTitle='编辑场景类别';
            },
            //新增编辑场景类别
            async handleInputConfirm() {
                let groupName = this.groupName;
                
                if (groupName) {   
                    if(this.isEdit){
                        this.SceneType = {
                          fId: this.screenData.fId,
                          fName: this.groupName
                        }
                        const res = await layoutService.updateSceneType(this.SceneType);
                        
                        if (res.success) {
                        this.$message(res.msg);
                        this.getType();

                        } else {
                            return this.$message.warning(res.msg);
                        }
                    }else{
                        this.SceneType = {
                          fName: this.groupName
                        } 
                        const res = await layoutService.insertSceneType(this.SceneType);

                        if (res.success) {
                        this.$message(res.msg);
                        this.getType();

                        } else {
                            return this.$message.warning(res.msg);
                        }
                    }
                    
                }
                this.showGroupModal = false;
                this.groupName = "";
            },
            //删除场景类别
            async delGroup() {
              this.$confirm(`${this.screenData.fName} 删除后无法恢复，确认删除？`,'warning', null,async ()=>{
                const res = await layoutService.deleteSceneType(this.screenData.fId);
                if (res.success) {
                    this.$message(res.msg);
                    this.getType();
                } else {
                    return this.$message.warning(res.msg);
              }
              });
              
            },
            //鼠标点击 出现弹框
            addBigDemo(){
              const {href} = this.$router.resolve({
                    path:"/createScreen",
                });
               window.open(href);//, '_blank'
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
                        this.fourceIndex = 0;
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
            
            //获取全部场景
            async getAllScene(){
                let res = await layoutService.getAllScene(this.scenesReqObj);
                if (res.success) {
                  if(res.obj != null){
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
                  }else{
                    this.sences = [];
                  }
                } else {
                    this.sences = [];
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
            //预览场景
            previewScene(obj){
                const {href} = this.$router.resolve({
                    path:"/sample",
                    query:{
                        sceneId: obj.fId
                    }
                });
                window.open(href, '_blank');
            },
            //编辑场景
            editScene(obj){
                const {href} = this.$router.resolve({
                    path:"/addModal",
                    query:{
                        sceneId: obj.fId
                    }
                });
                window.open(href, '_blank');
            },
            //删除场景
            async deleteScene(){
              const res = await layoutService.deleteScene(this.delectObj.fId);
              if (res.success) {
                  this.$message.success(res.msg);
                  this.scenesReqObj = {
                    currentPage: 1, 
                    ...this.scenesReqObj
                  }
                  this.getAllScene();
                  this.delectScreen=false
              } else{
                  this.$message.warning(res.msg);
              };
                  
            },
            //搜索查询当前数据
            searchCurrentData(){
                  let fScencName = this.input
                  this.scenesReqObj = {
                    ...this.scenesReqObj,
                    fScencName
                  }
                  this.getAllScene()
               
            },
            /**
             * 跳到第几页
             */
            goToPage(page) {
                this.scenesReqObj.currentPage = page;
                this.getAllScene();
            },
            /**
             * 预览资源
             * @param resource
             */
            previewResource(resource){
                this.previewOptions= {
                  id: resource.fId,
                  name: resource.fName  // 元实 2019-12-12
                }
                this.isPreviewShown = true;
            },
            /**
             * 关闭预览弹框
             */
            handleClosePreview() {
                this.isPreviewShown = false;
            },
            /**
             * 报错时
             * 
             */
            imageError(){
              
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
            justify-content: center;
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
