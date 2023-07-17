;(function () {
  // 즉시 실행 함수 형태
  'use strict' // 엄격하게 문법 확인

  const get = (target) => {
    return document.querySelector(target)
  }

  const init = () => {
    get('form').addEventListener('submit', (event) => {
      playGame(event)
    })

    setPassword()
  }

  const baseball = {
    limit: 10,
    digit: 4,
    trial: 0,
    end: false,
    $question: get('.ball_question'),
    $answer: get('.ball_answer'),
    $input: get('.ball_input'),
  }

  const { limit, digit, $question, $answer, $input } = baseball
  let { trial, end } = baseball

  const setPassword = () => {
    // password(정답) 지정
    const gameLimit = Array(limit).fill(false)
    let password = '' // 여기서 문자열로 선언해서
    while (password.length < digit) {
      const random = parseInt(Math.random() * 10, 10) // 10진수

      if (gameLimit[random]) {
        continue
      }
      password += random // += 로 해줘도 숫자끼리 더해지는게 아니라 문자열로 생성되는구나!
      gameLimit[random] = true
    }

    baseball.password = password
  }

  const onPlayed = (number, hint) => {
    // 시도를 했을 때 number : 입력 숫자, hint: 현재 상황 을 출력
    return `<em>${trial}차 시도</em>: ${number}, ${hint}`
  }

  const isCorrect = (number, password) => {
    // 번호가 같은가? 확인
    return number === password
  }

  const isDuplicated = (number) => {
    // 중복번호가 있는가?
    return [...new Set(number.split(''))].length !== digit
    // 배열을 중복없이 반환하는 set() => 중복이 있다면 자릿수가 안맞으므로 이를 이용해 확인.
  }

  const getStrike = (number, password) => {
    // 스트라이크 카운트는 몇 개?
    let strike = 0
    const nums = number.split('')

    nums.map((digit, index) => {
      if (digit === password[index]) {
        strike++
      }
    })
    return strike
  }

  // !! 정독 필요
  const getBall = (number, password) => {
    // 볼 카운트는 몇 개?
    let ball = 0
    const nums = number.split('') // array로 반환
    const gameLimit = Array(limit).fill(false)

    password.split('').map((num) => {
      gameLimit[num] = true
    })

    nums.map((num, index) => {
      // 유저 입력값과 정답값 비교, 자리는 일치하지않지만 숫자를 가지고는 있는지.
      if (password[index] !== num && !!gameLimit[num]) {
        ball++
      }
    })
    return ball
  }

  const getResult = (number, password) => {
    // 그래서 이 시도에 따른 카운트 결과는? = 힌트 반환
    if (isCorrect(number, password)) {
      // 일치하면 종료
      end = true
      $answer.innerHTML = baseball.password
      return '홈런!!'
    }

    // 불일치일 경우 카운트 힌트 제공
    const strikes = getStrike(number, password)
    const balls = getBall(number, password)
    return `STRIKE: ${strikes}, BALL: ${balls}`
  }

  const playGame = (event) => {
    // 게임 플레이
    event.preventDefault()
    if (!!end) {
      return
    }
    const inputNumber = $input.value // 입력값
    const { password } = baseball // 정답

    if (inputNumber.length !== digit) {
      // 자릿수 부족
      alert(`${digit}자리 숫자를 입력해주세요.`)
    } else if (isDuplicated(inputNumber)) {
      // 중복 체크
      alert(`중복 숫자가 있습니다.`)
    } else {
      trial++
      const result = onPlayed(inputNumber, getResult(inputNumber, password))
      $question.innerHTML += `<span>${result}</span>`
    }

    if (limit <= trial && !isCorrect(inputNumber, password)) {
      // 횟수 초과 및 오답 제출
      alert(`쓰리아웃!`)
      end = true
      $answer.innerHTML = password
    }

    $input.value = ''
    $input.focus()
  }

  init()
})()
