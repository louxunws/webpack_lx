import React from 'react'
import logo from './images/logo.png'
import './search.less'

class Search extends React.Component{
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <>
                <img src={ logo }></img>
                <div className='search'>woshi Search jiajia000</div>
            </>
        )
    }
}

export default Search