const defaultNS = process.env.TRANSLATION_NAMESPACE ?? 'translation';

export default {
  contextSeparator: '_',
  createOldCatalogs: false,
  keySeparator: false,
  locales: ['en'],
  defaultNS,
  namespaceSeparator: '~',
  reactNamespace: false,
  useKeysAsDefaultValue: true,
  output: `./libs/locales/lib/$LOCALE/${defaultNS}.json`,
  sort: true,
};
