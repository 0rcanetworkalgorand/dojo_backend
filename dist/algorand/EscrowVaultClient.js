"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowVaultClient = exports.EscrowVaultFactory = exports.EscrowVaultParamsFactory = exports.APP_SPEC = void 0;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "EscrowVault", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "address", "name": "admin" }, { "type": "uint64", "name": "usdc_asset" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "desc": "Initialize vault with admin and USDC ASA ID.", "events": [], "recommendations": {} }, { "name": "lock_bounty", "args": [{ "type": "string", "name": "task_id" }, { "type": "address", "name": "client" }, { "type": "address", "name": "worker" }, { "type": "uint64", "name": "bounty_amount" }, { "type": "uint64", "name": "collateral_amount" }, { "type": "axfer", "name": "bounty_txn" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Client locks USDC bounty for a task.", "events": [], "recommendations": {} }, { "name": "lock_collateral", "args": [{ "type": "string", "name": "task_id" }, { "type": "axfer", "name": "collateral_txn" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Worker locks USDC collateral.", "events": [], "recommendations": {} }, { "name": "release_payment", "args": [{ "type": "string", "name": "task_id" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Admin releases bounty to worker on validated completion.", "events": [], "recommendations": {} }, { "name": "slash_collateral", "args": [{ "type": "string", "name": "task_id" }, { "type": "address", "name": "treasury" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Admin slashes collateral on failure, returns bounty to client.", "events": [], "recommendations": {} }, { "name": "get_task", "args": [{ "type": "string", "name": "task_id" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Retrieve task escrow data.", "events": [], "recommendations": {} }], "arcs": [22, 28], "desc": "Per-task escrow managing USDC bounty and collateral with Box Storage keyed by task_id.", "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "admin": { "keyType": "AVMString", "valueType": "address", "key": "YWRtaW4=" }, "usdc_asset_id": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dXNkY19hc3NldF9pZA==" }, "total_tasks": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dG90YWxfdGFza3M=" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [412, 511], "errorMessage": "Already settled" }, { "pc": [236, 361], "errorMessage": "Amount mismatch" }, { "pc": [210], "errorMessage": "Client must send bounty" }, { "pc": [226, 356], "errorMessage": "Must be USDC" }, { "pc": [386, 484], "errorMessage": "Only admin" }, { "pc": [217, 346], "errorMessage": "Send to contract" }, { "pc": [243], "errorMessage": "Task already exists" }, { "pc": [338], "errorMessage": "Worker must send collateral" }, { "pc": [384, 482], "errorMessage": "check self.admin exists" }, { "pc": [283], "errorMessage": "check self.total_tasks exists" }, { "pc": [224, 354, 418, 516], "errorMessage": "check self.usdc_asset_id exists" }, { "pc": [149, 298, 371, 460, 581], "errorMessage": "invalid array length header" }, { "pc": [156, 305, 378, 467, 588], "errorMessage": "invalid number of bytes for arc4.dynamic_array<arc4.uint8>" }, { "pc": [121, 165, 174, 476], "errorMessage": "invalid number of bytes for arc4.static_array<arc4.uint8, 32>" }, { "pc": [130, 183, 192], "errorMessage": "invalid number of bytes for arc4.uint64" }, { "pc": [203, 316], "errorMessage": "transaction type is axfer" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuYXBwcm92YWxfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIGludGNibG9jayAwIDEgODAgMgogICAgYnl0ZWNibG9jayAidXNkY19hc3NldF9pZCIgMHgxNTFmN2M3NTgwICJhZG1pbiIgInRvdGFsX3Rhc2tzIgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo1CiAgICAvLyBjbGFzcyBFc2Nyb3dWYXVsdChBUkM0Q29udHJhY3QpOgogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0CiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEAxMQogICAgcHVzaGJ5dGVzcyAweGNlMTk5ZTFiIDB4ZTgzYjI5NWQgMHgxMDZlOTkzMCAweDFlZGZkMmVmIDB4NDcyNTFhZjEgLy8gbWV0aG9kICJsb2NrX2JvdW50eShzdHJpbmcsYWRkcmVzcyxhZGRyZXNzLHVpbnQ2NCx1aW50NjQsYXhmZXIpYm9vbCIsIG1ldGhvZCAibG9ja19jb2xsYXRlcmFsKHN0cmluZyxheGZlcilib29sIiwgbWV0aG9kICJyZWxlYXNlX3BheW1lbnQoc3RyaW5nKWJvb2wiLCBtZXRob2QgInNsYXNoX2NvbGxhdGVyYWwoc3RyaW5nLGFkZHJlc3MpYm9vbCIsIG1ldGhvZCAiZ2V0X3Rhc2soc3RyaW5nKWJ5dGVbXSIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGxvY2tfYm91bnR5IGxvY2tfY29sbGF0ZXJhbCByZWxlYXNlX3BheW1lbnQgc2xhc2hfY29sbGF0ZXJhbCBnZXRfdGFzawogICAgZXJyCgptYWluX2NyZWF0ZV9Ob09wQDExOgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo1CiAgICAvLyBjbGFzcyBFc2Nyb3dWYXVsdChBUkM0Q29udHJhY3QpOgogICAgcHVzaGJ5dGVzIDB4YzBiNjQzNTIgLy8gbWV0aG9kICJjcmVhdGUoYWRkcmVzcyx1aW50NjQpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNyZWF0ZQogICAgZXJyCgoKLy8gZXNjcm93X3ZhdWx0LmNvbnRyYWN0LkVzY3Jvd1ZhdWx0LmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTMKICAgIC8vIEBhYmltZXRob2QoY3JlYXRlPSJyZXF1aXJlIikKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LnN0YXRpY19hcnJheTxhcmM0LnVpbnQ4LCAzMj4KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQudWludDY0CiAgICBidG9pCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjE2CiAgICAvLyBzZWxmLmFkbWluLnZhbHVlID0gYWRtaW4ubmF0aXZlCiAgICBieXRlY18yIC8vICJhZG1pbiIKICAgIHVuY292ZXIgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTcKICAgIC8vIHNlbGYudXNkY19hc3NldF9pZC52YWx1ZSA9IHVzZGNfYXNzZXQuaWQKICAgIGJ5dGVjXzAgLy8gInVzZGNfYXNzZXRfaWQiCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxOAogICAgLy8gc2VsZi50b3RhbF90YXNrcy52YWx1ZSA9IFVJbnQ2NCgwKQogICAgYnl0ZWNfMyAvLyAidG90YWxfdGFza3MiCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTMKICAgIC8vIEBhYmltZXRob2QoY3JlYXRlPSJyZXF1aXJlIikKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBlc2Nyb3dfdmF1bHQuY29udHJhY3QuRXNjcm93VmF1bHQubG9ja19ib3VudHlbcm91dGluZ10oKSAtPiB2b2lkOgpsb2NrX2JvdW50eToKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MjAKICAgIC8vIEBhYmltZXRob2QKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2IC8vIG9uIGVycm9yOiBpbnZhbGlkIGFycmF5IGxlbmd0aCBoZWFkZXIKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LmR5bmFtaWNfYXJyYXk8YXJjNC51aW50OD4KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LnN0YXRpY19hcnJheTxhcmM0LnVpbnQ4LCAzMj4KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LnN0YXRpY19hcnJheTxhcmM0LnVpbnQ4LCAzMj4KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQudWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LnVpbnQ2NAogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBwdXNoaW50IDQgLy8gYXhmZXIKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBheGZlcgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTozMQogICAgLy8gYXNzZXJ0IGJvdW50eV90eG4uc2VuZGVyID09IGNsaWVudC5uYXRpdmUsICJDbGllbnQgbXVzdCBzZW5kIGJvdW50eSIKICAgIGR1cAogICAgZ3R4bnMgU2VuZGVyCiAgICBkaWcgNQogICAgPT0KICAgIGFzc2VydCAvLyBDbGllbnQgbXVzdCBzZW5kIGJvdW50eQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTozMgogICAgLy8gYXNzZXJ0IGJvdW50eV90eG4uYXNzZXRfcmVjZWl2ZXIgPT0gR2xvYmFsLmN1cnJlbnRfYXBwbGljYXRpb25fYWRkcmVzcywgIlNlbmQgdG8gY29udHJhY3QiCiAgICBkdXAKICAgIGd0eG5zIEFzc2V0UmVjZWl2ZXIKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICA9PQogICAgYXNzZXJ0IC8vIFNlbmQgdG8gY29udHJhY3QKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MzMKICAgIC8vIGFzc2VydCBib3VudHlfdHhuLnhmZXJfYXNzZXQgPT0gQXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwgIk11c3QgYmUgVVNEQyIKICAgIGR1cAogICAgZ3R4bnMgWGZlckFzc2V0CiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAidXNkY19hc3NldF9pZCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi51c2RjX2Fzc2V0X2lkIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBNdXN0IGJlIFVTREMKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MzQKICAgIC8vIGFzc2VydCBib3VudHlfdHhuLmFzc2V0X2Ftb3VudCA9PSBib3VudHlfYW1vdW50Lm5hdGl2ZSwgIkFtb3VudCBtaXNtYXRjaCIKICAgIGd0eG5zIEFzc2V0QW1vdW50CiAgICB1bmNvdmVyIDIKICAgIGJ0b2kKICAgIHN3YXAKICAgIGRpZyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIEFtb3VudCBtaXNtYXRjaAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTozNgogICAgLy8gYm94X2tleSA9IHRhc2tfaWQubmF0aXZlLmJ5dGVzCiAgICB1bmNvdmVyIDQKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjM3CiAgICAvLyBhc3NlcnQgbm90IG9wLkJveC5sZW5ndGgoYm94X2tleSksICJUYXNrIGFscmVhZHkgZXhpc3RzIgogICAgaW50Y18wIC8vIDAKICAgIGFzc2VydCAvLyBUYXNrIGFscmVhZHkgZXhpc3RzCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjM5LTQxCiAgICAvLyAjIEJveCBmb3JtYXQ6IGNsaWVudCgzMikgKyB3b3JrZXIoMzIpICsgYm91bnR5KDgpICsgY29sbGF0ZXJhbCg4KSArIHN0YXR1cygxKSA9IDgxIGJ5dGVzCiAgICAvLyAjIHN0YXR1czogMD1sb2NrZWQsIDE9Y29tcGxldGVkLCAyPXNsYXNoZWQKICAgIC8vIGNsaWVudF9ieXRlcyA9IG9wLmV4dHJhY3QoY2xpZW50Lm5hdGl2ZS5ieXRlcywgMCwgMzIpCiAgICB1bmNvdmVyIDQKICAgIGV4dHJhY3QgMCAzMgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo0MgogICAgLy8gd29ya2VyX2J5dGVzID0gb3AuZXh0cmFjdCh3b3JrZXIubmF0aXZlLmJ5dGVzLCAwLCAzMikKICAgIHVuY292ZXIgNAogICAgZXh0cmFjdCAwIDMyCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjQzCiAgICAvLyBib3VudHlfYnl0ZXMgPSBvcC5pdG9iKGJvdW50eV9hbW91bnQubmF0aXZlKQogICAgdW5jb3ZlciAzCiAgICBpdG9iCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjQ0CiAgICAvLyBjb2xsYXRlcmFsX2J5dGVzID0gb3AuaXRvYihjb2xsYXRlcmFsX2Ftb3VudC5uYXRpdmUpCiAgICB1bmNvdmVyIDQKICAgIGJ0b2kKICAgIGl0b2IKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NDUKICAgIC8vIHBhcnQxID0gb3AuY29uY2F0KGNsaWVudF9ieXRlcywgd29ya2VyX2J5dGVzKQogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDMKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo0NgogICAgLy8gcGFydDIgPSBvcC5jb25jYXQoYm91bnR5X2J5dGVzLCBjb2xsYXRlcmFsX2J5dGVzKQogICAgY292ZXIgMgogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjQ3CiAgICAvLyBwYXJ0MyA9IG9wLmNvbmNhdChwYXJ0MSwgcGFydDIpCiAgICBjb25jYXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NDgKICAgIC8vIGJveF9kYXRhID0gb3AuY29uY2F0KHBhcnQzLCBvcC5iemVybygxKSkKICAgIGludGNfMSAvLyAxCiAgICBiemVybwogICAgY29uY2F0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjQ5CiAgICAvLyBvcC5Cb3guY3JlYXRlKGJveF9rZXksIFVJbnQ2NCg4MSkpCiAgICBkaWcgMQogICAgcHVzaGludCA4MQogICAgYm94X2NyZWF0ZQogICAgcG9wCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjUwCiAgICAvLyBvcC5Cb3gucHV0KGJveF9rZXksIGJveF9kYXRhKQogICAgYm94X3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo1MgogICAgLy8gc2VsZi50b3RhbF90YXNrcy52YWx1ZSArPSBVSW50NjQoMSkKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18zIC8vICJ0b3RhbF90YXNrcyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi50b3RhbF90YXNrcyBleGlzdHMKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBieXRlY18zIC8vICJ0b3RhbF90YXNrcyIKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjIwCiAgICAvLyBAYWJpbWV0aG9kCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzU4MAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gZXNjcm93X3ZhdWx0LmNvbnRyYWN0LkVzY3Jvd1ZhdWx0LmxvY2tfY29sbGF0ZXJhbFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmxvY2tfY29sbGF0ZXJhbDoKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NTUKICAgIC8vIEBhYmltZXRob2QKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2IC8vIG9uIGVycm9yOiBpbnZhbGlkIGFycmF5IGxlbmd0aCBoZWFkZXIKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LmR5bmFtaWNfYXJyYXk8YXJjNC51aW50OD4KICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgcHVzaGludCA0IC8vIGF4ZmVyCiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgYXhmZXIKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NjIKICAgIC8vIGJveF9rZXkgPSB0YXNrX2lkLm5hdGl2ZS5ieXRlcwogICAgc3dhcAogICAgZXh0cmFjdCAyIDAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NjMKICAgIC8vIGRhdGEsIF9leGlzdHMgPSBvcC5Cb3guZ2V0KGJveF9rZXkpCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6NjUKICAgIC8vIHdvcmtlciA9IEFjY291bnQob3AuZXh0cmFjdChkYXRhLCAzMiwgMzIpKQogICAgZHVwCiAgICBleHRyYWN0IDMyIDMyCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjY2CiAgICAvLyBjb2xsYXRlcmFsX2Ftb3VudCA9IG9wLmJ0b2kob3AuZXh0cmFjdChkYXRhLCA3MiwgOCkpCiAgICBzd2FwCiAgICBwdXNoaW50IDcyCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo2OAogICAgLy8gYXNzZXJ0IGNvbGxhdGVyYWxfdHhuLnNlbmRlciA9PSB3b3JrZXIsICJXb3JrZXIgbXVzdCBzZW5kIGNvbGxhdGVyYWwiCiAgICBkaWcgMgogICAgZ3R4bnMgU2VuZGVyCiAgICB1bmNvdmVyIDIKICAgID09CiAgICBhc3NlcnQgLy8gV29ya2VyIG11c3Qgc2VuZCBjb2xsYXRlcmFsCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjY5CiAgICAvLyBhc3NlcnQgY29sbGF0ZXJhbF90eG4uYXNzZXRfcmVjZWl2ZXIgPT0gR2xvYmFsLmN1cnJlbnRfYXBwbGljYXRpb25fYWRkcmVzcywgIlNlbmQgdG8gY29udHJhY3QiCiAgICBkaWcgMQogICAgZ3R4bnMgQXNzZXRSZWNlaXZlcgogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gU2VuZCB0byBjb250cmFjdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo3MAogICAgLy8gYXNzZXJ0IGNvbGxhdGVyYWxfdHhuLnhmZXJfYXNzZXQgPT0gQXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwgIk11c3QgYmUgVVNEQyIKICAgIGRpZyAxCiAgICBndHhucyBYZmVyQXNzZXQKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJ1c2RjX2Fzc2V0X2lkIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLnVzZGNfYXNzZXRfaWQgZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIE11c3QgYmUgVVNEQwogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo3MQogICAgLy8gYXNzZXJ0IGNvbGxhdGVyYWxfdHhuLmFzc2V0X2Ftb3VudCA9PSBjb2xsYXRlcmFsX2Ftb3VudCwgIkFtb3VudCBtaXNtYXRjaCIKICAgIHN3YXAKICAgIGd0eG5zIEFzc2V0QW1vdW50CiAgICA9PQogICAgYXNzZXJ0IC8vIEFtb3VudCBtaXNtYXRjaAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo1NQogICAgLy8gQGFiaW1ldGhvZAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1ODAKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIGVzY3Jvd192YXVsdC5jb250cmFjdC5Fc2Nyb3dWYXVsdC5yZWxlYXNlX3BheW1lbnRbcm91dGluZ10oKSAtPiB2b2lkOgpyZWxlYXNlX3BheW1lbnQ6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5Ojc1CiAgICAvLyBAYWJpbWV0aG9kCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC5keW5hbWljX2FycmF5PGFyYzQudWludDg+CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5Ojc4CiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBzZWxmLmFkbWluLnZhbHVlLCAiT25seSBhZG1pbiIKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18yIC8vICJhZG1pbiIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5hZG1pbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSBhZG1pbgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo4MAogICAgLy8gYm94X2tleSA9IHRhc2tfaWQubmF0aXZlLmJ5dGVzCiAgICBleHRyYWN0IDIgMAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo4MQogICAgLy8gZGF0YSwgX2V4aXN0cyA9IG9wLkJveC5nZXQoYm94X2tleSkKICAgIGR1cAogICAgYm94X2dldAogICAgcG9wCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjgzCiAgICAvLyB3b3JrZXIgPSBBY2NvdW50KG9wLmV4dHJhY3QoZGF0YSwgMzIsIDMyKSkKICAgIGR1cAogICAgZXh0cmFjdCAzMiAzMgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo4NAogICAgLy8gYm91bnR5ID0gb3AuYnRvaShvcC5leHRyYWN0KGRhdGEsIDY0LCA4KSkKICAgIGRpZyAxCiAgICBwdXNoaW50IDY0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo4NQogICAgLy8gY29sbGF0ZXJhbCA9IG9wLmJ0b2kob3AuZXh0cmFjdChkYXRhLCA3MiwgOCkpCiAgICBkaWcgMgogICAgcHVzaGludCA3MgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6ODgKICAgIC8vIGFzc2VydCBvcC5idG9pKHN0YXR1cykgPT0gVUludDY0KDApLCAiQWxyZWFkeSBzZXR0bGVkIgogICAgZGlnIDMKICAgIGludGNfMiAvLyA4MAogICAgZ2V0Ynl0ZQogICAgIQogICAgYXNzZXJ0IC8vIEFscmVhZHkgc2V0dGxlZAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo5MC05MQogICAgLy8gIyBSZWxlYXNlIGJvdW50eSArIGNvbGxhdGVyYWwgdG8gd29ya2VyCiAgICAvLyB0b3RhbF9wYXltZW50ID0gYm91bnR5ICsgY29sbGF0ZXJhbAogICAgKwogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo5Mi05NgogICAgLy8gaXR4bi5Bc3NldFRyYW5zZmVyKAogICAgLy8gICAgIHhmZXJfYXNzZXQ9QXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwKICAgIC8vICAgICBhc3NldF9yZWNlaXZlcj13b3JrZXIsCiAgICAvLyAgICAgYXNzZXRfYW1vdW50PXRvdGFsX3BheW1lbnQsCiAgICAvLyApLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjkzCiAgICAvLyB4ZmVyX2Fzc2V0PUFzc2V0KHNlbGYudXNkY19hc3NldF9pZC52YWx1ZSksCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAidXNkY19hc3NldF9pZCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi51c2RjX2Fzc2V0X2lkIGV4aXN0cwogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weTo5MgogICAgLy8gaXR4bi5Bc3NldFRyYW5zZmVyKAogICAgcHVzaGludCA0IC8vIGF4ZmVyCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6OTItOTYKICAgIC8vIGl0eG4uQXNzZXRUcmFuc2ZlcigKICAgIC8vICAgICB4ZmVyX2Fzc2V0PUFzc2V0KHNlbGYudXNkY19hc3NldF9pZC52YWx1ZSksCiAgICAvLyAgICAgYXNzZXRfcmVjZWl2ZXI9d29ya2VyLAogICAgLy8gICAgIGFzc2V0X2Ftb3VudD10b3RhbF9wYXltZW50LAogICAgLy8gKS5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6OTgtOTkKICAgIC8vICMgVXBkYXRlIHN0YXR1cyB0byBjb21wbGV0ZWQKICAgIC8vIHVwZGF0ZWQgPSBkYXRhWzo4MF0gKyBCeXRlcyhiIlx4MDEiKQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4MAogICAgZGlnIDEKICAgID49CiAgICBpbnRjXzIgLy8gODAKICAgIGNvdmVyIDIKICAgIHNlbGVjdAogICAgaW50Y18wIC8vIDAKICAgIHN3YXAKICAgIHN1YnN0cmluZzMKICAgIHB1c2hieXRlcyAweDAxCiAgICBjb25jYXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTAwCiAgICAvLyBvcC5Cb3gucHV0KGJveF9rZXksIHVwZGF0ZWQpCiAgICBib3hfcHV0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5Ojc1CiAgICAvLyBAYWJpbWV0aG9kCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzU4MAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gZXNjcm93X3ZhdWx0LmNvbnRyYWN0LkVzY3Jvd1ZhdWx0LnNsYXNoX2NvbGxhdGVyYWxbcm91dGluZ10oKSAtPiB2b2lkOgpzbGFzaF9jb2xsYXRlcmFsOgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMDQKICAgIC8vIEBhYmltZXRob2QKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2IC8vIG9uIGVycm9yOiBpbnZhbGlkIGFycmF5IGxlbmd0aCBoZWFkZXIKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LmR5bmFtaWNfYXJyYXk8YXJjNC51aW50OD4KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LnN0YXRpY19hcnJheTxhcmM0LnVpbnQ4LCAzMj4KICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTA3CiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBzZWxmLmFkbWluLnZhbHVlLCAiT25seSBhZG1pbiIKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18yIC8vICJhZG1pbiIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5hZG1pbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSBhZG1pbgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMDkKICAgIC8vIGJveF9rZXkgPSB0YXNrX2lkLm5hdGl2ZS5ieXRlcwogICAgc3dhcAogICAgZXh0cmFjdCAyIDAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTEwCiAgICAvLyBkYXRhLCBfZXhpc3RzID0gb3AuQm94LmdldChib3hfa2V5KQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTEyCiAgICAvLyBjbGllbnQgPSBBY2NvdW50KG9wLmV4dHJhY3QoZGF0YSwgMCwgMzIpKQogICAgZHVwCiAgICBleHRyYWN0IDAgMzIKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTEzCiAgICAvLyBib3VudHkgPSBvcC5idG9pKG9wLmV4dHJhY3QoZGF0YSwgNjQsIDgpKQogICAgZGlnIDEKICAgIHB1c2hpbnQgNjQKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjExNAogICAgLy8gY29sbGF0ZXJhbCA9IG9wLmJ0b2kob3AuZXh0cmFjdChkYXRhLCA3MiwgOCkpCiAgICBkaWcgMgogICAgcHVzaGludCA3MgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTE3CiAgICAvLyBhc3NlcnQgb3AuYnRvaShzdGF0dXMpID09IFVJbnQ2NCgwKSwgIkFscmVhZHkgc2V0dGxlZCIKICAgIGRpZyAzCiAgICBpbnRjXzIgLy8gODAKICAgIGdldGJ5dGUKICAgICEKICAgIGFzc2VydCAvLyBBbHJlYWR5IHNldHRsZWQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTE5LTEyNAogICAgLy8gIyBSZXR1cm4gYm91bnR5IHRvIGNsaWVudAogICAgLy8gaXR4bi5Bc3NldFRyYW5zZmVyKAogICAgLy8gICAgIHhmZXJfYXNzZXQ9QXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwKICAgIC8vICAgICBhc3NldF9yZWNlaXZlcj1jbGllbnQsCiAgICAvLyAgICAgYXNzZXRfYW1vdW50PWJvdW50eSwKICAgIC8vICkuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTIxCiAgICAvLyB4ZmVyX2Fzc2V0PUFzc2V0KHNlbGYudXNkY19hc3NldF9pZC52YWx1ZSksCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAidXNkY19hc3NldF9pZCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi51c2RjX2Fzc2V0X2lkIGV4aXN0cwogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgZHVwCiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMTktMTIwCiAgICAvLyAjIFJldHVybiBib3VudHkgdG8gY2xpZW50CiAgICAvLyBpdHhuLkFzc2V0VHJhbnNmZXIoCiAgICBwdXNoaW50IDQgLy8gYXhmZXIKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMTktMTI0CiAgICAvLyAjIFJldHVybiBib3VudHkgdG8gY2xpZW50CiAgICAvLyBpdHhuLkFzc2V0VHJhbnNmZXIoCiAgICAvLyAgICAgeGZlcl9hc3NldD1Bc3NldChzZWxmLnVzZGNfYXNzZXRfaWQudmFsdWUpLAogICAgLy8gICAgIGFzc2V0X3JlY2VpdmVyPWNsaWVudCwKICAgIC8vICAgICBhc3NldF9hbW91bnQ9Ym91bnR5LAogICAgLy8gKS5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTI2LTEzMQogICAgLy8gIyBTZW5kIGNvbGxhdGVyYWwgdG8gdHJlYXN1cnkKICAgIC8vIGl0eG4uQXNzZXRUcmFuc2ZlcigKICAgIC8vICAgICB4ZmVyX2Fzc2V0PUFzc2V0KHNlbGYudXNkY19hc3NldF9pZC52YWx1ZSksCiAgICAvLyAgICAgYXNzZXRfcmVjZWl2ZXI9dHJlYXN1cnkubmF0aXZlLAogICAgLy8gICAgIGFzc2V0X2Ftb3VudD1jb2xsYXRlcmFsLAogICAgLy8gKS5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgc3dhcAogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjEyNi0xMjcKICAgIC8vICMgU2VuZCBjb2xsYXRlcmFsIHRvIHRyZWFzdXJ5CiAgICAvLyBpdHhuLkFzc2V0VHJhbnNmZXIoCiAgICBwdXNoaW50IDQgLy8gYXhmZXIKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMjYtMTMxCiAgICAvLyAjIFNlbmQgY29sbGF0ZXJhbCB0byB0cmVhc3VyeQogICAgLy8gaXR4bi5Bc3NldFRyYW5zZmVyKAogICAgLy8gICAgIHhmZXJfYXNzZXQ9QXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwKICAgIC8vICAgICBhc3NldF9yZWNlaXZlcj10cmVhc3VyeS5uYXRpdmUsCiAgICAvLyAgICAgYXNzZXRfYW1vdW50PWNvbGxhdGVyYWwsCiAgICAvLyApLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMzMtMTM0CiAgICAvLyAjIFVwZGF0ZSBzdGF0dXMgdG8gc2xhc2hlZAogICAgLy8gdXBkYXRlZCA9IGRhdGFbOjgwXSArIEJ5dGVzKGIiXHgwMiIpCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgwCiAgICBkaWcgMQogICAgPj0KICAgIGludGNfMiAvLyA4MAogICAgY292ZXIgMgogICAgc2VsZWN0CiAgICBpbnRjXzAgLy8gMAogICAgc3dhcAogICAgc3Vic3RyaW5nMwogICAgcHVzaGJ5dGVzIDB4MDIKICAgIGNvbmNhdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxMzUKICAgIC8vIG9wLkJveC5wdXQoYm94X2tleSwgdXBkYXRlZCkKICAgIGJveF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTA0CiAgICAvLyBAYWJpbWV0aG9kCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzU4MAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gZXNjcm93X3ZhdWx0LmNvbnRyYWN0LkVzY3Jvd1ZhdWx0LmdldF90YXNrW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0X3Rhc2s6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjEzOQogICAgLy8gQGFiaW1ldGhvZChyZWFkb25seT1UcnVlKQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYgLy8gb24gZXJyb3I6IGludmFsaWQgYXJyYXkgbGVuZ3RoIGhlYWRlcgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ4PgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL2VzY3Jvd192YXVsdC9jb250cmFjdC5weToxNDIKICAgIC8vIGJveF9rZXkgPSB0YXNrX2lkLm5hdGl2ZS5ieXRlcwogICAgZXh0cmFjdCAyIDAKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9lc2Nyb3dfdmF1bHQvY29udHJhY3QucHk6MTQzCiAgICAvLyBkYXRhLCBfZXhpc3RzID0gb3AuQm94LmdldChib3hfa2V5KQogICAgYm94X2dldAogICAgcG9wCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvZXNjcm93X3ZhdWx0L2NvbnRyYWN0LnB5OjEzOQogICAgLy8gQGFiaW1ldGhvZChyZWFkb25seT1UcnVlKQogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIHB1c2hieXRlcyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuY2xlYXJfc3RhdGVfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIHB1c2hpbnQgMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAFQAiYEDXVzZGNfYXNzZXRfaWQFFR98dYAFYWRtaW4LdG90YWxfdGFza3MxGRREMRhBACuCBQTOGZ4bBOg7KV0EEG6ZMAQe39LvBEclGvE2GgCOBQAuAMMBDAFlAd4AgATAtkNSNhoAjgEAAQA2GgFJFYEgEkQ2GgJJFYEIEkQXKk8CZyhMZysiZyNDNhoBSSJZJQhLARUSRDYaAkkVgSASRDYaA0kVgSASRDYaBEkVgQgSRDYaBUkVgQgSRDEWIwlJOBCBBBJESTgASwUSREk4FDIKEkRJOBEiKGVEEkQ4Ek8CF0xLARJETwRXAgAiRE8EVwAgTwRXACBPAxZPBBcWTwNPA1BOAlBQI69QSwGBUblIvyIrZUQjCCtMZymwI0M2GgFJIlklCEsBFRJEMRYjCUk4EIEEEkRMVwIAvkhJVyAgTIFIW0sCOABPAhJESwE4FDIKEkRLATgRIihlRBJETDgSEkQpsCNDNhoBSSJZJQhLARUSRDEAIiplRBJEVwIASb5ISVcgIEsBgUBbSwKBSFtLAyRVFEQIsSIoZUSyEbISshSBBLIQIrIBs0kVJEsBDyROAk0iTFKAAQFQvymwI0M2GgFJIlklCEsBFRJENhoCSRWBIBJEMQAiKmVEEkRMVwIASb5ISVcAIEsBgUBbSwKBSFtLAyRVFESxIihlRE8CshJPArIUSbIRgQSyECKyAbOxTLISTwOyFLIRgQSyECKyAbNJFSRLAQ8kTgJNIkxSgAECUL8psCNDNhoBSSJZJQhLARUSRFcCAL5ISRUWVwYCTFCABBUffHVMULAjQw==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
                    case 'create(address,uint64)void':
                        return EscrowVaultParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the EscrowVault smart contract using the create(address,uint64)void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            create(params) {
                return {
                    ...params,
                    method: 'create(address,uint64)void',
                    args: Array.isArray(params.args) ? params.args : [params.args.admin, params.args.usdcAsset],
                };
            },
        };
    }
    /**
     * Constructs a no op call for the lock_bounty(string,address,address,uint64,uint64,axfer)bool ABI method
     *
     * Client locks USDC bounty for a task.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static lockBounty(params) {
        return {
            ...params,
            method: 'lock_bounty(string,address,address,uint64,uint64,axfer)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.taskId, params.args.client, params.args.worker, params.args.bountyAmount, params.args.collateralAmount, params.args.bountyTxn],
        };
    }
    /**
     * Constructs a no op call for the lock_collateral(string,axfer)bool ABI method
     *
     * Worker locks USDC collateral.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static lockCollateral(params) {
        return {
            ...params,
            method: 'lock_collateral(string,axfer)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.taskId, params.args.collateralTxn],
        };
    }
    /**
     * Constructs a no op call for the release_payment(string)bool ABI method
     *
     * Admin releases bounty to worker on validated completion.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static releasePayment(params) {
        return {
            ...params,
            method: 'release_payment(string)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.taskId],
        };
    }
    /**
     * Constructs a no op call for the slash_collateral(string,address)bool ABI method
     *
     * Admin slashes collateral on failure, returns bounty to client.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static slashCollateral(params) {
        return {
            ...params,
            method: 'slash_collateral(string,address)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.taskId, params.args.treasury],
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
             * Creates a new instance of the EscrowVault smart contract using the create(address,uint64)void ABI method.
             *
             * Initialize vault with admin and USDC ASA ID.
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
             * Creates a new instance of the EscrowVault smart contract using the create(address,uint64)void ABI method.
             *
             * Initialize vault with admin and USDC ASA ID.
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
             * Creates a new instance of the EscrowVault smart contract using an ABI method call using the create(address,uint64)void ABI method.
             *
             * Initialize vault with admin and USDC ASA ID.
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
         * Makes a call to the EscrowVault smart contract using the `lock_bounty(string,address,address,uint64,uint64,axfer)bool` ABI method.
         *
         * Client locks USDC bounty for a task.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        lockBounty: (params) => {
            return this.appClient.params.call(EscrowVaultParamsFactory.lockBounty(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `lock_collateral(string,axfer)bool` ABI method.
         *
         * Worker locks USDC collateral.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        lockCollateral: (params) => {
            return this.appClient.params.call(EscrowVaultParamsFactory.lockCollateral(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `release_payment(string)bool` ABI method.
         *
         * Admin releases bounty to worker on validated completion.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        releasePayment: (params) => {
            return this.appClient.params.call(EscrowVaultParamsFactory.releasePayment(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `slash_collateral(string,address)bool` ABI method.
         *
         * Admin slashes collateral on failure, returns bounty to client.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        slashCollateral: (params) => {
            return this.appClient.params.call(EscrowVaultParamsFactory.slashCollateral(params));
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
         * Makes a call to the EscrowVault smart contract using the `lock_bounty(string,address,address,uint64,uint64,axfer)bool` ABI method.
         *
         * Client locks USDC bounty for a task.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        lockBounty: (params) => {
            return this.appClient.createTransaction.call(EscrowVaultParamsFactory.lockBounty(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `lock_collateral(string,axfer)bool` ABI method.
         *
         * Worker locks USDC collateral.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        lockCollateral: (params) => {
            return this.appClient.createTransaction.call(EscrowVaultParamsFactory.lockCollateral(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `release_payment(string)bool` ABI method.
         *
         * Admin releases bounty to worker on validated completion.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        releasePayment: (params) => {
            return this.appClient.createTransaction.call(EscrowVaultParamsFactory.releasePayment(params));
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `slash_collateral(string,address)bool` ABI method.
         *
         * Admin slashes collateral on failure, returns bounty to client.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        slashCollateral: (params) => {
            return this.appClient.createTransaction.call(EscrowVaultParamsFactory.slashCollateral(params));
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
         * Makes a call to the EscrowVault smart contract using the `lock_bounty(string,address,address,uint64,uint64,axfer)bool` ABI method.
         *
         * Client locks USDC bounty for a task.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        lockBounty: async (params) => {
            const result = await this.appClient.send.call(EscrowVaultParamsFactory.lockBounty(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `lock_collateral(string,axfer)bool` ABI method.
         *
         * Worker locks USDC collateral.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        lockCollateral: async (params) => {
            const result = await this.appClient.send.call(EscrowVaultParamsFactory.lockCollateral(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `release_payment(string)bool` ABI method.
         *
         * Admin releases bounty to worker on validated completion.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        releasePayment: async (params) => {
            const result = await this.appClient.send.call(EscrowVaultParamsFactory.releasePayment(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the EscrowVault smart contract using the `slash_collateral(string,address)bool` ABI method.
         *
         * Admin slashes collateral on failure, returns bounty to client.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        slashCollateral: async (params) => {
            const result = await this.appClient.send.call(EscrowVaultParamsFactory.slashCollateral(params));
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
                    usdcAssetId: result.usdc_asset_id,
                    totalTasks: result.total_tasks,
                };
            },
            /**
             * Get the current value of the admin key in global state
             */
            admin: async () => { return (await this.appClient.state.global.getValue("admin")); },
            /**
             * Get the current value of the usdc_asset_id key in global state
             */
            usdcAssetId: async () => { return (await this.appClient.state.global.getValue("usdc_asset_id")); },
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
             * Add a lock_bounty(string,address,address,uint64,uint64,axfer)bool method call against the EscrowVault contract
             */
            lockBounty(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.lockBounty(params)));
                resultMappers.push((v) => client.decodeReturnValue('lock_bounty(string,address,address,uint64,uint64,axfer)bool', v));
                return this;
            },
            /**
             * Add a lock_collateral(string,axfer)bool method call against the EscrowVault contract
             */
            lockCollateral(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.lockCollateral(params)));
                resultMappers.push((v) => client.decodeReturnValue('lock_collateral(string,axfer)bool', v));
                return this;
            },
            /**
             * Add a release_payment(string)bool method call against the EscrowVault contract
             */
            releasePayment(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.releasePayment(params)));
                resultMappers.push((v) => client.decodeReturnValue('release_payment(string)bool', v));
                return this;
            },
            /**
             * Add a slash_collateral(string,address)bool method call against the EscrowVault contract
             */
            slashCollateral(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.slashCollateral(params)));
                resultMappers.push((v) => client.decodeReturnValue('slash_collateral(string,address)bool', v));
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
