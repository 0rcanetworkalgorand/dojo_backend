"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutSplitterClient = exports.PayoutSplitterFactory = exports.PayoutSplitterParamsFactory = exports.APP_SPEC = void 0;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "PayoutSplitter", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "address", "name": "admin" }, { "type": "uint64", "name": "usdc_asset" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "desc": "Initialize with admin and USDC ASA ID.", "events": [], "recommendations": {} }, { "name": "split_payment", "args": [{ "type": "address[]", "name": "recipients" }, { "type": "uint64[]", "name": "amounts" }, { "type": "axfer", "name": "payment_txn" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Split USDC payment across multiple recipients in atomic group.", "events": [], "recommendations": {} }, { "name": "split_equal", "args": [{ "type": "address[]", "name": "recipients" }, { "type": "axfer", "name": "payment_txn" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Split USDC payment equally across recipients.", "events": [], "recommendations": {} }, { "name": "split_percentage", "args": [{ "type": "address[]", "name": "recipients" }, { "type": "uint64[]", "name": "percentages" }, { "type": "axfer", "name": "payment_txn" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Split USDC by percentage (basis points: 10000 = 100%).", "events": [], "recommendations": {} }, { "name": "get_total_splits", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get total number of splits executed.", "events": [], "recommendations": {} }], "arcs": [22, 28], "desc": "Distributes USDC earnings across multiple worker wallets using Atomic Transfer groups.", "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "admin": { "keyType": "AVMString", "valueType": "address", "key": "YWRtaW4=" }, "usdc_asset_id": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dXNkY19hc3NldF9pZA==" }, "total_splits": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dG90YWxfc3BsaXRz" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [546], "errorMessage": "Length mismatch" }, { "pc": [376, 554], "errorMessage": "Max 16 recipients" }, { "pc": [204], "errorMessage": "Max 16 recipients per split" }, { "pc": [219, 392, 569], "errorMessage": "Must be USDC" }, { "pc": [199, 370, 549], "errorMessage": "No recipients" }, { "pc": [261], "errorMessage": "Payment amount mismatch" }, { "pc": [610], "errorMessage": "Percentages must sum to 100%" }, { "pc": [196], "errorMessage": "Recipients and amounts length mismatch" }, { "pc": [211, 383, 561], "errorMessage": "Send to contract" }, { "pc": [326, 470, 716, 729], "errorMessage": "check self.total_splits exists" }, { "pc": [217, 276, 390, 421, 567, 649], "errorMessage": "check self.usdc_asset_id exists" }, { "pc": [290, 435, 663], "errorMessage": "index access is out of bounds" }, { "pc": [142, 165, 342, 489, 512], "errorMessage": "invalid array length header" }, { "pc": [156, 356, 503], "errorMessage": "invalid number of bytes for arc4.dynamic_array<arc4.static_array<arc4.uint8, 32>>" }, { "pc": [176, 526], "errorMessage": "invalid number of bytes for arc4.dynamic_array<arc4.uint64>" }, { "pc": [108], "errorMessage": "invalid number of bytes for arc4.static_array<arc4.uint8, 32>" }, { "pc": [116], "errorMessage": "invalid number of bytes for arc4.uint64" }, { "pc": [190, 367, 540], "errorMessage": "transaction type is axfer" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuYXBwcm92YWxfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIGludGNibG9jayAwIDEgMzIgOAogICAgYnl0ZWNibG9jayAidG90YWxfc3BsaXRzIiAidXNkY19hc3NldF9pZCIgMHgxNTFmN2M3NTgwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjUKICAgIC8vIGNsYXNzIFBheW91dFNwbGl0dGVyKEFSQzRDb250cmFjdCk6CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBieiBtYWluX2NyZWF0ZV9Ob09wQDEwCiAgICBwdXNoYnl0ZXNzIDB4OWVjZGQzNjcgMHg3MDg2ZTQ4OCAweDcyYTg5NGJiIDB4MjMxMGVhM2UgLy8gbWV0aG9kICJzcGxpdF9wYXltZW50KGFkZHJlc3NbXSx1aW50NjRbXSxheGZlcilib29sIiwgbWV0aG9kICJzcGxpdF9lcXVhbChhZGRyZXNzW10sYXhmZXIpYm9vbCIsIG1ldGhvZCAic3BsaXRfcGVyY2VudGFnZShhZGRyZXNzW10sdWludDY0W10sYXhmZXIpYm9vbCIsIG1ldGhvZCAiZ2V0X3RvdGFsX3NwbGl0cygpdWludDY0IgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggc3BsaXRfcGF5bWVudCBzcGxpdF9lcXVhbCBzcGxpdF9wZXJjZW50YWdlIGdldF90b3RhbF9zcGxpdHMKICAgIGVycgoKbWFpbl9jcmVhdGVfTm9PcEAxMDoKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NQogICAgLy8gY2xhc3MgUGF5b3V0U3BsaXR0ZXIoQVJDNENvbnRyYWN0KToKICAgIHB1c2hieXRlcyAweGMwYjY0MzUyIC8vIG1ldGhvZCAiY3JlYXRlKGFkZHJlc3MsdWludDY0KXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKCi8vIHBheW91dF9zcGxpdHRlci5jb250cmFjdC5QYXlvdXRTcGxpdHRlci5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjEzCiAgICAvLyBAYWJpbWV0aG9kKGNyZWF0ZT0icmVxdWlyZSIpCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LnN0YXRpY19hcnJheTxhcmM0LnVpbnQ4LCAzMj4KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYXJjNC51aW50NjQKICAgIGJ0b2kKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MTYKICAgIC8vIHNlbGYuYWRtaW4udmFsdWUgPSBhZG1pbi5uYXRpdmUKICAgIHB1c2hieXRlcyAiYWRtaW4iCiAgICB1bmNvdmVyIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjE3CiAgICAvLyBzZWxmLnVzZGNfYXNzZXRfaWQudmFsdWUgPSB1c2RjX2Fzc2V0LmlkCiAgICBieXRlY18xIC8vICJ1c2RjX2Fzc2V0X2lkIgogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MTgKICAgIC8vIHNlbGYudG90YWxfc3BsaXRzLnZhbHVlID0gVUludDY0KDApCiAgICBieXRlY18wIC8vICJ0b3RhbF9zcGxpdHMiCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MTMKICAgIC8vIEBhYmltZXRob2QoY3JlYXRlPSJyZXF1aXJlIikKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBwYXlvdXRfc3BsaXR0ZXIuY29udHJhY3QuUGF5b3V0U3BsaXR0ZXIuc3BsaXRfcGF5bWVudFtyb3V0aW5nXSgpIC0+IHZvaWQ6CnNwbGl0X3BheW1lbnQ6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjIwCiAgICAvLyBAYWJpbWV0aG9kCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXBuIDIKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgaW50Y18yIC8vIDMyCiAgICAqCiAgICBwdXNoaW50IDIKICAgICsKICAgIHVuY292ZXIgMgogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LmR5bmFtaWNfYXJyYXk8YXJjNC5zdGF0aWNfYXJyYXk8YXJjNC51aW50OCwgMzI+PgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBkdXAKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBwdXNoaW50IDIKICAgICsKICAgIHVuY292ZXIgMgogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LmR5bmFtaWNfYXJyYXk8YXJjNC51aW50NjQ+CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgY292ZXIgMwogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgcHVzaGludCA0IC8vIGF4ZmVyCiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgYXhmZXIKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MjgKICAgIC8vIGFzc2VydCByZWNpcGllbnRzLmxlbmd0aCA9PSBhbW91bnRzLmxlbmd0aCwgIlJlY2lwaWVudHMgYW5kIGFtb3VudHMgbGVuZ3RoIG1pc21hdGNoIgogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgPT0KICAgIGFzc2VydCAvLyBSZWNpcGllbnRzIGFuZCBhbW91bnRzIGxlbmd0aCBtaXNtYXRjaAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weToyOQogICAgLy8gYXNzZXJ0IHJlY2lwaWVudHMubGVuZ3RoID4gVUludDY0KDApLCAiTm8gcmVjaXBpZW50cyIKICAgIGRpZyAxCiAgICBhc3NlcnQgLy8gTm8gcmVjaXBpZW50cwogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTozMAogICAgLy8gYXNzZXJ0IHJlY2lwaWVudHMubGVuZ3RoIDw9IFVJbnQ2NCgxNiksICJNYXggMTYgcmVjaXBpZW50cyBwZXIgc3BsaXQiCiAgICBzd2FwCiAgICBwdXNoaW50IDE2CiAgICA8PQogICAgYXNzZXJ0IC8vIE1heCAxNiByZWNpcGllbnRzIHBlciBzcGxpdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTozMi0zMwogICAgLy8gIyBWZXJpZnkgcGF5bWVudCB0cmFuc2FjdGlvbgogICAgLy8gYXNzZXJ0IHBheW1lbnRfdHhuLmFzc2V0X3JlY2VpdmVyID09IEdsb2JhbC5jdXJyZW50X2FwcGxpY2F0aW9uX2FkZHJlc3MsICJTZW5kIHRvIGNvbnRyYWN0IgogICAgZHVwCiAgICBndHhucyBBc3NldFJlY2VpdmVyCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgPT0KICAgIGFzc2VydCAvLyBTZW5kIHRvIGNvbnRyYWN0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjM0CiAgICAvLyBhc3NlcnQgcGF5bWVudF90eG4ueGZlcl9hc3NldCA9PSBBc3NldChzZWxmLnVzZGNfYXNzZXRfaWQudmFsdWUpLCAiTXVzdCBiZSBVU0RDIgogICAgZ3R4bnMgWGZlckFzc2V0CiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMSAvLyAidXNkY19hc3NldF9pZCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi51c2RjX2Fzc2V0X2lkIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBNdXN0IGJlIFVTREMKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MzYtMzcKICAgIC8vICMgQ2FsY3VsYXRlIHRvdGFsIGFuZCB2ZXJpZnkKICAgIC8vIHRvdGFsID0gVUludDY0KDApCiAgICBpbnRjXzAgLy8gMAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTozOAogICAgLy8gZm9yIGkgaW4gdXJhbmdlKHJlY2lwaWVudHMubGVuZ3RoKToKICAgIGR1cAoKc3BsaXRfcGF5bWVudF9mb3JfaGVhZGVyQDI6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjM4CiAgICAvLyBmb3IgaSBpbiB1cmFuZ2UocmVjaXBpZW50cy5sZW5ndGgpOgogICAgZHVwCiAgICBkaWcgNQogICAgPAogICAgYnogc3BsaXRfcGF5bWVudF9hZnRlcl9mb3JANQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTozOQogICAgLy8gdG90YWwgKz0gYW1vdW50c1tpXS5uYXRpdmUKICAgIGRpZyAzCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDEKICAgIGR1cAogICAgY292ZXIgMgogICAgaW50Y18zIC8vIDgKICAgICoKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgMwogICAgKwogICAgYnVyeSAzCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjM4CiAgICAvLyBmb3IgaSBpbiB1cmFuZ2UocmVjaXBpZW50cy5sZW5ndGgpOgogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ1cnkgMQogICAgYiBzcGxpdF9wYXltZW50X2Zvcl9oZWFkZXJAMgoKc3BsaXRfcGF5bWVudF9hZnRlcl9mb3JANToKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NDEKICAgIC8vIGFzc2VydCBwYXltZW50X3R4bi5hc3NldF9hbW91bnQgPT0gdG90YWwsICJQYXltZW50IGFtb3VudCBtaXNtYXRjaCIKICAgIGRpZyAyCiAgICBndHhucyBBc3NldEFtb3VudAogICAgZGlnIDIKICAgID09CiAgICBhc3NlcnQgLy8gUGF5bWVudCBhbW91bnQgbWlzbWF0Y2gKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NDMtNDQKICAgIC8vICMgRXhlY3V0ZSBhdG9taWMgdHJhbnNmZXJzIHRvIGFsbCByZWNpcGllbnRzCiAgICAvLyBmb3IgaSBpbiB1cmFuZ2UocmVjaXBpZW50cy5sZW5ndGgpOgogICAgaW50Y18wIC8vIDAKICAgIGJ1cnkgMQoKc3BsaXRfcGF5bWVudF9mb3JfaGVhZGVyQDY6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjQzLTQ0CiAgICAvLyAjIEV4ZWN1dGUgYXRvbWljIHRyYW5zZmVycyB0byBhbGwgcmVjaXBpZW50cwogICAgLy8gZm9yIGkgaW4gdXJhbmdlKHJlY2lwaWVudHMubGVuZ3RoKToKICAgIGR1cAogICAgZGlnIDUKICAgIDwKICAgIGJ6IHNwbGl0X3BheW1lbnRfYWZ0ZXJfZm9yQDEwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjQ1LTQ5CiAgICAvLyBpdHhuLkFzc2V0VHJhbnNmZXIoCiAgICAvLyAgICAgeGZlcl9hc3NldD1Bc3NldChzZWxmLnVzZGNfYXNzZXRfaWQudmFsdWUpLAogICAgLy8gICAgIGFzc2V0X3JlY2VpdmVyPXJlY2lwaWVudHNbaV0ubmF0aXZlLAogICAgLy8gICAgIGFzc2V0X2Ftb3VudD1hbW91bnRzW2ldLm5hdGl2ZSwKICAgIC8vICkuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NDYKICAgIC8vIHhmZXJfYXNzZXQ9QXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18xIC8vICJ1c2RjX2Fzc2V0X2lkIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLnVzZGNfYXNzZXRfaWQgZXhpc3RzCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjQ3CiAgICAvLyBhc3NldF9yZWNlaXZlcj1yZWNpcGllbnRzW2ldLm5hdGl2ZSwKICAgIGRpZyA2CiAgICBleHRyYWN0IDIgMAogICAgZGlnIDIKICAgIGR1cAogICAgY292ZXIgMgogICAgaW50Y18yIC8vIDMyCiAgICAqCiAgICBpbnRjXzIgLy8gMzIKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTo0OAogICAgLy8gYXNzZXRfYW1vdW50PWFtb3VudHNbaV0ubmF0aXZlLAogICAgZGlnIDYKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMgogICAgaW50Y18zIC8vIDgKICAgICoKICAgIGV4dHJhY3RfdWludDY0CiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjQ1CiAgICAvLyBpdHhuLkFzc2V0VHJhbnNmZXIoCiAgICBwdXNoaW50IDQgLy8gYXhmZXIKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTo0NS00OQogICAgLy8gaXR4bi5Bc3NldFRyYW5zZmVyKAogICAgLy8gICAgIHhmZXJfYXNzZXQ9QXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwKICAgIC8vICAgICBhc3NldF9yZWNlaXZlcj1yZWNpcGllbnRzW2ldLm5hdGl2ZSwKICAgIC8vICAgICBhc3NldF9hbW91bnQ9YW1vdW50c1tpXS5uYXRpdmUsCiAgICAvLyApLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTo0My00NAogICAgLy8gIyBFeGVjdXRlIGF0b21pYyB0cmFuc2ZlcnMgdG8gYWxsIHJlY2lwaWVudHMKICAgIC8vIGZvciBpIGluIHVyYW5nZShyZWNpcGllbnRzLmxlbmd0aCk6CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIHNwbGl0X3BheW1lbnRfZm9yX2hlYWRlckA2CgpzcGxpdF9wYXltZW50X2FmdGVyX2ZvckAxMDoKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NTEKICAgIC8vIHNlbGYudG90YWxfc3BsaXRzLnZhbHVlICs9IFVJbnQ2NCgxKQogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzAgLy8gInRvdGFsX3NwbGl0cyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi50b3RhbF9zcGxpdHMgZXhpc3RzCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnl0ZWNfMCAvLyAidG90YWxfc3BsaXRzIgogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MjAKICAgIC8vIEBhYmltZXRob2QKICAgIGJ5dGVjXzIgLy8gMHgxNTFmN2M3NTgwCiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBwYXlvdXRfc3BsaXR0ZXIuY29udHJhY3QuUGF5b3V0U3BsaXR0ZXIuc3BsaXRfZXF1YWxbcm91dGluZ10oKSAtPiB2b2lkOgpzcGxpdF9lcXVhbDoKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NTQKICAgIC8vIEBhYmltZXRob2QKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cG4gMgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2IC8vIG9uIGVycm9yOiBpbnZhbGlkIGFycmF5IGxlbmd0aCBoZWFkZXIKICAgIGR1cAogICAgY292ZXIgMgogICAgZHVwCiAgICBpbnRjXzIgLy8gMzIKICAgICoKICAgIHB1c2hpbnQgMgogICAgKwogICAgdW5jb3ZlciAyCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnN0YXRpY19hcnJheTxhcmM0LnVpbnQ4LCAzMj4+CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIHB1c2hpbnQgNCAvLyBheGZlcgogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIGF4ZmVyCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjYxCiAgICAvLyBhc3NlcnQgcmVjaXBpZW50cy5sZW5ndGggPiBVSW50NjQoMCksICJObyByZWNpcGllbnRzIgogICAgZGlnIDEKICAgIGFzc2VydCAvLyBObyByZWNpcGllbnRzCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjYyCiAgICAvLyBhc3NlcnQgcmVjaXBpZW50cy5sZW5ndGggPD0gVUludDY0KDE2KSwgIk1heCAxNiByZWNpcGllbnRzIgogICAgZGlnIDEKICAgIHB1c2hpbnQgMTYKICAgIDw9CiAgICBhc3NlcnQgLy8gTWF4IDE2IHJlY2lwaWVudHMKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NjQKICAgIC8vIGFzc2VydCBwYXltZW50X3R4bi5hc3NldF9yZWNlaXZlciA9PSBHbG9iYWwuY3VycmVudF9hcHBsaWNhdGlvbl9hZGRyZXNzLCAiU2VuZCB0byBjb250cmFjdCIKICAgIGR1cAogICAgZ3R4bnMgQXNzZXRSZWNlaXZlcgogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gU2VuZCB0byBjb250cmFjdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTo2NQogICAgLy8gYXNzZXJ0IHBheW1lbnRfdHhuLnhmZXJfYXNzZXQgPT0gQXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwgIk11c3QgYmUgVVNEQyIKICAgIGR1cAogICAgZ3R4bnMgWGZlckFzc2V0CiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMSAvLyAidXNkY19hc3NldF9pZCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi51c2RjX2Fzc2V0X2lkIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBNdXN0IGJlIFVTREMKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NjcKICAgIC8vIHRvdGFsX2Ftb3VudCA9IHBheW1lbnRfdHhuLmFzc2V0X2Ftb3VudAogICAgZ3R4bnMgQXNzZXRBbW91bnQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NjgKICAgIC8vIHBlcl9yZWNpcGllbnQgPSB0b3RhbF9hbW91bnQgLy8gcmVjaXBpZW50cy5sZW5ndGgKICAgIGR1cAogICAgZGlnIDIKICAgIC8KICAgIGNvdmVyIDIKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NjkKICAgIC8vIHJlbWFpbmRlciA9IHRvdGFsX2Ftb3VudCAlIHJlY2lwaWVudHMubGVuZ3RoCiAgICBzd2FwCiAgICAlCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjcxLTcyCiAgICAvLyAjIFNlbmQgZXF1YWwgYW1vdW50cyB0byBhbGwgcmVjaXBpZW50cwogICAgLy8gZm9yIGkgaW4gdXJhbmdlKHJlY2lwaWVudHMubGVuZ3RoKToKICAgIGludGNfMCAvLyAwCgpzcGxpdF9lcXVhbF9mb3JfaGVhZGVyQDI6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjcxLTcyCiAgICAvLyAjIFNlbmQgZXF1YWwgYW1vdW50cyB0byBhbGwgcmVjaXBpZW50cwogICAgLy8gZm9yIGkgaW4gdXJhbmdlKHJlY2lwaWVudHMubGVuZ3RoKToKICAgIGR1cAogICAgZGlnIDQKICAgIDwKICAgIGJ6IHNwbGl0X2VxdWFsX2FmdGVyX2ZvckA4CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5Ojc0LTc1CiAgICAvLyAjIEdpdmUgcmVtYWluZGVyIHRvIGZpcnN0IHJlY2lwaWVudAogICAgLy8gaWYgaSA9PSBVSW50NjQoMCk6CiAgICBkdXAKICAgIGJ6IHNwbGl0X2VxdWFsX2lmX2JvZHlANAogICAgZGlnIDIKCnNwbGl0X2VxdWFsX2FmdGVyX2lmX2Vsc2VANToKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NzgtODIKICAgIC8vIGl0eG4uQXNzZXRUcmFuc2ZlcigKICAgIC8vICAgICB4ZmVyX2Fzc2V0PUFzc2V0KHNlbGYudXNkY19hc3NldF9pZC52YWx1ZSksCiAgICAvLyAgICAgYXNzZXRfcmVjZWl2ZXI9cmVjaXBpZW50c1tpXS5uYXRpdmUsCiAgICAvLyAgICAgYXNzZXRfYW1vdW50PWFtb3VudCwKICAgIC8vICkuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NzkKICAgIC8vIHhmZXJfYXNzZXQ9QXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18xIC8vICJ1c2RjX2Fzc2V0X2lkIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLnVzZGNfYXNzZXRfaWQgZXhpc3RzCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjgwCiAgICAvLyBhc3NldF9yZWNlaXZlcj1yZWNpcGllbnRzW2ldLm5hdGl2ZSwKICAgIGRpZyA2CiAgICBleHRyYWN0IDIgMAogICAgZGlnIDMKICAgIGR1cAogICAgY292ZXIgMwogICAgaW50Y18yIC8vIDMyCiAgICAqCiAgICBpbnRjXzIgLy8gMzIKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5Ojc4CiAgICAvLyBpdHhuLkFzc2V0VHJhbnNmZXIoCiAgICBwdXNoaW50IDQgLy8gYXhmZXIKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTo3OC04MgogICAgLy8gaXR4bi5Bc3NldFRyYW5zZmVyKAogICAgLy8gICAgIHhmZXJfYXNzZXQ9QXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwKICAgIC8vICAgICBhc3NldF9yZWNlaXZlcj1yZWNpcGllbnRzW2ldLm5hdGl2ZSwKICAgIC8vICAgICBhc3NldF9hbW91bnQ9YW1vdW50LAogICAgLy8gKS5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NzEtNzIKICAgIC8vICMgU2VuZCBlcXVhbCBhbW91bnRzIHRvIGFsbCByZWNpcGllbnRzCiAgICAvLyBmb3IgaSBpbiB1cmFuZ2UocmVjaXBpZW50cy5sZW5ndGgpOgogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ1cnkgMQogICAgYiBzcGxpdF9lcXVhbF9mb3JfaGVhZGVyQDIKCnNwbGl0X2VxdWFsX2lmX2JvZHlANDoKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6NzYKICAgIC8vIGFtb3VudCArPSByZW1haW5kZXIKICAgIGRpZyAyCiAgICBkaWcgMgogICAgKwogICAgYiBzcGxpdF9lcXVhbF9hZnRlcl9pZl9lbHNlQDUKCnNwbGl0X2VxdWFsX2FmdGVyX2ZvckA4OgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTo4NAogICAgLy8gc2VsZi50b3RhbF9zcGxpdHMudmFsdWUgKz0gVUludDY0KDEpCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAidG90YWxfc3BsaXRzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLnRvdGFsX3NwbGl0cyBleGlzdHMKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBieXRlY18wIC8vICJ0b3RhbF9zcGxpdHMiCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTo1NAogICAgLy8gQGFiaW1ldGhvZAogICAgYnl0ZWNfMiAvLyAweDE1MWY3Yzc1ODAKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHBheW91dF9zcGxpdHRlci5jb250cmFjdC5QYXlvdXRTcGxpdHRlci5zcGxpdF9wZXJjZW50YWdlW3JvdXRpbmddKCkgLT4gdm9pZDoKc3BsaXRfcGVyY2VudGFnZToKICAgIHB1c2hieXRlcyAiIgogICAgZHVwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5Ojg3CiAgICAvLyBAYWJpbWV0aG9kCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXBuIDIKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgaW50Y18yIC8vIDMyCiAgICAqCiAgICBwdXNoaW50IDIKICAgICsKICAgIHVuY292ZXIgMgogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBhcmM0LmR5bmFtaWNfYXJyYXk8YXJjNC5zdGF0aWNfYXJyYXk8YXJjNC51aW50OCwgMzI+PgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNiAvLyBvbiBlcnJvcjogaW52YWxpZCBhcnJheSBsZW5ndGggaGVhZGVyCiAgICBkdXAKICAgIGNvdmVyIDMKICAgIGR1cAogICAgaW50Y18zIC8vIDgKICAgICoKICAgIHB1c2hpbnQgMgogICAgKwogICAgdW5jb3ZlciAyCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGFyYzQuZHluYW1pY19hcnJheTxhcmM0LnVpbnQ2ND4KICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBjb3ZlciAzCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBwdXNoaW50IDQgLy8gYXhmZXIKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBheGZlcgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTo5NQogICAgLy8gYXNzZXJ0IHJlY2lwaWVudHMubGVuZ3RoID09IHBlcmNlbnRhZ2VzLmxlbmd0aCwgIkxlbmd0aCBtaXNtYXRjaCIKICAgIGRpZyAyCiAgICB1bmNvdmVyIDIKICAgID09CiAgICBhc3NlcnQgLy8gTGVuZ3RoIG1pc21hdGNoCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5Ojk2CiAgICAvLyBhc3NlcnQgcmVjaXBpZW50cy5sZW5ndGggPiBVSW50NjQoMCksICJObyByZWNpcGllbnRzIgogICAgZGlnIDEKICAgIGFzc2VydCAvLyBObyByZWNpcGllbnRzCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5Ojk3CiAgICAvLyBhc3NlcnQgcmVjaXBpZW50cy5sZW5ndGggPD0gVUludDY0KDE2KSwgIk1heCAxNiByZWNpcGllbnRzIgogICAgc3dhcAogICAgcHVzaGludCAxNgogICAgPD0KICAgIGFzc2VydCAvLyBNYXggMTYgcmVjaXBpZW50cwogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTo5OQogICAgLy8gYXNzZXJ0IHBheW1lbnRfdHhuLmFzc2V0X3JlY2VpdmVyID09IEdsb2JhbC5jdXJyZW50X2FwcGxpY2F0aW9uX2FkZHJlc3MsICJTZW5kIHRvIGNvbnRyYWN0IgogICAgZHVwCiAgICBndHhucyBBc3NldFJlY2VpdmVyCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgPT0KICAgIGFzc2VydCAvLyBTZW5kIHRvIGNvbnRyYWN0CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjEwMAogICAgLy8gYXNzZXJ0IHBheW1lbnRfdHhuLnhmZXJfYXNzZXQgPT0gQXNzZXQoc2VsZi51c2RjX2Fzc2V0X2lkLnZhbHVlKSwgIk11c3QgYmUgVVNEQyIKICAgIGd0eG5zIFhmZXJBc3NldAogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzEgLy8gInVzZGNfYXNzZXRfaWQiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYudXNkY19hc3NldF9pZCBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gTXVzdCBiZSBVU0RDCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjEwMi0xMDMKICAgIC8vICMgVmVyaWZ5IHBlcmNlbnRhZ2VzIHN1bSB0byAxMDAwMCAoMTAwJSkKICAgIC8vIHRvdGFsX3BlcmNlbnRhZ2UgPSBVSW50NjQoMCkKICAgIGludGNfMCAvLyAwCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjEwNAogICAgLy8gZm9yIGkgaW4gdXJhbmdlKHBlcmNlbnRhZ2VzLmxlbmd0aCk6CiAgICBkdXAKCnNwbGl0X3BlcmNlbnRhZ2VfZm9yX2hlYWRlckAyOgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weToxMDQKICAgIC8vIGZvciBpIGluIHVyYW5nZShwZXJjZW50YWdlcy5sZW5ndGgpOgogICAgZHVwCiAgICBkaWcgNAogICAgPAogICAgYnogc3BsaXRfcGVyY2VudGFnZV9hZnRlcl9mb3JANQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weToxMDUKICAgIC8vIHRvdGFsX3BlcmNlbnRhZ2UgKz0gcGVyY2VudGFnZXNbaV0ubmF0aXZlCiAgICBkaWcgNAogICAgZXh0cmFjdCAyIDAKICAgIGRpZyAxCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDMKICAgICsKICAgIGJ1cnkgMwogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weToxMDQKICAgIC8vIGZvciBpIGluIHVyYW5nZShwZXJjZW50YWdlcy5sZW5ndGgpOgogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ1cnkgMQogICAgYiBzcGxpdF9wZXJjZW50YWdlX2Zvcl9oZWFkZXJAMgoKc3BsaXRfcGVyY2VudGFnZV9hZnRlcl9mb3JANToKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MTA2CiAgICAvLyBhc3NlcnQgdG90YWxfcGVyY2VudGFnZSA9PSBVSW50NjQoMTAwMDApLCAiUGVyY2VudGFnZXMgbXVzdCBzdW0gdG8gMTAwJSIKICAgIGRpZyAxCiAgICBwdXNoaW50IDEwMDAwCiAgICA9PQogICAgYXNzZXJ0IC8vIFBlcmNlbnRhZ2VzIG11c3Qgc3VtIHRvIDEwMCUKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MTA4CiAgICAvLyB0b3RhbF9hbW91bnQgPSBwYXltZW50X3R4bi5hc3NldF9hbW91bnQKICAgIGRpZyAyCiAgICBndHhucyBBc3NldEFtb3VudAogICAgYnVyeSA4CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjEwOQogICAgLy8gZGlzdHJpYnV0ZWQgPSBVSW50NjQoMCkKICAgIGludGNfMCAvLyAwCiAgICBidXJ5IDkKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MTExLTExMgogICAgLy8gIyBEaXN0cmlidXRlIGJhc2VkIG9uIHBlcmNlbnRhZ2VzCiAgICAvLyBmb3IgaSBpbiB1cmFuZ2UocmVjaXBpZW50cy5sZW5ndGgpOgogICAgaW50Y18wIC8vIDAKICAgIGJ1cnkgMQoKc3BsaXRfcGVyY2VudGFnZV9mb3JfaGVhZGVyQDY6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjExMS0xMTIKICAgIC8vICMgRGlzdHJpYnV0ZSBiYXNlZCBvbiBwZXJjZW50YWdlcwogICAgLy8gZm9yIGkgaW4gdXJhbmdlKHJlY2lwaWVudHMubGVuZ3RoKToKICAgIGR1cAogICAgZGlnIDYKICAgIDwKICAgIGJ6IHNwbGl0X3BlcmNlbnRhZ2VfYWZ0ZXJfZm9yQDEzCiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjExMwogICAgLy8gaWYgaSA9PSByZWNpcGllbnRzLmxlbmd0aCAtIFVJbnQ2NCgxKToKICAgIGRpZyA1CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZGlnIDEKICAgID09CiAgICBieiBzcGxpdF9wZXJjZW50YWdlX2Vsc2VfYm9keUA5CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjExNC0xMTUKICAgIC8vICMgTGFzdCByZWNpcGllbnQgZ2V0cyByZW1haW5kZXIgdG8gaGFuZGxlIHJvdW5kaW5nCiAgICAvLyBhbW91bnQgPSB0b3RhbF9hbW91bnQgLSBkaXN0cmlidXRlZAogICAgZGlnIDcKICAgIGRpZyA5CiAgICAtCgpzcGxpdF9wZXJjZW50YWdlX2FmdGVyX2lmX2Vsc2VAMTA6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjEyMC0xMjQKICAgIC8vIGl0eG4uQXNzZXRUcmFuc2ZlcigKICAgIC8vICAgICB4ZmVyX2Fzc2V0PUFzc2V0KHNlbGYudXNkY19hc3NldF9pZC52YWx1ZSksCiAgICAvLyAgICAgYXNzZXRfcmVjZWl2ZXI9cmVjaXBpZW50c1tpXS5uYXRpdmUsCiAgICAvLyAgICAgYXNzZXRfYW1vdW50PWFtb3VudCwKICAgIC8vICkuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MTIxCiAgICAvLyB4ZmVyX2Fzc2V0PUFzc2V0KHNlbGYudXNkY19hc3NldF9pZC52YWx1ZSksCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMSAvLyAidXNkY19hc3NldF9pZCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi51c2RjX2Fzc2V0X2lkIGV4aXN0cwogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weToxMjIKICAgIC8vIGFzc2V0X3JlY2VpdmVyPXJlY2lwaWVudHNbaV0ubmF0aXZlLAogICAgZGlnIDgKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMwogICAgZHVwCiAgICBjb3ZlciAzCiAgICBpbnRjXzIgLy8gMzIKICAgICoKICAgIGludGNfMiAvLyAzMgogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICB1bmNvdmVyIDMKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MTIwCiAgICAvLyBpdHhuLkFzc2V0VHJhbnNmZXIoCiAgICBwdXNoaW50IDQgLy8gYXhmZXIKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weToxMjAtMTI0CiAgICAvLyBpdHhuLkFzc2V0VHJhbnNmZXIoCiAgICAvLyAgICAgeGZlcl9hc3NldD1Bc3NldChzZWxmLnVzZGNfYXNzZXRfaWQudmFsdWUpLAogICAgLy8gICAgIGFzc2V0X3JlY2VpdmVyPXJlY2lwaWVudHNbaV0ubmF0aXZlLAogICAgLy8gICAgIGFzc2V0X2Ftb3VudD1hbW91bnQsCiAgICAvLyApLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weToxMTEtMTEyCiAgICAvLyAjIERpc3RyaWJ1dGUgYmFzZWQgb24gcGVyY2VudGFnZXMKICAgIC8vIGZvciBpIGluIHVyYW5nZShyZWNpcGllbnRzLmxlbmd0aCk6CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIHNwbGl0X3BlcmNlbnRhZ2VfZm9yX2hlYWRlckA2CgpzcGxpdF9wZXJjZW50YWdlX2Vsc2VfYm9keUA5OgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weToxMTcKICAgIC8vIGFtb3VudCA9ICh0b3RhbF9hbW91bnQgKiBwZXJjZW50YWdlc1tpXS5uYXRpdmUpIC8vIFVJbnQ2NCgxMDAwMCkKICAgIGRpZyA0CiAgICBleHRyYWN0IDIgMAogICAgZGlnIDEKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDgKICAgICoKICAgIHB1c2hpbnQgMTAwMDAKICAgIC8KICAgIGR1cAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weToxMTgKICAgIC8vIGRpc3RyaWJ1dGVkICs9IGFtb3VudAogICAgZGlnIDEwCiAgICArCiAgICBidXJ5IDEwCiAgICBiIHNwbGl0X3BlcmNlbnRhZ2VfYWZ0ZXJfaWZfZWxzZUAxMAoKc3BsaXRfcGVyY2VudGFnZV9hZnRlcl9mb3JAMTM6CiAgICAvLyBwcm9qZWN0cy9zbWFydF9jb250cmFjdHMvcGF5b3V0X3NwbGl0dGVyL2NvbnRyYWN0LnB5OjEyNgogICAgLy8gc2VsZi50b3RhbF9zcGxpdHMudmFsdWUgKz0gVUludDY0KDEpCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAidG90YWxfc3BsaXRzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLnRvdGFsX3NwbGl0cyBleGlzdHMKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBieXRlY18wIC8vICJ0b3RhbF9zcGxpdHMiCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weTo4NwogICAgLy8gQGFiaW1ldGhvZAogICAgYnl0ZWNfMiAvLyAweDE1MWY3Yzc1ODAKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHBheW91dF9zcGxpdHRlci5jb250cmFjdC5QYXlvdXRTcGxpdHRlci5nZXRfdG90YWxfc3BsaXRzW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0X3RvdGFsX3NwbGl0czoKICAgIC8vIHByb2plY3RzL3NtYXJ0X2NvbnRyYWN0cy9wYXlvdXRfc3BsaXR0ZXIvY29udHJhY3QucHk6MTMyCiAgICAvLyByZXR1cm4gQVJDNFVJbnQ2NChzZWxmLnRvdGFsX3NwbGl0cy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJ0b3RhbF9zcGxpdHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYudG90YWxfc3BsaXRzIGV4aXN0cwogICAgaXRvYgogICAgLy8gcHJvamVjdHMvc21hcnRfY29udHJhY3RzL3BheW91dF9zcGxpdHRlci9jb250cmFjdC5weToxMjkKICAgIC8vIEBhYmltZXRob2QocmVhZG9ubHk9VHJ1ZSkKICAgIHB1c2hieXRlcyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuY2xlYXJfc3RhdGVfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIHB1c2hpbnQgMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAEgCCYDDHRvdGFsX3NwbGl0cw11c2RjX2Fzc2V0X2lkBRUffHWAMRkURDEYQQAkggQEns3TZwRwhuSIBHKolLsEIxDqPjYaAI4EADIA+gGKAoAAgATAtkNSNhoAjgEAAQA2GgFJFSQSRDYaAkkVJRJEF4AFYWRtaW5PAmcpTGcoImcjQzYaAUcCIllJTgJJJAuBAghPAhUSRDYaAklOAkkiWUklC4ECCE8CFRJEMRYjCUlOA0k4EIEEEkRLAk8CEkRLAURMgRAOREk4FDIKEkQ4ESIpZUQSRCJJSUsFDEEAGUsDVwIASwFJTgIlC1tLAwhFAyMIRQFC/+BLAjgSSwISRCJFAUlLBQxBADOxIillREsGVwIASwJJTgIkCyRYSwZXAgBLAiULW7ISshRMshGBBLIQIrIBsyMIRQFC/8YiKGVEIwgoTGcqsCNDNhoBRwIiWUlOAkkkC4ECCE8CFRJEMRYjCUk4EIEEEkRLAURLAYEQDkRJOBQyChJESTgRIillRBJEOBJJSwIKTgJMGCJJSwQMQQA4SUEALEsCsSIpZURLBlcCAEsDSU4DJAskWE8DshKyFLIRgQSyECKyAbMjCEUBQv/JSwJLAghC/84iKGVEIwgoTGcqsCNDgABJNhoBRwIiWUlOAkkkC4ECCE8CFRJENhoCSU4CSSJZSU4DSSULgQIITwIVEkQxFiMJSU4DSTgQgQQSREsCTwISREsBREyBEA5ESTgUMgoSRDgRIillRBJEIklJSwQMQQAZSwRXAgBLAUlOAiULW0sDCEUDIwhFAUL/4EsBgZBOEkRLAjgSRQgiRQkiRQFJSwYMQQBTSwUjCUsBEkEAL0sHSwkJsSIpZURLCFcCAEsDSU4DJAskWE8DshKyFLIRgQSyECKyAbMjCEUBQv/ASwRXAgBLASULW0sIC4GQTgpJSwoIRQpC/7wiKGVEIwgoTGcqsCNDIihlRBaABBUffHVMULAjQw==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the PayoutSplitter smart contract
 */
class PayoutSplitterParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(address,uint64)void':
                        return PayoutSplitterParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the PayoutSplitter smart contract using the create(address,uint64)void ABI method
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
     * Constructs a no op call for the split_payment(address[],uint64[],axfer)bool ABI method
     *
     * Split USDC payment across multiple recipients in atomic group.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static splitPayment(params) {
        return {
            ...params,
            method: 'split_payment(address[],uint64[],axfer)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.recipients, params.args.amounts, params.args.paymentTxn],
        };
    }
    /**
     * Constructs a no op call for the split_equal(address[],axfer)bool ABI method
     *
     * Split USDC payment equally across recipients.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static splitEqual(params) {
        return {
            ...params,
            method: 'split_equal(address[],axfer)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.recipients, params.args.paymentTxn],
        };
    }
    /**
     * Constructs a no op call for the split_percentage(address[],uint64[],axfer)bool ABI method
     *
     * Split USDC by percentage (basis points: 10000 = 100%).
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static splitPercentage(params) {
        return {
            ...params,
            method: 'split_percentage(address[],uint64[],axfer)bool',
            args: Array.isArray(params.args) ? params.args : [params.args.recipients, params.args.percentages, params.args.paymentTxn],
        };
    }
    /**
     * Constructs a no op call for the get_total_splits()uint64 ABI method
     *
     * Get total number of splits executed.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getTotalSplits(params) {
        return {
            ...params,
            method: 'get_total_splits()uint64',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
}
exports.PayoutSplitterParamsFactory = PayoutSplitterParamsFactory;
/**
 * A factory to create and deploy one or more instance of the PayoutSplitter smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class PayoutSplitterFactory {
    /**
     * The underlying `AppFactory` for when you want to have more flexibility
     */
    appFactory;
    /**
     * Creates a new instance of `PayoutSplitterFactory`
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
        return new PayoutSplitterClient(this.appFactory.getAppClientById(params));
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
        return new PayoutSplitterClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the PayoutSplitter smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? PayoutSplitterParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new PayoutSplitterClient(result.appClient) };
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
             * Creates a new instance of the PayoutSplitter smart contract using the create(address,uint64)void ABI method.
             *
             * Initialize with admin and USDC ASA ID.
             *
             * @param params The params for the smart contract call
             * @returns The create params
             */
            create: (params) => {
                return this.appFactory.params.create(PayoutSplitterParamsFactory.create.create(params));
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
             * Creates a new instance of the PayoutSplitter smart contract using the create(address,uint64)void ABI method.
             *
             * Initialize with admin and USDC ASA ID.
             *
             * @param params The params for the smart contract call
             * @returns The create transaction
             */
            create: (params) => {
                return this.appFactory.createTransaction.create(PayoutSplitterParamsFactory.create.create(params));
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
             * Creates a new instance of the PayoutSplitter smart contract using an ABI method call using the create(address,uint64)void ABI method.
             *
             * Initialize with admin and USDC ASA ID.
             *
             * @param params The params for the smart contract call
             * @returns The create result
             */
            create: async (params) => {
                const result = await this.appFactory.send.create(PayoutSplitterParamsFactory.create.create(params));
                return { result: { ...result.result, return: result.result.return }, appClient: new PayoutSplitterClient(result.appClient) };
            },
        },
    };
}
exports.PayoutSplitterFactory = PayoutSplitterFactory;
/**
 * A client to make calls to the PayoutSplitter smart contract
 */
class PayoutSplitterClient {
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
     * Returns a new `PayoutSplitterClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new PayoutSplitterClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `PayoutSplitterClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new PayoutSplitterClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
         * Makes a clear_state call to an existing instance of the PayoutSplitter smart contract.
         *
         * @param params The params for the bare (raw) call
         * @returns The clearState result
         */
        clearState: (params) => {
            return this.appClient.params.bare.clearState(params);
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `split_payment(address[],uint64[],axfer)bool` ABI method.
         *
         * Split USDC payment across multiple recipients in atomic group.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        splitPayment: (params) => {
            return this.appClient.params.call(PayoutSplitterParamsFactory.splitPayment(params));
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `split_equal(address[],axfer)bool` ABI method.
         *
         * Split USDC payment equally across recipients.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        splitEqual: (params) => {
            return this.appClient.params.call(PayoutSplitterParamsFactory.splitEqual(params));
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `split_percentage(address[],uint64[],axfer)bool` ABI method.
         *
         * Split USDC by percentage (basis points: 10000 = 100%).
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        splitPercentage: (params) => {
            return this.appClient.params.call(PayoutSplitterParamsFactory.splitPercentage(params));
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `get_total_splits()uint64` ABI method.
         *
         * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
         *
         * Get total number of splits executed.
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
        getTotalSplits: (params = { args: [] }) => {
            return this.appClient.params.call(PayoutSplitterParamsFactory.getTotalSplits(params));
        },
    };
    /**
     * Create transactions for the current app
     */
    createTransaction = {
        /**
         * Makes a clear_state call to an existing instance of the PayoutSplitter smart contract.
         *
         * @param params The params for the bare (raw) call
         * @returns The clearState result
         */
        clearState: (params) => {
            return this.appClient.createTransaction.bare.clearState(params);
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `split_payment(address[],uint64[],axfer)bool` ABI method.
         *
         * Split USDC payment across multiple recipients in atomic group.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        splitPayment: (params) => {
            return this.appClient.createTransaction.call(PayoutSplitterParamsFactory.splitPayment(params));
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `split_equal(address[],axfer)bool` ABI method.
         *
         * Split USDC payment equally across recipients.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        splitEqual: (params) => {
            return this.appClient.createTransaction.call(PayoutSplitterParamsFactory.splitEqual(params));
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `split_percentage(address[],uint64[],axfer)bool` ABI method.
         *
         * Split USDC by percentage (basis points: 10000 = 100%).
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        splitPercentage: (params) => {
            return this.appClient.createTransaction.call(PayoutSplitterParamsFactory.splitPercentage(params));
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `get_total_splits()uint64` ABI method.
         *
         * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
         *
         * Get total number of splits executed.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        getTotalSplits: (params = { args: [] }) => {
            return this.appClient.createTransaction.call(PayoutSplitterParamsFactory.getTotalSplits(params));
        },
    };
    /**
     * Send calls to the current app
     */
    send = {
        /**
         * Makes a clear_state call to an existing instance of the PayoutSplitter smart contract.
         *
         * @param params The params for the bare (raw) call
         * @returns The clearState result
         */
        clearState: (params) => {
            return this.appClient.send.bare.clearState(params);
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `split_payment(address[],uint64[],axfer)bool` ABI method.
         *
         * Split USDC payment across multiple recipients in atomic group.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        splitPayment: async (params) => {
            const result = await this.appClient.send.call(PayoutSplitterParamsFactory.splitPayment(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `split_equal(address[],axfer)bool` ABI method.
         *
         * Split USDC payment equally across recipients.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        splitEqual: async (params) => {
            const result = await this.appClient.send.call(PayoutSplitterParamsFactory.splitEqual(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `split_percentage(address[],uint64[],axfer)bool` ABI method.
         *
         * Split USDC by percentage (basis points: 10000 = 100%).
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        splitPercentage: async (params) => {
            const result = await this.appClient.send.call(PayoutSplitterParamsFactory.splitPercentage(params));
            return { ...result, return: result.return };
        },
        /**
         * Makes a call to the PayoutSplitter smart contract using the `get_total_splits()uint64` ABI method.
         *
         * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
         *
         * Get total number of splits executed.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        getTotalSplits: async (params = { args: [] }) => {
            const result = await this.appClient.send.call(PayoutSplitterParamsFactory.getTotalSplits(params));
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
        return new PayoutSplitterClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the PayoutSplitter smart contract using the `get_total_splits()uint64` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Get total number of splits executed.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getTotalSplits(params = { args: [] }) {
        const result = await this.appClient.send.call(PayoutSplitterParamsFactory.getTotalSplits(params));
        return result.return;
    }
    /**
     * Methods to access state for the current PayoutSplitter app
     */
    state = {
        /**
         * Methods to access global state for the current PayoutSplitter app
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
                    totalSplits: result.total_splits,
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
             * Get the current value of the total_splits key in global state
             */
            totalSplits: async () => { return (await this.appClient.state.global.getValue("total_splits")); },
        },
    };
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a split_payment(address[],uint64[],axfer)bool method call against the PayoutSplitter contract
             */
            splitPayment(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.splitPayment(params)));
                resultMappers.push((v) => client.decodeReturnValue('split_payment(address[],uint64[],axfer)bool', v));
                return this;
            },
            /**
             * Add a split_equal(address[],axfer)bool method call against the PayoutSplitter contract
             */
            splitEqual(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.splitEqual(params)));
                resultMappers.push((v) => client.decodeReturnValue('split_equal(address[],axfer)bool', v));
                return this;
            },
            /**
             * Add a split_percentage(address[],uint64[],axfer)bool method call against the PayoutSplitter contract
             */
            splitPercentage(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.splitPercentage(params)));
                resultMappers.push((v) => client.decodeReturnValue('split_percentage(address[],uint64[],axfer)bool', v));
                return this;
            },
            /**
             * Add a get_total_splits()uint64 method call against the PayoutSplitter contract
             */
            getTotalSplits(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getTotalSplits(params)));
                resultMappers.push((v) => client.decodeReturnValue('get_total_splits()uint64', v));
                return this;
            },
            /**
             * Add a clear state call to the PayoutSplitter contract
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
exports.PayoutSplitterClient = PayoutSplitterClient;
