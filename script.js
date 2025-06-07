
// Global variables
let uploadedFiles = [];
let credentials = {};
let githubConfig = {};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadStoredCredentials();
    setupEventListeners();
    updateDateTime();
    checkAuthStatus();
}

function setupEventListeners() {
    // Upload events
    const uploadArea = document.getElementById('uploadArea');
    const mediaInput = document.getElementById('mediaInput');
    
    uploadArea.addEventListener('click', () => mediaInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    mediaInput.addEventListener('change', handleFileSelect);
    
    // Platform selection
    const platformCheckboxes = document.querySelectorAll('.platform-checkbox');
    platformCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handlePlatformChange);
    });
    
    // Schedule type
    const scheduleRadios = document.querySelectorAll('input[name="scheduleType"]');
    scheduleRadios.forEach(radio => {
        radio.addEventListener('change', handleScheduleTypeChange);
    });
    
    // Form submission
    document.getElementById('postForm').addEventListener('submit', handleFormSubmit);
    
    // Preview
    document.getElementById('previewBtn').addEventListener('click', showPreview);
    
    // Modal
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('previewModal')) closeModal();
    });
}

// Authentication Functions
async function testConnection(platform) {
    const statusElement = document.getElementById(platform + 'Status');
    statusElement.textContent = '🔄';
    
    try {
        let isValid = false;
        
        switch(platform) {
            case 'instagram':
                isValid = await testInstagramConnection();
                break;
            case 'tiktok':
                isValid = await testTikTokConnection();
                break;
            case 'facebook':
                isValid = await testFacebookConnection();
                break;
            default:
                showMessage('Teste não implementado para esta plataforma', 'warning');
                return;
        }
        
        statusElement.textContent = isValid ? '✅' : '❌';
        showMessage(
            isValid ? 'Conexão válida!' : 'Falha na conexão',
            isValid ? 'success' : 'error'
        );
        
    } catch (error) {
        statusElement.textContent = '❌';
        showMessage('Erro ao testar conexão: ' + error.message, 'error');
    }
}

async function testInstagramConnection() {
    const token = document.getElementById('instagramToken').value;
    const accountId = document.getElementById('instagramAccountId').value;
    
    if (!token || !accountId) {
        throw new Error('Token e Account ID são obrigatórios');
    }
    
    const response = await fetch(`https://graph.facebook.com/v18.0/${accountId}?access_token=${token}`);
    return response.ok;
}

async function testTikTokConnection() {
    const token = document.getElementById('tiktokToken').value;
    
    if (!token) {
        throw new Error('Access Token é obrigatório');
    }
    
    // TikTok API test endpoint
    const response = await fetch('https://open-api.tiktok.com/oauth/userinfo/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return response.ok;
}

async function testFacebookConnection() {
    const token = document.getElementById('facebookToken').value;
    
    if (!token) {
        throw new Error('Access Token é obrigatório');
    }
    
    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    return response.ok;
}

async function authenticateYouTube() {
    const clientId = document.getElementById('youtubeClientId').value;
    
    if (!clientId) {
        showMessage('Client ID é obrigatório', 'error');
        return;
    }
    
    // YouTube OAuth flow
    const redirectUri = window.location.origin + window.location.pathname;
    const scope = 'https://www.googleapis.com/auth/youtube.upload';
    const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&access_type=offline`;
    
    window.location.href = authUrl;
}

async function authenticateTwitter() {
    const clientId = document.getElementById('twitterClientId').value;
    
    if (!clientId) {
        showMessage('Client ID é obrigatório', 'error');
        return;
    }
    
    // Twitter OAuth 2.0 flow
    const redirectUri = window.location.origin + window.location.pathname;
    const scope = 'tweet.read tweet.write users.read';
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=state&code_challenge=challenge&code_challenge_method=plain`;
    
    window.location.href = authUrl;
}

function saveAllCredentials() {
    credentials = {
        instagram: {
            token: document.getElementById('instagramToken').value,
            accountId: document.getElementById('instagramAccountId').value
        },
        tiktok: {
            token: document.getElementById('tiktokToken').value,
            clientKey: document.getElementById('tiktokClientKey').value
        },
        youtube: {
            clientId: document.getElementById('youtubeClientId').value,
            clientSecret: document.getElementById('youtubeClientSecret').value
        },
        twitter: {
            clientId: document.getElementById('twitterClientId').value,
            clientSecret: document.getElementById('twitterClientSecret').value
        },
        facebook: {
            token: document.getElementById('facebookToken').value,
            pageId: document.getElementById('facebookPageId').value
        }
    };
    
    localStorage.setItem('socialMediaCredentials', JSON.stringify(credentials));
    showMessage('Credenciais salvas com sucesso!', 'success');
}

function loadStoredCredentials() {
    const stored = localStorage.getItem('socialMediaCredentials');
    if (stored) {
        credentials = JSON.parse(stored);
        
        // Fill form fields
        if (credentials.instagram) {
            document.getElementById('instagramToken').value = credentials.instagram.token || '';
            document.getElementById('instagramAccountId').value = credentials.instagram.accountId || '';
        }
        
        if (credentials.tiktok) {
            document.getElementById('tiktokToken').value = credentials.tiktok.token || '';
            document.getElementById('tiktokClientKey').value = credentials.tiktok.clientKey || '';
        }
        
        if (credentials.youtube) {
            document.getElementById('youtubeClientId').value = credentials.youtube.clientId || '';
            document.getElementById('youtubeClientSecret').value = credentials.youtube.clientSecret || '';
        }
        
        if (credentials.twitter) {
            document.getElementById('twitterClientId').value = credentials.twitter.clientId || '';
            document.getElementById('twitterClientSecret').value = credentials.twitter.clientSecret || '';
        }
        
        if (credentials.facebook) {
            document.getElementById('facebookToken').value = credentials.facebook.token || '';
            document.getElementById('facebookPageId').value = credentials.facebook.pageId || '';
        }
    }
    
    // Load GitHub config
    const githubStored = localStorage.getItem('githubConfig');
    if (githubStored) {
        githubConfig = JSON.parse(githubStored);
        document.getElementById('githubRepo').value = githubConfig.repo || '';
        document.getElementById('githubToken').value = githubConfig.token || '';
    }
}

function checkAuthStatus() {
    // Update status indicators based on stored credentials
    const platforms = ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook'];
    
    platforms.forEach(platform => {
        const statusElement = document.getElementById(platform + 'Status');
        const hasCredentials = credentials[platform] && 
            Object.values(credentials[platform]).some(value => value && value.length > 0);
        
        statusElement.textContent = hasCredentials ? '⚠️' : '❌';
        statusElement.title = hasCredentials ? 'Credenciais inseridas - clique em Testar' : 'Credenciais não configuradas';
    });
}

// File Upload Functions
function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function processFiles(files) {
    files.forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            uploadedFiles.push(file);
            createMediaPreview(file);
        } else {
            showMessage('Apenas imagens e vídeos são aceitos', 'error');
        }
    });
    
    updateUploadArea();
}

function createMediaPreview(file) {
    const mediaPreview = document.getElementById('mediaPreview');
    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    
    const element = file.type.startsWith('video/') ? 
        document.createElement('video') : 
        document.createElement('img');
    
    element.src = URL.createObjectURL(file);
    if (element.tagName === 'VIDEO') {
        element.controls = true;
    }
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '×';
    removeBtn.onclick = () => removeMedia(file, mediaItem);
    
    const fileName = document.createElement('div');
    fileName.className = 'file-name';
    fileName.textContent = file.name;
    
    mediaItem.appendChild(element);
    mediaItem.appendChild(removeBtn);
    mediaItem.appendChild(fileName);
    mediaPreview.appendChild(mediaItem);
}

function removeMedia(file, element) {
    uploadedFiles = uploadedFiles.filter(f => f !== file);
    element.remove();
    updateUploadArea();
}

function updateUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    if (uploadedFiles.length === 0) {
        uploadArea.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Arraste arquivos aqui ou clique para selecionar</p>
        `;
    } else {
        uploadArea.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${uploadedFiles.length} arquivo(s) selecionado(s)</p>
        `;
    }
}

// Platform Selection
function handlePlatformChange(e) {
    const platform = e.target.id;
    const options = document.getElementById(platform + 'Options');
    
    if (e.target.checked) {
        options.style.display = 'block';
    } else {
        options.style.display = 'none';
    }
}

function handleScheduleTypeChange(e) {
    const scheduleDateTime = document.getElementById('scheduleDateTime');
    if (e.target.value === 'later') {
        scheduleDateTime.style.display = 'block';
    } else {
        scheduleDateTime.style.display = 'none';
    }
}

// Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const postData = collectFormData();
    
    if (postData.scheduleType === 'now') {
        createGitHubAction(postData, true);
    } else {
        createGitHubAction(postData, false);
    }
}

function validateForm() {
    if (uploadedFiles.length === 0) {
        showMessage('Selecione pelo menos um arquivo de mídia', 'error');
        return false;
    }
    
    const selectedPlatforms = getSelectedPlatforms();
    if (selectedPlatforms.length === 0) {
        showMessage('Selecione pelo menos uma plataforma', 'error');
        return false;
    }
    
    if (!githubConfig.repo || !githubConfig.token) {
        showMessage('Configure a integração GitHub primeiro', 'error');
        return false;
    }
    
    return true;
}

function getSelectedPlatforms() {
    const selected = [];
    const platformCheckboxes = document.querySelectorAll('.platform-checkbox');
    
    platformCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const platform = checkbox.id;
            const format = document.getElementById(platform + 'Format').value;
            selected.push({ platform, format });
        }
    });
    
    return selected;
}

function collectFormData() {
    return {
        title: document.getElementById('postTitle').value,
        description: document.getElementById('postDescription').value,
        hashtags: document.getElementById('hashtags').value,
        music: document.getElementById('musicTrack').value,
        platforms: getSelectedPlatforms(),
        scheduleType: document.querySelector('input[name="scheduleType"]:checked').value,
        scheduleDate: document.getElementById('scheduleDate').value,
        scheduleTime: document.getElementById('scheduleTime').value,
        files: uploadedFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
        }))
    };
}

// GitHub Integration
function setupGitHubIntegration() {
    const repo = document.getElementById('githubRepo').value;
    const token = document.getElementById('githubToken').value;
    
    if (!repo || !token) {
        showMessage('Repositório e token são obrigatórios', 'error');
        return;
    }
    
    githubConfig = { repo, token };
    localStorage.setItem('githubConfig', JSON.stringify(githubConfig));
    
    // Test GitHub connection
    testGitHubConnection(repo, token);
}

async function testGitHubConnection(repo, token) {
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            showMessage('GitHub configurado com sucesso!', 'success');
            await createWorkflowFile();
        } else {
            showMessage('Erro na configuração GitHub: Verifique repositório e token', 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com GitHub: ' + error.message, 'error');
    }
}

async function createWorkflowFile() {
    const workflowContent = `name: Social Media Poster

on:
  schedule:
    - cron: '*/5 * * * *'  # Check every 5 minutes
  workflow_dispatch:

jobs:
  post:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: |
          pip install requests python-dotenv
      
      - name: Post to social media
        env:
          INSTAGRAM_TOKEN: \${{ secrets.INSTAGRAM_TOKEN }}
          INSTAGRAM_ACCOUNT_ID: \${{ secrets.INSTAGRAM_ACCOUNT_ID }}
          TIKTOK_TOKEN: \${{ secrets.TIKTOK_TOKEN }}
          YOUTUBE_CLIENT_ID: \${{ secrets.YOUTUBE_CLIENT_ID }}
          YOUTUBE_CLIENT_SECRET: \${{ secrets.YOUTUBE_CLIENT_SECRET }}
          TWITTER_CLIENT_ID: \${{ secrets.TWITTER_CLIENT_ID }}
          TWITTER_CLIENT_SECRET: \${{ secrets.TWITTER_CLIENT_SECRET }}
          FACEBOOK_TOKEN: \${{ secrets.FACEBOOK_TOKEN }}
          FACEBOOK_PAGE_ID: \${{ secrets.FACEBOOK_PAGE_ID }}
        run: python .github/scripts/social_poster.py
`;

    await createGitHubFile('.github/workflows/social-media.yml', workflowContent);
    await createPostingScript();
}

async function createPostingScript() {
    const scriptContent = `import os
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
        
        caption = f"{content['title']}\\n\\n{content['description']}\\n\\n{content['hashtags']}"
        
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
`;

    await createGitHubFile('.github/scripts/social_poster.py', scriptContent);
}

async function createGitHubFile(path, content) {
    try {
        const response = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubConfig.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Create ${path}`,
                content: btoa(content),
                branch: 'main'
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        
        console.log(`Created file: ${path}`);
    } catch (error) {
        console.error(`Error creating file ${path}:`, error);
    }
}

async function createGitHubAction(postData, immediate = false) {
    try {
        // Create post data
        const post = {
            id: Date.now().toString(),
            ...postData,
            schedule_time: immediate ? 
                new Date().toISOString() : 
                new Date(postData.scheduleDate + 'T' + postData.scheduleTime).toISOString(),
            status: 'scheduled',
            created_at: new Date().toISOString()
        };
        
        // Load existing scheduled posts
        let scheduledPosts = [];
        try {
            const response = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/scheduled_posts.json`, {
                headers: {
                    'Authorization': `token ${githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                scheduledPosts = JSON.parse(atob(data.content));
            }
        } catch (error) {
            console.log('No existing scheduled posts file');
        }
        
        // Add new post
        scheduledPosts.push(post);
        
        // Update file in GitHub
        await updateScheduledPostsFile(scheduledPosts);
        
        // Upload media files if any
        for (let i = 0; i < uploadedFiles.length; i++) {
            await uploadMediaFile(uploadedFiles[i], post.id, i);
        }
        
        showMessage(
            immediate ? 'Post criado e será publicado em breve!' : 'Post agendado com sucesso!',
            'success'
        );
        
        updateScheduledPostsDisplay();
        resetForm();
        
    } catch (error) {
        showMessage('Erro ao criar post: ' + error.message, 'error');
    }
}

async function updateScheduledPostsFile(posts) {
    const response = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/scheduled_posts.json`, {
        headers: {
            'Authorization': `token ${githubConfig.token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    let sha = null;
    if (response.ok) {
        const data = await response.json();
        sha = data.sha;
    }
    
    const updateResponse = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/scheduled_posts.json`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${githubConfig.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update scheduled posts',
            content: btoa(JSON.stringify(posts, null, 2)),
            sha: sha,
            branch: 'main'
        })
    });
    
    if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(error.message);
    }
}

async function uploadMediaFile(file, postId, index) {
    try {
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
            reader.onload = async (e) => {
                try {
                    const content = e.target.result.split(',')[1]; // Remove data URL prefix
                    const fileName = `media/${postId}_${index}_${file.name}`;
                    
                    const response = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/${fileName}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `token ${githubConfig.token}`,
                            'Accept': 'application/vnd.github.v3+json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: `Upload media file: ${file.name}`,
                            content: content,
                            branch: 'main'
                        })
                    });
                    
                    if (response.ok) {
                        resolve();
                    } else {
                        const error = await response.json();
                        reject(new Error(error.message));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsDataURL(file);
        });
    } catch (error) {
        console.error('Error uploading media file:', error);
    }
}

// Display Functions
function updateScheduledPostsDisplay() {
    // Load and display scheduled posts from localStorage
    const container = document.getElementById('scheduledPosts');
    const posts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-calendar-check"></i>
                <p>Nenhum post agendado</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'scheduled-post-item';
        postElement.innerHTML = `
            <div class="post-header">
                <h4>${post.title || 'Post sem título'}</h4>
                <span class="post-status ${post.status}">${post.status}</span>
            </div>
            <div class="post-details">
                <p><strong>Data:</strong> ${new Date(post.schedule_time).toLocaleString('pt-BR')}</p>
                <p><strong>Plataformas:</strong> ${post.platforms.map(p => p.platform).join(', ')}</p>
                <p class="post-description">${post.description}</p>
            </div>
        `;
        container.appendChild(postElement);
    });
}

function showPreview() {
    const data = collectFormData();
    
    if (uploadedFiles.length === 0) {
        showMessage('Adicione mídia para visualizar', 'error');
        return;
    }
    
    let previewHTML = '<div class="preview-content">';
    
    // Media preview
    previewHTML += '<div class="preview-media">';
    uploadedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
            previewHTML += `<img src="${URL.createObjectURL(file)}" style="max-width: 100%; border-radius: 8px; margin-bottom: 10px;">`;
        } else {
            previewHTML += `<video src="${URL.createObjectURL(file)}" controls style="max-width: 100%; border-radius: 8px; margin-bottom: 10px;"></video>`;
        }
    });
    previewHTML += '</div>';
    
    // Text content
    if (data.title) {
        previewHTML += `<h3>${data.title}</h3>`;
    }
    
    if (data.description) {
        previewHTML += `<p>${data.description}</p>`;
    }
    
    if (data.hashtags) {
        previewHTML += `<p style="color: #667eea; margin-top: 10px;">${data.hashtags}</p>`;
    }
    
    if (data.music) {
        previewHTML += `<p><i class="fas fa-music"></i> ${data.music}</p>`;
    }
    
    // Selected platforms
    previewHTML += '<div style="margin-top: 20px;"><strong>Plataformas selecionadas:</strong><ul>';
    data.platforms.forEach(p => {
        previewHTML += `<li>${p.platform} - ${p.format}</li>`;
    });
    previewHTML += '</ul></div>';
    
    previewHTML += '</div>';
    
    document.getElementById('previewContent').innerHTML = previewHTML;
    document.getElementById('previewModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('previewModal').style.display = 'none';
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function resetForm() {
    document.getElementById('postForm').reset();
    uploadedFiles = [];
    document.getElementById('mediaPreview').innerHTML = '';
    updateUploadArea();
    
    // Hide platform options
    document.querySelectorAll('.platform-options').forEach(option => {
        option.style.display = 'none';
    });
    
    // Hide schedule datetime
    document.getElementById('scheduleDateTime').style.display = 'none';
}

function updateDateTime() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);
    
    document.getElementById('scheduleDate').value = today;
    document.getElementById('scheduleTime').value = time;
}

// Initialize scheduled posts display
document.addEventListener('DOMContentLoaded', function() {
    updateScheduledPostsDisplay();
});
