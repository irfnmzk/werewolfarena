import i18n from 'i18n';

import fs from 'fs';
import path from 'path';
import { I18nProvider } from './LocaleService';

const localesPath = path.join(__dirname, '..', '..', '..', 'config', 'locales');
const files = fs.readdirSync(localesPath);

i18n.configure({
  locales: files.map(file => path.basename(file, '.json')),
  defaultLocale: 'default',
  directory: localesPath,
  objectNotation: true
});

const i18nProvider = i18n as any;

i18nProvider.translate = i18n.__mf;

export default i18nProvider as I18nProvider;
