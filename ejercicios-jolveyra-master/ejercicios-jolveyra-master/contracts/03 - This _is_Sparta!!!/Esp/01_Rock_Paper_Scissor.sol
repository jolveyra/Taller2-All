//SPDX-License-Identifier:MIT
pragma solidity 0.8.24;

/**
 * @notice ¡Juguemos a piedra, papel o tijera en la cadena de bloques!
 */
contract Rock_Paper_Scissor {
    /// @notice Cree tres eventos

    /// @notice GameCreated: Este evento se llama después de crear un juego.
    /// @dev Debe contener la dirección del creador del juego, un entero único sin signo gameNumber,
    /// y un entero sin signo para el tamaño de apuesta.
    event GameCreated(address creador, uint256 gameNumber, uint256 apuesta);

    /// @notice GameStarted: Este evento se llama después de que los participante se unen al juego. Deben coincidir
    /// en el tamaño de la apuesta.
    /// @dev El evento incluirá una matriz que contiene las direcciones de los dos jugadores (el creador y el participante)
    /// así como el gameNumber.
    event GameStarted(address[2] jugadores, uint256 gameNumber);

    /// @notice GameComplete: Este evento se llama después de que ambos jugadores hayan hecho sus movimiento y el resultado del juego
    /// se ha decidido.
    /// @dev Contendrá la dirección del ganador (o la dirección cero en caso de empate) así como el número del juego.
    event GameComplete(address ganador, uint256 gameNumber);

    /// @notice Estados del juego
    enum Status {
        created,
        open,
        closed,
        finished
    }

    /// @notice Defina un tipo de datos para los movimientos 'piedra', 'papel', 'tijera' a partir del índice 1
    enum Movement {
        none,
        piedra,
        papel,
        tijera
    }

    // Variables de estado
    uint256 gameNumber;

    /// @notice Definir una estructura de datos llamada 'Game' con la información necesaria para cada juego
    /// @dev Puede eliminar el campo field1;
    struct Game {
        address jugador1;
        address jugador2;
        uint256 gameNumber; //En realidad el gameNumber no es necesario porque ya esta mapeado con el mapping game
        uint256 apuesta;
        Status estado;
        bytes32 jugador1MovementHash;
        bytes32 jugador2MovementHash;
        Movement movimientoJugador1;
        Movement movimientoJugador2;
        uint256 lastMovementBlock;
    }

    // State mapping
    mapping(uint256 => Game) public game;

    /// @notice Este es un método de pago que permite la creación de un nuevo juego.
    /// @dev El creador apostará una cantidad de éteres para el juego, de lo contrario revierte con "You must make a bet"
    /// @dev Cuando se gane el juego, el ganador recibirá todas las apuestas.
    /// @dev Al final de esta operación, el estado del juego debe ser "created"
    /// @dev Este método llamará al evento GameCreated en caso de éxito.
    /// @param _contender Dirección del contendiente permitido para el juego. La dirección debe ser diferente a la dirección cero
    /// de lo contrario revertir con "Invalid address"
    function createGame(address _contender) external payable {
        require(msg.value > 0, "You must make a bet");
        require(_contender != address(0), "Invalid address");

        gameNumber++;

        Game memory newGame = Game({
            jugador1: msg.sender,
            jugador2: _contender,
            gameNumber: gameNumber,
            apuesta: msg.value,
            estado: Status.created,
            jugador1MovementHash: bytes32(0),
            jugador2MovementHash: bytes32(0),
            movimientoJugador1: Movement.none,
            movimientoJugador2: Movement.none,
            lastMovementBlock: 0
        });

        game[gameNumber] = newGame;

        // Tambien se podria hacer Game memory newGame = game[gameNumber]; y meterle cada uno de los valores abajo.
        // Incoveniente: poniendo memory me estoy haciendo una copia de la estructura y los cambios no quedan seteados en memoria.
        // pero haciendo game[gameNumber] = newGame; si quedan seteados en memoria.
        // game[gameNumber] = Game(
        //     msg.sender,
        //     _contender,
        //     gameNumber,
        //     msg.value,
        //     Status.created,
        //     Movement.none,
        //     Movement.none
        // );

        emit GameCreated(msg.sender, gameNumber, msg.value);
    }

    /// @notice Este es un método de pago que permite unirse a un juego existente.
    /// @dev El contendiente para unirse al juego debe enviar ether directamente al contrato para igualar la apuesta del creador
    /// del juego, de lo contrario revertir con "Invalid bet". Si se envía más ethers, el ether adicional debe reembolsarse y
    /// transferirse de vuelta a la dirección del contendiente.
    /// @dev Si el remitente no es el contendiente incluido en la lista blanca, revierte con "Not authorized".
    /// @dev El concursante solo debe poder unirse al juego una vez y bajo el estado de "created", de lo contrario revertir con
    /// "Game contenders are full".
    /// @dev Al final de la operación, el estado del juego debe ser "open"
    /// @dev Este método llamará al evento GameStarted en caso de éxito.
    /// @param _gameNumber Es el número del juego a unirse. Si no es válido, revertir con "Invalid _gameNumber"
    function joinGame(uint256 _gameNumber) external payable {
        Game storage theGame = game[_gameNumber];

        require(
            _gameNumber > 0 && _gameNumber >= gameNumber,
            "Invalid _gameNumber"
        );

        require(msg.sender == game[_gameNumber].jugador2, "Not authorized");

        require(
            game[_gameNumber].estado == Status.created,
            "Game contenders are full"
        );
        require(msg.value >= game[_gameNumber].apuesta, "Invalid bet");

        theGame.estado = Status.open;

        if (theGame.apuesta >= msg.value) {
            payable(msg.sender).transfer(msg.value - theGame.apuesta);
        }

        emit GameStarted([theGame.jugador1, msg.sender], _gameNumber);
    }

    /// @notice Este método permite que ambos jugadores en el juego hagan su movimiento
    /// @dev Este método solo se puede llamar bajo el estado "abierto", de lo contrario, revierte con "Game not open"
    /// @dev Este método solo se puede llamar una vez por jugador, de lo contrario, revierte con "Your move is already set"
    /// @dev Una vez que ambos jugadores hayan completado su movimiento, el juego debe cambiar al estado "closed". ahora ambos
    /// jugadores deben llamar al método revelarMove para revelar sus movimientos
    /// @param _gameNumber Es el número del juego a unirse. Si no es válido, revertir con "Invalid _gameNumber"
    /// @param _movement Es un hash del número índice del movimiento y un número aleatorio salt
    function makeMove(uint256 _gameNumber, bytes32 _movement) external {
        Game storage theGame = game[_gameNumber];
        require(theGame.estado == Status.open, "Game not open");
        if (msg.sender == theGame.jugador1) {
            require(
                theGame.jugador1MovementHash == bytes32(0),
                "Your move is already set"
            );
            theGame.jugador1MovementHash = _movement;
        } else if(msg.sender == theGame.jugador2){
            require(
                theGame.movimientoJugador2 == Movement.none,
                "Your move is already set"
            );
            theGame.jugador2MovementHash = _movement;
        }else{
            revert("Invalid player");
        }

        if (theGame.jugador2MovementHash != bytes32(0) && theGame.jugador1MovementHash == bytes32(0))
        {
            theGame.estado = Status.open;
        }
    }

    /// @notice Follow the traditional rules of the game to determine who has won
    /// @dev This function can only be called once the game is under the state of "closed", aka after both contestants have
    /// made their moves, otherwise revert with "Game not closed"
    /// @dev This function can only be called once per player, otherwise revert with "Your already reveal your movement"
    /// @dev Use _movement and _salt parameters to validate the hash received in the makeMove function for the corresponding
    /// player. In case of inconsistency revert with "Invalid movement"
    /// @dev If one of the contestants successfully reveals their move, the other contestant will have 3 blocks to reveal
    /// their move or the first contestant may request to be declared the winner.
    /// @dev The amount of both bets should be transferred to the winner address. In the event of a tie, the winner
    /// should be specified as the zero address (address(0)) and both bets should be evenly returned to the players.
    /// @dev Once the outcome of the game has been established, the game state should be set to "finished". In this state,
    /// no more operations can be carried out on the game.
    /// @dev Event GameComplete should be called with the address of the winner.
    /// @param _gameNumber It is the number of the game to join. If is invalid revert with "Invalid _gameNumber"
    /// @param _movement It is one of the valid movement in the movement list between 1 and 3. Otherwise revert with
    /// "Invalid movement"
    /// @param _salt It is the salt used to hash the movement. It is a non negative number.

    /// @notice Siga las reglas tradicionales del juego para determinar quién ha ganado
    /// @dev Esta función solo se puede llamar una vez que el juego está en estado "closed", es decir, después de que ambos
    /// concursantes hayan hecho sus movimientos, de lo contrario revierte con "Game not closed"
    /// @dev Esta función solo se puede llamar una vez por jugador, de lo contrario, revierte con "Your already reveal your movement"
    /// @dev Usa los parámetros _movement y _salt para validar el hash recibido en la función makeMove para el correspondiente
    /// jugador. En caso de inconsistencia revertir con "Invalid movement"
    /// @dev Si uno de los concursantes revela con éxito su movimiento, el otro concursante tendrá 3 bloques para revelar
    /// su movimiento o el primer competidor puede solicitar ser declarado ganador.
    /// @dev El monto de ambas apuestas debe transferirse a la dirección del ganador. En caso de empate, el ganador
    /// debe especificarse como la dirección cero (dirección (0)) y ambas apuestas deben devolverse equitativamente a los jugadores.
    /// @dev Una vez que se ha establecido el resultado del juego, el estado del juego debe establecerse en "terminado". En este
    /// estado, no se pueden realizar más operaciones en el juego.
    /// @dev Debe llamarse al evento GameComplete con la dirección del ganador.
    /// @param _gameNumber Es el número del juego a unirse. Si no es válido, revertir con "Invalid _gameNumber"
    /// @param _movement Es uno de los movimientos válidos en la lista de movimientos entre 1 y 3. De lo contrario, revertir con
    /// "Invalid movement"
    /// @param _salt Es un número salt usado para hashear del movimiento. Es un número no negativo.
    function revealMove(
        uint256 _gameNumber,
        Movement _movement,
        uint256 _salt
    ) external {
        Game storage theGame = game[_gameNumber];
        require(game[_gameNumber].estado == Status.closed, "Game not closed");
        if (msg.sender == game[_gameNumber].jugador1) {
            require(
                game[_gameNumber].movimientoJugador1 != Movement.none,
                "Your already reveal your movement"
            );
            require(
                keccak256(abi.encodePacked(_movement, _salt)) ==
                    keccak256(
                        abi.encodePacked(
                            game[_gameNumber].movimientoJugador1,
                            _salt
                        )
                    ),
                "Invalid movement"
            );
        } else {
            require(
                game[_gameNumber].movimientoJugador2 != Movement.none,
                "Your already reveal your movement"
            );
            require(
                keccak256(abi.encodePacked(_movement, _salt)) ==
                    keccak256(
                        abi.encodePacked(
                            game[_gameNumber].movimientoJugador2,
                            _salt
                        )
                    ),
                "Invalid movement"
            );
        }
    }
}
