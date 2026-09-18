-- MIHL Portal — initial schema
SET NAMES utf8mb4;
-- Import this directly via phpMyAdmin into fzlgd192_mihl_league

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30),
  `role` ENUM('player','staff','admin') NOT NULL DEFAULT 'player',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `teams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `logo_url` VARCHAR(500),
  `is_final` BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `venues` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `address` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `jersey_number_pref` INT,
  `position` ENUM('forward','defense','goalie') NOT NULL,
  `jersey_size` ENUM('M','L','XL','XXL','XXXL') NOT NULL,
  `waiver_accepted` BOOLEAN NOT NULL DEFAULT FALSE,
  `payment_plan` ENUM('full','split') NOT NULL,
  `status` ENUM('pending','approved','waitlisted','rejected') NOT NULL DEFAULT 'pending',
  `team_id` INT,
  `payment_status` ENUM('unpaid','deposit_paid','paid_in_full') NOT NULL DEFAULT 'unpaid',
  `spond_email_sent_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` TIMESTAMP NULL,
  `reviewed_by_user_id` INT,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`),
  FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `staff_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `staff_role` ENUM('referee','scorekeeper') NOT NULL,
  `status` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` TIMESTAMP NULL,
  `reviewed_by_user_id` INT,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `games` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `game_date` DATE NOT NULL,
  `game_time` TIME NOT NULL,
  `venue_id` INT NOT NULL,
  `home_team_id` INT,
  `away_team_id` INT,
  `home_score` INT,
  `away_score` INT,
  `status` ENUM('scheduled','final','cancelled') NOT NULL DEFAULT 'scheduled',
  `referee_user_id` INT,
  `scorekeeper_user_id` INT,
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`),
  FOREIGN KEY (`home_team_id`) REFERENCES `teams`(`id`),
  FOREIGN KEY (`away_team_id`) REFERENCES `teams`(`id`),
  FOREIGN KEY (`referee_user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`scorekeeper_user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `game_stats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `game_id` INT NOT NULL,
  `player_user_id` INT NOT NULL,
  `team_id` INT NOT NULL,
  `goals` INT NOT NULL DEFAULT 0,
  `assists` INT NOT NULL DEFAULT 0,
  `penalty_minutes` INT NOT NULL DEFAULT 0,
  `shots_against` INT,
  `saves` INT,
  FOREIGN KEY (`game_id`) REFERENCES `games`(`id`),
  FOREIGN KEY (`player_user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `news_posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `body_html` TEXT NOT NULL,
  `is_auto_generated` BOOLEAN NOT NULL DEFAULT FALSE,
  `status` ENUM('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `published_at` TIMESTAMP NULL,
  `author_user_id` INT,
  FOREIGN KEY (`author_user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `stars_of_week` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `week_start_date` DATE NOT NULL,
  `player_user_id` INT NOT NULL,
  `team_id` INT,
  `note` VARCHAR(500),
  `status` ENUM('draft','approved') NOT NULL DEFAULT 'draft',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at` TIMESTAMP NULL,
  `approved_by_user_id` INT,
  FOREIGN KEY (`player_user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`),
  FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
