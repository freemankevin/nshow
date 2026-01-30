import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './VideoList.css'

function VideoList({ videos, loading, error, onRefresh, onDelete }) {
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const filteredVideos = videos.filter(video => {
    const matchesType = !filterType || video.type === filterType
    const matchesStatus = !filterStatus || video.status === filterStatus
    const matchesSearch = !searchTerm || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.director && video.director.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (video.actors && video.actors.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesStatus && matchesSearch
  })

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个视频吗？')) {
      try {
        await onDelete(id)
      } catch (err) {
        alert('删除失败: ' + err.message)
      }
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

  return (
    <div className="video-list">
      <div className="video-list-header">
        <h1>视频列表</h1>
        <button onClick={onRefresh} className="refresh-btn">
          刷新
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>类型:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">全部</option>
            <option value="电视剧">电视剧</option>
            <option value="电影">电影</option>
            <option value="动漫">动漫</option>
          </select>
        </div>

        <div className="filter-group">
          <label>状态:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">全部</option>
            <option value="watching">观看中</option>
            <option value="completed">已看完</option>
            <option value="planned">计划观看</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <label>搜索:</label>
          <input 
            type="text"
            placeholder="搜索标题、导演、演员..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredVideos.length === 0 ? (
        <div className="empty-state">
          <p>没有找到匹配的视频</p>
          <Link to="/videos/new" className="btn btn-primary">
            添加视频
          </Link>
        </div>
      ) : (
        <div className="video-grid">
          {filteredVideos.map(video => (
            <div key={video.id} className="video-card">
              <Link to={`/videos/${video.id}`} className="video-poster">
                {video.poster_url ? (
                  <img src={video.poster_url} alt={video.title} />
                ) : (
                  <div className="video-poster-placeholder">
                    {getTypeIcon(video.type)}
                  </div>
                )}
                <div className="video-rating">⭐ {video.rating}</div>
              </Link>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <div className="video-meta">
                  <span className="video-type">{video.type}</span>
                  <span className="video-year">{video.year}</span>
                </div>
                {video.genre && (
                  <div className="video-genre">{video.genre}</div>
                )}
                <div className="video-status">
                  <span className={`status-badge status-${video.status}`}>
                    {getStatusText(video.status)}
                  </span>
                  {video.episodes > 1 && (
                    <span className="video-episodes">
                      {video.current_episode}/{video.episodes}集
                    </span>
                  )}
                </div>
                <div className="video-actions">
                  <Link 
                    to={`/videos/${video.id}/edit`} 
                    className="btn btn-small btn-secondary"
                  >
                    编辑
                  </Link>
                  <button 
                    onClick={() => handleDelete(video.id)}
                    className="btn btn-small btn-danger"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VideoList
