import json
import httplib2
import os
import re
import sys
YOUTUBE_API_KEY = 'AIzaSyCSmN-Uj01NXTOCB07TDsncDHMe4fL8yRU'

def get_youtube_video_info(video_id):
    h = httplib2.Http('.cache')
    (data, content) = h.request("https://www.googleapis.com/youtube/v3/videos?part=id,snippet,statistics&fields=items(statistics,snippet(publishedAt,title,description,categoryId,tags))&id=%s&key=%s" % (video_id, YOUTUBE_API_KEY), "GET")
    if data["status"] == '200' or data["status"] == '304':
        print ("Finish crawling youtube_id: " + video_id)
        decode_data = json.loads(content.decode('utf-8'))
        return decode_data
    else:
        print ("Something error in get_youtube_video_info: " + content.decode('utf-8'))

def get_categories():
    video_category = {}
    h = httplib2.Http('.cache')
    (data, content) = h.request("https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=%s" % (YOUTUBE_API_KEY), "GET")
    decode_data = json.loads(content.decode('utf-8'))
    for item in decode_data['items']:
        video_category[item['id']] = item['snippet']['title']
    return video_category
        
if __name__ == '__main__':
    total_information = []
    video_id = []
    
    with open('../data/videoInfo_0125_v1.json') as data_file:
        video_data = json.load(data_file)
    
    for video in video_data:
        video_id.append(video['youtubeUrl'].split('=')[1])
        
    categories = get_categories()
    for vid in video_id:
        info = get_youtube_video_info(vid)
        for item in info['items']:
            cid = item['snippet']['categoryId']
            item['snippet']['categoryId'] = categories[cid]
        
        total_information.append(info)
        
    with open('../data/youtube_info.json', 'w') as outfile:
        json.dump(total_information, outfile) 