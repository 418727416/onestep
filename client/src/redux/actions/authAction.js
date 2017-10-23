export function setCurrentUserInfo (data) {
  return {
    type: 'AUTH_USER',
    userInfo: data
  }
}

export function login (data) {
  return dispatch => {
    // axios ...
    dispatch(setCurrentUserInfo(data))
    window.localStorage.setItem('userInfo', data.username)
  }
}

export function logout (data) {
  return dispatch => {
    dispatch({ type: 'LOG_OUT' })
    window.localStorage.removeItem('userInfo')
  }
}

export function signup (data) {
  return dispatch => {
    // axios ...
    dispatch(setCurrentUserInfo(data))
    window.localStorage.setItem('userInfo', data.username)
  }
}

export function mailboxNotValid (data) {
  return dispatch => {
    dispatch({
      type: 'MAILBOX_NOT_VALID'
    })
  }
}

export function mailboxIsValid (data) {
  return dispatch => {
    dispatch({
      type: 'MAILBOX_IS_VALID'
    })
  }
}

export function usernameIsRequired (data) {
  console.log('usernameIsRequired');
  return dispatch => {
    dispatch({
      type: 'USERNAME_IS_REQUIRED'
    })
  }
}

export function usernameIsValid (data) {
  console.log('usernameIsValid');
  return dispatch => {
    dispatch({
      type: 'USERNAME_IS_VALID'
    })
  }
}

export function passwordTooShort (data) {
  return dispatch => {
    dispatch({
      type: 'PASSWORD_TOO_SHORT'
    })
  }
}

export function passwordIsValid (data) {
  return dispatch => {
    dispatch({
      type: 'PASSWORE_IS_VALID'
    })
  }
}

export function passwordsInconsistent (data) {
  return dispatch => {
    dispatch({
      type: 'PASSWORDS_INCONSISTENT'
    })
  }
}

export function passwordsConsistent (data) {
  return dispatch => {
    dispatch({
      type: 'PASSWORDS_CONSISTENT'
    })
  }
}
