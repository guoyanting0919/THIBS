import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/trelloTemps/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/trelloTemps/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/trelloTemps/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/trelloTemps/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/trelloTemps/delete",
    method: "post",
    data,
  });
}
