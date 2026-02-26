<template>
    <div id="d5000-tree">
        <el-tree node-key='id' ref="tree" :expand-on-click-node="false" :props="props"
                 :default-expanded-keys='defaultExpandedKeys' @node-click="clickEvent"
                 :data="treeData" highlight-current :filter-node-method="filterNode">
        </el-tree>
    </div>
</template>

<script>
    import {loadDkyTree} from '@/api/czsb-api'

    let timeoutId;
    let prevNode;
    export default {
        name: "dky-cz-tree",
        props: {
            treeFilterKey: {
                type: String,
                default: ''
            }
        },
        mounted() {
            this.initData();
        },
        data() {
            return {
                props: {
                    label: 'label',
                    children: 'children',
                    isLeaf: 'leaf'
                },
                defaultExpandedKeys: [],
                treeData: [],
                clickFlag: false
            }
        },
        methods: {
            // 筛选
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            // 加载树
            loadTree() {
                loadDkyTree({}).then(res => {
                    this.defaultExpandedKeys = [res.data[0].id];
                    this.treeData = res.data;
                });
            },
            // 树节点点击
            clickEvent(node) {
                clearTimeout(timeoutId);
                if (!node.children) {
                    timeoutId = setTimeout(() => {
                        this.clickFlag = false;
                    }, 650);
                    if (this.clickFlag && prevNode === node) {
                        this.clickFlag = false;
                        this.$emit('changeTreeNode', node);
                    } else {
                        this.clickFlag = true;
                        prevNode = node;
                    }
                }
            },
            // 数据初始化
            initData() {
                this.loadTree();
            }
        },
        watch: {
            treeFilterKey(val) {
                this.$refs.tree.filter(val);
            }
        }
    }
</script>

<style scoped lang="scss">
    #self-tree {
        padding: 10px;
    }

    #d5000-tree {
        overflow-y: auto;
        height: 100%;
    }
</style>
