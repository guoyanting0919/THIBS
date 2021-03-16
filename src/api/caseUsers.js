import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/caseusers/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/caseusers/get",
    method: "get",
    params,
  });
}
 
export function add(data) {
  return request({
    url: "/caseusers/addorupdate",
    method: "post",
    data,
  });
}

// 修改B單位
export function updateUnitB(data) {
  return request({
    url: "/caseusers/updateorgb",
    method: "post",
    data,
  });
}
