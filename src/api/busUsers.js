import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/busUsers/load",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/busUsers/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/busUsers/add",
    method: "post",
    data,
  });
}


export function update(data) {
  return request({
    url: "/busUsers/update",
    method: "post",
    data,
  });
}
