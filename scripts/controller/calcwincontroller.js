class CalcWinController{
	constructor(){	
		this._lastOperator = '';
		this._lastNumber = '';
		this._operation = [];
		this._displayCalcEl = document.querySelector("#display");
		this.initialize();
		this.initButtonsEvent();
		this.initKeyboard();		
	}

	initialize(){
		this.setLastNumberToDisplay();
	}

	initButtonsEvent(){
		let buttons = document.querySelectorAll(".btn");
		
		buttons.forEach((btn,index)=>{

			this.addEventListenerAll(btn, "click drag",e=>{
				let btnValue = this.getButtonValue(btn);
				this.execBtn(btnValue);
			});

			this.addEventListenerAll(btn, "mouseover mouseup mousedown",e=>{
				btn.style.cursor = "pointer";
			});

		})
		
	}

	initKeyboard(){
		document.addEventListener('keyup',e => {

			switch(e.key){

				case 'Escape':
					this.clearAll();
					break;

				case 'Backspace':
					this.back();
					break;

				case '+':
				case '-':
				case '*':
				case '/':
				case '%':
					this.addOperation(e.key);
					break;

				case 'Enter':
				case '=':
					this.calc();				
					break;

				case '.':
				case ',':
					this.addDot('.');
					break;

				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
					this.addOperation(parseInt(e.key));
					break;

				case 'c':
					if(this.isCtrlPressed(e)) this.copyToClipboard();
						break;
			}
		});
	}

	isCtrlPressed(e){
		return e.keyCode == '67'?true:false;
	}

	copyToClipboard(){
		let input = document.createElement('input');
		input.value = this.displayCalc;
		document.body.appendChild(input);
		input.select();
		document.execCommand("Copy");
		input.remove();
	}	

	execBtn(value){

		switch(value){

			case 'c':
				this.clearAll();
				break;

			case 'ce':
				this.clearEntry();
				break;

			case 'sum':
				this.addOperation('+');
				break;

			case 'subtraction':
				this.addOperation('-');
				break;

			case 'division':
				this.addOperation('/');
				break;

			case 'multiplication':
				this.addOperation('*');
				break;

			case 'invert':
				this.reverseLastNumber();
				break;

			case 'equal':
				this.calc();				
				break;				

			case 'percent':
				this.addOperation('%');
				break;

			case 'squareroot':
				this.power(0.5);
				break;

			case 'powertwo':
				this.power(2);
				break;

			case 'reciprocal':
				this.reciprocal();
				break;

			case 'back':
				this.back();
				break;

			case 'dot':
				this.addDot('.');
				break;				

			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				this.addOperation(parseInt(value));
				break;

			default:
				this.setError();
				break;
		}
	}

	reciprocal(){
		let lastOperation = this.getLastOperation();

		if(isNaN(lastOperation))
			lastOperation = this._operation[0];

		let value = 1/lastOperation;

		if(!Number.isInteger(value))
			value = (this.round(value,9));

		this.setLastOperation(value);
		this.setLastNumberToDisplay();
	}	

	power(exponent){
		let lastOperation = this.getLastOperation();

		if(isNaN(lastOperation))
			lastOperation = this._operation[0];

		let value = Math.pow(lastOperation,exponent);

		if(!Number.isInteger(value))
			value = (this.round(value,9));

		this.setLastOperation(value);
		this.setLastNumberToDisplay();
	}

	reverseLastNumber(){
		let lastOperation = this.getLastOperation();

		if(isNaN(lastOperation))
			lastOperation = this._operation[0];

		this.setLastOperation(eval(lastOperation*(-1)));
		this.setLastNumberToDisplay();
	}

	back(){
		let lastOperation = this.getLastOperation();

		if(isNaN(lastOperation))
			lastOperation = this._operation[0];

		if(lastOperation.length > 1){
			let newValue = lastOperation.split('');
			newValue.pop();
			lastOperation = newValue.join('');
		}else
			lastOperation = 0;

		this.setLastOperation(lastOperation);
		this.setLastNumberToDisplay();
	}	

	round(value, decimals) {
  		return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
	}

	calc(){

		let last = '';
		this._lastOperator = this.getLastItem();

		if(this._operation.length < 3){
			let firstItem = this._operation[0];
			this._operation = [firstItem,this._lastOperator, this._lastNumber];
		}

		if(this._operation.length > 3){
			last = this._operation.pop();
			this._lastNumber = this.getResult();
		}else if(this._operation.length == 3){
			this._lastNumber = this.getLastItem(false);
		}
		let result = this.getResult();

		if(last == '%'){
			result /= 100;
			this._operation = [result];
		}else{
			this._operation = [result];
			if(last)
				this._operation.push(last);
		}
		this.setLastNumberToDisplay();
	}

	getResult(){
		try{
			return eval(this._operation.join(""));	
		}catch(e){
			setTimeout(()=>{
				this.setError();	
			},1);			
		}		
	}	

	clearAll(){
		this._operation = [];
		this._lastNumber = '';
		this._lastOperator = '';
		this.setLastNumberToDisplay();
	}

	clearEntry(){
		this._operation.pop();
		this.setLastNumberToDisplay();
	}	

	addOperation(value){
		if(isNaN(this.getLastOperation())){
			if(this.isOperator(value)){
				this.setLastOperation(value);
			}else {
				this.pushOperator(value);
				this.setLastNumberToDisplay();				
			}
		}else{
			if(this.isOperator(value)){
				this.pushOperator(value);
			}else{
				let newValue = this.getLastOperation().toString() + value.toString();
				this.setLastOperation(newValue);
				this.setLastNumberToDisplay();
			}
		}
	}

	isOperator(value){
		return (['+','-','*','%','/','squareroot'].indexOf(value) > -1);
	}

	pushOperator(value){
		this._operation.push(value);
		if(this._operation.length > 3){
			this.calc();
		}
	}	

	getLastOperation(){
		return this._operation[this._operation.length-1]
	}

	setLastOperation(value){
		this._operation[this._operation.length-1] = value;	
	}


	addEventListenerAll(element, events, fn){
		events.split(' ').forEach(event => {
			element.addEventListener(event,fn);
		});
	}

	getButtonValue(btn){
		let className = btn.className.toString();
		let textBtn = className.replace("btn btn-others ","");
		textBtn = textBtn.replace("btn btn-number ","");
		textBtn = textBtn.replace(" col-sm","");
		textBtn = textBtn.replace("btn-","");

		return textBtn;
	}

	setLastNumberToDisplay(){
		let lastNumber = this.getLastItem(false);

		if(!lastNumber) 
			lastNumber = 0;

		this.displayCalc = lastNumber;
	}

	getLastItem(isOperator = true){

		let lastItem;

		for(let i = this._operation.length-1;i >= 0;i--){
			if(this.isOperator(this._operation[i]) == isOperator){
				lastItem = this._operation[i];
				break;
			}
		}		

		if(!lastItem){
			lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
		}

		return lastItem;
	}

	setError(){
		this.displayCalc = "Error";
	}

	get displayCalc(){
		return this._displayCalcEl.innerHTML;
	}

	set displayCalc(value){
		if(value )
		if(value.toString().length > 11){
			value = eval(value*1).toExponential(4);
		}
		value = eval(value*1);
		this._displayCalcEl.innerHTML = value;		
	}

	addDot(){

		let lastOperation = this.getLastOperation();

		if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;		

		if(this.isOperator(lastOperation) || !lastOperation){
			this.pushOperator('0.');
		}else{
			this.setLastOperation(lastOperation.toString() + '.');
		}

		this.setLastNumberToDisplay();

	}	
}