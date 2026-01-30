import React, { useState, useEffect } from 'react'
import VideoCard from './VideoCard'
import VideoModal from './VideoModal'
import './VideoSearch.css'

function VideoSearch() {
  const [query, setQuery] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  
  // 筛选和排序状态
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    sort: 'relevance'
  })

  const pageSize = 8

  // 搜索视频
  const searchVideos = async (page = 1) => {
    if (!query.trim()) {
      setError('请输入搜索关键词')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setCurrentPage(page)
      
      const params = new URLSearchParams({
        q: query,
        page: page,
        page_size: pageSize,
        ...filters
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setVideos(data.data.videos)
        setTotalResults(data.data.total)
        setHasSearched(true)
      } else {
        setError(data.error || '搜索失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 处理搜索提交
  const handleSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    searchVideos(1)
  }

  // 处理筛选变化
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setCurrentPage(1)
    if (hasSearched) {
      searchVideos(1)
    }
  }

  // 打开详情模态框
  const openModal = (video) => {
    setSelectedVideo(video)
  }

  // 关闭模态框
  const closeModal = () => {
    setSelectedVideo(null)
  }

  // 播放视频
  const playVideo = (video) => {
    if (video.play_url) {
      window.open(video.play_url, '_blank')
    } else {
      alert('播放链接不可用')
    }
  }

  // 分页
  const totalPages = Math.ceil(totalResults / pageSize)

  return (
    <div className="video-search">
      <div className="container">
        {/* 顶部导航 */}
        <div className="header">
          <div className="logo">▶ NShow</div>
        </div>

        {/* 搜索区域 */}
        <div className="search-section">
          <form onSubmit={handleSubmit} className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="搜索视频、演员、导演..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button">搜索</button>
          </form>

          {/* 过滤器 */}
          <div className="filters">
            <span className="filter-label">类型:</span>
            <select
              className="filter-select"
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              <option value="">全部</option>
              <option value="action">动作</option>
              <option value="comedy">喜剧</option>
              <option value="drama">剧情</option>
              <option value="horror">恐怖</option>
              <option value="romance">爱情</option>
              <option value="scifi">科幻</option>
            </select>

            <span className="filter-label" style={{ marginLeft: '16px' }}>年份:</span>
            <select
              className="filter-select"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">全部</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </select>

            <span className="filter-label" style={{ marginLeft: '16px' }}>排序:</span>
            <div className="sort-buttons">
              <button
                className={`sort-btn ${filters.sort === 'relevance' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sort', 'relevance')}
              >
                最相关
              </button>
              <button
                className={`sort-btn ${filters.sort === 'newest' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sort', 'newest')}
              >
                最新
              </button>
              <button
                className={`sort-btn ${filters.sort === 'rating' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sort', 'rating')}
              >
                最高评分
              </button>
            </div>
          </div>
        </div>

        {/* 结果统计 */}
        <div className="results-info">
          {hasSearched && (
            <>
              <span>找到 <span className="result-count">{totalResults}</span> 个结果</span>
              {loading && <span className="loading-text">加载中...</span>}
            </>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* 视频网格 */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <div className="loading-text">正在搜索...</div>
          </div>
        ) : videos.length > 0 ? (
          <div className="videos-grid">
            {videos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => openModal(video)}
              />
            ))}
          </div>
        ) : hasSearched && !loading ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">未找到视频</div>
            <div className="empty-text">尝试调整搜索条件或筛选器</div>
          </div>
        ) : null}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="pagination">
            {currentPage > 1 && (
              <button
                className="pagination-btn"
                onClick={() => searchVideos(currentPage - 1)}
              >
                上一页
              </button>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              if (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              ) {
                return (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => searchVideos(page)}
                  >
                    {page}
                  </button>
                )
              } else if (
                page === 2 ||
                page === totalPages - 1
              ) {
                return (
                  <span key={page} style={{ color: 'var(--text-secondary)', lineHeight: '38px' }}>
                    ...
                  </span>
                )
              }
              return null
            })}
            
            {currentPage < totalPages && (
              <button
                className="pagination-btn"
                onClick={() => searchVideos(currentPage + 1)}
              >
                下一页
              </button>
            )}
          </div>
        )}

        {/* 详情模态框 */}
        {selectedVideo && (
          <VideoModal
            video={selectedVideo}
            onClose={closeModal}
            onPlay={() => playVideo(selectedVideo)}
          />
        )}
      </div>
    </div>
  )
}

export default VideoSearch
