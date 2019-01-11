import Game from "./Game";
import backend from "src/backend";
import ScoreEntry from "./ScoreEntry";

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

  async addScoreEntry(score: number, holder: string, gameSecret: string): Promise<ScoreEntry> {
    let { token } = await backend.request(
      '/game/token',
      'post',
      {
        gameSecret
      }
    ) as any;

    let { scoreId: id } = await backend.request(`/score?token=${token}`, 'post', {
      score,
      name: holder
    });

    return {
      date: new Date(),
      id,
      name: holder,
      score
    }
  }
}