import os
import json
import requests
from datetime import datetime, timezone
import base64

class SocialMediaPoster:
    def __init__(self):
        self.credentials = {
            'instagram': {
                'token': os.getenv('INSTAGRAM_TOKEN'),
                'account_id': os.getenv('INSTAGRAM_ACCOUNT_ID')
            },
            'tiktok': {
                'token': os.getenv('TIKTOK_TOKEN')
            },
            'youtube': {
                'client_id': os.getenv('YOUTUBE_CLIENT_ID'),
                'client_secret': os.getenv('YOUTUBE_CLIENT_SECRET')
            },
            'twitter': {
                'client_id': os.getenv('TWITTER_CLIENT_ID'),
                'client_secret': os.getenv('TWITTER_CLIENT_SECRET')
            },
            'facebook': {
                'token': os.getenv('FACEBOOK_TOKEN'),
                'page_id': os.getenv('FACEBOOK_PAGE_ID')
            }
        }
    
    def process_scheduled_posts(self):
        try:
            with open('scheduled_posts.json', 'r') as f:
                scheduled_posts = json.load(f)
        except FileNotFoundError:
            scheduled_posts = []
        
        now = datetime.now(timezone.utc)
        updated_posts = []
        
        for post in scheduled_posts:
            post_time = datetime.fromisoformat(post['schedule_time'])
            
            if now >= post_time and post['status'] == 'scheduled':
                print(f"Publishing post: {post['id']}")
                self.publish_post(post)
                post['status'] = 'published'
                post['published_at'] = now.isoformat()
            
            if post['status'] != 'expired':
                updated_posts.append(post)
        
        # Save updated posts
        with open('scheduled_posts.json', 'w') as f:
            json.dump(updated_posts, f, indent=2)
    
    def publish_post(self, post_data):
        for platform_config in post_data['platforms']:
            platform = platform_config['platform']
            format_type = platform_config['format']
            
            try:
                if platform == 'instagram':
                    self.post_to_instagram(format_type, post_data)
                elif platform == 'tiktok':
                    self.post_to_tiktok(format_type, post_data)
                elif platform == 'youtube':
                    self.post_to_youtube(format_type, post_data)
                elif platform == 'twitter':
                    self.post_to_twitter(format_type, post_data)
                elif platform == 'facebook':
                    self.post_to_facebook(format_type, post_data)
                
                print(f"Successfully posted to {platform}")
                
            except Exception as e:
                print(f"Error posting to {platform}: {e}")
    
    def post_to_instagram(self, format_type, content):
        token = self.credentials['instagram']['token']
        account_id = self.credentials['instagram']['account_id']
        
        if not token or not account_id:
            raise Exception("Instagram credentials not configured")
        
        url = f"https://graph.facebook.com/v18.0/{account_id}/media"
        
        caption = f"{content['title']}\n\n{content['description']}\n\n{content['hashtags']}"
        
        payload = {
            'caption': caption,
            'access_token': token
        }
        
        if format_type == 'reels':
            payload['media_type'] = 'REELS'
        
        # Note: In real implementation, you'd upload media files
        response = requests.post(url, data=payload)
        response.raise_for_status()
        
        return response.json()
    
    def post_to_tiktok(self, format_type, content):
        # TikTok API implementation
        pass
    
    def post_to_youtube(self, format_type, content):
        # YouTube API implementation
        pass
    
    def post_to_twitter(self, format_type, content):
        # Twitter API implementation
        pass
    
    def post_to_facebook(self, format_type, content):
        # Facebook API implementation
        pass

if __name__ == "__main__":
    poster = SocialMediaPoster()
    poster.process_scheduled_posts()
