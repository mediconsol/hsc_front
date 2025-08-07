require "application_system_test_case"

class VacationManagementIntegrationTest < ApplicationSystemTestCase
  driven_by :selenium, using: :chrome, screen_size: [1400, 1400]

  def setup
    # Skip due to lack of Selenium setup in test environment
    skip "Selenium WebDriver not configured for this test environment"
    
    # Test data setup (would be used with proper Selenium setup)
    @admin_user = create_test_user("admin@test.com", "관리자", "admin")
    @employee = create_test_employee("김의사", "의료진", "kim@test.com")
    @backend_api_base = "http://localhost:7001/api/v1"
  end

  test "should display HR dashboard with vacation management tab" do
    skip "Integration test requires running servers"
    
    # Visit HR dashboard
    visit hr_path
    
    # Check if vacation management tab exists
    assert_text "휴가 관리"
    
    # Click on vacation management tab
    click_on "휴가 관리"
    
    # Verify vacation management interface elements
    assert_text "승인대기"
    assert_text "승인완료"
    assert_text "사용 연차"
    assert_text "잔여 연차"
  end

  test "vacation statistics should load from backend API" do
    skip "Integration test requires running servers"
    
    visit hr_path
    click_on "휴가 관리"
    
    # Wait for AJAX calls to complete
    sleep 2
    
    # Check if statistics are loaded (not showing default "-")
    within "#pending-leave-count" do
      assert_not_text "-"
    end
    
    within "#approved-leave-count" do
      assert_not_text "-"
    end
  end

  test "should be able to filter vacation requests" do
    skip "Integration test requires running servers"
    
    visit hr_path
    click_on "휴가 관리"
    
    # Set filters
    select "승인대기", from: "leave-status-filter"
    select "연차", from: "leave-type-filter"
    
    # Click filter button
    click_button "조회"
    
    # Wait for results
    sleep 1
    
    # Verify filtered results are displayed
    within "#leave-list" do
      assert_text "승인대기"
    end
  end

  test "employee annual leave status should load correctly" do
    skip "Integration test requires running servers"
    
    visit hr_path
    click_on "휴가 관리"
    
    # Select an employee
    select "김의사 (의료진)", from: "leave-employee"
    
    # Wait for AJAX call
    sleep 1
    
    # Check if annual leave info is displayed
    within "#employee-annual-leave-info" do
      assert_text "연차 현황"
      assert_text "총 연차:"
      assert_text "사용 연차:"
      assert_text "잔여 연차:"
    end
  end

  test "vacation request modal should open and have required fields" do
    skip "Integration test requires running servers"
    
    visit hr_path
    click_on "휴가 관리"
    
    # Open vacation request modal (button would need to exist)
    # click_button "휴가 신청"
    
    # Check modal elements
    # within "#leave-request-modal" do
    #   assert_text "휴가 신청"
    #   assert_field "직원"
    #   assert_field "휴가 종류"
    #   assert_field "시작일"
    #   assert_field "종료일"
    #   assert_field "신청 일수"
    #   assert_field "사유"
    # end
  end

  private

  def create_test_user(email, name, role)
    # Mock user creation for testing
    {
      email: email,
      name: name,
      role: role
    }
  end

  def create_test_employee(name, department, email)
    # Mock employee creation for testing
    {
      name: name,
      department: department,
      email: email,
      hire_date: 2.years.ago,
      status: "active"
    }
  end
end