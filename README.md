# styled-elements

This is a shameless copy of [styled-components](https://github.com/styled-components/styled-components),
but it creates plain HTMLElement instances instead of React components.

Here's a quick example:

    import { styled } from "styled-elements"
    
    const H1 = styled("h1")`
      font-family: impact;
      font-size: 72pt;
    `
    
    const element = H1()
    element.innerText = "Hello, world!"
    document.body.appendChild(element)

You can also specify attributes in the factory:

    const EmailField = styled("input", {type:"email"})`
      font-family:monospaced;
    `

Or specify them when using the factory to create an element:

    const element = EmailField({id:"email-field"})
