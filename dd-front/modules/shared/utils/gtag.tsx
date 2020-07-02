import { GA_TRACKING_ID } from '../constants';

declare global {
  interface Window {
    gtag: any;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: 'string') => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url
  });
};

interface GtagEvent {
  action: string;
  category: string;
  label: string;
  value: string;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GtagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
};
