import {log, interpolate} from "./log";

log({classifier:"Read_Success", message: "any", producer: "Tenant", params:{tenenatId: "someTenantId"} });
log({classifier:"Read_Success", message: "any", producer: "DDB", params:{tenenatId: "someTenantId"} });

var t = interpolate({classifier:"Read_Success", producer: "DDB", message: "The {{speed}} {{fox.color}} {{mammal[2]}} jumped over the lazy {{mammal[0]}}", params: { speed: "quick", fox: { color: "brown" }, mammal: ["dog", "cat", "fox"] }});

console.log(t);
