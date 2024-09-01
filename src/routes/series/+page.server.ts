import { generateSeries } from "$lib/server/series";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({}) => {
  generateSeries();
};
