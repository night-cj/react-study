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

export default function () {
  return (
    <div>
      <Tick />
    </div>
  )
}
