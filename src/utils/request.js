import Vue from "vue";
import axios from "axios";
// import router from "../router/index";
import { MessageBox } from "element-ui";
import store from "../store";
import { getToken } from "@/utils/auth";

// 創建axios實例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 50000, // 請求超時時間
});

const tokenExpire = () => {
  store.dispatch("FedLogOut").then(() => {
    location.reload(); // 為了重新實例化vue-router對象 避免bug
  });
  // router.replace({
  //   name: "Login",
  // });
};

// 錯誤捕捉
const errorHandle = (status, msg, response) => {
  switch (status) {
    case 400:
      console.log(response);
      // to404Page();
      break;

    case 401:
      console.log(response);
      tokenExpire();
      break;

    case 403:
      console.log(response);
      // to404Page();
      break;

    case 404:
      console.log(response);
      // to404Page();
      break;

    case 500:
      console.log(response);
      // to404Page();
      break;

    default:
      console.log(response);
      // to404Page();
      break;
  }
};

// request攔截器
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers["X-Token"] = getToken(); // 讓每個請求攜帶自定義token 請根據實際情況自行修改
    }

    if (store.getters.isIdentityAuth) {
      config.headers["Authorization"] =
        "Bearer " + store.getters.oidcAccessToken;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone攔截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      // 50008:非法的token; 50012:其他客戶端登錄了;  50014:Token 過期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          "登錄已超時，可以【取消】繼續留在該頁面，或者【重新登錄】",
          "超時提醒",
          {
            confirmButtonText: "重新登錄",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("FedLogOut").then(() => {
            location.reload(); // 為了重新實例化vue-router對象 避免bug
          });
        });
      } else {
        Vue.prototype.$alertT.fire({
          icon: "error",
          title: res.message,
        });
      }
      //FIXME:
      // return Promise.reject(res.message);
      return response.data;
    } else {
      // api回傳成功
      return response.data;
    }
  },
  (error) => {
    Vue.prototype.$alertM.fire({
      icon: "error",
      title: error,
    });
    // console.log("err" + error);
    // Message({
    //   message:
    //     "請先啟動OpenAuth.WebApi，再刷新本頁面，異常詳情：" + error.message,
    //   type: "error",
    //   duration: 10 * 1000,
    // });
    // return Promise.reject(error);
    const { response } = error;

    if (response) {
      errorHandle(response.status, response.data.error, response);
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

export default service;
