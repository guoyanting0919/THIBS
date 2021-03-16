import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/userInfo/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/userInfo/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/userInfo/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/userInfo/update",
    method: "post",
    data,
  });
}

export function deleteCar(data) {
  return request({
    url: "/userInfo/delete",
    method: "post",
    data,
  });
}
