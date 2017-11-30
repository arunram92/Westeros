function movePlayerInUi(playerId,moveFrom,moveTo)
{   
    document.getElementById(moveTo).appendChild( document.getElementById('player'+playerId));
}

function animateMovement(playerId,from,to,diceNumber,dbResponse,requestAction) {
  var elem = document.getElementById("player"+playerId); 
  var fromDirection = getDirection(from);
  var toDirection = getDirection(to);
  
  console.log(fromDirection);
  console.log(toDirection);
  elem.className = '';
  
  if(fromDirection == toDirection){
    pixels = diceNumber * 80;
    elem.classList.add("player"+playerId+"_"+fromDirection);
    dracarys(pixels,fromDirection,elem,toDirection,playerId,from,to,dbResponse,requestAction);
  }

  else{
    elem.classList.add("player"+playerId+"_"+fromDirection);
    if(from<6)
    {
      pixels = (6 - from) * 80;
      remainingPixels = (to-6) * 80;
    }
    else if(from<14)
    {
       pixels = (14 - from) * 80;
       remainingPixels = (to-14) * 80;
    }
    else if(from<19)
    {
       pixels = (19 - from) * 80;
       remainingPixels = (to-19) * 80;
    }
    else
    {
      pixels = (27 - from) * 80;
      remainingPixels = (to-1) * 80;
    }
    flyInFirstDirection(pixels,fromDirection,elem,toDirection,playerId,from,to,dbResponse,requestAction,remainingPixels);
  }

  
  
  
}

function getDirection(pos){

  if(pos>=1 && pos<6 )
  {
    return "up";
  }
  else if(pos>=6 && pos<14 )
  {
    return "left";
  }
  else if(pos>=14 && pos<19 )
  {
    return "down";
  }
  else
  {
    return "right";
  }
}

function dracarys(pixels,direction,elem,toDirection,playerId,from,to,dbResponse,requestAction){
  var pos = 0;
  elem.classList.add("animation");
  var id = setInterval(frame, 5);
  function frame() {
    if (pos == pixels || pos == -pixels) {
      clearInterval(id);
      elem.className = '';
      elem.style.bottom = '0px'; 
      elem.style.left = '0px'; 
      elem.style.top = '0px'; 
      elem.style.right = '0px'; 
      elem.classList.add("player"+playerId+"_"+toDirection);
      processPlayerLanding(playerId,from,to,dbResponse,requestAction);
    } else {
      
       if(direction=="right"||direction=="up")
        {
          pos--;
        }
        else
        {
          pos++;
        }

      switch(direction)
      {
        case "up":
                elem.style.top = pos + 'px'; 
                break;
        case "left":
                elem.style.left = pos + 'px'; 
                break;
        case "down":
                elem.style.top = pos + 'px'; 
                break;
        case "right":
                elem.style.left = pos + 'px'; 
                break;
        default:              
                break;

      }
    }
  }
}


function flyInFirstDirection(pixels,direction,elem,toDirection,playerId,from,to,dbResponse,requestAction,remainingPixels){
  var pos = 0;
  elem.classList.add("animation");
  var id = setInterval(frame, 5);
  function frame() {
    if (pos == pixels || pos == -pixels) {
      clearInterval(id);
      elem.className = '';
     
      elem.classList.add("player"+playerId+"_"+toDirection);
      dracarys(remainingPixels,toDirection,elem,toDirection,playerId,from,to,dbResponse,requestAction);
    } else {
        if(direction=="right"||direction=="up")
        {
          pos--;
        }
        else
        {
          pos++;
        }

      switch(direction)
      {
        case "up":
                elem.style.top = pos + 'px'; 
                break;
        case "left":
                elem.style.left = pos + 'px'; 
                break;
        case "down":
                elem.style.top = pos + 'px'; 
                break;
        case "right":
                elem.style.left = pos + 'px'; 
                break;
        default:              
                break;
      }
    }
  }
}


function processPlayerLanding(playerId,from,to,dbResponse,requestAction)
{
      movePlayerInUi(playerId,from,to);
      updateBoard(dbResponse);
      if(playerId == sessionStorage.playerId)
      {
        if(requestAction)
          {
            //create popup
            var propertyName = dbResponse.properties[to-1].name;
            var value = dbResponse.properties[to-1].value;
            createBox('Do you want to buy '+propertyName+' for $'+value + '?');
            //
          }
      }
}

function toggleRollButton(dbResponse)
{
  if(dbResponse.nextTurn == Number(sessionStorage.playerId))
        {
          return false;
        }
        else
        {
          return true;
        }
}

function getNextTurn(isNotMyTurn){
if(isNotMyTurn)
    return "player " + dbResponse.nextTurn+"'s" ;
else
    return "your";
}

function showPropertiesPopup()
{
  document.getElementById('showPropertiesDialog').innerHTML="";
  var i;
  for(i=1;i<=26;i++)
  {
      if(sessionStorage.playerId == dbResponse.properties[i-1].owner)
      {
        document.getElementById('showPropertiesDialog').style.display="block";
        var iDiv1 = document.createElement('div');
        iDiv1.innerHTML=dbResponse.properties[i-1].name;
        iDiv1.className = 'box';
        var iDiv2 = document.createElement('div');
        iDiv2.innerHTML=dbResponse.properties[i-1].value;
        iDiv2.className = 'box';
        var iDiv = document.createElement('div');
        iDiv.appendChild(iDiv1);
        iDiv.appendChild(iDiv2);
        
        document.getElementById('showPropertiesDialog').appendChild(iDiv);
      
  
      }
  }
  var button = document.createElement("button");
  button.innerHTML = "Close";
  //var body = document.getElementsByTagName("body")[0];
  //body.appendChild(button);
  iDiv.appendChild(button);
  button.addEventListener ("click", function() {
    document.getElementById('showPropertiesDialog').style.display="none";
  });

}

function getProperties(dbResponse)
{
  var i;
  var count=0;
  for(i=1;i<=26;i++)
  {
      if(sessionStorage.playerId == dbResponse.properties[i-1].owner)
      {
          count++;
      }
  }
  return count;
}



function rotateBoard(div,deg){
  div.style.webkitTransform = 'rotate('+deg+'deg)'; 
    div.style.mozTransform    = 'rotate('+deg+'deg)'; 
    div.style.msTransform     = 'rotate('+deg+'deg)'; 
    div.style.oTransform      = 'rotate('+deg+'deg)'; 
    div.style.transform       = 'rotate('+deg+'deg)'; 
}

function createBox(message){
    document.getElementById('dialogmessage').innerHTML = message;

    document.getElementById('dialogdiv').style.display="block";


    document.getElementById('confirmtrue').onclick = function yes(){
        document.getElementById('dialogdiv').style.display="none";
        console.log("true");
        socket.emit('buy',{playerId: sessionStorage.playerId,answer:"yes"});
    };

    document.getElementById('confirmfalse').onclick = function no(){
        document.getElementById('dialogdiv').style.display="none";
         console.log("false");
         socket.emit('buy',{playerId: sessionStorage.playerId,answer:"no"});
    return false;
}
}
