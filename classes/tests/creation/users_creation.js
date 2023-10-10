import { container, TYPES } from "../../../dependency_injection_config.js";

try {
    const UserCreator = container.get(TYPES.UserCreator);

    UserCreator.pre();
    await UserCreator.process();
    UserCreator.post();
} catch (err) { console.log(err); }