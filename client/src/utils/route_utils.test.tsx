import { stripPath } from './route_utils'
test('strip_path works', () => {
    expect(stripPath("/hello/world")).toEqual("hello/world")
})