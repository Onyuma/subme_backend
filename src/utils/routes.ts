// import { RouteParams } from "../types";
// import express from "express";

// const routes = <T extends express.Router> (routes: RouteParams[]) => {
//     return routes.map((route) => {
//        switch (route.method) {
//         case "GET":
//             T.prototype.get(route.route, route.handler);
//             break;
//         case "POST":
//             T.prototype.post(route.route, route.handler);
//             break;
//         case "PUT":
//             T.prototype.put(route.route, route.handler);
//             break;
//         case "DELETE":
//             T.prototype.delete(route.route, route.handler);
//             break;
//         case "PATCH":
//             T.prototype.patch(route.route, route.handler);
//             break;
//       }
//     });
//   };
