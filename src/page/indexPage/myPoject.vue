<template>
      <div class="data-main">
        <div class="data-grounp">
          <div class="tip">
            <span style="color: #fff">我的分组</span>
            <span></span>
          </div>
          <img id="canvas-bg" src="../../image/index/1571105628(1).png" style="display: none"/>
          <div :class="`${fourceIndex == index? 'manage-title-active':'manage-title'}`" v-for="(item,index) in screenList" :key="index" @click="chooseManage(item, index)">
            <span class="title">{{item.name}}</span>
            <span >{{item.num}}</span>
          </div>
        </div>
        <div class="data-screenList">
          <div class="project-header">
              <div class="header-left">
                <h2>{{screenData.name}}</h2>
                <span style="color: #2483ff;marginTop: 1px">{{screenData.num}}</span>
                <span style="color: #fff">个</span>
              </div>
              <div class="header-right">
                <div class="search">
                  <input v-model="input" placeholder="请输入内容" class="right-input"/>
                  <i class="el-icon-search" style="color: #bcc9d4"></i>
                </div>
                <div style="display: inline-block;margin-left: 10px">
                  <span style="color: #bcc9d4;font-size: 12px">按修改时间排序</span>
                  <i class="el-icon-caret-bottom" style="color: #bcc9d4"></i>
                </div>
              </div>
          </div>
          
          <div class="main-screen">
            <div class="my-screen first-scren"
              style="cursor: poniter" 
              @mouseenter="mouseenterAdd" 
              @mouseleave="mouseleaveAddOut"
              @click="addBigDemo"
            >
              <i class="dvIcon dvIcon-add1" style="color: #fff;marginRight: 5px;transition: .2s;" ref="addIcon"></i>
              <span style="color: #fff;font-size: 12px;marginTop: 10px;transition: .2s;" ref="addText">新增大屏项目</span>
            </div>
            <div 
              class="my-screen" 
              v-for="(item,index) in screenData.dataList" 
              :key="index" 
              style="opacity: 1; transform: scale(1);" 
              @mouseenter="mouseenterHandle(index)" 
              @mouseleave="mouseleaveHandle(index)"
            >
              <div class="screen">
                <div class="screen-info">
                  <img src="../../image/index/packinghouse.jpg" style="width: 100%"/>
                  <div class="screen-modal" :ref="`modal${index}`">
                  
                      <button class="resourcev-btn" @click="review(item)">预览</button>

                      <div class="showIcons">
                        <i class="dvIcon dvIcon-feiji showIcon"></i>
                        <i class="dvIcon dvIcon-laji showIcon" style="margin-left: 15px;margin-right: 15px"></i>
                        <i class="dvIcon dvIcon-yanjing showIcon"></i>
                    </div>
                  </div>
                </div>
                <div class="screen-main">
                  <span style="color: #fff;font-size: 12px">{{item.name}}</span>
                  <div>
                    <div class="currentState"> </div>
                    <span style="color: #fff;font-size: 12px">未投屏</span>
                  </div>
                </div>
              </div>
            </div>
      
          </div>
        </div>
        
      </div>
</template>

<script>
    
    export default {
        data(){
            return{
                
                // 资源数据
                screenList: [
                    { name: '正大资源',num: 11, dataList: [
                    {name: '产业链1', path: '/exploit'},
                    {name: '产业链2', path: '/industryChain'},
                    {name: '产业链3', path: '/exhibition'},
                    {name: '正大襄阳产业链', path: '/aa'},
                    {name: '总报表', path: '/Statement'},
                    {name: '正大襄阳园区', path: '/parks'},
                    {name: '正大襄阳屠宰厂', path: '/slaughterhouse'},
                    {name: '正大襄阳育肥场', path: '/fatten'},
                    {name: '正大襄阳食品加工厂', path: '/packinghouse', img: 'packinghouse.jpg'},
                    {name: '正大襄阳饲料厂', path: '/feedfactory'},
                    {name: '正大襄阳种猪场', path: '/boar'},
                    ]}
                ],
                // 左侧分组选中特效
                fourceIndex: 0,
                // 选中的分组数据
                screenData: { name: '正大资源',num: 11, dataList: [
                    {name: '产业链1', path: '/exploit'},
                    {name: '产业链2', path: '/industryChain'},
                    {name: '产业链3', path: '/exhibition'},
                    {name: '正大襄阳产业链', path: '/aa'},
                    {name: '总报表', path: '/Statement'},
                    {name: '正大襄阳园区', path: '/parks'},
                    {name: '正大襄阳屠宰厂', path: '/slaughterhouse'},
                    {name: '正大襄阳育肥场', path: '/fatten'},
                    {name: '正大襄阳食品加工厂', path: '/packinghouse'},
                    {name: '正大襄阳饲料厂', path: '/feedfactory'},
                    {name: '正大襄阳种猪场', path: '/boar'},
                ]},
                // 显示遮罩层的下标
                showModalIndex: '',
                // 滑动条
                scrollBar: {
                    x: 300,
                    point: 180,
                    currentWidth: 0
                },
                //大屏名字
                screenName: "",
                //大屏高
                screenHeight: "",
                //大屏宽
                screenWidth: "",
                //搜索内容
                input: ''
            }
        },
        
        methods: {
            // 点击分组 
            chooseManage(item, index) {
                this.fourceIndex = index;
                this.screenData = item;
            },
            // 点击预览
            review(item) {
                const { href } = this.$router.resolve({
                    path: item.path
                })
                window.open(href, '_blank');
            },
            // 鼠标移入事件 展示预览遮罩层
            mouseenterHandle(index) {
                if (this.$refs[`modal${index}`][0]) {
                    this.$refs[`modal${index}`][0].style.opacity = 1;
                }
            },
            // 鼠标移出事件 关闭预览遮罩层
            mouseleaveHandle(index) {
                if (this.$refs[`modal${index}`][0]) {
                    this.$refs[`modal${index}`][0].style.opacity = 0;
                }
            },
            // 鼠标移入事件 展示新增字体变大
            mouseenterAdd(){
              this.$refs.addText.style.fontSize = '16px';
              this.$refs.addIcon.style.fontSize = '16px'
            },
            // 鼠标移出事件 展示新增字体变小
            mouseleaveAddOut(){
              this.$refs.addText.style.fontSize = '12px';
              this.$refs.addIcon.style.fontSize = '12px'
            },
            //鼠标点击 跳转页面
            addBigDemo(){
              const {href} = this.$router.resolve({
                    path:"/createScreen",
                });
                window.open(href);//, '_blank'
            },
            //鼠标点击关闭弹框
            closeModal(){
              this.showModal = false
            },
        }
    }
</script>

<style lang="scss" scoped>
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
        .header-right {
            display: inline-block;
            align-items: center;
            display: flex;
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
    background: green
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
  
</style>