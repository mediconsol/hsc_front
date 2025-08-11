# Rails 8 Asset Precompile Configuration
# Prevents database connections and Active Record initialization during asset compilation

if ENV['RAILS_GROUPS'] == 'assets'
  Rails.application.configure do
    # Completely disable Active Record during asset precompilation
    config.active_record.maintain_test_schema = false
    config.active_record.database_tasks = false
    config.active_record.dump_schema_after_migration = false
    
    # Disable database migration checks
    config.active_record.check_pending_migrations = false
    
    # Skip all database-dependent initializers
    config.eager_load = false
    config.cache_classes = true
    
    # Disable ActionCable (may depend on database)
    config.action_cable.disable_request_forgery_protection = true
    
    # Skip mailer configuration that might depend on database
    config.action_mailer.perform_deliveries = false
    config.action_mailer.raise_delivery_errors = false
  end

  # Override Active Record methods to prevent database access
  module ActiveRecord
    class Base
      def self.connection
        raise "Database access disabled during asset precompilation"
      end
      
      def self.establish_connection(*args)
        # Do nothing during asset precompilation
      end
    end
  end

  # Prevent database adapter loading
  ActiveSupport.on_load(:active_record) do
    # Skip all Active Record setup during asset precompilation
  end
end