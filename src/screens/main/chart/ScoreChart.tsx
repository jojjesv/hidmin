import * as React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend
} from 'recharts';
import Game from '../Game';
import Utils from 'src/Utils';

import './styles.css';
import intervals from './intervals';

const animationConfig = {
  isAnimationActive: false
}

interface Props {
  game: Game;
}

/**
 * Renders a chart of the game score entries.
 * @author Johan Svensson
 */
export default class ScoreChart extends React.Component<Props> {
  state = {
    interval: intervals[0]
  }

  /**
   * Sets the chart interval.
   */
  setInterval(interval) {
    this.setState({
      interval
    })
  }

  getXLabel(date: Date) {
    let x = `${date.getFullYear()}-${Utils.pad(date.getMonth() + 1)}-${Utils.pad(date.getDate())}`;

    let { state } = this;
    if (state.interval.intervalDays < 2) {
      //  Show time
      x = `${x} ${Utils.pad(date.getHours())}:${Utils.pad(date.getMinutes())}`;
    }

    return x;
  }

  get graphData() {
    let { props, state } = this;
    let startDate = new Date();

    let { interval } = state;
    startDate.setDate(startDate.getDate() - interval.intervalDays);

    let entries = [...props.game.entries].filter(e => e.date > startDate);

    entries.sort((a, b) => a.date.getTime() - b.date.getTime());

    let data = [];
    let date = new Date(startDate);
    let pointCount = Math.floor(24 * interval.intervalDays / (interval.deltaHours));
    for (let i = 0; i < pointCount; i++) {
      let entriesThatDay = entries.filter(e => Utils.isOnSameDay(e.date, date));
      let scoresThatDay = entriesThatDay.map(e => e.score);

      data.push({
        x: this.getXLabel(date),
        avg: Utils.avg(scoresThatDay),
        max: Utils.max(scoresThatDay)
      })

      date.setTime(date.getTime() + 1000 * 60 * 60 * interval.deltaHours);
    }

    return data;
  }

  render() {
    let { props, state, graphData } = this;

    let { interval } = state;

    return (
      <div style={{ margin: 'auto' }}>
        <div className="level">
          <h3 className="level-left title is-5 is-marginless">
            Average scores
          </h3>
          <div className="level-item dropdown is-hoverable">
            <div className="dropdown-trigger">
              <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{interval.text}</span>
                <span className="icon is-small">
                  <i className="fas">angle-down</i>
                </span>
              </button>
            </div>
            <div className="dropdown-menu">
              <div className="dropdown-content">
                {
                  intervals.map(e => (
                    <a className="dropdown-item" key={e.text} onClick={() => this.setInterval(e)}>
                      {e.text}
                    </a>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart
            data={graphData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="x" />
            <YAxis type="number" />
            <Tooltip />
            <Legend wrapperStyle={{ position: 'absolute', top: 24, right: 36 }} align="right" />
            <Line dataKey="avg" stroke="#ff3860" width={3} {...animationConfig} />
            <Line dataKey="max" stroke="#7b1fa2" width={3} {...animationConfig} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }
}