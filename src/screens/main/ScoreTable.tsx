import * as React from 'react';
import Utils from 'src/Utils';
import ScoreEntry from './ScoreEntry';
import Notification from 'jojje-react-notification';
import classNames from 'classnames';
import service from './service';

interface Props {
  gameSecret: string;
  entries: ScoreEntry[];
  /**
   * Whether to show a add new entry form.
   */
  showAddNewEntry?: boolean;
  onAddedNewEntry?: (entry: ScoreEntry) => void;
}

class State {
  adddingEntry: boolean = false;
}

/**
 * Renders a table of score entries.
 * @author Johan Svensson
 */
export default class extends React.Component<Props, State> {
  state = new State();

  inputScoreRef: HTMLInputElement
  inputHolderRef: HTMLInputElement

  /**
   * Delegates to the service.
   */
  async deleteScoreEntry(id: string) {
    let result = await service.deleteScoreEntry(id);
  }

  async addScoreEntryFromInput() {
    let { inputScoreRef, inputHolderRef, props, state } = this;


    let score = inputScoreRef.value.trim();
    let holder = inputHolderRef.value.trim();

    if (!this.validateScoreEntry(score, holder)) {
      return;
    }

    if (state.adddingEntry) {
      return;
    }

    this.setState({
      adddingEntry: true
    });

    let { gameSecret } = props;

    let entry = await service.addScoreEntry(parseInt(score), holder, gameSecret);

    this.setState({
      adddingEntry: false
    });

    this.onAddedScoreEntry(entry)
  }

  /**
   * Validates input data and optionally shows an error notification. 
   */
  validateScoreEntry(score: any, holder: any) {
    if (!score || isNaN(score)) {
      Notification.showWithFirstShared(
        "Score must be numeric"
      );
      return false;
    }

    if (parseInt(score) < 0) {
      Notification.showWithFirstShared(
        "Score must be postive"
      );
      return false;
    }

    if (!holder) {
      Notification.showWithFirstShared(
        "Enter a holder"
      );
      return false;
    }

    return true;
  }

  onAddedScoreEntry(entry: ScoreEntry) {
    this.props.onAddedNewEntry(entry);
  }

  render() {
    let { props, state } = this;

    return (
      <table className="table is-fullwidth">
        <tbody>
          {
            props.entries.map(entry => (
              <tr key={entry.id} className="columns">
                <td className="column">
                  {entry.score.toLocaleString()}
                </td>
                <td className="column">
                  {entry.name}
                </td>
                <td className="column">
                  {Utils.getDeltaTimeText(entry.date)}
                </td>
                <td className="column is-2">
                  <button className="button is-danger"
                    onClick={() => {
                      Notification.showWithFirstShared("Double click to delete")
                    }}
                    onDoubleClick={e => {
                      (e.target as HTMLButtonElement).classList.add('is-loading');
                      this.deleteScoreEntry(entry.id);
                    }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          }
          {
            props.showAddNewEntry ? (
              <tr className="columns">
                <td className="column">
                  <input
                    ref={e => this.inputScoreRef = e}
                    type="text"
                    id="input-score"
                    className="input"
                    placeholder="Score" />
                </td>
                <td className="column">
                  <input
                    ref={e => this.inputHolderRef = e}
                    type="text"
                    id="input-holder"
                    className="input"
                    placeholder="Holder" />
                </td>
                <td className="column">
                </td>
                <td className="column is-2">
                  <button
                    className={classNames({
                      "button is-primary": true,
                      "loading": state.adddingEntry
                    })}
                    disabled={state.adddingEntry}
                    onClick={() => this.addScoreEntryFromInput()}>
                    Add entry
                  </button>
                </td>
              </tr>
            ) : null
          }
        </tbody>
      </table>
    )
  }
}