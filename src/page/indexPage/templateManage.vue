<!-- 模板管理 -->
<template>
      <div class="data-main">
        <div class="data-screenList" >
          <div class="project-header">
              <div class="header-left">
                <h2>模板管理</h2>
              </div>
              <div class="header-right">
                <div class="search">
                  <el-input v-model="input" placeholder="请输入内容" class="right-input" clearable>
                    <i slot="suffix" class="el-icon-search search-btn" style="color: #bcc9d4;line-height: 34px;" @click="searchCurrentData"></i>
                  </el-input>
                </div>
              </div>
          </div>
          <div class="main-screen">
            <div class="my-screen first-scren" @click="addBigDemo">
              <i class="dvIcon dvIcon-add1" style="color: #fff;marginRight: 5px;transition: .2s;" ref="addIcon"></i>
              <span style="color: #fff;font-size: 12px;marginTop: 10px;transition: .2s;" ref="addText">新增模板</span>
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
                <span style="position: absolute;right: 0;top: 5px;color: #2483ff;">{{item.fWidth}}*{{item.fHeight}}</span>
                <div class="recourse-info">
                  
                  <div class="recourse-info-template">
                    <div  :style="{width: item.fWidth + 'px', height: item.fHeight + 'px', 'transform': 'scale('+item.wRatio+','+ item.hRatio+')'}" class="preview-thumbnail-div">
                      <div class="preview-layout-div" :style="{top: ii.fY + '%', left: ii.fX + '%', width: ii.fWidth + '%', height: ii.fHeight + '%'}" v-for="(ii,index) in item.templateLayouts" :key="index">

                      </div>
                    </div>
                  </div>
                  <div class="recourse-modal" :ref="`modal${index}`">
                      <button class="preview-btn" @click="handleEdit(item)">编辑</button>

                      <div class="resource-icons">
                          <!-- <el-tooltip
                                  :open-delay="400"
                                  effect="dark"
                                  
                                  :content="`${item.fIsPublish ? '取消发布' : '发布'}`">
                              <i
                                      v-if="item.fIsPublish"
                                      class="dvIcon dvIcon-quxiaofabu resource-icon"
                                      ></i>
                              <i v-else class="dvIcon dvIcon-fabu resource-icon" ></i>
                          </el-tooltip> -->

                          <el-tooltip
                                  style="cursor: pointer;"
                                  :open-delay="400"
                                  effect="dark"
                                  content="删除">
                              <i
                                      class="dvIcon dvIcon-laji showIcon resource-icon"
                                      @click="delectScreen=true;delectObj=item"></i>
                          </el-tooltip>

                          <!-- <el-tooltip
                                  :open-delay="400"
                                  effect="dark"
                                  content="预览">
                              <i class="dvIcon dvIcon-yanjing showIcon resource-icon" @click="previewResource(item)"></i>
                          </el-tooltip> -->
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
                  <div >
                      <el-tooltip
                      :open-delay="400"
                      effect="dark"
                      content="查看详情">
                      <i class="el-icon el-icon-view button"
                        style="color: #2483ff;font-size: 14px;margin-top: 3px"
                        @click="showCurrentItem(item)"></i>
                      </el-tooltip>
                      <span class="modal-left-rightText" style="margin-left: 10px;">({{item.fUseNumber}}次)</span>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
          <footer v-if="pager.total > 11">
                <el-row type="flex" justify="end">
                    <el-pagination
                            layout="prev, pager, next"
                            :total="pager.total"
                            @current-change="goToPage">
                    </el-pagination>
                </el-row>
          </footer>
        </div>
        
        <DialogModal :showModal="delectScreen" @closeModals="delectScreen=false" modalTitle="删除模板">
          <template v-slot:container>
             <div class="modal-content">
              <span style="color: #fff;font-size: 16px;display: block;margin-top: 10px">您将要删除   {{delectObj.fName}} 模板</span>
            </div>
          </template>
          <template v-slot:footer>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="delectScreen=false;delectObj={}">取消</el-button>
            <el-button type="primary" style="font-size: 12px;marginTop: 10px;" @click="deleteScene">确定</el-button>
          </template>
        </DialogModal>

        <DialogModal :showModal="showCurrentButton" @closeModals="showCurrentButton=false" modalTitle="模板详情">
          <template v-slot:container>
             <div class="new-modal-content">
              <div class="modal-left">
                <div style="margin-bottom: 5px">
                  <span class="modal-left-leftText">像 素 : </span>
                  <span class="modal-left-rightText">{{currentItem.fWidth}}*{{currentItem.fHeight}}(px)</span>
                </div>
                <div style="margin-bottom: 5px">
                  <span class="modal-left-leftText">名 称 : </span>
                  <span v-if="currentItem.fName&&currentItem.fName.length <= 6" class="modal-left-rightText">{{ currentItem.fName }}</span>
                  <el-tooltip
                  :open-delay="400"
                  effect="dark"
                  :content="currentItem.fName">
                      <span v-if="currentItem.fName&&currentItem.fName.length > 6" class="modal-left-rightText">{{truncate(currentItem.fName)}}</span>
                  </el-tooltip>
                </div>
                <div style="margin-bottom: 5px">
                  <span class="modal-left-leftText">使用次数 : </span>
                  <span class="modal-left-rightText">{{currentItem.fUseNumber}}次</span>
                </div>
                <div style="margin-bottom: 5px">
                  <span class="modal-left-leftText">模板类型 : </span>
                  <span class="modal-left-rightText">{{currentItem.fSceneTypeName === 1?"自定义":'场景保存'}}</span>
                </div>
                <div style="margin-bottom: 5px">
                  <span class="modal-left-leftText">创建时间 : </span>
                  <span class="modal-left-rightText">{{moment(currentItem.fCreateTime).format('YYYY-MM-DD')}}</span>
                </div>
              </div>
              <div class="modal-right" id="modalRight">
                  <div  :style="{width: currentItem.fWidth + 'px', height: currentItem.fHeight + 'px', 'transform': 'scale('+currentItem.wRatio+','+ currentItem.hRatio+')'}" class="preview-thumbnail-div">
                      <div class="preview-layout-div" :style="{top: ii.fY + '%', left: ii.fX + '%', width: ii.fWidth + '%', height: ii.fHeight + '%'}" v-for="(ii,index) in currentItem.templateLayouts" :key="index">

                      </div>
                  </div>
              </div>
            </div>
          </template>
        </DialogModal>
      </div>
</template> 

<script>
    import moment from 'moment';
    import DialogModal from '../../components/DialogModal.vue'
    import VPreview from '../../components/VPreview';
    // 引入api
    import { templateService }  from '@/api/visual'
    export default {
        data(){
            return {
                moment,
                isPreviewShown: true, // 展示按钮
                delectScreen: false, //删除按钮
                delectObj: {}, //删除对象
                scrollBar: { // 滑动条
                    x: 300,
                    point: 180,
                    currentWidth: 0
                },
                
                input: "", //搜索内容
                
                pager: {
                    sum:0,
                    total: 0,
                    currentPage: 1,
                    pageSize: 10,
                    fName: '',//模板名称
                    pageSizes: 11,
                },
                sences: [], //模板数据,
                showCurrentButton: false, //查看详情按钮
                currentItem: {}

            }
        },
        components: {
          DialogModal,VPreview
        },   
        mounted() {
           this.getTemplatePages();
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
            // 获取模板资源信息
            async getTemplatePages() {
                let res = await templateService.getTemplatePages(this.pager);
                if (res.success) {
                    if (res.obj != null) {
                        // 资源总条数

                        this.pager.sum = res.obj.itemTotal;
                        res.obj.items.forEach((item) => {
                          item.wRatio = 256/item.fWidth;
                          item.hRatio = 144/item.fHeight;
                        })
                        this.sences = res.obj.items;

                    } else {
                        this.pager.sum = 0;
                        this.sences = [];
                    }
                } else {
                    this.$message.warning(res.msg)
                }
            },
            //搜索查询
            searchCurrentData() {
                let fName = this.input
                this.pager = {
                    ...this.pager,
                    fName
                }
                this.getTemplatePages()
            },
            //新增模板
            addBigDemo(){
                 const {href} = this.$router.replace({
                    path:"/templateEdit",
                    query: {
                      templateInfo: ''
                    }
                });
            },
            //编辑模板
            handleEdit(item) {
              const {href} = this.$router.replace({
                  path: "/templateEdit",
                  query: {
                      templateInfo: JSON.stringify(item),
                  }
              });
            },
            //删除模板
            async deleteScene(){
                // 执行删除
                const res = await templateService.deleteTemplate(this.delectObj.fId);
                if (res.success) {

                        this.$message.success(res.msg)
                        this.delectScreen = false;
                        this.getTemplatePages()

                    } else {
                        this.$message.warning(res.msg)
                    }
            },
            //现实当前的内容
            showCurrentItem(item){
              
              this.showCurrentButton = true;
              // let w = document.getElementById("modalRight").offsetWidth;
              // let h = document.getElementById("modalRight").offsetHeight;
              item.wRatio = 480/item.fWidth;
              item.hRatio = 280/item.fHeight;

              this.currentItem = item;
            },
            /**
             * 跳到第几页
             */
            goToPage(page) {
                this.pager.currentPage = page;
                this.getTemplatePages();
            },
            /**
             * 预览资源
             * @param resource
             */
            previewResource(resource){
                let url = resource.fType === 1 ? this.pictureUrl + resource.fUrl : resource.fUrl;

                this.$preview(resource.fType, resource.fCoveredType, url);
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
        }
    }
</script>
<style lang="scss">
  .recourse-info {
       width: 100%;
       height: 146px;
       position: relative;
       display: flex;
       align-items: center;
       justify-content: center;
       
  }
  .recourse-info-template{
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
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
    .preview-thumbnail-div{
        position: relative;
        transform-origin: 0 0;
        box-sizing: border-box;
        .preview-layout-div {
            border: 2px solid rgb(36, 131, 255);
            position: absolute;
        }
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
    
    // 页面主题部分
  .data-main {
    display: flex;
    width: 100%;
    margin-bottom: 200px;
    padding: 0 30px;
    box-sizing: border-box;
    
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
  .new-modal-content{
        padding-left: 20px;
        padding-right: 20px;
        margin: 0 -20px;
        padding-bottom: 10px;
        overflow-y: auto;
        display: flex;
        flex-direction: row;
    .modal-left{
          width: 200px;
          display: flex;
          flex-direction: column;
          min-width: 200px;
        .modal-left-leftText{
            color: #fff;
            font-size: 14px;
            margin-right: 10px;
        }
        .modal-left-rightText{
            color: rgb(36, 131, 255);
            font-size: 14px;
        }
    }
    .modal-right{
        width: 500px;
        height: 300px;
        overflow: hidden;
        display: block;
        min-width: 500px;
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

    // .el-pager {
    //     .number {
    //         font-size: 14px;
    //         color: #666;
    //         background-color: #000;

    //         &.active {

    //         }
    //     }
    // }
</style>
