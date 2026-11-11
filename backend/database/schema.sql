SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NULL,
  color VARCHAR(255) NOT NULL DEFAULT '#4CAF50',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  group_name VARCHAR(255) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permission_role (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id BIGINT UNSIGNED NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY permission_role_unique (role_id, permission_id),
  CONSTRAINT permission_role_role_fk FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT permission_role_permission_fk FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role_id BIGINT UNSIGNED NULL,
  email_verified_at TIMESTAMP NULL,
  password VARCHAR(255) NOT NULL,
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT users_role_fk FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  email VARCHAR(255) PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS students (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  phone VARCHAR(255) NULL,
  dob DATE NULL,
  address TEXT NULL,
  profile_image VARCHAR(255) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY students_user_unique (user_id),
  CONSTRAINT students_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS teachers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  phone VARCHAR(255) NULL,
  bio TEXT NULL,
  specialization VARCHAR(255) NULL,
  profile_image VARCHAR(255) NULL,
  card_image VARCHAR(255) NULL,
  instagram_link VARCHAR(255) NULL,
  facebook_link VARCHAR(255) NULL, facebook_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  instagram_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  whatsapp_number VARCHAR(255) NULL, whatsapp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  phone_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  linkedin_link VARCHAR(255) NULL, linkedin_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  youtube_link VARCHAR(255) NULL, youtube_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  telegram_link VARCHAR(255) NULL, telegram_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  website_link VARCHAR(255) NULL, website_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  twitter_link VARCHAR(255) NULL, twitter_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  mail_link VARCHAR(255) NULL, mail_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY teachers_user_unique (user_id),
  CONSTRAINT teachers_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS courses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image VARCHAR(255) NULL,
  monthly_fee DECIMAL(8,2) NOT NULL,
  duration VARCHAR(255) NOT NULL,
  level ENUM('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  type VARCHAR(255) NOT NULL DEFAULT 'Certified Course',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_admissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_number VARCHAR(255) NULL UNIQUE,
  user_id BIGINT UNSIGNED NULL,
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  residence_phone VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  address TEXT NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  student_photo VARCHAR(255) NULL,
  aadhaar_card VARCHAR(255) NULL,
  emergency_contact_name VARCHAR(255) NOT NULL,
  emergency_contact_relationship VARCHAR(255) NULL,
  emergency_contact_number VARCHAR(20) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  parent_contact_number VARCHAR(20) NOT NULL,
  parent_address TEXT NULL,
  parent_pincode VARCHAR(255) NULL,
  occupation VARCHAR(255) NULL,
  office_address TEXT NULL,
  course_instrument VARCHAR(255) NOT NULL,
  course_type VARCHAR(255) NULL,
  preferred_instructor VARCHAR(255) NULL,
  preferred_class_timing VARCHAR(255) NULL,
  start_date DATE NULL,
  payment_mode VARCHAR(255) NOT NULL,
  music_experience VARCHAR(255) NULL,
  previous_music_class VARCHAR(255) NULL,
  previous_music_class_name VARCHAR(255) NULL,
  learning_reason TEXT NOT NULL,
  medical_conditions TEXT NULL,
  hear_about_us VARCHAR(255) NULL,
  declaration_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
  digital_signature LONGTEXT NOT NULL,
  signature_date TIMESTAMP NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  payment_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_status VARCHAR(255) NOT NULL DEFAULT 'pending',
  razorpay_order_id VARCHAR(255) NULL,
  receipt_number VARCHAR(255) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  KEY admissions_user_idx (user_id),
  CONSTRAINT admissions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payment_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NULL,
  is_deletable BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admission_id BIGINT UNSIGNED NULL,
  user_id BIGINT UNSIGNED NULL,
  razorpay_payment_id VARCHAR(255) NULL,
  razorpay_order_id VARCHAR(255) NULL,
  razorpay_signature VARCHAR(255) NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  payment_method VARCHAR(255) NULL,
  status ENUM('pending','successful','failed') NOT NULL DEFAULT 'pending',
  payment_category_id BIGINT UNSIGNED NULL,
  gateway_response JSON NULL,
  paid_at TIMESTAMP NULL,
  payable_id BIGINT UNSIGNED NULL,
  payable_type VARCHAR(255) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  KEY payments_admission_idx (admission_id),
  KEY payments_payable_idx (payable_id, payable_type),
  CONSTRAINT payments_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT payments_category_fk FOREIGN KEY (payment_category_id) REFERENCES payment_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS receipts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admission_id BIGINT UNSIGNED NOT NULL,
  payment_id BIGINT UNSIGNED NULL,
  receipt_number VARCHAR(255) NOT NULL UNIQUE,
  receipt_date TIMESTAMP NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  pdf_path VARCHAR(255) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT receipts_admission_fk FOREIGN KEY (admission_id) REFERENCES student_admissions(id) ON DELETE CASCADE,
  CONSTRAINT receipts_payment_fk FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attendances (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  status ENUM('present','absent','late','excused','leave') NOT NULL DEFAULT 'present',
  remarks TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT attendances_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT attendances_course_fk FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) NOT NULL UNIQUE,
  `value` TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NULL,
  testimonial TEXT NOT NULL,
  image VARCHAR(255) NULL,
  display_order INT NOT NULL DEFAULT 0,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inquiries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NULL,
  message TEXT NOT NULL,
  status ENUM('new','read','replied') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NULL,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  media_type ENUM('image','video') NOT NULL DEFAULT 'image',
  media_path VARCHAR(255) NOT NULL,
  thumbnail_path VARCHAR(255) NULL,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT gallery_items_category_fk FOREIGN KEY (category_id) REFERENCES gallery_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NULL,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blogs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  category_id BIGINT UNSIGNED NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NULL,
  featured_image VARCHAR(255) NULL,
  hero_image VARCHAR(255) NULL,
  content LONGTEXT NOT NULL,
  author_name VARCHAR(255) NULL,
  author_designation VARCHAR(255) NULL,
  reading_time INT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  enable_drop_cap BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  seo_title VARCHAR(255) NULL,
  seo_description TEXT NULL,
  seo_keywords TEXT NULL,
  og_image VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT blogs_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT blogs_category_fk FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
  KEY blogs_status_published_idx (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description LONGTEXT NULL,
  event_type VARCHAR(255) NOT NULL,
  banner_image VARCHAR(255) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  venue_address VARCHAR(255) NULL,
  google_maps_link VARCHAR(255) NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NULL,
  registration_deadline DATETIME NULL,
  max_participants INT NULL,
  available_seats INT NULL,
  button_text VARCHAR(255) NULL,
  button_url VARCHAR(255) NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  registration_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  KEY events_date_idx (event_date), KEY events_featured_idx (is_featured), KEY events_status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event_gallery (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id BIGINT UNSIGNED NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT event_gallery_event_fk FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event_registrations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT event_registrations_event_fk FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jam_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_number VARCHAR(255) NOT NULL UNIQUE,
  session_type VARCHAR(255) NOT NULL,
  session_name VARCHAR(255) NULL,
  session_description TEXT NULL,
  genre VARCHAR(255) NULL,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration INT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
  booker_name VARCHAR(255) NOT NULL,
  booker_email VARCHAR(255) NOT NULL,
  booker_mobile VARCHAR(255) NOT NULL,
  booker_age INT NULL,
  booker_city VARCHAR(255) NULL,
  booker_state VARCHAR(255) NULL,
  booker_country VARCHAR(255) NULL,
  booker_experience_level VARCHAR(255) NULL,
  instruments JSON NULL,
  objective TEXT NULL,
  special_requirements TEXT NULL,
  tech_rider_path VARCHAR(255) NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  razorpay_order_id VARCHAR(255) NULL,
  razorpay_payment_id VARCHAR(255) NULL,
  receipt_number VARCHAR(255) NULL,
  payment_date TIMESTAMP NULL,
  payment_amount DECIMAL(10,2) NULL,
  payment_method VARCHAR(255) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  KEY jam_session_slot_idx (session_date, session_time, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS participants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  jam_session_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  mobile VARCHAR(255) NULL,
  instrument VARCHAR(255) NULL,
  experience_level VARCHAR(255) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT participants_jam_fk FOREIGN KEY (jam_session_id) REFERENCES jam_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jam_session_payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  jam_session_id BIGINT UNSIGNED NOT NULL,
  razorpay_order_id VARCHAR(255) NULL,
  razorpay_payment_id VARCHAR(255) NULL,
  razorpay_signature VARCHAR(255) NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(255) NULL,
  gateway_response JSON NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT jam_payments_session_fk FOREIGN KEY (jam_session_id) REFERENCES jam_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS expense_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS expenses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  expense_category_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT NULL,
  receipt_path VARCHAR(255) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT expenses_category_fk FOREIGN KEY (expense_category_id) REFERENCES expense_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO roles (name, description, color, created_at, updated_at) VALUES
('Super Admin','Full system access','#d4af37',NOW(),NOW()),('Admin','Administration access','#4f145b',NOW(),NOW()),('Instructor','Instructor account','#00E5FF',NOW(),NOW()),('Student','Student account','#4CAF50',NOW(),NOW());

INSERT IGNORE INTO payment_categories (name, description, is_deletable, created_at, updated_at) VALUES
('Admission Fee',NULL,FALSE,NOW(),NOW()),('Jam Session Booking',NULL,FALSE,NOW(),NOW()),('Course Fee',NULL,FALSE,NOW(),NOW());
