import request from "@/utils/request";

/* 獲取接送數據(非車行) */
export function getPickUp(params) {
  return request({
    url: "/Reports/GetPickReportByCaseOrgA",
    method: "get",
    params,
  });
}

/* 獲取接送數據(車行) */
export function getPickUpB(params) {
  return request({
    url: "/Reports/GetPickReportByOrderOrg",
    method: "get",
    params,
  });
}

/* 獲取營收報表(total) */
export function getRevenue(params) {
  return request({
    url: "/Reports/GetRevenueTotalReportByOrderOrg",
    method: "get",
    params,
  });
}

/* 獲取營收報表(driver) */
export function getDriverRevenue(params) {
  return request({
    url: "/Reports/GetRevenueReportByOrderOrg",
    method: "get",
    params,
  });
}

/* 獲取車輛使用狀況(非車行) */
export function getCarUse(params) {
  return request({
    url: "/Reports/GetCarUseReportByCaseOrgA",
    method: "get",
    params,
  });
}

/* 獲取車輛使用狀況(車行) */
export function getCarUseB(params) {
  return request({
    url: "/Reports/GetCarUseReportByOrderOrg",
    method: "get",
    params,
  });
}

/* 獲取起迄區域比率(非車行) */
export function getStartEndRatio(params) {
  return request({
    url: "/Reports/GetSEareaReportByCaseOrgA",
    method: "get",
    params,
  });
}

/* 獲取起迄區域比率(車行) */
export function getStartEndRatioB(params) {
  return request({
    url: "/Reports/GetSEareaReportByOrderOrg",
    method: "get",
    params,
  });
}

/* 獲取服務區域趟次(非車行) */
export function getAreaService(params) {
  return request({
    url: "/Reports/GetUserAreaReportByCaseOrgA",
    method: "get",
    params,
  });
}

/* 獲取服務區域趟次(車行) */
export function getAreaServiceB(params) {
  return request({
    url: "/Reports/GetUserAreaReportByOrderOrg",
    method: "get",
    params,
  });
}
