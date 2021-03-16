import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/news/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/news/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/news/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/news/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/news/delete",
    method: "post",
    data,
  });
}
