# Skip database initialization during asset precompilation
if defined?(Rails) && Rails.env.production?
  Rails.application.configure do
    # Only initialize database if not precompiling assets
    unless ENV['RAILS_GROUPS'] == 'assets'
      config.active_record.dump_schema_after_migration = false
    end
  end
end