class PatientsController < ApplicationController
  before_action :set_api_base_url
  
  def index
    # 환자 관리 메인 페이지 - 모든 로직은 프론트엔드 JavaScript에서 처리
    # 백엔드 API와의 통신을 위한 기본 설정만 제공
  end
  
  private
  
  def set_api_base_url
    @api_base_url = ENV['BACKEND_API_URL'] || 'http://localhost:3001/api/v1'
  end
end
