import React from 'react'
import ReactDOM from 'react-dom'

// 更新时间
class Tick extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: String(new Date()),
    }
  }
  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 1000)
  }
  componentWillUnmount() {
    clearInterval(this.timerId)
  }
  tick() {
    this.setState({
      date: String(new Date()),
    })
  }
  render() {
    return <div>{this.state.date}</div>
  }
}

// form
class NameForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '123',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    console.log(e)
    this.setState({ value: e.target.value })
  }

  handleSubmit(e) {
    console.log('提交 ： ' + this.state.value)
    e.preventDefault()
  }

  render() {
    console.log(this)
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="提交" />
      </form>
    )
  }
}

// 状态提升
const scaleNames = {
  c: '摄氏度',
  f: '华氏度',
}

// 转摄氏度
function toCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9
}

// 转华氏度
function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32
}

function tryConvert(temperature, convert) {
  const val = parseFloat(temperature)
  if (Number.isNaN(val)) return ''
  const output = convert(val)
  const rounded = Math.round(output * 1000) / 1000
  return rounded.toString()
}

function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>水沸腾了 {props.celsius} ℃</p>
  }
  return <p>水还没沸腾 {props.celsius || 0} ℃</p>
}

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(e) {
    this.props.onTemperatureChange(e.target.value)
  }
  render() {
    const temperature = this.props.temperature
    const scale = this.props.scale
    return (
      <fieldset>
        <legend>输入温度类型: {scaleNames[scale]}</legend>
        <input value={temperature} onChange={this.handleChange} />
      </fieldset>
    )
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this)
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this)
    this.state = { temperature: '', scale: 'c' }
  }
  handleCelsiusChange(temperature) {
    this.setState({ scale: 'c', temperature })
  }

  handleFahrenheitChange(temperature) {
    this.setState({ scale: 'f', temperature })
  }
  render() {
    const scale = this.state.scale
    const temperature = this.state.temperature
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature
    return (
      <div>
        <BoilingVerdict celsius={celsius} />
        <TemperatureInput scale="c" temperature={celsius} onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput scale="f" temperature={fahrenheit} onTemperatureChange={this.handleFahrenheitChange} />
      </div>
    )
  }
}

// context

export default function () {
  return (
    <div>
      <Tick />
      <NameForm />
      <Calculator />
    </div>
  )
}
