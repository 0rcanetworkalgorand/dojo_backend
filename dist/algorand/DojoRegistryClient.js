"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DojoRegistryClient = exports.DojoRegistryFactory = exports.DojoRegistryParamsFactory = exports.APP_SPEC = void 0;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "DojoRegistry", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "address", "name": "admin" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "desc": "Initialize the registry with admin address.", "events": [], "recommendations": {} }, { "name": "register_agent", "args": [{ "type": "string", "name": "agent_id" }, { "type": "address", "name": "sensei" }, { "type": "uint64", "name": "lane" }, { "type": "byte[]", "name": "config_hash" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Register a new agent with lane assignment and sealed config hash.", "events": [], "recommendations": {} }, { "name": "update_status", "args": [{ "type": "string", "name": "agent_id" }, { "type": "bool", "name": "active" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Update agent operational status.", "events": [], "recommendations": {} }, { "name": "increment_tasks", "args": [{ "type": "string", "name": "agent_id" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Increment cumulative task count.", "events": [], "recommendations": {} }, { "name": "set_expiry", "args": [{ "type": "string", "name": "agent_id" }, { "type": "uint64", "name": "expiry_timestamp" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Set listing expiry timestamp.", "events": [], "recommendations": {} }, { "name": "get_agent", "args": [{ "type": "string", "name": "agent_id" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Retrieve full agent record.", "events": [], "recommendations": {} }], "arcs": [22, 28], "desc": "Master agent identity store tracking lane assignment, status, config hash, task history, and expiry.", "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "admin": { "keyType": "AVMString", "valueType": "address", "key": "YWRtaW4=" }, "total_agents": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dG90YWxfYWdlbnRz" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [178], "errorMessage": "Agent already registered" }, { "pc": [256], "errorMessage": "Agent not found" }, { "pc": [247, 341], "errorMessage": "Only admin" }, { "pc": [171], "errorMessage": "Only admin can register" }, { "pc": [452], "errorMessage": "Only sensei or admin" }, { "pc": [169, 245, 339, 446], "errorMessage": "check self.admin exists" }, { "pc": [209], "errorMessage": "check self.total_agents exists" }, { "pc": [122, 153, 224, 326, 406, 489], "errorMessage": "invalid array length header" }, { "pc": [239], "errorMessage": "invalid number of bytes for arc4.bool" }, { "pc": [129, 160, 231, 333, 413, 496], "errorMessage": "invalid number of bytes for arc4.dynamic_array<arc4.uint8>" }, { "pc": [108, 138], "errorMessage": "invalid number of bytes for arc4.static_array<arc4.uint8, 32>" }, { "pc": [147, 424], "errorMessage": "invalid number of bytes for arc4.uint64" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuYXBwcm92YWxfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIGludGNibG9jayAwIDEgMiA4MgogICAgYnl0ZWNibG9jayAiYWRtaW4iIDB4MTUxZjdjNzU4MCAidG90YWxfYWdlbnRzIgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NQogICAgLy8gY2xhc3MgRG9qb1JlZ2lzdHJ5KEFSQzRDb250cmFjdCk6CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBieiBtYWluX2NyZWF0ZV9Ob09wQDExCiAgICBwdXNoYnl0ZXNzIDB4OTM5ZmM2YTQgMHhhMDFjZTU2ZSAweGI1YjZhZjhlIDB4Nzc1MWNkYjIgMHg0NDIyMWY1OSAvLyBtZXRob2QgInJlZ2lzdGVyX2FnZW50KHN0cmluZyxhZGRyZXNzLHVpbnQ2NCxieXRlW10pYm9vbCIsIG1ldGhvZCAidXBkYXRlX3N0YXR1cyhzdHJpbmcsYm9vbClib29sIiwgbWV0aG9kICJpbmNyZW1lbnRfdGFza3Moc3RyaW5nKWJvb2wiLCBtZXRob2QgInNldF9leHBpcnkoc3RyaW5nLHVpbnQ2NClib29sIiwgbWV0aG9kICJnZXRfYWdlbnQoc3RyaW5nKWJ5dGVbXSIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIHJlZ2lzdGVyX2FnZW50IHVwZGF0ZV9zdGF0dXMgaW5jcmVtZW50X3Rhc2tzIHNldF9leHBpcnkgZ2V0X2FnZW50CiAgICBlcnIKCm1haW5fY3JlYXRlX05vT3BAMTE6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo1CiAgICAvLyBjbGFzcyBEb2pvUmVnaXN0cnkoQVJDNENvbnRyYWN0KToKICAgIHB1c2hieXRlcyAweGNjNjk0ZWFhIC8vIG1ldGhvZCAiY3JlYXRlKGFkZHJlc3Mpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNyZWF0ZQogICAgZXJyCgoKLy8gZG9qb19yZWdpc3RyeS5jb250cmFjdC5Eb2pvUmVnaXN0cnkuY3JlYXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKY3JlYXRlOgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTIKICAgIC8vIEBhYmltZXRob2QoY3JlYXRlPSJyZXF1aXJlIikKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LnN0YXRpY19hcnJheTxhcmM0LnVpbnQ4LCAzMj4KICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjE1CiAgICAvLyBzZWxmLmFkbWluLnZhbHVlID0gYWRtaW4ubmF0aXZlCiAgICBieXRlY18wIC8vICJhZG1pbiIKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weToxNgogICAgLy8gc2VsZi50b3RhbF9hZ2VudHMudmFsdWUgPSBVSW50NjQoMCkKICAgIGJ5dGVjXzIgLy8gInRvdGFsX2FnZW50cyIKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTIKICAgIC8vIEBhYmltZXRob2QoY3JlYXRlPSJyZXF1aXJlIikKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBkb2pvX3JlZ2lzdHJ5LmNvbnRyYWN0LkRvam9SZWdpc3RyeS5yZWdpc3Rlcl9hZ2VudFtyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlZ2lzdGVyX2FnZW50OgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTgKICAgIC8vIEBhYmltZXRob2QKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2IC8vIG9uIGVycm9yOiBpbnZhbGlkIGFycmF5IGxlbmd0aCBoZWFkZXIKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LmR5bmFtaWNfYXJyYXk8YXJjNC51aW50OD4KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LnN0YXRpY19hcnJheTxhcmM0LnVpbnQ4LCAzMj4KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQudWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5keW5hbWljX2FycmF5PGFyYzQudWludDg+CiAgICBleHRyYWN0IDIgMAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MjcKICAgIC8vIGFzc2VydCBUeG4uc2VuZGVyID09IHNlbGYuYWRtaW4udmFsdWUsICJPbmx5IGFkbWluIGNhbiByZWdpc3RlciIKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJhZG1pbiIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5hZG1pbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSBhZG1pbiBjYW4gcmVnaXN0ZXIKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjI5CiAgICAvLyBib3hfa2V5ID0gYWdlbnRfaWQubmF0aXZlLmJ5dGVzCiAgICB1bmNvdmVyIDMKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTozMAogICAgLy8gYXNzZXJ0IG5vdCBvcC5Cb3gubGVuZ3RoKGJveF9rZXkpLCAiQWdlbnQgYWxyZWFkeSByZWdpc3RlcmVkIgogICAgaW50Y18wIC8vIDAKICAgIGFzc2VydCAvLyBBZ2VudCBhbHJlYWR5IHJlZ2lzdGVyZWQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjMyLTMzCiAgICAvLyAjIEJveCBmb3JtYXQ6IHNlbnNlaSgzMikgKyBsYW5lKDgpICsgc3RhdHVzKDEpICsgY29uZmlnX2hhc2goMzIpICsgdGFza3MoOCkgKyBleHBpcnkoOCkKICAgIC8vIHNlbnNlaV9ieXRlcyA9IG9wLmV4dHJhY3Qoc2Vuc2VpLm5hdGl2ZS5ieXRlcywgMCwgMzIpCiAgICB1bmNvdmVyIDMKICAgIGV4dHJhY3QgMCAzMgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MzQKICAgIC8vIGxhbmVfYnl0ZXMgPSBvcC5pdG9iKGxhbmUubmF0aXZlKQogICAgdW5jb3ZlciAzCiAgICBidG9pCiAgICBpdG9iCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTozNQogICAgLy8gcGFydDEgPSBvcC5jb25jYXQoc2Vuc2VpX2J5dGVzLCBsYW5lX2J5dGVzKQogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTozNgogICAgLy8gcGFydDIgPSBvcC5jb25jYXQob3AuYnplcm8oMSksIGNvbmZpZ19oYXNoKQogICAgaW50Y18xIC8vIDEKICAgIGJ6ZXJvCiAgICB1bmNvdmVyIDMKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MzcKICAgIC8vIHBhcnQzID0gb3AuY29uY2F0KHBhcnQxLCBwYXJ0MikKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MzgKICAgIC8vIGJveF9kYXRhID0gb3AuY29uY2F0KHBhcnQzLCBvcC5iemVybygxNikpCiAgICBwdXNoaW50IDE2CiAgICBiemVybwogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTozOQogICAgLy8gb3AuQm94LmNyZWF0ZShib3hfa2V5LCBVSW50NjQoODkpKQogICAgZGlnIDEKICAgIHB1c2hpbnQgODkKICAgIGJveF9jcmVhdGUKICAgIHBvcAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NDAKICAgIC8vIG9wLkJveC5wdXQoYm94X2tleSwgYm94X2RhdGEpCiAgICBib3hfcHV0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo0MgogICAgLy8gc2VsZi50b3RhbF9hZ2VudHMudmFsdWUgKz0gVUludDY0KDEpCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMiAvLyAidG90YWxfYWdlbnRzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLnRvdGFsX2FnZW50cyBleGlzdHMKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBieXRlY18yIC8vICJ0b3RhbF9hZ2VudHMiCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6MTgKICAgIC8vIEBhYmltZXRob2QKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NTgwCiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBkb2pvX3JlZ2lzdHJ5LmNvbnRyYWN0LkRvam9SZWdpc3RyeS51cGRhdGVfc3RhdHVzW3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlX3N0YXR1czoKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjQ1CiAgICAvLyBAYWJpbWV0aG9kCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5keW5hbWljX2FycmF5PGFyYzQudWludDg+CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuYm9vbAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NDgKICAgIC8vIGFzc2VydCBUeG4uc2VuZGVyID09IHNlbGYuYWRtaW4udmFsdWUsICJPbmx5IGFkbWluIgogICAgdHhuIFNlbmRlcgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzAgLy8gImFkbWluIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLmFkbWluIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IGFkbWluCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo1MAogICAgLy8gYm94X2tleSA9IGFnZW50X2lkLm5hdGl2ZS5ieXRlcwogICAgc3dhcAogICAgZXh0cmFjdCAyIDAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjUxCiAgICAvLyBsZW5ndGgsIGV4aXN0cyA9IG9wLkJveC5sZW5ndGgoYm94X2tleSkKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo1MgogICAgLy8gYXNzZXJ0IGV4aXN0cywgIkFnZW50IG5vdCBmb3VuZCIKICAgIGFzc2VydCAvLyBBZ2VudCBub3QgZm91bmQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjU0CiAgICAvLyBkYXRhLCBfZXhpc3RzID0gb3AuQm94LmdldChib3hfa2V5KQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjU1CiAgICAvLyBzdGF0dXNfYnl0ZSA9IEJ5dGVzKGIiXHgwMSIpIGlmIGFjdGl2ZS5uYXRpdmUgZWxzZSBCeXRlcyhiIlx4MDAiKQogICAgdW5jb3ZlciAyCiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBwdXNoYnl0ZXNzIDB4MDAgMHgwMQogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjU2CiAgICAvLyB1cGRhdGVkID0gZGF0YVs6NDFdICsgc3RhdHVzX2J5dGUgKyBkYXRhWzQyOl0KICAgIGRpZyAxCiAgICBsZW4KICAgIHB1c2hpbnQgNDEKICAgIGRpZyAxCiAgICA+PQogICAgcHVzaGludCA0MQogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkaWcgMwogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgdW5jb3ZlciAyCiAgICBjb25jYXQKICAgIHB1c2hpbnQgNDIKICAgIGRpZyAyCiAgICA+PQogICAgcHVzaGludCA0MgogICAgZGlnIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICB1bmNvdmVyIDMKICAgIHN3YXAKICAgIHVuY292ZXIgMwogICAgc3Vic3RyaW5nMwogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo1NwogICAgLy8gb3AuQm94LnB1dChib3hfa2V5LCB1cGRhdGVkKQogICAgYm94X3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NDUKICAgIC8vIEBhYmltZXRob2QKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NTgwCiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBkb2pvX3JlZ2lzdHJ5LmNvbnRyYWN0LkRvam9SZWdpc3RyeS5pbmNyZW1lbnRfdGFza3Nbcm91dGluZ10oKSAtPiB2b2lkOgppbmNyZW1lbnRfdGFza3M6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo2MQogICAgLy8gQGFiaW1ldGhvZAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYgLy8gb24gZXJyb3I6IGludmFsaWQgYXJyYXkgbGVuZ3RoIGhlYWRlcgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ4PgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NjQKICAgIC8vIGFzc2VydCBUeG4uc2VuZGVyID09IHNlbGYuYWRtaW4udmFsdWUsICJPbmx5IGFkbWluIgogICAgdHhuIFNlbmRlcgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzAgLy8gImFkbWluIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLmFkbWluIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IGFkbWluCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo2NgogICAgLy8gYm94X2tleSA9IGFnZW50X2lkLm5hdGl2ZS5ieXRlcwogICAgZXh0cmFjdCAyIDAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjY3CiAgICAvLyBkYXRhLCBfZXhpc3RzID0gb3AuQm94LmdldChib3hfa2V5KQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjY5CiAgICAvLyB0YXNrX2NvdW50ID0gb3AuYnRvaShvcC5leHRyYWN0KGRhdGEsIDc0LCA4KSkKICAgIGR1cAogICAgcHVzaGludCA3NAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjcwCiAgICAvLyBuZXdfY291bnQgPSB0YXNrX2NvdW50ICsgVUludDY0KDEpCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NzEKICAgIC8vIHVwZGF0ZWQgPSBkYXRhWzo3NF0gKyBvcC5pdG9iKG5ld19jb3VudCkgKyBkYXRhWzgyOl0KICAgIGRpZyAxCiAgICBsZW4KICAgIHB1c2hpbnQgNzQKICAgIGRpZyAxCiAgICA+PQogICAgcHVzaGludCA3NAogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkaWcgMwogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgdW5jb3ZlciAyCiAgICBpdG9iCiAgICBjb25jYXQKICAgIGludGNfMyAvLyA4MgogICAgZGlnIDIKICAgID49CiAgICBpbnRjXzMgLy8gODIKICAgIGRpZyAzCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgdW5jb3ZlciAzCiAgICBzd2FwCiAgICB1bmNvdmVyIDMKICAgIHN1YnN0cmluZzMKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NzIKICAgIC8vIG9wLkJveC5wdXQoYm94X2tleSwgdXBkYXRlZCkKICAgIGJveF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5OjYxCiAgICAvLyBAYWJpbWV0aG9kCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzU4MAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gZG9qb19yZWdpc3RyeS5jb250cmFjdC5Eb2pvUmVnaXN0cnkuc2V0X2V4cGlyeVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnNldF9leHBpcnk6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo3NgogICAgLy8gQGFiaW1ldGhvZAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYgLy8gb24gZXJyb3I6IGludmFsaWQgYXJyYXkgbGVuZ3RoIGhlYWRlcgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ4PgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBsZW4KICAgIHB1c2hpbnQgOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC51aW50NjQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5Ojc5CiAgICAvLyBib3hfa2V5ID0gYWdlbnRfaWQubmF0aXZlLmJ5dGVzCiAgICBleHRyYWN0IDIgMAogICAgZHVwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo4MAogICAgLy8gZGF0YSwgX2V4aXN0cyA9IG9wLkJveC5nZXQoYm94X2tleSkKICAgIGJveF9nZXQKICAgIHBvcAogICAgZHVwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo4Mi04MwogICAgLy8gIyBHZXQgc2Vuc2VpIGZyb20gYm94CiAgICAvLyBzZW5zZWkgPSBBY2NvdW50KG9wLmV4dHJhY3QoZGF0YSwgMCwgMzIpKQogICAgZXh0cmFjdCAwIDMyCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo4NAogICAgLy8gYXNzZXJ0IFR4bi5zZW5kZXIgPT0gc2Vuc2VpIG9yIFR4bi5zZW5kZXIgPT0gc2VsZi5hZG1pbi52YWx1ZSwgIk9ubHkgc2Vuc2VpIG9yIGFkbWluIgogICAgdHhuIFNlbmRlcgogICAgPT0KICAgIGJueiBzZXRfZXhwaXJ5X2Jvb2xfdHJ1ZUAzCiAgICB0eG4gU2VuZGVyCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAiYWRtaW4iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYuYWRtaW4gZXhpc3RzCiAgICA9PQogICAgYnogc2V0X2V4cGlyeV9ib29sX2ZhbHNlQDQKCnNldF9leHBpcnlfYm9vbF90cnVlQDM6CiAgICBpbnRjXzEgLy8gMQoKc2V0X2V4cGlyeV9ib29sX21lcmdlQDU6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo4NAogICAgLy8gYXNzZXJ0IFR4bi5zZW5kZXIgPT0gc2Vuc2VpIG9yIFR4bi5zZW5kZXIgPT0gc2VsZi5hZG1pbi52YWx1ZSwgIk9ubHkgc2Vuc2VpIG9yIGFkbWluIgogICAgYXNzZXJ0IC8vIE9ubHkgc2Vuc2VpIG9yIGFkbWluCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo4NgogICAgLy8gdXBkYXRlZCA9IG9wLmNvbmNhdChkYXRhWzo4Ml0sIG9wLml0b2IoZXhwaXJ5X3RpbWVzdGFtcC5uYXRpdmUpKQogICAgZHVwbiAyCiAgICBsZW4KICAgIGludGNfMyAvLyA4MgogICAgZGlnIDEKICAgID49CiAgICBpbnRjXzMgLy8gODIKICAgIGNvdmVyIDIKICAgIHNlbGVjdAogICAgaW50Y18wIC8vIDAKICAgIHN3YXAKICAgIHN1YnN0cmluZzMKICAgIGRpZyAzCiAgICBidG9pCiAgICBpdG9iCiAgICBjb25jYXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9kb2pvX3JlZ2lzdHJ5L2NvbnRyYWN0LnB5Ojg3CiAgICAvLyBvcC5Cb3gucHV0KGJveF9rZXksIHVwZGF0ZWQpCiAgICBkaWcgMgogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6NzYKICAgIC8vIEBhYmltZXRob2QKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NTgwCiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCnNldF9leHBpcnlfYm9vbF9mYWxzZUA0OgogICAgaW50Y18wIC8vIDAKICAgIGIgc2V0X2V4cGlyeV9ib29sX21lcmdlQDUKCgovLyBkb2pvX3JlZ2lzdHJ5LmNvbnRyYWN0LkRvam9SZWdpc3RyeS5nZXRfYWdlbnRbcm91dGluZ10oKSAtPiB2b2lkOgpnZXRfYWdlbnQ6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo5MQogICAgLy8gQGFiaW1ldGhvZChyZWFkb25seT1UcnVlKQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYgLy8gb24gZXJyb3I6IGludmFsaWQgYXJyYXkgbGVuZ3RoIGhlYWRlcgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ4PgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6OTQKICAgIC8vIGJveF9rZXkgPSBhZ2VudF9pZC5uYXRpdmUuYnl0ZXMKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZG9qb19yZWdpc3RyeS9jb250cmFjdC5weTo5NQogICAgLy8gZGF0YSwgX2V4aXN0cyA9IG9wLkJveC5nZXQoYm94X2tleSkKICAgIGJveF9nZXQKICAgIHBvcAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2Rvam9fcmVnaXN0cnkvY29udHJhY3QucHk6OTEKICAgIC8vIEBhYmltZXRob2QocmVhZG9ubHk9VHJ1ZSkKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBwdXNoYnl0ZXMgMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4K", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuY2xlYXJfc3RhdGVfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIHB1c2hpbnQgMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAECUiYDBWFkbWluBRUffHWADHRvdGFsX2FnZW50czEZFEQxGEEAK4IFBJOfxqQEoBzlbgS1tq+OBHdRzbIERCIfWTYaAI4FACAAhgDsATwBjwCABMxpTqo2GgCOAQABADYaAUkVgSASRChMZyoiZyNDNhoBSSJZJAhLARUSRDYaAkkVgSASRDYaA0kVgQgSRDYaBEkiWSQISwEVEkRXAgAxACIoZUQSRE8DVwIAIkRPA1cAIE8DFxZQI69PA1BQgRCvUEsBgVm5SL8iKmVEIwgqTGcpsCNDNhoBSSJZJAhLARUSRDYaAkkVIxJEMQAiKGVEEkRMVwIASb1FAURJvkhPAiJTggIBAAEBTwJNSwEVgSlLAQ+BKUsCTwJNSwMiTwJSTwJQgSpLAg+BKksDTwJNTwNMTwNSUL8psCNDNhoBSSJZJAhLARUSRDEAIihlRBJEVwIASb5ISYFKWyMISwEVgUpLAQ+BSksCTwJNSwMiTwJSTwIWUCVLAg8lSwNPAk1PA0xPA1JQvymwI0M2GgFJIlkkCEsBFRJENhoCSU4CFYEIEkRXAgBJvkhJVwAgMQASQAAKMQAiKGVEEkEAHSNERwIVJUsBDyVOAk0iTFJLAxcWUEsCTL8psCNDIkL/4DYaAUkiWSQISwEVEkRXAgC+SEkVFlcGAkxQgAQVH3x1TFCwI0M=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
     * Constructs a no op call for the update_status(string,bool)bool ABI method
     *
     * Update agent operational status.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static updateStatus(params) {
        return {
            ...params,
            method: 'update_status(string,bool)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.agentId, params.args.active],
        };
    }
    /**
     * Constructs a no op call for the increment_tasks(string)bool ABI method
     *
     * Increment cumulative task count.
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
     * Constructs a no op call for the set_expiry(string,uint64)bool ABI method
     *
     * Set listing expiry timestamp.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static setExpiry(params) {
        return {
            ...params,
            method: 'set_expiry(string,uint64)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.agentId, params.args.expiryTimestamp],
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
         * Makes a call to the DojoRegistry smart contract using the `update_status(string,bool)bool` ABI method.
         *
         * Update agent operational status.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        updateStatus: (params) => {
            return this.appClient.params.call(DojoRegistryParamsFactory.updateStatus(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks(string)bool` ABI method.
         *
         * Increment cumulative task count.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        incrementTasks: (params) => {
            return this.appClient.params.call(DojoRegistryParamsFactory.incrementTasks(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `set_expiry(string,uint64)bool` ABI method.
         *
         * Set listing expiry timestamp.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        setExpiry: (params) => {
            return this.appClient.params.call(DojoRegistryParamsFactory.setExpiry(params));
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
         * Makes a call to the DojoRegistry smart contract using the `update_status(string,bool)bool` ABI method.
         *
         * Update agent operational status.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        updateStatus: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.updateStatus(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks(string)bool` ABI method.
         *
         * Increment cumulative task count.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        incrementTasks: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.incrementTasks(params));
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `set_expiry(string,uint64)bool` ABI method.
         *
         * Set listing expiry timestamp.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        setExpiry: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.setExpiry(params));
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
         * Makes a call to the DojoRegistry smart contract using the `update_status(string,bool)bool` ABI method.
         *
         * Update agent operational status.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        updateStatus: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.updateStatus(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks(string)bool` ABI method.
         *
         * Increment cumulative task count.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        incrementTasks: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.incrementTasks(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the DojoRegistry smart contract using the `set_expiry(string,uint64)bool` ABI method.
         *
         * Set listing expiry timestamp.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        setExpiry: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.setExpiry(params));
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
             * Add a update_status(string,bool)bool method call against the DojoRegistry contract
             */
            updateStatus(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateStatus(params)));
                resultMappers.push((v) => client.decodeReturnValue('update_status(string,bool)bool', v));
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
             * Add a set_expiry(string,uint64)bool method call against the DojoRegistry contract
             */
            setExpiry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.setExpiry(params)));
                resultMappers.push((v) => client.decodeReturnValue('set_expiry(string,uint64)bool', v));
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
