;(function () {
  'use strict'

  let timerId
  const get = (target) => {
    return document.querySelector(target)
  }

  const throttle = (callback, time) => {
    // 이벤트 발생 후 일정시간 후에 액션이 실행되게 하는 것. setTimeout을 이용.
    // callback을 time 후에 실행 -> 중복 실행 방지! (과한 클릭 등)
    if (timerId) return

    timerId = setTimeout(() => {
      callback()
      timerId = undefined
    }, time)
  }

  const $progressBar = get('.progress-bar')

  const onScroll = () => {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    // scrollTop이 clientHeight로 인해 scrollHeight의 맨 바닥까지 닿을 수 없으므로
    // scrollHeight에서 보여지는 부분(clientHeight)는 빼줌

    const scrollTop = document.documentElement.scrollTop

    const width = (scrollTop / height) * 100

    $progressBar.style.width = width + '%'
  }
  window.addEventListener('scroll', () => throttle(onScroll, 100))
})()
