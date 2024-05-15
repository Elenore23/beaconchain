import { defineStore } from 'pinia'
import { warn } from 'vue'
import type { GetUserDashboardsResponse } from '~/types/api/dashboard'
import type { LoginResponse } from '~/types/user'
import { API_PATH } from '~/types/customFetch'

const userStore = defineStore('user_store', () => {
  const data = ref<{user_id: number, user_name: string} | undefined | null>()
  return { data }
})

export function useUserStore () {
  const { fetch } = useCustomFetch()
  const { data } = storeToRefs(userStore())

  async function doLogin (email: string, password: string) {
    await fetch<LoginResponse>(API_PATH.LOGIN, {
      body: {
        email,
        password
      }
    })
    await getUser()
  }

  const setUser = (id?: number, name: string = '') => {
    if (!id) {
      data.value = null
    } else {
      data.value = {
        user_id: id,
        user_name: name
      }
    }
  }

  const getUser = async () => {
    try {
      // TODO: replace once we have an endpoint to get a real user
      const res = await fetch<GetUserDashboardsResponse>(API_PATH.USER_DASHBOARDS, undefined, undefined, undefined, true)

      if (res.data) {
        setUser(1, 'My temp solution')
      }
    } catch (e) {
      // TODO: replace hacky sollution once we have a currentState request in the v2 api
      // We need to call at least once GET request wen we load the page to get the csrf header
      try {
        await fetch(API_PATH.DASHBOARD_OVERVIEW, undefined, { dashboardKey: 'MQ' })
      } catch (e) {
        warn('we could not load the db to get the csrf token')
      }
      // We are not logged in
      setUser(undefined)
    }
  }

  const user = computed(() => {
    return data.value
  })

  const isLoggedIn = computed(() => {
    return !!user.value
  })

  return { doLogin, user, isLoggedIn, getUser }
}
