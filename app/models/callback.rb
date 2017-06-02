class Callback
  def self.after_find(course)
    puts "CALLBACK CALLED BACK!!!"
    puts "This Course"
    require 'json'
    tempHash = {
      "key_a" => "val_a",
      "key_b" => "val_b"
    }
    File.open("temp.json","w") do |f|
      f.write(tempHash.to_json)
    end
  end
end