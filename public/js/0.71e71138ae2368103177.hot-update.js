webpackHotUpdate(0,{

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.facebookLogin = facebookLogin;\nexports.link = link;\nexports.unlink = unlink;\n\nvar _url = __webpack_require__(583);\n\nvar _url2 = _interopRequireDefault(_url);\n\nvar _querystring = __webpack_require__(263);\n\nvar _querystring2 = _interopRequireDefault(_querystring);\n\nvar _moment = __webpack_require__(1);\n\nvar _moment2 = _interopRequireDefault(_moment);\n\nvar _reactCookie = __webpack_require__(264);\n\nvar _reactCookie2 = _interopRequireDefault(_reactCookie);\n\nvar _reactRouter = __webpack_require__(33);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// Sign in with Facebook\n//boilerplate id:\n// clientId: '980220002068787',\n//fb id:\nfunction facebookLogin() {\n  var facebook = {\n    url: 'https://obscure-crag-40112.herokuapp.com/auth/facebook',\n    clientId: '1551965698224328',\n    redirectUri: 'https://obscure-crag-40112.herokuapp.com/auth/facebook/callback',\n    authorizationUrl: 'https://www.facebook.com/v2.5/dialog/oauth',\n    scope: 'email,user_location',\n    width: 580,\n    height: 400\n  };\n  console.log('facebook', facebook);\n\n  return function (dispatch) {\n    oauth2(facebook, dispatch).then(openPopup).then(pollPopup).then(exchangeCodeForToken).then(signIn).then(closePopup);\n  };\n}\n\n// Link account\nfunction link(provider) {\n  switch (provider) {\n    case 'facebook':\n      return facebookLogin();\n    default:\n      return {\n        type: 'LINK_FAILURE',\n        messages: [{ msg: 'Invalid OAuth Provider' }]\n      };\n  }\n}\n\n// Unlink account\nfunction unlink(provider) {\n  return function (dispatch) {\n    return fetch('/unlink/' + provider).then(function (response) {\n      if (response.ok) {\n        return response.json().then(function (json) {\n          dispatch({\n            type: 'UNLINK_SUCCESS',\n            messages: [json]\n          });\n        });\n      } else {\n        return response.json().then(function (json) {\n          dispatch({\n            type: 'UNLINK_FAILURE',\n            messages: [json]\n          });\n        });\n      }\n    });\n  };\n}\n\nfunction oauth2(config, dispatch) {\n  return new Promise(function (resolve, reject) {\n    var params = {\n      client_id: config.clientId,\n      redirect_uri: config.redirectUri,\n      scope: config.scope,\n      display: 'popup',\n      response_type: 'code'\n    };\n    var url = config.authorizationUrl + '?' + _querystring2.default.stringify(params);\n    resolve({ url: url, config: config, dispatch: dispatch });\n  });\n}\n\nfunction oauth1(config, dispatch) {\n  return new Promise(function (resolve, reject) {\n    resolve({ url: 'about:blank', config: config, dispatch: dispatch });\n  });\n}\n\nfunction openPopup(_ref) {\n  var url = _ref.url,\n      config = _ref.config,\n      dispatch = _ref.dispatch;\n\n  return new Promise(function (resolve, reject) {\n    var width = config.width || 500;\n    var height = config.height || 500;\n    var options = {\n      width: width,\n      height: height,\n      top: window.screenY + (window.outerHeight - height) / 2.5,\n      left: window.screenX + (window.outerWidth - width) / 2\n    };\n    var popup = window.open(url, '_blank', _querystring2.default.stringify(options, ','));\n\n    if (url === 'about:blank') {\n      popup.document.body.innerHTML = 'Loading...';\n    }\n\n    resolve({ window: popup, config: config, dispatch: dispatch });\n  });\n}\n\nfunction getRequestToken(_ref2) {\n  var window = _ref2.window,\n      config = _ref2.config,\n      dispatch = _ref2.dispatch;\n\n  return new Promise(function (resolve, reject) {\n    return fetch(config.url, {\n      method: 'post',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({\n        redirectUri: config.redirectUri\n      })\n    }).then(function (response) {\n      if (response.ok) {\n        return response.json().then(function (json) {\n          resolve({ window: window, config: config, requestToken: json, dispatch: dispatch });\n        });\n      }\n    });\n  });\n}\n\nfunction pollPopup(_ref3) {\n  var window = _ref3.window,\n      config = _ref3.config,\n      requestToken = _ref3.requestToken,\n      dispatch = _ref3.dispatch;\n\n  return new Promise(function (resolve, reject) {\n    var redirectUri = _url2.default.parse(config.redirectUri);\n    var redirectUriPath = redirectUri.host + redirectUri.pathname;\n\n    if (requestToken) {\n      window.location = config.authorizationUrl + '?' + _querystring2.default.stringify(requestToken);\n    }\n\n    var polling = setInterval(function () {\n      if (!window || window.closed) {\n        clearInterval(polling);\n      }\n      try {\n        var popupUrlPath = window.location.host + window.location.pathname;\n        if (popupUrlPath === redirectUriPath) {\n          if (window.location.search || window.location.hash) {\n            var query = _querystring2.default.parse(window.location.search.substring(1).replace(/\\/$/, ''));\n            var hash = _querystring2.default.parse(window.location.hash.substring(1).replace(/[\\/$]/, ''));\n            var params = Object.assign({}, query, hash);\n\n            if (params.error) {\n              dispatch({\n                type: 'OAUTH_FAILURE',\n                messages: [{ msg: params.error }]\n              });\n            } else {\n              resolve({ oauthData: params, config: config, window: window, interval: polling, dispatch: dispatch });\n            }\n          } else {\n            dispatch({\n              type: 'OAUTH_FAILURE',\n              messages: [{ msg: 'OAuth redirect has occurred but no query or hash parameters were found.' }]\n            });\n          }\n        }\n      } catch (error) {\n        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.\n        // A hack to get around same-origin security policy errors in Internet Explorer.\n      }\n    }, 500);\n  });\n}\n\nfunction exchangeCodeForToken(_ref4) {\n  var oauthData = _ref4.oauthData,\n      config = _ref4.config,\n      window = _ref4.window,\n      interval = _ref4.interval,\n      dispatch = _ref4.dispatch;\n\n  return new Promise(function (resolve, reject) {\n    var data = Object.assign({}, oauthData, config);\n\n    return fetch(config.url, {\n      method: 'post',\n      headers: { 'Content-Type': 'application/json' },\n      credentials: 'same-origin', // By default, fetch won't send any cookies to the server\n      body: JSON.stringify(data)\n    }).then(function (response) {\n      if (response.ok) {\n        return response.json().then(function (json) {\n          resolve({ token: json.token, user: json.user, window: window, interval: interval, dispatch: dispatch });\n        });\n      } else {\n        return response.json().then(function (json) {\n          dispatch({\n            type: 'OAUTH_FAILURE',\n            messages: Array.isArray(json) ? json : [json]\n          });\n          closePopup({ window: window, interval: interval });\n        });\n      }\n    });\n  });\n}\n\nfunction signIn(_ref5) {\n  var token = _ref5.token,\n      user = _ref5.user,\n      window = _ref5.window,\n      interval = _ref5.interval,\n      dispatch = _ref5.dispatch;\n\n  return new Promise(function (resolve, reject) {\n    dispatch({\n      type: 'OAUTH_SUCCESS',\n      token: token,\n      user: user\n    });\n    _reactCookie2.default.save('token', token, { expires: (0, _moment2.default)().add(1, 'hour').toDate() });\n    _reactRouter.browserHistory.push('/');\n    resolve({ window: window, interval: interval });\n  });\n}\n\nfunction closePopup(_ref6) {\n  var window = _ref6.window,\n      interval = _ref6.interval;\n\n  return new Promise(function (resolve, reject) {\n    clearInterval(interval);\n    window.close();\n    resolve();\n  });\n}//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNjkuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vYXBwL2FjdGlvbnMvb2F1dGguanM/ZGE2NiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5pbXBvcnQgcXMgZnJvbSAncXVlcnlzdHJpbmcnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IGNvb2tpZSBmcm9tICdyZWFjdC1jb29raWUnO1xuaW1wb3J0IHsgYnJvd3Nlckhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xuXG4vLyBTaWduIGluIHdpdGggRmFjZWJvb2tcbi8vYm9pbGVycGxhdGUgaWQ6XG4vLyBjbGllbnRJZDogJzk4MDIyMDAwMjA2ODc4NycsXG4vL2ZiIGlkOlxuZXhwb3J0IGZ1bmN0aW9uIGZhY2Vib29rTG9naW4oKSB7XG4gIGNvbnN0IGZhY2Vib29rID0ge1xuICAgIHVybDogJ2h0dHBzOi8vb2JzY3VyZS1jcmFnLTQwMTEyLmhlcm9rdWFwcC5jb20vYXV0aC9mYWNlYm9vaycsXG4gICAgY2xpZW50SWQ6ICcxNTUxOTY1Njk4MjI0MzI4JyxcbiAgICByZWRpcmVjdFVyaTogJ2h0dHBzOi8vb2JzY3VyZS1jcmFnLTQwMTEyLmhlcm9rdWFwcC5jb20vYXV0aC9mYWNlYm9vay9jYWxsYmFjaycsXG4gICAgYXV0aG9yaXphdGlvblVybDogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS92Mi41L2RpYWxvZy9vYXV0aCcsXG4gICAgc2NvcGU6ICdlbWFpbCx1c2VyX2xvY2F0aW9uJyxcbiAgICB3aWR0aDogNTgwLFxuICAgIGhlaWdodDogNDAwXG4gIH07XG4gIGNvbnNvbGUubG9nKCdmYWNlYm9vaycsIGZhY2Vib29rKTtcblxuICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XG4gICAgb2F1dGgyKGZhY2Vib29rLCBkaXNwYXRjaClcbiAgICAgIC50aGVuKG9wZW5Qb3B1cClcbiAgICAgIC50aGVuKHBvbGxQb3B1cClcbiAgICAgIC50aGVuKGV4Y2hhbmdlQ29kZUZvclRva2VuKVxuICAgICAgLnRoZW4oc2lnbkluKVxuICAgICAgLnRoZW4oY2xvc2VQb3B1cCk7XG4gIH07XG59XG5cbi8vIExpbmsgYWNjb3VudFxuZXhwb3J0IGZ1bmN0aW9uIGxpbmsocHJvdmlkZXIpIHtcbiAgc3dpdGNoIChwcm92aWRlcikge1xuICAgIGNhc2UgJ2ZhY2Vib29rJzpcbiAgICAgIHJldHVybiBmYWNlYm9va0xvZ2luKCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdMSU5LX0ZBSUxVUkUnLFxuICAgICAgICBtZXNzYWdlczogW3sgbXNnOiAnSW52YWxpZCBPQXV0aCBQcm92aWRlcicgfV1cbiAgICAgIH1cbiAgfVxufVxuXG4vLyBVbmxpbmsgYWNjb3VudFxuZXhwb3J0IGZ1bmN0aW9uIHVubGluayhwcm92aWRlcikge1xuICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKCcvdW5saW5rLycgKyBwcm92aWRlcikudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4oKGpzb24pID0+IHtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiAnVU5MSU5LX1NVQ0NFU1MnLFxuICAgICAgICAgICAgbWVzc2FnZXM6IFtqc29uXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbigoanNvbikgPT4ge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdVTkxJTktfRkFJTFVSRScsXG4gICAgICAgICAgICBtZXNzYWdlczogW2pzb25dXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9hdXRoMihjb25maWcsIGRpc3BhdGNoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgY2xpZW50X2lkOiBjb25maWcuY2xpZW50SWQsXG4gICAgICByZWRpcmVjdF91cmk6IGNvbmZpZy5yZWRpcmVjdFVyaSxcbiAgICAgIHNjb3BlOiBjb25maWcuc2NvcGUsXG4gICAgICBkaXNwbGF5OiAncG9wdXAnLFxuICAgICAgcmVzcG9uc2VfdHlwZTogJ2NvZGUnXG4gICAgfTtcbiAgICBjb25zdCB1cmwgPSBjb25maWcuYXV0aG9yaXphdGlvblVybCArICc/JyArIHFzLnN0cmluZ2lmeShwYXJhbXMpO1xuICAgIHJlc29sdmUoeyB1cmw6IHVybCwgY29uZmlnOiBjb25maWcsIGRpc3BhdGNoOiBkaXNwYXRjaCB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG9hdXRoMShjb25maWcsIGRpc3BhdGNoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgcmVzb2x2ZSh7IHVybDogJ2Fib3V0OmJsYW5rJywgY29uZmlnOiBjb25maWcsIGRpc3BhdGNoOiBkaXNwYXRjaCB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG9wZW5Qb3B1cCh7IHVybCwgY29uZmlnLCBkaXNwYXRjaCB9KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgd2lkdGggPSBjb25maWcud2lkdGggfHwgNTAwO1xuICAgIGNvbnN0IGhlaWdodCA9IGNvbmZpZy5oZWlnaHQgfHwgNTAwO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICB3aWR0aDogd2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIHRvcDogd2luZG93LnNjcmVlblkgKyAoKHdpbmRvdy5vdXRlckhlaWdodCAtIGhlaWdodCkgLyAyLjUpLFxuICAgICAgbGVmdDogd2luZG93LnNjcmVlblggKyAoKHdpbmRvdy5vdXRlcldpZHRoIC0gd2lkdGgpIC8gMilcbiAgICB9O1xuICAgIGNvbnN0IHBvcHVwID0gd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJywgcXMuc3RyaW5naWZ5KG9wdGlvbnMsICcsJykpO1xuXG4gICAgaWYgKHVybCA9PT0gJ2Fib3V0OmJsYW5rJykge1xuICAgICAgcG9wdXAuZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnTG9hZGluZy4uLic7XG4gICAgfVxuXG4gICAgcmVzb2x2ZSh7IHdpbmRvdzogcG9wdXAsIGNvbmZpZzogY29uZmlnLCBkaXNwYXRjaDogZGlzcGF0Y2ggfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRSZXF1ZXN0VG9rZW4oeyB3aW5kb3csIGNvbmZpZywgZGlzcGF0Y2ggfSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHJldHVybiBmZXRjaChjb25maWcudXJsLCB7XG4gICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICByZWRpcmVjdFVyaTogY29uZmlnLnJlZGlyZWN0VXJpXG4gICAgICB9KVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKChqc29uKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh7IHdpbmRvdzogd2luZG93LCBjb25maWc6IGNvbmZpZywgcmVxdWVzdFRva2VuOiBqc29uLCBkaXNwYXRjaDogZGlzcGF0Y2ggfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcG9sbFBvcHVwKHsgd2luZG93LCBjb25maWcsIHJlcXVlc3RUb2tlbiwgZGlzcGF0Y2ggfSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHJlZGlyZWN0VXJpID0gdXJsLnBhcnNlKGNvbmZpZy5yZWRpcmVjdFVyaSk7XG4gICAgY29uc3QgcmVkaXJlY3RVcmlQYXRoID0gcmVkaXJlY3RVcmkuaG9zdCArIHJlZGlyZWN0VXJpLnBhdGhuYW1lO1xuXG4gICAgaWYgKHJlcXVlc3RUb2tlbikge1xuICAgICAgd2luZG93LmxvY2F0aW9uID0gY29uZmlnLmF1dGhvcml6YXRpb25VcmwgKyAnPycgKyBxcy5zdHJpbmdpZnkocmVxdWVzdFRva2VuKTtcbiAgICB9XG5cbiAgICBjb25zdCBwb2xsaW5nID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKCF3aW5kb3cgfHwgd2luZG93LmNsb3NlZCkge1xuICAgICAgICBjbGVhckludGVydmFsKHBvbGxpbmcpO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcG9wdXBVcmxQYXRoID0gd2luZG93LmxvY2F0aW9uLmhvc3QgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICAgIGlmIChwb3B1cFVybFBhdGggPT09IHJlZGlyZWN0VXJpUGF0aCkge1xuICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoIHx8IHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IHFzLnBhcnNlKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpLnJlcGxhY2UoL1xcLyQvLCAnJykpO1xuICAgICAgICAgICAgY29uc3QgaGFzaCA9IHFzLnBhcnNlKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKS5yZXBsYWNlKC9bXFwvJF0vLCAnJykpO1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgcXVlcnksIGhhc2gpO1xuXG4gICAgICAgICAgICBpZiAocGFyYW1zLmVycm9yKSB7XG4gICAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnT0FVVEhfRkFJTFVSRScsXG4gICAgICAgICAgICAgICAgbWVzc2FnZXM6IFt7IG1zZzogcGFyYW1zLmVycm9yIH1dXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh7IG9hdXRoRGF0YTogcGFyYW1zLCBjb25maWc6IGNvbmZpZywgd2luZG93OiB3aW5kb3csIGludGVydmFsOiBwb2xsaW5nLCBkaXNwYXRjaDogZGlzcGF0Y2ggfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgdHlwZTogJ09BVVRIX0ZBSUxVUkUnLFxuICAgICAgICAgICAgICBtZXNzYWdlczogW3sgbXNnOiAnT0F1dGggcmVkaXJlY3QgaGFzIG9jY3VycmVkIGJ1dCBubyBxdWVyeSBvciBoYXNoIHBhcmFtZXRlcnMgd2VyZSBmb3VuZC4nIH1dXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIElnbm9yZSBET01FeGNlcHRpb246IEJsb2NrZWQgYSBmcmFtZSB3aXRoIG9yaWdpbiBmcm9tIGFjY2Vzc2luZyBhIGNyb3NzLW9yaWdpbiBmcmFtZS5cbiAgICAgICAgLy8gQSBoYWNrIHRvIGdldCBhcm91bmQgc2FtZS1vcmlnaW4gc2VjdXJpdHkgcG9saWN5IGVycm9ycyBpbiBJbnRlcm5ldCBFeHBsb3Jlci5cbiAgICAgIH1cbiAgICB9LCA1MDApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZXhjaGFuZ2VDb2RlRm9yVG9rZW4oeyBvYXV0aERhdGEsIGNvbmZpZywgd2luZG93LCBpbnRlcnZhbCwgZGlzcGF0Y2ggfSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBvYXV0aERhdGEsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZmV0Y2goY29uZmlnLnVybCwge1xuICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLCAvLyBCeSBkZWZhdWx0LCBmZXRjaCB3b24ndCBzZW5kIGFueSBjb29raWVzIHRvIHRoZSBzZXJ2ZXJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4oKGpzb24pID0+IHtcbiAgICAgICAgICByZXNvbHZlKHsgdG9rZW46IGpzb24udG9rZW4sIHVzZXI6IGpzb24udXNlciwgd2luZG93OiB3aW5kb3csIGludGVydmFsOiBpbnRlcnZhbCwgZGlzcGF0Y2g6IGRpc3BhdGNoIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbigoanNvbikgPT4ge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdPQVVUSF9GQUlMVVJFJyxcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBBcnJheS5pc0FycmF5KGpzb24pID8ganNvbiA6IFtqc29uXVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsb3NlUG9wdXAoeyB3aW5kb3c6IHdpbmRvdywgaW50ZXJ2YWw6IGludGVydmFsIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNpZ25Jbih7IHRva2VuLCB1c2VyLCB3aW5kb3csIGludGVydmFsLCBkaXNwYXRjaCB9KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ09BVVRIX1NVQ0NFU1MnLFxuICAgICAgdG9rZW46IHRva2VuLFxuICAgICAgdXNlcjogdXNlclxuICAgIH0pO1xuICAgIGNvb2tpZS5zYXZlKCd0b2tlbicsIHRva2VuLCB7IGV4cGlyZXM6IG1vbWVudCgpLmFkZCgxLCAnaG91cicpLnRvRGF0ZSgpIH0pO1xuICAgIGJyb3dzZXJIaXN0b3J5LnB1c2goJy8nKTtcbiAgICByZXNvbHZlKHsgd2luZG93OiB3aW5kb3csIGludGVydmFsOiBpbnRlcnZhbCB9KTtcbiAgfSk7XG5cbn1cblxuXG5mdW5jdGlvbiBjbG9zZVBvcHVwKHsgd2luZG93LCBpbnRlcnZhbCB9KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgd2luZG93LmNsb3NlKCk7XG4gICAgcmVzb2x2ZSgpO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBhcHAvYWN0aW9ucy9vYXV0aC5qcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFVQTtBQXVCQTtBQWFBO0FBQ0E7QUEvQ0E7QUFDQTs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFKQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUhBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=");

/***/ })

})