# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  # 프로덕션에서 CSP 완전 비활성화 (인라인 스크립트 허용 필요 시)
  if Rails.env.production?
    config.content_security_policy = false
  end
end
