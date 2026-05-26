const { buildUrl, request, uploadFile } = require('./request');
const { setCachedProfile } = require('./auth');

const ADMIN_USER_TYPES = ['管理员', '高级管理员', '超级管理员'];
const SUPER_ADMIN_USER_TYPE = '超级管理员';

function normalizeProfile(profile) {
  if (!profile) {
    return profile;
  }
  const userType = profile.userType || '普通用户';
  return {
    ...profile,
    userType,
    avatar: profile.avatar ? buildUrl(profile.avatar) : '',
    isAdmin: ADMIN_USER_TYPES.includes(userType),
    isSuperAdmin: userType === SUPER_ADMIN_USER_TYPE,
  };
}

function fetchProfile() {
  return request({
    url: '/api/profile',
    method: 'GET',
  }).then((res) => {
    if (res.data && res.data.success) {
      const profile = normalizeProfile(res.data.data);
      setCachedProfile(profile);
      return profile;
    }
    throw new Error((res.data && res.data.msg) || '获取个人信息失败');
  });
}

function uploadAvatar(filePath) {
  return uploadFile({
    url: '/api/profile/avatar',
    filePath,
    name: 'avatar',
  }).then((res) => {
    const data = JSON.parse(res.data || '{}');
    if (!data.success) {
      throw new Error(data.msg || '头像上传失败');
    }
    return data.data;
  });
}

function updateProfile(profile) {
  return request({
    url: '/api/profile',
    method: 'PUT',
    data: profile,
    header: {
      'content-type': 'application/json',
    },
  }).then((res) => {
    if (res.data && res.data.success) {
      const nextProfile = normalizeProfile(res.data.data);
      setCachedProfile(nextProfile);
      return nextProfile;
    }
    throw new Error((res.data && res.data.msg) || '保存失败');
  });
}

function submitFeedback(content) {
  return request({
    url: '/api/feedbacks',
    method: 'POST',
    data: { content },
    header: {
      'content-type': 'application/json',
    },
  }).then((res) => {
    if (!res.data || !res.data.success) {
      throw new Error((res.data && res.data.msg) || '提交失败');
    }
  });
}

function fetchFeedbacks() {
  return request({
    url: '/api/feedbacks',
    method: 'GET',
  }).then((res) => {
    if (res.data && res.data.success) {
      return res.data.data || [];
    }
    throw new Error((res.data && res.data.msg) || '获取反馈失败');
  });
}

function fetchFeedbackStats() {
  return request({
    url: '/api/feedbacks/stats',
    method: 'GET',
  }).then((res) => {
    if (res.data && res.data.success) {
      return res.data.data || { positive: 0, negative: 0, total: 0 };
    }
    throw new Error((res.data && res.data.msg) || '获取反馈统计失败');
  });
}

function fetchNegativeFeedbackTop5() {
  return request({
    url: '/api/feedbacks/negative-top5',
    method: 'GET',
  }).then((res) => {
    if (res.data && res.data.success) {
      return res.data.data || [];
    }
    throw new Error((res.data && res.data.msg) || '获取消极问题统计失败');
  });
}

function fetchUsers() {
  return request({
    url: '/api/users',
    method: 'GET',
  }).then((res) => {
    if (res.data && res.data.success) {
      return (res.data.data || []).map(normalizeProfile);
    }
    throw new Error((res.data && res.data.msg) || '获取用户失败');
  });
}

function updateUserType(openid, userType) {
  return request({
    url: `/api/users/${openid}/user-type`,
    method: 'PUT',
    data: { userType },
    header: {
      'content-type': 'application/json',
    },
  }).then((res) => {
    if (res.data && res.data.success) {
      return res.data.data;
    }
    throw new Error((res.data && res.data.msg) || '更新用户类型失败');
  });
}

module.exports = {
  fetchProfile,
  uploadAvatar,
  updateProfile,
  submitFeedback,
  fetchFeedbacks,
  fetchFeedbackStats,
  fetchNegativeFeedbackTop5,
  fetchUsers,
  updateUserType,
};
