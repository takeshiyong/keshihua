/*
* @Author: 元实
* @Date:   2019-11-06
* @Description: '消息弹框'
*               １）this.$message(content, type, isClosable);
*               content - 消息内容
*               type - 消息类型: info - 普通消息、success - 成功消息、warning - 提示消息、error - 错误消息
*               isClosable - 是否能关闭
*
*               2) this.$message.success(content, isClosable)  成功消息
*                  this.$message.error(content, isClosable)  错误消息
*                  this.$message.warning(content, isClosable)  提示消息
*                  this.$message.info(content, isClosable) 普通消息
*/

<template>
    <transition-group name="messages">
        <div v-for="(message, idx) in messageList"
             :style="{ top: calcMessageTop(idx) }"
             :key="message.id"
             :class="['message', types[message.type][0]]">
            <span>
                <i :class="['el-icon', 'icon', types[message.type][1]]"></i>
                <span class="content">{{ message.content }}</span>
            </span>

            <i v-if="message.isClosable" class="close el-icon-close" @click="deleteMessage(idx)"></i>
        </div>
    </transition-group>
</template>

<script>
    import Vue from 'vue';

    export default {
        data() {
            return {
                messageList: [], //提示消息的数组

                types: {
                    info: ['info', 'el-icon-info'],
                    warning: ['warning', 'el-icon-warning'],
                    error: ['error', 'el-icon-error'],
                    success: ['success', 'el-icon-success']
                }
            };
        },

        mounted() {
            Vue.prototype.$message = this.addMessage;
            Vue.prototype.$message.info = (content, isClosable) => this.addMessage(content, 'info', isClosable);
            Vue.prototype.$message.error = (content, isClosable) => this.addMessage(content, 'error', isClosable);
            Vue.prototype.$message.warning = (content, isClosable) => this.addMessage(content, 'warning', isClosable);
            Vue.prototype.$message.success = (content, isClosable) => this.addMessage(content, 'success', isClosable);
        },

        methods: {
            /**
             * 算消息弹框的位置
             * @param {number} idx   --- 消息的索引
             * @returns {string} --- 弹框的位置
             */
            calcMessageTop(idx) {
                return `${ 30 + idx * 50 }px`;
            },

            /**
             * 添加消息
             * @param {string} content  --- 消息的内容
             * @param {string} type --- 消息的类型
             * @param {boolean} isClosable ---　是否能关闭消息弹框
             */
            addMessage(content, type = 'info', isClosable = false) {
                let messages = this.messageList;
                let idx = messages.length;

                if (!this.types[type]) {
                    console.error('只有以下消息类型：info、warning、error、success');
                    return;
                }

                messages.push({
                    id: idx ? messages[idx - 1].id + 1 : 0,
                    type: type,
                    content: content,
                    isClosable: isClosable
                });

                setTimeout(() => { this.deleteMessage(); }, 5000);
            },

            /**
             * 删除消息
             * @param {number} idx   --- 弹框的索引
             */
            deleteMessage(idx = 0) {
                this.messageList.splice(idx, 1);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .message {
        position: fixed;
        display: flex;
        justify-content: space-between;
        align-items: center;
        left: 50%;
        min-width: 280px;
        padding: 10px 20px;
        font-size: 14px;
        border: solid 1px white;
        transition: all 1s;
        transform: translateX(-50%);
        z-index: 2000;
    }

    .messages-enter,
    .messages-leave-to {
        opacity: 0;
        transform: translate(-50%, -30px);
    }

    .content {
        color: #fff;
    }

    .icon {
        margin-right: 10px;
    }

    .success {
        color: #16a61e;
        background-color: #006834;
        border-color: #16a61e;
    }

    .error {
        color: #ee2700;
        background-color: #852e3d;
        border-color: #ee2700;
    }

    .info {
        color: #5ab4e0;
        background-color: #59738c;
        border-color: #5ab4e0;
    }

    .warning {
        color: #d0cf3f;
        background-color: #978934;
        border-color: #d0cf3f;
    }

    .close {
        margin-left: 10px;
        cursor: pointer;
        font-size: 16px;
    }
</style>