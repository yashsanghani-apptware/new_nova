import i18next, { TOptions } from 'i18next'; // Import i18next and TOptions type
import Backend from 'i18next-fs-backend';

/**
 * Initializes the i18next library for internationalization.
 *
 * This function sets up i18next to use the filesystem backend for loading
 * translation files. It configures the default language and fallback language
 * to English and specifies the path pattern for locating the translation files.
 *
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 *
 * Usage:
 * - Call this function at the start of your application to initialize i18next.
 * - Ensure that the translation files are located in the specified path pattern.
 */
const initI18n = async () => {
  await i18next.use(Backend).init({
    lng: 'en', // Set the default language to English
    fallbackLng: 'en', // Set the fallback language to English if the selected language translation is not available
    backend: {
      loadPath: __dirname + '/../locales/{{lng}}/{{ns}}.json', // Specify the path to load translation files, with placeholders for language and namespace
    },
    debug: false, // Disable debug mode for i18next
  });
};

/**
 * Translates a message using the provided key and options.
 *
 * @param {string} key - The translation key.
 * @param {object} [options] - The interpolation options.
 * @returns {string} - The translated message.
 */
export const translate = (key: string, options?: object): string => {
  
  return i18next.t(key, options as TOptions);
};

export { i18next, initI18n };

