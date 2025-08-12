class HomeController < ActionController::Base
  # CSRF 보호 비활성화 (테스트용)
  skip_before_action :verify_authenticity_token
  
  def index
    # 병원 관리 시스템 대시보드
    # 클라이언트사이드 JavaScript에서 인증 체크 수행
  end
  
  def login
    # 레이아웃 없이 완전히 독립적인 HTML 렌더링
    render file: Rails.root.join('app', 'views', 'home', 'login_simple.html.erb'), layout: false
  end
end