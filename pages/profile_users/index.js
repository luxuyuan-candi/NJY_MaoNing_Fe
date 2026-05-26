const { ensureLogin } = require('../../utils/auth');
const { fetchProfile, fetchUsers, updateUserType } = require('../../utils/profileApi');

Page({
  data: {
    profile: {
      userType: '普通用户',
      isSuperAdmin: false,
    },
    users: [],
    userTypes: ['普通用户', '管理员', '超级管理员'],
  },

  onShow() {
    const userTypes = this.data.userTypes;
    ensureLogin()
      .then(() => Promise.all([fetchProfile(), fetchUsers()]))
      .then(([profile, users]) => {
        this.setData({
          profile,
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
    if (!this.data.profile.isSuperAdmin) {
      wx.showToast({ title: '仅超级管理员可修改权限', icon: 'none' });
      return;
    }
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
