import request from "@/utils/request";

export function get(params) {
  return request({
    url: "/orgs/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/orgs/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/orgs/update",
    method: "post",
    data,
  });
}

export function del(data) {
  return request({
    url: "/orgs/delete",
    method: "post",
    data,
  });
}

// 添加用户
export function AssignOrgUsers(data) {
  return request({
    url: "/AccessObjs/AssignOrgUsers",
    method: "post",
    data,
  });
}

// 獲取子組織
export function getSubOrgs(data) {
  return request({
    url: "/check/getSubOrgs",
    method: "get",
    params: data,
  });
}

// 獲取所有B單位
export function getOrgB(data) {
  return request({
    url: "/orgs/LoadOrgB",
    method: "get",
    params: data,
  });
}

/* 獲取特定單位（無權限） */
export function getOrgNoPermission(data) {
  return request({
    url: "/orgs/LoadOrgB",
    method: "get",
    params: data,
  });
}
