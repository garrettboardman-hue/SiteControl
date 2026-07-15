CREATE TABLE `api_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`key` text NOT NULL,
	`prefix` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_used_at` text,
	`expires_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`shipment_id` text,
	`document_type` text NOT NULL,
	`filename` text NOT NULL,
	`original_path` text NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`error_message` text,
	`processed_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shipment_id`) REFERENCES `shipments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `extractions` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`field_name` text NOT NULL,
	`field_value` text NOT NULL,
	`confidence` real DEFAULT 0 NOT NULL,
	`is_verified` integer DEFAULT false NOT NULL,
	`verified_by` text,
	`verified_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `processing_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`event` text NOT NULL,
	`details` text,
	`level` text DEFAULT 'info' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`reference` text,
	`origin` text,
	`destination` text,
	`carrier` text,
	`vessel` text,
	`voyage` text,
	`container_number` text,
	`seal_number` text,
	`weight` real,
	`weight_unit` text,
	`volume` real,
	`volume_unit` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `validation_results` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`field_name` text NOT NULL,
	`severity` text DEFAULT 'warning' NOT NULL,
	`rule_name` text NOT NULL,
	`message` text NOT NULL,
	`expected_value` text,
	`actual_value` text,
	`is_resolved` integer DEFAULT false NOT NULL,
	`resolved_by` text,
	`resolved_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`resolved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `webhooks` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`url` text NOT NULL,
	`secret` text NOT NULL,
	`events` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_triggered_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `api_keys_key_unique` ON `api_keys` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);