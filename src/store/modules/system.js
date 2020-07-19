const system = {
    state: {
        menuList: [],//  menuList
        resourceList: [], // 场景
        templateList: [], // 模板
        selectedInstanceCompList:[], // 当前选中的组件
        elementActive: false,// 参数显示的激活
        showTemplate: false, // false 展示模板,true不展示模板
        myComponentScreenSize: {
            w: 400,
            h: 300,
            backgroundColor: '#2A3F50',
            zoomWay: 'scale(1)'
        },// 我的组件屏幕大小
        allComponents: [], //所有组件块
    },

    mutations: {
        // tagsList
        SET_TAGSLIST: (state, res) => {
            state.tagsList = res;
        },
        // menuList
        SET_MENULIST: (state, res) => {
            state.menuList = res;
        },
        //重置templateList
        DELECT_TEMPLATELIST: (state,res) => {
            state.templateList = res;
        },
        // 新增组件时
        ADD_SELECTED_COMP: (state, payload) => {
            if(payload.clear){
                state.selectedInstanceCompList = [];
            }
            if (!state.selectedInstanceCompList.includes(payload.obj)) {
                state.selectedInstanceCompList.push(payload.obj);
            }
        },
        // 删除组件时
        DELETE_SELECTED_COMP: (state, obj) => {
            state.selectedInstanceCompList.forEach((item, index, array) => {
                if (item.instanceId == obj.instanceId) {
                  array.splice(index, 1);
                }
              });
        },
        // 更新组件（1.组件右侧参数change时 2.中间组件位置、大小等发生变化）
        UPDATE_SELECTED_COMP: (state, payload) => {
            //payload={id:'',value:'',type:''}  
            let instanceIndex = state.selectedInstanceCompList.findIndex((element) => element.instanceId==payload.id)
            let instanceComp = state.selectedInstanceCompList[instanceIndex];
            // 组件右侧参数change时，对于change的数据进行判断来维护当前组件
            if(payload.type=='attr'){
                instanceComp.attr = payload.value;
            }else if(payload.type=='styleConfig'){
                instanceComp.styleConfig = payload.value;
            }else if(payload.type=='data'){
                instanceComp.data = payload.value;
            }

        },
        ENABLE_ACTIVE: (state, payload) => {
            if (payload.type == 'template') {
                state.templateList[payload.id].active = true;
            } else {
                state.resourceList[payload.id].active = true;
            }

        },
        DISABLE_ACTIVE: (state, payload) => {
            if (payload.type == 'template') {
                state.templateList[payload.id].active = false;
            } else {
                state.resourceList[payload.id].active = false;
            }
        },
        CHANGE_HEIGHT: (state, payload) => {
            if (payload.type == 'template') {
                state.templateList[payload.id].height = payload.height;
            } else {


                state.resourceList[payload.id].height = payload.height;
            }
        },

        CHANGE_WIDTH: (state, payload) => {
            if (payload.type == 'template') {
                state.templateList[payload.id].width = payload.width;
            } else {
                state.resourceList[payload.id].width = payload.width;
            }
        },

        CHANGE_TOP: (state, payload) => {
            if (payload.type == 'template') {
                state.templateList[payload.id].top = payload.top;
            } else {
                state.resourceList[payload.id].top = payload.top;
            }
        },

        CHANGE_LEFT: (state, payload) => {
            if (payload.type == 'template') {
                state.templateList[payload.id].left = payload.left;
            } else {
                state.resourceList[payload.id].left = payload.left;
            }
        },
        CHANGE_ZINDEX: (state, payload) => {
            if (payload.type == 'template') {
                state.templateList[payload.id].zIndex = payload.zIndex;
            } else {
                state.resourceList[payload.id].zIndex = payload.zIndex;
            }
        },
        SET_ELEMENTACTIVE: (state, res) => {
            state.elementActive = res;
        },
        SET_COMPONENTS_SREENSIZE: (state, res) => {
            state.myComponentScreenSize = res;
        },
        SET_ALL_COMPONENTS: (state, res) =>{
            state.allComponents = res;
        },
        SET_ALL_RESOURCELIST: (state, res) => {
            state.resourceList = res;
        },
        SET_ALL_TEMPLATE: (state, res) => {
            state.templateList = res;
        },
        SET_SHOWTEMPLATE: (state, res) => {
            state.showTemplate = res;
        }
    },
    actions: {
        setElementActive: ({ commit }, obj) => {
            commit('SET_ELEMENTACTIVE', obj)
        },
        setShowTemplate: ({ commit }, obj) => {
            commit('SET_SHOWTEMPLATE', obj)
        },
        //  清空
        delectTemplateList: ({commit}, obj) => {
            commit('DELECT_TEMPLATELIST', obj)
        },
        // tagsList
        setTagsList: ({ commit }, obj) => {
            commit('SET_TAGSLIST', obj)
        },
        //  menuList
        setMenuList: ({ commit }, obj) => {
            commit('SET_MENULIST', obj)
        },
        addSelectedComp({ commit },{obj,clear}) {
            commit('ADD_SELECTED_COMP', {obj,clear});
        },
        deleteSelectedComp({ commit },obj) {
            commit('DELETE_SELECTED_COMP', obj);
        },
        updateSelectedComp({ commit },{id,value,type}) {
            commit('UPDATE_SELECTED_COMP', {id,value,type});
        },
        setActive({ commit, state }, { id, type }) {
            let list = state.resourceList;
            if (type == 'template') {
                list = state.templateList;
            }
            for (let i = 0, l = list.length; i < l; i++) {
                if (i === id) {
                    commit('ENABLE_ACTIVE', {id:i, type});
                    continue;
                }

                commit('DISABLE_ACTIVE', {id:i, type});
            }
        },
        unsetActive({ commit }, { id, type }) {
            commit('DISABLE_ACTIVE', {id, type});
        },
        setWidth({ commit }, { type, id, width }) {
            commit('CHANGE_WIDTH', { type, id, width });
        },

        setHeight({ commit }, { type, id, height }) {
            commit('CHANGE_HEIGHT', { type, id, height });
        },

        setTop({ commit }, { type, id, top }) {
            commit('CHANGE_TOP', { type, id, top });
        },

        setLeft({ commit }, { type, id, left }) {
            commit('CHANGE_LEFT', { type, id, left });
        },
        setMyComponentScreenSize({ commit }, obj ){
            commit('SET_COMPONENTS_SREENSIZE', obj);
        },
        setAllComponents({ commit }, obj){
            commit('SET_ALL_COMPONENTS', obj);
        },
        changeZToBottom({ commit, state }, { type, id }) {
            let list = state.resourceList;
            if (type == 'template') {
                list = state.templateList
            }
            if (list[id].zIndex === 1) {
                return
            }

            commit('CHANGE_ZINDEX', { type: type, id, zIndex: 1 });

            for (let i = 0, l = list.length; i < l; i++) {
                if (i !== id) {
                    if (list[i].zIndex === list.length) {
                        continue
                    }
                    commit('CHANGE_ZINDEX', { type: type, id: i, zIndex: list[i].zIndex + 1 });
                }
            }
        },
        changeZToTop({ commit, state }, {type, id }) {
            let list = state.resourceList;
            if (type == 'template') {
                list = state.templateList
            }
            if (list[id].zIndex === list.length) {
                return
            }

            commit('CHANGE_ZINDEX', {type: type, id, zIndex: list.length });

            for (let i = 0, l = list.length; i < l; i++) {
                if (i !== id) {
                    if (list[i].zIndex === 1) {
                        continue
                    }
                    commit('CHANGE_ZINDEX', {type: type, id: i, zIndex: list[i].zIndex - 1 });
                }
            }
        },
        setData({commit}, obj){
            commit('SET_ALL_RESOURCELIST', obj);
        },
        setTemplateData({commit}, obj){
            commit('SET_ALL_TEMPLATE', obj);
        }
    },
};
export default system;
