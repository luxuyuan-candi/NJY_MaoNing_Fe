const { ensureLogin } = require('../../utils/auth');
const { fetchUsers, updateUserType } = require('../../utils/profileApi');

Page({
  data: {
    users: [],
    userTypes: ['普通用户', '管理员', '高级管理员', '超级管理员'],
  },

  onShow() {
    const userTypes = this.data.userTypes;
    ensureLogin()
      .then(() => fetchUsers())
      .then((users) => {
        this.setData({
          users: users.map((item) => ({
            ...item,
            id: item.openid,
            avatarInitial: (item.nickname || '猫').slice(0, 1),
            userTypeIndex: Math.max(userTypes.indexOf(item.userType), 0),
          })),
        });
      })
      .catch(() => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  onTypeChange(e) {
    const { id } = e.currentTarget.dataset;
    const index = Number(e.detail.value);
    const userType = this.data.userTypes[index] || '普通用户';

    updateUserType(id, userType)
      .then(() => fetchUsers())
      .then((users) => {
        this.setData({
          users: users.map((item) => ({
            ...item,
            id: item.openid,
            avatarInitial: (item.nickname || '猫').slice(0, 1),
            userTypeIndex: Math.max(this.data.userTypes.indexOf(item.userType), 0),
          })),
        });
        wx.showToast({ title: '已更新', icon: 'success' });
      })
      .catch((error) => {
        wx.showToast({ title: error.message || '更新失败', icon: 'none' });
      });
  },
});
