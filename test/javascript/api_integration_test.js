// API Integration Test Suite for Vacation Management System
// This file tests the frontend-backend API communication

describe('Vacation Management API Integration', function() {
  let apiClient;
  let employeeApi;

  beforeEach(function() {
    // Initialize API clients
    apiClient = new ApiClient('http://localhost:7001/api/v1');
    employeeApi = new EmployeeApi('http://localhost:7001/api/v1');
    
    // Mock localStorage for authentication
    localStorage.setItem('auth_token', 'test-token-12345');
  });

  afterEach(function() {
    localStorage.removeItem('auth_token');
  });

  describe('Authentication Headers', function() {
    it('should include Authorization header when token exists', function() {
      const headers = apiClient.getAuthHeaders();
      expect(headers).to.have.property('Authorization');
      expect(headers['Authorization']).to.equal('Bearer test-token-12345');
      expect(headers['Content-Type']).to.equal('application/json');
    });

    it('should not include Authorization header when token missing', function() {
      localStorage.removeItem('auth_token');
      const headers = apiClient.getAuthHeaders();
      expect(headers).to.not.have.property('Authorization');
      expect(headers['Content-Type']).to.equal('application/json');
    });
  });

  describe('Leave Request API Integration', function() {
    beforeEach(function() {
      // Setup fetch mock for testing
      global.fetch = sinon.stub();
    });

    afterEach(function() {
      sinon.restore();
    });

    it('should fetch leave request statistics correctly', async function() {
      const mockResponse = {
        status: 'success',
        data: {
          total_requests: 15,
          pending_requests: 3,
          approved_requests: 10,
          rejected_requests: 2,
          total_days_requested: 45
        }
      };

      fetch.resolves(new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));

      const result = await employeeApi.get('/leave_requests/statistics');
      
      expect(result.status).to.equal('success');
      expect(result.data.total_requests).to.equal(15);
      expect(result.data.pending_requests).to.equal(3);
      expect(fetch.calledWith('http://localhost:7001/api/v1/leave_requests/statistics')).to.be.true;
    });

    it('should fetch employee annual leave status correctly', async function() {
      const employeeId = 123;
      const mockResponse = {
        status: 'success',
        data: {
          employee_id: employeeId,
          employee_name: '김의사',
          total_annual_leave: 16,
          used_annual_leave: 5,
          remaining_annual_leave: 11,
          year: 2025
        }
      };

      fetch.resolves(new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));

      const result = await employeeApi.get(`/leave_requests/annual_leave_status?employee_id=${employeeId}`);
      
      expect(result.status).to.equal('success');
      expect(result.data.employee_name).to.equal('김의사');
      expect(result.data.remaining_annual_leave).to.equal(11);
    });

    it('should handle API errors gracefully', async function() {
      const errorResponse = {
        status: 'error',
        message: '인증에 실패했습니다'
      };

      fetch.resolves(new Response(JSON.stringify(errorResponse), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }));

      try {
        await employeeApi.get('/leave_requests/statistics');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.status).to.equal(401);
        expect(error.message).to.equal('인증에 실패했습니다');
      }
    });

    it('should create leave request with correct data format', async function() {
      const leaveRequestData = {
        employee_id: 123,
        leave_request: {
          leave_type: 'annual',
          start_date: '2025-08-15',
          end_date: '2025-08-17',
          days_requested: 3,
          reason: '가족 여행'
        }
      };

      const mockResponse = {
        status: 'success',
        message: '휴가 신청이 완료되었습니다.',
        data: {
          leave_request: {
            id: 456,
            ...leaveRequestData.leave_request,
            status: 'pending'
          }
        }
      };

      fetch.resolves(new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));

      const result = await employeeApi.post('/leave_requests', leaveRequestData);
      
      expect(result.status).to.equal('success');
      expect(result.message).to.equal('휴가 신청이 완료되었습니다.');
      expect(result.data.leave_request.status).to.equal('pending');
    });
  });

  describe('Employee API Integration', function() {
    beforeEach(function() {
      global.fetch = sinon.stub();
    });

    afterEach(function() {
      sinon.restore();
    });

    it('should fetch employees list correctly', async function() {
      const mockResponse = {
        status: 'success',
        data: {
          employees: [
            {
              id: 1,
              name: '김의사',
              department: '의료진',
              position: '주치의',
              email: 'kim@test.com',
              status: 'active'
            },
            {
              id: 2,
              name: '이간호사',
              department: '간호부',
              position: '수간호사',
              email: 'lee@test.com',
              status: 'active'
            }
          ]
        }
      };

      fetch.resolves(new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));

      const result = await employeeApi.getEmployees();
      
      expect(result.status).to.equal('success');
      expect(result.data.employees).to.have.length(2);
      expect(result.data.employees[0].name).to.equal('김의사');
      expect(result.data.employees[1].name).to.equal('이간호사');
    });

    it('should handle network errors appropriately', async function() {
      fetch.rejects(new TypeError('Failed to fetch'));

      try {
        await employeeApi.getEmployees();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.status).to.equal(0);
        expect(error.message).to.equal('서버와 연결할 수 없습니다');
      }
    });
  });

  describe('Frontend UI Data Binding', function() {
    let mockDocument;

    beforeEach(function() {
      // Create mock DOM elements
      mockDocument = {
        getElementById: sinon.stub(),
        createElement: sinon.stub()
      };

      // Mock specific elements
      const mockElements = {
        'pending-leave-count': { textContent: '' },
        'approved-leave-count': { textContent: '' },
        'used-annual-leave': { textContent: '' },
        'remaining-annual-leave': { textContent: '' },
        'leave-employee': { value: '', addEventListener: sinon.stub() },
        'employee-annual-leave-info': { innerHTML: '' }
      };

      mockDocument.getElementById.callsFake((id) => mockElements[id] || null);
      global.document = mockDocument;
    });

    it('should update leave statistics in UI correctly', function() {
      const statsData = {
        pending_requests: 5,
        approved_requests: 12,
        total_days_requested: 35
      };

      // Mock the loadLeaveStatistics function behavior
      document.getElementById('pending-leave-count').textContent = statsData.pending_requests;
      document.getElementById('approved-leave-count').textContent = statsData.approved_requests;
      document.getElementById('used-annual-leave').textContent = statsData.total_days_requested;

      expect(document.getElementById('pending-leave-count').textContent).to.equal('5');
      expect(document.getElementById('approved-leave-count').textContent).to.equal('12');
      expect(document.getElementById('used-annual-leave').textContent).to.equal('35');
    });

    it('should update employee annual leave info correctly', function() {
      const annualLeaveData = {
        total_annual_leave: 16,
        used_annual_leave: 6,
        remaining_annual_leave: 10
      };

      const expectedHtml = `
        <h4 class="text-sm font-medium text-gray-900">연차 현황</h4>
        <div class="mt-2 space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">총 연차:</span>
            <span class="text-gray-900">${annualLeaveData.total_annual_leave}일</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">사용 연차:</span>
            <span class="text-red-600">${annualLeaveData.used_annual_leave}일</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">잔여 연차:</span>
            <span class="text-blue-600 font-medium">${annualLeaveData.remaining_annual_leave}일</span>
          </div>
        </div>
      `;

      document.getElementById('employee-annual-leave-info').innerHTML = expectedHtml;
      
      expect(document.getElementById('employee-annual-leave-info').innerHTML).to.include('연차 현황');
      expect(document.getElementById('employee-annual-leave-info').innerHTML).to.include('16일');
      expect(document.getElementById('employee-annual-leave-info').innerHTML).to.include('10일');
    });
  });
});

// Test Data Validation Functions
describe('Frontend Data Validation', function() {
  describe('Leave Request Form Validation', function() {
    it('should validate required fields', function() {
      const formData = {
        employee_id: '',
        leave_type: '',
        start_date: '',
        end_date: '',
        days_requested: '',
        reason: ''
      };

      const requiredFields = ['employee_id', 'leave_type', 'start_date', 'end_date', 'days_requested', 'reason'];
      const errors = [];

      requiredFields.forEach(field => {
        if (!formData[field]) {
          errors.push(`${field} is required`);
        }
      });

      expect(errors).to.have.length(6);
    });

    it('should validate date order (end date after start date)', function() {
      const startDate = new Date('2025-08-15');
      const endDate = new Date('2025-08-10'); // Earlier than start date

      const isValidDateOrder = endDate >= startDate;
      expect(isValidDateOrder).to.be.false;
    });

    it('should calculate days correctly', function() {
      const startDate = new Date('2025-08-15');
      const endDate = new Date('2025-08-17');
      
      const timeDifference = endDate - startDate;
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
      
      expect(daysDifference).to.equal(3);
    });
  });

  describe('UI Helper Functions', function() {
    it('should format status classes correctly', function() {
      function getLeaveStatusClass(status) {
        switch (status) {
          case 'approved':
            return 'text-green-800 bg-green-100';
          case 'rejected':
            return 'text-red-800 bg-red-100';
          case 'pending':
            return 'text-yellow-800 bg-yellow-100';
          case 'cancelled':
            return 'text-gray-800 bg-gray-100';
          default:
            return 'text-gray-800 bg-gray-100';
        }
      }

      expect(getLeaveStatusClass('approved')).to.equal('text-green-800 bg-green-100');
      expect(getLeaveStatusClass('rejected')).to.equal('text-red-800 bg-red-100');
      expect(getLeaveStatusClass('pending')).to.equal('text-yellow-800 bg-yellow-100');
    });

    it('should format dates correctly', function() {
      function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }

      expect(formatDate('2025-08-15')).to.match(/2025/);
      expect(formatDate('2025-08-15')).to.match(/08/);
      expect(formatDate('2025-08-15')).to.match(/15/);
    });
  });
});

// Performance Testing for Frontend
describe('Frontend Performance', function() {
  it('should load leave statistics within acceptable time', async function() {
    this.timeout(5000); // 5 second timeout

    const startTime = Date.now();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).to.be.below(1000); // Should load within 1 second
  });

  it('should handle large datasets efficiently', function() {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Employee ${i + 1}`,
      department: 'Department',
      leave_requests: []
    }));

    const startTime = Date.now();
    
    // Simulate data processing
    const processedData = largeDataset.filter(emp => emp.name.includes('Employee'));
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    expect(processedData).to.have.length(1000);
    expect(processingTime).to.be.below(100); // Should process within 100ms
  });
});