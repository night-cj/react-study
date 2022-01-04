import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const ThemeContext = React.createContext('light')
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
  static contextType = ThemeContext
  render() {
    return <div className={this.context}>{this.state.date}</div>
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
    return (
      <form onSubmit={this.handleSubmit} className={this.props.className} style={{ padding: '8px' }}>
        <label>
          {this.props.children || '名字:'}
          <input className={this.props.className} type="text" value={this.state.value} onChange={this.handleChange} />
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
      <fieldset className={this.props.className}>
        <legend>输入温度类型: {scaleNames[scale]}</legend>
        <input className={this.props.className} value={temperature} onChange={this.handleChange} />
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
      <div className={this.props.className}>
        <BoilingVerdict className={this.props.className} celsius={celsius} />
        <TemperatureInput className={this.props.className} scale="c" temperature={celsius} onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput className={this.props.className} scale="f" temperature={fahrenheit} onTemperatureChange={this.handleFahrenheitChange} />
      </div>
    )
  }
}

// context
class SwitchTheme extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: 'light',
    }
    this.handleSwitch = this.handleSwitch.bind(this)
  }

  handleSwitch(e) {
    this.setState({
      theme: e.target.value,
    })
  }

  render() {
    return (
      <div className="switch-theme">
        <label>
          <input type="radio" name="switch" value="light" defaultChecked={this.state.theme === 'light'} onClick={this.handleSwitch}></input>白
        </label>
        <label>
          <input type="radio" name="switch" value="dark" defaultChecked={this.state.theme === 'dark'} onClick={this.handleSwitch}></input>黑
        </label>

        <ThemeContext.Provider value={this.state.theme}>
          <Tick />
          <NameForm>
            <span>姓名:</span>
          </NameForm>
          <Calculator />
        </ThemeContext.Provider>
        {/* <ThemeContext.Consumer>
          {(theme, ToggleTheme) => {

          }}
        </ThemeContext.Consumer> */}
      </div>
    )
  }
}

export default function () {
  return (
    <div>
      {/* <Tick />
      <hr />
      <NameForm />
      <hr />
      <Calculator />
      <hr /> */}
      <SwitchTheme />
      <hr />
    </div>
  )
}
