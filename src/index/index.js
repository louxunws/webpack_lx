import React from 'react'
import ReactDom from 'react-dom'

class Index extends React.Component{
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>首页</div>
        )
    }
}

ReactDom.render(
    <Index/>,
    document.getElementById('root')
)
