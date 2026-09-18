-- MIHL Portal — v3 update
-- Run this ONCE via phpMyAdmin's SQL tab against fzlgd192_mihl_league.
-- This replaces the earlier blank seed-data.sql: it clears out the old
SET NAMES utf8mb4;
-- teams/venues/games (which had no real matchups) and reloads everything
-- with real matchups, playoff games, and adds the columns the new code needs.

-- 1. Schema additions
ALTER TABLE `games` ADD COLUMN IF NOT EXISTS `label` VARCHAR(100);

ALTER TABLE `staff_applications` MODIFY COLUMN `user_id` INT NULL;
ALTER TABLE `staff_applications` ADD COLUMN IF NOT EXISTS `applicant_email` VARCHAR(255);
ALTER TABLE `staff_applications` ADD COLUMN IF NOT EXISTS `applicant_first_name` VARCHAR(100);
ALTER TABLE `staff_applications` ADD COLUMN IF NOT EXISTS `applicant_last_name` VARCHAR(100);
ALTER TABLE `staff_applications` ADD COLUMN IF NOT EXISTS `applicant_phone` VARCHAR(30);

-- 1b. Fix character set -- the original tables were created without an
--     explicit charset and defaulted to latin1, which mangles special
--     characters (em dashes, curly quotes, accents). Convert to utf8mb4.
ALTER TABLE `users` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `teams` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `venues` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `registrations` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `staff_applications` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `games` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `game_stats` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `news_posts` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `stars_of_week` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Clear out the old blank-matchup games/teams/venues (safe pre-launch --
--    no registrations or stats reference these yet)
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM `game_stats`;
DELETE FROM `games`;
DELETE FROM `registrations` WHERE `team_id` IS NOT NULL;
DELETE FROM `teams`;
DELETE FROM `venues`;
ALTER TABLE `games` AUTO_INCREMENT = 1;
ALTER TABLE `teams` AUTO_INCREMENT = 1;
ALTER TABLE `venues` AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. Teams and venues
INSERT INTO `teams` (`name`, `logo_url`) VALUES
  ('Iron Lions', '/logos/iron-lions.png'),
  ('Golan Guards', '/logos/golan-guards.png'),
  ('H Hammers', '/logos/h-hammers.png'),
  ('Schvitz Saints', '/logos/schvitz-saints.png');

INSERT INTO `venues` (`name`) VALUES
  ('Samuel Moscovitch Arena'),
  ('Memorial Rink (Montreal West)');

-- 4. Full 24-game balanced regular season + Playoffs Night
--    Team IDs: 1=Iron Lions, 2=Golan Guards, 3=H Hammers, 4=Schvitz Saints
--    Venue IDs: 1=Samuel Moscovitch Arena, 2=Memorial Rink
INSERT INTO `games` (`game_date`,`game_time`,`venue_id`,`home_team_id`,`away_team_id`,`label`) VALUES
('2026-09-19','21:30:00',1,1,2,NULL),
('2026-09-19','21:30:00',2,3,4,NULL),
('2026-10-10','21:30:00',1,2,4,NULL),
('2026-10-10','21:30:00',2,1,3,NULL),
('2026-10-17','21:30:00',1,1,4,NULL),
('2026-10-17','21:30:00',2,2,3,NULL),
('2026-10-24','21:30:00',1,3,4,NULL),
('2026-10-24','21:30:00',2,1,2,NULL),
('2026-10-31','21:30:00',1,1,3,NULL),
('2026-10-31','21:30:00',2,2,4,NULL),
('2026-11-07','21:30:00',1,2,3,NULL),
('2026-11-07','21:30:00',2,1,4,NULL),
('2026-11-14','21:30:00',1,1,2,NULL),
('2026-11-14','21:30:00',2,3,4,NULL),
('2026-11-21','21:30:00',1,2,4,NULL),
('2026-11-21','21:30:00',2,1,3,NULL),
('2026-11-28','21:30:00',1,1,4,NULL),
('2026-11-28','21:30:00',2,2,3,NULL),
('2026-12-05','21:30:00',1,3,4,NULL),
('2026-12-05','21:30:00',2,1,2,NULL),
('2026-12-12','21:30:00',1,1,3,NULL),
('2026-12-12','21:30:00',2,2,4,NULL),
('2026-12-19','21:30:00',1,2,3,NULL),
('2026-12-19','21:30:00',2,1,4,NULL),
('2027-01-09','21:30:00',1,1,2,NULL),
('2027-01-09','21:30:00',2,3,4,NULL),
('2027-01-16','21:30:00',1,2,4,NULL),
('2027-01-16','21:30:00',2,1,3,NULL),
('2027-01-23','21:30:00',1,1,4,NULL),
('2027-01-23','21:30:00',2,2,3,NULL),
('2027-02-06','21:30:00',1,3,4,NULL),
('2027-02-06','21:30:00',2,1,2,NULL),
('2027-02-13','21:30:00',1,1,3,NULL),
('2027-02-13','21:30:00',2,2,4,NULL),
('2027-02-20','21:30:00',1,2,3,NULL),
('2027-02-20','21:30:00',2,1,4,NULL),
('2027-03-06','21:30:00',1,1,2,NULL),
('2027-03-06','21:30:00',2,3,4,NULL),
('2027-03-13','21:30:00',1,2,4,NULL),
('2027-03-13','21:30:00',2,1,3,NULL),
('2027-03-20','21:30:00',1,1,4,NULL),
('2027-03-20','21:30:00',2,2,3,NULL),
('2027-03-27','21:30:00',1,3,4,NULL),
('2027-03-27','21:30:00',2,1,2,NULL),
('2027-04-03','21:30:00',1,1,3,NULL),
('2027-04-03','21:30:00',2,2,4,NULL),
('2027-04-10','21:30:00',1,2,3,NULL),
('2027-04-10','21:30:00',2,1,4,NULL),
('2027-04-17','21:30:00',1,NULL,NULL,'Championship Game'),
('2027-04-17','21:30:00',2,NULL,NULL,'3rd Place Game');

-- 5. Season-launch news post (published immediately)
INSERT INTO `news_posts` (`title`, `body_html`, `is_auto_generated`, `status`, `published_at`) VALUES
('Puck Drop is Almost Here — 2026-27 Season Registration is Open',
'<p>Puck drop is almost here. The Menshes Ice Hockey League returns for the 2026&ndash;27 season on Saturday, September 19th &mdash; and registration is open right now.</p><p>Here&rsquo;s what&rsquo;s new this year: a full 24-game regular season split evenly across Samuel Moscovitch Arena and Memorial Rink, four competitive teams, and Playoffs Night to close out the year on April 17th, when the top two teams battle for the Championship and third and fourth square off for bragging rights.</p><p>Whether you&rsquo;re a returning veteran or lacing up with us for the first time, there&rsquo;s a spot for you. Registration takes just a few minutes &mdash; pick your position, jersey size, and payment plan, and once you&rsquo;re approved you&rsquo;ll get your invite to the team Spond group with your schedule and roster.</p><p>Spots are limited and fill up fast. Register today and we&rsquo;ll see you on the ice.</p>',
0, 'published', NOW());
