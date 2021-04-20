import React from 'react'
import "./index.less"
import C from "./c.js"
export default function App() {
  const a = true
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
      {
        a ? <div></div> : null
      }
    </div>
  )
}