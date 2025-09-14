CREATE TABLE `matches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user1_id` integer NOT NULL,
	`user2_id` integer NOT NULL,
	`matched_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`match_id` integer NOT NULL,
	`sender_id` integer NOT NULL,
	`content` text NOT NULL,
	`sent_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`bio` text,
	`interests` text,
	`location` text,
	`avatar_url` text,
	`premium` integer DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`display_name` text NOT NULL,
	`gender` text,
	`birth_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);