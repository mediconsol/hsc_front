class HealthController < ActionController::Base
  def show
    render plain: "Frontend OK", status: :ok
  end
end