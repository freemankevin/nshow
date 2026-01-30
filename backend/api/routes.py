from flask import Blueprint, request, jsonify
import requests
import json

api_bp = Blueprint('api', __name__)


# 外部视频网站API配置（示例，需要根据实际API调整）
EXTERNAL_API_BASE_URL = "https://api.example.com/videos"  # 替换为实际的API地址
API_KEY = ""  # 如果需要API密钥


@api_bp.route('/search', methods=['GET'])
def search_videos():
    """搜索视频"""
    try:
        # 获取查询参数
        query = request.args.get('q', '')
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 20))
        genre = request.args.get('genre', '')
        year = request.args.get('year', '')
        sort = request.args.get('sort', 'relevance')
        
        if not query:
            return jsonify({
                'success': False,
                'error': '请输入搜索关键词'
            }), 400
        
        # 调用外部API（这里使用模拟数据，实际使用时替换为真实API调用）
        videos = call_external_api(query, page, page_size, genre, year, sort)
        
        return jsonify({
            'success': True,
            'data': videos,
            'query': query,
            'page': page,
            'page_size': page_size
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/video/<video_id>', methods=['GET'])
def get_video_detail(video_id):
    """获取视频详情"""
    try:
        # 调用外部API获取详情
        detail = call_external_detail_api(video_id)
        
        return jsonify({
            'success': True,
            'data': detail
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/video/<video_id>/play', methods=['GET'])
def get_play_url(video_id):
    """获取视频播放链接"""
    try:
        # 调用外部API获取播放链接
        play_info = call_external_play_api(video_id)
        
        return jsonify({
            'success': True,
            'data': play_info
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def call_external_api(query, page, page_size, genre, year, sort):
    """
    调用外部视频网站API
    这里使用模拟数据，实际使用时需要替换为真实的API调用
    """
    # 模拟数据 - 实际使用时删除这部分，替换为真实的API调用
    mock_videos = [
        {
            'id': 1,
            'title': '星际穿越',
            'genre': 'scifi',
            'genre_name': '科幻',
            'year': 2014,
            'rating': 9.3,
            'views': 128000,
            'duration': '169分钟',
            'description': '一队探险家利用他们新发现的穿越虫洞的能力，试图确保人类的生存。',
            'thumbnail': 'https://via.placeholder.com/300x170?text=Interstellar',
            'play_url': 'https://example.com/play/1'
        },
        {
            'id': 2,
            'title': '盗梦空间',
            'genre': 'scifi',
            'genre_name': '科幻',
            'year': 2010,
            'rating': 8.8,
            'views': 95000,
            'duration': '148分钟',
            'description': '一个专门从事企业间谍活动的thief，他偷取了秘密的创意。',
            'thumbnail': 'https://via.placeholder.com/300x170?text=Inception',
            'play_url': 'https://example.com/play/2'
        },
        {
            'id': 3,
            'title': '黑寡妇',
            'genre': 'action',
            'genre_name': '动作',
            'year': 2021,
            'rating': 6.7,
            'views': 182000,
            'duration': '138分钟',
            'description': '娜塔莎·罗曼诺夫必须面对她作为俄罗斯间谍的过去。',
            'thumbnail': 'https://via.placeholder.com/300x170?text=Black+Widow',
            'play_url': 'https://example.com/play/3'
        },
        {
            'id': 4,
            'title': '怦然心动',
            'genre': 'romance',
            'genre_name': '爱情',
            'year': 2010,
            'rating': 8.0,
            'views': 67000,
            'duration': '100分钟',
            'description': '一个邻家女孩爱上了她最好朋友的兄长。',
            'thumbnail': 'https://via.placeholder.com/300x170?text=Flipped',
            'play_url': 'https://example.com/play/4'
        },
        {
            'id': 5,
            'title': '致命时刻',
            'genre': 'horror',
            'genre_name': '恐怖',
            'year': 2017,
            'rating': 6.4,
            'views': 54000,
            'duration': '112分钟',
            'description': '一群朋友在一座孤立的房子里遭遇恐怖事件。',
            'thumbnail': 'https://via.placeholder.com/300x170?text=Horror+Movie',
            'play_url': 'https://example.com/play/5'
        },
        {
            'id': 6,
            'title': '寄生虫',
            'genre': 'drama',
            'genre_name': '剧情',
            'year': 2019,
            'rating': 8.6,
            'views': 145000,
            'duration': '132分钟',
            'description': '一个贫穷的家族与一个富有的家族之间的黑暗故事。',
            'thumbnail': 'https://via.placeholder.com/300x170?text=Parasite',
            'play_url': 'https://example.com/play/6'
        },
        {
            'id': 7,
            'title': '喜剧之王',
            'genre': 'comedy',
            'genre_name': '喜剧',
            'year': 1999,
            'rating': 8.3,
            'views': 87000,
            'duration': '87分钟',
            'description': '一个有抱负的演员在香港闯荡的搞笑故事。',
            'thumbnail': 'https://via.placeholder.com/300x170?text=Comedy+King',
            'play_url': 'https://example.com/play/7'
        },
        {
            'id': 8,
            'title': '三体',
            'genre': 'scifi',
            'genre_name': '科幻',
            'year': 2023,
            'rating': 7.9,
            'views': 203000,
            'duration': '145分钟',
            'description': '人类与外星文明接触的故事。',
            'thumbnail': 'https://via.placeholder.com/300x170?text=Three+Body',
            'play_url': 'https://example.com/play/8'
        },
    ]
    
    # 应用筛选
    filtered = mock_videos
    if genre:
        filtered = [v for v in filtered if v['genre'] == genre]
    if year:
        filtered = [v for v in filtered if str(v['year']) == year]
    
    # 应用排序
    if sort == 'newest':
        filtered.sort(key=lambda x: x['year'], reverse=True)
    elif sort == 'rating':
        filtered.sort(key=lambda x: x['rating'], reverse=True)
    else:  # relevance
        filtered.sort(key=lambda x: x['views'], reverse=True)
    
    # 分页
    start = (page - 1) * page_size
    end = start + page_size
    page_data = filtered[start:end]
    
    return {
        'videos': page_data,
        'total': len(filtered),
        'page': page,
        'page_size': page_size
    }


def call_external_detail_api(video_id):
    """
    调用外部API获取视频详情
    实际使用时替换为真实的API调用
    """
    # 模拟返回详情
    return {
        'id': video_id,
        'title': '示例视频',
        'description': '这是视频的详细描述...',
        'director': '导演姓名',
        'actors': '演员1, 演员2, 演员3',
        'rating': 8.5,
        'year': 2023,
        'duration': '120分钟',
        'thumbnail': 'https://via.placeholder.com/300x170',
        'play_url': 'https://example.com/play/' + str(video_id)
    }


def call_external_play_api(video_id):
    """
    调用外部API获取播放链接
    实际使用时替换为真实的API调用
    """
    # 模拟返回播放链接
    return {
        'play_url': 'https://example.com/play/' + str(video_id),
        'backup_urls': [
            'https://backup1.example.com/play/' + str(video_id),
            'https://backup2.example.com/play/' + str(video_id)
        ]
    }


# 实际使用时的API调用示例（取消注释并修改）：
"""
def call_external_api(query, page, page_size, genre, year, sort):
    params = {
        'q': query,
        'page': page,
        'page_size': page_size,
        'api_key': API_KEY
    }
    
    if genre:
        params['genre'] = genre
    if year:
        params['year'] = year
    if sort:
        params['sort'] = sort
    
    response = requests.get(EXTERNAL_API_BASE_URL, params=params, timeout=10)
    response.raise_for_status()
    return response.json()
"""
