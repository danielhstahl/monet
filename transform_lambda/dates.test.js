const { awsToUnixFormat } = require("./dates")

it("converts string date to unix", () => {
    expect(awsToUnixFormat("2022-01-25T12:02:43.303Z")).toEqual(1643112163303)
})