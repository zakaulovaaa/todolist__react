import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Open_my_popap from './App';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


let elem = document.getElementById('add_task');
elem.addEventListener("click", open_popap);

function open_popap() {
    alert("МЕНЯ НАЖАЛИ");
    const element = <Open_my_popap
        popap_openis={true}
        task_new={true}
    />;
    ReactDOM.render(element, document.getElementById('root'));
}


