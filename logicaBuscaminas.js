class LogicaBuscaminas {
    
    constructor() {
        this.a = new Array(10);
    };
    
    crearTablero() {
        for(let i = 0; i < 10; i++) {
            this.a[i] = new Array(10);
            for(let j = 0; j < 10; j++) {
                this.a[i][j] = 0;
            }
        }
    };

    mostrarTablero() {
        console.log("    A  B  C  D  E  F  G  H  I  J ");
        console.log("--------------------------------");
        for(let i = 0; i < 10; i++) {
            let fila = `[${i}]`;
            for(let j = 0; j < 10; j++) {
                fila = fila + " " + this.a[i][j]+ " ";
                if(j === 9) {
                    console.log(fila);
                    fila = "";
                }
            }
        }
    };

    generarBombas() {
        let fil = 0;
        let col = 0;

        fil = Math.floor((Math.random() * 9) + 0);
        col = Math.floor((Math.random() * 9) + 0);

        for(let i = 0; i < 10; i++) {
            while(this.a[fil][col] == "*") {
                fil = Math.floor((Math.random() * 9) + 0);
                col = Math.floor((Math.random() * 9) + 0);
            }
            this.a[fil][col] = "*";
        }
    };

    colocarNumeroBombas(leti, letj, fini, finj, tablero) {
        for(let i = leti; i <= fini; i++) {
            for(let j = letj; j <= finj; j++) {
                if(tablero[i][j] != "*"){
                    tablero[i][j] = (parseInt(tablero[i][j]) + 1);
                }
            }
        }
    };

    bombasAlrededor() {
        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                if(this.a[i][j] == "*") {
                    if(i == 0 && j == 0) {
                        this.colocarNumeroBombas(i, j, i + 1, j + 1, this.a);
                    
                    }
                    else if(i == 0 && (j > 0 && j < 9)) {
                        this.colocarNumeroBombas(i, j - 1, i + 1, j + 1, this.a);
                    
                    }
                    else if(i == 0 && j == 9) {
                        this.colocarNumeroBombas(i, j - 1, i + 1, j, this.a);
                    
                    }
                    else if(j == 9 && (i > 0 && i < 9)) {
                        this.colocarNumeroBombas(i - 1, j - 1, i + 1, j, this.a);
                    
                    }
                    else if(i == 9 && j == 9) {
                        this.colocarNumeroBombas(i - 1, j - 1, i, j, this.a);
                    
                    }
                    else if(i == 9 && (j > 0 && j < 9)) {
                        this.colocarNumeroBombas(i - 1, j - 1, i, j, j + 1, this.a);
                    
                    }
                    else if(i == 9 && j == 0) {
                        this.colocarNumeroBombas(i - 1, j, i, j + 1, this.a);
                    
                    }
                    else if(j == 0 && (i > 0 && i < 9)) {
                        this.colocarNumeroBombas(i - 1, j, i + 1, j + 1, this.a);
                    
                    }else {
                        this.colocarNumeroBombas(i - 1, j - 1, i + 1, j + 1, this.a);
                    
                    }
                }
            }
        }
    };
    
    /*getTablero(){
        return this.a;
    };*/
};

module.exports = LogicaBuscaminas;