"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cross_fetch_1 = require("cross-fetch");
var lodash_1 = require("lodash");
var url = require('url');
var OothClient = /** @class */ (function () {
    function OothClient(_a) {
        var url = _a.url, secondaryAuthMode = _a.secondaryAuthMode, api = _a.api, ws = _a.ws;
        this.listeners = {};
        this.started = false;
        this.oothUrl = url;
        this.secondaryAuthMode = secondaryAuthMode;
        this.api = api;
        this.ws = !!ws;
    }
    OothClient.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var urlParts, protocol, wsUrl, socket;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.started) return [3 /*break*/, 2];
                        this.started = true;
                        return [4 /*yield*/, this.fetchUser()];
                    case 1:
                        _a.sent();
                        if (this.ws && typeof WebSocket !== 'undefined') {
                            urlParts = url.parse(this.oothUrl);
                            protocol = urlParts.protocol === 'https:' ? 'wss' : 'ws';
                            wsUrl = protocol + "://" + urlParts.host + urlParts.path + "/ws/user";
                            socket = new WebSocket(wsUrl);
                            socket.onerror = function (err) { return console.error(err); };
                            socket.onopen = function () { };
                            socket.onclose = function () { };
                            socket.onmessage = function (_a) {
                                var data = _a.data;
                                return _this.setUser(JSON.parse(data).user);
                            };
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.user];
                }
            });
        });
    };
    OothClient.prototype.on = function (eventName, listener) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(listener);
    };
    OothClient.prototype.unsubscribe = function (eventName, listener) {
        if (this.listeners[eventName]) {
            this.listeners[eventName] = this.listeners[eventName].filter(function (l) { return l !== listener; });
        }
    };
    OothClient.prototype.emit = function (eventName, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, listener;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.listeners[eventName]) return [3 /*break*/, 4];
                        _i = 0, _a = this.listeners[eventName];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        listener = _a[_i];
                        return [4 /*yield*/, listener(payload)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OothClient.prototype.authenticate = function (strategy, method, body) {
        return __awaiter(this, void 0, void 0, function () {
            var raw, response, user, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cross_fetch_1.default(this.oothUrl + "/" + strategy + "/" + method, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: body && JSON.stringify(body),
                            credentials: 'include',
                        })];
                    case 1:
                        raw = _a.sent();
                        return [4 /*yield*/, raw.json()];
                    case 2:
                        response = _a.sent();
                        if (response.status === 'error') {
                            throw new Error(response.message);
                        }
                        user = response.user, token = response.token;
                        if (!token) return [3 /*break*/, 5];
                        if (!this.api) return [3 /*break*/, 4];
                        if (!(this.api.primaryAuthMode === 'jwt')) return [3 /*break*/, 4];
                        return [4 /*yield*/, cross_fetch_1.default("" + this.api.url + this.api.loginPath, {
                                method: 'POST',
                                headers: {
                                    Authorization: "JWT " + token,
                                },
                                credentials: 'include',
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (this.secondaryAuthMode === 'jwt' ||
                            (this.api && (this.api.primaryAuthMode === 'jwt' || this.api.secondaryAuthMode === 'jwt'))) {
                            this.token = token;
                        }
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.setUser(user)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    OothClient.prototype.method = function (strategy, method, body, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var actualHeaders, raw, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        actualHeaders = {
                            'Content-Type': 'application/json',
                        };
                        if (headers) {
                            Object.assign(actualHeaders, headers);
                        }
                        if (this.secondaryAuthMode && this.token) {
                            headers.Authorization = "JWT " + this.token;
                        }
                        return [4 /*yield*/, cross_fetch_1.default(this.oothUrl + "/" + strategy + "/" + method, {
                                method: 'POST',
                                headers: actualHeaders,
                                body: body && JSON.stringify(body),
                                credentials: 'include',
                            })];
                    case 1:
                        raw = _a.sent();
                        return [4 /*yield*/, raw.json()];
                    case 2:
                        response = _a.sent();
                        if (response.status === 'error') {
                            throw new Error(response.message);
                        }
                        if (!response.user) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.setUser(response.user)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    OothClient.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cross_fetch_1.default(this.oothUrl + "/session/logout", {
                            method: 'POST',
                            credentials: 'include',
                        })];
                    case 1:
                        _a.sent();
                        if (!(this.api && this.api.primaryAuthMode === 'jwt')) return [3 /*break*/, 3];
                        return [4 /*yield*/, cross_fetch_1.default("" + this.api.url + this.api.logoutPath, {
                                method: 'POST',
                                credentials: 'include',
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.token = undefined;
                        this.setUser(undefined);
                        return [2 /*return*/];
                }
            });
        });
    };
    OothClient.prototype.apiCall = function (path, body, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var actualHeaders, raw, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.api) {
                            throw new Error('No api settings.');
                        }
                        actualHeaders = {
                            'Content-Type': 'application/json',
                        };
                        if (headers) {
                            Object.assign(actualHeaders, headers);
                        }
                        if (this.api.secondaryAuthMode === 'jwt' && this.token) {
                            headers.Authorization = "JWT " + this.token;
                        }
                        return [4 /*yield*/, cross_fetch_1.default("" + this.api.url + path, {
                                method: 'POST',
                                headers: actualHeaders,
                                body: body && JSON.stringify(body),
                            })];
                    case 1:
                        raw = _a.sent();
                        return [4 /*yield*/, raw.json()];
                    case 2:
                        response = _a.sent();
                        if (response.status === 'error') {
                            throw new Error(response.message);
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    OothClient.prototype.fetchUser = function (headers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.method('user', 'user', null, headers)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.user];
                }
            });
        });
    };
    OothClient.prototype.setUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!lodash_1.isEqual(this.user, user)) {
                            this.user = user;
                        }
                        return [4 /*yield*/, this.emit('user', user)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return OothClient;
}());
exports.OothClient = OothClient;