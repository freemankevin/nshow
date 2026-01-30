import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './VideoDetail.css'

function VideoDetail({ onUpdate, onDelete, onUpdateProgress }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchVideo()
  }, [id])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/videos/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setVideo(data.data)
        setFormData(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('获取视频详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onUpdate(id, formData)
      setEditing(false)
      await fetchVideo()
    } catch (err) {
      alert('更新失败: ' + err.message)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个视频吗？')) {
      try {
        await onDelete(id)
        navigate('/videos')
      } catch (err) {
        alert('删除失败: ' + err.message)
      }
    }
  }

  const handleProgressUpdate = async (episode) => {
    try {
      await onUpdateProgress(id, episode)
      await fetchVideo()
    } catch (err) {
      alert('更新进度失败: ' + err.message)
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

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!video) {
    return <div className="error">视频不存在</div>
  }

  return (
    <div className="video-detail">
      <div className="detail-header">
        <Link to="/videos" className="back-link">
          ← 返回列表
        </Link>
        <div className="detail-actions">
          <button 
            onClick={() => setEditing(!editing)}
            className="btn btn-secondary"
          >
            {editing ? '取消编辑' : '编辑'}
          </button>
          <button 
            onClick={handleDelete}
            className="btn btn-danger"
          >
            删除
          </button>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>标题:</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>类型:</label>
              <select
                name="type"
                value={formData.type || ''}
                onChange={handleInputChange}
                required
              >
                <option value="电视剧">电视剧</option>
                <option value="电影">电影</option>
                <option value="动漫">动漫</option>
              </select>
            </div>

            <div className="form-group">
              <label>年份:</label>
              <input
                type="number"
                name="year"
                value={formData.year || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>分类:</label>
            <input
              type="text"
              name="genre"
              value={formData.genre || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>导演:</label>
            <input
              type="text"
              name="director"
              value={formData.director || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>演员:</label>
            <input
              type="text"
              name="actors"
              value={formData.actors || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>评分:</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="rating"
                value={formData.rating || 0}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>总集数:</label>
              <input
                type="number"
                min="1"
                name="episodes"
                value={formData.episodes || 1}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>状态:</label>
            <select
              name="status"
              value={formData.status || 'planned'}
              onChange={handleInputChange}
            >
              <option value="planned">计划观看</option>
              <option value="watching">观看中</option>
              <option value="completed">已看完</option>
            </select>
          </div>

          <div className="form-group">
            <label>海报URL:</label>
            <input
              type="text"
              name="poster_url"
              value={formData.poster_url || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>视频URL:</label>
            <input
              type="text"
              name="video_url"
              value={formData.video_url || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>简介:</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              保存更改
            </button>
            <button 
              type="button" 
              onClick={() => setEditing(false)}
              className="btn btn-secondary"
            >
              取消
            </button>
          </div>
        </form>
      ) : (
        <div className="detail-content">
          <div className="detail-poster">
            {video.poster_url ? (
              <img src={video.poster_url} alt={video.title} />
            ) : (
              <div className="poster-placeholder">
                {getTypeIcon(video.type)}
              </div>
            )}
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{video.title}</h1>
            
            <div className="detail-meta">
              <span className="detail-type">{getTypeIcon(video.type)} {video.type}</span>
              <span className="detail-year">{video.year}</span>
              <span className="detail-rating">⭐ {video.rating}</span>
              <span className={`detail-status status-${video.status}`}>
                {getStatusText(video.status)}
              </span>
            </div>

            {video.genre && (
              <div className="detail-genre">
                <strong>分类:</strong> {video.genre}
              </div>
            )}

            {video.director && (
              <div className="detail-director">
                <strong>导演:</strong> {video.director}
              </div>
            )}

            {video.actors && (
              <div className="detail-actors">
                <strong>演员:</strong> {video.actors}
              </div>
            )}

            {video.description && (
              <div className="detail-description">
                <strong>简介:</strong>
                <p>{video.description}</p>
              </div>
            )}

            {video.video_url && (
              <div className="detail-video-url">
                <strong>视频链接:</strong>
                <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                  {video.video_url}
                </a>
              </div>
            )}

            {video.episodes > 1 && (
              <div className="detail-progress">
                <h3>观看进度</h3>
                <div className="progress-info">
                  <span>当前: {video.current_episode} / {video.episodes} 集</span>
                </div>
                <div className="progress-controls">
                  {video.current_episode > 1 && (
                    <button 
                      onClick={() => handleProgressUpdate(video.current_episode - 1)}
                      className="btn btn-secondary"
                    >
                      上一集
                    </button>
                  )}
                  {video.current_episode < video.episodes && (
                    <button 
                      onClick={() => handleProgressUpdate(video.current_episode + 1)}
                      className="btn btn-primary"
                    >
                      下一集
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoDetail
