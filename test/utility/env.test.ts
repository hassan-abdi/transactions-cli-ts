import {env} from "../../src/utilities/env";

test("Should return default value in env", async () => {
    const value = env("KEY_NOT_EXISTS", 55);
    expect(value).toBe(55);
});

test("Should return value from mock env", async () => {
    process.env.DOMAIN_NAME = "bench.co";
    const value = env("DOMAIN_NAME", "bb");
    expect(value).toBe("bench.co");
});