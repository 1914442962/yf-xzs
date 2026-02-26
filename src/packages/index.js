import VxeModalContainer from "./vxe-modal-container";


const install = Vue => {
    Vue.use(VxeModalContainer);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    VxeModalContainer
};
