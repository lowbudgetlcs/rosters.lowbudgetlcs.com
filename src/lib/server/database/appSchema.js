import { pgTable, pgEnum, serial, bigint, char, text, integer, varchar, foreignKey, boolean, index, smallint } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3']);
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain']);
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified']);
export const factorType = pgEnum("factor_type", ['totp', 'webauthn']);
export const oneTimeTokenType = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token']);
export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired']);
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20']);
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR']);
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in']);


export const results = pgTable("results", {
  id: serial("id").primaryKey().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  startTime: bigint("start_time", { mode: "number" }),
  shortCode: char("short_code", { length: 44 }).notNull(),
  metaData: text("meta_data").notNull(),
  gameId: integer("game_id"),
  gameName: varchar("game_name", { length: 60 }),
  gameType: varchar("game_type", { length: 20 }),
  gameMap: varchar("game_map", { length: 20 }),
  gameMode: varchar("game_mode", { length: 20 }),
  region: varchar("region", { length: 20 }),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey().notNull(),
  riotPuuid: char("riot_puuid", { length: 78 }).notNull(),
  playerId: integer("player_id").notNull().references(() => players.id),
  isPrimary: boolean("is_primary").notNull(),
});

export const divisions = pgTable("divisions", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 20 }),
  description: text("description"),
  providerId: integer("provider_id").notNull(),
  tournamentId: integer("tournament_id").notNull(),
  groups: integer("groups"),
},
  (table) => {
    return {
      lowerIdx: index("divisions_lower_idx").using("btree", sql`lower((name)::text)`),
    };
  });

export const games = pgTable("games", {
  id: serial("id").primaryKey().notNull(),
  shortCode: char("short_code", { length: 44 }).notNull(),
  winnerId: integer("winner_id").references(() => teams.id),
  loserId: integer("loser_id").references(() => teams.id),
  seriesId: integer("series_id").notNull().references(() => series.id),
  resultId: integer("result_id").references(() => results.id),
});

export const performances = pgTable("performances", {
  id: serial("id").primaryKey().notNull(),
  playerId: integer("player_id").references(() => players.id),
  teamId: integer("team_id").references(() => teams.id),
  gameId: integer("game_id").references(() => games.id),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey().notNull(),
  primaryRiotPuuid: char("primary_riot_puuid", { length: 78 }).notNull(),
  teamId: integer("team_id").references(() => teams.id),
});

export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey().notNull(),
  week: integer("week").notNull(),
  divisionId: integer("division_id").notNull().references(() => divisions.id),
  groupId: char("group_id", { length: 1 }).notNull(),
  seriesId: integer("series_id").notNull().references(() => series.id),
});

export const series = pgTable("series", {
  id: serial("id").primaryKey().notNull(),
  team1Id: integer("team1_id").notNull().references(() => teams.id),
  team2Id: integer("team2_id").notNull().references(() => teams.id),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  messageId: bigint("message_id", { mode: "number" }),
  playoffs: boolean("playoffs").notNull(),
  winCondition: integer("win_condition").notNull(),
});

export const standings = pgTable("standings", {
  id: serial("id").primaryKey().notNull(),
  placement: integer("placement").notNull(),
  divisionId: integer("division_id").notNull(),
  groupId: char("group_id", { length: 1 }).notNull(),
  teamId: integer("team_id").notNull().references(() => teams.id),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  divisionId: integer("division_id").notNull().references(() => divisions.id),
  groupId: char("group_id", { length: 1 }).notNull(),
  captainId: integer("captain_id").references(() => players.id),
  logo: varchar("logo"),
},
  (table) => {
    return {
      lowerIdx: index("teams_lower_idx").using("btree", sql`lower((name)::text)`),
    };
  });

export const groupKeys = pgTable("group_keys", {
  id: smallint("id").primaryKey().notNull(),
  letter: char("letter", { length: 1 }),
},
  (table) => {
    return {
      lowerIdx: index("group_keys_lower_idx").using("btree", sql`lower((letter)::text)`),
    };
  });