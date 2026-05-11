"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DojoRegistryClient = exports.DojoRegistryFactory = exports.DojoRegistryParamsFactory = exports.APP_SPEC = void 0;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "DojoRegistry", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "address", "name": "admin" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "desc": "Initialize the registry with admin address.", "events": [], "recommendations": {} }, { "name": "register_agent", "args": [{ "type": "string", "name": "agent_id" }, { "type": "address", "name": "sensei" }, { "type": "uint64", "name": "lane" }, { "type": "byte[]", "name": "config_hash" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Register a new agent with lane assignment and sealed config hash.", "events": [], "recommendations": {} }, { "name": "list_agent", "args": [{ "type": "string", "name": "agent_id" }, { "type": "uint64", "name": "expiry" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "List agent in marketplace with a specific expiry timestamp.", "events": [], "recommendations": {} }, { "name": "delist_agent", "args": [{ "type": "string", "name": "agent_id" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Remove agent from marketplace.", "events": [], "recommendations": {} }, { "name": "increment_tasks", "args": [{ "type": "string", "name": "agent_id" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Increment cumulative successful task count.", "events": [], "recommendations": {} }, { "name": "increment_tasks_failed", "args": [{ "type": "string", "name": "agent_id" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Increment cumulative failed task count (slashing).", "events": [], "recommendations": {} }, { "name": "update_status", "args": [{ "type": "string", "name": "agent_id" }, { "type": "uint64", "name": "status" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Update agent operational status manually.", "events": [], "recommendations": {} }, { "name": "get_agent", "args": [{ "type": "string", "name": "agent_id" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Retrieve full agent record.", "events": [], "recommendations": {} }], "arcs": [22, 28], "desc": "Master agent identity store tracking lane assignment, status, config hash, task history, and expiry.", "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "admin": { "keyType": "AVMString", "valueType": "address", "key": "YWRtaW4=" }, "total_agents": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dG90YWxfYWdlbnRz" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [208], "errorMessage": "Agent already registered" }, { "pc": [490, 572, 663], "errorMessage": "Only admin" }, { "pc": [304, 415], "errorMessage": "Only sensei or admin" }, { "pc": [197], "errorMessage": "Unauthorized registration" }, { "pc": [183, 298, 409, 488, 570, 661], "errorMessage": "check self.admin exists" }, { "pc": [239], "errorMessage": "check self.total_agents exists" }, { "pc": [137, 167, 258, 380, 475, 557, 639, 729], "errorMessage": "invalid array length header" }, { "pc": [143, 174, 265, 387, 482, 564, 646, 736], "errorMessage": "invalid number of bytes for arc4.dynamic_array<arc4.uint8>" }, { "pc": [122, 152], "errorMessage": "invalid number of bytes for arc4.static_array<arc4.uint8, 32>" }, { "pc": [161, 276, 655], "errorMessage": "invalid number of bytes for arc4.uint64" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuYXBwcm92YWxfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIGludGNibG9jayAwIDEgMiA0MAogICAgYnl0ZWNibG9jayAiYWRtaW4iIDB4MTUxZjdjNzU4MCAidG90YWxfYWdlbnRzIgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTEKICAgIC8vIGNsYXNzIERvam9SZWdpc3RyeShBUkM0Q29udHJhY3QpOgogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0CiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEAxMwogICAgcHVzaGJ5dGVzcyAweDkzOWZjNmE0IDB4OWE5NTVhMTEgMHgzYzRlMTk0NyAweGI1YjZhZjhlIDB4YWNlNTQwYTYgMHg2ZThkYjY1MyAweDQ0MjIxZjU5IC8vIG1ldGhvZCAicmVnaXN0ZXJfYWdlbnQoc3RyaW5nLGFkZHJlc3MsdWludDY0LGJ5dGVbXSlib29sIiwgbWV0aG9kICJsaXN0X2FnZW50KHN0cmluZyx1aW50NjQpYm9vbCIsIG1ldGhvZCAiZGVsaXN0X2FnZW50KHN0cmluZylib29sIiwgbWV0aG9kICJpbmNyZW1lbnRfdGFza3Moc3RyaW5nKWJvb2wiLCBtZXRob2QgImluY3JlbWVudF90YXNrc19mYWlsZWQoc3RyaW5nKWJvb2wiLCBtZXRob2QgInVwZGF0ZV9zdGF0dXMoc3RyaW5nLHVpbnQ2NClib29sIiwgbWV0aG9kICJnZXRfYWdlbnQoc3RyaW5nKWJ5dGVbXSIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIHJlZ2lzdGVyX2FnZW50IGxpc3RfYWdlbnQgZGVsaXN0X2FnZW50IGluY3JlbWVudF90YXNrcyBpbmNyZW1lbnRfdGFza3NfZmFpbGVkIHVwZGF0ZV9zdGF0dXMgZ2V0X2FnZW50CiAgICBlcnIKCm1haW5fY3JlYXRlX05vT3BAMTM6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToxMQogICAgLy8gY2xhc3MgRG9qb1JlZ2lzdHJ5KEFSQzRDb250cmFjdCk6CiAgICBwdXNoYnl0ZXMgMHhjYzY5NGVhYSAvLyBtZXRob2QgImNyZWF0ZShhZGRyZXNzKXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKCi8vIGRvam9fcmVnaXN0cnkuY29udHJhY3QuRG9qb1JlZ2lzdHJ5LmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjE4CiAgICAvLyBAYWJpbWV0aG9kKGNyZWF0ZT0icmVxdWlyZSIpCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5zdGF0aWNfYXJyYXk8YXJjNC51aW50OCwgMzI+CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToyMS0yMgogICAgLy8gIyBIYXJkY29kZWQgYWRtaW4gZm9yIG5vdyAtIHdpbGwgdXNlIHBhcmFtZXRlcgogICAgLy8gc2VsZi5hZG1pbi52YWx1ZSA9IGFkbWluLm5hdGl2ZQogICAgYnl0ZWNfMCAvLyAiYWRtaW4iCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MjMKICAgIC8vIHNlbGYudG90YWxfYWdlbnRzLnZhbHVlID0gVUludDY0KDApCiAgICBieXRlY18yIC8vICJ0b3RhbF9hZ2VudHMiCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjE4CiAgICAvLyBAYWJpbWV0aG9kKGNyZWF0ZT0icmVxdWlyZSIpCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gZG9qb19yZWdpc3RyeS5jb250cmFjdC5Eb2pvUmVnaXN0cnkucmVnaXN0ZXJfYWdlbnRbcm91dGluZ10oKSAtPiB2b2lkOgpyZWdpc3Rlcl9hZ2VudDoKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjI1CiAgICAvLyBAYWJpbWV0aG9kCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXBuIDIKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LmR5bmFtaWNfYXJyYXk8YXJjNC51aW50OD4KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LnN0YXRpY19hcnJheTxhcmM0LnVpbnQ4LCAzMj4KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQudWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5keW5hbWljX2FycmF5PGFyYzQudWludDg+CiAgICBleHRyYWN0IDIgMAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MzQtMzUKICAgIC8vICMgQWxsb3cgZWl0aGVyIGFkbWluIG9yIHRoZSBzZW5zZWkgdGhlbXNlbHZlcyB0byByZWdpc3RlcgogICAgLy8gYXNzZXJ0IFR4bi5zZW5kZXIgPT0gc2VsZi5hZG1pbi52YWx1ZSBvciBUeG4uc2VuZGVyID09IHNlbnNlaS5uYXRpdmUsICgKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJhZG1pbiIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5hZG1pbiBleGlzdHMKICAgID09CiAgICBibnogcmVnaXN0ZXJfYWdlbnRfYm9vbF90cnVlQDMKICAgIHR4biBTZW5kZXIKICAgIGRpZyAzCiAgICA9PQogICAgYnogcmVnaXN0ZXJfYWdlbnRfYm9vbF9mYWxzZUA0CgpyZWdpc3Rlcl9hZ2VudF9ib29sX3RydWVAMzoKICAgIGludGNfMSAvLyAxCgpyZWdpc3Rlcl9hZ2VudF9ib29sX21lcmdlQDU6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTozNC0zNwogICAgLy8gIyBBbGxvdyBlaXRoZXIgYWRtaW4gb3IgdGhlIHNlbnNlaSB0aGVtc2VsdmVzIHRvIHJlZ2lzdGVyCiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBzZWxmLmFkbWluLnZhbHVlIG9yIFR4bi5zZW5kZXIgPT0gc2Vuc2VpLm5hdGl2ZSwgKAogICAgLy8gICAgICJVbmF1dGhvcml6ZWQgcmVnaXN0cmF0aW9uIgogICAgLy8gKQogICAgYXNzZXJ0IC8vIFVuYXV0aG9yaXplZCByZWdpc3RyYXRpb24KICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjM5CiAgICAvLyBib3hfa2V5ID0gYWdlbnRfaWQubmF0aXZlLmJ5dGVzCiAgICBkaWcgMwogICAgZXh0cmFjdCAyIDAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjQwCiAgICAvLyBhc3NlcnQgbm90IG9wLkJveC5sZW5ndGgoYm94X2tleSlbMV0sICJBZ2VudCBhbHJlYWR5IHJlZ2lzdGVyZWQiCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgIQogICAgYXNzZXJ0IC8vIEFnZW50IGFscmVhZHkgcmVnaXN0ZXJlZAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NDItNDQKICAgIC8vICMgQm94IGZvcm1hdDogc2Vuc2VpKDMyKSArIGxhbmUoOCkgKyBzdGF0dXMoMSkgKyBjb25maWdfaGFzaCgzMikgKyB0YXNrcyg4KSArIGZhaWxlZF90YXNrcyg4KSArIGV4cGlyeSg4KSA9IDk3IGJ5dGVzCiAgICAvLyAjIHN0YXR1czogMD1SRUdJU1RFUkVELCAxPUxJU1RFRCwgMj1ERUxJU1RFRAogICAgLy8gc2Vuc2VpX2J5dGVzID0gb3AuZXh0cmFjdChzZW5zZWkubmF0aXZlLmJ5dGVzLCAwLCAzMikKICAgIGRpZyAzCiAgICBleHRyYWN0IDAgMzIKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjQ1CiAgICAvLyBsYW5lX2J5dGVzID0gb3AuaXRvYihsYW5lLm5hdGl2ZSkKICAgIGRpZyAzCiAgICBidG9pCiAgICBpdG9iCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo0NgogICAgLy8gcGFydDEgPSBvcC5jb25jYXQoc2Vuc2VpX2J5dGVzLCBsYW5lX2J5dGVzKQogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo0NwogICAgLy8gcGFydDIgPSBvcC5jb25jYXQob3AuYnplcm8oMSksIGNvbmZpZ19oYXNoKSAgIyBTdGF0dXMgKDApICsgY29uZmlnX2hhc2gKICAgIGludGNfMSAvLyAxCiAgICBiemVybwogICAgZGlnIDMKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NDgKICAgIC8vIHBhcnQzID0gb3AuY29uY2F0KHBhcnQxLCBwYXJ0MikKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NDktNTAKICAgIC8vICMgdGFza3MoOCkgKyBmYWlsZWRfdGFza3MoOCkgKyBleHBpcnkoOCkgPSAyNCBieXRlcwogICAgLy8gYm94X2RhdGEgPSBvcC5jb25jYXQocGFydDMsIG9wLmJ6ZXJvKDI0KSkKICAgIHB1c2hpbnQgMjQKICAgIGJ6ZXJvCiAgICBjb25jYXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjUxCiAgICAvLyBvcC5Cb3guY3JlYXRlKGJveF9rZXksIFVJbnQ2NCg5NykpCiAgICBkaWcgMQogICAgcHVzaGludCA5NwogICAgYm94X2NyZWF0ZQogICAgcG9wCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo1MgogICAgLy8gb3AuQm94LnB1dChib3hfa2V5LCBib3hfZGF0YSkKICAgIGJveF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjU0CiAgICAvLyBzZWxmLnRvdGFsX2FnZW50cy52YWx1ZSArPSBVSW50NjQoMSkKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18yIC8vICJ0b3RhbF9hZ2VudHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYudG90YWxfYWdlbnRzIGV4aXN0cwogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ5dGVjXzIgLy8gInRvdGFsX2FnZW50cyIKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToyNQogICAgLy8gQGFiaW1ldGhvZAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1ODAKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKcmVnaXN0ZXJfYWdlbnRfYm9vbF9mYWxzZUA0OgogICAgaW50Y18wIC8vIDAKICAgIGIgcmVnaXN0ZXJfYWdlbnRfYm9vbF9tZXJnZUA1CgoKLy8gZG9qb19yZWdpc3RyeS5jb250cmFjdC5Eb2pvUmVnaXN0cnkubGlzdF9hZ2VudFtyb3V0aW5nXSgpIC0+IHZvaWQ6Cmxpc3RfYWdlbnQ6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo1NwogICAgLy8gQGFiaW1ldGhvZAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYgLy8gb24gZXJyb3I6IGludmFsaWQgYXJyYXkgbGVuZ3RoIGhlYWRlcgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ4PgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBsZW4KICAgIHB1c2hpbnQgOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC51aW50NjQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjYwCiAgICAvLyBib3hfa2V5ID0gYWdlbnRfaWQubmF0aXZlLmJ5dGVzCiAgICBleHRyYWN0IDIgMAogICAgZHVwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo2MQogICAgLy8gZGF0YSwgX2V4aXN0cyA9IG9wLkJveC5nZXQoYm94X2tleSkKICAgIGJveF9nZXQKICAgIHBvcAogICAgZHVwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo2MwogICAgLy8gc2Vuc2VpID0gQWNjb3VudChvcC5leHRyYWN0KGRhdGEsIDAsIDMyKSkKICAgIGV4dHJhY3QgMCAzMgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NjQKICAgIC8vIGFzc2VydCBUeG4uc2VuZGVyID09IHNlbnNlaSBvciBUeG4uc2VuZGVyID09IHNlbGYuYWRtaW4udmFsdWUsICgKICAgIHR4biBTZW5kZXIKICAgID09CiAgICBibnogbGlzdF9hZ2VudF9ib29sX3RydWVAMwogICAgdHhuIFNlbmRlcgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzAgLy8gImFkbWluIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLmFkbWluIGV4aXN0cwogICAgPT0KICAgIGJ6IGxpc3RfYWdlbnRfYm9vbF9mYWxzZUA0CgpsaXN0X2FnZW50X2Jvb2xfdHJ1ZUAzOgogICAgaW50Y18xIC8vIDEKCmxpc3RfYWdlbnRfYm9vbF9tZXJnZUA1OgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NjQtNjYKICAgIC8vIGFzc2VydCBUeG4uc2VuZGVyID09IHNlbnNlaSBvciBUeG4uc2VuZGVyID09IHNlbGYuYWRtaW4udmFsdWUsICgKICAgIC8vICAgICAiT25seSBzZW5zZWkgb3IgYWRtaW4iCiAgICAvLyApCiAgICBhc3NlcnQgLy8gT25seSBzZW5zZWkgb3IgYWRtaW4KICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjY4LTY5CiAgICAvLyAjIFVwZGF0ZSBzdGF0dXMgdG8gMSAoTElTVEVEKSBhbmQgc2V0IGV4cGlyeQogICAgLy8gdXBkYXRlZCA9IGRhdGFbOjQwXSArIEJ5dGVzKGIiXHgwMSIpICsgZGF0YVs0MTo4OV0gKyBvcC5pdG9iKGV4cGlyeS5uYXRpdmUpCiAgICBkdXBuIDIKICAgIGxlbgogICAgaW50Y18zIC8vIDQwCiAgICBkaWcgMQogICAgPj0KICAgIGludGNfMyAvLyA0MAogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkaWcgMgogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgcHVzaGJ5dGVzIDB4MDEKICAgIGNvbmNhdAogICAgcHVzaGludCA0MQogICAgZGlnIDIKICAgID49CiAgICBwdXNoaW50IDQxCiAgICBkaWcgMwogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIHB1c2hpbnQgODkKICAgIGRpZyAzCiAgICA+PQogICAgcHVzaGludCA4OQogICAgdW5jb3ZlciA0CiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgdW5jb3ZlciAzCiAgICBjb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICBjb25jYXQKICAgIGRpZyAzCiAgICBidG9pCiAgICBpdG9iCiAgICBjb25jYXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjcwCiAgICAvLyBvcC5Cb3gucHV0KGJveF9rZXksIHVwZGF0ZWQpCiAgICBkaWcgMgogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NTcKICAgIC8vIEBhYmltZXRob2QKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NTgwCiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmxpc3RfYWdlbnRfYm9vbF9mYWxzZUA0OgogICAgaW50Y18wIC8vIDAKICAgIGIgbGlzdF9hZ2VudF9ib29sX21lcmdlQDUKCgovLyBkb2pvX3JlZ2lzdHJ5LmNvbnRyYWN0LkRvam9SZWdpc3RyeS5kZWxpc3RfYWdlbnRbcm91dGluZ10oKSAtPiB2b2lkOgpkZWxpc3RfYWdlbnQ6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo3MwogICAgLy8gQGFiaW1ldGhvZAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYgLy8gb24gZXJyb3I6IGludmFsaWQgYXJyYXkgbGVuZ3RoIGhlYWRlcgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ4PgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NzYKICAgIC8vIGJveF9rZXkgPSBhZ2VudF9pZC5uYXRpdmUuYnl0ZXMKICAgIGV4dHJhY3QgMiAwCiAgICBkdXAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5Ojc3CiAgICAvLyBkYXRhLCBfZXhpc3RzID0gb3AuQm94LmdldChib3hfa2V5KQogICAgYm94X2dldAogICAgcG9wCiAgICBkdXAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5Ojc5CiAgICAvLyBzZW5zZWkgPSBBY2NvdW50KG9wLmV4dHJhY3QoZGF0YSwgMCwgMzIpKQogICAgZXh0cmFjdCAwIDMyCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo4MAogICAgLy8gYXNzZXJ0IFR4bi5zZW5kZXIgPT0gc2Vuc2VpIG9yIFR4bi5zZW5kZXIgPT0gc2VsZi5hZG1pbi52YWx1ZSwgKAogICAgdHhuIFNlbmRlcgogICAgPT0KICAgIGJueiBkZWxpc3RfYWdlbnRfYm9vbF90cnVlQDMKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJhZG1pbiIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5hZG1pbiBleGlzdHMKICAgID09CiAgICBieiBkZWxpc3RfYWdlbnRfYm9vbF9mYWxzZUA0CgpkZWxpc3RfYWdlbnRfYm9vbF90cnVlQDM6CiAgICBpbnRjXzEgLy8gMQoKZGVsaXN0X2FnZW50X2Jvb2xfbWVyZ2VANToKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjgwLTgyCiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBzZW5zZWkgb3IgVHhuLnNlbmRlciA9PSBzZWxmLmFkbWluLnZhbHVlLCAoCiAgICAvLyAgICAgIk9ubHkgc2Vuc2VpIG9yIGFkbWluIgogICAgLy8gKQogICAgYXNzZXJ0IC8vIE9ubHkgc2Vuc2VpIG9yIGFkbWluCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo4NC04NQogICAgLy8gIyBVcGRhdGUgc3RhdHVzIHRvIDIgKERFTElTVEVEKQogICAgLy8gdXBkYXRlZCA9IGRhdGFbOjQwXSArIEJ5dGVzKGIiXHgwMiIpICsgZGF0YVs0MTpdCiAgICBkdXBuIDIKICAgIGxlbgogICAgaW50Y18zIC8vIDQwCiAgICBkaWcgMQogICAgPj0KICAgIGludGNfMyAvLyA0MAogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkaWcgMgogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgcHVzaGJ5dGVzIDB4MDIKICAgIGNvbmNhdAogICAgcHVzaGludCA0MQogICAgZGlnIDIKICAgID49CiAgICBwdXNoaW50IDQxCiAgICBkaWcgMwogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIHVuY292ZXIgMwogICAgc3dhcAogICAgdW5jb3ZlciAzCiAgICBzdWJzdHJpbmczCiAgICBjb25jYXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5Ojg2CiAgICAvLyBvcC5Cb3gucHV0KGJveF9rZXksIHVwZGF0ZWQpCiAgICBkaWcgMgogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NzMKICAgIC8vIEBhYmltZXRob2QKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NTgwCiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmRlbGlzdF9hZ2VudF9ib29sX2ZhbHNlQDQ6CiAgICBpbnRjXzAgLy8gMAogICAgYiBkZWxpc3RfYWdlbnRfYm9vbF9tZXJnZUA1CgoKLy8gZG9qb19yZWdpc3RyeS5jb250cmFjdC5Eb2pvUmVnaXN0cnkuaW5jcmVtZW50X3Rhc2tzW3JvdXRpbmddKCkgLT4gdm9pZDoKaW5jcmVtZW50X3Rhc2tzOgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6ODkKICAgIC8vIEBhYmltZXRob2QKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2IC8vIG9uIGVycm9yOiBpbnZhbGlkIGFycmF5IGxlbmd0aCBoZWFkZXIKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LmR5bmFtaWNfYXJyYXk8YXJjNC51aW50OD4KICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjkyCiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBzZWxmLmFkbWluLnZhbHVlLCAiT25seSBhZG1pbiIKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJhZG1pbiIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5hZG1pbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSBhZG1pbgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6OTQKICAgIC8vIGJveF9rZXkgPSBhZ2VudF9pZC5uYXRpdmUuYnl0ZXMKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo5NQogICAgLy8gZGF0YSwgX2V4aXN0cyA9IG9wLkJveC5nZXQoYm94X2tleSkKICAgIGR1cAogICAgYm94X2dldAogICAgcG9wCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo5Ny05OQogICAgLy8gdGFza19jb3VudCA9IG9wLmJ0b2koCiAgICAvLyAgICAgb3AuZXh0cmFjdChkYXRhLCA3MywgOCkKICAgIC8vICkgICMgT2Zmc2V0IGFkanVzdGVkIGZvciBuZXcgc3RhdHVzIGJ5dGUgYW5kIHByZXZpb3VzIGZpZWxkcwogICAgZHVwCiAgICBwdXNoaW50IDczCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTAwCiAgICAvLyBuZXdfY291bnQgPSB0YXNrX2NvdW50ICsgVUludDY0KDEpCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTAxCiAgICAvLyB1cGRhdGVkID0gZGF0YVs6NzNdICsgb3AuaXRvYihuZXdfY291bnQpICsgZGF0YVs4MTpdCiAgICBkaWcgMQogICAgbGVuCiAgICBwdXNoaW50IDczCiAgICBkaWcgMQogICAgPj0KICAgIHB1c2hpbnQgNzMKICAgIGRpZyAyCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgZGlnIDMKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIHVuY292ZXIgMgogICAgaXRvYgogICAgY29uY2F0CiAgICBwdXNoaW50IDgxCiAgICBkaWcgMgogICAgPj0KICAgIHB1c2hpbnQgODEKICAgIGRpZyAzCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgdW5jb3ZlciAzCiAgICBzd2FwCiAgICB1bmNvdmVyIDMKICAgIHN1YnN0cmluZzMKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTAyCiAgICAvLyBvcC5Cb3gucHV0KGJveF9rZXksIHVwZGF0ZWQpCiAgICBib3hfcHV0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo4OQogICAgLy8gQGFiaW1ldGhvZAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1ODAKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIGRvam9fcmVnaXN0cnkuY29udHJhY3QuRG9qb1JlZ2lzdHJ5LmluY3JlbWVudF90YXNrc19mYWlsZWRbcm91dGluZ10oKSAtPiB2b2lkOgppbmNyZW1lbnRfdGFza3NfZmFpbGVkOgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTA2CiAgICAvLyBAYWJpbWV0aG9kCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5keW5hbWljX2FycmF5PGFyYzQudWludDg+CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToxMDkKICAgIC8vIGFzc2VydCBUeG4uc2VuZGVyID09IHNlbGYuYWRtaW4udmFsdWUsICJPbmx5IGFkbWluIgogICAgdHhuIFNlbmRlcgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzAgLy8gImFkbWluIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLmFkbWluIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IGFkbWluCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToxMTEKICAgIC8vIGJveF9rZXkgPSBhZ2VudF9pZC5uYXRpdmUuYnl0ZXMKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToxMTIKICAgIC8vIGRhdGEsIF9leGlzdHMgPSBvcC5Cb3guZ2V0KGJveF9rZXkpCiAgICBkdXAKICAgIGJveF9nZXQKICAgIHBvcAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTE0CiAgICAvLyBmYWlsZWRfY291bnQgPSBvcC5idG9pKG9wLmV4dHJhY3QoZGF0YSwgODEsIDgpKQogICAgZHVwCiAgICBwdXNoaW50IDgxCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTE1CiAgICAvLyBuZXdfY291bnQgPSBmYWlsZWRfY291bnQgKyBVSW50NjQoMSkKICAgIGludGNfMSAvLyAxCiAgICArCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToxMTYKICAgIC8vIHVwZGF0ZWQgPSBkYXRhWzo4MV0gKyBvcC5pdG9iKG5ld19jb3VudCkgKyBkYXRhWzg5Ol0KICAgIGRpZyAxCiAgICBsZW4KICAgIHB1c2hpbnQgODEKICAgIGRpZyAxCiAgICA+PQogICAgcHVzaGludCA4MQogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkaWcgMwogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgdW5jb3ZlciAyCiAgICBpdG9iCiAgICBjb25jYXQKICAgIHB1c2hpbnQgODkKICAgIGRpZyAyCiAgICA+PQogICAgcHVzaGludCA4OQogICAgZGlnIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICB1bmNvdmVyIDMKICAgIHN3YXAKICAgIHVuY292ZXIgMwogICAgc3Vic3RyaW5nMwogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToxMTcKICAgIC8vIG9wLkJveC5wdXQoYm94X2tleSwgdXBkYXRlZCkKICAgIGJveF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjEwNgogICAgLy8gQGFiaW1ldGhvZAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1ODAKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIGRvam9fcmVnaXN0cnkuY29udHJhY3QuRG9qb1JlZ2lzdHJ5LnVwZGF0ZV9zdGF0dXNbcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGVfc3RhdHVzOgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTIxCiAgICAvLyBAYWJpbWV0aG9kCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5keW5hbWljX2FycmF5PGFyYzQudWludDg+CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LnVpbnQ2NAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTI0CiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBzZWxmLmFkbWluLnZhbHVlLCAiT25seSBhZG1pbiIKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJhZG1pbiIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5hZG1pbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSBhZG1pbgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTI2CiAgICAvLyBib3hfa2V5ID0gYWdlbnRfaWQubmF0aXZlLmJ5dGVzCiAgICBzd2FwCiAgICBleHRyYWN0IDIgMAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTI3CiAgICAvLyBkYXRhLCBfZXhpc3RzID0gb3AuQm94LmdldChib3hfa2V5KQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjEyOQogICAgLy8gc3RhdHVzX2J5dGUgPSBvcC5leHRyYWN0KG9wLml0b2Ioc3RhdHVzLm5hdGl2ZSksIDcsIDEpCiAgICB1bmNvdmVyIDIKICAgIGJ0b2kKICAgIGl0b2IKICAgIGV4dHJhY3QgNyAxCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToxMzAKICAgIC8vIHVwZGF0ZWQgPSBkYXRhWzo0MF0gKyBzdGF0dXNfYnl0ZSArIGRhdGFbNDE6XQogICAgZGlnIDEKICAgIGxlbgogICAgaW50Y18zIC8vIDQwCiAgICBkaWcgMQogICAgPj0KICAgIGludGNfMyAvLyA0MAogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkaWcgMwogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgdW5jb3ZlciAyCiAgICBjb25jYXQKICAgIHB1c2hpbnQgNDEKICAgIGRpZyAyCiAgICA+PQogICAgcHVzaGludCA0MQogICAgZGlnIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICB1bmNvdmVyIDMKICAgIHN3YXAKICAgIHVuY292ZXIgMwogICAgc3Vic3RyaW5nMwogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToxMzEKICAgIC8vIG9wLkJveC5wdXQoYm94X2tleSwgdXBkYXRlZCkKICAgIGJveF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjEyMQogICAgLy8gQGFiaW1ldGhvZAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1ODAKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIGRvam9fcmVnaXN0cnkuY29udHJhY3QuRG9qb1JlZ2lzdHJ5LmdldF9hZ2VudFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldF9hZ2VudDoKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjEzNQogICAgLy8gQGFiaW1ldGhvZChyZWFkb25seT1UcnVlKQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYgLy8gb24gZXJyb3I6IGludmFsaWQgYXJyYXkgbGVuZ3RoIGhlYWRlcgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ4PgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTM4CiAgICAvLyBib3hfa2V5ID0gYWdlbnRfaWQubmF0aXZlLmJ5dGVzCiAgICBleHRyYWN0IDIgMAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTM5CiAgICAvLyBkYXRhLCBfZXhpc3RzID0gb3AuQm94LmdldChib3hfa2V5KQogICAgYm94X2dldAogICAgcG9wCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToxMzUKICAgIC8vIEBhYmltZXRob2QocmVhZG9ubHk9VHJ1ZSkKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBwdXNoYnl0ZXMgMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4K", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuY2xlYXJfc3RhdGVfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIHB1c2hpbnQgMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAECKCYDBWFkbWluBRUffHWADHRvdGFsX2FnZW50czEZFEQxGEEAOYIHBJOfxqQEmpVaEQQ8ThlHBLW2r44ErOVApgRujbZTBEQiH1k2GgCOBwAgAJoBFAFzAcUCFwJxAIAEzGlOqjYaAI4BAAEANhoBSRWBIBJEKExnKiJnI0M2GgFHAiJZJAhMFRJENhoCSRWBIBJENhoDSRWBCBJENhoESSJZJAhLARUSRFcCADEAIihlRBJAAAgxAEsDEkEANSNESwNXAgBJvUUBFERLA1cAIEsDFxZQI69LA1BQgRivUEsBgWG5SL8iKmVEIwgqTGcpsCNDIkL/yDYaAUkiWSQISwEVEkQ2GgJJTgIVgQgSRFcCAEm+SElXACAxABJAAAoxACIoZUQSQQBEI0RHAhUlSwEPJUsCTwJNSwIiTwJSgAEBUIEpSwIPgSlLA08CTYFZSwMPgVlPBE8CTU8DTgJSUEsDFxZQSwJMvymwI0MiQv+5NhoBSSJZJAhLARUSRFcCAEm+SElXACAxABJAAAoxACIoZUQSQQA0I0RHAhUlSwEPJUsCTwJNSwIiTwJSgAECUIEpSwIPgSlLA08CTU8DTE8DUlBLAky/KbAjQyJC/8k2GgFJIlkkCEsBFRJEMQAiKGVEEkRXAgBJvkhJgUlbIwhLARWBSUsBD4FJSwJPAk1LAyJPAlJPAhZQgVFLAg+BUUsDTwJNTwNMTwNSUL8psCNDNhoBSSJZJAhLARUSRDEAIihlRBJEVwIASb5ISYFRWyMISwEVgVFLAQ+BUUsCTwJNSwMiTwJSTwIWUIFZSwIPgVlLA08CTU8DTE8DUlC/KbAjQzYaAUkiWSQISwEVEkQ2GgJJFYEIEkQxACIoZUQSRExXAgBJvkhPAhcWVwcBSwEVJUsBDyVLAk8CTUsDIk8CUk8CUIEpSwIPgSlLA08CTU8DTE8DUlC/KbAjQzYaAUkiWSQISwEVEkRXAgC+SEkVFlcGAkxQgAQVH3x1TFCwI0M=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
class BinaryStateValue {
    value;
    constructor(value) {
        this.value = value;
    }
    asByteArray() {
        return this.value;
    }
    asString() {
        return this.value !== undefined ? Buffer.from(this.value).toString('utf-8') : undefined;
    }
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the DojoRegistry smart contract
 */
class DojoRegistryParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(address)void':
                        return DojoRegistryParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the DojoRegistry smart contract using the create(address)void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            create(params) {
                return {
                    ...params,
                    method: 'create(address)void',
                    args: Array.isArray(params.args) ? params.args : [params.args.admin],
                };
            },
        };
    }
    /**
     * Constructs a no op call for the register_agent(string,address,uint64,byte[])bool ABI method
     *
     * Register a new agent with lane assignment and sealed config hash.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static registerAgent(params) {
        return {
            ...params,
            method: 'register_agent(string,address,uint64,byte[])bool',
            args: Array.isArray(params.args) ? params.args : [params.args.agentId, params.args.sensei, params.args.lane, params.args.configHash],
        };
    }
    /**
     * Constructs a no op call for the list_agent(string,uint64)bool ABI method
     *
     * List agent in marketplace with a specific expiry timestamp.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static listAgent(params) {
        return {
            ...params,
            method: 'list_agent(string,uint64)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.agentId, params.args.expiry],
        };
    }
    /**
     * Constructs a no op call for the delist_agent(string)bool ABI method
     *
     * Remove agent from marketplace.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static delistAgent(params) {
        return {
            ...params,
            method: 'delist_agent(string)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.agentId],
        };
    }
    /**
     * Constructs a no op call for the increment_tasks(string)bool ABI method
     *
     * Increment cumulative successful task count.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static incrementTasks(params) {
        return {
            ...params,
            method: 'increment_tasks(string)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.agentId],
        };
    }
    /**
     * Constructs a no op call for the increment_tasks_failed(string)bool ABI method
     *
     * Increment cumulative failed task count (slashing).
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static incrementTasksFailed(params) {
        return {
            ...params,
            method: 'increment_tasks_failed(string)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.agentId],
        };
    }
    /**
     * Constructs a no op call for the update_status(string,uint64)bool ABI method
     *
     * Update agent operational status manually.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static updateStatus(params) {
        return {
            ...params,
            method: 'update_status(string,uint64)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.agentId, params.args.status],
        };
    }
    /**
     * Constructs a no op call for the get_agent(string)byte[] ABI method
     *
     * Retrieve full agent record.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getAgent(params) {
        return {
            ...params,
            method: 'get_agent(string)byte[]',
            args: Array.isArray(params.args) ? params.args : [params.args.agentId],
        };
    }
}
exports.DojoRegistryParamsFactory = DojoRegistryParamsFactory;
/**
 * A factory to create and deploy one or more instance of the DojoRegistry smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class DojoRegistryFactory {
    /**
     * The underlying `AppFactory` for when you want to have more flexibility
     */
    appFactory;
    /**
     * Creates a new instance of `DojoRegistryFactory`
     *
     * @param params The parameters to initialise the app factory with
     */
    constructor(params) {
        this.appFactory = new app_factory_1.AppFactory({
            ...params,
            appSpec: exports.APP_SPEC,
        });
    }
    /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
    get appName() {
        return this.appFactory.appName;
    }
    /** The ARC-56 app spec being used */
    get appSpec() {
        return exports.APP_SPEC;
    }
    /** A reference to the underlying `AlgorandClient` this app factory is using. */
    get algorand() {
        return this.appFactory.algorand;
    }
    /**
     * Returns a new `AppClient` client for an app instance of the given ID.
     *
     * Automatically populates appName, defaultSender and source maps from the factory
     * if not specified in the params.
     * @param params The parameters to create the app client
     * @returns The `AppClient`
     */
    getAppClientById(params) {
        return new DojoRegistryClient(this.appFactory.getAppClientById(params));
    }
    /**
     * Returns a new `AppClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     *
     * Automatically populates appName, defaultSender and source maps from the factory
     * if not specified in the params.
     * @param params The parameters to create the app client
     * @returns The `AppClient`
     */
    async getAppClientByCreatorAndName(params) {
        return new DojoRegistryClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the DojoRegistry smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? DojoRegistryParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new DojoRegistryClient(result.appClient) };
    }
    /**
     * Get parameters to create transactions (create and deploy related calls) for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
     */
    params = {
        /**
         * Gets available create methods
         */
        create: {
            /**
             * Creates a new instance of the DojoRegistry smart contract using the create(address)void ABI method.
             *
             * Initialize the registry with admin address.
             *
             * @param params The params for the smart contract call
             * @returns The create params
             */
            create: (params) => {
                return this.appFactory.params.create(DojoRegistryParamsFactory.create.create(params));
            },
        },
    };
    /**
     * Create transactions for the current app
     */
    createTransaction = {
        /**
         * Gets available create methods
         */
        create: {
            /**
             * Creates a new instance of the DojoRegistry smart contract using the create(address)void ABI method.
             *
             * Initialize the registry with admin address.
             *
             * @param params The params for the smart contract call
             * @returns The create transaction
             */
            create: (params) => {
                return this.appFactory.createTransaction.create(DojoRegistryParamsFactory.create.create(params));
            },
        },
    };
    /**
     * Send calls to the current app
     */
    send = {
        /**
         * Gets available create methods
         */
        create: {
            /**
             * Creates a new instance of the DojoRegistry smart contract using an ABI method call using the create(address)void ABI method.
             *
             * Initialize the registry with admin address.
             *
             * @param params The params for the smart contract call
             * @returns The create result
             */
            create: async (params) => {
                const result = await this.appFactory.send.create(DojoRegistryParamsFactory.create.create(params));
                return { result: { ...result.result, return: result.result.return }, appClient: new DojoRegistryClient(result.appClient) };
            },
        },
    };
}
exports.DojoRegistryFactory = DojoRegistryFactory;
/**
 * A client to make calls to the DojoRegistry smart contract
 */
class DojoRegistryClient {
    /**
     * The underlying `AppClient` for when you want to have more flexibility
     */
    appClient;
    constructor(appClientOrParams) {
        this.appClient = appClientOrParams instanceof app_client_1.AppClient ? appClientOrParams : new app_client_1.AppClient({
            ...appClientOrParams,
            appSpec: exports.APP_SPEC,
        });
    }
    /**
     * Checks for decode errors on the given return value and maps the return value to the return type for the given method
     * @returns The typed return value or undefined if there was no value
     */
    decodeReturnValue(method, returnValue) {
        return returnValue !== undefined ? (0, app_arc56_1.getArc56ReturnValue)(returnValue, this.appClient.getABIMethod(method), exports.APP_SPEC.structs) : undefined;
    }
    /**
     * Returns a new `DojoRegistryClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new DojoRegistryClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `DojoRegistryClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new DojoRegistryClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
    }
    /** The ID of the app instance this client is linked to. */
    get appId() {
        return this.appClient.appId;
    }
    /** The app address of the app instance this client is linked to. */
    get appAddress() {
        return this.appClient.appAddress;
    }
    /** The name of the app. */
    get appName() {
        return this.appClient.appName;
    }
    /** The ARC-56 app spec being used */
    get appSpec() {
        return this.appClient.appSpec;
    }
    /** A reference to the underlying `AlgorandClient` this app client is using. */
    get algorand() {
        return this.appClient.algorand;
    }
    /**
     * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
     */
    params = {
        /**
         * Makes a clear_state call to an existing instance of the DojoRegistry smart contract.
         *
         * @param params The params for the bare (raw) call
         * @returns The clearState result
         */
        clearState: (params) => {
            return this.appClient.params.bare.clearState(params);
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `register_agent(string,address,uint64,byte[])bool` ABI method.
         *
         * Register a new agent with lane assignment and sealed config hash.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        registerAgent: (params) => {
            return this.appClient.params.call(DojoRegistryParamsFactory.registerAgent(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `list_agent(string,uint64)bool` ABI method.
         *
         * List agent in marketplace with a specific expiry timestamp.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        listAgent: (params) => {
            return this.appClient.params.call(DojoRegistryParamsFactory.listAgent(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `delist_agent(string)bool` ABI method.
         *
         * Remove agent from marketplace.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        delistAgent: (params) => {
            return this.appClient.params.call(DojoRegistryParamsFactory.delistAgent(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks(string)bool` ABI method.
         *
         * Increment cumulative successful task count.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        incrementTasks: (params) => {
            return this.appClient.params.call(DojoRegistryParamsFactory.incrementTasks(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks_failed(string)bool` ABI method.
         *
         * Increment cumulative failed task count (slashing).
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        incrementTasksFailed: (params) => {
            return this.appClient.params.call(DojoRegistryParamsFactory.incrementTasksFailed(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `update_status(string,uint64)bool` ABI method.
         *
         * Update agent operational status manually.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        updateStatus: (params) => {
            return this.appClient.params.call(DojoRegistryParamsFactory.updateStatus(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `get_agent(string)byte[]` ABI method.
         *
         * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
         *
         * Retrieve full agent record.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        getAgent: (params) => {
            return this.appClient.params.call(DojoRegistryParamsFactory.getAgent(params));
        },
    };
    /**
     * Create transactions for the current app
     */
    createTransaction = {
        /**
         * Makes a clear_state call to an existing instance of the DojoRegistry smart contract.
         *
         * @param params The params for the bare (raw) call
         * @returns The clearState result
         */
        clearState: (params) => {
            return this.appClient.createTransaction.bare.clearState(params);
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `register_agent(string,address,uint64,byte[])bool` ABI method.
         *
         * Register a new agent with lane assignment and sealed config hash.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        registerAgent: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.registerAgent(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `list_agent(string,uint64)bool` ABI method.
         *
         * List agent in marketplace with a specific expiry timestamp.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        listAgent: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.listAgent(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `delist_agent(string)bool` ABI method.
         *
         * Remove agent from marketplace.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        delistAgent: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.delistAgent(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks(string)bool` ABI method.
         *
         * Increment cumulative successful task count.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        incrementTasks: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.incrementTasks(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks_failed(string)bool` ABI method.
         *
         * Increment cumulative failed task count (slashing).
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        incrementTasksFailed: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.incrementTasksFailed(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `update_status(string,uint64)bool` ABI method.
         *
         * Update agent operational status manually.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        updateStatus: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.updateStatus(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `get_agent(string)byte[]` ABI method.
         *
         * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
         *
         * Retrieve full agent record.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        getAgent: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.getAgent(params));
        },
    };
    /**
     * Send calls to the current app
     */
    send = {
        /**
         * Makes a clear_state call to an existing instance of the DojoRegistry smart contract.
         *
         * @param params The params for the bare (raw) call
         * @returns The clearState result
         */
        clearState: (params) => {
            return this.appClient.send.bare.clearState(params);
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `register_agent(string,address,uint64,byte[])bool` ABI method.
         *
         * Register a new agent with lane assignment and sealed config hash.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        registerAgent: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.registerAgent(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `list_agent(string,uint64)bool` ABI method.
         *
         * List agent in marketplace with a specific expiry timestamp.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        listAgent: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.listAgent(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `delist_agent(string)bool` ABI method.
         *
         * Remove agent from marketplace.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        delistAgent: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.delistAgent(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks(string)bool` ABI method.
         *
         * Increment cumulative successful task count.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        incrementTasks: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.incrementTasks(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks_failed(string)bool` ABI method.
         *
         * Increment cumulative failed task count (slashing).
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        incrementTasksFailed: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.incrementTasksFailed(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `update_status(string,uint64)bool` ABI method.
         *
         * Update agent operational status manually.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        updateStatus: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.updateStatus(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `get_agent(string)byte[]` ABI method.
         *
         * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
         *
         * Retrieve full agent record.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        getAgent: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.getAgent(params));
            return { ...result, return: result.return };
        },
    };
    /**
     * Clone this app client with different params
     *
     * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
     * @returns A new app client with the altered params
     */
    clone(params) {
        return new DojoRegistryClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the DojoRegistry smart contract using the `get_agent(string)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Retrieve full agent record.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getAgent(params) {
        const result = await this.appClient.send.call(DojoRegistryParamsFactory.getAgent(params));
        return result.return;
    }
    /**
     * Methods to access state for the current DojoRegistry app
     */
    state = {
        /**
         * Methods to access global state for the current DojoRegistry app
         */
        global: {
            /**
             * Get all current keyed values from global state
             */
            getAll: async () => {
                const result = await this.appClient.state.global.getAll();
                return {
                    admin: result.admin,
                    totalAgents: result.total_agents,
                };
            },
            /**
             * Get the current value of the admin key in global state
             */
            admin: async () => { return (await this.appClient.state.global.getValue("admin")); },
            /**
             * Get the current value of the total_agents key in global state
             */
            totalAgents: async () => { return (await this.appClient.state.global.getValue("total_agents")); },
        },
    };
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a register_agent(string,address,uint64,byte[])bool method call against the DojoRegistry contract
             */
            registerAgent(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.registerAgent(params)));
                resultMappers.push((v) => client.decodeReturnValue('register_agent(string,address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a list_agent(string,uint64)bool method call against the DojoRegistry contract
             */
            listAgent(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.listAgent(params)));
                resultMappers.push((v) => client.decodeReturnValue('list_agent(string,uint64)bool', v));
                return this;
            },
            /**
             * Add a delist_agent(string)bool method call against the DojoRegistry contract
             */
            delistAgent(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.delistAgent(params)));
                resultMappers.push((v) => client.decodeReturnValue('delist_agent(string)bool', v));
                return this;
            },
            /**
             * Add a increment_tasks(string)bool method call against the DojoRegistry contract
             */
            incrementTasks(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.incrementTasks(params)));
                resultMappers.push((v) => client.decodeReturnValue('increment_tasks(string)bool', v));
                return this;
            },
            /**
             * Add a increment_tasks_failed(string)bool method call against the DojoRegistry contract
             */
            incrementTasksFailed(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.incrementTasksFailed(params)));
                resultMappers.push((v) => client.decodeReturnValue('increment_tasks_failed(string)bool', v));
                return this;
            },
            /**
             * Add a update_status(string,uint64)bool method call against the DojoRegistry contract
             */
            updateStatus(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateStatus(params)));
                resultMappers.push((v) => client.decodeReturnValue('update_status(string,uint64)bool', v));
                return this;
            },
            /**
             * Add a get_agent(string)byte[] method call against the DojoRegistry contract
             */
            getAgent(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getAgent(params)));
                resultMappers.push((v) => client.decodeReturnValue('get_agent(string)byte[]', v));
                return this;
            },
            /**
             * Add a clear state call to the DojoRegistry contract
             */
            clearState(params) {
                promiseChain = promiseChain.then(() => composer.addAppCall(client.params.clearState(params)));
                return this;
            },
            addTransaction(txn, signer) {
                promiseChain = promiseChain.then(() => composer.addTransaction(txn, signer));
                return this;
            },
            async composer() {
                await promiseChain;
                return composer;
            },
            async simulate(options) {
                await promiseChain;
                const result = await (!options ? composer.simulate() : composer.simulate(options));
                return {
                    ...result,
                    returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i](val) : val.returnValue)
                };
            },
            async send(params) {
                await promiseChain;
                const result = await composer.send(params);
                return {
                    ...result,
                    returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i](val) : val.returnValue)
                };
            }
        };
    }
}
exports.DojoRegistryClient = DojoRegistryClient;
