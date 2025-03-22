Component({
  options: {
    multipleSlots: true,
  },

  properties: {
    list: Array,
    title: {
      type: String,
      value: '促销说明',
    },
    show: {
      type: Boolean,
    },
  },

  // data: {
  //   list: [],
  // },

  methods: {
    closePromotionPopup() {
      this.triggerEvent('closePromotionPopup', {
        show: false,
      });
    },
  },
});
