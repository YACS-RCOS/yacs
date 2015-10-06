# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20151006041418) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "courses", force: :cascade do |t|
    t.integer  "department_id", null: false
    t.string   "name",          null: false
    t.integer  "number",        null: false
    t.integer  "min_credits",   null: false
    t.integer  "max_credits",   null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "courses", ["department_id", "name"], name: "index_courses_on_department_id_and_name", unique: true, using: :btree
  add_index "courses", ["department_id", "number"], name: "index_courses_on_department_id_and_number", unique: true, using: :btree

  create_table "departments", force: :cascade do |t|
    t.string   "code",       null: false
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "departments", ["code"], name: "index_departments_on_code", unique: true, using: :btree

  create_table "sections", force: :cascade do |t|
    t.integer  "number",      null: false
    t.integer  "crn",         null: false
    t.integer  "course_id",   null: false
    t.integer  "semester_id", null: false
    t.integer  "seats",       null: false
    t.integer  "seats_taken", null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "sections", ["semester_id", "course_id", "number"], name: "index_sections_on_semester_id_and_course_id_and_number", unique: true, using: :btree
  add_index "sections", ["semester_id", "course_id"], name: "index_sections_on_semester_id_and_course_id", using: :btree
  add_index "sections", ["semester_id", "crn"], name: "index_sections_on_semester_id_and_crn", unique: true, using: :btree
  add_index "sections", ["semester_id"], name: "index_sections_on_semester_id", using: :btree

  create_table "semesters", force: :cascade do |t|
    t.string   "season",     null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "semesters", ["season"], name: "index_semesters_on_season", unique: true, using: :btree

end
