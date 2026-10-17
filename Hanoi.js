// Torres de Hanoi - lógica de la página (juego, recursión paso a paso y prueba)
(function(){
var COL=['#e74c3c','#e67e22','#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#34495e'];
var NM=['A','B','C'];
var n=3,mode='play',T,moves=0,sel=-1,ev=[],idx=0,timer=null,won=false;
var $=function(i){return document.getElementById(i)};

function gen(k,o,d,a,ph,out){
  if(k===0){out.push({t:'base',o:o,d:d,ph:0});return}
  out.push({t:'call',k:k,o:o,d:d,a:a,ph:ph});
  gen(k-1,o,a,d,1,out);
  out.push({t:'move',k:k,disc:k,o:o,d:d,ph:2});
  gen(k-1,a,d,o,3,out);
  out.push({t:'ret',k:k,o:o,d:d,ph:0});
}
function fresh(){var t=[[],[],[]];for(var i=n;i>=1;i--)t[0].push(i);return t}
function stop(){if(timer){clearInterval(timer);timer=null}$('bAuto').textContent='Reproducir'}
function reset(){
  stop();sel=-1;won=false;idx=0;moves=0;T=fresh();
  ev=[];gen(n,0,2,1,0,ev);
  $('min').textContent=Math.pow(2,n)-1;
  if(mode==='play')$('msg').textContent='Toca un poste para seleccionar su disco de arriba y luego toca el poste destino.';
  render();
}
function replay(){
  T=fresh();moves=0;var st=[],last=null;
  for(var i=0;i<idx;i++){
    var e=ev[i];last=e;
    if(e.t==='move'){T[e.o].pop();T[e.d].push(e.disc);moves++}
    else if(e.t==='call')st.push(e);
    else if(e.t==='ret')st.pop();
  }
  return {st:st,last:last};
}
function plural(k){return k===1?'1 disco':k+' discos'}
function text(e){
  if(!e)return 'Pulsa «Siguiente» para empezar. Se resolverá '+plural(n)+' de A a C usando B.';
  var o=NM[e.o],d=NM[e.d];
  if(e.t==='base')return 'Caso base: n = 0. No hay discos, la función regresa sin hacer nada y la llamada anterior continúa.';
  if(e.t==='call')return 'Entro a resolver('+e.k+', '+o+' → '+d+'). Para mover '+plural(e.k)+' tengo que apartar primero '+(e.k-1===0?'cero discos (esto llegará al caso base)':plural(e.k-1)+' de arriba hacia '+NM[e.a])+'.';
  if(e.t==='move')return 'El camino está libre. Muevo el disco '+e.disc+' (el más grande de esta llamada) de '+o+' a '+d+'.';
  return 'resolver('+e.k+', '+o+' → '+d+') terminó: ya hizo sus '+(Math.pow(2,e.k)-1)+' movimientos. Regreso a quien me llamó.';
}
function render(){
  var r=null,hl=-1;
  if(mode==='step'){
    r=replay();
    if(r.last&&r.last.t==='move')hl=r.last.d;
  }
  var h='';
  for(var p=0;p<3;p++){
    h+='<div class="tower'+(sel===p?' sel':'')+(hl===p?' hl':'')+'" data-p="'+p+'" tabindex="0" role="button" aria-label="Poste '+NM[p]+', '+T[p].length+' discos">';
    for(var i=0;i<T[p].length;i++){
      var d=T[p][i],top=i===T[p].length-1;
      h+='<div class="disc'+(sel===p&&top?' up':'')+'" style="width:'+(24+72*d/n)+'%;background:'+COL[(d-1)%8]+'">'+d+'</div>';
    }
    h+='<span class="lbl">'+NM[p]+'</span></div>';
  }
  $('towers').innerHTML=h;
  $('cnt').textContent=moves;
  if(mode==='step'){
    $('why').textContent=text(r.last);
    var lines=$('algo').children;
    for(var j=0;j<4;j++)lines[j].className='';
    if(r.last){var ln={base:0,call:r.last.ph,move:2,ret:-1}[r.last.t];
      if(r.last.t==='call'&&r.last.ph===0)ln=-1;
      if(r.last.t==='ret')ln=-1;
      if(ln>=0)lines[ln].className='act';}
    var s='';
    for(var q=0;q<r.st.length;q++)s+='<div class="fr">resolver('+r.st[q].k+', '+NM[r.st[q].o]+', '+NM[r.st[q].d]+', '+NM[r.st[q].a]+')</div>';
    $('stack').innerHTML=s||'<div class="fr">(vacía)</div>';
    $('bBack').disabled=idx===0;
    $('bNext').disabled=idx>=ev.length;
    if(idx>=ev.length){$('why').innerHTML='<span class="ok">¡Resuelto! '+moves+' movimientos = 2<sup>'+n+'</sup> − 1.</span> La pila de llamadas quedó vacía.';stop()}
  }
}
function tapTower(p){
  if(mode!=='play'||won)return;
  if(sel===-1){
    if(!T[p].length){$('msg').textContent='Ese poste está vacío. Elige un poste con discos.';return}
    sel=p;$('msg').textContent='Disco '+T[p][T[p].length-1]+' seleccionado. ¿A qué poste lo mueves?';
  }else if(sel===p){sel=-1;$('msg').textContent='Selección cancelada.';}
  else{
    var disc=T[sel][T[sel].length-1],dest=T[p];
    if(dest.length&&dest[dest.length-1]<disc){
      $('msg').textContent='Movimiento no permitido: el disco '+disc+' no puede ir sobre el '+dest[dest.length-1]+'.';sel=-1;
    }else{
      T[sel].pop();dest.push(disc);moves++;
      $('msg').textContent='Moviste el disco '+disc+' de '+NM[sel]+' a '+NM[p]+'.';sel=-1;
      if(T[2].length===n){won=true;var m=Math.pow(2,n)-1;
        $('msg').innerHTML='<span class="ok">¡Lo lograste en '+moves+' movimientos!</span> '+(moves===m?'Es el mínimo posible.':'El mínimo es '+m+'. Prueba «Ver la recursión» para ver cómo se logra.');}
    }
  }
  render();
}
$('towers').addEventListener('click',function(e){var t=e.target.closest('.tower');if(t)tapTower(+t.dataset.p)});
$('towers').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){var t=e.target.closest('.tower');if(t){e.preventDefault();tapTower(+t.dataset.p)}}});
function setMode(m){
  mode=m;$('mPlay').className=m==='play'?'on':'';$('mStep').className=m==='step'?'on':'';
  $('playBox').hidden=m!=='play';$('stepBox').hidden=m!=='step';reset();
}
$('mPlay').onclick=function(){setMode('play')};
$('mStep').onclick=function(){setMode('step')};
$('bReset').onclick=reset;
$('nsel').onchange=function(){n=+this.value;reset()};
$('bNext').onclick=function(){if(idx<ev.length){idx++;render()}};
$('bBack').onclick=function(){stop();if(idx>0){idx--;render()}};
$('bAuto').onclick=function(){
  if(timer){stop();return}
  if(idx>=ev.length)idx=0;
  $('bAuto').textContent='Pausar';
  timer=setInterval(function(){if(idx<ev.length){idx++;render()}else stop()},800);
};

// Prueba E: ejecuta la recursión con validación de reglas
function test(k){
  var t=[[],[],[]],c=0,ok=true;
  for(var i=k;i>=1;i--)t[0].push(i);
  (function rec(m,o,d,a){
    if(m===0)return;
    rec(m-1,o,a,d);
    var x=t[o].pop();
    if(t[d].length&&t[d][t[d].length-1]<x)ok=false;
    t[d].push(x);c++;
    rec(m-1,a,d,o);
  })(k,0,2,1);
  var fin=t[2].length===k&&t[0].length===0&&t[1].length===0;
  return {c:c,ok:ok,fin:fin};
}
var rows='';
for(var k=1;k<=10;k++){
  var r=test(k),e=Math.pow(2,k)-1,good=r.c===e&&r.ok&&r.fin;
  rows+='<tr><td>'+k+'</td><td>'+e+'</td><td>'+r.c+'</td><td>'+(r.ok?'Sí':'No')+'</td><td class="pass">'+(good?'Correcto':'Falla')+'</td></tr>';
}
$('tbody').innerHTML=rows;
reset();
})();
