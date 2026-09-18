-- Fixes the wording of the already-published launch post:
-- "Championship Night" -> "Playoffs Night", and clarifies 25 games total.
-- Run via phpMyAdmin's SQL tab against fzlgd192_mihl_league.

UPDATE `news_posts`
SET `body_html` = '<p>Puck drop is almost here. The Menshes Ice Hockey League returns for the 2026&ndash;27 season on Saturday, September 19th &mdash; and registration is open right now.</p><p>Here&rsquo;s what&rsquo;s new this year: 25 games total &mdash; a full 24-game regular season split evenly across Samuel Moscovitch Arena and Memorial Rink, four competitive teams, and Playoffs Night to close out the year on April 17th, when the top two teams battle for the Championship and third and fourth square off for bragging rights.</p><p>Whether you&rsquo;re a returning veteran or lacing up with us for the first time, there&rsquo;s a spot for you. Registration takes just a few minutes &mdash; pick your position, jersey size, and payment plan, and once you&rsquo;re approved you&rsquo;ll get your invite to the team Spond group with your schedule and roster.</p><p>Spots are limited and fill up fast. Register today and we&rsquo;ll see you on the ice.</p>'
WHERE `title` LIKE 'Puck Drop is Almost Here%';
