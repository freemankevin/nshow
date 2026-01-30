import React from 'react'
import './VideoCard.css'

function VideoCard({ video, onClick }) {
  return (
    <div className="video-card" onClick={onClick}>
      <div className="video-thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <div className="play-button">▶</div>
        <div className="duration">{video.duration}</div>
      </div>
      <div className="video-info">
        <div className="video-title">{video.title}</div>
        <div className="video-meta">{video.year} · {video.genre_name || video.genre}</div>
        <div className="video-stats">
          <span>👁 {(video.views / 1000).toFixed(0)}K</span>
          <span className="rating">⭐ {video.rating}</span>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
