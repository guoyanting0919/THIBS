import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/orders/load",
    method: "get",
    params,
  });
}

export function acceptOrder(params) {
  return request({
    url: "/orders/acceptOrder",
    method: "get",
    params,
  });
}

export function LoadWithDespatch(params) {
  return request({
    url: "/orders/LoadWithDespatch",
    method: "get",
    params,
  });
}

export function loadHistory(params) {
  return request({
    url: "/orders/loadHistory",
    method: "get",
    params,
  });
}

export function loadNoOrg(params) {
  return request({
    url: "/orders/loadNoOrg",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/orders/get",
    method: "get",
    params,
  });
}

export function getDetail(params) {
  return request({
    url: "/orders/getDetail",
    method: "get",
    params,
  });
}

export function receive(data) {
  return request({
    url: "/orders/updateOrgId",
    method: "post",
    data,
  });
}

export function add(data) {
  return request({
    url: "/orders/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/orders/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/orders/delete",
    method: "post",
    data,
  });
}

export function roster(data) {
  return request({
    url: "/despatchOfSelfPayUsers/addOrUpdate",
    method: "post",
    data,
  });
}

export function loadDespatch(params) {
  return request({
    url: "/despatchOfSelfPayUsers/load",
    method: "get",
    params,
  });
}

export function cancel(data) {
  return request({
    url: "/orders/cancelOrder",
    method: "post",
    data,
  });
}
