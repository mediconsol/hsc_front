class ApplicationController < ActionController::Base
  # 브라우저 제한 제거 (배포 환경에서 문제 발생 가능)
  # allow_browser versions: :modern
  
  private
  
  def require_authentication
    # JWT 기반 인증은 클라이언트사이드에서 처리
    # 서버사이드에서는 인증 체크를 하지 않고 바로 렌더링
  end
end
