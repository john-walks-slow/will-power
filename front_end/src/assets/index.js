function importAll(r) {
  let assets = {};
  r.keys().map(item => {
    assets[item.replace('./', '').replace(/.*\//, '')] = r(item);
  });
  return assets;
}

export const ASSETS_SCENE = importAll(
  require.context('assets/scene/', false, /.*/)
);
export const ASSETS_MONSTER = importAll(
  require.context('assets/monster/', true, /.*/)
);
export const ASSETS_EQUIPMENT = importAll(
  require.context('assets/equipment/', true, /.*/)
);
export const ASSETS_FX = importAll(require.context('assets/fx/', false, /.*/));
export const ASSETS_AVATAR = importAll(
  require.context('assets/avatar/', false, /.*/)
);
export const ASSETS_PROFILE = importAll(
  require.context('assets/profile/', false, /.*/)
);
export const ASSETS_UI = importAll(require.context('assets/ui/', false, /.*/));
