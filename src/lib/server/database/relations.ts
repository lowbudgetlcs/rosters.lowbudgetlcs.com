import { relations } from "drizzle-orm/relations";
import { teams, games, results, series, divisions, performances, players, playerData, standings, schedules, accounts } from "./schema";

export const gamesRelations = relations(games, ({one, many}) => ({
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
	team_winnerId: one(teams, {
		fields: [games.winnerId],
		references: [teams.id],
		relationName: "games_winnerId_teams_id"
	}),
	performances: many(performances),
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
	games_loserId: many(games, {
		relationName: "games_loserId_teams_id"
	}),
	games_winnerId: many(games, {
		relationName: "games_winnerId_teams_id"
	}),
	performances: many(performances),
	series_winnerId: many(series, {
		relationName: "series_winnerId_teams_id"
	}),
	series_team1Id: many(series, {
		relationName: "series_team1Id_teams_id"
	}),
	series_team2Id: many(series, {
		relationName: "series_team2Id_teams_id"
	}),
	players: many(players, {
		relationName: "players_teamId_teams_id"
	}),
	standings: many(standings),
	division: one(divisions, {
		fields: [teams.divisionId],
		references: [divisions.id]
	}),
	player: one(players, {
		fields: [teams.captainId],
		references: [players.id],
		relationName: "teams_captainId_players_id"
	}),
}));

export const resultsRelations = relations(results, ({many}) => ({
	games: many(games),
}));

export const seriesRelations = relations(series, ({one, many}) => ({
	games: many(games),
	team_winnerId: one(teams, {
		fields: [series.winnerId],
		references: [teams.id],
		relationName: "series_winnerId_teams_id"
	}),
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
	schedules: many(schedules),
}));

export const performancesRelations = relations(performances, ({one, many}) => ({
	division: one(divisions, {
		fields: [performances.divisionId],
		references: [divisions.id]
	}),
	game: one(games, {
		fields: [performances.gameId],
		references: [games.id]
	}),
	player: one(players, {
		fields: [performances.playerId],
		references: [players.id]
	}),
	team: one(teams, {
		fields: [performances.teamId],
		references: [teams.id]
	}),
	playerData: many(playerData),
}));

export const divisionsRelations = relations(divisions, ({many}) => ({
	performances: many(performances),
	schedules: many(schedules),
	teams: many(teams),
}));

export const playersRelations = relations(players, ({one, many}) => ({
	performances: many(performances),
	team: one(teams, {
		fields: [players.teamId],
		references: [teams.id],
		relationName: "players_teamId_teams_id"
	}),
	teams: many(teams, {
		relationName: "teams_captainId_players_id"
	}),
	accounts: many(accounts),
}));

export const playerDataRelations = relations(playerData, ({one}) => ({
	performance: one(performances, {
		fields: [playerData.performanceId],
		references: [performances.id]
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

export const accountsRelations = relations(accounts, ({one}) => ({
	player: one(players, {
		fields: [accounts.playerId],
		references: [players.id]
	}),
}));