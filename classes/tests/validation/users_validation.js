import { container, TYPES } from "../../../dependency_injection_config.js";

try {
    const UserValidator = container.get(TYPES.UserValidator);

    await UserValidator.pre();
    await UserValidator.process();
    UserValidator.post();
} catch (err) { console.log(err); }