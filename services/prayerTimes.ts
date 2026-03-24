import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  SunnahTimes,
  Prayer,
} from 'adhan';
import { format } from 'date-fns';

export const PrayerTimeService = {
  getPrayerTimes: (latitude: number, longitude: number, date: Date = new Date()) => {
    const coords = new Coordinates(latitude, longitude);
    // MWL is common in many parts of Ethiopia, but can be adjusted
    const params = CalculationMethod.MuslimWorldLeague();
    const prayerTimes = new PrayerTimes(coords, date, params);
    
    return {
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
      current: prayerTimes.currentPrayer(),
      next: prayerTimes.nextPrayer(),
    };
  },

  formatTime: (date: Date) => {
    return format(date, 'h:mm a');
  },

  getPrayerName: (prayer: Prayer) => {
    switch (prayer) {
      case Prayer.Fajr: return 'Fajr';
      case Prayer.Sunrise: return 'Sunrise';
      case Prayer.Dhuhr: return 'Dhuhr';
      case Prayer.Asr: return 'Asr';
      case Prayer.Maghrib: return 'Maghrib';
      case Prayer.Isha: return 'Isha';
      default: return 'None';
    }
  },
};
