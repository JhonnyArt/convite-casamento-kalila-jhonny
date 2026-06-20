/**
 * Configurações do convite — edite este arquivo antes de publicar.
 */
const CONFIG = {
  // URL pública do convite (GitHub Pages) — usada na prévia ao compartilhar
  siteUrl: 'https://jhonnyart.github.io/convite-casamento-kalila-jhonny/',
  share: {
    title: 'Kalila & Jhonny — Convite de Casamento',
    description:
      'Temos a honra de convidar você para a celebração de nosso casamento. 19 de Setembro de 2026 — Santo André, SP.',
    image: 'assets/convite-whatsapp.png',
  },

  // URL do Web App do Google Apps Script (veja README.md)
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby8I8RderIrurpY8xx-mqCteExsmMLQsvJVWzsk_k93o059TQRBaR4jkhjvxoFlJtA/exec',

  noivos: {
    nome1: 'Kalila',
    nome2: 'Jhonny',
    data: '19 de Setembro de 2026',
    dataISO: '2026-09-19T17:30:00',
    horario: '17:30',
    local: "Buffet D' Matos",
    endereco: 'Rua Oratório, 3265 - Santo André - SP',
    prazoRSVP: '01 de Setembro de 2026',
  },

  pais: {
    noivo: ['Almir R dos Santos', 'Adriana J M dos Santos'],
    noiva: ['Joaquim V Rocha', 'Rita Maria S Rocha'],
  },

  links: {
    mapa: 'https://www.google.com/maps/dir/?api=1&destination=Rua+Orat%C3%B3rio,+3265,+Santo+Andr%C3%A9+-+SP',
    listaPresentes: 'https://www.querodecasamento.com.br/lista-de-casamento/kalila-jhonny',
    pix: 'pix.html',
  },

  pix: {
    codigoCopiaCola:
      '00020126580014BR.GOV.BCB.PIX0136cc2b25f0-47de-421e-8cc6-d4e9340576655204000053039865802BR5918Kalila Silva Rocha6009SAO PAULO62140510U573GjcAAQ630415EA',
    titular: 'Kalila Silva Rocha',
    chaveLabel: 'Chave Aleatória',
    banco: '260 — Nu Pagamentos S.A. — Instituição de Pagamento',
    identificador: 'U573GjcAAQ',
    qrImage: 'assets/pix-qr.png',
    fotoTopo: 'assets/foto-pix-top.png',
  },

  fotos: {
    inicio: 'assets/foto-inicio.png',
    final: 'assets/foto-final.png',
  },

  musica: {
    arquivo: 'assets/musica.mp3',
    volume: 0.45,
    inicioEmSegundos: 71, // primeira vez começa em 1:11
  },
};
