import React, { useEffect } from 'react'
import './VideoModal.css'

function VideoModal({ video, onClose, onPlay }) {
  useEffect(() => {
    // 禁用背景滚动
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handlePlay = () => {
    onPlay()
    onClose()
  }

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>
        <img className="modal-image" src={video.thumbnail} alt={video.title} />
        <h2 className="modal-title">{video.title}</h2>
        <div className="modal-meta">
          <span>{video.year}年</span>
          <span>{video.genre_name || video.genre}</span>
          <span className="rating">⭐ {video.rating}分</span>
        </div>
        <p className="modal-description">{video.description}</p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-primary" onClick={handlePlay}>
            立即播放
          </button>
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoModal
