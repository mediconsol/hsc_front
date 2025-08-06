require "test_helper"

class DepartmentBoardsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get department_boards_index_url
    assert_response :success
  end

  test "should get show" do
    get department_boards_show_url
    assert_response :success
  end
end
