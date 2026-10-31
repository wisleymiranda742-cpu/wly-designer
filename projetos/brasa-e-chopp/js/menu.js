/* Dados do cardápio. Troque nomes, descrições, preços e fotos aqui: as páginas se montam sozinhas.
   img: caminho da foto (ex.: 'img/lanches/smash.webp'). Vazio = mostra um espaço reservado. */
window.CABANA = {
  nome: 'Brasa & Chopp',
  subtitulo: 'Burger & Bar',
  whatsapp: '', // ex.: '5591999990000'
  instagram: 'https://www.instagram.com/',
  mapsQuery: 'hamburgueria',
  endereco: 'Av. Exemplo, 1000 · Centro',
  bairro: 'Sua cidade',
  horarios: ['Ter a dom · 18h às 0h', 'Sex e sáb · até 1h'],

  // fotos recortadas (fundo transparente) dos ingredientes que pulam no topo. Vazio = desenho.
  ingredientes: { tomato: '', lettuce: '', onion: '', cheese: '', pickle: '', bacon: '', pepper: '', sesame: '' },

  // 5 pratos que giram no topo da página inicial (os mais pedidos)
  hero: ['smash', 'baconfire', 'picanha', 'crispy', 'duplo'],

  lanches: [
    { id: 'burgers', nome: 'Burgers', nota: 'pão brioche e blends da casa', itens: [
      { id: 'smash', nome: 'Brasa Smash', curto: 'Smash', desc: 'Dois smash de 90 g, cheddar, cebola caramelizada e molho da casa no pão brioche.', preco: 32.9, tag: 'Mais pedido', ing: ['cheese', 'onion', 'lettuce', 'tomato', 'pickle'], img: 'img/lanches/smash.webp' },
      { id: 'baconfire', nome: 'Bacon Fire', curto: 'Bacon Fire', desc: 'Blend de 180 g, bacon crocante, cheddar, jalapeño e maionese defumada.', preco: 36.9, tag: 'Picante', ing: ['bacon', 'pepper', 'cheese', 'onion', 'tomato'], img: 'img/lanches/baconfire.webp' },
      { id: 'picanha', nome: 'Brasa Picanha', curto: 'Picanha', desc: 'Blend de picanha de 180 g, queijo coalho grelhado, rúcula e vinagrete.', preco: 39.9, tag: 'Da casa', ing: ['lettuce', 'tomato', 'onion', 'cheese', 'pepper'], img: 'img/lanches/picanha.webp' },
      { id: 'crispy', nome: 'Crispy Chicken', curto: 'Crispy', desc: 'Frango empanado crocante, alface, tomate e maionese de ervas.', preco: 29.9, tag: '', ing: ['lettuce', 'tomato', 'pickle', 'onion', 'cheese'], img: 'img/lanches/crispy.webp' },
      { id: 'duplo', nome: 'Duplo Cheddar', curto: 'Duplo', desc: 'Dois blends de 150 g, muito cheddar cremoso e bacon.', preco: 42.9, tag: 'Para os famintos', ing: ['cheese', 'bacon', 'cheese', 'onion', 'pickle'], img: 'img/lanches/duplo.webp' },
      { id: 'classico', nome: 'Clássico', desc: 'Blend de 150 g, queijo prato, alface, tomate e maionese da casa.', preco: 27.9, tag: '', img: 'img/lanches/classico.webp' },
      { id: 'veggie', nome: 'Veggie Brasa', desc: 'Hambúrguer de grão-de-bico, queijo, tomate, rúcula e maionese verde.', preco: 31.9, tag: 'Novo', img: 'img/lanches/veggie.webp' }
    ]},
    { id: 'combos', nome: 'Combos', nota: 'lanche + fritas + bebida', itens: [
      { id: 'c-smash', nome: 'Combo Smash', desc: 'Brasa Smash, fritas da casa e refrigerante lata.', preco: 44.9, tag: 'Mais pedido', img: 'img/lanches/c-smash.webp' },
      { id: 'c-fire', nome: 'Combo Bacon Fire', desc: 'Bacon Fire, fritas com cheddar e refrigerante lata.', preco: 52.9, tag: '', img: 'img/lanches/c-fire.webp' },
      { id: 'c-casal', nome: 'Combo Casal', desc: 'Dois burgers à escolha, porção de fritas grande e duas bebidas.', preco: 89.9, tag: 'Para dividir', img: 'img/lanches/c-casal.webp' }
    ]},
    { id: 'porcoes', nome: 'Porções', nota: 'para a mesa', itens: [
      { id: 'p-rustica', nome: 'Batata rústica', desc: 'Batata com casca, alecrim e alho, com maionese da casa.', preco: 22.9, tag: '', img: 'img/lanches/p-rustica.webp' },
      { id: 'p-onion', nome: 'Onion rings', desc: 'Anéis de cebola empanados, crocantes, com molho barbecue.', preco: 24.9, tag: '', img: 'img/lanches/p-onion.webp' },
      { id: 'fritasbacon', nome: 'Fritas com bacon', curto: 'Fritas', desc: 'Fritas cobertas com molho de queijo, bacon em cubos e orégano.', preco: 34.9, tag: 'Mais pedido' },
      { id: 'p-isca', nome: 'Isca de frango', desc: 'Tiras de frango empanadas com molho de mostarda e mel.', preco: 34.9, tag: '', img: 'img/lanches/p-isca.webp' }
    ]},
    { id: 'kids', nome: 'Kids', nota: 'para os pequenos', itens: [
      { id: 'k-mini', nome: 'Mini burger', desc: 'Burger de 90 g com queijo, batatinha e suco natural.', preco: 24.9, tag: '', img: 'img/lanches/k-mini.webp' }
    ]}
  ],

  bebidas: [
    { id: 'autorais', nome: 'Drinks autorais', itens: [
      { id: 'b-jambu', nome: 'Caipirinha de jambu', desc: 'Cachaça, limão e jambu, a erva que dá aquele formigamento na boca.', preco: 24.9, tag: 'Do Pará', img: 'img/bebidas/b-jambu.webp' },
      { id: 'b-cupu', nome: 'Caipirinha de cupuaçu', desc: 'Cachaça com polpa de cupuaçu, cremosa e azedinha.', preco: 22.9, tag: '', img: 'img/bebidas/b-cupu.webp' },
      { id: 'b-gin', nome: 'Gin tônica de maracujá', desc: 'Gin, água tônica, maracujá e hortelã, bem gelado.', preco: 27.9, tag: '', img: 'img/bebidas/b-gin.webp' },
      { id: 'b-mule', nome: 'Moscow mule', desc: 'Vodca, limão, xarope de gengibre e espuma cítrica.', preco: 28.9, tag: '', img: 'img/bebidas/b-mule.webp' },
      { id: 'b-mojito', nome: 'Mojito', desc: 'Rum branco, hortelã, limão e água com gás.', preco: 24.9, tag: '', img: 'img/bebidas/b-mojito.webp' },
      { id: 'b-negroni', nome: 'Negroni', desc: 'Gin, vermute rosso e bitter, servido com casca de laranja.', preco: 29.9, tag: '', img: 'img/bebidas/b-negroni.webp' }
    ]},
    { id: 'cervejas', nome: 'Cervejas', itens: [
      { id: 'b-chopp', nome: 'Chopp da casa', desc: 'Pilsen leve e gelado, em copo de 400 ml.', preco: 12.9, tag: '', img: 'img/bebidas/b-chopp.webp' },
      { id: 'b-ipa', nome: 'IPA artesanal', desc: 'Cerveja amarga e aromática, ótima com burger.', preco: 22.9, tag: '', img: 'img/bebidas/b-ipa.webp' },
      { id: 'b-long', nome: 'Long neck', desc: 'Marcas tradicionais. Pergunte as opções do dia.', preco: 11.9, tag: '', img: 'img/bebidas/b-long.webp' }
    ]},
    { id: 'semalcool', nome: 'Sem álcool', itens: [
      { id: 'b-soda', nome: 'Soda italiana', desc: 'Xarope de frutas vermelhas com água com gás e gelo.', preco: 14.9, tag: '', img: 'img/bebidas/b-soda.webp' },
      { id: 'b-limonada', nome: 'Limonada suíça', desc: 'Limão batido com leite condensado, cremosa.', preco: 12.9, tag: '', img: 'img/bebidas/b-limonada.webp' },
      { id: 'b-suco', nome: 'Suco de cupuaçu', desc: 'Fruta da região, batido na hora com ou sem leite.', preco: 11.9, tag: 'Do Pará' },
      { id: 'b-refri', nome: 'Refrigerante lata', desc: 'Cola, guaraná ou laranja, 350 ml.', preco: 7.9, tag: '', img: 'img/bebidas/b-refri.webp' },
      { id: 'b-agua', nome: 'Água mineral', desc: 'Com ou sem gás, 500 ml.', preco: 5.0, tag: '', img: 'img/bebidas/b-agua.webp' }
    ]}
  ],

  sobremesas: [
    { id: 's-brownie', nome: 'Brownie com sorvete', desc: 'Brownie quente de chocolate meio amargo com sorvete de creme e calda.', preco: 19.9, img: 'img/sobremesas/s-brownie.webp' },
    { id: 's-petit', nome: 'Petit gâteau', desc: 'Bolinho de chocolate com recheio cremoso, servido com sorvete.', preco: 22.9, img: 'img/sobremesas/s-petit.webp' },
    { id: 's-cheese', nome: 'Cheesecake de frutas vermelhas', desc: 'Creme de queijo na base de biscoito com calda de frutas vermelhas.', preco: 18.9 },
    { id: 's-cupu', nome: 'Creme de cupuaçu', desc: 'Mousse de cupuaçu com raspas de chocolate e castanha-do-pará.', preco: 16.9, img: 'img/sobremesas/s-cupu.webp' },
    { id: 's-shake', nome: 'Milkshake de Ovomaltine', desc: 'Sorvete batido com Ovomaltine crocante e chantilly.', preco: 21.9, img: 'img/sobremesas/s-shake.webp' }
  ],
  adicionais: [
    { id: 'a-sorvete', nome: 'Bola de sorvete', preco: 5.0 },
    { id: 'a-calda', nome: 'Calda de chocolate', preco: 3.0 },
    { id: 'a-chantilly', nome: 'Chantilly', preco: 3.0 },
    { id: 'a-castanha', nome: 'Castanha-do-pará', preco: 4.0 }
  ],

  combosDestaque: ['c-smash', 'c-fire', 'c-casal'],
  depoimentos: [
    { nome: 'Juliana M.', info: 'Cliente desde 2023', texto: 'O Brasa Smash é o melhor que já comi na cidade. Pedi pelo site e chegou quentinho em 30 minutos.' },
    { nome: 'Rafael S.', info: 'Veio com os amigos', texto: 'Ambiente top, chopp gelado e o Bacon Fire tem a pimenta na medida certa.' },
    { nome: 'Carla P.', info: 'Pediu pelo WhatsApp', texto: 'Montei o pedido no celular, mandei no WhatsApp e já veio tudo certinho. Muito prático.' }
  ]
};
