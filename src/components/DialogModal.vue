<template>
  <div ref="modal" v-show="showModal" class="modal-style">
      <div class="addModal">
        <div class="modal-top">
          <span style="color: #2483ff;font-size: 14px;display: inline-block;border-left: 2px solid #2483FF;paddingLeft: 10px;">{{modalTitle}}</span>
          <div class="close-button" @click="closeModal()"> 
            <i style="color: #2483ff;font-size:18px;" class="el-icon-close close-btn" ></i>
          </div>
        </div>
        <div class="limit-height">
          <slot name="container"></slot>
        </div>
      <div class="datav-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogModal',
  props: {
    showModal: Boolean,
    modalTitle: String,
  },
  methods: {
    closeModal() {
      this.$emit('closeModals')
    }
  },
}
</script>

<style scoped lang="scss">
.modal-style {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.35);
    overflow: hidden;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1111;
    display: flex;
    justify-content: center;
    align-items: center;
    .addModal {
      position: relative;
      min-width: 400px;
      max-width: 1000px;
      background: #303640;
      color: #fff;
      padding: 16px 0;
      z-index: 1;
      cursor: default;
      .modal-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
        margin-bottom: 20px;
        box-sizing: border-box;
        padding: 0 20px;
        .close-button {
          cursor: pointer;
          width: 16px;
          height: 16px;
          font-size: 0;
          .close-btn {
            transition: transform 0.5s;
          }
        }
        
        .close-button:hover {
          .close-btn {
            transform:rotate(90deg);
            -ms-transform:rotate(90deg); 	/* IE 9 */
            -moz-transform:rotate(90deg); 	/* Firefox */
            -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
            -o-transform:rotate(90deg); 	/* Opera */
          }
        }
      }
    }
    .addModal::before {
          content: '';
          position: absolute;
          display: block;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 2px;
          background-image: linear-gradient(270deg,#00deff 0,#2483ff 74%);
    }
  }
  .datav-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 10px 25px 0 25px;
    box-sizing: border-box;
  }
  .limit-height {
    max-height: 600px;
    max-width: 900px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 10px;
    padding: 0 20px;
  }
  .limit-height::-webkit-scrollbar {
    background: 0 0;
    width: 4px;
    height: 4px;
  }
  
  .limit-height::-webkit-scrollbar-thumb {
    background: rgba(153,173,181,.2);
  }
  .limit-height::-webkit-scrollbar-track {
    background: 0 0;
  }

</style>
