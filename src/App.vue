<template>
  <div class="app">

      <router-view/>
      <vxe-modal-container/>

  </div>
</template>

<script>
import {initPx2Rem} from "@/utils/convert-px.js";

export default {
  data() {
    return {
    }
  },
  created() {
    initPx2Rem();
  },

}
</script>