'use strict';

const e = React.createElement;

class Button extends React.Component {
  render() {
    return e(
      'button',
      { onClick: () => this.props.startGame(this.props.color) },
      this.props.color
    );
  }
}

class SnakeGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { gameStarted: false };
  }

  startGame(color) {
    // Lógica para iniciar el juego con el color especificado
    console.log(`Comenzando juego con serpiente ${color}`);
    this.setState({ gameStarted: true });
  }

  render() {
    return e(
      'div',
      null,
      !this.state.gameStarted && (
        e('div', null,
          e(Button, { color: 'Verde', startGame: this.startGame.bind(this) }),
          e(Button, { color: 'Azul', startGame: this.startGame.bind(this) }),
          e(Button, { color: 'Rojo', startGame: this.startGame.bind(this) }),
          e(Button, { color: 'Amarillo', startGame: this.startGame.bind(this) })
        )
      ),
      this.state.gameStarted && (
        e('div', null, 'Juego iniciado')
      )
    );
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(SnakeGame), domContainer);
