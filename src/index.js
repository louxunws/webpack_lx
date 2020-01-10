import React from 'react'
import reactDom from 'react-dom'
import Search from './search.js'

class Index extends React.Component{
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <Search></Search>
        )
    }
}

reactDom.render(
    <Index/>,
    document.getElementById('root')
)
