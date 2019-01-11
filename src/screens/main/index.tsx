import * as React from 'react';
import Game from './Game';
import service from './service';
import TaskIndicator from 'src/common/task_indicator';
import classNames from 'classnames';
import Utils from 'src/Utils';
import ScoreChart from './chart/ScoreChart';
import ScoreTable from './ScoreTable';
import './styles.scss';
import ScoreEntry from './ScoreEntry';

class State {
  fetchingGames: boolean = false;
  games: Game[] = [];
  activeGameIndex: number = 0;
}

/**
 * Main screen which lists game score records.
 * @author Johan Svensson
 */
export default class MainScreen extends React.Component<any, State> {
  state = new State();

  componentDidMount() {
    this.fetchGames();
  }

  fetchGames() {
    this.setState({
      fetchingGames: true
    });
    service.fetchGames().then(games => this.setState({
      games,
      fetchingGames: false
    }));
  }

  showGame(index: number) {
    this.setState({
      activeGameIndex: index
    })
  }

  /**
   * Adds a score entry to a game's list of entries and sorts the list by score descending.
   */
  addScoreEntry(entry: ScoreEntry, game: Game) {
    let { entries } = game;
    entries.push(entry);
    entries.sort((a, b) => b.score - a.score);
   
    //  Re-render
    this.forceUpdate();
  }

  render() {
    let { state } = this;

    let activeGame = state.games[state.activeGameIndex];

    return (
      <div className="container">
        <main className="section">
          <h1 className="title">Highscores</h1>
          {
            state.fetchingGames || !state.games.length ? (
              <TaskIndicator />
            ) : (
                <div>
                  <div className="tabs">
                    <ul>
                      {
                        state.games.map((game, i) => (
                          <li key={game.id} className={classNames({
                            "is-active": state.activeGameIndex == i
                          })}><a onClick={() => this.showGame(i)}>{game.title}</a></li>
                        ))
                      }
                    </ul>
                  </div>
                  <ScoreChart game={activeGame} />
                  <ScoreTable
                    gameSecret={activeGame.secret}
                    entries={activeGame.entries}
                    onAddedNewEntry={entry => this.addScoreEntry(entry, activeGame)}
                    showAddNewEntry={true} />
                </div>
              )
          }
        </main>
      </div>
    )
  }
}