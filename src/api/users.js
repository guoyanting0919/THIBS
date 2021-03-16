import request from "@/utils/request";

// 獲取管理員列表
export function getList(params) {
  return request({
    url: "/users/load",
    method: "get",
    params,
  });
}

// 獲取客戶列表
export function getClientList(params) {
  return request({
    url: "/users/loadwithtype",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/users/get",
    method: "get",
    params,
  });
}

export function getClient(params) {
  return request({
    url: "/users/getclient",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/users/addorupdate",
    method: "post",
    data,
  });
}

export function addClient(data) {
  return request({
    url: "/users/addorupdateclient",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/users/addorupdate",
    method: "post",
    data,
  });
}

export function changePassword(data) {
  return request({
    url: "/users/changepassword",
    method: "post",
    data,
  });
}

export function changeProfile(data) {
  return request({
    url: "/users/changeprofile",
    method: "post",
    data,
  });
}

export function del(data) {
  return request({
    url: "/users/delete",
    method: "post",
    data,
  });
}

export function unlock(data) {
  return request({
    url: "/users/unlock",
    method: "post",
    data,
  });
}

export function loadByRole(params) {
  return request({
    url: "/users/loadByRole",
    method: "get",
    params,
  });
}
export function LoadByOrg(params) {
  return request({
    url: "/users/LoadByOrg",
    method: "get",
    params,
  });
}

export function CheckRole(params) {
  return request({
    url: "/Users/GetUnPermissionUserType",
    method: "get",
    params,
  });
}
