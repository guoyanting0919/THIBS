import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/orderOfBusUser/load",
    method: "get",
    params,
  });
}

export function loadDespatch(params) {
  return request({
    url: "/orderOfBusUser/loadwithdespatch",
    method: "get",
    params,
  });
}

export function loadNoOrg(params) {
  return request({
    url: "/orderOfBusUser/loadNoOrg",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/orderOfBusUser/get",
    method: "get",
    params,
  });
}

export function getDetail(params) {
  return request({
    url: "/orderOfBusUser/getDetail",
    method: "get",
    params,
  });
}

export function receive(data) {
  return request({
    url: "/orderOfBusUser/updateOrgId",
    method: "post",
    data,
  });
}

export function add(data) {
  return request({
    url: "/orderOfBusUser/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/orderOfBusUser/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/orderOfBusUser/delete",
    method: "post",
    data,
  });
}

export function cancel(data) {
  return request({
    url: "/orderOfBusUser/CancelOrder",
    method: "post",
    data,
  });
}
