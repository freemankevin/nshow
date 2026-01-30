from flask import Flask, jsonify
from flask_cors import CORS
from api.routes import api_bp

# 创建Flask应用
app = Flask(__name__)

# 配置CORS，允许前端跨域访问
CORS(app)

# 注册蓝图
app.register_blueprint(api_bp, url_prefix='/api')


@app.route('/')
def index():
    """根路由"""
    return jsonify({
        'message': 'NShow API - 视频搜索平台',
        'version': '2.0.0',
        'endpoints': {
            'search': '/api/search',
            'video_detail': '/api/video/<id>',
            'play_url': '/api/video/<id>/play'
        }
    })


@app.route('/health')
def health():
    """健康检查"""
    return jsonify({'status': 'healthy'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
