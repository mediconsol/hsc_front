class FacilitiesController < ApplicationController
  def index
    # 시설/자산 관리 메인 페이지
  end

  def show
    @facility_id = params[:id]
    # 시설 상세 페이지
  end
end
