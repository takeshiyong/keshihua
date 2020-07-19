const getters = {
    tagsList: state => state.system.tagsList,
    menuList: state => state.system.menuList,
    resourceList: state => state.system.resourceList,
    templateList: state => state.system.templateList,
    selectedInstanceCompList:state => state.system.selectedInstanceCompList,
    elementActive:state => state.system.elementActive,
    getActive: state => {
        for (let i = 0, l = state.system.resourceList.length; i < l; i++) {
            let rect = state.system.resourceList[i];

            if (rect.active) {
                return i;
            }
        }
        return null;
    },
    getActiveTemplate: state => {
        for (let i = 0, l = state.system.templateList.length; i < l; i++) {
            let rect = state.system.templateList[i];

            if (rect.active) {
                return i;
            }
        }
        return null;
    },
    showTemplate: state => state.system.showTemplate,
    // 我的组件屏幕大小
    myComponentScreenSize: state => state.system.myComponentScreenSize,
    // 页面中所有的组件
    allComponents: state => state.system.allComponents,
};
export default getters;
