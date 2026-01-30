import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

function Dashboard({ videos, loading, error, onRefresh }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (err) {
      console.error('获取统计信息失败:', err)
    }
  }

  const getStatusText = (status) => {
    const statusMap = {
      'watching': '观看中',
      'completed': '已看完',
      'planned': '计划观看'
    }
    return statusMap[status] || status
  }

  const getTypeIcon = (type) => {
    const iconMap = {
      '电视剧': '📺',
      '电影': '🎬',
      '动漫': '🎨'
    }
    return iconMap[type] || '📹'
  }

  if (loading && !stats) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>仪表盘</h1>
        <button onClick={() => { onRefresh(); fetchStats() }} className="refresh-btn">
          刷新
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">总视频数</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">▶️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.watching}</div>
              <div className="stat-label">观看中</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">已看完</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{stats.planned}</div>
              <div className="stat-label">计划观看</div>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="type-stats">
          <h2>分类统计</h2>
          <div className="type-stats-grid">
            <div className="type-stat-card">
              <span className="type-icon">📺</span>
              <span className="type-label">电视剧</span>
              <span className="type-value">{stats.by_type['电视剧']}</span>
            </div>
            <div className="type-stat-card">
              <span className="type-icon">🎬</span>
              <span className="type-label">电影</span>
              <span className="type-value">{stats.by_type['电影']}</span>
            </div>
            <div className="type-stat-card">
              <span className="type-icon">🎨</span>
              <span className="type-label">动漫</span>
              <span className="type-value">{stats.by_type['动漫']}</span>
            </div>
          </div>
        </div>
      )}

      <div className="recent-videos">
        <h2>最近添加</h2>
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : videos.length === 0 ? (
          <div className="empty-state">
            <p>还没有视频资源</p>
            <Link to="/videos/new" className="btn btn-primary">
              添加第一个视频
            </Link>
          </div>
        ) : (
          <div className="video-grid">
            {videos.slice(0, 6).map(video => (
              <Link 
                key={video.id} 
                to={`/videos/${video.id}`}
                className="video-card"
              >
                <div className="video-poster">
                  {video.poster_url ? (
                    <img src={video.poster_url} alt={video.title} />
                  ) : (
                    <div className="video-poster-placeholder">
                      {getTypeIcon(video.type)}
                    </div>
                  )}
                  <div className="video-rating">⭐ {video.rating}</div>
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <div className="video-meta">
                    <span className="video-type">{video.type}</span>
                    <span className="video-year">{video.year}</span>
                  </div>
                  <div className="video-status">
                    <span className={`status-badge status-${video.status}`}>
                      {getStatusText(video.status)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
