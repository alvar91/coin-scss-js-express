import AbstractView from "./abstract-view.js";
import Utils from "../utils/common.js";
import { MonthLabels } from "../const.js";
import Chart from "chart.js/auto";

const createAccountBodyBTemplate = (personAccount) => {
  return `<div data-item="b" class="account__dynamic-balance draggable__item" draggable="true">
  <h2 class="account__title">
    <a class="link js-to-history" href="/history/${personAccount}">Динамика баланса</a></h2>
    <div class="">
      <canvas class="js-cart-wrap account__cart" width="684"></canvas>
    </div>
  </div>`;
};

export default class AccountBodyB extends AbstractView {
  constructor(currentAccount, mappedLastYearTransactions) {
    super();

    this._currentAccount = currentAccount;
    this._currentAccountId = currentAccount.account;
    this._mappedLastYearProfitTransactions =
      mappedLastYearTransactions.profit[this._currentAccountId];

    this._mappedLastHalfYearTransactions =
      Utils.filterTransactionsInLastHalfYear(
        this._mappedLastYearProfitTransactions
      );

    this._statisticChart = null;
  }

  getTemplate() {
    return createAccountBodyBTemplate(this._currentAccountId);
  }

  _clickHandler = (e) => {
    e.preventDefault();

    this._handler.click(this._currentAccount.account);
  };

  setClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .querySelector(".js-to-history")
      .addEventListener(`click`, this._clickHandler);
  }

  _renderChart(chartCtx, lastHalfYearbalance) {
    const keys = Object.keys(lastHalfYearbalance);
    const labels = keys.map((item) => {
      return MonthLabels[item];
    });

    const data = Object.values(lastHalfYearbalance);

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
    if (this._statisticChart !== null) {
      this._statisticChart = null;
    }

    const BAR_HEIGHT = 50;
    const chartCtx = this.getElement().querySelector(`.js-cart-wrap`);
    const size = Object.keys(this._mappedLastHalfYearTransactions);

    chartCtx.height = BAR_HEIGHT * size;

    this._renderChart(chartCtx, this._mappedLastHalfYearTransactions);
  };
}
