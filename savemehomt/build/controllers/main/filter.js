"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const url_1 = require("../url");
const filter = async (req, res) => {
    const { category, part, tool, path } = req.body;
    console.log(part);
    function getfilterData(data, list) {
        const filtering = list.filter(workout => {
            let filter = true;
            if (part) {
                for (let i = 0; i < part.length; i++) {
                    if (!workout.parts.includes(part[i])) {
                        filter = false;
                        break;
                    }
                }
            }
            if (!filter) {
                return false;
            }
            if (workout.category === data) {
                return true;
            }
            else {
                return false;
            }
        });
        if (filtering.length === 0) {
            return res.status(300).send({ data: [], message: 'not found' });
        }
        return res.send({ data: filtering, message: 'ok' });
    }
    function filter(list) {
        if (category) {
            if (category === '맨몸') {
                getfilterData('맨몸', list);
            }
            else if (category === '기구') {
                getfilterData('기구', list);
            }
            else {
                const filtering = list.filter(workout => {
                    return workout.category === '스트레칭';
                });
                res.send({ data: filtering, message: 'ok' });
            }
        }
        else {
            const filtering = list.filter(workout => {
                let filter = false;
                if (part) {
                    for (let i = 0; i < part.length; i++) {
                        if (workout.parts.includes(part[i])) {
                            filter = true;
                            break;
                        }
                    }
                }
                if (!filter) {
                    return false;
                }
                if (tool.length !== 0) {
                    if (workout.tool === tool[0]) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                return true;
            });
            if (category === "" && part.length === 0 && tool.length === 0) {
                return res.send({ data: list, message: 'ok' });
            }
            else if (filtering.length === 0) {
                return res.status(300).send({ data: [], message: 'not found' });
            }
            else {
                return res.send({ data: filtering, message: 'ok' });
            }
        }
    }
    if (path === 'dashboard') {
        try {
            const dashboard = await axios_1.default.get(`${url_1.url.URL}/main`, { headers: { withCredentials: true } });
            const workoutList = dashboard.data.data;
            filter(workoutList);
        }
        catch (err) {
            return res.status(500).send({ message: 'server error' });
        }
    }
    else if (path === 'createroutine') {
        try {
            const accessToken = req.headers.authorization;
            const myWorkouts = await axios_1.default.get(`${url_1.url.URL}/myroutine/myworkout`, {
                headers: {
                    withCredentials: true,
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                }
            });
            const workoutList = myWorkouts.data.data;
            filter(workoutList);
        }
        catch (err) {
            return res.status(500).send({ message: 'server error' });
        }
    }
};
exports.default = filter;
//# sourceMappingURL=filter.js.map