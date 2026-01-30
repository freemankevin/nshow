from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Video(db.Model):
    """视频资源模型"""
    __tablename__ = 'videos'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, comment='标题')
    type = db.Column(db.String(50), nullable=False, comment='类型：电视剧/电影/动漫')
    genre = db.Column(db.String(100), comment='类型/分类')
    year = db.Column(db.Integer, comment='年份')
    director = db.Column(db.String(100), comment='导演')
    actors = db.Column(db.Text, comment='演员')
    description = db.Column(db.Text, comment='简介')
    poster_url = db.Column(db.String(500), comment='海报URL')
    video_url = db.Column(db.String(500), comment='视频URL')
    rating = db.Column(db.Float, default=0.0, comment='评分')
    episodes = db.Column(db.Integer, default=1, comment='集数')
    current_episode = db.Column(db.Integer, default=1, comment='当前观看集数')
    status = db.Column(db.String(20), default='watching', comment='状态：watching/completed/planned')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, comment='创建时间')
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, comment='更新时间')
    
    def to_dict(self):
        """转换为字典"""
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'genre': self.genre,
            'year': self.year,
            'director': self.director,
            'actors': self.actors,
            'description': self.description,
            'poster_url': self.poster_url,
            'video_url': self.video_url,
            'rating': self.rating,
            'episodes': self.episodes,
            'current_episode': self.current_episode,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Video {self.title}>'
