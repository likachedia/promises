import { isFriday } from "date-fns";
import mediator from "./second.js";

console.log("is friday?", isFriday(new Date()));
mediator();