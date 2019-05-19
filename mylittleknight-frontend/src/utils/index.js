export function importAll(r) {
  let assets = {};
  r.keys().map(item => {
    assets[item.replace('./', '')] = r(item);
  });
  return assets;
}

export function importAllWithoutPath(r) {
  let assets = {};
  r.keys().map(item => {
    assets[
      item
        .replace('./', '')
        .replace(/^.*\//, '')
        .replace(/\..*$/, '')
    ] = r(item);
  });
  return assets;
}

export const ALL_COMPONENTS = importAllWithoutPath(
  require.context('components', true, /.*/)
);
for (var entry in ALL_COMPONENTS) {
  ALL_COMPONENTS[entry] = ALL_COMPONENTS[entry].default;
}
