-- MIHL Portal — schema update + full season schedule
-- Run this via phpMyAdmin's SQL tab against fzlgd192_mihl_league
-- (Run this INSTEAD of the old seed-data.sql, not in addition to it,
-- unless you already ran the old one -- in that case just run the
-- ALTER TABLE line and the INSERT INTO games lines below.)

-- 1. Add the new "label" column (for "Championship Game" / "3rd Place Game")
ALTER TABLE `games` ADD COLUMN `label` VARCHAR(100);

-- 2. Teams and venues
INSERT INTO `teams` (`name`, `logo_url`) VALUES
  ('Iron Lions', '/logos/iron-lions.png'),
  ('Golan Guards', '/logos/golan-guards.png'),
  ('H Hammers', '/logos/h-hammers.png'),
  ('Schvitz Saints', '/logos/schvitz-saints.png');

INSERT INTO `venues` (`name`) VALUES
  ('Samuel Moscovitch Arena'),
  ('Memorial Rink (Montreal West)');

-- 3. Full 24-game regular season, balanced: every team plays 24 games,
--    12 at each rink, 8 against each opponent -- plus Championship Night.
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
