// pages/usercenter/components/course-group/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    gridList: [
      {
        name: '全部课程',
        icon: 'root-list',
        type: 'all',
        url: '',
      },
      {
        name: '审核中',
        icon: 'search',
        type: 'progress',
        url: '',
      },
      {
        name: '已发布',
        icon: 'upload',
        type: 'published',
        url: '',
      },
      {
        name: '草稿箱',
        icon: 'file-copy',
        type: 'draft',
        url: '',
      },
    ],
  },

  methods: {
    onEleClick(e) {
      const { name, url } = e.currentTarget.dataset.data;
      console.log('name, url :>> ', name, url);
    },
  },
});
