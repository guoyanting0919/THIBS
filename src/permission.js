import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // Progress 進度條
import "nprogress/nprogress.css"; // Progress 進度條樣式
import { Message } from "element-ui";
import { getToken } from "@/utils/auth"; // 驗權
import Layout from "@/views/layout/Layout";
let secondRouter = [];
let secondRouterObj = [];
let routerMappingList = [
  /* 預約訂單 */
  {
    path: "/allorder/index",
    title: "預約訂單 / 全部資料",
  },
  {
    path: "/orderselfpayuser/index",
    title: "預約訂單 / 白牌車訂單",
  },
  {
    path: "/orderbususer/index",
    title: "預約訂單 / 巴士訂單",
  },
  {
    path: "/ordercaseuser/index",
    title: "預約訂單 / 長照訂單",
  },

  /* 用戶資料 */
  {
    path: "/alluser/index",
    title: "用戶資料 / 全部用戶",
  },
  {
    path: "/caseuser/index",
    title: "用戶資料 / 長照用戶",
  },
  {
    path: "/selfpayuser/index",
    title: "用戶資料 / 自費用戶",
  },
  {
    path: "/bususer/index",
    title: "用戶資料 / 巴士用戶",
  },

  /* 派車調度 */
  {
    path: "/tabledispatchcaseuser/index",
    title: "派車調度 / 長照調度台",
  },
  {
    path: "/dragdispatcher/index",
    title: "派車調度 / 拖拉式調度台",
  },

  /* 司機車輛管理 */
  {
    path: "/driver/index",
    title: "司機車輛管理 / 司機資料",
  },
  {
    path: "/car/index",
    title: "司機車輛管理 / 車輛資料",
  },

  /* 路線及站點管理 */
  {
    path: "/busstop/index",
    title: "路線及站點管理 / 站點管理",
  },
  {
    path: "/busroute/index",
    title: "路線及站點管理 / 路線管理",
  },

  /* 前台頁面管理 */
  {
    path: "/news/index",
    title: "前台頁面管理 / 最新消息管理",
  },

  /* 基礎配置 */
  {
    path: "/forms/index",
    title: "基礎配置 / 表單設計",
  },

  /* 乘客管理 */
  {
    path: "/userinfo/index",
    title: "乘客管理 / 乘客資訊",
  },

  /* 流程中心 */
  {
    path: "/flowinstances/index",
    title: "流程中心 / 我的流程",
  },
  {
    path: "/flowdisposed/index",
    title: "流程中心 / 已處理流程",
  },
  {
    path: "/flowwait/index",
    title: "流程中心 / 待處理流程",
  },
];
let elementMappingList = [
  "add",
  "edit",
  "detail",
  "check",
  "dispatch",
  "addCaseUser",
  "editCaseUser",
  "checkCaseUser",
  "dispatchCaseUser",
  "addBusUser",
  "editBusUser",
  "checkBusUser",
  "dispatchBusUser",
  "addSelfPayUser",
  "editSelfPayUser",
  "checkSelfPayUser",
  "dispatchSelfPayUser",
  "verify",
];

const whiteList = [
  "/login",
  "/oidc-callback",
  "/swagger",
  "/usermanager/profile",
  "/404",
  "/401",
]; // 不重定向白名單

router.beforeEach((to, from, next) => {
  NProgress.start();

  store
    .dispatch("GetIdentityAuth")
    .then((isIdentity) => {
      if (isIdentity) {
        // 採用Identity認證
        // 如果是oidcRedirect必須進入授權
        // 沒登錄時，如果是白名單頁面，可以直接訪問
        // 沒登錄時，如果是非登錄頁面，則跳轉到登錄
        if (store.getters.oidcUser == null && to.path !== "/oidcRedirect") {
          if (whiteList.indexOf(to.path) !== -1) {
            next();
            return;
          } else {
            next("/login");
            return;
          }
        }

        store.dispatch("oidcCheckAccess", to).then(function(hasAccess) {
          if (!hasAccess) {
            return;
          }
          if (to.path === "/login") {
            // 登錄後login自動跳轉
            next({ path: "/" });
            return;
          }
          if (store.getters.modules != null) {
            next();
            return;
          }
          store.dispatch("GetModulesTree").then((modules) => {
            // 獲取用戶可訪問的模塊
            store.dispatch("GenerateRoutes", { modules }).then(() => {
              // 根據權限生成可訪問的路由表
              store.dispatch("GetDefaultOrg");
              router.addRoutes(store.getters.addRouters); // 動態添加可訪問路由表
              next({ ...to, replace: true }); // hack方法 確保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            });
          });
        });
      } else {
        // 普通登錄方式
        // console.log(getToken());
        if (getToken()) {
          if (to.path === "/login") {
            // 登錄後login自動跳轉
            next({ path: "/" });
            return;
          }
          if (store.getters.modules != null) {
            next();
            return;
          }

          store
            .dispatch("GetInfo")
            .then(() => {
              // 拉取用戶信息
              store.dispatch("GetModulesTree").then((modules) => {
                // 獲取用戶可訪問的模塊
                store.dispatch("GenerateRoutes", { modules }).then(() => {
                  // 根據權限生成可訪問的路由表
                  store.dispatch("GetDefaultOrg");

                  store.getters.addRouters.forEach((pr) => {
                    pr.children.forEach((cr) => {
                      secondRouterObj.push(cr);
                      secondRouter.push(cr.path);
                    });
                  });

                  // console.log(secondRouter, secondRouterObj);
                  routerMappingList.forEach((mr) => {
                    // console.log(mr);
                    // 新的
                    let arr = [];
                    if (secondRouter.includes(mr.path)) {
                      let parentPath = mr.path.split("/")[1];
                      arr = secondRouterObj.filter((o) => {
                        return o.path == mr.path;
                      });
                      // console.log(arr[0].meta.elements);
                      let adr = [];
                      arr[0].meta.elements.forEach((el) => {
                        if (elementMappingList.includes(el.domId))
                          if (adr.length == 0) {
                            // console.log(el.domId);
                            // console.log("adr");
                            adr = [
                              {
                                path: `/${parentPath}`,
                                component: Layout,
                                name: mr.title,
                                redirect: `/${parentPath}/index`,
                                hidden: true,
                                meta: {
                                  notauth: true,
                                  noCache: true,
                                },
                                children: [
                                  {
                                    path: `${el.domId}/:id`,
                                    component: () =>
                                      import(
                                        `@/views/${parentPath}/${el.domId}`
                                      ),
                                    name: `${parentPath}${el.domId}`,
                                    hidden: true,
                                    meta: {
                                      notauth: true,
                                      noCache: true,
                                      title: el.name,
                                    },
                                  },
                                ],
                              },
                            ];
                          } else {
                            let obj = {
                              path: `${el.domId}/:id`,
                              component: () =>
                                import(`@/views/${parentPath}/${el.domId}`),
                              name: `${parentPath}${el.domId}`,
                              hidden: true,
                              meta: {
                                notauth: true,
                                noCache: true,
                                title: el.name,
                              },
                            };
                            adr[0].children.push(obj);
                          }
                      });
                      // console.log(adr);
                      router.addRoutes(adr);
                    }
                  });
                  router.addRoutes(store.getters.addRouters); // 動態添加可訪問路由表

                  next({ ...to, replace: true }); // hack方法 確保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                });
              });
            })
            .catch((err) => {
              store.dispatch("FedLogOut").then(() => {
                Message.error(err || "獲取用戶信息失敗");
                next({ path: "/" });
              });
            });

          return;
        }
        if (whiteList.indexOf(to.path) !== -1) {
          // 沒登錄情況下過濾白名單
          next();
        } else {
          next("/login");
        }
      }
    })
    .catch((err) => {
      Message.error(err || "獲取服務器登錄方式失敗");
    });
});

router.afterEach(() => {
  NProgress.done(); // 結束Progress
});
