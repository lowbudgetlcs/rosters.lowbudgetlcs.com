export type Account = {
  puuid: string;
  player_id: number;
  is_primary: boolean;
};

export type Division = {
  name: string;
  groups: number;
  description: string | undefined;
  tid: number;
};

export type Player = {
  name: string;
  team: string | undefined;
};

export type League = {
  div: number;
  group: string;
};

export type Team = {
  name: string;
  division: string;
  group: string;
  captain: string | null;
  logo: string | null;
};

export type SessionUser = {
  id: number;
  name: string;
};
