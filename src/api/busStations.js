import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/busStations/load",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/busStations/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/busStations/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/busStations/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/busStations/delete",
    method: "post",
    data,
  });
}
