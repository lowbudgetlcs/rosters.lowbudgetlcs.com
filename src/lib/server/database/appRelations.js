import { relations } from "drizzle-orm/relations";
import { teams, games, results, series, players, divisions, accounts, standings, schedules } from "./schema";

export const gamesRelations = relations(games, ({one}) => ({
	team_winnerId: one(teams, {
		fields: [games.winnerId],
		references: [teams.id],
		relationName: "games_winnerId_teams_id"
	}),
	team_loserId: one(teams, {
		fields: [games.loserId],
		references: [teams.id],
		relationName: "games_loserId_teams_id"
	}),
	result: one(results, {
		fields: [games.resultId],
		references: [results.id]
	}),
	series: one(series, {
		fields: [games.seriesId],
		references: [series.id]
	}),
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
	games_winnerId: many(games, {
		relationName: "games_winnerId_teams_id"
	}),
	games_loserId: many(games, {
		relationName: "games_loserId_teams_id"
	}),
	series_team1Id: many(series, {
		relationName: "series_team1Id_teams_id"
	}),
	series_team2Id: many(series, {
		relationName: "series_team2Id_teams_id"
	}),
	series_winnerId: many(series, {
		relationName: "series_winnerId_teams_id"
	}),
	player: one(players, {
		fields: [teams.captainId],
		references: [players.id],
		relationName: "teams_captainId_players_id"
	}),
	division: one(divisions, {
		fields: [teams.divisionId],
		references: [divisions.id]
	}),
	players: many(players, {
		relationName: "players_teamId_teams_id"
	}),
	standings: many(standings),
}));

export const resultsRelations = relations(results, ({many}) => ({
	games: many(games),
}));

export const seriesRelations = relations(series, ({one, many}) => ({
	games: many(games),
	team_team1Id: one(teams, {
		fields: [series.team1Id],
		references: [teams.id],
		relationName: "series_team1Id_teams_id"
	}),
	team_team2Id: one(teams, {
		fields: [series.team2Id],
		references: [teams.id],
		relationName: "series_team2Id_teams_id"
	}),
	team_winnerId: one(teams, {
		fields: [series.winnerId],
		references: [teams.id],
		relationName: "series_winnerId_teams_id"
	}),
	schedules: many(schedules),
}));

export const playersRelations = relations(players, ({one, many}) => ({
	teams: many(teams, {
		relationName: "teams_captainId_players_id"
	}),
	team: one(teams, {
		fields: [players.teamId],
		references: [teams.id],
		relationName: "players_teamId_teams_id"
	}),
	accounts: many(accounts),
}));

export const divisionsRelations = relations(divisions, ({many}) => ({
	teams: many(teams),
	schedules: many(schedules),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	player: one(players, {
		fields: [accounts.playerId],
		references: [players.id]
	}),
}));

export const standingsRelations = relations(standings, ({one}) => ({
	team: one(teams, {
		fields: [standings.teamId],
		references: [teams.id]
	}),
}));

export const schedulesRelations = relations(schedules, ({one}) => ({
	series: one(series, {
		fields: [schedules.seriesId],
		references: [series.id]
	}),
	division: one(divisions, {
		fields: [schedules.divisionId],
		references: [divisions.id]
	}),
}));