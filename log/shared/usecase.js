"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("./log");
log_1.log({ classifier: "Read_Success", message: "any", producer: "Tenant", params: { tenenatId: "someTenantId" } });
log_1.log({ classifier: "Read_Success", message: "any", producer: "DDB", params: { tenenatId: "someTenantId" } });
var t = log_1.interpolate({ classifier: "Read_Success", producer: "DDB", message: "The {{speed}} {{fox.color}} {{mammal[2]}} jumped over the lazy {{mammal[0]}}", params: { speed: "quick", fox: { color: "brown" }, mammal: ["dog", "cat", "fox"] } });
console.log(t);
//# sourceMappingURL=usecase.js.map