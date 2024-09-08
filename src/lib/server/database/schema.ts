import { pgTable, index, unique, pgEnum, serial, varchar, text, integer, foreignKey, boolean, timestamp, bigint, smallint, type AnyPgColumn, uniqueIndex, char } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn', 'phone'])
export const oneTimeTokenType = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])
export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])


export const divisions = pgTable("divisions", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 20 }).notNull(),
	description: text("description"),
	providerId: integer("provider_id").notNull(),
	tournamentId: integer("tournament_id").notNull(),
	groups: integer("groups"),
},
(table) => {
	return {
		lowerIdx: index("divisions_lower_idx").using("btree", sql`lower((name)::text)`),
		divisionsTournamentIdKey: unique("divisions_tournament_id_key").on(table.tournamentId),
	}
});

export const games = pgTable("games", {
	id: serial("id").primaryKey().notNull(),
	shortCode: varchar("short_code", { length: 100 }).notNull(),
	winnerId: integer("winner_id").references(() => teams.id),
	loserId: integer("loser_id").references(() => teams.id),
	seriesId: integer("series_id").notNull().references(() => series.id),
	resultId: integer("result_id").references(() => results.id),
	gameNum: integer("game_num"),
	processed: boolean("processed").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const performances = pgTable("performances", {
	id: serial("id").primaryKey().notNull(),
	playerId: integer("player_id").references(() => players.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	teamId: integer("team_id").references(() => teams.id),
	divisionId: integer("division_id").references(() => divisions.id),
	gameId: integer("game_id").references(() => games.id),
},
(table) => {
	return {
		performancesPlayerIdGameIdKey: unique("performances_player_id_game_id_key").on(table.playerId, table.gameId),
	}
});

export const results = pgTable("results", {
	id: serial("id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startTime: bigint("start_time", { mode: "number" }),
	shortCode: varchar("short_code", { length: 100 }).notNull(),
	metaData: text("meta_data").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameId: bigint("game_id", { mode: "number" }),
	gameName: varchar("game_name", { length: 60 }),
	gameType: varchar("game_type", { length: 20 }),
	gameMap: integer("game_map"),
	gameMode: varchar("game_mode", { length: 20 }),
	region: varchar("region", { length: 20 }),
},
(table) => {
	return {
		uqShortCode: unique("uq_short_code").on(table.shortCode),
	}
});

export const series = pgTable("series", {
	id: serial("id").primaryKey().notNull(),
	team1Id: integer("team1_id").references(() => teams.id),
	team2Id: integer("team2_id").references(() => teams.id),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	messageId: bigint("message_id", { mode: "number" }),
	playoffs: boolean("playoffs").notNull(),
	winCondition: integer("win_condition").notNull(),
	winnerId: integer("winner_id").references(() => teams.id),
},
(table) => {
	return {
		seriesTeam1IdTeam2IdPlayoffsKey: unique("series_team1_id_team2_id_playoffs_key").on(table.team1Id, table.team2Id, table.playoffs),
	}
});

export const playerData = pgTable("player_data", {
	id: serial("id").primaryKey().notNull(),
	kills: integer("kills").default(0).notNull(),
	deaths: integer("deaths").default(0).notNull(),
	assists: integer("assists").default(0).notNull(),
	level: integer("level").default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gold: bigint("gold", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	visionScore: bigint("vision_score", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	damage: bigint("damage", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	healing: bigint("healing", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shielding: bigint("shielding", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	damageTaken: bigint("damage_taken", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	selfMitigatedDamage: bigint("self_mitigated_damage", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	damageToTurrets: bigint("damage_to_turrets", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	longestLife: bigint("longest_life", { mode: "number" }).default(0).notNull(),
	doubleKills: smallint("double_kills").default(0).notNull(),
	tripleKills: smallint("triple_kills").default(0).notNull(),
	quadraKills: smallint("quadra_kills").default(0).notNull(),
	pentaKills: smallint("penta_kills").default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameLength: bigint("game_length", { mode: "number" }).default(0).notNull(),
	win: boolean("win"),
	cs: integer("cs").default(0),
	championName: text("champion_name"),
	teamKills: integer("team_kills").default(0),
	shortCode: varchar("short_code", { length: 100 }),
	performanceId: integer("performance_id").references(() => performances.id),
});

export const players = pgTable("players", {
	id: serial("id").primaryKey().notNull(),
	primaryRiotPuuid: char("primary_riot_puuid", { length: 78 }).notNull(),
	teamId: integer("team_id").references((): AnyPgColumn => teams.id),
	summonerName: varchar("summoner_name", { length: 40 }),
},
(table) => {
	return {
		primaryRiotPuuidIdx: uniqueIndex("players_primary_riot_puuid_idx").using("btree", table.primaryRiotPuuid),
		playersPrimaryRiotPuuidKey: unique("players_primary_riot_puuid_key").on(table.primaryRiotPuuid),
		playersSummonerNameKey: unique("players_summoner_name_key").on(table.summonerName),
	}
});

export const standings = pgTable("standings", {
	id: serial("id").primaryKey().notNull(),
	placement: integer("placement").notNull(),
	divisionId: integer("division_id").notNull(),
	groupId: char("group_id", { length: 1 }).notNull(),
	teamId: integer("team_id").notNull().references(() => teams.id),
});

export const schedules = pgTable("schedules", {
	id: serial("id").primaryKey().notNull(),
	week: integer("week").notNull(),
	divisionId: integer("division_id").notNull().references(() => divisions.id),
	groupId: char("group_id", { length: 1 }).notNull(),
	seriesId: integer("series_id").notNull().references(() => series.id),
});

export const teams = pgTable("teams", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	divisionId: integer("division_id").references(() => divisions.id),
	groupId: char("group_id", { length: 1 }).notNull(),
	captainId: integer("captain_id").references((): AnyPgColumn => players.id),
	logo: varchar("logo"),
},
(table) => {
	return {
		lowerIdx: index("teams_lower_idx").using("btree", sql`lower((name)::text)`),
	}
});

export const accounts = pgTable("accounts", {
	id: serial("id").primaryKey().notNull(),
	riotPuuid: char("riot_puuid", { length: 78 }).notNull(),
	playerId: integer("player_id").notNull().references(() => players.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	isPrimary: boolean("is_primary").notNull(),
});