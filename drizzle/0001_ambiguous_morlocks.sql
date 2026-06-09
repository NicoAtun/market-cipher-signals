CREATE TABLE `signals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol` varchar(32) NOT NULL,
	`direction` enum('long','short','watch') NOT NULL,
	`timeframe` enum('15m','4h','daily','weekly','monthly') NOT NULL,
	`price` varchar(32) NOT NULL,
	`signalType` varchar(64) NOT NULL,
	`indicatorSource` varchar(64) DEFAULT 'Market Cipher',
	`exchange` varchar(32) DEFAULT '',
	`notes` text,
	`priority` enum('very_high','high','medium_high','medium_low') NOT NULL,
	`rawPayload` json,
	`alertTimestamp` bigint,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `signals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhook_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(64) DEFAULT 'TradingView Webhook',
	`secret` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webhook_settings_id` PRIMARY KEY(`id`)
);
