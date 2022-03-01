import variables from '@/styles/element-variables.scss'
import { getSettings } from '@/api/system-settings'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, languages } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  languages: languages
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  // get settings
  getSettings({ commit }, settings) {
    const { type } = settings
    return new Promise((resolve, reject) => {
      getSettings({ type: type }).then(response => {
        const { data } = response
        if (response.code === 0) {
          commit('CHANGE_SETTING', { key: 'languages', value: data.list })
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

