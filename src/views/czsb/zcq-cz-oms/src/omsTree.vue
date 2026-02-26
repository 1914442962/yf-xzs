<template>
    <div id="oms-tree">
        <el-tree node-key='id' ref="tree" :expand-on-click-node="false"
                 :props="props" :default-expanded-keys='[omsDefaultNode.id]'
                 :load="loadNode" @node-click="clickEvent"
                 lazy highlight-current>
        </el-tree>

    </div>
</template>

<style>

</style>
<script>
import {
    loadOMSTree
} from '@/api/czsb-api'
import {mapState} from 'vuex'

export default {
    name: "oms-tree",
    props: {omsDefaultNode: Object},
    mounted() {
        console.log('最终传入Tree的node')
        console.log(this.omsDefaultNode)
        // this.$refs.tree.setCurrentKey('2A3287A6-6073-48F3-A096-8CD55E3D4A81-00068')
        this.$refs.tree.setCurrentKey(this.omsDefaultNode)
        this.$emit('changeTreeNode', {
            name: this.omsDefaultNode.area,
            pid: this.omsDefaultNode.id,
            level: 0,
            id: this.omsDefaultNode.id,
            disabled: true
        })
    },
    data() {
        return {
            // 网络是否正常保持链接
            newWportIsLink: false,
            props: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            count: 1,
            currentNode: {
                name: this.omsDefaultNode.area, pid: this.omsDefaultNode.id, disabled: true
            },
        }
    },
    methods: {
        // 懒加载
        loadNode(node, resolve) {
            this.currentNode = node.data;
            if (node.level == 0) {
                return resolve([
                    {
                        // name: '江苏省电力公司',
                        name: this.omsDefaultNode.area,
                        pid: this.omsDefaultNode.id,
                        level: 0,
                        id: this.omsDefaultNode.id,
                        disabled: true
                    },
                    {name: '线路', pid: '0', level: 0, id: 'XL', disabled: true, leaf: true}
                ]);
            } else if (node.level == 1) {
              return resolve(this.OMSCzList.map(item => {
                item.leaf = false;
                return item;
              }));
            } else {
                this.getLoad(resolve)
            }
        },
        getLoad(resolve) {

            loadOMSTree(this.currentNode).then(data => {
                this.newWportIsLink = true
                if (data && data.length == 0) {
                    this.newWportIsLink = false
                }
                return resolve(data);
            }).catch()
        },
        // 选全省
        doSelectProvince() {
            this.$refs.tree.setCurrentKey(this.omsDefaultNode)
            this.$emit('changeTreeNode', {
                name: this.omsDefaultNode.area,
                pid: this.omsDefaultNode.id,
                level: 0,
                id: this.omsDefaultNode.id,
                disabled: true
            })
        },
        // 选地区
        doSelectArea(areaCode) {
            this.$refs.tree.setCurrentKey(areaCode)
            this.$emit('changeTreeNode', areaCode)
        },
        clickEvent(node) {
            this.$emit('changeTreeNode', node)

        },

    },
    computed: {
        ...mapState(['token', "userInfo", "staticOMSxl", "OMSCzList"]),
    }
}
</script>

<style scoped lang="scss">
#self-tree {
    padding: 10px;
}

#oms-tree {
    overflow-y: auto;
    height: 550px;
}

</style>
