// 인증 관련 JavaScript 모듈
// 프론트엔드 전체에서 사용되는 공통 인증 로직

class AuthManager {
  constructor() {
    this.TOKEN_KEY = 'auth_token';
    this.USER_INFO_KEY = 'user_info';
    this.REFRESH_TOKEN_KEY = 'refresh_token';
    this.API_BASE_URL = window.BACKEND_API_URL || 'http://localhost:7001/api/v1';
  }

  // 토큰 저장
  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // 토큰 가져오기
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // 사용자 정보 저장
  setUserInfo(userInfo) {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }

  // 사용자 정보 가져오기
  getUserInfo() {
    const userInfo = localStorage.getItem(this.USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // 로그인 상태 확인
  isAuthenticated() {
    return !!this.getToken();
  }

  // 토큰 유효성 검증
  async validateToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          this.setUserInfo(data.user);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // 로그인
  async login(email, password) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.status === 'success') {
        this.setToken(data.access_token);
        this.setUserInfo(data.user);
        return { success: true, data: data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'API 연결 실패' };
    }
  }

  // 로그아웃
  async logout() {
    const token = this.getToken();

    try {
      if (token) {
        await fetch(`${this.API_BASE_URL}/auth/logout`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // 로컬 저장소 정리
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_INFO_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  // 인증 필요한 페이지 접근 시 체크
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  }

  // 로그인 페이지에서 이미 인증된 경우 리다이렉트
  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      this.validateToken().then(isValid => {
        if (isValid) {
          window.location.href = '/dashboard';
        } else {
          this.logout();
        }
      });
    }
  }

  // 역할 한국어 변환
  getRoleDisplayName(role) {
    const roleNames = {
      0: 'read_only',
      1: 'staff', 
      2: 'manager',
      3: 'admin'
    };
    
    const roleKorean = {
      'read_only': '읽기전용',
      'staff': '직원',
      'manager': '관리자', 
      'admin': '시스템관리자'
    };
    
    const roleName = roleNames[role] || 'staff';
    return roleKorean[roleName] || roleName;
  }
}

// 전역 인스턴스 생성
window.authManager = new AuthManager();