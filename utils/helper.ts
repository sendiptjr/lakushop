
import { Analytics, getAnalytics, logEvent } from "firebase/analytics";
import FirebaseAnalytics from "./../firebase";


export const currencyFormat = (num: any) => {
    return `${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

export const trackingAnalytics = async(screen: any, first_name: any, email: any) => {
  const analyticsInstance = await getAnalytics(FirebaseAnalytics); 
  // Ensure that analyticsInstance is not null
  if (analyticsInstance) {
    // Use type assertion to inform TypeScript that analyticsInstance is not null
    const analytics: Analytics = analyticsInstance;
    
    logEvent(analytics, screen, {
      username:  first_name,
      email_id: email,
    });
    // Log the event
  }
}

export const trackingAnalyticsPurchase = async(screen: any, params: any) => {
  const analyticsInstance = await getAnalytics(FirebaseAnalytics); 
  // Ensure that analyticsInstance is not null
  if (analyticsInstance) {
    // Use type assertion to inform TypeScript that analyticsInstance is not null
    const analytics: Analytics = analyticsInstance;
    
    logEvent(analytics, screen, params);
    // Log the event
  }
}