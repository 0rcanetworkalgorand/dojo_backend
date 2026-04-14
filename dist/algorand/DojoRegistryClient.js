"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DojoRegistryClient = exports.DojoRegistryFactory = exports.DojoRegistryParamsFactory = exports.APP_SPEC = void 0;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "DojoRegistry", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "address", "name": "admin" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "desc": "Initialize the registry with admin address.", "events": [], "recommendations": {} }, { "name": "register_agent", "args": [{ "type": "string", "name": "agent_id" }, { "type": "address", "name": "sensei" }, { "type": "uint64", "name": "lane" }, { "type": "byte[]", "name": "config_hash" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Register a new agent with lane assignment and sealed config hash.", "events": [], "recommendations": {} }, { "name": "list_agent", "args": [{ "type": "string", "name": "agent_id" }, { "type": "uint64", "name": "expiry" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "List agent in marketplace with a specific expiry timestamp.", "events": [], "recommendations": {} }, { "name": "delist_agent", "args": [{ "type": "string", "name": "agent_id" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Remove agent from marketplace.", "events": [], "recommendations": {} }, { "name": "increment_tasks", "args": [{ "type": "string", "name": "agent_id" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Increment cumulative successful task count.", "events": [], "recommendations": {} }, { "name": "increment_tasks_failed", "args": [{ "type": "string", "name": "agent_id" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Increment cumulative failed task count (slashing).", "events": [], "recommendations": {} }, { "name": "update_status", "args": [{ "type": "string", "name": "agent_id" }, { "type": "uint64", "name": "status" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Update agent operational status manually.", "events": [], "recommendations": {} }, { "name": "get_agent", "args": [{ "type": "string", "name": "agent_id" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Retrieve full agent record.", "events": [], "recommendations": {} }], "arcs": [22, 28], "desc": "Master agent identity store tracking lane assignment, status, config hash, task history, and expiry.", "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "admin": { "keyType": "AVMString", "valueType": "address", "key": "YWRtaW4=" }, "total_agents": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dG90YWxfYWdlbnRz" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "", "clear": "" }, "byteCode": { "approval": "", "clear": "" }, "events": [], "templateVariables": {} };
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
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks_failed(string)bool` ABI method.
         *
         * Increment cumulative failed task count.
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
        incrementTasksFailed: (params) => {
            return this.appClient.createTransaction.call(DojoRegistryParamsFactory.incrementTasksFailed(params));
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
        updateStatus: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.updateStatus(params));
            return { ...result, return: result.return };
        },
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
         * Makes a call to the DojoRegistry smart contract using the `increment_tasks_failed(string)bool` ABI method.
         *
         * Increment cumulative failed task count.
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
        incrementTasksFailed: async (params) => {
            const result = await this.appClient.send.call(DojoRegistryParamsFactory.incrementTasksFailed(params));
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
            updateStatus(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateStatus(params)));
                resultMappers.push((v) => client.decodeReturnValue('update_status(string,uint64)bool', v));
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
            listAgent(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.listAgent(params)));
                resultMappers.push((v) => client.decodeReturnValue('list_agent(string,uint64)bool', v));
                return this;
            },
            delistAgent(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.delistAgent(params)));
                resultMappers.push((v) => client.decodeReturnValue('delist_agent(string)bool', v));
                return this;
            },
            incrementTasksFailed(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.incrementTasksFailed(params)));
                resultMappers.push((v) => client.decodeReturnValue('increment_tasks_failed(string)bool', v));
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
