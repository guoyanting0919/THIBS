import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/busStationss/load",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/busStationss/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/busStationss/add",
    method: "post",
    data,
  });
}


export function update(data) {
  return request({
    url: "/busStationss/update",
    method: "post",
    data,
  });
}

export function remove(data) {
    return request({
      url: "/busStationss/delete",
      method: "post",
      data,
    });
  }
