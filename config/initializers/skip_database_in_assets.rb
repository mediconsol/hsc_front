# Enhanced database isolation during asset precompilation for Rails 8
if ENV['RAILS_GROUPS'] == 'assets'
  Rails.application.configure do
    # Completely disable Active Record during asset precompilation
    config.active_record.database_tasks = false
    config.active_record.maintain_test_schema = false
    config.active_record.dump_schema_after_migration = false
    config.active_record.check_pending_migrations = false
    
    # Skip loading models and database-dependent initializers
    config.eager_load = false
    config.cache_classes = true
    
    # Disable mailer configuration that might depend on database
    config.action_mailer.perform_deliveries = false
    config.action_mailer.raise_delivery_errors = false
  end

  # Override database connection during asset precompilation
  class ActiveRecord::Base
    def self.connection
      raise "Database connection disabled during asset precompilation"
    end
    
    def self.establish_connection(*args)
      # No-op during asset precompilation
    end
  end
end