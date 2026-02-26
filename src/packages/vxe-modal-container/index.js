import VxeModalContainer from './VxeModalContainer';
import VxeUI from "vxe-pc-ui";

let defaultOptions = {
    resize: true,
    minWidth: 460,
    minHeight: 320
}

let rootInstance = null;

VxeModalContainer.install = Vue => {

    let _self;

    Vue.component(VxeModalContainer.name, VxeModalContainer);

    Vue.mixin({
        beforeMount() {
            if (rootInstance == null) {
                rootInstance = this.$root
                _self = this;
            }
        },
        destroyed() {
            // rootInstance = null;
        }

    })

    function getModalsContainer(root) {
        return root._vxe_dynamicContainer
    }

    const vxeModal = {
        show(modal, props, params, events) {
            if (null == rootInstance) {
                console.log(_self)
                rootInstance = _self.$root;
            }
            const container = getModalsContainer(rootInstance);
            if (container) {
                container.add(modal, props, {
                    ...defaultOptions,
                    ...params
                }, events)
            }
        },
        changeSize(id, {width, height}) {
            const container = getModalsContainer(rootInstance);
            if (container) {
                container.changeSize(id, {
                    width, height
                })
            }
        },
        setDefaultOptions(option = defaultOptions) {
            this.defaultOptions = option;
        },
        closeAll() {
            VxeUI.modal.close();
        }
    }
    // Vue 3.0
    if (Vue.config.globalProperties) {
        Vue.config.globalProperties.$vxeModal = vxeModal;
        Vue.provide("$vxeModal",vxeModal)
    }

};

export default VxeModalContainer;
