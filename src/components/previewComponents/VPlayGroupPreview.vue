<template>
    <div ref="content" class="content full-width">
        <el-carousel
                v-if="resources.length && resources.length"
                height="100%"
                width="100%"
                :interval="options.interval"
                :autoplay="options.autoplay"
                :loop="true"
                class="full-width">
            <el-carousel-item v-for="(resource, idx) in resources" :key="resource.fId" class="full-width">
                   <VResourcePreview
                            :options="{
                                coveringType: resource.fCoveredType,
                                url: resource.fUrl,
                                type: resource.fType
                            }">
                   </VResourcePreview>
              </el-carousel-item>
        </el-carousel>
        <div v-else class="no-resources">无资源</div>
    </div>
</template>

<script>
    import { PlayGroupService } from '@/api/play-group'; // 请求api
    import VResourcePreview from './VResourcePreview';

    export default {
        props: {
            id: { //资源播放组id
                //type: String,
                required: true
            },

            shown: { //是否显示播放组
                type: Boolean,
                required: true
            }
        },

        components: {
            VResourcePreview
        },

        data() {
            return {
                resources: [], //播放组资源
                options: { //播放组的属性
                    autoplay: true, //是否自动切换
                    interval: 3000, //播放时间
                    isTurnedOn: true //是否播放
                },
                pictureUrl: this.pictureUrl,
                isCarouselShown: false //是否显示轮播
            };
        },

        watch: {
            shown() {
                this.resources = [];
                this.getPlayGroupById();
            },

            id() {
                if (this.shown) {
                    this.getPlayGroupById();
                }
            }
        },

        mounted() {
            this.resources = [];

            if (this.shown) {
                this.getPlayGroupById();
            }
        },

        methods: {
            /**
             * 根据播放组id获取播放组信息
             */
            async getPlayGroupById() {
                //const params = this.setGetPlayGroupInfoParams();
                const res = await PlayGroupService.getPlayGroupResources(this.id);

                if (res.success) {
                    this.resources = res.obj;
                    this.setPlayGroupOptions(this.resources[0]);
                } else {
                    this.$message.error(res.msg);
                }
            },

            /**
             * 设置查询播放组信息的请求的参数
             */
            setGetPlayGroupInfoParams() {
                return {
                    fPlayGroupId: this.id,
                    currentPage: 1,
                    pageSize: 1000
                };
            },

            /**
             * 设置播放组属性
             * @params {Object} params --- 播放组属性
             */
            setPlayGroupOptions(params) {
                this.options = Object.assign({}, {
                    autoplay: params.fIsChange,
                    interval: params.fChangeTime * 1000,
                    isTurnedOn: params.fIsPlay
                });
            }
        }
    }
</script>

<style lang="scss">
    .full-width {
        width: 100%;
        height: 100%;
    }

    .el-carousel__indicators {
        display: none;
    }

    .no-resources {
        width: 100%;
        margin-top: 20%;
        color: #fff;
    }
</style>