CREATE TABLE users (
`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
`username` text,
`password` text
);
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);