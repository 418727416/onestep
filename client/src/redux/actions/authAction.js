import axios from 'axios'
import {showNotification} from './notificationAction'
import config from '../../config/config'
import * as types from '../../constants/actionTypes/authActionTypes.js'

function setCurrentUserInfo(data) {
  return {
    type: types.AUTH_USER,
    userInfo: data,
  }
}

function handleError(error, dispatch) {
  if (error.response) {
    dispatch(showNotification(error.response.data.errorMsg))
  } else {
    console.log(error)
  }
}

export function login(data) {
  return dispatch => {
    axios
      .post(`${config.api}/login`, data)
      .then(res => {
        const token = res.data.token
        const user = res.data.user
        window.sessionStorage.setItem('jwtToken', token)
        window.sessionStorage.setItem('user', user.phoneNum)

        dispatch(setCurrentUserInfo(user))
        dispatch(showNotification('登录成功'))
      })
      .catch(error => {
        handleError(error, dispatch)
      })
  }
}

export function signup(data) {
  return dispatch => {
    axios
      .post(`${config.api}/signup`, data)
      .then(res => {
        const token = res.data.token
        const user = res.data.user
        window.sessionStorage.setItem('jwtToken', token)
        window.sessionStorage.setItem('user', user.phoneNum)
        dispatch(setCurrentUserInfo(user))
        dispatch(showNotification('注册成功'))
      })
      .catch(error => {
        handleError(error, dispatch)
      })
  }
}

export function oauthWeChat(data, history) {
  return dispatch => {
    axios
      .post(`${config.api}/oauth/wechat`, data)
      .then(res => {
        if (!res.data.binding) {
          dispatch({type: types.WECHAT_USER, user: res.data.user})
        } else {
          // 已经绑定则直接登录
          window.sessionStorage.setItem('jwtToken', res.data.token)
          window.sessionStorage.setItem('user', res.data.user.phoneNum)
          dispatch(setCurrentUserInfo(res.data.user))
          history.push('/user/profile')
        }
      })
      .catch(error => {})
  }
}

export function oauthBinding(data, history) {
  return dispatch => {
    delete data.errors
    axios
      .post(`${config.api}/oauth/binding`, data)
      .then(res => {
        window.sessionStorage.setItem('jwtToken', res.data.token)
        window.sessionStorage.setItem('user', res.data.user.phoneNum)
        dispatch(setCurrentUserInfo(res.data.user))
        history.push('/user/profile')
      })
      .catch(error => {})
  }
}

export function logout(data) {
  return dispatch => {
    dispatch({type: types.LOG_OUT})
    window.sessionStorage.removeItem('user')
    window.sessionStorage.removeItem('jwtToken')
    dispatch(showNotification('退出成功'))
  }
}

export const checkToken = token => {
  return dispatch => {
    axios
      .post(`${config.api}/auth`, {token})
      .then(res => {
        if (res.data.success !== true) {
          throw new Error('Fail to check token: ' + res)
        } else {
          dispatch({
            type: types.TOKEN_IS_VALID,
            success: true,
          })
        }
      })
      .catch(error => {
        handleError(error, dispatch)
      })
  }
}

// 检测 Episode 权限部分
export function initEpAuthStatus() {
  return dispatch => {
    dispatch({type: types.EP_STATUS_INIT})
  }
}

function checkMembership(date) {
  let now = new Date()
  let isMember = Date.parse(date) - Date.parse(now)
  return isMember
}

function checkShoplist(shoplist, courseName) {
  let isPaid = shoplist.find(course => course.link.substr(1) === courseName)
  return !!isPaid
}

export const episodeAuthFetchStarted = () => ({
  type: types.EP_AUTH_FETCH_STARTED,
})

export const episodeAuthFetchFailed = () => ({
  type: types.EP_AUTH_FETCH_FAILED,
})

export const checkEpisodeAuth = data => {
  return dispatch => {
    dispatch(episodeAuthFetchStarted())

    let {phoneNum, courseName} = data
    axios
      .post(`${config.api}/profile`, {phoneNum})
      .then(res => {
        let paidRes = res.data

        if (res.status !== 200) {
          throw new Error('Fail to check paid courses: ' + paidRes)
        } else {
          if (paidRes.admin) {
            dispatch({
              type: types.EPISODE_AUTH_VALID,
            })
            return
          }
          if (
            !paidRes.latestExpireDate ||
            !checkMembership(paidRes.latestExpireDate)
          ) {
            // now we need to check if the user bought the course
            if (
              paidRes.paidCourses.length === 0 ||
              !checkShoplist(paidRes.paidCourses, courseName)
            ) {
              // time to refuse the user
              dispatch({
                type: types.EPISODE_AUTH_INVALID,
              })
            } else {
              dispatch({
                type: types.EPISODE_AUTH_VALID,
              })
            }
          } else {
            dispatch({
              type: types.EPISODE_AUTH_VALID,
            })
          }
        }
      })
      .catch(error => {
        dispatch(episodeAuthFetchFailed())
        handleError(error, dispatch)
      })
  }
}

export function resetPassword(data) {
  return dispatch => {
    axios
      .post(`${config.ap}/reset-password`, data)
      .then(res => {
        const token = res.data.token
        const user = res.data.user
        window.sessionStorage.setItem('jwtToken', token)
        dispatch({
          type: types.RESET_PASSWORD,
          userInfo: user,
        })
        dispatch(showNotification('密码修改成功'))
      })
      .catch(error => {
        handleError(error, dispatch)
      })
  }
}

export function modifyPassword(data) {
  return dispatch => {}
}
