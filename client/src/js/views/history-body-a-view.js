import AbstractView from "./abstract-view.js";
import { MonthLabels } from "../const.js";
import Chart from "chart.js/auto";

const createHistoryBodyBTemplate = () => {
  return `<div data-item="a" class="history__dynamic-balance draggable__item" draggable="true">
  <h2 class="history__title">Динамика баланса</h2>
    <div>
      <canvas class="js-cart-wrap history__cart" width="1142"></canvas>
    </div>
  </div>`;
};

export default class HistoryBodyA extends AbstractView {
  constructor(currentAccount, mappedLastYearTransactions) {
    super();

    this._currentAccount = currentAccount;
    this._currentAccountId = currentAccount.account;
    this._mappedLastYearProfitTransactions =
      mappedLastYearTransactions.profit[this._currentAccountId];
    this._mappedLastYearLossTransactions =
      mappedLastYearTransactions.loss[this._currentAccountId];
  }

  getTemplate() {
    return createHistoryBodyBTemplate(this._currentAccountId);
  }

  _renderChart(chartCtx, lastProfitYearbalance) {
    const keys = Object.keys(lastProfitYearbalance);
    const labels = keys.map((item) => {
      return MonthLabels[item];
    });

    const data = Object.values(lastProfitYearbalance);

    const chartAreaBorder = {
      id: "chartAreaBorder",
      beforeDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { left, top, width, height },
        } = chart;
        ctx.save();
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.setLineDash(options.borderDash || []);
        ctx.lineDashOffset = options.borderDashOffset;
        ctx.strokeRect(left, top, width, height);
        ctx.restore();
      },
    };

    new Chart(chartCtx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Баланс",
            data: data,
            backgroundColor: "#116acc",
            hoverBackgroundColor: "#a0c3ff",
            barThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,

        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 20,
                weight: "500",
                family: "Ubuntu",
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 3,
              font: {
                size: 20,
                weight: "500",
                family: "Ubuntu",
              },
              autoSkip: true,
              callback: function (value, index, values) {
                return `${value} ₽`;
              },
            },
            position: "right",
            bounds: "max",
          },
        },
        plugins: {
          tooltip: {
            interaction: {
              mode: "point",
            },
            callbacks: {
              label: function (context) {
                return `Баланс за месяц`;
              },
            },
          },
          legend: {
            display: false,
          },
          chartAreaBorder: {
            borderColor: "black",
            borderWidth: 2,
          },
        },
      },
      plugins: [chartAreaBorder],
    });
  }

  setChart = () => {
    const BAR_HEIGHT = 50;
    const chartCtx = this.getElement().querySelector(`.js-cart-wrap`);
    const size = Object.keys(this._mappedLastYearProfitTransactions);

    chartCtx.height = BAR_HEIGHT * size;

    this._renderChart(chartCtx, this._mappedLastYearProfitTransactions);
  };
}
