module.exports = {
  routes: './src/routes.ts',
  connector: '@layer0/starter',
  backends: {
    origin: {
      hostHeader: 'hiring.monster.com',
      domainOrIp: 'hiring.monster.com',
    },
  },
}
