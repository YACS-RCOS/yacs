class BaseSweeper < ActionController::Caching::Sweeper
  def after_save record
    expire_data record
  end
 
  def after_destroy record
    expire_data record
  end

  protected
  def expire_data record
    @controller ||= Api::V5::ApiController.new
  end
end
