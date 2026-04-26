const { loadUsers, updateUserType } = require('../../utils/profileStore');

Page({
  data: {
    users: [],
    userTypes: ['普通用户', '管理员'],
  },

  onShow() {
    const userTypes = ['普通用户', '管理员'];
    this.setData({
      users: loadUsers().map((item) => ({
        ...item,
        avatarInitial: (item.nickname || '猫').slice(0, 1),
        userTypeIndex: Math.max(userTypes.indexOf(item.userType), 0),
      })),
    });
  },

  onTypeChange(e) {
    const { id } = e.currentTarget.dataset;
    const index = Number(e.detail.value);
    const userType = this.data.userTypes[index] || '普通用户';

    const users = updateUserType(id, userType).map((item) => ({
      ...item,
      avatarInitial: (item.nickname || '猫').slice(0, 1),
      userTypeIndex: Math.max(this.data.userTypes.indexOf(item.userType), 0),
    }));

    this.setData({ users });
    wx.showToast({ title: '已更新', icon: 'success' });
  },
});
