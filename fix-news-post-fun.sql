-- Replaces the launch post with a more fun, emoji-filled, inviting version.
-- Run via phpMyAdmin's SQL tab against fzlgd192_mihl_league.

UPDATE `news_posts`
SET
  `title` = '🏒 Puck Drop is Almost Here — 2026-27 Registration is OPEN!',
  `body_html` = '<p>🚨 It''s that time again! The Menshes Ice Hockey League is BACK for the 2026&ndash;27 season, and puck drop is set for <strong>Saturday, September 19th</strong>. Registration is open right now &mdash; grab your spot before it&rsquo;s gone! 🥅</p><p>🔥 Here&rsquo;s the scoop on this season:</p><ul><li>🏆 <strong>25 games total</strong> &mdash; 24 regular-season battles plus a Playoffs Night finale on April 17th</li><li>📍 Two great rinks: Samuel Moscovitch Arena &amp; Memorial Rink (Montreal West)</li><li>⛸️ Four stacked teams ready to compete for the title</li><li>🎉 Championship Game AND a 3rd Place Game to close out the year in style</li></ul><p>Whether you&rsquo;re a returning legend or lacing up your skates with us for the very first time, there&rsquo;s a jersey with your name on it. Registration only takes a couple of minutes &mdash; pick your position, jersey size, and payment plan, and once you&rsquo;re approved you&rsquo;ll get your invite to the team Spond group with your schedule and roster. 📲</p><p>⏳ Spots are limited and they go fast every year. Don&rsquo;t wait &mdash; register today and we&rsquo;ll see you on the ice! 🥍🧊</p>',
  `published_at` = NOW()
WHERE `title` LIKE '%Puck Drop%';
