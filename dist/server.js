"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const basic_ftp_1 = require("basic-ftp");
require("dotenv/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fileName = (_a = req.body) === null || _a === void 0 ? void 0 : _a.fileName;
    if (!fileName) {
        return res.status(400).send();
    }
    try {
        yield downloadFile(fileName, res);
        console.log('1');
    }
    catch (error) {
        return res.sendStatus(500);
    }
}));
function downloadFile(fileName, writeStream) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new basic_ftp_1.Client();
        try {
            yield client.access({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD,
            });
            yield client.downloadTo(writeStream, fileName);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
        client.close();
    });
}
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
