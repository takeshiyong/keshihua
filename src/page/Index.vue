/*
* @Modified:
* 1. 元实   2019-12-06  刷新后，菜单标签应该是和刷新之前一样的
*/


<template>
    <div class="body" id="body">
      <div class="resource-header" id="header">
          <div class="header-top" id="header-top">
              <div style="margin-right: 20px;">
                <el-dropdown @command="handleCommand">
                    <span style="color: #bcc9d4;font-size: 12px;cursor: pointer;">{{userName}}</span>
                    <i class="el-icon-caret-bottom" style="color: #bcc9d4;cursor: pointer;"></i>
                    <el-dropdown-menu slot="dropdown" >
                      <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span></span>
              </div>
              <i v-if="showSet" @click="showSettingModal" class="el-icon-s-tools" style="margin-right: 30px;line-height: 33px;cursor: pointer;"></i>
          </div>
          <div class="header-imgOne nav-hide" ref="one">
              <span class="resource-text">ResourceV · 大屏资源</span>
              <span class="resource-subText">面向开发者的大屏管理工具，足够专业，才能激发更多可能</span>
          </div>
          <div class="header-imgTwo nav-show" ref="two">
              <span class="resource-text">Welcom To ResourceV</span>
              <span class="resource-subText">面向开发者的大屏管理工具，足够专业，才能激发更多可能</span>
          </div>
          <div class="resource-bottom" id="nav">
            <canvas id="canvas-15" width="1920" height="73" style="position: absolute; z-index: 0; bottom: -4px;left: 0px; width: 1920px; height: 73px;backgroundColor: transparent"/>
            <div class="nav-box">
                <!--元实 2019-12-06 -->
              <div v-for="(menuItem, idx) in menuItems" class="nav-link" @click="routerLink(idx, menuItem)">
                <i :class='changeIcon(menuItem)' style="color: #fff;marginRight: 5px;font-size: 14px"></i>
                <span style="color: #fff;fontSize: 15px;">{{ menuItem.fName }}</span>
              </div>
                <!-- 元实 2019-12-06 -->
            </div>
            <div id="shadow" class="resource-shadow"></div>
          </div>
      </div>
      <img id="canvas-bg" src="../image/index/1571105628(1).png" style="display: none"/>
      <div class="modal-style" v-if="settingModal">
          <div class="addModal">
            <div class="modal-top">
              <span style="color: #2483ff;font-size: 16px">设置</span>
              <div class="close-button" @click="closeSettingModal()"> 
                <i style="color: #2483ff;font-size:18px;" class="el-icon-close close-btn" ></i>
              </div>
            </div>
            <div class="limit-height">
              <div class="menu">
                <span v-for="(item,index) in leftMenu" :key="item.fid" :class="item.active ? 'active': ''" @click="leftMenuClick(item,index)">{{item.name}}</span>
              </div>
              <div class="content-setting">
                <accountManage v-if="activeIndex == 0"/>
                <roles v-else-if="activeIndex == 1"/>
                <systemParam v-else-if="activeIndex == 2"/>
              </div>
            </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
</template>
<script>
  import { roleService } from '@/api/system';
  import { CatalogService } from '@/api/service';
  import accountManage from './setting/accountManage';
  import roles from './setting/roles';
  import systemParam from './setting/systemParam';
  import {common} from '@/utils/common'
  export default {
      name: 'index',
      components: {
        accountManage, roles, systemParam
      },
      data() {
        return{
          leftMenu: [
            {name: '账号管理', fid: 1, active: true},
            {name: '角色权限', fid: 2},
            {name: '系统参数', fid: 3},
          ],
          settingModal: false,
          activeIndex: 0,
          show: false,
          // 滑动条
          scrollBar: {
            x: 300,
            point: 180,
            currentWidth: 0
          },

          menuItems: JSON.parse(common.getStore('userMenu')),
          // canvas相关参数
          menuTabsCoords: [0, 170, 320, 470, 620, 770, 920, 1070],
          idx: 0,
          bar:{
            x1: 0,
            y1: 0,
            width: 300
          },
          tab:{
            x: 0,
            width: 160
          },
          maxWidth: 1920,
          canvas: null,
          ctx: null,
          timer: null,
          userName: "",
          showSet: false,    //展示设置按钮
          masterId: "",     //管理员id
        }
      },
      mounted() {
        this.getMasterId();
        this.getCurrentRole()
        // this.drawCanvas();
        this.getPageNumber();
        this.fixedLayout();
        this.changeShow();
        this.menuItemsCoords();
        this.canvas = document.getElementById('canvas-15');
        this.ctx = this.canvas.getContext('2d');
        this.drawMenuLine();
        requestAnimationFrame(this.animateBarStep);
        this.setInitialMenuTab();  //元实 2019-12-06
        this.userName = common.getStore('userName');
      },

      methods: {
        //查询当前登录用户的角色列表
        async getCurrentRole(){
          const res = await roleService.getCurrentRole();
          if(res.success){
            res.obj.map((item) => {
              if(item.fId == this.masterId){
                this.showSet = true;
                return;
              }
            })
          }else{
            console.log(res.msg);
          }
        },
        /**
             * 
             * 获取打开资源路径
             */
        async getMasterId(){
          let res = await CatalogService.getDictionaryContext("roleId","master");
          if (res.success) {
            if (res.obj != null) {
                this.masterId = res.obj.fItemValue;
            } else {
                this.masterId = "";
            }
          } else {
              this.$message.warning(res.msg)
          }
        },
      /**
       * 页面
       * @author 元实 2019-12-06
       */
        setInitialMenuTab() {
            const idx = this.getPageNumber();

            this.selectMenuItem(idx);
        },

      /**
       * 获取页面的索引
       * @author 元实 2019-12-06
       */
        getPageNumber() {
            const path = this.$router.currentRoute.fullPath;
            return this.menuItems.findIndex(item => item.fUrl === path);
        },

        //退出
        handleCommand(command){
           if(command == "退出登录"){
             this.$router.replace({ path: '/' });
              common.delToken();
              common.delStore('userName');
              common.delStore('userId');
           }
        },
        showSettingModal() {
          this.leftMenu = [
            {name: '账号管理', fid: 1, active: true},
            {name: '角色权限', fid: 2},
            {name: '系统参数', fid: 3},
          ];
          this.activeIndex = 0;
          this.settingModal = true;
        },
        closeSettingModal() {
          this.settingModal = false;
        },

      /**
       * 给菜单项设置位置
        */
        menuItemsCoords() {
            this.menuTabsCoords = this.menuItems.map((item, idx) => {
                if (idx === 0) {
                    return 0;
                } else {
                    return 170 + (150 * (idx - 1));
                }
            });

        },

        drawMenuLine() {
          this.ctx.lineWidth = 2;
          this.ctx.shadowOffsetX = 0;
          this.ctx.shadowOffsetY = 0;
          this.ctx.shadowBlur    = 5;
          this.ctx.strokeStyle = '#0C58AF';
          this.ctx.shadowColor = '#0C58AF';

          this.drawLine(0, this.tab.x - 40, 50, '#0C58AF');
          this.drawActiveTab();
          this.drawLine(this.tab.x + this.tab.width, this.maxWidth, 50, '#0C58AF');
        },
        drawActiveTab() {
          this.drawCurve(this.tab.x - 20, this.tab.x, 50, 3, '#0C58AF');		
          this.drawLine(this.tab.x, this.tab.x + this.tab.width - 40, 3, '#0C58AF');
          this.drawCurve(this.tab.x + this.tab.width - 20, this.tab.x + this.tab.width, 3, 50, '#0C58AF');
        },
        // 绘制透明线
        drawTransparentLine(x1, x2, y) {
          const img = document.getElementById("canvas-bg");
          const pat = this.ctx.createPattern(img ,"repeat");
          this.ctx.fillStyle = pat;
          this.ctx.strokeStyle = 'red';
          this.ctx.beginPath();
          this.ctx.moveTo(x2-8, 50);
          this.ctx.lineTo(x2-8, y);
          this.ctx.lineTo(x1, y);
          this.ctx.lineTo(x1, !this.idx ? 3 : 50);
          this.ctx.fill();
          this.ctx.stroke();
        },
        drawLine(x1, x2, y, color) {
          this.ctx.beginPath();
          this.ctx.moveTo(x1, y);
          this.ctx.lineTo(x2, y);
          this.ctx.stroke();
        },
        drawCurve(x1, x2, y1, y2, color) {
          this.ctx.moveTo(x1 - 20, y1);
          this.ctx.bezierCurveTo(x1, y1, x1, y2, x2, y2);
          this.ctx.stroke();
        },
        animateBarStep() {
          this.animateRect();		
          requestAnimationFrame(this.animateBarStep);
        },
        animateRect() {
          this.drawRect('#0C58AF', this.bar.width, 53, false);
          this.calcBarPosition();
          this.drawRect('red', this.bar.width, 53, true);
        },
        drawRect(color, width, height, hasGradient) {
          if (hasGradient) {
            const gradient = this.ctx.createLinearGradient(this.bar.x1, this.bar.y1, this.bar.x1 + width, this.bar.y1);

            gradient.addColorStop(0, '#0C58AF');
            gradient.addColorStop(3/4, '#87D1FB');
            gradient.addColorStop(1, '#0C58AF');

            this.ctx.fillStyle = gradient;
          } else {
            this.ctx.fillStyle = color;
          }

          this.ctx.globalCompositeOperation = 'source-atop'; 
          this.ctx.fillRect(this.bar.x1, this.bar.y1, width, height); 
        },
        calcBarPosition(maxX, start) {
          if (this.bar.x1 < this.maxWidth) {
            this.bar.x1 += 10;
          } else {
            this.bar.x1 = 0;
          }
        },
        selectMenuItem(idx) {
          const endX = this.menuTabsCoords[idx];
          this.idx = idx;
          this.animateTab(endX, this.tab.x < endX);
        },
        animateTab(endX, isForward) {
          if (isForward && (this.tab.x >= endX)) {
            return;
          }
          if (!isForward && (this.tab.x <= endX)) {
            return;
          }
          this.canvas.width = this.canvas.width;
          let x = isForward ? this.tab.x + 40 : this.tab.x - 40;
          // this.tab.x = isForward ? x > endX
          if (isForward) {
            this.tab.x = x >= endX ? endX : x
          } else {
            this.tab.x = x <= endX ? endX : x
          }
          this.drawMenuLine();
          this.animateRect();
          requestAnimationFrame(this.animateTab.bind(null, endX, isForward));
        },
        // 滚动到一定区域使导航固定
        fixedLayout() {
          document.getElementById('body').onscroll = function () {
            const topScroll = document.getElementById('body').scrollTop;//滚动的距离,在距离顶部的距离
            const bignav = document.getElementById("nav");//获取到导航栏id
            const header = document.getElementById("header");
            const headerTop = document.getElementById("header-top");
            const navHeight = bignav.offsetTop;
            if(topScroll >= 199){
                headerTop.style.width = '50%'
                bignav.style.position = 'fixed';
                bignav.style.paddingTop = '10px';
                bignav.style.top = '3px';
                bignav.style.background= '#010305';
                bignav.style.zIndex = 2;
                header.style.backgroundColor = '#010305';
            }else{ 
                headerTop.style.backgroundImage = 'linear-gradient(to bottom , #000, rgba(0, 0, 0, 0.1))';
                headerTop.style.width = '100%'
                bignav.style.position = 'absolute';
                bignav.style.paddingTop = '0px';
                bignav.style.top = 'auto';
                bignav.style.zIndex = 999;
                bignav.style.background= 'transparent';
                header.style.backgroundColor = 'transparent';
            }
          }
        },
        changeShow () {
          let timeId = setInterval(() => {
              this.show = !this.show
              if (this.show) {
                if (this.$refs.one) 
                  this.$refs.one.className = "header-imgOne nav-show"
                if (this.$refs.two) 
                  this.$refs.two.className = "header-imgTwo nav-hide" 
              } else {
                if (this.$refs.one) 
                  this.$refs.one.className = "header-imgOne nav-hide" 
                if (this.$refs.two) 
                  this.$refs.two.className = "header-imgTwo nav-show"
              }
          },3000)
        },
        //页面跳转
        routerLink(idx, path) {
          this.selectMenuItem(idx);
          this.$router.push(`${path.fUrl}`)
        },
        // 左侧列表切换
        leftMenuClick(item, index) {
          for (let obj of this.leftMenu) {
            obj.active = false;
          }
          item.active = true;
          this.activeIndex = index;
          this.leftMenu = [...this.leftMenu];
        },
        //修改 icon
        changeIcon(menu){
          if(menu.fSort == 1){
            return menu.fIcon;
          }else{
            return menu.fIcon + ' ' + "dvIcon";
          }
        }
      }
  }

</script>

<style lang="scss" scoped>
  .modal-style {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.35);
    overflow: hidden;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1111;
    display: flex;
    justify-content: center;
    align-items: center;
    .addModal {
      position: relative;
      min-width: 400px;
      max-width: 80%;
      background: #303640;
      color: #fff;
      padding: 16px 0;
      z-index: 1;
      cursor: default;
      .modal-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 0 18px 0;
        border-bottom: 1px solid #5A6271;
        margin: 0 15px;
        .close-button {
          cursor: pointer;
          width: 16px;
          height: 16px;
          font-size: 0;
          .close-btn {
            transition: transform 0.5s;
          }
        }
        
        .close-button:hover {
          .close-btn {
            transform:rotate(90deg);
            -ms-transform:rotate(90deg); 	/* IE 9 */
            -moz-transform:rotate(90deg); 	/* Firefox */
            -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
            -o-transform:rotate(90deg); 	/* Opera */
          }
        }
      }
    }
    .addModal::before {
          content: '';
          position: absolute;
          display: block;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 2px;
          background-image: linear-gradient(270deg,#00deff 0,#2483ff 74%);
    }
  }
  .datav-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 10px 25px 0 25px;
    box-sizing: border-box;
  }
  .limit-height {
    height: 700px;
    width: 1200px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 10px;
    padding: 0 17px;
    display: flex;
    .menu {
      width: 240px;
      border-right: 1px solid #5A6271;
      height: 700px;
      box-sizing: border-box;
      span {
        display: block;
        color: #fff;
        font-size: 14px;
        line-height: 40px;
        border-bottom: 1px solid #5A6271;
        box-sizing: border-box;
        margin-right: 10px;
        padding: 0 5px;
        cursor: pointer;
        background-image: linear-gradient(270deg,rgba(0,0,0,0) 0,rgba(0,0,0,0) 74%);
      }
      .active {
        color: #fff;
        background-image: linear-gradient(270deg,#1279FF 0,#2483ff 74%);
      }
      span:hover {
        color: #fff;
        background-image: linear-gradient(270deg,#1279FF 0,#2483ff 74%);
      }
    }
    .content-setting {
      width: 960px;
      height: 690px;
    }
  }
  .limit-height::-webkit-scrollbar {
    background: 0 0;
    width: 4px;
    height: 4px;
  }
  
  .limit-height::-webkit-scrollbar-thumb {
    background: rgba(153,173,181,.2);
  }
  .limit-height::-webkit-scrollbar-track {
    background: 0 0;
  }
  .header-top {
    position: fixed;
    top: 0;
    width: 100%;
    height: 30px;
    // background-color: rgba(0, 0, 0, 0.5);
    background-image: linear-gradient(to bottom , #000, rgba(0, 0, 0, 0.1));
    right: 0px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    i,span {
      color: #BCC9D4;
    }
  }
  .body {
    background: #010305;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  span {
    font-size: 14px;
  }
  .nav-show {
    opacity: 1;
    z-index: 1;
  }
  .nav-hide {
    opacity: 0;
  }
  /* // 头部展示栏 */
  .resource-header {
    width: 100%;
    height: 290px;
    position: relative;
    
    .header-imgOne{
      width: 100%;
      height: 290px;
      position: absolute;
      background-image: url('../image/index/header-bg.png');
      background-size: 100% 100%;
      transition: .5s opacity cubic-bezier(.4,0,1,1);
    }
    .header-imgTwo{
      width: 100%;
      height: 290px;
      position: absolute;
      background-image: url('../image/index/header-bg1.png');
      background-size: 100% 100%;
      transition: .5s opacity cubic-bezier(.4,0,1,1);
    }
    .resource-text {
        font-family: "Microsoft YaHei","Helvetica Neue",Arial,sans-serif;
        background: linear-gradient(to right, #A0E5FF, #2CD5FF);
        -webkit-background-clip: text;
        color: transparent;
        font-weight: 600;
        font-size: 46px;
        position: absolute;
        left: 40px;
        top: 70px;
        letter-spacing: 1px;
    }
    .resource-subText {
      color: #96B5C4;
      left: 40px;
      top: 135px;
      position: absolute;
      letter-spacing: 2px;
      font-size: 18px;
    }
    .resource-bottom {
      width: 100%;
      position: absolute;
      bottom: 20px;
      height: 61px;
      z-index: 999;
    }
    .nav-box {
        position: relative;
        .nav-link {
          transition: color .2s;
          text-decoration: none!important;
          display: inline-block;
          color: #b9c2cc;
          width: 150px;
          line-height: 40px;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
          // z-index: 1000;
        }
    }
    
    .resource-shadow {
      position: absolute;
      height: 50px;
      width: 100%;
      background: linear-gradient(180deg,transparent,#010305);
      z-index: 1;
    }
  }
</style>
