import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as 'ar' | 'en')) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        // Added the missing slash between messages and ${locale}
        messages: (await import(`@/messages/${locale}.json`)).default
    };
});