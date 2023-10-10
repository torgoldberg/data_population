import { decorate, injectable, inject, Container } from "inversify";
// Import reflect-metadata as a polyfill
import "reflect-metadata";

import {
    EntitiesHandler,
    UserValidator, 
    UserCreator,
    LatencyReportHandler,
    LatencyReportCreator
} from "./index.js";

// Declare dependencies' type identifiers
export const TYPES = {
    EntitiesHandler: "EntitiesHandler",
    UserValidator: "UserValidator",
    UserCreator: "UserCreator",
    LatencyReportHandler: "LatencyReportParamsHandler",
    LatencyReportCreator: "LatencyReportCreator"
};

// Declare injectables
decorate(injectable(), EntitiesHandler);
decorate(injectable(), UserValidator);
decorate(injectable(), UserCreator);
decorate(injectable(), LatencyReportHandler);
decorate(injectable(), LatencyReportCreator); 

// Declare dependencies
decorate(inject(TYPES.EntitiesHandler), UserValidator, 0);
decorate(inject(TYPES.EntitiesHandler), UserCreator, 0);
decorate(inject(TYPES.LatencyReportHandler), LatencyReportCreator, 0);

// Declare bindings
const container = new Container({ skipBaseClassChecks: true });
container.bind(TYPES.EntitiesHandler).to(EntitiesHandler);
container.bind(TYPES.UserValidator).to(UserValidator);
container.bind(TYPES.UserCreator).to(UserCreator);
container.bind(TYPES.LatencyReportHandler).to(LatencyReportHandler);
container.bind(TYPES.LatencyReportCreator).to(LatencyReportCreator);

export { container };