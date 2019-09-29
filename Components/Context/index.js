import React,{Component} from 'react'

export const AppData = React.createContext();

class Provider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            irrigation:false,
             utility: {
                setData: (val) => this.setState({ data: val }),
                getData: () => { return this.state.data },
                setIrrigation: (par) => this.setState({ irrigation: par }),
                getIrrigation: ()=> {return this.state.irrigation}
            }
        }
    }
    /**
     * 
     */
  
    render() {
       
        return (
            <AppData.Provider value={this.state.utility}>
                {this.props.children}
            </AppData.Provider>
        );
    }
}
export default Provider