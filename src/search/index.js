import React from 'react'
import ReactDom from 'react-dom'
import logo from '../images/logo.png'
import './search.less'

class Search extends React.Component{
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <>
                <img src={ logo }></img>
                <div>search页面</div>
            </>
        )
    }
}

ReactDom.render(
    <Search/>,
    document.getElementById('root')
)