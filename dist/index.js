"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const linebot_1 = __importDefault(require("./line/linebot"));
const bot = new linebot_1.default();
bot.listen();
