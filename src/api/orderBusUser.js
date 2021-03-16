import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/orderOfBusUsers/load",
    method: "get",
    params,
  });
}

export function loadDespatch(params) {
  return request({
    url: "/orderOfBusUsers/loadwithdespatch",
    method: "get",
    params,
  });
}

export function loadNoOrg(params) {
  return request({
    url: "/orderOfBusUsers/loadNoOrg",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/orderOfBusUsers/get",
    method: "get",
    params,
  });
}

export function getDetail(params) {
  return request({
    url: "/orderOfBusUsers/getDetail",
    method: "get",
    params,
  });
}

export function receive(data) {
  return request({
    url: "/orderOfBusUsers/updateOrgId",
    method: "post",
    data,
  });
}

export function add(data) {
  return request({
    url: "/orderOfBusUsers/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/orderOfBusUsers/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/orderOfBusUsers/delete",
    method: "post",
    data,
  });
}

export function cancel(data) {
  return request({
    url: "/orderOfBusUsers/CancelOrder",
    method: "post",
    data,
  });
}
