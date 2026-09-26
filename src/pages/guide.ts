import { PortalLayout } from '../components/portal-layout.js';
import { icon } from '../utils/icons.js';

interface HotelItem {
  type: string;
  name: string;
  note: string;
  image: string;
  link?: string;
}

interface ItineraryDay {
  day: string;
  title: string;
  image: string;
  stops: string[];
}

const hotelItems: HotelItem[] = [
  { type: 'Hotel', name: 'Altyn Eco Park', note: 'A peaceful stay surrounded by green space in Astana', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Trip_to_Astana_%282015-10-24%29_02.jpg/960px-Trip_to_Astana_%282015-10-24%29_02.jpg' },
  { type: 'Hotel', name: 'Sheraton Astana', note: 'A central luxury hotel near the city’s key destinations', image: '/sheraton-astana.jpg', link: 'https://www.marriott.com/en-us/hotels/tsesi-sheraton-astana-hotel/overview/' },
  { type: 'Hotel', name: 'Royal Park Hotel and Spa', note: 'Comfortable rooms and spa facilities for a restorative stay', image: 'https://lh3.googleusercontent.com/sitesv/AG8ngQWETT9xrjmkWW_DcMu-DYCJkWLYNcxMytKlOHcRnFI-D28sHOE1K-oRKyND4p20o7y9qnrE9DqrMXh6_iFVe9HhpwlgllQwvV2WuVenQzTXREtvxcjEI3K3m_10cCqbKRjnc725D0yqmtKpjipxzpw3-x2hkdAWcCMvpcvv6dyYN77lWS9eyIFlwiAD=w16383', link: 'https://sites.google.com/view/royal-park-hotel-spa/' },
];

const itinerary: ItineraryDay[] = [
  { day: 'Day 1', title: 'Discover central Astana', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Trip_to_Astana_%282015-10-24%29_01.jpg/960px-Trip_to_Astana_%282015-10-24%29_01.jpg', stops: ['Check in and settle into your hotel', 'Walk along Nurzhol Boulevard to the Baiterek Monument', 'Enjoy dinner in the Esil District'] },
  { day: 'Day 2', title: 'Culture and city landmarks', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Trip_to_Astana_%282015-10-24%29_02.jpg/960px-Trip_to_Astana_%282015-10-24%29_02.jpg', stops: ['Visit the National Museum of the Republic of Kazakhstan', 'See the Palace of Peace and Reconciliation', 'Take an evening walk around the EXPO 2017 site'] },
  { day: 'Day 3', title: 'Relax, explore and depart', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Trip_to_Astana_%282015-10-24%29_06.jpg/960px-Trip_to_Astana_%282015-10-24%29_06.jpg', stops: ['Have a relaxed morning at the hotel or spa', 'Explore the Presidential Park and enjoy a final local meal', 'Pick up gifts before departing Astana or continuing your journey'] },
];

export class GuidePage extends PortalLayout {
  protected readonly view = 'guide' as const;

  protected renderPageContent(): string {
    const hotels = hotelItems.map((item) => this.renderHotel(item)).join('');
    const days = itinerary.map((item) => this.renderDay(item)).join('');
    return `
      <section>
        <div class="section-intro">
          <div>
            <span class="eyebrow">CURATED FOR YOUR STAY</span>
            <h2>${this.t('Make yourself at home in Astana')}</h2>
            <p>${this.t('Places selected by your local Aziza coordinator.')}</p>
          </div>
        </div>
        <div class="guide-subsection">
          <div class="guide-subsection-head">
            <span class="eyebrow">${this.t('PLACES TO STAY')}</span>
            <h2>${this.t('Hotels for your Astana stay')}</h2>
          </div>
          <div class="guide-grid hotel-grid">${hotels}</div>
        </div>
        <div class="itinerary">
          <div class="itinerary-head">
            <span class="eyebrow">${this.t('THREE DAYS IN ASTANA')}</span>
            <h2>${this.t('A considered city itinerary')}</h2>
            <p>${this.t('A gentle rhythm of landmarks, local food and time to settle in.')}</p>
          </div>
          <div class="itinerary-grid">${days}</div>
        </div>
      </section>
    `;
  }

  private renderHotel(item: HotelItem): string {
    const link = item.link ? `href="${item.link}" target="_blank" rel="noreferrer"` : 'href="#"';
    return `
      <article>
        <img src="${item.image}" alt="${item.name} main building" loading="eager">
        <div>
          <span>${this.t(item.type)}</span>
          <h3>${item.name}</h3>
          <p>${item.note}</p>
          <a ${link} aria-label="${this.t('View details')} ${item.name}">${icon('eye')}${this.t('View details')}</a>
        </div>
      </article>
    `;
  }

  private renderDay(item: ItineraryDay): string {
    const stops = item.stops.map((stop) => `<li>${stop}</li>`).join('');
    return `
      <article>
        <img src="${item.image}" alt="${item.title}">
        <span>${item.day}</span>
        <h3>${item.title}</h3>
        <ul>${stops}</ul>
      </article>
    `;
  }
}