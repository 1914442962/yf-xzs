<template>
  <div class="vxe-modal-container">
    <div v-for="modal in modals" :key="modal.id" :id="'binfo-vxe-modal__' + modal.id">
      <vxe-modal
          :ref="'ref-modal-' + modal.id"
          :id="modal.id" v-bind="modal.modalAttrs" v-model="modal.value"
          @close="onVxeModalRemove(modal)">
        <template #default>
          <component
              :key="modals.id"
              :is="modal.component"
              v-bind="modal.componentAttrs"
              @close="remove(modal.id)"
              v-on="modal.modalListeners"
          />
        </template>
      </vxe-modal>
    </div>
  </div>
</template>

<script>
import {clone, find} from 'xe-utils'
import {Modal} from "vxe-pc-ui";

const PREFIX = '_dynamic_modal_'

const generateId = ((index = 0) => () => (index++).toString())()
let modals = []

export default {
  name: "VxeModalContainer",
  components: {
    Modal
  },
  data() {
    return {
      modals: []
    }
  },
  computed: {
    modalNum() {
      return this.modals.length;
    }
  },
  watch: {},
  created() {
    this.$root._vxe_dynamicContainer = this;
    // this.$root._vxe_dynamicContainer = this;
  },
  mounted() {

  },
  methods: {
    add(component, componentAttrs = {}, modalAttrs = {}, modalListeners = {}) {
      const id = modalAttrs.id || 'bf_vxe_modal_' + generateId()
      const name = modalAttrs.name || PREFIX + id
      this.modals.push({
        id,
        value: true,
        modalAttrs: {...modalAttrs, name},
        modalListeners,
        component,
        componentAttrs
      })
      // this.modals = clone(modals);
    },
    remove(id) {
      const index = this.modals.findIndex(v => v.id === id)

      if (index !== -1) {
        this.modals.splice(index, 1)
      }

      delete this.$refs['ref-modal-' + id];

      // this.modals = clone(modals);
    },
    changeSize(id, {width, height}) {
      let modal = find(this.modals, item => item.id === id);
      modal.modalAttrs.width = width;
      modal.modalAttrs.height = height;
      this.$refs['ref-modal-' + id][0].updatePosition();
    },
    onVxeModalRemove(modal) {
      let modalListeners = modal.modalListeners;
      this.remove(modal.id);
      if (modalListeners.close) {
        modalListeners.close(modal);
      }
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.vxe-modal--body) {
  padding: 0;
}
</style>

