import { auth } from '../firebase';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

class ApiService {
  async getAuthToken() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const token = await this.getAuthToken();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        ...options
      };

      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Room APIs
  async getPublicRooms() {
    const response = await fetch(`${API_BASE_URL}/api/rooms/public`);
    if (!response.ok) throw new Error('Failed to fetch public rooms');
    return await response.json();
  }

  async getRoom(roomId) {
    const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`);
    if (!response.ok) throw new Error('Failed to fetch room');
    return await response.json();
  }

  async createRoom(roomData) {
    return await this.makeRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData)
    });
  }

  async joinRoomByCode(accessCode) {
    return await this.makeRequest(`/rooms/join/${accessCode}`, {
      method: 'POST'
    });
  }

  async deleteRoom(roomId) {
    return await this.makeRequest(`/rooms/${roomId}`, {
      method: 'DELETE'
    });
  }

  async getUserCreatedRooms() {
    return await this.makeRequest('/rooms/user/created');
  }

  // User APIs
  async getUserProfile() {
    return await this.makeRequest('/users/profile');
  }

  async updateUserProfile(profileData) {
    return await this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getPublicUserProfile(userId) {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/public`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
  }

  async searchUsers(query, skills) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (skills) params.append('skills', skills);
    
    const response = await fetch(`${API_BASE_URL}/api/users/search?${params}`);
    if (!response.ok) throw new Error('Failed to search users');
    return await response.json();
  }
}

export default new ApiService();