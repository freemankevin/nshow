import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🎬 NShow
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            仪表盘
          </Link>
          <Link to="/videos" className="nav-link">
            视频列表
          </Link>
          <Link to="/videos/new" className="nav-link nav-link-primary">
            添加视频
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
