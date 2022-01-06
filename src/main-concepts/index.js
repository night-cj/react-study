import React from 'react'
import './index.css'
const themes = ['light', 'dark']
const ThemeContext = React.createContext({
  theme: themes[0],
  toggleTheme: () => { },
})
// 更新时间
class Tick extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: String(new Date()),
    }
  }
  componentDidMount () {
    this.timerId = setInterval(() => this.tick(), 1000)
  }
  componentWillUnmount () {
    clearInterval(this.timerId)
  }
  tick () {
    this.setState({
      date: String(new Date()),
    })
  }
  static contextType = ThemeContext
  render () {
    return <div className={this.context.theme}>{this.state.date}</div>
  }
}

// form
class NameForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    this.setState({ value: e.target.value })
  }

  handleSubmit (e) {
    this.props.onSuccess(this.state.value)
    e.preventDefault()
  }
  render () {
    if (!this.props.children && this.state.value && !themes.includes(this.state.value)) {
      throw new Error('主题不存在')
    }
    return (
      <form onSubmit={this.handleSubmit} className={this.context.theme} style={{ padding: '8px' }}>
        <label>
          {this.props.children || '主题:'}
          <input className={this.context.theme} type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="提交" />
      </form>
    )
  }
}
NameForm.contextType = ThemeContext

// 状态提升
const scaleNames = {
  c: '摄氏度',
  f: '华氏度',
}

// 转摄氏度
function toCelsius (fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9
}

// 转华氏度
function toFahrenheit (celsius) {
  return (celsius * 9) / 5 + 32
}

function tryConvert (temperature, convert) {
  const val = parseFloat(temperature)
  if (Number.isNaN(val)) return ''
  const output = convert(val)
  const rounded = Math.round(output * 1000) / 1000
  return rounded.toString()
}

function BoilingVerdict (props) {
  if (props.celsius >= 100) {
    return <p>水沸腾了 {props.celsius} ℃</p>
  }
  return <p>水还没沸腾 {props.celsius || 0} ℃</p>
}

class TemperatureInput extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    this.props.onTemperatureChange(e.target.value)
  }
  static contextType = ThemeContext
  render () {
    const temperature = this.props.temperature
    const scale = this.props.scale
    return (
      <fieldset className={this.context.theme}>
        <legend>输入温度类型: {scaleNames[scale]}</legend>
        <input className={this.context.theme} value={temperature} onChange={this.handleChange} />
      </fieldset>
    )
  }
}

class Calculator extends React.Component {
  constructor (props) {
    super(props)
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this)
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this)
    this.state = { temperature: '', scale: 'c' }
  }
  handleCelsiusChange (temperature) {
    this.setState({ scale: 'c', temperature })
  }

  handleFahrenheitChange (temperature) {
    this.setState({ scale: 'f', temperature })
  }
  static contextType = ThemeContext
  render () {
    const scale = this.state.scale
    const temperature = this.state.temperature
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature
    return (
      <div className={this.context.theme}>
        <BoilingVerdict className={this.context.theme} celsius={celsius} />
        <TemperatureInput className={this.context.theme} scale="c" temperature={celsius} onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput className={this.context.theme} scale="f" temperature={fahrenheit} onTemperatureChange={this.handleFahrenheitChange} />
      </div>
    )
  }
}

class InputSwitchTheme extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isErr: false,
      errorInfo: ''
    }
  }

  // static getDerivedStateFromError (err) {
  //   // this.setState({
  //   //   isErr: true,
  //   //   errorInfo: err
  //   // })
  //   return {
  //     isErr: true,
  //     errorInfo: err
  //   }
  // }
  componentDidCatch (error, errorInfo) {
    this.setState({
      isErr: true,
      errorInfo: errorInfo
    })
  }
  render () {
    console.log(this.state.isErr)
    if (this.state.isErr) return this.state.errorInfo
    return <ThemeContext.Consumer>
      {
        ({ theme, toggleTheme }) => {
          return <NameForm
            onSuccess={toggleTheme}
            onChange={this.onChange}
          />
        }
      }
    </ThemeContext.Consumer>
  }
}

// context 切换主题
class SwitchTheme extends React.Component {
  constructor (props) {
    super(props)
    this.toggleTheme = (value) => {
      this.setState(state => ({
        theme: value
      }))
    }
    this.state = {
      theme: 'light',
      toggleTheme: this.toggleTheme
    }
  }
  static getDerivedStateFromError (error) {
    console.log(error)
    return {}
  }
  componentDidCatch (error, errorInfo) {
    console.log(error, errorInfo)
  }

  render () {
    return (
      <div className="switch-theme">
        <label className={this.state.theme}>
          <input type="radio" name="switch" value="light" checked={this.state.theme === 'light'} onChange={e => this.toggleTheme(e.target.value)}></input>白
        </label>
        <label className={this.state.theme}>
          <input type="radio" name="switch" value="dark" checked={this.state.theme === 'dark'} onChange={e => this.toggleTheme(e.target.value)}></input>黑
        </label>
        <ThemeContext.Provider value={this.state}>{this.props.children}</ThemeContext.Provider>
      </div>
    )
  }
}
const el = function () {
  return (
    <div>
      <SwitchTheme>
        <Tick />
        <hr />
        <InputSwitchTheme />
        <hr />
        <NameForm>
          <span>姓名:</span>
        </NameForm>
        <hr />
        <Calculator />
        <hr />
      </SwitchTheme>
      <hr />
    </div>
  )
}
export default el