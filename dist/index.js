"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WolfBot_1 = __importDefault(require("./bot/WolfBot"));
const bot = new WolfBot_1.default();
bot.start();
