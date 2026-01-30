import os
from models import db, Video
from app import app


def init_db():
    """初始化数据库"""
    with app.app_context():
        db.create_all()
        print("数据库表创建成功！")
        
        # 添加一些示例数据
        if not Video.query.first():
            sample_videos = [
                Video(
                    title='庆余年',
                    type='电视剧',
                    genre='古装/剧情',
                    year=2019,
                    director='孙皓',
                    actors='张若昀, 李沁, 陈道明',
                    description='范闲作为庆国户部尚书范建的养子，从小在澹州长大。在得知自己的身世后，他带着对身世的疑惑和对未来的憧憬，前往京都。',
                    poster_url='',
                    video_url='',
                    rating=8.5,
                    episodes=46,
                    current_episode=1,
                    status='watching'
                ),
                Video(
                    title='流浪地球2',
                    type='电影',
                    genre='科幻/灾难',
                    year=2023,
                    director='郭帆',
                    actors='吴京, 刘德华, 李雪健',
                    description='太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出。',
                    poster_url='',
                    video_url='',
                    rating=8.0,
                    episodes=1,
                    current_episode=1,
                    status='completed'
                ),
                Video(
                    title='鬼灭之刃',
                    type='动漫',
                    genre='热血/奇幻',
                    year=2019,
                    director='外崎春雄',
                    actors='花江夏树, 佐藤聡美',
                    description='大正时期，日本。卖炭少年灶门炭治郎，他的平凡而纯朴的日常生活，在家人被恶鬼袭击的那一天发生了剧变。',
                    poster_url='',
                    video_url='',
                    rating=9.0,
                    episodes=26,
                    current_episode=1,
                    status='planned'
                ),
                Video(
                    title='三体',
                    type='电视剧',
                    genre='科幻/悬疑',
                    year=2023,
                    director='杨磊',
                    actors='张鲁一, 于和伟, 陈瑾',
                    description='地球文明向宇宙发出的第一声啼鸣，以太阳为中心，以光速向宇宙深处飞驰……',
                    poster_url='',
                    video_url='',
                    rating=8.5,
                    episodes=30,
                    current_episode=1,
                    status='watching'
                ),
                Video(
                    title='灌篮高手',
                    type='动漫',
                    genre='热血/运动',
                    year=1993,
                    director='井上雄彦',
                    actors='草尾毅, 绿川光',
                    description='湘北高中篮球队，一支曾经辉煌但如今没落的队伍。新入学的樱木花道，一个完全不懂篮球的门外汉，却意外加入了这支队伍。',
                    poster_url='',
                    video_url='',
                    rating=9.5,
                    episodes=101,
                    current_episode=1,
                    status='planned'
                )
            ]
            
            for video in sample_videos:
                db.session.add(video)
            
            db.session.commit()
            print("示例数据添加成功！")


if __name__ == '__main__':
    init_db()
