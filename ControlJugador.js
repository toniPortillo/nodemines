class ControlJugador {
    constructor () {
        this.jugador1 = "";
        this.jugador2 = "";
        this.password1 = "";
        this.password2 = "";
    }

    getJugador1() {
        return this.jugador1;
    };

    getJugador2() {
        return this.jugador2
    };

    getPassword1() {
        return this.password1;
    };

    getPassword2() {
        return this.password2;
    };

    setJugador1(jugador1) {
        this.jugador1 = jugador1;
    };

    setJugador2(jugador2) {
        this.jugador2 = jugador2;
    };

    setPassword1(password1) {
        this.password1 = password1;
    };

    setPassword2(password2) {
        this.password2 = password2;
    };

}

module.exports = ControlJugador;