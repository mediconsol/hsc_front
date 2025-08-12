class FinanceController < ApplicationController
  before_action :require_login

  def index
    # 예산/재무 관리 메인 페이지
  end

  def budgets
    # 예산 관리 페이지
  end

  def expenses
    # 지출 관리 페이지
  end

  def invoices
    # 청구서 관리 페이지
  end

  private

  def require_login
    # 실제 프로덕션에서는 인증 로직 구현
    # redirect_to login_path unless logged_in?
  end
end