import AbstractView from "./abstract-view.js";
import { MonthLabels } from "../const.js";
import Chart from "chart.js/auto";

const createHistoryBodyBTemplate = () => {
  return `<div data-item="b" class="history__dynamic-balance draggable__item" draggable="true">
  <h2 class="history__title">Соотношение входящих исходящих транзакций</h2>
    <div>
      <canvas class="js-cart-wrap history__cart" width="1142"></canvas>
    </div>
  </div>`;
};

export default class HistoryBodyB extends AbstractView {
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

  _renderChart(chartCtx, lastYearProfit, lastYearLoss) {
    const keys = Object.keys(lastYearProfit);
    const labels = keys.map((item) => {
      return MonthLabels[item];
    });

    const dataProfit = Object.values(lastYearProfit);
    const dataLoss = Object.values(lastYearLoss);

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
            label: "Поступление за месяц",
            data: dataProfit,
            backgroundColor: "#76CA66",
            hoverBackgroundColor: "#76CA66",
            barThickness: 50,
          },
          {
            label: "Списание за месяц",
            data: dataLoss,
            backgroundColor: "#FD4E5D",
            hoverBackgroundColor: "#FD4E5D",
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
            stacked: true,
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
            beginAtZero: true,
            //stacked: true,
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

    this._renderChart(
      chartCtx,
      this._mappedLastYearProfitTransactions,
      this._mappedLastYearLossTransactions
    );
  };
}
