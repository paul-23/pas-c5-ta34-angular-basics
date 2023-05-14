import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'calculadora';
  currentNumber: string = '';
  previousNumber: string = '';
  operator: string = '';
  string: string = '';
  resultScreen: any;
  stringScreen: any;

  ngOnInit() {
    this.resultScreen = document.getElementById('result');
    this.stringScreen = document.getElementById('string');
    this.clearAll();

    // Implementación del teclado para insertar valores
    document.addEventListener("keydown", (event) => {
      if (event.key >= '0' && event.key <= '9') {
        this.insertNumber(parseInt(event.key));
      } else if (event.key === "+") {
        this.insertOperator("+");
      } else if (event.key === "-") {
        this.insertOperator("-");
      } else if (event.key === "*") {
        this.insertOperator("*");
      } else if (event.key === "/") {
        this.insertOperator("/");
      } else if (event.key === "Enter") {
        this.calculate();
      } else if (event.key === ".") {
        this.insertDecimal();
      } else if (event.key === "Backspace") {
        this.clearPrevious();
      } else if (event.key === "Escape") {
        this.clearScreen();
      } else if (event.key === "Delete") {
        this.clearScreen();
      }
    });
  }

  // Borramos los valores actuales de la pantalla
  clearScreen() {
    this.currentNumber = '';
    this.string = '';
    this.updateScreenString('0');
    this.updateScreen('');
    this.stringFormat();
  }

  // Borramos todo, incluso lo que esta en memoria
  clearAll() {
    this.clearScreen();
    this.currentNumber = '';
    this.previousNumber = '';
    this.operator = '';
    this.updateScreenString('0');
    this.updateScreen('');
    this.stringFormat();
  }

  // Borramos el último valor introducido
  // (Aplicable solo a teclado)
  clearPrevious() {
    if (this.currentNumber.length > 1) {
      this.currentNumber = this.currentNumber.slice(0, -1);
      this.string = this.string.slice(0, -1);
      this.updateScreenString(this.string);
    } else {
      this.currentNumber = '';
      this.string = this.string.slice(0, -1);
      this.updateScreenString(this.string || '0');
    }
  }

  // Cambiar color dependiendo de si se muestra el resultado o no
  stringFormat() {
    this.stringScreen.style.color = "#000";
    this.stringScreen.style.fontSize = "35px";
  }

  // Actualizamos la pantalla con el resultado
  updateScreen(number: string) {
    this.resultScreen.value = number;
  }

  // Actualizamos la pantalla con los valores a medida que los vamos introduciedno
  updateScreenString(string: string) {
    this.stringScreen.value = string;
  }

  // Hacemos una comprobacion de si se muestra por pantalla el Infinity y al intentar hacer otra operacion borramos todo
  // (Evitamos errores como el "Infinity + otro valor = Error")
  checkError() {
    if (this.string === 'Infinity' || this.currentNumber === 'Infinity' || this.previousNumber === 'Infinity') {
      this.clearAll();
    }
  }

  // Insertamos numeros
  insertNumber(number: number) {
    this.checkError();
    this.currentNumber += number.toString();
    this.string += number.toString();
    this.updateScreenString(this.string);
  }

  // Insertamos operadores
  insertOperator(op: string) {
    this.checkError();
    if (this.operator && this.currentNumber !== '') {
      if (this.previousNumber === '') {
        this.previousNumber = this.currentNumber;
      } else {
        this.calculate();
        this.previousNumber = this.currentNumber;
      }
      this.currentNumber = '';
      this.string = this.previousNumber + op;
      this.updateScreenString(this.string);
    } else if (this.previousNumber !== '') {
      if (/\+|\-|\*|\//.test(this.string.slice(-1))) {
        this.string = this.string.slice(0, -1) + op;
      } else {
        this.string += op;
      }
      this.updateScreenString(this.string);
    }
    this.operator = op;
    if (this.currentNumber !== '') {
      this.previousNumber = this.currentNumber;
      this.string = this.previousNumber + this.operator;
      this.currentNumber = '';
      this.updateScreenString(this.string);
    }
  }

  // Calculamos el resultado
  calculate() {
    let result: number | undefined;
    if (this.previousNumber !== '' && this.currentNumber !== '') {
      switch (this.operator) {
        case '+':
          result = parseFloat(this.previousNumber) + parseFloat(this.currentNumber);
          break;
        case '-':
          result = parseFloat(this.previousNumber) - parseFloat(this.currentNumber);
          break;
        case '*':
          result = parseFloat(this.previousNumber) * parseFloat(this.currentNumber);
          break;
        case '/':
          result = parseFloat(this.previousNumber) / parseFloat(this.currentNumber);
          break;
        case '%':
          result = parseFloat(this.previousNumber) % parseFloat(this.currentNumber);
          break;
        case '1/x':
          result = 1 / parseFloat(this.currentNumber);
          break;
        case 'sqrt':
          result = Math.sqrt(parseFloat(this.currentNumber));
          break;
        default:
          break;
      }
    }

    this.currentNumber = result?.toString() || '';
    this.updateScreen(this.currentNumber);
    this.operator = '';
    this.previousNumber = '';
    this.string = '';
    this.stringScreen.style.color = "#8d8d8d";
    this.stringScreen.style.fontSize = "25px";
  }

  // Insertamos un punto para convertir a decimal
  insertDecimal() {
    if (this.currentNumber.indexOf('.') === -1) {
      if (this.currentNumber === '') {
        this.currentNumber = '0';
      }
      if (this.string === '') {
        this.string = '0';
      }
      this.currentNumber += '.';
      this.string += '.';
      this.updateScreenString(this.currentNumber);
    }
  }

}
