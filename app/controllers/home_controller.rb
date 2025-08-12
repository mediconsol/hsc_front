class HomeController < ActionController::Base
  # CSRF 보호 비활성화 (테스트용)
  skip_before_action :verify_authenticity_token
  
  def index
    # 병원 관리 시스템 대시보드
    # 기존 application 레이아웃으로 복구
    render layout: 'application'
  end
  
  def login
    # 레이아웃 없이 템플릿 렌더링
    render template: 'home/login_simple', layout: false
  end
end