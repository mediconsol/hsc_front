require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot for better performance and memory savings (ignored by Rake tasks).
  config.eager_load = true

  # Full error reports are disabled.
  config.consider_all_requests_local = false

  # Turn on fragment caching in view templates.
  config.action_controller.perform_caching = true

  # Cache assets for far-future expiry since they are all digest stamped.
  config.public_file_server.headers = { "cache-control" => "public, max-age=#{1.year.to_i}" }

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.asset_host = "http://assets.example.com"

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Assume all access to the app is happening through a SSL-terminating reverse proxy.
  # Skip SSL settings during asset precompilation
  unless ENV['RAILS_GROUPS'] == 'assets'
    config.assume_ssl = true
    # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
    config.force_ssl = true
  end

  # Rails 8 Asset Precompilation Configuration
  if ENV['RAILS_GROUPS'] == 'assets'
    # Completely disable Active Record during asset precompilation
    config.active_record.database_tasks = false
    config.active_record.maintain_test_schema = false
    config.active_record.dump_schema_after_migration = false
    config.active_record.check_pending_migrations = false
    
    # Skip eager loading during asset precompilation
    config.eager_load = false
    
    # Disable ActionCable during asset precompilation
    config.action_cable.disable_request_forgery_protection = true
  end

  # Skip http-to-https redirect for the default health check endpoint.
  # config.ssl_options = { redirect: { exclude: ->(request) { request.path == "/up" } } }

  # Log to STDOUT with the current request id as a default log tag.
  config.log_tags = [ :request_id ]
  config.logger   = ActiveSupport::TaggedLogging.logger(STDOUT)

  # Change to "debug" to log everything (including potentially personally-identifiable information!)
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  # Prevent health checks from clogging up the logs.
  config.silence_healthcheck_path = "/up"

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Railway 환경에서 캐시 설정
  config.cache_store = :memory_store, { size: 32.megabytes }

  # Active Job 비활성화 (Frontend는 API 클라이언트)
  # config.active_job.queue_adapter = :async

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Set host to be used by links generated in mailer templates.
  frontend_host = ENV["RAILWAY_PUBLIC_DOMAIN"] || ENV["RAILWAY_STATIC_URL"] || "localhost"
  config.action_mailer.default_url_options = { host: frontend_host, protocol: 'https' }

  # Specify outgoing SMTP server. Remember to add smtp/* credentials via rails credentials:edit.
  # config.action_mailer.smtp_settings = {
  #   user_name: Rails.application.credentials.dig(:smtp, :user_name),
  #   password: Rails.application.credentials.dig(:smtp, :password),
  #   address: "smtp.example.com",
  #   port: 587,
  #   authentication: :plain
  # }

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Only use :id for inspections in production.
  config.active_record.attributes_for_inspect = [ :id ]

  # Enable DNS rebinding protection and other `Host` header attacks.
  # Railway 도메인 허용 설정
  allowed_hosts = []
  allowed_hosts << ENV["RAILWAY_STATIC_URL"] if ENV["RAILWAY_STATIC_URL"].present?
  allowed_hosts << ENV["RAILWAY_PUBLIC_DOMAIN"] if ENV["RAILWAY_PUBLIC_DOMAIN"].present?
  allowed_hosts << /.*\.railway\.app$/
  
  config.hosts = allowed_hosts if allowed_hosts.any?
  
  # Skip DNS rebinding protection for the default health check endpoint.
  config.host_authorization = { exclude: ->(request) { request.path == "/up" } }

  # Railway Frontend 최적화
  # Asset 파이프라인 최적화 - Tailwind를 위해 compile 활성화
  config.assets.compile = true
  config.assets.digest = true
  config.assets.version = '1.0'
  
  # Gzip 압축 활성화
  config.middleware.use Rack::Deflater

  # 보안 헤더 설정 (CSP는 별도 설정)
  config.force_ssl_exceptions = ["/up", "/assets"]
  
  # 세션 보안 강화
  config.session_store :cookie_store,
    key: '_hospital_frontend_session',
    secure: true,
    httponly: true,
    same_site: :lax,
    expire_after: 24.hours

  # Railway 환경 변수 검증
  required_env_vars = %w[BACKEND_API_URL]
  missing_vars = required_env_vars.select { |var| ENV[var].blank? }
  
  if missing_vars.any? && !ENV['RAILS_GROUPS'] == 'assets'
    Rails.logger.error "Missing required environment variables: #{missing_vars.join(', ')}"
  end

  # CSP 완전 비활성화 (경고 제거)
  config.content_security_policy_report_only = false
end
