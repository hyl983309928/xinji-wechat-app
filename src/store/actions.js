import * as types from './mutation-types'

export const toggleSidebar = ({ commit }, opened) => commit(types.TOGGLE_SIDEBAR, opened)

export const toggleDevice = ({ commit }, device) => commit(types.TOGGLE_DEVICE, device)

export const userLogin = ({ commit }, userInfo) => commit(types.LOGIN, userInfo)

export const userLogout = ({ commit }) => commit(types.LOGOUT)

export const updateUserInfo = ({ commit }, userInfo) => commit(types.UPDATE_USER_INFO, userInfo)

export const updateUserState = ({ commit }, login) => commit(types.UPDATE_USER_STATE, login)

export const expandMenu = ({ commit }, menuItem) => {
  if (menuItem) {
    menuItem.expanded = menuItem.expanded || false
    commit(types.EXPAND_MENU, menuItem)
  }
}

export const switchEffect = ({ commit }, effectItem) => {
  if (effectItem) {
    commit(types.SWITCH_EFFECT, effectItem)
  }
}
