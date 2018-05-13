
Intro = {
    imgBomb: "url('intro/img/bomb.png')",
    imgEmptyBomb:"url('intro/img/emptyBomb.png')",
    menu: document.getElementsByTagName("li"),
    iterator: 0,
    prevIterator:0,
    flagFirstTime : false,
    
    init:function(){
        
       this.set();
        
        window.addEventListener('keyup',Intro.move);
    },
    move:function(ev){
        if(ev.keyCode==38 || ev.keyCode==40){
            this.change = true;
            ev.preventDefault();
            if(ev.keyCode == 38){
                if(Intro.iterator == 0){
                    Intro.prevIterator = Intro.iterator;
                    Intro.iterator = 2;
                }else{
                    Intro.prevIterator = Intro.iterator;
                    Intro.iterator--;
                }
            }else if(ev.keyCode == 40){
                if(Intro.iterator == 2){
                     Intro.prevIterator = Intro.iterator;
                    Intro.iterator = 0;
                }else{
                    Intro.prevIterator = Intro.iterator;
                    Intro.iterator++;
                }
            }
        }else if(ev.keyCode == 13){
            switch(Intro.menu[Intro.iterator].innerText){
                   case 'START':
                        Intro.changePage('BODY',"intro/ajax/Start.txt");
                        var s = document.createElement('script');
                        s.src = 'game/js/load.js';
                        document.body.appendChild(s);
                        break;
                   case 'STEROWANIE':
                        Intro.changePage('menuu',"intro/ajax/Sterowanie.txt");
                        break;
                   case 'WYNIKI':
                        Intro.changePage("menuu","intro/ajax/Wyniki.txt");
                        break;
                   }
        }
        
        if(this.change){        //jezeli byla zmiana polozenia znacznika , wykonaj zmiany
            Intro.set();
            this.change = false;
        }
    },
    set:function(){
        this.menu[this.prevIterator].style.listStyle = this.imgEmptyBomb;
        this.menu[this.iterator].style.listStyle = this.imgBomb;
    },
    changePage:function(id,URL){
       var XHR = ajaxInit();
        
        if (XHR != null){
		  XHR.onreadystatechange = function(){
			if (XHR.readyState == 4 && XHR.status == 200){
                if(id == 'BODY'){
                    document.getElementsByTagName(id)[0].innerHTML = XHR.responseText;
                    
                    if(!Intro.firstTime){
                        Intro.firstTime = true;          //jednorazowe wywolanie tylko by wczytac poczatkowy skrypt, a moze da rade ladniej??
                       setTimeout(function(){
                       // console.log("Wykonuje");
                         Intro.init();
                       },300);
                    }else{
                         window.removeEventListener('keyup',Intro.move);   //po właczeniu gry, usuwam nasluchiwacz sterowania menu
                        // document.getElementsByTagName(id)[0].style.background = 'yellow';
                    }
                     
                }else{
                    document.getElementById(id).innerHTML = XHR.responseText;	
                }
                
		    }
	     }
         XHR.open("GET", URL+"?random="+Math.random(), true);
		 XHR.send();
        }
    }
}

function ajaxInit() 
{

	var XHR = null;
	
	try 
	{
		XHR = new XMLHttpRequest();
	}
	catch(e)
	{
		try
		{
			XHR = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e2)
		{
			try
			{
				XHR = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(e3)
			{
				alert("Niestety Twoja przeglądarka nie obsługuje AJAXA");
			}
		}
	}
	
	return XHR;	
}
                //wywolanie
    ajaxInit;
    Intro.changePage('BODY',"intro/ajax/intro.txt");




