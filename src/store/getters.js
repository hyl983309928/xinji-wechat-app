const pkg = state => state.pkg
const app = state => state.app
const device = state => state.app.device
const sidebar = state => state.app.sidebar
const route = state => state.route
const effect = state => state.app.effect
const loginState = state => state.user.loginState
const userInfo = state => state.user.userInfo
const menuitems = state => state.menu.items
const componententry = state => {
  return state.menu.items.filter(c => c.meta && c.meta.label === 'Components')[0]
}

export {
  pkg,
  app,
  device,
  sidebar,
  route,
  effect,
  loginState,
  userInfo,
  menuitems,
  componententry
}
