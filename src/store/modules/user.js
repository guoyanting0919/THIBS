import {
  login,
  logout,
  getInfo,
  getModules,
  getModulesTree,
  getOrgs,
} from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";

const user = {
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    modules: null,
    defaultorg: null, // 登錄後默認的操作機構
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_MODULES: (state, modules) => {
      state.modules = modules;
    },
    SET_DEFAULTORG: (state, org) => {
      state.defaultorg = org;
    },
  },

  actions: {
    // 登錄
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then((response) => {
            const data = response;
            setToken(data.token);
            commit("SET_TOKEN", data.token);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 獲取用戶信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then((response) => {
            commit("SET_NAME", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // todo:默認登錄後取第一個機構的id作為默認，可以在【個人中心】界面修改默認
    // 在大型業務系統中，應該讓用戶登錄成功後彈出選擇框選擇操作的機構
    GetDefaultOrg({ commit, state }) {
      return new Promise((resolve, reject) => {
        getOrgs(state.token)
          .then((response) => {
            commit("SET_DEFAULTORG", response.result[0]);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 獲取用戶模塊
    GetModules({ commit, state }) {
      return new Promise((resolve, reject) => {
        getModules(state.token)
          .then((response) => {
            commit("SET_MODULES", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 獲取用戶模塊
    GetModulesTree({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.modules != null) {
          resolve(state.modules);
          return;
        }
        getModulesTree(state.token)
          .then((response) => {
            commit("SET_MODULES", response.result);
            resolve(response.result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("SET_TOKEN", "");
            commit("SET_MODULES", []);
            removeToken();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    },
  },
};

export default user;
