import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './VideoForm.css'

function VideoForm({ onSubmit }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: '电视剧',
    genre: '',
    year: '',
    director: '',
    actors: '',
    description: '',
    poster_url: '',
    video_url: '',
    rating: 0,
    episodes: 1,
    current_episode: 1,
    status: 'planned'
  })

  useEffect(() => {
    if (isEdit) {
      fetchVideo()
    }
  }, [id, isEdit])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/videos/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData(data.data)
      } else {
        alert('获取视频信息失败: ' + data.error)
        navigate('/videos')
      }
    } catch (err) {
      alert('获取视频信息失败')
      navigate('/videos')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (isEdit) {
        await onSubmit(id, formData)
      } else {
        await onSubmit(formData)
      }
      navigate('/videos')
    } catch (err) {
      alert(isEdit ? '更新失败: ' + err.message : '创建失败: ' + err.message)
    }
  }

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className="video-form-container">
      <div className="form-header">
        <h1>{isEdit ? '编辑视频' : '添加视频'}</h1>
        <button 
          onClick={() => navigate('/videos')}
          className="btn btn-secondary"
        >
          取消
        </button>
      </div>

      <form onSubmit={handleSubmit} className="video-form">
        <div className="form-section">
          <h2>基本信息</h2>
          
          <div className="form-group">
            <label htmlFor="title">
              标题 <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="请输入视频标题"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">
                类型 <span className="required">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="电视剧">电视剧</option>
                <option value="电影">电影</option>
                <option value="动漫">动漫</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year">年份</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="例如: 2023"
                min="1900"
                max="2100"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="genre">分类</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="例如: 科幻/动作/爱情"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">评分</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="0-10"
              min="0"
              max="10"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>制作信息</h2>
          
          <div className="form-group">
            <label htmlFor="director">导演</label>
            <input
              type="text"
              id="director"
              name="director"
              value={formData.director}
              onChange={handleChange}
              placeholder="请输入导演姓名"
            />
          </div>

          <div className="form-group">
            <label htmlFor="actors">演员</label>
            <input
              type="text"
              id="actors"
              name="actors"
              value={formData.actors}
              onChange={handleChange}
              placeholder="多个演员用逗号分隔"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>观看信息</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="episodes">总集数</label>
              <input
                type="number"
                id="episodes"
                name="episodes"
                value={formData.episodes}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="current_episode">当前集数</label>
              <input
                type="number"
                id="current_episode"
                name="current_episode"
                value={formData.current_episode}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">状态</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="planned">计划观看</option>
              <option value="watching">观看中</option>
              <option value="completed">已看完</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>资源链接</h2>
          
          <div className="form-group">
            <label htmlFor="poster_url">海报URL</label>
            <input
              type="text"
              id="poster_url"
              name="poster_url"
              value={formData.poster_url}
              onChange={handleChange}
              placeholder="请输入海报图片链接"
            />
          </div>

          <div className="form-group">
            <label htmlFor="video_url">视频URL</label>
            <input
              type="text"
              id="video_url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              placeholder="请输入视频播放链接"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>简介</h2>
          
          <div className="form-group">
            <label htmlFor="description">剧情简介</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="请输入视频的剧情简介..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEdit ? '更新视频' : '创建视频'}
          </button>
          <button 
            type="button"
            onClick={() => navigate('/videos')}
            className="btn btn-secondary"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}

export default VideoForm
