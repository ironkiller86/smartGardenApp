/**
 * third-party imports
 */
import React from 'react';
/**
 *  components import
 */

import { AppData } from './index';

/**
 *  Funzione HOC per avere il context obj in tutta l'applicazione 
 * @param {*} Component 
 */
export  function withContext(Component) {
  return function ContextComponent(props) {
  
    return (
      <AppData.Consumer>
           {context => <Component {...props} context={{...context}} />}
      </AppData.Consumer>
    );
  };
}