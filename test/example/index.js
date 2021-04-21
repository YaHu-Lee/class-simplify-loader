import React from 'react'
import ReactDOM from 'react-dom'

import "./index.less"
import C from "./c.js"
export default function App() {
  const a = true
  return (
    <div className="index">
      <C/>
    </div>
  )
}
ReactDOM.render(React.createElement(App), document.querySelector("#root"))