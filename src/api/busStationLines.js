import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/busStationLiness/load",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/busStationLiness/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/busStationLiness/add",
    method: "post",
    data,
  });
}


export function update(data) {
  return request({
    url: "/busStationLiness/update",
    method: "post",
    data,
  });
}

export function remove(data) {
    return request({
      url: "/busStationLiness/delete",
      method: "post",
      data,
    });
  }
