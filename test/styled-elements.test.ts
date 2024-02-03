/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { styled, classed, addStyle, createWith } from "../index"

function style() {
  return document.getElementById("styled-elements") as HTMLStyleElement
}

function firstRule() {
  return style()?.sheet?.cssRules[0]?.cssText
}

afterEach(()=>{
  const sheet = style()?.sheet
  if (sheet === null) return
  while (sheet.cssRules.length > 0) {
    sheet.deleteRule(0)
  }
})

test("automatically adds a <style> to document head", () => {
  classed("ignored-class", "div")``
  expect(style()).not.toBeNull()
})

test("styled", () => {
  const div = styled("div")`border: none;`
  expect(div().className).toBe("div1")
  expect(firstRule()).toBe(".div1 {border: none;}")
})

test("classed", () => {
  const a = classed("navi", "a")`text-decoration: none;`
  expect(a().className).toBe("navi")
  expect(firstRule()).toBe(".navi {text-decoration: none;}")
  expect(() => { classed("navi", "button")`font-weight: bold;` }).toThrow("Duplicate class: navi")
})

test("addStyle", () => {
  addStyle("body")`background: black`
  expect(firstRule()).toBe("body {background: black;}")
})

test("attributes", () => {
  const input = classed("email", "input", {type:"text", "data-test1":"test1"})`font-color:red`
  const elem = input({type:"email", "data-test2":"test2"})
  expect(elem.getAttribute("type")).toBe("email")
  expect(elem.getAttribute("data-test1")).toBe("test1")
  expect(elem.getAttribute("data-test2")).toBe("test2")
})

test("createWith", () => {
  function create<K extends keyof HTMLElementTagNameMap>(tag:K, elements:Record<string,string|undefined>) {
    const result = document.createElement(tag)
    result.id = "foo"
    return result
  }
  createWith(create)
  const span = styled("span")``()
  expect(span.id).toBe("foo")
})