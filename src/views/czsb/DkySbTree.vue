<template>
    <div id="d5000-tree">
        <el-tree node-key='id' ref="tree" :expand-on-click-node="false" :props="props"
                 :default-expanded-keys='defaultExpandedKeys' @node-click="clickEvent"
                 :data="treeData" highlight-current :filter-node-method="filterNode" lazy :load="loadFn">
        </el-tree>
    </div>
</template>

<script>
    import {loadDkySbTree} from '@/api/czsb-api'

    let timeoutId;
    let prevNode;
    export default {
        name: "dky-sb-tree",
        props: {
            treeFilterKey: {
                type: String,
                default: ''
            },
            czParam: {
                type: Object
            }
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
            // 懒加载方法
            async loadFn(node, resolve) {
                if (node.data && node.data.lazy) {
                    let data = await this.lazyLoadTreeData(node.data);
                    return resolve(data);
                }
                if (node.data && node.data.children && node.data.children.length > 0) {
                    return resolve(node.data.children)
                }
                resolve([]);
            },
            lazyLoadTreeData(node) {
                return new Promise(resolve => {
                    loadDkySbTree(node).then(data => {
                        return resolve(data);
                    });
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            loadTree() {
                loadDkySbTree(this.czParam).then(data => {
                    this.defaultExpandedKeys = [data[0].id];
                    this.treeData = data;
                });
            },
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
            initData() {
                this.loadTree();
            }
        },
        watch: {
            treeFilterKey(val) {
                this.$refs.tree.filter(val);
            },
            czParam: {
                handler(val) {
                    if (JSON.stringify(val) !== '{}') {
                        this.initData();
                    }
                },
                deep: true,
                immediate: true
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
