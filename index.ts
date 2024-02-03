const style = document.createElement("style")
style.id = "styled-elements"
document.head.appendChild(style)
const classes = new Set<string>()

class StyleError extends Error {}

type A = Record<string,string|undefined>
type H = HTMLElementTagNameMap
type ElMaker<K extends keyof H> = (attributes?:A)=>H[K]
type CSSMaker<K extends keyof H> = (css:TemplateStringsArray)=>ElMaker<K>

export const available = style.sheet !== null

let create = <K extends keyof H>(tag:K, attrs:A) => {
  const result = document.createElement(tag)
  for (const k in attrs) {
    const v = attrs[k]
    if (v) {
      result.setAttribute(k, v)
    }
  }
  return result
}

export const createWith = (creator:<K extends keyof H>(tag:K, attrs:A)=>H[K]) => {
  create = creator
}

let clazz = 0
export let autoName = (tag:string, baseAttributes:A):string => {
  clazz++
  return tag + clazz
}

export const styled = <K extends keyof H>(tag:K, baseAttributes:A = {}):CSSMaker<K> => {
  return classed(autoName(tag, baseAttributes), tag, baseAttributes)
}

export const classed = <K extends keyof H>(className:string, tag:K, baseAttributes:A = {}):CSSMaker<K> => {
  if (classes.has(className)) {
    throw new StyleError("Duplicate class: " + className)
  }
  classes.add(className)
  return css => {
    const rule = "." + className + " { " + css.join() + "}"
    style.sheet?.insertRule(rule)
    return attributes => {
      const attrs = Object.assign({}, baseAttributes)
      Object.assign(attrs, attributes)
      const result = create(tag, attrs)
      result.classList.add(className)
      return result
    }
  }
}

export const addStyle = (selector:string):(css:TemplateStringsArray)=>void => {
  return css => {
    const rule = selector + " { " + css.join() + "}"
    style.sheet?.insertRule(rule)
  }
}
