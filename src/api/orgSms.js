import request from "@/utils/request";

export function get(params) {
  return request({
    url: "/OrgSMS/get",
    method: "get",
    params,
  });
}

export function addOrUpdate(data) {
  return request({
    url: "/OrgSMS/addOrUpdate",
    method: "post",
    data,
  });
}

export function checkAmt(data) {
  return request({
    url: "/OrgSMS/checkAmt",
    method: "post",
    data,
  });
}
