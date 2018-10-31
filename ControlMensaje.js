class ControlMensaje {
    constructor () {
        this.usuario = " ";
        this.password = " ";
        this.mensaje = " ";
        this.conectado = 0;
    }

    getUsuario() {
        return this.usuario;
    };

    getPassword() {
        return this.password;
    };

    getMensaje() {
        return this.mensaje;
    };

    setUsuario(usuario) {
        this.usuario = usuario;
    };
    
    setPassword(password) {
        this.password = password;
    };

    setMensaje(mensaje) {
        this.mensaje = mensaje;
    };

    estadoConectado() {
        this.conectado = 1;
    };

    estadoDesconectado() {
        this.conectado = 0;
    };

};

module.exports = ControlMensaje;