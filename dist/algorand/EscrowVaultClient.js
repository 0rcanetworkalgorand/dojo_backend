"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowVaultClient = exports.EscrowVaultFactory = exports.EscrowVaultParamsFactory = exports.APP_SPEC = void 0;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "EscrowVault", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "address", "name": "admin" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "desc": "Initialize vault with admin.", "events": [], "recommendations": {} }, { "name": "lock_bounty", "args": [{ "type": "string", "name": "task_id", "desc": "Unique task identifier" }, { "type": "address", "name": "client", "desc": "The user who is paying for the task" }, { "type": "address", "name": "worker", "desc": "The agent address assigned to the task" }, { "type": "address", "name": "sensei", "desc": "The developer who deployed the agent (receives 98% on success)" }, { "type": "uint64", "name": "bounty_amount", "desc": "Amount of ALGO bounty in microAlgos" }, { "type": "pay", "name": "bounty_txn", "desc": "The payment transaction sending ALGO to this contract" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Client locks ALGO bounty for a task.", "events": [], "recommendations": {} }, { "name": "submit_task", "args": [{ "type": "string", "name": "task_id" }, { "type": "byte[]", "name": "kite_hash" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Worker submits the task result with Kite AI provenance hash.", "events": [], "recommendations": {} }, { "name": "release_payment", "args": [{ "type": "string", "name": "task_id" }, { "type": "address", "name": "treasury" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Admin releases bounty on validated completion.\nDistribution: 2% platform fee to treasury, 98% to sensei (developer) directly.", "events": [], "recommendations": {} }, { "name": "slash_bounty", "args": [{ "type": "string", "name": "task_id" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Admin slashes on task failure - returns 100% bounty to client (user).\nNo platform fee on the bounty side. The 1% developer slash is handled separately by the CommitmentLock contract.", "events": [], "recommendations": {} }, { "name": "get_task", "args": [{ "type": "string", "name": "task_id" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Retrieve task escrow data.", "events": [], "recommendations": {} }], "arcs": [22, 28], "desc": "Per-task escrow managing ALGO bounty with Box Storage keyed by task_id.\n    \n    On success: 2% platform fee to treasury, 98% to sensei (developer).\n    On failure: 100% bounty refunded to client (user).\n    ", "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "admin": { "keyType": "AVMString", "valueType": "address", "key": "YWRtaW4=" }, "total_tasks": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dG90YWxfdGFza3M=" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [517], "errorMessage": "Already settled" }, { "pc": [388], "errorMessage": "Already settled or slashed" }, { "pc": [197], "errorMessage": "Amount mismatch" }, { "pc": [181], "errorMessage": "Client must send bounty" }, { "pc": [365, 495], "errorMessage": "Only admin" }, { "pc": [305], "errorMessage": "Only assigned worker can submit" }, { "pc": [188], "errorMessage": "Send to contract" }, { "pc": [208], "errorMessage": "Task already exists" }, { "pc": [310], "errorMessage": "Task not in lock state" }, { "pc": [363, 493], "errorMessage": "check self.admin exists" }, { "pc": [252], "errorMessage": "check self.total_tasks exists" }, { "pc": [121, 267, 280, 341, 480, 581], "errorMessage": "invalid array length header" }, { "pc": [128, 274, 287, 348, 487, 588], "errorMessage": "invalid number of bytes for arc4.dynamic_array<arc4.uint8>" }, { "pc": [107, 137, 146, 155, 357], "errorMessage": "invalid number of bytes for arc4.static_array<arc4.uint8, 32>" }, { "pc": [164], "errorMessage": "invalid number of bytes for arc4.uint64" }, { "pc": [174], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuYXBwcm92YWxfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIGludGNibG9jayAwIDEgMTA0IDIKICAgIGJ5dGVjYmxvY2sgMHgxNTFmN2M3NTgwICJhZG1pbiIgInRvdGFsX3Rhc2tzIgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo1CiAgICAvLyBjbGFzcyBFc2Nyb3dWYXVsdChBUkM0Q29udHJhY3QpOgogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0CiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEAxMQogICAgcHVzaGJ5dGVzcyAweDY1NWNjODYyIDB4ZWEzZTAyMzcgMHgzNGZjMTc2ZiAweDdkNWNjMTdiIDB4NDcyNTFhZjEgLy8gbWV0aG9kICJsb2NrX2JvdW50eShzdHJpbmcsYWRkcmVzcyxhZGRyZXNzLGFkZHJlc3MsdWludDY0LHBheSlib29sIiwgbWV0aG9kICJzdWJtaXRfdGFzayhzdHJpbmcsYnl0ZVtdKWJvb2wiLCBtZXRob2QgInJlbGVhc2VfcGF5bWVudChzdHJpbmcsYWRkcmVzcylib29sIiwgbWV0aG9kICJzbGFzaF9ib3VudHkoc3RyaW5nKWJvb2wiLCBtZXRob2QgImdldF90YXNrKHN0cmluZylieXRlW10iCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBsb2NrX2JvdW50eSBzdWJtaXRfdGFzayByZWxlYXNlX3BheW1lbnQgc2xhc2hfYm91bnR5IGdldF90YXNrCiAgICBlcnIKCm1haW5fY3JlYXRlX05vT3BAMTE6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjUKICAgIC8vIGNsYXNzIEVzY3Jvd1ZhdWx0KEFSQzRDb250cmFjdCk6CiAgICBwdXNoYnl0ZXMgMHhjYzY5NGVhYSAvLyBtZXRob2QgImNyZWF0ZShhZGRyZXNzKXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKCi8vIGVzY3Jvd192YXVsdC5jb250cmFjdC5Fc2Nyb3dWYXVsdC5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjE2CiAgICAvLyBAYWJpbWV0aG9kKGNyZWF0ZT0icmVxdWlyZSIpCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5zdGF0aWNfYXJyYXk8YXJjNC51aW50OCwgMzI+CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjE5CiAgICAvLyBzZWxmLmFkbWluLnZhbHVlID0gYWRtaW4ubmF0aXZlCiAgICBieXRlY18xIC8vICJhZG1pbiIKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjIwCiAgICAvLyBzZWxmLnRvdGFsX3Rhc2tzLnZhbHVlID0gVUludDY0KDApCiAgICBieXRlY18yIC8vICJ0b3RhbF90YXNrcyIKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxNgogICAgLy8gQGFiaW1ldGhvZChjcmVhdGU9InJlcXVpcmUiKQogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIGVzY3Jvd192YXVsdC5jb250cmFjdC5Fc2Nyb3dWYXVsdC5sb2NrX2JvdW50eVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmxvY2tfYm91bnR5OgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToyMgogICAgLy8gQGFiaW1ldGhvZAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYgLy8gb24gZXJyb3I6IGludmFsaWQgYXJyYXkgbGVuZ3RoIGhlYWRlcgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ4PgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuc3RhdGljX2FycmF5PGFyYzQudWludDgsIDMyPgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuc3RhdGljX2FycmF5PGFyYzQudWludDgsIDMyPgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuc3RhdGljX2FycmF5PGFyYzQudWludDgsIDMyPgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC51aW50NjQKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18xIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo0MgogICAgLy8gYXNzZXJ0IGJvdW50eV90eG4uc2VuZGVyID09IGNsaWVudC5uYXRpdmUsICJDbGllbnQgbXVzdCBzZW5kIGJvdW50eSIKICAgIGR1cAogICAgZ3R4bnMgU2VuZGVyCiAgICBkaWcgNQogICAgPT0KICAgIGFzc2VydCAvLyBDbGllbnQgbXVzdCBzZW5kIGJvdW50eQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo0MwogICAgLy8gYXNzZXJ0IGJvdW50eV90eG4ucmVjZWl2ZXIgPT0gR2xvYmFsLmN1cnJlbnRfYXBwbGljYXRpb25fYWRkcmVzcywgIlNlbmQgdG8gY29udHJhY3QiCiAgICBkdXAKICAgIGd0eG5zIFJlY2VpdmVyCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgPT0KICAgIGFzc2VydCAvLyBTZW5kIHRvIGNvbnRyYWN0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjQ0CiAgICAvLyBhc3NlcnQgYm91bnR5X3R4bi5hbW91bnQgPT0gYm91bnR5X2Ftb3VudC5uYXRpdmUsICJBbW91bnQgbWlzbWF0Y2giCiAgICBndHhucyBBbW91bnQKICAgIHN3YXAKICAgIGJ0b2kKICAgIHN3YXAKICAgIGRpZyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIEFtb3VudCBtaXNtYXRjaAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo0NgogICAgLy8gYm94X2tleSA9IHRhc2tfaWQubmF0aXZlLmJ5dGVzCiAgICB1bmNvdmVyIDQKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjQ3CiAgICAvLyBhc3NlcnQgbm90IG9wLkJveC5sZW5ndGgoYm94X2tleSlbMV0sICJUYXNrIGFscmVhZHkgZXhpc3RzIgogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgICEKICAgIGFzc2VydCAvLyBUYXNrIGFscmVhZHkgZXhpc3RzCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjQ5LTUxCiAgICAvLyAjIEJveCBmb3JtYXQ6IGNsaWVudCgzMikgKyB3b3JrZXIoMzIpICsgc2Vuc2VpKDMyKSArIGJvdW50eSg4KSArIHN0YXR1cygxKSArIGtpdGVfaGFzaCgzMikgPSAxMzcgYnl0ZXMKICAgIC8vICMgc3RhdHVzOiAwPWxvY2tlZCwgMT1zdWJtaXR0ZWQsIDI9Y29tcGxldGVkLCAzPXNsYXNoZWQKICAgIC8vIGNsaWVudF9ieXRlcyA9IG9wLmV4dHJhY3QoY2xpZW50Lm5hdGl2ZS5ieXRlcywgMCwgMzIpCiAgICB1bmNvdmVyIDQKICAgIGV4dHJhY3QgMCAzMgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo1MgogICAgLy8gd29ya2VyX2J5dGVzID0gb3AuZXh0cmFjdCh3b3JrZXIubmF0aXZlLmJ5dGVzLCAwLCAzMikKICAgIHVuY292ZXIgNAogICAgZXh0cmFjdCAwIDMyCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjUzCiAgICAvLyBzZW5zZWlfYnl0ZXMgPSBvcC5leHRyYWN0KHNlbnNlaS5uYXRpdmUuYnl0ZXMsIDAsIDMyKQogICAgdW5jb3ZlciA0CiAgICBleHRyYWN0IDAgMzIKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NTQKICAgIC8vIGJvdW50eV9ieXRlcyA9IG9wLml0b2IoYm91bnR5X2Ftb3VudC5uYXRpdmUpCiAgICB1bmNvdmVyIDQKICAgIGl0b2IKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NTUKICAgIC8vIHBhcnQxID0gb3AuY29uY2F0KGNsaWVudF9ieXRlcywgd29ya2VyX2J5dGVzKQogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDMKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo1NgogICAgLy8gcGFydDIgPSBvcC5jb25jYXQocGFydDEsIHNlbnNlaV9ieXRlcykKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjU3CiAgICAvLyBwYXJ0MyA9IG9wLmNvbmNhdChwYXJ0MiwgYm91bnR5X2J5dGVzKQogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjU4LTU5CiAgICAvLyAjIEFkZCBzdGF0dXMgKDApIGFuZCBwbGFjZWhvbGRlciBmb3IgaGFzaAogICAgLy8gYm94X2RhdGEgPSBvcC5jb25jYXQocGFydDMsIG9wLmJ6ZXJvKDMzKSkKICAgIHB1c2hpbnQgMzMKICAgIGJ6ZXJvCiAgICBjb25jYXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NjAKICAgIC8vIG9wLkJveC5jcmVhdGUoYm94X2tleSwgVUludDY0KDEzNykpCiAgICBkaWcgMQogICAgcHVzaGludCAxMzcKICAgIGJveF9jcmVhdGUKICAgIHBvcAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo2MQogICAgLy8gb3AuQm94LnB1dChib3hfa2V5LCBib3hfZGF0YSkKICAgIGJveF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NjMKICAgIC8vIHNlbGYudG90YWxfdGFza3MudmFsdWUgKz0gVUludDY0KDEpCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMiAvLyAidG90YWxfdGFza3MiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYudG90YWxfdGFza3MgZXhpc3RzCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnl0ZWNfMiAvLyAidG90YWxfdGFza3MiCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToyMgogICAgLy8gQGFiaW1ldGhvZAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1ODAKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIGVzY3Jvd192YXVsdC5jb250cmFjdC5Fc2Nyb3dWYXVsdC5zdWJtaXRfdGFza1tyb3V0aW5nXSgpIC0+IHZvaWQ6CnN1Ym1pdF90YXNrOgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo2NgogICAgLy8gQGFiaW1ldGhvZAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYgLy8gb24gZXJyb3I6IGludmFsaWQgYXJyYXkgbGVuZ3RoIGhlYWRlcgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ4PgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYgLy8gb24gZXJyb3I6IGludmFsaWQgYXJyYXkgbGVuZ3RoIGhlYWRlcgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ4PgogICAgZXh0cmFjdCAyIDAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NjkKICAgIC8vIGJveF9rZXkgPSB0YXNrX2lkLm5hdGl2ZS5ieXRlcwogICAgc3dhcAogICAgZXh0cmFjdCAyIDAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NzAKICAgIC8vIGRhdGEsIF9leGlzdHMgPSBvcC5Cb3guZ2V0KGJveF9rZXkpCiAgICBkdXAKICAgIGJveF9nZXQKICAgIHBvcAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo3MgogICAgLy8gd29ya2VyID0gQWNjb3VudChvcC5leHRyYWN0KGRhdGEsIDMyLCAzMikpCiAgICBkdXAKICAgIGV4dHJhY3QgMzIgMzIKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NzUKICAgIC8vIGFzc2VydCBUeG4uc2VuZGVyID09IHdvcmtlciwgIk9ubHkgYXNzaWduZWQgd29ya2VyIGNhbiBzdWJtaXQiCiAgICB0eG4gU2VuZGVyCiAgICA9PQogICAgYXNzZXJ0IC8vIE9ubHkgYXNzaWduZWQgd29ya2VyIGNhbiBzdWJtaXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NzYKICAgIC8vIGFzc2VydCBvcC5idG9pKHN0YXR1cykgPT0gVUludDY0KDApLCAiVGFzayBub3QgaW4gbG9jayBzdGF0ZSIKICAgIGR1cAogICAgaW50Y18yIC8vIDEwNAogICAgZ2V0Ynl0ZQogICAgIQogICAgYXNzZXJ0IC8vIFRhc2sgbm90IGluIGxvY2sgc3RhdGUKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NzgtNzkKICAgIC8vICMgVXBkYXRlIHN0YXR1cyB0byAxIChTVUJNSVRURUQpIGFuZCBzdG9yZSBoYXNoCiAgICAvLyB1cGRhdGVkID0gZGF0YVs6MTA0XSArIEJ5dGVzKGIiXHgwMSIpICsga2l0ZV9oYXNoCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDEwNAogICAgZGlnIDEKICAgID49CiAgICBpbnRjXzIgLy8gMTA0CiAgICBjb3ZlciAyCiAgICBzZWxlY3QKICAgIGludGNfMCAvLyAwCiAgICBzd2FwCiAgICBzdWJzdHJpbmczCiAgICBwdXNoYnl0ZXMgMHgwMQogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo4MAogICAgLy8gb3AuQm94LnB1dChib3hfa2V5LCB1cGRhdGVkKQogICAgYm94X3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo2NgogICAgLy8gQGFiaW1ldGhvZAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1ODAKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIGVzY3Jvd192YXVsdC5jb250cmFjdC5Fc2Nyb3dWYXVsdC5yZWxlYXNlX3BheW1lbnRbcm91dGluZ10oKSAtPiB2b2lkOgpyZWxlYXNlX3BheW1lbnQ6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjgzCiAgICAvLyBAYWJpbWV0aG9kCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5keW5hbWljX2FycmF5PGFyYzQudWludDg+CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5zdGF0aWNfYXJyYXk8YXJjNC51aW50OCwgMzI+CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5Ojg5CiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBzZWxmLmFkbWluLnZhbHVlLCAiT25seSBhZG1pbiIKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18xIC8vICJhZG1pbiIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5hZG1pbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSBhZG1pbgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo5MQogICAgLy8gYm94X2tleSA9IHRhc2tfaWQubmF0aXZlLmJ5dGVzCiAgICBzd2FwCiAgICBleHRyYWN0IDIgMAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo5MgogICAgLy8gZGF0YSwgX2V4aXN0cyA9IG9wLkJveC5nZXQoYm94X2tleSkKICAgIGR1cAogICAgYm94X2dldAogICAgcG9wCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5Ojk0CiAgICAvLyBzZW5zZWkgPSBBY2NvdW50KG9wLmV4dHJhY3QoZGF0YSwgNjQsIDMyKSkKICAgIGR1cAogICAgZXh0cmFjdCA2NCAzMgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo5NQogICAgLy8gYm91bnR5ID0gb3AuYnRvaShvcC5leHRyYWN0KGRhdGEsIDk2LCA4KSkKICAgIGRpZyAxCiAgICBwdXNoaW50IDk2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo5OC05OQogICAgLy8gIyBDYW4gYmUgc2V0dGxlZCBmcm9tIGxvY2tlZCAoMCkgb3Igc3VibWl0dGVkICgxKQogICAgLy8gYXNzZXJ0IG9wLmJ0b2koc3RhdHVzKSA8PSBVSW50NjQoMSksICJBbHJlYWR5IHNldHRsZWQgb3Igc2xhc2hlZCIKICAgIGRpZyAyCiAgICBpbnRjXzIgLy8gMTA0CiAgICBnZXRieXRlCiAgICBpbnRjXzEgLy8gMQogICAgPD0KICAgIGFzc2VydCAvLyBBbHJlYWR5IHNldHRsZWQgb3Igc2xhc2hlZAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMDEtMTAyCiAgICAvLyAjIENhbGN1bGF0ZSAyJSBwbGF0Zm9ybSBmZWUKICAgIC8vIGZlZSA9IChib3VudHkgKiBVSW50NjQoMjAwKSkgLy8gVUludDY0KDEwMDAwKQogICAgZHVwCiAgICBwdXNoaW50IDIwMAogICAgKgogICAgcHVzaGludCAxMDAwMAogICAgLwogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMDMKICAgIC8vIHNlbnNlaV9wYXltZW50ID0gYm91bnR5IC0gZmVlCiAgICBzd2FwCiAgICBkaWcgMQogICAgLQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMDUtMTA5CiAgICAvLyAjIDEuIFJlbGVhc2UgMiUgZmVlIHRvIHRyZWFzdXJ5CiAgICAvLyBpdHhuLlBheW1lbnQoCiAgICAvLyAgICAgcmVjZWl2ZXI9dHJlYXN1cnkubmF0aXZlLAogICAgLy8gICAgIGFtb3VudD1mZWUsCiAgICAvLyApLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgdW5jb3ZlciA0CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjEwNS0xMDYKICAgIC8vICMgMS4gUmVsZWFzZSAyJSBmZWUgdG8gdHJlYXN1cnkKICAgIC8vIGl0eG4uUGF5bWVudCgKICAgIGludGNfMSAvLyBwYXkKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMDUtMTA5CiAgICAvLyAjIDEuIFJlbGVhc2UgMiUgZmVlIHRvIHRyZWFzdXJ5CiAgICAvLyBpdHhuLlBheW1lbnQoCiAgICAvLyAgICAgcmVjZWl2ZXI9dHJlYXN1cnkubmF0aXZlLAogICAgLy8gICAgIGFtb3VudD1mZWUsCiAgICAvLyApLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMTEtMTE1CiAgICAvLyAjIDIuIFJlbGVhc2UgOTglIHRvIHNlbnNlaSAoZGV2ZWxvcGVyKSBkaXJlY3RseQogICAgLy8gaXR4bi5QYXltZW50KAogICAgLy8gICAgIHJlY2VpdmVyPXNlbnNlaSwKICAgIC8vICAgICBhbW91bnQ9c2Vuc2VpX3BheW1lbnQsCiAgICAvLyApLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMTEtMTEyCiAgICAvLyAjIDIuIFJlbGVhc2UgOTglIHRvIHNlbnNlaSAoZGV2ZWxvcGVyKSBkaXJlY3RseQogICAgLy8gaXR4bi5QYXltZW50KAogICAgaW50Y18xIC8vIHBheQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjExMS0xMTUKICAgIC8vICMgMi4gUmVsZWFzZSA5OCUgdG8gc2Vuc2VpIChkZXZlbG9wZXIpIGRpcmVjdGx5CiAgICAvLyBpdHhuLlBheW1lbnQoCiAgICAvLyAgICAgcmVjZWl2ZXI9c2Vuc2VpLAogICAgLy8gICAgIGFtb3VudD1zZW5zZWlfcGF5bWVudCwKICAgIC8vICkuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjExNy0xMTgKICAgIC8vICMgVXBkYXRlIHN0YXR1cyB0byAyIChDT01QTEVURUQpCiAgICAvLyB1cGRhdGVkID0gZGF0YVs6MTA0XSArIEJ5dGVzKGIiXHgwMiIpICsgZGF0YVsxMDU6XQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyAxMDQKICAgIGRpZyAxCiAgICA+PQogICAgaW50Y18yIC8vIDEwNAogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkaWcgMgogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgcHVzaGJ5dGVzIDB4MDIKICAgIGNvbmNhdAogICAgcHVzaGludCAxMDUKICAgIGRpZyAyCiAgICA+PQogICAgcHVzaGludCAxMDUKICAgIGRpZyAzCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgdW5jb3ZlciAzCiAgICBzd2FwCiAgICB1bmNvdmVyIDMKICAgIHN1YnN0cmluZzMKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMTkKICAgIC8vIG9wLkJveC5wdXQoYm94X2tleSwgdXBkYXRlZCkKICAgIGJveF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6ODMKICAgIC8vIEBhYmltZXRob2QKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NTgwCiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBlc2Nyb3dfdmF1bHQuY29udHJhY3QuRXNjcm93VmF1bHQuc2xhc2hfYm91bnR5W3JvdXRpbmddKCkgLT4gdm9pZDoKc2xhc2hfYm91bnR5OgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMjMKICAgIC8vIEBhYmltZXRob2QKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2IC8vIG9uIGVycm9yOiBpbnZhbGlkIGFycmF5IGxlbmd0aCBoZWFkZXIKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LmR5bmFtaWNfYXJyYXk8YXJjNC51aW50OD4KICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTMwCiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBzZWxmLmFkbWluLnZhbHVlLCAiT25seSBhZG1pbiIKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18xIC8vICJhZG1pbiIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5hZG1pbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSBhZG1pbgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMzIKICAgIC8vIGJveF9rZXkgPSB0YXNrX2lkLm5hdGl2ZS5ieXRlcwogICAgZXh0cmFjdCAyIDAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTMzCiAgICAvLyBkYXRhLCBfZXhpc3RzID0gb3AuQm94LmdldChib3hfa2V5KQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTM1CiAgICAvLyBjbGllbnQgPSBBY2NvdW50KG9wLmV4dHJhY3QoZGF0YSwgMCwgMzIpKQogICAgZHVwCiAgICBleHRyYWN0IDAgMzIKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTM2CiAgICAvLyBib3VudHkgPSBvcC5idG9pKG9wLmV4dHJhY3QoZGF0YSwgOTYsIDgpKQogICAgZGlnIDEKICAgIHB1c2hpbnQgOTYKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjEzOQogICAgLy8gYXNzZXJ0IG9wLmJ0b2koc3RhdHVzKSA8PSBVSW50NjQoMSksICJBbHJlYWR5IHNldHRsZWQiCiAgICBkaWcgMgogICAgaW50Y18yIC8vIDEwNAogICAgZ2V0Ynl0ZQogICAgaW50Y18xIC8vIDEKICAgIDw9CiAgICBhc3NlcnQgLy8gQWxyZWFkeSBzZXR0bGVkCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjE0MS0xNDUKICAgIC8vICMgUmV0dXJuIDEwMCUgYm91bnR5IHRvIGNsaWVudCAodXNlcikgLSBubyBkZWR1Y3Rpb25zCiAgICAvLyBpdHhuLlBheW1lbnQoCiAgICAvLyAgICAgcmVjZWl2ZXI9Y2xpZW50LAogICAgLy8gICAgIGFtb3VudD1ib3VudHksCiAgICAvLyApLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxNDEtMTQyCiAgICAvLyAjIFJldHVybiAxMDAlIGJvdW50eSB0byBjbGllbnQgKHVzZXIpIC0gbm8gZGVkdWN0aW9ucwogICAgLy8gaXR4bi5QYXltZW50KAogICAgaW50Y18xIC8vIHBheQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjE0MS0xNDUKICAgIC8vICMgUmV0dXJuIDEwMCUgYm91bnR5IHRvIGNsaWVudCAodXNlcikgLSBubyBkZWR1Y3Rpb25zCiAgICAvLyBpdHhuLlBheW1lbnQoCiAgICAvLyAgICAgcmVjZWl2ZXI9Y2xpZW50LAogICAgLy8gICAgIGFtb3VudD1ib3VudHksCiAgICAvLyApLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxNDctMTQ4CiAgICAvLyAjIFVwZGF0ZSBzdGF0dXMgdG8gMyAoU0xBU0hFRCkKICAgIC8vIHVwZGF0ZWQgPSBkYXRhWzoxMDRdICsgQnl0ZXMoYiJceDAzIikgKyBkYXRhWzEwNTpdCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDEwNAogICAgZGlnIDEKICAgID49CiAgICBpbnRjXzIgLy8gMTA0CiAgICBkaWcgMgogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIGRpZyAyCiAgICBpbnRjXzAgLy8gMAogICAgdW5jb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICBwdXNoYnl0ZXMgMHgwMwogICAgY29uY2F0CiAgICBwdXNoaW50IDEwNQogICAgZGlnIDIKICAgID49CiAgICBwdXNoaW50IDEwNQogICAgZGlnIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICB1bmNvdmVyIDMKICAgIHN3YXAKICAgIHVuY292ZXIgMwogICAgc3Vic3RyaW5nMwogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjE0OQogICAgLy8gb3AuQm94LnB1dChib3hfa2V5LCB1cGRhdGVkKQogICAgYm94X3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMjMKICAgIC8vIEBhYmltZXRob2QKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NTgwCiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBlc2Nyb3dfdmF1bHQuY29udHJhY3QuRXNjcm93VmF1bHQuZ2V0X3Rhc2tbcm91dGluZ10oKSAtPiB2b2lkOgpnZXRfdGFzazoKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTUzCiAgICAvLyBAYWJpbWV0aG9kKHJlYWRvbmx5PVRydWUpCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5keW5hbWljX2FycmF5PGFyYzQudWludDg+CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjE1NgogICAgLy8gYm94X2tleSA9IHRhc2tfaWQubmF0aXZlLmJ5dGVzCiAgICBleHRyYWN0IDIgMAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxNTcKICAgIC8vIGRhdGEsIF9leGlzdHMgPSBvcC5Cb3guZ2V0KGJveF9rZXkpCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTUzCiAgICAvLyBAYWJpbWV0aG9kKHJlYWRvbmx5PVRydWUpCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgcHVzaGJ5dGVzIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuY2xlYXJfc3RhdGVfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIHB1c2hpbnQgMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAFoAiYDBRUffHWABWFkbWluC3RvdGFsX3Rhc2tzMRkURDEYQQArggUEZVzIYgTqPgI3BDT8F28EfVzBewRHJRrxNhoAjgUAIACyAPwBhwHsAIAEzGlOqjYaAI4BAAEANhoBSRWBIBJEKUxnKiJnI0M2GgFJIlklCEsBFRJENhoCSRWBIBJENhoDSRWBIBJENhoESRWBIBJENhoFSRWBCBJEMRYjCUk4ECMSREk4AEsFEkRJOAcyChJEOAhMF0xLARJETwRXAgBJvUUBFERPBFcAIE8EVwAgTwRXACBPBBZPA08DUE8CUExQgSGvUEsBgYkBuUi/IiplRCMIKkxnKLAjQzYaAUkiWSUISwEVEkQ2GgJJIlklCEsBFRJEVwIATFcCAEm+SElXICAxABJESSRVFERJFSRLAQ8kTgJNIkxSgAEBUE8CUL8osCNDNhoBSSJZJQhLARUSRDYaAkkVgSASRDEAIillRBJETFcCAEm+SElXQCBLAYFgW0sCJFUjDkRJgcgBC4GQTgpMSwEJsUyyCE8EsgcjshAisgGzsbIIsgcjshAisgGzSRUkSwEPJEsCTwJNSwIiTwJSgAECUIFpSwIPgWlLA08CTU8DTE8DUlC/KLAjQzYaAUkiWSUISwEVEkQxACIpZUQSRFcCAEm+SElXACBLAYFgW0sCJFUjDkSxsgiyByOyECKyAbNJFSRLAQ8kSwJPAk1LAiJPAlKAAQNQgWlLAg+BaUsDTwJNTwNMTwNSUL8osCNDNhoBSSJZJQhLARUSRFcCAL5ISRUWVwYCTFCABBUffHVMULAjQw==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the EscrowVault smart contract
 */
class EscrowVaultParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(address)void':
                        return EscrowVaultParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the EscrowVault smart contract using the create(address)void ABI method
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
     * Constructs a no op call for the lock_bounty(string,address,address,address,uint64,pay)bool ABI method
     *
     * Client locks ALGO bounty for a task.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static lockBounty(params) {
        return {
            ...params,
            method: 'lock_bounty(string,address,address,address,uint64,pay)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.taskId, params.args.client, params.args.worker, params.args.sensei, params.args.bountyAmount, params.args.bountyTxn],
        };
    }
    /**
     * Constructs a no op call for the submit_task(string,byte[])bool ABI method
     *
     * Worker submits the task result with Kite AI provenance hash.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static submitTask(params) {
        return {
            ...params,
            method: 'submit_task(string,byte[])bool',
            args: Array.isArray(params.args) ? params.args : [params.args.taskId, params.args.kiteHash],
        };
    }
    /**
     * Constructs a no op call for the release_payment(string,address)bool ABI method
     *
    * Admin releases bounty on validated completion.
    Distribution: 2% platform fee to treasury, 98% to sensei (developer) directly.
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static releasePayment(params) {
        return {
            ...params,
            method: 'release_payment(string,address)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.taskId, params.args.treasury],
        };
    }
    /**
     * Constructs a no op call for the slash_bounty(string)bool ABI method
     *
    * Admin slashes on task failure - returns 100% bounty to client (user).
    No platform fee on the bounty side. The 1% developer slash is handled separately by the CommitmentLock contract.
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static slashBounty(params) {
        return {
            ...params,
            method: 'slash_bounty(string)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.taskId],
        };
    }
    /**
     * Constructs a no op call for the get_task(string)byte[] ABI method
     *
     * Retrieve task escrow data.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getTask(params) {
        return {
            ...params,
            method: 'get_task(string)byte[]',
            args: Array.isArray(params.args) ? params.args : [params.args.taskId],
        };
    }
}
exports.EscrowVaultParamsFactory = EscrowVaultParamsFactory;
/**
 * A factory to create and deploy one or more instance of the EscrowVault smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class EscrowVaultFactory {
    /**
     * The underlying `AppFactory` for when you want to have more flexibility
     */
    appFactory;
    /**
     * Creates a new instance of `EscrowVaultFactory`
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
        return new EscrowVaultClient(this.appFactory.getAppClientById(params));
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
        return new EscrowVaultClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the EscrowVault smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? EscrowVaultParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new EscrowVaultClient(result.appClient) };
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
             * Creates a new instance of the EscrowVault smart contract using the create(address)void ABI method.
             *
             * Initialize vault with admin.
             *
             * @param params The params for the smart contract call
             * @returns The create params
             */
            create: (params) => {
                return this.appFactory.params.create(EscrowVaultParamsFactory.create.create(params));
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
             * Creates a new instance of the EscrowVault smart contract using the create(address)void ABI method.
             *
             * Initialize vault with admin.
             *
             * @param params The params for the smart contract call
             * @returns The create transaction
             */
            create: (params) => {
                return this.appFactory.createTransaction.create(EscrowVaultParamsFactory.create.create(params));
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
             * Creates a new instance of the EscrowVault smart contract using an ABI method call using the create(address)void ABI method.
             *
             * Initialize vault with admin.
             *
             * @param params The params for the smart contract call
             * @returns The create result
             */
            create: async (params) => {
                const result = await this.appFactory.send.create(EscrowVaultParamsFactory.create.create(params));
                return { result: { ...result.result, return: result.result.return }, appClient: new EscrowVaultClient(result.appClient) };
            },
        },
    };
}
exports.EscrowVaultFactory = EscrowVaultFactory;
/**
 * A client to make calls to the EscrowVault smart contract
 */
class EscrowVaultClient {
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
     * Returns a new `EscrowVaultClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new EscrowVaultClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `EscrowVaultClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new EscrowVaultClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
         * Makes a clear_state call to an existing instance of the EscrowVault smart contract.
         *
         * @param params The params for the bare (raw) call
         * @returns The clearState result
         */
        clearState: (params) => {
            return this.appClient.params.bare.clearState(params);
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `lock_bounty(string,address,address,address,uint64,pay)bool` ABI method.
         *
         * Client locks ALGO bounty for a task.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        lockBounty: (params) => {
            return this.appClient.params.call(EscrowVaultParamsFactory.lockBounty(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `submit_task(string,byte[])bool` ABI method.
         *
         * Worker submits the task result with Kite AI provenance hash.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        submitTask: (params) => {
            return this.appClient.params.call(EscrowVaultParamsFactory.submitTask(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `release_payment(string,address)bool` ABI method.
         *
        * Admin releases bounty on validated completion.
        Distribution: 2% platform fee to treasury, 98% to sensei (developer) directly.
    
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        releasePayment: (params) => {
            return this.appClient.params.call(EscrowVaultParamsFactory.releasePayment(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `slash_bounty(string)bool` ABI method.
         *
        * Admin slashes on task failure - returns 100% bounty to client (user).
        No platform fee on the bounty side. The 1% developer slash is handled separately by the CommitmentLock contract.
    
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        slashBounty: (params) => {
            return this.appClient.params.call(EscrowVaultParamsFactory.slashBounty(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `get_task(string)byte[]` ABI method.
         *
         * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
         *
         * Retrieve task escrow data.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        getTask: (params) => {
            return this.appClient.params.call(EscrowVaultParamsFactory.getTask(params));
        },
    };
    /**
     * Create transactions for the current app
     */
    createTransaction = {
        /**
         * Makes a clear_state call to an existing instance of the EscrowVault smart contract.
         *
         * @param params The params for the bare (raw) call
         * @returns The clearState result
         */
        clearState: (params) => {
            return this.appClient.createTransaction.bare.clearState(params);
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `lock_bounty(string,address,address,address,uint64,pay)bool` ABI method.
         *
         * Client locks ALGO bounty for a task.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        lockBounty: (params) => {
            return this.appClient.createTransaction.call(EscrowVaultParamsFactory.lockBounty(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `submit_task(string,byte[])bool` ABI method.
         *
         * Worker submits the task result with Kite AI provenance hash.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        submitTask: (params) => {
            return this.appClient.createTransaction.call(EscrowVaultParamsFactory.submitTask(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `release_payment(string,address)bool` ABI method.
         *
        * Admin releases bounty on validated completion.
        Distribution: 2% platform fee to treasury, 98% to sensei (developer) directly.
    
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        releasePayment: (params) => {
            return this.appClient.createTransaction.call(EscrowVaultParamsFactory.releasePayment(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `slash_bounty(string)bool` ABI method.
         *
        * Admin slashes on task failure - returns 100% bounty to client (user).
        No platform fee on the bounty side. The 1% developer slash is handled separately by the CommitmentLock contract.
    
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        slashBounty: (params) => {
            return this.appClient.createTransaction.call(EscrowVaultParamsFactory.slashBounty(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `get_task(string)byte[]` ABI method.
         *
         * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
         *
         * Retrieve task escrow data.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        getTask: (params) => {
            return this.appClient.createTransaction.call(EscrowVaultParamsFactory.getTask(params));
        },
    };
    /**
     * Send calls to the current app
     */
    send = {
        /**
         * Makes a clear_state call to an existing instance of the EscrowVault smart contract.
         *
         * @param params The params for the bare (raw) call
         * @returns The clearState result
         */
        clearState: (params) => {
            return this.appClient.send.bare.clearState(params);
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `lock_bounty(string,address,address,address,uint64,pay)bool` ABI method.
         *
         * Client locks ALGO bounty for a task.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        lockBounty: async (params) => {
            const result = await this.appClient.send.call(EscrowVaultParamsFactory.lockBounty(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `submit_task(string,byte[])bool` ABI method.
         *
         * Worker submits the task result with Kite AI provenance hash.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        submitTask: async (params) => {
            const result = await this.appClient.send.call(EscrowVaultParamsFactory.submitTask(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `release_payment(string,address)bool` ABI method.
         *
        * Admin releases bounty on validated completion.
        Distribution: 2% platform fee to treasury, 98% to sensei (developer) directly.
    
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        releasePayment: async (params) => {
            const result = await this.appClient.send.call(EscrowVaultParamsFactory.releasePayment(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `slash_bounty(string)bool` ABI method.
         *
        * Admin slashes on task failure - returns 100% bounty to client (user).
        No platform fee on the bounty side. The 1% developer slash is handled separately by the CommitmentLock contract.
    
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        slashBounty: async (params) => {
            const result = await this.appClient.send.call(EscrowVaultParamsFactory.slashBounty(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `get_task(string)byte[]` ABI method.
         *
         * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
         *
         * Retrieve task escrow data.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        getTask: async (params) => {
            const result = await this.appClient.send.call(EscrowVaultParamsFactory.getTask(params));
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
        return new EscrowVaultClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the EscrowVault smart contract using the `get_task(string)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Retrieve task escrow data.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getTask(params) {
        const result = await this.appClient.send.call(EscrowVaultParamsFactory.getTask(params));
        return result.return;
    }
    /**
     * Methods to access state for the current EscrowVault app
     */
    state = {
        /**
         * Methods to access global state for the current EscrowVault app
         */
        global: {
            /**
             * Get all current keyed values from global state
             */
            getAll: async () => {
                const result = await this.appClient.state.global.getAll();
                return {
                    admin: result.admin,
                    totalTasks: result.total_tasks,
                };
            },
            /**
             * Get the current value of the admin key in global state
             */
            admin: async () => { return (await this.appClient.state.global.getValue("admin")); },
            /**
             * Get the current value of the total_tasks key in global state
             */
            totalTasks: async () => { return (await this.appClient.state.global.getValue("total_tasks")); },
        },
    };
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a lock_bounty(string,address,address,address,uint64,pay)bool method call against the EscrowVault contract
             */
            lockBounty(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.lockBounty(params)));
                resultMappers.push((v) => client.decodeReturnValue('lock_bounty(string,address,address,address,uint64,pay)bool', v));
                return this;
            },
            /**
             * Add a submit_task(string,byte[])bool method call against the EscrowVault contract
             */
            submitTask(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.submitTask(params)));
                resultMappers.push((v) => client.decodeReturnValue('submit_task(string,byte[])bool', v));
                return this;
            },
            /**
             * Add a release_payment(string,address)bool method call against the EscrowVault contract
             */
            releasePayment(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.releasePayment(params)));
                resultMappers.push((v) => client.decodeReturnValue('release_payment(string,address)bool', v));
                return this;
            },
            /**
             * Add a slash_bounty(string)bool method call against the EscrowVault contract
             */
            slashBounty(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.slashBounty(params)));
                resultMappers.push((v) => client.decodeReturnValue('slash_bounty(string)bool', v));
                return this;
            },
            /**
             * Add a get_task(string)byte[] method call against the EscrowVault contract
             */
            getTask(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getTask(params)));
                resultMappers.push((v) => client.decodeReturnValue('get_task(string)byte[]', v));
                return this;
            },
            /**
             * Add a clear state call to the EscrowVault contract
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
exports.EscrowVaultClient = EscrowVaultClient;
