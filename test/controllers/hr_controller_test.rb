require "test_helper"

class HrControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get hr_index_url
    assert_response :success
  end
end
