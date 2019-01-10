import * as React from 'react';
import Game from './Game';
import service from './service';
import TaskIndicator from 'src/common/task_indicator';
import classNames from 'classnames';
import Utils from 'src/Utils';
import ScoreChart from './chart/ScoreChart';
import ScoreTable from './ScoreTable';
import './styles.scss';

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
                    entries={activeGame.entries}
                    showAddNewEntry={true} />
                </div>
              )
          }
        </main>
      </div>
    )
  }
}