import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/orderOfCaseUsers/load",
    method: "get",
    params,
  });
}

export function LoadNoOrg(params) {
  return request({
    url: "/orderOfCaseUsers/loadNoOrg",
    method: "get",
    params,
  });
}

export function acceptOrder(data) {
  return request({
    url: "/orderOfCaseUsers/acceptOrder",
    method: "post",
    data,
  });
}

export function transOrder(data) {
  return request({
    url: "/orderOfCaseUsers/TurnNextOrg",
    method: "post",
    data,
  });
}

export function cancel(data) {
  return request({
    url: "/orderOfCaseUsers/CancelOrder",
    method: "post",
    data,
  });
}

export function loadHistory(params) {
  return request({
    url: "/orderOfCaseUsers/LoadHistory",
    method: "get",
    params,
  });
}

export function loadNoOrg(params) {
  return request({
    url: "/orderOfCaseUsers/loadNoOrg",
    method: "get",
    params,
  });
}

export function getUser(params) {
  return request({
    url: "/Users/GetClient",
    method: "get",
    params,
  });
}

export function getCaseUser(params) {
  return request({
    url: "/CaseUsers/Get",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/orderOfCaseUsers/get",
    method: "get",
    params,
  });
}

export function getDetail(params) {
  return request({
    url: "/orderOfCaseUsers/GetDetail",
    method: "get",
    params,
  });
}

export function getHistory(params) {
  return request({
    url: "/orderOfCaseUsers/GetStatusLog",
    method: "get",
    params,
  });
}

export function getPay(params) {
  return request({
    url: "/OrderPayOfCaseUsers/GetDetail",
    method: "get",
    params,
  });
}

export function receive(data) {
  return request({
    url: "/orderOfCaseUsers/updateOrgId",
    method: "post",
    data,
  });
}

export function violation(data) {
  return request({
    url: "/orderOfCaseUsers/AddOrderViolation",
    method: "post",
    data,
  });
}

export function add(data) {
  return request({
    url: "/orderOfCaseUsers/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/orderOfCaseUsers/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/orderOfCaseUsers/delete",
    method: "post",
    data,
  });
}

export function loadDespatch(params) {
  return request({
    url: "/orderOfCaseUsers/loadwithdespatch",
    method: "get",
    params,
  });
}

export function getDiscount(params) {
  return request({
    url: "/orderOfCaseUsers/GetCaseOrderAmt",
    method: "get",
    params,
  });
}
