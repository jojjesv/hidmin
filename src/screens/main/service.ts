import Game from "./Game";
import backend from "src/backend";

/**
 * @author Johan Svensson
 */
export default {
  /**
   * Fetches all games and their highscores.
   */
  async fetchGames(): Promise<Game[]> {
    let result = await backend.request('/games', 'get') as { games: Game[] };

    result.games.forEach(game => game.entries.forEach(
      //@ts-ignore
      entry => entry.date = new Date(entry.date as string))
    );

    return result.games;
  },

  /**
   * Deletes a single score entry by ID.
   */
  async deleteScoreEntry(id: string) {
    let result = await backend.request('/score/' + id, 'delete')
  },

  async addScoreEntry(score: number, holder: string) {
    await backend.request(`/score`, 'post', {
      score, holder
    });
  }
}