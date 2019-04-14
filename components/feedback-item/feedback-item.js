// components/feedback-item/feedback-item.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderId: null
  },
  /**
   * 组件的初始数据
   */
  data: {
    feedbacks: null
  },
  attached: function () {
    console.log(this.data.orderId);
    this.refreshData();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    refresh: function () {
      console.log('here !!');
      this.refreshData();
    },
    refreshData: function() {
      app.getFeedbacksUnreadAsync(0, 10000, this.data.orderId, res => {
        console.log(res.length);
        this.setData({
          feedbacks: res
        })
      });
    }
  }
})
