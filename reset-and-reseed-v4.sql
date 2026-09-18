-- MIHL Portal — v4 update: 2 teams, single venue
-- Run via phpMyAdmin's SQL tab against fzlgd192_mihl_league.
-- Replaces the 4-team/2-venue schedule with: Iron Lions vs Golan Guards
-- only, all games at Samuel Moscovitch Arena, an evaluation game
-- (White vs Black) on Sep 19, and a Championship Game finale on Apr 17.
SET NAMES utf8mb4;

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

-- Teams: only Iron Lions and Golan Guards remain
INSERT INTO `teams` (`name`, `logo_url`) VALUES
  ('Iron Lions', '/logos/iron-lions.png'),
  ('Golan Guards', '/logos/golan-guards.png');

-- Venue: Samuel Moscovitch Arena only
INSERT INTO `venues` (`name`) VALUES
  ('Samuel Moscovitch Arena');

-- 25 games: Sep 19 evaluation game (White vs Black, no team ids, doesn't
-- count toward standings), 23 regular Iron Lions vs Golan Guards games
-- alternating home/away, and the Apr 17 Championship Game.
-- Team IDs: 1=Iron Lions, 2=Golan Guards. Venue ID: 1=Samuel Moscovitch.
INSERT INTO `games` (`game_date`,`game_time`,`venue_id`,`home_team_id`,`away_team_id`,`label`) VALUES
('2026-09-19','21:30:00',1,NULL,NULL,'Evaluation Game: White vs Black'),
('2026-10-10','21:30:00',1,2,1,NULL),
('2026-10-17','21:30:00',1,1,2,NULL),
('2026-10-24','21:30:00',1,2,1,NULL),
('2026-10-31','21:30:00',1,1,2,NULL),
('2026-11-07','21:30:00',1,2,1,NULL),
('2026-11-14','21:30:00',1,1,2,NULL),
('2026-11-21','21:30:00',1,2,1,NULL),
('2026-11-28','21:30:00',1,1,2,NULL),
('2026-12-05','21:30:00',1,2,1,NULL),
('2026-12-12','21:30:00',1,1,2,NULL),
('2026-12-19','21:30:00',1,2,1,NULL),
('2027-01-09','21:30:00',1,1,2,NULL),
('2027-01-16','21:30:00',1,2,1,NULL),
('2027-01-23','21:30:00',1,1,2,NULL),
('2027-02-06','21:30:00',1,2,1,NULL),
('2027-02-13','21:30:00',1,1,2,NULL),
('2027-02-20','21:30:00',1,2,1,NULL),
('2027-03-06','21:30:00',1,1,2,NULL),
('2027-03-13','21:30:00',1,2,1,NULL),
('2027-03-20','21:30:00',1,1,2,NULL),
('2027-03-27','21:30:00',1,2,1,NULL),
('2027-04-03','21:30:00',1,1,2,NULL),
('2027-04-10','21:30:00',1,2,1,NULL),
('2027-04-17','21:30:00',1,1,2,'Championship Game');
