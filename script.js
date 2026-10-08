/* =====================================================================
   SCRIPT.JS - a "parte inteligente" do site.
   Ele faz: montar os cards dos catálogos, controlar o carrossel,
   gerar links do WhatsApp, abrir o menu do celular, criar estrelas
   e animar os elementos ao rolar a página.
   ===================================================================== */

/* ---------- 1) WHATSAPP ---------- */

// Link base do WhatsApp: "wa.me/" + 55 (Brasil) + 12 (DDD) + número. TROQUE AQUI para mudar o número do site todo.
const WA='https://wa.me/5512974057327';

// Função "wa": recebe um texto (t) e devolve o link do WhatsApp com a mensagem já escrita.
// encodeURIComponent converte espaços e acentos para um formato aceito em links.
const wa=t=>WA+'?text='+encodeURIComponent(t);

/* ---------- 2) IMAGENS ---------- */

// Extensões que o site tenta, em ordem, quando carrega uma foto da pasta img.
const IMG_EXT=['webp','jpg','jpeg','png'];

// Roda automaticamente quando uma imagem NÃO carrega (evento onerror no HTML).
function nextExt(el){
 const i=+el.dataset.i+1;                  // pega o número da tentativa atual (data-i) e soma 1 (+ converte texto em número)
 if(i<IMG_EXT.length){                     // ainda existem extensões para testar?
  el.dataset.i=i;                          // guarda o novo número da tentativa
  el.src='img/'+el.dataset.b+'.'+IMG_EXT[i]// tenta de novo: img/ + nome-base (data-b) + . + extensão
 }else el.onerror=null                     // acabaram as opções: para de tentar (evita loop infinito)
}
window.nextExt=nextExt; // deixa a função "global" para o onerror escrito no HTML conseguir chamá-la

/* ---------- 3) DADOS EDITÁVEIS (AQUI VOCÊ MEXE NO CATÁLOGO) ---------- */
/* Cada { ... } abaixo é UM card. Para adicionar um card novo, copie uma linha, cole e mude os textos.
   Para remover, apague a linha inteira (cuidado com as vírgulas entre os itens).
   img: nome da foto SEM extensão, que deve estar na pasta img (ex.: 'vol-astro-fox' = img/vol-astro-fox.jpg).
        Deixe '' (vazio) para mostrar o aviso "adicionar imagens".
   n: nome do procedimento | d: descrição curta
   i: valor de "Investimento" | m15: manutenção 15 dias | m20: manutenção 20 dias */
const LASH=[
 {img:'vol-celestial-5d',n:'Vol. Celestial | 5D',d:'Fios leves e leques delicados para um olhar luminoso e marcante.',i:'R$ 110',m15:'R$ 85',m20:'R$ 95'},
 {img:'VolStar-Brasileiro',n:'Vol. Star | Brasileiro',d:'Acabamento volumoso e definido, com efeito de delineado natural.',i:'R$ 110',m15:'R$ 85',m20:'R$ 95'},
 {img:'vol-astro-fox',n:'Vol. Astro Fox',d:'Olhar alongado e sensual, com curvatura que afina os cantos externos.',i:'R$ 130',m15:'R$ 95',m20:'R$ 110'},
 /* Preços PROVISÓRIOS: ajuste para os valores reais */
 {img:'vol-moonlight-3d',n:'Vol. Moonlight | 3D',d:'Volume 3D leve e luminoso, com acabamento macio e delicado.',i:'R$ 110',m15:'R$ 85',m20:'R$ 95'},
 {img:'vol-cosmic-fox-eyes',n:'Vol. Cosmic Fox | Fox eyes',d:'Efeito fox marcante, com olhar alongado e cheio de personalidade.',i:'R$ 125',m15:'R$ 95',m20:'R$ 110'},
 {img:'VolStarlight-FioaFio',n:'Vol. Starlight | Fio a Fio',d:'Natural e discreto: um fio por cílio, realçando sem exagerar.',i:'R$ 110',m15:'R$ 85',m20:'R$ 95'},
 {img:'VolStellar-4d',n:'Vol. Stellar | 4D',d:'Volume 4D com leques mais densos e acabamento sofisticado.',i:'R$ 110',m15:'R$ 85',m20:'R$ 95'},
 {img:'volstarfox-megafox',n:'Vol. Star Fox | Mega Fox',d:'Efeito fox intensificado, com mais volume e olhar ainda mais alongado.',i:'R$ 140',m15:'R$ 100',m20:'R$ 120'},
 {img:'volvenus-sirena',n:'Vol. Venus | Sirena',d:'Curvatura que levanta o olhar, com efeito sereia delicado e marcante.',i:'R$ 120',m15:'R$ 90',m20:'R$ 105'},
 {img:'Anime-lash',n:'Anime Lash',d:'Fios definidos em pontas, inspirados no visual de personagens de anime.',i:'R$ 120',m15:'R$ 90',m20:'R$ 105'},
 {img:'Manga-Lash',n:'Mangá Lash',d:'Efeito texturizado e estilizado, com fios marcados e muita personalidade.',i:'R$ 120',m15:'R$ 90',m20:'R$ 105'},
 /* Serviços com valor único (usam v em vez de i/m15/m20) */
 {img:'remocao-lash',n:'Remoção',d:'Remova seu alongamento sem prejudicar seus cílios naturais.',v:'R$ 40'},
 {img:'cilios-inferiores',n:'Cílios inferiores',d:'Realce também os cílios de baixo para um olhar mais completo e harmonioso.',v:'R$ 30'},
];

// Lista do catálogo de unhas. Aqui só existe UM valor (v), por isso é mais simples.
const NAILS=[
 {img:'gelnatips',n:'Gel na Tips',d:'Unhas mais longas e resistentes com formato personalizado.',v:'R$ 100',m15:'R$ 70',m20:'R$ 85'}, /* manutenção PROVISÓRIA: ajuste os valores. Qualquer card de unhas pode ter m15/m20 */
 {img:'blindagem',n:'Blindagem (Esmaltação Inclusa)',d:'Camada de proteção que fortalece e deixa a unha brilhante.',v:'R$ 45'},
 {img:'esmaltaçaoemgel',n:'Esmaltação em Gel',d:'Cor intensa, brilho e alta durabilidade, sem esperar secar.',v:'R$ 45'},
 {img:'banhodegel',n:'Banho de Gel (Esmaltação Inclusa)',d:'Camada de gel sobre a unha natural para fortalecer e proteger, com esmaltação inclusa.',v:'R$ 40'},
 {img:'decoraçaoelaborada',n:'Decoração Elaborada',d:'Desenhos, pedrarias e detalhes artísticos feitos à mão.',v:'A partir de R$ 30'},
 {img:'remoçao',n:'Remoção',d:'Retirada segura do gel ou do alongamento, sem agredir a unha natural.',v:'R$ 50'},
 {img:'unhaquebrada',n:'Unha Quebrada',d:'Reposição de unha quebrada, com o mesmo acabamento das demais.',v:'R$ 10 por unha'},
];

/* Promoções (v = valor do combo). Para mostrar o valor antigo riscado, adicione de:'R$ ...' no card. */
// Texto repetido nos combos com cílios (vem da arte enviada pela cliente)
const CILIOS_INCL='Cílios inclusos: vol. brasileiro, vol. celestial (5D), vol. stellar (4D), vol. starlight (fio a fio), vol. moonlight (3D)';
const PROMO=[
 {img:'combo-olhar-completo',n:'Combo Olhar Completo',d:'1 extensão de cílios, 2 manutenções e 1 design de sobrancelhas.',v:'R$ 210',rules:['Válido 1 vez no mês',CILIOS_INCL]},
 {img:'combo-cilios-gel',n:'Combo Cílios + Gel',d:'1 extensão de cílios e 1 alongamento em gel.',v:'R$ 190',rules:['Válido 1 vez no mês',CILIOS_INCL]},
 {img:'combo-gel-manutencoes',n:'Combo Gel + Manutenções',d:'1 alongamento em gel e 2 manutenções.',v:'R$ 200',rules:['Válido 1 vez no mês','Incluso nail art simples']},
];

/* Design de sobrancelha (2 cards). Valores PROVISÓRIOS: ajuste para os reais. */
const BROWS=[
 {img:'sobrancelha-design',n:'Designer Personalizado',d:'Modelagem com pinça, respeitando o formato natural do seu rosto.',v:'R$ 40',obs:'Manutenção de 15 a 20 dias'},
 {img:'sobrancelha-henna',n:'Design com Henna',d:'Design com henna para preencher falhas e dar mais definição.',v:'R$ 50'},
];

/* ---------- 4) CRIAÇÃO DOS CARDS E DO CARROSSEL ---------- */

// "esc" protege o texto: troca símbolos especiais (& < > ") por códigos seguros para não quebrar o HTML.
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// Categoria que aparece na mensagem (evita confusão, pois 'Remoção' existe em cílios e unhas)
const LABEL={lash:'Cílios',nails:'Unhas',brows:'Sobrancelhas'};

// Título do card: o que está entre parênteses vai para a linha de baixo (ex.: 'Banho de Gel' + '(Esmaltação Inclusa)')
const title=n=>{const m=n.match(/^(.*?)\s*(\(.*\))$/);return m?esc(m[1])+'<small>'+esc(m[2])+'</small>':esc(n)};

// Função principal. Recebe: id ('lash' ou 'nails'), items (a lista de dados) e kind (tipo, para saber quais preços mostrar).
function build(id,items,kind){
 const tr=document.getElementById(id+'-track'); // acha a faixa do carrossel no HTML (ex.: id="lash-track")

 // .map percorre cada item da lista e cria o HTML de um card; .join('') junta todos; innerHTML coloca na página.
 tr.innerHTML=items.map((p,k)=>{
  // FOTO: se o item tem img, mostra a foto; senão mostra a caixa tracejada "adicionar imagens".
  const pic=p.img
   ?`<div class="img"><img src="img/${p.img}.webp" data-b="${p.img}" data-i="0" onerror="nextExt(this)" alt="${esc(p.n)}" width="320" height="400" loading="lazy" decoding="async" draggable="false"></div>`
   :`<div class="img empty"><div class="ph-empty"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/></svg>adicionar imagens</div></div>`;

  // PREÇOS: lash mostra 3 valores; nails mostra só 1. Para mudar os rótulos ("Investimento" etc.), edite aqui.
  const pr=kind==='lash'&&p.m15
   ?`<div class="main"><span>Investimento</span><b>${p.i}</b></div><div><span>Manutenção 15 dias</span><b>${p.m15}</b></div><div><span>Manutenção 20 dias</span><b>${p.m20}</b></div>`
   :kind==='promo'
   ?(p.de?`<div><span>De</span><s>${p.de}</s></div><div class="main"><span>Por apenas</span><b>${p.v}</b></div>`:`<div class="main"><span>Valor do combo</span><b>${p.v}</b></div>`)
   :`<div class="main"><span>Valor</span><b>${p.v}</b></div>`+(p.m15?`<div><span>Manutenção 15 dias</span><b>${p.m15}</b></div><div><span>Manutenção 20 dias</span><b>${p.m20}</b></div>`:'')+(p.obs?`<div class="obs">${esc(p.obs)}</div>`:'');

  // Selo "Promoção" (só nos cards de promoção)
  const badge=kind==='promo'?'<span class="badge">Promoção</span>':'';

  // MENSAGEM do WhatsApp do botão deste card (usa o nome do procedimento, p.n). Edite o texto se quiser.
  const msg=kind==='promo'
   ?`Oii! Gostaria de aproveitar a promoção ${p.n}. Gostaria de saber os horários disponíveis.`
   :`Oii! Eu tenho interesse em agendar o procedimento ${p.n}. Gostaria de saber os horários disponíveis.`;

  // O CARD montado: foto + título + descrição + preços + botão. ${...} insere os valores da lista.
  return `<article class="card">${badge}${pic}<div class="body"><h3>${title(p.n)}</h3><p>${esc(p.d)}</p>${p.rules?`<ul class="notes">${p.rules.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>`:''}<div class="prices">${pr}</div><a class="btn p" href="${wa(msg)}" target="_blank" rel="noopener">Agendar horário</a></div></article>`}).join('');

 // BOLINHAS indicadoras
 const dots=document.getElementById(id+'-dots'),cards=[...tr.children]; // dots = caixa das bolinhas; cards = lista dos cards criados
 dots.innerHTML=cards.map((_,k)=>`<button aria-label="Ir para o card ${k+1}"></button>`).join(''); // 1 bolinha por card
 const ds=[...dots.children]; // lista das bolinhas

 // "upd": descobre qual card está mais perto do centro e o destaca (borda/brilho roxo + bolinha ativa).
 const upd=()=>{
  const mid=tr.scrollLeft+tr.clientWidth/2;    // posição do centro da faixa visível
  let best=0,bd=1e9;                           // best = card vencedor; bd = menor distância encontrada (começa enorme)
  cards.forEach((c,k)=>{
   const d=Math.abs(c.offsetLeft+c.offsetWidth/2-mid); // distância do centro do card até o centro da tela
   if(d<bd){bd=d;best=k}                       // guarda o mais próximo
  });
  cards.forEach((c,k)=>c.classList.toggle('center',k===best)); // só o card vencedor recebe a classe "center"
  ds.forEach((d,k)=>d.classList.toggle('on',k===best))         // só a bolinha vencedora recebe a classe "on"
 };

 // "go": rola o carrossel até o card número k, deixando-o centralizado.
 const go=k=>tr.scrollTo({left:cards[k].offsetLeft-(tr.clientWidth-cards[k].offsetWidth)/2});

 ds.forEach((d,k)=>d.onclick=()=>go(k));       // clicar numa bolinha leva ao card dela

 // Ao rolar, atualiza o destaque. requestAnimationFrame deixa suave; passive melhora o desempenho no celular.
 tr.addEventListener('scroll',()=>requestAnimationFrame(upd),{passive:true});
 upd();setTimeout(upd,300);                    // atualiza já na criação e de novo após 0,3 s (fontes/imagens mudam tamanhos)

 /* ARRASTAR COM O MOUSE (no celular o dedo já rola sozinho) */
 let down=false,sx=0,sl=0,moved=false;         // down = mouse apertado?; sx = onde começou; sl = rolagem inicial; moved = arrastou de verdade?
 tr.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='mouse')return;           // ignora toque/caneta: só mouse
  down=true;moved=false;sx=e.clientX;sl=tr.scrollLeft; // registra o ponto de partida
  tr.classList.add('drag')                     // classe que desliga o "ímã" de rolagem enquanto arrasta
 });
 window.addEventListener('pointermove',e=>{
  if(!down)return;                             // só age se o mouse estiver apertado
  const dx=e.clientX-sx;                       // quanto o mouse andou para os lados
  if(Math.abs(dx)>4)moved=true;                // passou de 4px = é um arrasto, não um clique
  tr.scrollLeft=sl-dx                          // move a faixa junto com o mouse
 });
 window.addEventListener('pointerup',()=>{
  if(!down)return;
  down=false;tr.classList.remove('drag');upd() // soltou: volta o "ímã" e atualiza o destaque
 });
 // Se foi arrasto, cancela o clique (evita abrir o WhatsApp sem querer ao soltar o mouse sobre o botão)
 tr.addEventListener('click',e=>{if(moved){e.preventDefault();moved=false}},true);
 // Setas do teclado (← →) também movem o carrossel
 tr.addEventListener('keydown',e=>{if(e.key==='ArrowRight')step(id,1);if(e.key==='ArrowLeft')step(id,-1)});
}

// "step": move o carrossel um card para a direita (d=1) ou esquerda (d=-1). 22 = espaço entre cards (igual ao gap no CSS).
function step(id,d){const tr=document.getElementById(id+'-track');tr.scrollBy({left:d*(tr.children[0].offsetWidth+22)})}

// Cria os dois carrosséis usando as listas de dados da seção 3.
build('promo',PROMO,'promo');build('lash',LASH,'lash');build('nails',NAILS,'nails');build('brows',BROWS,'brows');

// Liga as setas ← → de cada seção (data-t = carrossel, data-d = direção, definidos no HTML).
document.querySelectorAll('.arrows button').forEach(b=>b.onclick=()=>step(b.dataset.t,+b.dataset.d));

/* ---------- 5) BOTÕES DE WHATSAPP GENÉRICOS ---------- */
// Todo elemento com data-wa no HTML ganha o link do WhatsApp com a mensagem escrita nele.
document.querySelectorAll('[data-wa]').forEach(a=>{a.href=wa(a.dataset.wa);a.target='_blank';a.rel='noopener'});

/* ---------- 6) MENU DO CELULAR ---------- */
const bur=document.getElementById('burger'),menu=document.getElementById('menu'); // botão hambúrguer e o menu
// Clicar no hambúrguer abre/fecha o menu (classe "open") e avisa leitores de tela (aria-expanded).
bur.onclick=()=>{const o=menu.classList.toggle('open');bur.setAttribute('aria-expanded',o)};
// Clicar em qualquer link do menu fecha o menu.
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');bur.setAttribute('aria-expanded',false)}));

/* ---------- 7) ESTRELINHAS DO FUNDO ---------- */
const st=document.getElementById('stars'); // caixa onde as estrelas entram
// 28 = quantidade de estrelas. Aumente/diminua o número para mudar.
for(let i=0;i<28;i++){
 const s=document.createElement('i');                       // cria uma estrela
 s.style.left=Math.random()*100+'%';                        // posição horizontal aleatória
 s.style.top=Math.random()*100+'%';                         // posição vertical aleatória
 s.style.opacity=.25+Math.random()*.6;                      // brilho aleatório (entre 0.25 e 0.85)
 s.style.transform=`scale(${.6+Math.random()*1.2})`;        // tamanho aleatório
 st.appendChild(s)                                          // coloca na página
}

/* ---------- 8) REVELAR AO ROLAR ---------- */
// Observador: avisa quando um elemento aparece na tela.
const io=new IntersectionObserver(es=>es.forEach(e=>{
 if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)} // apareceu: ativa a animação (classe "show") e para de observar
}),{threshold:.15}); // dispara quando 15% do elemento está visível
document.querySelectorAll('.rv').forEach(el=>io.observe(el)); // observa todo elemento com a classe "rv"