import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/despatchOfSelfPayUsers/load",
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

export function cancel(data) {
  return request({
    url: "/despatchs/cancelDespatch",
    method: "post",
    data,
  });
}
