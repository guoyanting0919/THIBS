import request from "@/utils/request";

const api = {
  // forgetPw
  ForgetPw(data) {
    return request({
      url: "/Users/ForgetPwd",
      method: "post",
      data,
    });
  },
};

export default api;
