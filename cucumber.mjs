export default {
  format: ['progress'],
  paths: ['features/**/*.feature'],
  require: ['features/support/**/*.ts', 'features/step-definitions/**/*.ts'],
  requireModule: ['tsx/cjs'],
};
