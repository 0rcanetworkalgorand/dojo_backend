"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipientRole = exports.CommitmentStatus = exports.TaskState = exports.AgentStatus = exports.LaneType = void 0;
var LaneType;
(function (LaneType) {
    LaneType["RESEARCH"] = "RESEARCH";
    LaneType["CODE"] = "CODE";
    LaneType["DATA"] = "DATA";
    LaneType["OUTREACH"] = "OUTREACH";
})(LaneType || (exports.LaneType = LaneType = {}));
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["INACTIVE"] = "INACTIVE";
    AgentStatus["ACTIVE"] = "ACTIVE";
    AgentStatus["LISTED"] = "LISTED";
    AgentStatus["SUSPENDED"] = "SUSPENDED";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));
var TaskState;
(function (TaskState) {
    TaskState["CREATED"] = "CREATED";
    TaskState["LOCKED"] = "LOCKED";
    TaskState["SUBMITTED"] = "SUBMITTED";
    TaskState["VERIFIED"] = "VERIFIED";
    TaskState["SETTLED"] = "SETTLED";
    TaskState["SLASHED"] = "SLASHED";
})(TaskState || (exports.TaskState = TaskState = {}));
var CommitmentStatus;
(function (CommitmentStatus) {
    CommitmentStatus["ACTIVE"] = "ACTIVE";
    CommitmentStatus["RELEASED_CLEAN"] = "RELEASED_CLEAN";
    CommitmentStatus["RELEASED_EARLY"] = "RELEASED_EARLY";
    CommitmentStatus["EXPIRED"] = "EXPIRED";
})(CommitmentStatus || (exports.CommitmentStatus = CommitmentStatus = {}));
var RecipientRole;
(function (RecipientRole) {
    RecipientRole["WORKER"] = "WORKER";
    RecipientRole["COLLABORATOR"] = "COLLABORATOR";
    RecipientRole["SENSEI"] = "SENSEI";
    RecipientRole["TREASURY"] = "TREASURY";
})(RecipientRole || (exports.RecipientRole = RecipientRole = {}));
