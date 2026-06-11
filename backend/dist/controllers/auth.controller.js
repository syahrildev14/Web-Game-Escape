"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const AuthService = __importStar(require("../services/auth.service"));
const jwt_1 = require("../utils/jwt");
async function register(req, res) {
    const { name, email, password } = req.body;
    try {
        const user = await AuthService.register(name, email, password);
        res.status(201).json({
            message: "Register berhasil",
            user: {
                id: user.id, // ✅ ganti dari _id ke id
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await AuthService.login(email, password);
        const token = (0, jwt_1.signToken)({
            id: user.id, // ✅ ganti dari _id ke id
            name: user.name,
            email: user.email,
        });
        res.json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id, // ✅ ganti dari _id ke id
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
