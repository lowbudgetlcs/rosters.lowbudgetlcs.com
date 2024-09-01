import { relations } from "drizzle-orm/relations";
import {
  performances,
  playerData,
  divisions,
  games,
  players,
  teams,
  series,
  results,
  standings,
  schedules,
  accounts,
} from "./schema";

export const playerDataRelations = relations(playerData, ({ one }) => ({
  performance: one(performances, {
    fields: [playerData.performanceId],
    references: [performances.id],
  }),
}));

export const performancesRelations = relations(
  performances,
  ({ one, many }) => ({
    playerData: many(playerData),
    division: one(divisions, {
      fields: [performances.divisionId],
      references: [divisions.id],
    }),
    game: one(games, {
      fields: [performances.gameId],
      references: [games.id],
    }),
    player: one(players, {
      fields: [performances.playerId],
      references: [players.id],
    }),
    team: one(teams, {
      fields: [performances.teamId],
      references: [teams.id],
    }),
  }),
);

export const divisionsRelations = relations(divisions, ({ many }) => ({
  performances: many(performances),
  teams: many(teams),
  schedules: many(schedules),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  performances: many(performances),
  team_loserId: one(teams, {
    fields: [games.loserId],
    references: [teams.id],
    relationName: "games_loserId_teams_id",
  }),
  result: one(results, {
    fields: [games.resultId],
    references: [results.id],
  }),
  series: one(series, {
    fields: [games.seriesId],
    references: [series.id],
  }),
  team_winnerId: one(teams, {
    fields: [games.winnerId],
    references: [teams.id],
    relationName: "games_winnerId_teams_id",
  }),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  performances: many(performances),
  teams: many(teams, {
    relationName: "teams_captainId_players_id",
  }),
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
    relationName: "players_teamId_teams_id",
  }),
  accounts: many(accounts),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  performances: many(performances),
  series_winnerId: many(series, {
    relationName: "series_winnerId_teams_id",
  }),
  series_team1Id: many(series, {
    relationName: "series_team1Id_teams_id",
  }),
  series_team2Id: many(series, {
    relationName: "series_team2Id_teams_id",
  }),
  games_loserId: many(games, {
    relationName: "games_loserId_teams_id",
  }),
  games_winnerId: many(games, {
    relationName: "games_winnerId_teams_id",
  }),
  division: one(divisions, {
    fields: [teams.divisionId],
    references: [divisions.id],
  }),
  player: one(players, {
    fields: [teams.captainId],
    references: [players.id],
    relationName: "teams_captainId_players_id",
  }),
  standings: many(standings),
  players: many(players, {
    relationName: "players_teamId_teams_id",
  }),
}));

export const seriesRelations = relations(series, ({ one, many }) => ({
  team_winnerId: one(teams, {
    fields: [series.winnerId],
    references: [teams.id],
    relationName: "series_winnerId_teams_id",
  }),
  team_team1Id: one(teams, {
    fields: [series.team1Id],
    references: [teams.id],
    relationName: "series_team1Id_teams_id",
  }),
  team_team2Id: one(teams, {
    fields: [series.team2Id],
    references: [teams.id],
    relationName: "series_team2Id_teams_id",
  }),
  games: many(games),
  schedules: many(schedules),
}));

export const resultsRelations = relations(results, ({ many }) => ({
  games: many(games),
}));

export const standingsRelations = relations(standings, ({ one }) => ({
  team: one(teams, {
    fields: [standings.teamId],
    references: [teams.id],
  }),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
  division: one(divisions, {
    fields: [schedules.divisionId],
    references: [divisions.id],
  }),
  series: one(series, {
    fields: [schedules.seriesId],
    references: [series.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  player: one(players, {
    fields: [accounts.playerId],
    references: [players.id],
  }),
}));
