import { relations } from "drizzle-orm/relations";
import { players, accounts, series, games, teams, results, performances, divisions, schedules, standings } from "./appSchema";

export const accountsRelations = relations(accounts, ({one}) => ({
	player: one(players, {
		fields: [accounts.playerId],
		references: [players.id]
	}),
}));

export const playersRelations = relations(players, ({one, many}) => ({
	accounts: many(accounts),
	performances: many(performances),
	team: one(teams, {
		fields: [players.teamId],
		references: [teams.id],
		relationName: "players_teamId_teams_id"
	}),
	teams: many(teams, {
		relationName: "teams_captainId_players_id"
	}),
}));

export const gamesRelations = relations(games, ({one, many}) => ({
	series: one(series, {
		fields: [games.seriesId],
		references: [series.id]
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
	team_winnerId: one(teams, {
		fields: [games.winnerId],
		references: [teams.id],
		relationName: "games_winnerId_teams_id"
	}),
	performances: many(performances),
}));

export const seriesRelations = relations(series, ({one, many}) => ({
	games: many(games),
	schedules: many(schedules),
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
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
	games_loserId: many(games, {
		relationName: "games_loserId_teams_id"
	}),
	games_winnerId: many(games, {
		relationName: "games_winnerId_teams_id"
	}),
	performances: many(performances),
	players: many(players, {
		relationName: "players_teamId_teams_id"
	}),
	series_team1Id: many(series, {
		relationName: "series_team1Id_teams_id"
	}),
	series_team2Id: many(series, {
		relationName: "series_team2Id_teams_id"
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

export const performancesRelations = relations(performances, ({one}) => ({
	team: one(teams, {
		fields: [performances.teamId],
		references: [teams.id]
	}),
	player: one(players, {
		fields: [performances.playerId],
		references: [players.id]
	}),
	game: one(games, {
		fields: [performances.gameId],
		references: [games.id]
	}),
}));

export const schedulesRelations = relations(schedules, ({one}) => ({
	division: one(divisions, {
		fields: [schedules.divisionId],
		references: [divisions.id]
	}),
	series: one(series, {
		fields: [schedules.seriesId],
		references: [series.id]
	}),
}));

export const divisionsRelations = relations(divisions, ({many}) => ({
	schedules: many(schedules),
	teams: many(teams),
}));

export const standingsRelations = relations(standings, ({one}) => ({
	team: one(teams, {
		fields: [standings.teamId],
		references: [teams.id]
	}),
}));