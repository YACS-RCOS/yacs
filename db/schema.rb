# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180621004610) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "courses", id: :serial, force: :cascade do |t|
    t.integer "number", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "uuid", null: false
    t.string "tags", default: [], null: false, array: true
    t.integer "subject_id", null: false
    t.index ["tags"], name: "index_courses_on_tags"
    t.index ["uuid"], name: "index_courses_on_uuid"
  end

  create_table "crono_jobs", id: :serial, force: :cascade do |t|
    t.string "job_id", null: false
    t.text "log"
    t.datetime "last_performed_at"
    t.boolean "healthy"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_crono_jobs_on_job_id", unique: true
  end

  create_table "departments", id: :serial, force: :cascade do |t|
    t.string "shortname", null: false
    t.string "longname", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "school_id"
    t.uuid "uuid", null: false
    t.index ["shortname"], name: "index_departments_on_shortname", unique: true
    t.index ["uuid"], name: "index_departments_on_uuid"
  end

  create_table "instructors", force: :cascade do |t|
    t.string "longname", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "listings", force: :cascade do |t|
    t.integer "session_id", null: false
    t.integer "course_id", null: false
    t.string "longname", null: false
    t.text "description", null: false
    t.integer "min_credits", null: false
    t.integer "max_credits", null: false
    t.boolean "active", default: false, null: false
    t.jsonb "auto_attributes", default: "{}", null: false
    t.jsonb "override_attributes", default: "{}", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["longname"], name: "index_listings_on_longname"
  end

  create_table "schools", id: :serial, force: :cascade do |t|
    t.string "longname", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "uuid", null: false
    t.index ["uuid"], name: "index_schools_on_uuid"
  end

  create_table "sections", id: :serial, force: :cascade do |t|
    t.string "shortname", null: false
    t.integer "crn", null: false
    t.integer "seats", null: false
    t.integer "seats_taken", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "conflict_ids", default: [], null: false, array: true
    t.uuid "uuid", null: false
    t.jsonb "periods", default: "{}", null: false
    t.index ["uuid"], name: "index_sections_on_uuid"
  end

  create_table "sessions", force: :cascade do |t|
    t.string "shortname", null: false
    t.string "longname", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "subjects", force: :cascade do |t|
    t.integer "department_id", null: false
    t.string "shortname", null: false
    t.string "longname", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
