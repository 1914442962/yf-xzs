<template>
    <div id="d5000-tree">
        <el-tree node-key='id' ref="tree" :expand-on-click-node="false"
                 :props="props" :default-expanded-keys='[d5000DefaultNode.id]'
                 :load="loadNode" @node-click="clickEvent"
                 lazy highlight-current>
        </el-tree>
    </div>
</template>

<style>

</style>
<script>
import {mapState} from 'vuex'
import {loadD5000Tree} from "@/api/czsb-api";

export default {
    name: "d5000-tree",
    props: {
        d5000DefaultNode: Object,
    },
    mounted() {
        this.OriginalId = this.d5000DefaultNode.id;
        // this.$refs.tree.setCurrentKey('113715891127975937')
    },
    data() {
        return {
            // 网络是否正常保持链接
            newWportIsLink: false,
            // 初始最外层的节点,不可点击
            OriginalId: '',
            props: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            count: 1,
            currentNode: {
                name: this.d5000DefaultNode.area, pid: this.d5000DefaultNode.id, disabled: true
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
                        name: this.d5000DefaultNode.area,
                        pid: this.d5000DefaultNode.id,
                        level: 0,
                        id: this.d5000DefaultNode.id,
                        disabled: true
                    },
                    {name: '线路', pid: '0', CZID: 'XL', level: 0, id: 'XL', disabled: true, leaf: true}
                ]);
            } else if (node.level == 1) {
                return resolve(this.D5000CzList.map(item => {
                    item.leaf = false;
                    return item;
                }));
            } else {
                this.getLoad(resolve)
            }
        },
        getLoad(resolve) {

            loadD5000Tree(this.currentNode).then(data => {
                this.newWportIsLink = !(data && data.length == 0);
                return resolve(data);
            })
        },
        clickEvent(node) {
            if (node.id == this.OriginalId) {
                this.$refs.tree.setCurrentKey()
                return
            }
            this.$emit('changeTreeNode', node)

        },

    },
    computed: {
        ...mapState(['token', "userInfo", "staticOMSxl", "D5000CzList"]),
    }
}
</script>

<style scoped lang="scss">
#self-tree {
    padding: 10px;
}

#d5000-tree {
    overflow-y: auto;
    height: 550px;
}
</style>
