<template>
    <div ref="content" class="full-width">
        <iframe v-if="resourceType === 2" :src="url" frameborder="0" class="full-width" style="background-color: white"></iframe>
        <div v-else class="image full-width" :style="imageStyle"></div>
    </div>
</template>

<script>
    import { ResourceService } from '@/api/resource'; // 请求api

    export default {
        props: {
            options: { //资源参数
                type: Object,
                required: true
            }
        },

        data() {
            return {
                resource: {}, //资源信息
                url: '', //资源url
                resourceType: 1, //资源类型: 1 - 图片, 2 - url
                coverType: 1, //铺满方式
                imageStyle: { //预览图片样式
                    backgroundColor: '#000',
                    backgroundImage: '',
                    backgroundSize: '',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                },
            };
        },

        async mounted() {
            if (this.options.id) {
                await this.getResourceById();
            } else {
                this.resource.fUrl = this.options.url;
                this.resource.fType = this.options.type;
                this.resource.fCoveredType = this.options.coveringType;
            }
            this.showPreviewScreenResourceWindow();
        },

        watch: {
            async options() {
                if (this.options.id) {
                    await this.getResourceById();
                } else {
                    this.resource.fUrl = this.options.url;
                    this.resource.fType = this.options.type;
                    this.resource.fCoveredType = this.options.coveringType;
                }
                this.showPreviewScreenResourceWindow();
            }
        },

        methods: {
            /**
             * 根据资源id获取资源信息
             */
            async getResourceById() {
                const res = await ResourceService.getResourceInfo(this.options.id);

                if (res.success) {
                    this.resource = res.obj;
                } else {
                    this.$message.error(res.msg);
                }
            },

            /**
             * 显示预览资源的弹框和背景
             * @param {number} resourceType --- 资源类型: 1 - 图片，2 - 网址
             * @param {number} coverType --- 铺满方式
             * @param {string} url --- 资源url
             */
            showPreviewScreenResourceWindow() {
                const type = this.resource.fType;
                const covering = this.resource.fCoveredType;
                const url = type === 1 ? this.pictureUrl + this.resource.fUrl : this.resource.fUrl;

                this.url = this.resource.fUrl;
                this.resourceType = type;
                if (!type) {
                    this.clearBackgroundStyle();
                } else if (type === 1) {
                    this.setBackgroundStyle(url, covering);
                }
            },

            /**
             * 清理背景
             */
            clearBackgroundStyle() {
                let style = this.imageStyle;

                style.backgroundImage = '';
                style.backgroundSize = '';
            },

            /**
             * 设置预览图片的样式
             * @param {string} url --- 图片url
             * @param {number} coverType --- 铺满方式
             */
            setBackgroundStyle(url, coverType) {
                let style = this.imageStyle;

                if (url) {
                    style.backgroundImage = `url(${url})`;
                } else {
                    style.backgroundImage = '';
                }
                switch (coverType) {
                    case 1:
                        style.backgroundSize = '100% 100%';
                        break;

                    case 2:
                        style.backgroundSize = 'contain';
                        break;
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .full-width {
        width: 100%;
        height: 100%;
    }
</style>