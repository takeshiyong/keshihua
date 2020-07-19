import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import './assets/fonts/iconfont.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './main.css';
import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
import {common} from '@/utils/common'

// 图片路径
// Vue.prototype.pictureUrl = 'http://1.85.2.95:8219';
Vue.prototype.pictureUrl = 'http://39.98.176.241:8019';
// Vue.prototype.uploadUrl = 'http://1.85.2.95:8219/resource-service/';
Vue.prototype.uploadUrl = 'http://39.98.176.241:8019/resource-service/';


Vue.use(contentmenu);
Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;
Vue.config.productionTip = false


// 使用钩子函数对路由进行权限跳转
let DEFAULTURL = ['/','/castScreenshots','/testScocket','/addModal','/preview','/createScreen','/templateEdit','/VScenePreview']; // 默认权限路由



router.beforeEach((to, from, next) => {

    const role = common.getToken();
    if (to.path == '/') { // 跳转到login页面删除sessionStorage中存储的值
        // 清除token
        common.delToken();
        // 清除菜单权限
        common.delStore('userMenu');
        // 清除用户名和用户id
        common.delStore('userName');
        common.delStore('userId');
        
        return next();
    }
    // 默认路由跳转
    if (DEFAULTURL.indexOf(to.path) >= 0) {
        return next();
    }

    if (!role) { // 无token值
        if (to.path == '/') { // 无需token值跳转的页面
            return next();
        } else {
            return next('/')
        }
    } else { // 有token值
        if(!common.getStore('userMenu')) {
          return next('/')
        }
        let autho = JSON.parse(common.getStore('userMenu')); // 获取权限菜单 + 无需token值的页面
        let authoPath = [];
        for(let item of autho){
          if(item.fUrl == to.path){
            authoPath.push(item.fUrl)
          }
        }
        if(authoPath.includes(to.path)){
          return next()
        }else{
          return next('/')
        }
    }
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
