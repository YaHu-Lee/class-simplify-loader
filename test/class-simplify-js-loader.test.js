const loader = require("../class-simplify-js-loader")
const testReactFunctionStr = `
  import React from 'react'
  export default function App() {
    return (
      <div className="a">
        <div className="b">
          <div className="d">
          </div>
        </div>
        <div className="c">
          <div className="e"></div>
          <div className="f"></div>
        </div>
      </div>
    )
  }
`