<!--中长期厂站选择-->
<template>
    <div class="gljh" @close="$emit('close')">
        <div class="top-tip">
            请选择停电厂站类型
        </div>
        <div class="bottom-button">
            <div v-if="showOMS" class="search-btn " @click="selectCZ('czOMS')">OMS场所</div>
            <div class="search-btn righ-search" v-show="showD5000" @click="selectCZ('czD5000')">
                D5000场所
            </div>
            <div v-if="showDky" class="search-btn righ-search" @click="selectCZ('DKY')"
                 v-show="!unshowDKY">
                调控云场所
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
import czOMS from "@/views/czsb/zcq-cz-oms/src/zcq-cz-oms";
import czD5000 from "@/views/czsb/zcq-cz-d5000/src/zcq-cz-d5000";
import ZcqCzDky from "@/views/czsb/zcq-cz-dky";


export default {
    name: "czSelect",
    props: {
        // 是否展示D5000选项
        showD5000: {
            type: Boolean,
            default: true,
        },
        showDky: {
            type: Boolean,
            default: true,
        },
        omsDefaultNode: Object,
        d5000DefaultNode: Object,
        updateSource: String,
        unshowDKY: Boolean,
        showOMS: {
            type: Boolean,
            default: true
        },
        id: {
            type: String,
            default: ''
        },

    },
    components: {},
    mounted() {
    },
    data() {
        return {
        }
    },
    methods: {
      selectCZ(flag) {
        if (flag == 'czOMS') {
          this.$vxeModal.show(czOMS, {
            omsDefaultNode: this.omsDefaultNode,
            updateSource: this.updateSource,
            id: this.id,
          }, {
            width: 1010,
            height: 650,
            title: '厂站选择'
          }, {
            refreshCZXX: (e) => {
              this.$emit('refreshCZXX', e);
              this.$emit('close');
            },
          })

        } else if (flag == 'czD5000') {
          this.$vxeModal.show(czD5000, {
            d5000DefaultNode: this.d5000DefaultNode,
            updateSource: this.updateSource,
            id: this.id,
          }, {
            width: 1010,
            height: 650,
            title: '厂站选择-D5000'
          }, {
            refreshCZXX: (e) => {
              console.log(e)
              this.$emit('refreshCZXX', e);
              this.$emit('close');
            },
          })
        } else if (flag == 'DKY') {
          // TODO 本地数据调控云
          this.$vxeModal.show(ZcqCzDky, {
            d5000DefaultNode: this.d5000DefaultNode,
            updateSource: this.updateSource,
            id: this.id,
          }, {
            width: 1010,
            height: 650,
            title: '厂站选择-调控云'
          }, {
            refreshCZXX: (e) => {
              this.$emit('refreshCZXX', e);
              this.$emit('close');
            },
          })
        }
      },

    },
}
</script>
<style scoped lang="scss">
.gljh {
    width: 100%;
    height: 100%;

    .top-tip {
        height: 80px;
        width: 100%;
        line-height: 100px;
        text-align: center;
        font-size: 15px;
    }

    .bottom-button {
        width: 100%;
        height: calc(100% - 100px);
        display: flex;
        justify-content: center;

        .search-btn {
            width: 23%;
            height: 2.14286rem;
            box-sizing: border-box;
            margin-left: 5%;
            margin-right: 5%;
            background: #25aea9;
            border-radius: 0.35714rem;
            color: #fff;
            cursor: pointer;
            text-align: center;
            padding: 0.35714rem 0.71429rem;
            float: left;
            line-height: 20px;
        }

        /* .righ-search {
             !*float: right;*!
             margin-left: 5%;
             margin-right: 5%;
             !*margin-left: 0;*!
         }*/
        .search-btn:hover {
            opacity: 0.7;
        }
    }
}
</style>
