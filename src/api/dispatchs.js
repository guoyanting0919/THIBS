import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/despatchOfBusUsers/load",
    method: "get",
    params,
  });
}
export function loadGroup(params) {
  return request({
    url: "/despatchOfBusUsers/loadGroup",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/despatchOfBusUsers/get",
    method: "get",
    params,
  });
}

export function getDespatch(params) {
  return request({
    url: "/Despatchs/GetByOrderId",
    method: "get",
    params,
  });
}

export function addOrUpdate(data) {
  return request({
    url: "/despatchs/addOrUpdate",
    method: "post",
    data,
  });
}

export function addOrUpdateShare(data) {
  return request({
    url: "/despatchs/SharedOrDespatch",
    method: "post",
    data,
  });
}

export function cancel(data) {
  return request({
    url: "/despatchs/cancelDespatch",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/despatchOfBusUsers/delete",
    method: "post",
    data,
  });
}
