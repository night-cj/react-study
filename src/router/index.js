import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'

const title = <h4>工单列表</h4>
const servicing = <div>纠正性维修工单页面</div>
const daily = <div>日常运行工单页面</div>
const emergency = <div>安全与防护工单页面</div>
const energy = <div>能源管理工单页面</div>

export default class Navbar extends React.Component {
  render () {
    return (
      <HashRouter>
        <main>
          <nav className="nav">
            <ul className="flex">
              <li>
                <a href="/servicing">纠正性维修</a>
              </li>
              <li>
                <a href="/daily">日常运行</a>
              </li>
              <li>
                <a href="/emergency">安全与防护</a>
              </li>
              <li>
                <a href="/energy">能源管理</a>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="servicing" element={servicing} />
            <Route path="daily" element={daily} />
            <Route path="emergency" element={emergency} />
            <Route path="energy" element={energy} />
          </Routes>
        </main>
      </HashRouter>
    )
  }
}