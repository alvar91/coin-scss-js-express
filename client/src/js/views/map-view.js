import AbstractView from "./abstract-view.js";

const createMapTemplate = () => {
  return `
    <div class="container">
      <h1 class="section-title contacts__title">Карта банкоматов</h1>
      <div class="contacts__map" id="map"></div>
    </div>
    `;
};

export default class MapView extends AbstractView {
  getTemplate() {
    return createMapTemplate();
  }

  _getPlaceMark({ lat, lon }) {
    return new ymaps.Placemark([lat, lon], {
      balloonContent: `
            <div class="balloon">
              <h4 class="balloon__title">Coin.</h4>
              <a href="tel:+74958854547" class="balloon__tel-number">
                  <svg width="100%" height="100%" viewbox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.3425 12.0983C15.215 12.0983 14.1242 11.915 13.1067 11.585C12.7858 11.475 12.4283 11.5575 12.1808 11.805L10.7417 13.6108C8.1475 12.3733 5.71833 10.0358 4.42583 7.35L6.21333 5.82833C6.46083 5.57167 6.53417 5.21417 6.43333 4.89333C6.09417 3.87583 5.92 2.785 5.92 1.6575C5.92 1.1625 5.5075 0.75 5.0125 0.75H1.84083C1.34583 0.75 0.75 0.97 0.75 1.6575C0.75 10.1733 7.83583 17.25 16.3425 17.25C16.9933 17.25 17.25 16.6725 17.25 16.1683V13.0058C17.25 12.5108 16.8375 12.0983 16.3425 12.0983Z" />
                  </svg>
                  <span>+7 (495) 885-45-47</span>
              </a>
              <div class="balloon__worktime">
                  <span class="grey_text">Часы работы:</span>
                  с 10:00 до 21:00
              </div>
              <div class="balloon__description">
                  <span class="balloon__grey-text">Что здесь:</span>
                  обслуживание счетов, пункт обмена, пункт внесения-выдачи наличных, сервисный центр
              </div>
          </div>
          `,
    });
  }

  init(points) {
    const map = document.getElementById("map");

    if (map) {
      ymaps
        .load()
        .then((maps) => {
          const myMap = new maps.Map(
            "map",
            {
              center: [55.75399399999374, 37.62209300000001],
              zoom: 11,
            },
            {
              searchControlProvider: "yandex#search",
            }
          );

          if (points) {
            points.forEach((point) =>
              myMap.geoObjects.add(this._getPlaceMark(point))
            );
          }
        })
        .catch((error) => console.log("Failed to load Yandex Maps", error));
    }
  }
}
