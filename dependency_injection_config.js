// Import the Inversify library for implementing dependency injection
import { decorate, injectable, inject, Container } from "inversify";

// Import reflect-metadata as a polyfill
import "reflect-metadata";

//Import elements from differect modules/files
import {
    EntitiesHandler,
    LatencyReportHandler,
    UserValidator,
    UserCreator,
    LatencyReportCreator
} from "./index.js";

// Declare dependencies' type identifiers
export const TYPES = {
    EntitiesHandler: "EntitiesHandler",
    LatencyReportHandler: "LatencyReportHandler",
    UserValidator: "UserValidator",
    UserCreator: "UserCreator",
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
container.bind(TYPES.UserValidator).to(UserValidator);
container.bind(TYPES.UserCreator).to(UserCreator);
container.bind(TYPES.EntitiesHandler).to(EntitiesHandler);
container.bind(TYPES.LatencyReportHandler).to(LatencyReportHandler);
container.bind(TYPES.LatencyReportCreator).to(LatencyReportCreator);

export { container };

