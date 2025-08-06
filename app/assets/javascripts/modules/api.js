// API 모듈
class ApiClient {
  constructor(baseUrl = 'http://localhost:7001/api/v1') {
    this.baseUrl = baseUrl;
  }

  // 인증 헤더 가져오기
  getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }

  // GET 요청
  async get(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // POST 요청
  async post(endpoint, data = null, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : null,
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUT 요청
  async put(endpoint, data = null, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : null,
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE 요청
  async delete(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // 응답 처리
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'API 요청에 실패했습니다',
        details: data.details || null,
        data: data
      };
    }
    
    return data;
  }

  // 에러 처리
  handleError(error) {
    console.error('API Error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        status: 0,
        message: '서버와 연결할 수 없습니다',
        details: null
      };
    }
    
    return error;
  }
}

// Employee API 전용 클래스
class EmployeeApi extends ApiClient {
  
  // 직원 목록 조회
  async getEmployees(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/employees?${queryString}` : '/employees';
    return await this.get(endpoint);
  }

  // 직원 상세 조회
  async getEmployee(id) {
    return await this.get(`/employees/${id}`);
  }

  // 직원 생성
  async createEmployee(employeeData) {
    return await this.post('/employees', { employee: employeeData });
  }

  // 직원 수정
  async updateEmployee(id, employeeData) {
    return await this.put(`/employees/${id}`, { employee: employeeData });
  }

  // 직원 삭제
  async deleteEmployee(id) {
    return await this.delete(`/employees/${id}`);
  }
}

// 전역 API 인스턴스
window.api = new ApiClient();
window.employeeApi = new EmployeeApi();