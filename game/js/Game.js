// Obiekt, w którym będą przechowywane „podręczne” wartości
VAR = {
	fps:15,// animacja w Bombermenie nie była tak płynna jak we współczesnych grach
	W:0,// szerokość okna
	H:0,// wysokość okna
	scale:2,// elementy gry będą wklejane w odpowiedniej skali
	//
	lastTime:0,
    enemy:5,  //liczna mnozona x3
    crate:20,
    bonus:10,
    gameLVL:1,
    score: 0,
    
	rand:function(min,max){
		return Math.floor(Math.random()*(max-min+1))+min;
    
	},
    shuffle:function(arr){  //funkcja tasujaca
        var counter = arr.length;
        var tmp;
        var index;
        
        while(counter>0){
            counter--;
            index = Math.floor(Math.random()*counter);
            tmp = arr[counter];
            arr[counter] = arr[index];
            arr[index] = tmp;
        }
        return arr;
    }
}

variableDOM = {
    idSetting : document.getElementById("setting"),
    idUnfold : document.getElementById("unfold"),
    classButtons : document.getElementsByClassName("buttons")[0],
    classBtnUp: document.getElementsByClassName('up')[0],
    classBtnDown: document.getElementsByClassName('down')[0],
    classBtnLeft: document.getElementsByClassName('left')[0],
    classBtnRight: document.getElementsByClassName('right')[0],
    classBtnSpace: document.getElementsByClassName('space')[0],
    BtnColor: "#589018",
    
    counterUnfold : 0
}
// Obiekt zawierający bazowe funckje związane z grą.
// Game nie ma konstruktora, jest jedynie obiektem grupującym funkcje.
Game = {
	// init zostanie odpalone raz po załadowaniu strony.
	init:function(){
		// Tworzę canvas
        Game.spr = new Image();
      //  Game.spr.src = ImgGame.mainImgGame;      //orginal
        Game.spr.src = 'game/img/bombe3.png';
        
		Game.canvas = document.createElement('canvas');
		// Przypisuję kontekst 2D do zmiennej ctx, która jest właściwością obiektu Game
		Game.ctx = Game.canvas.getContext('2d');
        
        Game.board = new Board();
		// odpalam mametodę obiektu Game
		Game.layout();
		// metoda layout odpali się przy każdej zmianie wielkości okna
		window.addEventListener('resize', Game.layout, false);
		// Canvas zostaje dodany do DOM
        
		document.getElementById("Game").appendChild(Game.canvas);
        
        Game.toDraw = {};  //obiekt w którym wrzucane są obrazki do animowania
        Game.hero = new Hero();
        
        var tmp_enemy;
        for(var i=0;i<VAR.enemy;i++){
            //con =0;
            tmp_enemy = Game.board.getEmptySpace();
            Game.space(tmp_enemy,'cebula');
            
//            tmp_enemy = Game.board.getEmptySpace();
//            Game.space(tmp_enemy,'balonik');
//            
//            tmp_enemy = Game.board.getEmptySpace();
//            Game.space(tmp_enemy,'kurczak');
        }
        
        window.addEventListener('keydown',Game.onKey,false);
        window.addEventListener('keyup',Game.onKey,false);
        
        
        variableDOM.classBtnUp.addEventListener("mousedown",function(){
            Game.onKey({keyCode : 38,type : 'keydown',mouse:'true'});
            variableDOM.classBtnUp.style.background = variableDOM.BtnColor;
        });
        variableDOM.classBtnUp.addEventListener("mouseup",function(){
            Game.onKey({keyCode : 38,type : 'keyup',mouse:'true'});
            variableDOM.classBtnUp.style.background = "";
        });
        
        variableDOM.classBtnDown.addEventListener("mousedown",function(){
            Game.onKey({keyCode : 40,type : 'keydown',mouse:'true'});
            variableDOM.classBtnDown.style.background = variableDOM.BtnColor;
        });
        variableDOM.classBtnDown.addEventListener("mouseup",function(){
            Game.onKey({keyCode : 40,type : 'keyup',mouse:'true'});
            variableDOM.classBtnDown.style.background = "";
        });
        
        variableDOM.classBtnRight.addEventListener("mousedown",function(){
            Game.onKey({keyCode : 39,type : 'keydown',mouse:'true'});
            variableDOM.classBtnRight.style.background = variableDOM.BtnColor;
        });
        variableDOM.classBtnRight.addEventListener("mouseup",function(){
            Game.onKey({keyCode : 39,type : 'keyup',mouse:'true'});
            variableDOM.classBtnRight.style.background = "";
        });
        
        variableDOM.classBtnLeft.addEventListener("mousedown",function(){
            Game.onKey({keyCode : 37,type : 'keydown',mouse:'true'});
            variableDOM.classBtnLeft.style.background = variableDOM.BtnColor;
        });
        variableDOM.classBtnLeft.addEventListener("mouseup",function(){
            Game.onKey({keyCode : 37,type : 'keyup',mouse:'true'});
            variableDOM.classBtnLeft.style.background = "";
        });
        
        variableDOM.classBtnSpace.addEventListener("mousedown",function(){
            Game.onKey({keyCode : 32,type : 'keydown',mouse:'true'});
            variableDOM.classBtnSpace.style.background = variableDOM.BtnColor;
        });
        variableDOM.classBtnSpace.addEventListener("mouseup",function(){
            Game.onKey({keyCode : 32,type : 'keyup',mouse:'true'});
            variableDOM.classBtnSpace.style.background = "";
        });
        
        variableDOM.idSetting.addEventListener("click",function(){
            if(variableDOM.counterUnfold%2 == 0){
                if(variableDOM.counterUnfold == 0){
                    variableDOM.idUnfold.firstElementChild.style.background ='green';
                    variableDOM.idUnfold.lastElementChild.style.background = 'red';
                }
                variableDOM.idSetting.style.background = variableDOM.BtnColor;
                variableDOM.idSetting.style.height = "auto";
                variableDOM.idUnfold.style.visibility = "visible";
            }else{
              variableDOM.idSetting.style.background = "";
              variableDOM.idSetting.style.height = "";
              variableDOM.idUnfold.style.visibility = "hidden";  
            }
            variableDOM.counterUnfold++;         
        });
        
        if(Intro.CtrlMOBILE){           //Gdy w menu glownym wybiore sterowanie mobile przy wczytaniu gry laduje przyciski
            variableDOM.idUnfold.lastElementChild.style.background = 'green';
            variableDOM.idUnfold.firstElementChild.style.background = 'red';
            variableDOM.classButtons.style.visibility = 'visible';
        }
        
       variableDOM.idUnfold.firstElementChild.addEventListener("click",function(ev){    //wybor sterowania bohaterem
           ev.stopPropagation();
            if(variableDOM.idUnfold.firstElementChild.style.background == 'red'){
                variableDOM.idUnfold.firstElementChild.style.background = 'green';
                variableDOM.idUnfold.lastElementChild.style.background = 'red';
                variableDOM.classButtons.style.visibility = 'hidden';
            }
        });    
        
       variableDOM.idUnfold.lastElementChild.addEventListener("click",function(ev){
           ev.stopPropagation();
            if( variableDOM.idUnfold.lastElementChild.style.background == 'red'){
                variableDOM.idUnfold.lastElementChild.style.background = 'green';
                variableDOM.idUnfold.firstElementChild.style.background = 'red';
                variableDOM.classButtons.style.visibility = 'visible';
            }
        });
        
        Game.markGame();        //oznaczenia do gry
        // rozpoczęcie pętli gry
		Game.animationLoop();
	},
    space:function(location,name_enemy){ //funkcja sprawdzajaca obszar gdzie mialby pojawic sie enemy, jak obszar jest za blisko enemy wybierany jest nowy
        if((location.x<=6 && location.y<=1) || (location.x<=1 && location.y<=6) || (location.x<=3 && location.y<=3)){ //niedopuszczalny obszar pojawienia sie na starcie enemy
            var tmp;
            tmp =  Game.board.getEmptySpace();
            Game.space(tmp,name_enemy);
            }else{
                new Enemy(location.x*Game.board.fW,location.y*Game.board.fH,name_enemy);
            }
    },
    stop:function(){
        window.removeEventListener('keydown',Game.onKey);
        window.removeEventListener('keyup',Game.onKey);
    },
	// Ta metoda będzie odpalana przy każdej zmianie wielkości okna
    onKey:function(ev){
        //console.log(ev);
      if(ev.keyCode>=37 && ev.keyCode<=40 || ev.keyCode==32){
          if(!ev.mouse)
            ev.preventDefault();
          if(ev.type == 'keydown' || !Game['key_'+ev.keyCode]){
              Game['key_'+ev.keyCode] = true;
              if(ev.keyCode>=37 && ev.keyCode<=40){
                  for(i=37;i<=40;i++){
                      if(i!=ev.keyCode){
                          Game['key_'+i] = false;
                      }
                  }
                  Game.hero.updateState();
              }else {
                  Game.bomb = new Bomb(Game.hero.column,Game.hero.row);    //umieszczanie bomby przez bohatera
                  
              }
          }else if(ev.type == 'keyup'){
              Game['key_'+ev.keyCode] = false;
              Game.hero.updateState();
          }
      }  
    },
	layout:function(ev){
		// Dla łatwiejszego pisania wielkość okna zostaje przypisana do właściwości W i H obiektu VAR
		VAR.W = window.innerWidth;
		VAR.H = window.innerHeight;
        
//        VAR.scale = Math.max(1,Math.min(  //scalowanie mapy, nie moze byc mniejsza niz 1:1, zawsze ostra ze zwgledu na wielokrotnosc wielkosci obiektów*ilosc obiektów
//            Math.floor(VAR.W/(Game.board.fW*Game.board.b[0].length)-10), //kolumny
//            Math.floor(VAR.H/(Game.board.fH*Game.board.b.length)) //rzedy
//        ));
        if(VAR.W <= 480){
            VAR.scale = 1;
        }else if((VAR.W>480 && VAR.W<=780) || (VAR.W>480 && VAR.H < 420) ){
            VAR.scale = 1.5;
        }else if(VAR.W >780 && VAR.W<=912 && VAR.H>=420 && VAR.H<601){
            VAR.scale = 2;
        }else if(VAR.W >912 && VAR.W <1025 && VAR.H<=600){
            VAR.scale = 2.5;
        }else if(VAR.W >912 && VAR.W <1025 && VAR.H > 600){
            VAR.scale = 3;
        }
//        VAR.scale = 1.5;
//        console.log(VAR.scale);
		// Chwilowo do canvas przypiszemy wielkość okna
		Game.canvas.width = VAR.scale*Game.board.fW*Game.board.b[0].length;
		Game.canvas.height = VAR.scale*Game.board.fH*Game.board.b.length;
        //
        //console.log("GW: "+Game.canvas.width+" ,GH: "+Game.canvas.height);
        //console.log("GBW: "+Game.board.fW+" ,GBB0: "+Game.board.b[0].length);
        Game.canvas.style[Modernizr.prefixed('transform')] = 'translate('+Math.round((VAR.W-Game.canvas.width)/2)+'px,'+Math.round((VAR.H-Game.canvas.height)/2)+'px)'
        
        Game.ctx.imageSmoothingEnabled = false;
        Game.ctx.mozImageSmoothingEnabled = false;
        Game.ctx.mozImageSmoothingEnabled = false;
        Game.ctx.webKitImageSmoothingEnabled = false;
        
        Game.board.temp_board = false;                    //zmienna pomocnicza aby przy zmianie rozmiaru okna tylko raz narysowac jeszcze raz cala mape(zbedne??)
	},
	// Funkcja, która odpala się 60 razy na sekundę
	animationLoop:function(time){
		requestAnimationFrame( Game.animationLoop );
		// ograniczenie do ilości klatek zdefiniowanych w właściwości obiektu VAR (nie więcej niż VAR.fps)
		if(time-VAR.lastTime>=1000/VAR.fps){
			VAR.lastTime = time;
			//
			// oczyszczenie canvas
			//Game.ctx.clearRect(16,16,VAR.W-16, VAR.H-16);
            //Game.heroLife.innerHTML = ": "+Game.hero.life;
            Game.board.draw();  //rysowanie calej mapy
			for(var o in Game.toDraw){
                Game.toDraw[o].draw();
            }
		}
	},
    change_statistic:function(){
        Game.heroLife.innerHTML = "Life: "+Game.hero.life;
        Game.enemyNumber.innerHTML = "Enemy: "+Enemy.counter;
        Game.gameLVL.innerHTML = "LVL: "+VAR.gameLVL;
        Game.score.innerHTML = "Score: "+VAR.score;
    },
    
    lvlUP:function(){
        VAR.gameLVL++;
        Game.board = new Board();    //nowa plansza
        
        Game.hero.x = Game.board.fW; //ustawienie bohatera
        Game.hero.y = Game.board.fH;
        Game.hero.resetBonus();
        
         for(var i=0;i<VAR.enemy;i++){     
            tmp_enemy = Game.board.getEmptySpace();
            Game.space(tmp_enemy,'cebula');
         }
        
        Game.change_statistic();

    },
    markGame:function(){
//        var gameDOC = document.createElement("div");        //glowny contener na oznaczenia
//        gameDOC.innerHTML = "<div id='markGame'><div>";
//        document.body.appendChild(gameDOC);
        
        var frag = document.createDocumentFragment();
        
        Game.gameLVL = document.createElement("div");
        Game.gameLVL.className = "GameLVL";
        Game.gameLVL.innerHTML = "LVL: "+VAR.gameLVL;
        frag.appendChild(Game.gameLVL);
        
        Game.heroLife = document.createElement("div");
        Game.heroLife.className = "HeroLife";
        Game.heroLife.innerHTML = "Life: "+Game.hero.life;
        frag.appendChild(Game.heroLife);
        
        Game.enemyNumber = document.createElement("div");
        Game.enemyNumber.className = "EnemyNumber";
        Game.enemyNumber.innerHTML = "Enemy: "+Enemy.counter;
        frag.appendChild(Game.enemyNumber);
        
        Game.score = document.createElement("div");
        Game.score.className = "Score";
        Game.score.innerHTML = "Score: "+VAR.score;
        frag.appendChild(Game.score);
        
        document.getElementById("markGame").appendChild(frag);
        
    }
}

Game.init();