import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  
  {
    path: '/',
    component: resolve => require(['../page/login.vue'], resolve),
  },
  {
    path: '/Index',
    component: resolve => require(['../page/Index.vue'], resolve),
    redirect:'/resourceGroup',
    children:[
          
          // 摄像头
          {
              path: '/myCamera',
              name: "myCamera",
              component: resolve => require(['../page/indexPage/myCamera.vue'], resolve),
              meta: { title: 'a7b8eac4a41811e8b12d708bcda4b2f0' }
          },
          // 客户端页面
          {
              path: '/client',
              name: 'client',
              component: resolve => require(['../page/indexPage/client.vue'], resolve),
              meta: { title: '599d0ddcaa7e4c0da1c88489131fcd98' }
          },
          // 循环组
          {
            path: '/loopGroup',
            name: 'loopGroup',
            component: resolve => require(['../page/indexPage/loopGroup.vue'], resolve),
            meta: { title: '9a424a41a41811e8b12d708bcda4b2f0' }
          },
            //场景管理
            {
              path: '/sceneManage',
              name: 'sceneManage',
              component: resolve => require(['../page/indexPage/sceneManage.vue'], resolve),
              meta: { title: '4d2705f9f9e04ff8b7ede4fe34cfe5d3' }
            },
            //模板管理
            {
              path: '/templateManage',
              name: 'templateManage',
              component: resolve => require(['../page/indexPage/templateManage.vue'], resolve),
              meta: { title: '17faf4ed428e45e1ababf56149668a0e' }
            },
            //资源组
            {
                 path: '/resourceGroup',
                 name: 'resourceGroup',
                 component: resolve => require(['../page/indexPage/resource-groups.vue'], resolve),
                 meta: { title: '8fcd023744d811e981ff000c29e4fd32' }
            },
            //播放组
            {
                path: '/resourcePlaying',
                name: 'resourcePlaying',
                component: resolve => require(['../page/indexPage/resource-playing.vue'], resolve),
                meta: { title: '8ffaad275d754a2cabfd37589fc9579a' }
            },
            //显示组
            {
                path: '/distributed',
                name: 'distributed',
                component: resolve => require(['../page/indexPage/distributed-resources.vue'], resolve),
                meta: { title: 'afe3cefaa41811e8b12d708bcda4b2f0' }
              },
        ]
  },
  { // 预览页面
    path: '/preview',
    name: 'preview',
    component: resolve => require(['../page/common/judgeReviewPage.vue'], resolve),
  },
  {
    path: '/addModal',
    name: 'addModal',
    component: resolve => require(['../page/createScreen/addModal.vue'], resolve),
  },
  {
    path: '/createScreen',
    name: 'createScreen',
    component: resolve => require(['../page/createScreen/createScreen.vue'], resolve),
  },
  {
    path: '/templateEdit',
    name: 'templateEdit',
    component: resolve => require(['../page/template/templateEdit.vue'], resolve),
  },
  {
    path: '/VScenePreview',
    name: 'VScenePreview',
    component: resolve => require(['../components/previewComponents/VScenePreview.vue'], resolve),
  },
  {
    path: '/testScocket',
    name: 'testScocket',
    component: resolve => require(['../components/testScocket.vue'], resolve),
  },
  { //元实投屏页面
    path: '/castScreenshots',
    name: 'castScreenshots',
    component: resolve => require(['../components/castScreenshots.vue'], resolve),
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: '/dataview-resource',
  routes
})

export default router
