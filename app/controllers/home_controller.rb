class HomeController < ApplicationController
  
  def index
    # 병원 관리 시스템 대시보드
    # 클라이언트사이드 JavaScript에서 인증 체크 수행
  end
  
  def login
    # 로그인 페이지는 별도 레이아웃 사용 (사이드바 없음)
    render layout: 'login'
  end
end