const PROFILE_STORAGE_KEY = 'maoning_profile_v2';
const FEEDBACKS_STORAGE_KEY = 'maoning_feedbacks_v1';
const USERS_STORAGE_KEY = 'maoning_users_v1';

const DEFAULT_PROFILE = {
  avatar: '',
  nickname: '未设置昵称',
  email: '',
  userType: '普通用户',
};

function loadProfile() {
  const saved = wx.getStorageSync(PROFILE_STORAGE_KEY) || {};
  return {
    ...DEFAULT_PROFILE,
    ...saved,
  };
}

function getProfileIdentity(profile) {
  if (profile.id) return profile.id;
  if (profile.email) return `email:${profile.email.trim().toLowerCase()}`;
  return `nickname:${(profile.nickname || '未设置昵称').trim()}`;
}

function loadUsers() {
  const current = loadProfile();
  const saved = wx.getStorageSync(USERS_STORAGE_KEY) || [];

  if (!saved.length && (current.nickname || current.email || current.avatar)) {
    return [
      {
        ...DEFAULT_PROFILE,
        ...current,
        id: getProfileIdentity(current),
      },
    ];
  }

  return saved;
}

function saveUsers(users) {
  wx.setStorageSync(USERS_STORAGE_KEY, users);
  return users;
}

function saveProfile(profile) {
  const next = {
    ...DEFAULT_PROFILE,
    ...profile,
    id: getProfileIdentity(profile),
  };
  wx.setStorageSync(PROFILE_STORAGE_KEY, next);
  const users = loadUsers();
  const existingIndex = users.findIndex((item) => item.id === next.id);
  const nextUsers = [...users];

  if (existingIndex >= 0) {
    nextUsers[existingIndex] = {
      ...nextUsers[existingIndex],
      ...next,
    };
  } else {
    nextUsers.unshift(next);
  }

  saveUsers(nextUsers);
  return next;
}

function updateUserType(userId, userType) {
  const users = loadUsers().map((item) => (
    item.id === userId
      ? { ...item, userType }
      : item
  ));

  saveUsers(users);

  const current = loadProfile();
  if (getProfileIdentity(current) === userId) {
    saveProfile({
      ...current,
      userType,
    });
  }

  return users;
}

function loadFeedbacks() {
  const saved = wx.getStorageSync(FEEDBACKS_STORAGE_KEY) || [];
  return saved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function addFeedback(payload) {
  const feedbacks = loadFeedbacks();
  const next = [
    {
      id: `fb_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...payload,
    },
    ...feedbacks,
  ];
  wx.setStorageSync(FEEDBACKS_STORAGE_KEY, next);
  return next;
}

module.exports = {
  DEFAULT_PROFILE,
  loadProfile,
  saveProfile,
  loadUsers,
  updateUserType,
  loadFeedbacks,
  addFeedback,
};
