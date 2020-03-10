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



import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const classes = useStyles;

let rows_task = []; //массив со значениями для таблицы
let id_new = 0; //счетчик для создания id
let st_ = "Новая";

function createData( description_, status_, priority_, date1, date2 ) { //собираем структуру для добавления в rows_task 
  return { description_, status_, priority_, date1, date2 };
}

function display_date_format( str ) { //преобразуем дату в формад дд.мм.гггг
  if ( str == '-' ) return '-';
  return ( str[8] + str[9] + '.' + str[5] + str[6] + '.' + str[0] + str[1] + str[2] + str[3] );
}

document.addEventListener( "DOMContentLoaded", () => { //действия при кликах на таблицу
  let tab = document.getElementById( "tab" ); 

  tab.onclick = e => { //при онклике удалять строку из таблицы
    let cell = e.target;
    let row = cell.parentElement;
    let rows = row.parentElement.children;
    for (var i = 0; i < rows.length; ++i) {
      if ( rows[i] === row ) {
        break;
      }
    }
    let columns = row.children;
    for (var j = 0; j < columns.length; ++j) {
      if ( columns[j] === cell ) {
        break;
      }
    }
    if (j == 5) {
      rows_task.splice( i, 1 );
      row_json_add();
      ReactDOM.render(< My_table rows_task_={ rows_task } /> , document.getElementById( 'content_table' ));
      update_statistic();
    }
  };

  tab.ondblclick = e => { //при даблклике открывать попап для редактирования
    let cell = e.target;
    let row = cell.parentElement;
    let rows = row.parentElement.children;
    for (var i = 0; i < rows.length; ++i) {
      if ( rows[i] === row ) {
        break;
      }
    }
    let columns = row.children;
    for (var j = 0; j < columns.length; ++j) {
      if ( columns[j] === cell ) {
        break;
      }
    }
    const element = < Open_my_popap
      popap_openis={ true }
      task_new = { false }
      id = { i }
    />;
    ReactDOM.render( element, document.getElementById( 'root' ) );
  };
});

document.addEventListener( "DOMContentLoaded", () => { //фильтры по статусу
  document.getElementById( "statistic_all_task" ).onclick = e => {
    ReactDOM.render(< My_table rows_task_ = { rows_task } />, document.getElementById( 'content_table' ));
  }
  document.getElementById( "statistic_new_task" ).onclick = e => {
    let filter_arr = rows_task.filter(
      function( row ) {
        return row['status_'] == 'Новая';
      }
    )
    ReactDOM.render(< My_table rows_task_ = { filter_arr } />, document.getElementById( 'content_table' ));
  }
  document.getElementById( "statistic_in_work_task" ).onclick = e => {
    let filter_arr = rows_task.filter(
      function( row ) {
        return row['status_'] == 'В работе';
      }
    )
    ReactDOM.render(< My_table rows_task_ = { filter_arr } />, document.getElementById( 'content_table' ));
  }
  document.getElementById( "statistic_completed_task" ).onclick = e => {
    let filter_arr = rows_task.filter(
      function( row ) {
        return row['status_'] == 'Завершено';
      }
    )
    ReactDOM.render(< My_table rows_task_ = { filter_arr } />, document.getElementById( 'content_table' ));
  }
});

document.addEventListener( "DOMContentLoaded", () => { //при изменении поля "поиск" фильтровать список
  document.getElementById( 'search_task' ).oninput = e => {
    let str = document.getElementById( "search_task" ).value.toLowerCase();
    let filter_arr = rows_task.filter(
      function( row ) {
        return (row['description_'].toLowerCase().indexOf( str ) != -1);
      }
    )
    row_json_get();
    ReactDOM.render(< My_table rows_task_ = { filter_arr } />, document.getElementById( 'content_table' ));
  }
});

class My_table extends React.Component {  //собссна, сама таблица
  constructor( props ) {
    super( props );
  }
  render() {
    return(
      <TableContainer component={Paper} id="tab">
        <Table className={useStyles.table} aria-label="table">
        <TableHead>
          <TableRow>
          <TableCell>Описание</TableCell>
          <TableCell align="right">Статус</TableCell>
          <TableCell align="right">Приоритет</TableCell>
          <TableCell align="right">Плановая дата окончания</TableCell>
          <TableCell align="right">Фактическая дата окончания</TableCell>
          <TableCell align="right">Действие</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.rows_task_.map(row => (
          <TableRow key = { row.description_ }>
            <TableCell component="th" scope="row"> { row.description_} </TableCell>
            <TableCell align="right">{ row.status_ }</TableCell>
            <TableCell align="right">{ row.priority_ }</TableCell>
            <TableCell align="right">{ display_date_format( row.date1 ) }</TableCell>
            <TableCell align="right">{ display_date_format( row.date2 ) }</TableCell>
            <TableCell align="right" id="act_delete">{ 'Удалить' }</TableCell>
          </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

function row_json_add() {  //закидываем массив в cookie
  document.cookie = JSON.stringify( rows_task );
}

function row_json_get() { //вытаскиваем массив из cookie
  rows_task = JSON.parse( document.cookie.slice( document.cookie.indexOf( '[' ) ) );
  ReactDOM.render(< My_table rows_task_ = { rows_task } />, document.getElementById( 'content_table' ));
}


function now_date() { //возвращает текущую дату в правильном формате
  let x = new Date();
  return (x.getFullYear() + "-" + 
          (x.getMonth() + 1 < 10 ? "0" + (x.getMonth() + 1) : (x.getMonth() + 1) ) + "-" + 
          (x.getDate() < 10 ? "0" + x.getDate() : x.getDate()));
}

function close_popap() { //закрывает попап
  const element = < Open_my_popap popap_openis = { false } />;
  ReactDOM.render( element, document.getElementById( 'root' ) );
}

function Open_my_popap(props) { // открываем попап для создания новой задачи
  if ( props.popap_openis ) {
    if ( props.task_new ) {
      return (
        <My_popap description_ = { '' } 
                  status_ = { 'Новая' } 
                  priority_ = { 'Низкий' } 
                  date_ = { now_date() } 
                  is_new_ = { true }
        />
      );
    } 
    st_ = rows_task[props.id]['status_'];
    return (
      <My_popap description_ = { rows_task[props.id]['description_'] }
                status_ = { rows_task[props.id]['status_'] }
                priority_ = { rows_task[props.id]['priority_'] }
                date_ = { rows_task[props.id]['date1'] }
                is_new_ = { false }
                id = { props.id }
      />
    );
  } 
}

class Popap_status extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      is_new: props.is_new_,
      input_status: props.input_status
    }
    this.handleChangeInputStatus = this.handleChangeInputStatus.bind( this );
  }
  handleChangeInputStatus( event ) {
    this.setState({ input_status: event.target.value });
    st_ = event.target.value;
  }
  render() {
    if ( this.state.is_new ) {
      return(
        <select value = { this.state.input_status } onChange = { this.handleChangeInputStatus }>
          <option>Новая</option>
        </select>
      );
    }
    return(
      <select value = { this.state.input_status } onChange = { this.handleChangeInputStatus }>
        <option>Новая</option>
        <option>В работе</option>
        <option>Завершено</option>
      </select>
    );
  }
}

class My_popap extends React.Component {
  
  constructor( props ) {
    super( props );

    this.state = {
      input_description: props.description_,
      input_status: props.status_,
      input_priority: props.priority_,
      input_date: props.date_,
      is_new: props.is_new_
    };
    this.handleChangeInputDescription = this.handleChangeInputDescription.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
    this.new_task = this.new_task.bind( this );
    this.handleChangeInputPriority = this.handleChangeInputPriority.bind( this );
    this.handleChangeInputDate = this.handleChangeInputDate.bind( this );

  }
  
  handleChangeInputDate( event ) {
    this.setState({ input_date: event.target.value });
  }

  handleChangeInputDescription( event ) {
    this.setState({ input_description: event.target.value });
  }

  handleChangeInputPriority( event ) {
    this.setState({ input_priority:event.target.value });
  }

  handleSubmit( event ) {
    event.preventDefault();
  }

  new_task( event ) {
    if (this.state.input_description == '') {
      alert("Поле \"Описание\" обязательно для заполнения");
    } else {
      if ( this.props.is_new_ ) {
        rows_task.push( createData( this.state.input_description, st_, this.state.input_priority, 
                                    this.state.input_date, "-" ) );
      } else {
        rows_task[this.props.id]['description_'] = this.state.input_description;
        if (rows_task[this.props.id]['status_'] == 'Завершено' && st_ == 'Завершено') {
          
        } else {
          if (st_ == 'Завершено') {
            rows_task[this.props.id]['date2'] = now_date();
          } else {
            rows_task[this.props.id]['date2'] = '-';
          }
        }
        rows_task[this.props.id]['status_'] = st_;
        rows_task[this.props.id]['date1'] = this.state.input_date;
        rows_task[this.props.id]['priority_'] = this.state.input_priority;
      } 
      close_popap();
      update_statistic();
      row_json_add();
      ReactDOM.render(< My_table rows_task_={ rows_task } />, document.getElementById( 'content_table' ));
    }
  }

  render() {
    return (
      <div className="Popap_window">
        <div className="popap_main">
          <header className="Popap_head">
            <h3 id="blyat">Создание / редактирование задачи</h3>
            <button className="popap_close" onClick={ close_popap }>x</button>
          </header>

          <p>Описание(*):</p>
          
          <input type="text" value={ this.state.input_description } onChange={ this.handleChangeInputDescription } />
        
          <div className="priority_status">
            <div className="priority">
              <p>Приоритет:</p>
              <select value={ this.state.input_priority } onChange={ this.handleChangeInputPriority }> 
                <option>Низкий</option>
                <option>Средний</option>
                <option>Высокий</option>
              </select>
            </div>
            <div className="status">
              <p>Статус:</p>

              <Popap_status is_new_ = { this.state.is_new } 
                            input_status = { this.state.input_status }
                            updateData = { this.updateData }
              /> 
            </div>
          </div>
          <div className="deadline">
            <p>Крайний срок:</p>
            <input type="date" id="date" value={ this.state.input_date } onChange={ this.handleChangeInputDate }></input>
          </div>
          <p className="for_potap_btn">
            <button className="popap_btn" onClick={ this.new_task } >Сохранить</button>
          </p>
        </div>
      </div>
    );
  }
}


function update_statistic() {
  document.getElementById( 'statistic_all_task' ).textContent = 'Всего - ' + rows_task.length;
  let cnt_new = 0, cnt_in_work = 0, cnt_finish = 0;
  for (let i = 0; i < rows_task.length; i++) {
    if (rows_task[i]['status_'] == 'Новая') {
      cnt_new++;
    }
    if (rows_task[i]['status_'] == 'В работе') {
      cnt_in_work++;
    }
    if (rows_task[i]['status_'] == 'Завершено') {
      cnt_finish++;
    }
  }
  document.getElementById( 'statistic_new_task' ).textContent = 'Новых - ' + cnt_new;
  document.getElementById( 'statistic_in_work_task' ).textContent = 'В работе - ' + cnt_in_work;
  document.getElementById( 'statistic_completed_task' ).textContent = 'Завершено - ' + cnt_finish;
}


ReactDOM.render(< My_table rows_task_ = { rows_task } />, document.getElementById( 'content_table' ));
row_json_get();
update_statistic();
