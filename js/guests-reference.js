/**
 * Referência de convidados e regras de RSVP
 * Extraído de rsvp_casamento.tsx — use para replicar lógicas futuras.
 * A planilha Google Sheets continua sendo a fonte oficial no site.
 */
const GUESTS_REFERENCE = {
  /**
   * Regras de negócio do RSVP
   */
  rules: {
    /** Mínimo de caracteres para iniciar a busca */
    minSearchLength: 2,
    /** Tipos ocultos da lista de confirmação (menores de 10 anos) */
    hiddenTypes: ['young'],
    /** Mensagem quando família tem crianças menores de 10 anos */
    youngChildrenNote:
      '* A confirmação de presença é necessária apenas para adultos e crianças maiores de 10 anos.',
    /** Validações no envio */
    validation: {
      atLeastOne: 'Por favor, selecione ao menos um convidado para confirmar a presença.',
      needsName: 'Por favor, preencha o nome das crianças sinalizadas antes de confirmar.',
      notFound: 'Nenhum convite encontrado. Tente outro nome ou sobrenome.',
      searchHint: 'Digite pelo menos 2 letras...',
    },
  },

  /** Tipos de convidado: adult | young (<10 anos) | older (10+) */
  memberTypes: {
    ADULT: 'adult',
    YOUNG: 'young',
    OLDER: 'older',
  },

  /**
   * Lista completa de famílias e membros (dados originais)
   * Cada membro: { id, name, type, needsName? }
   */
  families: [
    {
      id: 1,
      members: [
        { id: '1a', name: 'Juca Rocha', type: 'adult' },
        { id: '1b', name: 'Rita Rocha', type: 'adult' },
      ],
    },
    {
      id: 2,
      members: [
        { id: '2a', name: 'Ricardo Vieira', type: 'adult' },
        { id: '2b', name: 'Keite Vieira', type: 'adult' },
        { id: '2c', name: 'Daniel Vieira', type: 'young' },
      ],
    },
    {
      id: 3,
      members: [
        { id: '3a', name: 'Erik Monteiro', type: 'adult' },
        { id: '3b', name: 'Kelly Monteiro', type: 'adult' },
        { id: '3c', name: 'Davi Monteiro', type: 'older' },
        { id: '3d', name: 'Mateus Monteiro', type: 'older' },
      ],
    },
    {
      id: 4,
      members: [
        { id: '4a', name: 'Zilda Rocha', type: 'adult' },
        { id: '4b', name: 'Elina Rocha', type: 'adult' },
      ],
    },
    {
      id: 6,
      members: [
        { id: '6a', name: 'Caio Gondinho', type: 'adult' },
        { id: '6b', name: 'Letícia Rocha', type: 'adult' },
      ],
    },
    {
      id: 7,
      members: [
        { id: '7a', name: 'Maurício Bulcão', type: 'adult' },
        { id: '7b', name: 'Ana Rocha', type: 'adult' },
        { id: '7c', name: 'Mariana Bulcão', type: 'adult' },
        { id: '7d', name: 'Eric Eiki', type: 'adult' },
        { id: '7e', name: 'Maurícinho Bulcão', type: 'adult' },
        { id: '7f', name: 'Beatriz Ramos', type: 'adult' },
      ],
    },
    {
      id: 10,
      members: [
        { id: '10a', name: 'Rodrigo Chagas', type: 'adult' },
        { id: '10b', name: 'Cláudia Rocha Chagas', type: 'adult' },
        { id: '10c', name: 'Davi Rocha Chagas', type: 'older' },
      ],
    },
    {
      id: 11,
      members: [
        { id: '11a', name: 'Jessica Rocha', type: 'adult' },
        { id: '11b', name: 'Rita Figueiredo', type: 'adult' },
      ],
    },
    {
      id: 12,
      members: [
        { id: '12a', name: 'Miguel Aguilar', type: 'adult' },
        { id: '12b', name: 'Elaine Rocha', type: 'adult' },
        { id: '12c', name: 'Gustavo', type: 'young' },
        { id: '12d', name: 'Isabela', type: 'young' },
      ],
    },
    {
      id: 13,
      members: [
        { id: '13a', name: 'Jorge Forte', type: 'adult' },
        { id: '13b', name: 'Tereza Forte', type: 'adult' },
      ],
    },
    {
      id: 14,
      members: [
        { id: '14a', name: 'Gabriel', type: 'adult' },
        { id: '14b', name: 'Gabriela', type: 'adult' },
      ],
    },
    {
      id: 15,
      members: [
        { id: '15a', name: 'Patrick Santos', type: 'adult' },
        { id: '15b', name: 'Beatriz Rocha', type: 'adult' },
        { id: '15c', name: 'Théo', type: 'older' },
      ],
    },
    {
      id: 16,
      members: [
        { id: '16a', name: 'Albino Oliveira', type: 'adult' },
        { id: '16b', name: 'Margarida', type: 'adult' },
        { id: '16c', name: 'Rodrigo Araújo', type: 'adult' },
        { id: '16d', name: 'Vanessa Cristivão', type: 'adult' },
        { id: '16e', name: 'Lorena Cristóvão', type: 'older' },
        { id: '16f', name: 'Silvana Cristóvão', type: 'adult' },
        { id: '16g', name: 'Bruno Carvalho', type: 'adult' },
        { id: '16h', name: 'Fabiana Cristóvão', type: 'adult' },
        { id: '16i', name: 'Leonardo Carvalho', type: 'older' },
        { id: '16j', name: 'Barbara Carvalho', type: 'older' },
        { id: '16k', name: 'Criança (Menor de 10 anos)', type: 'young' },
      ],
    },
    {
      id: 20,
      members: [
        { id: '20a', name: 'Donizete Monteiro', type: 'adult' },
        { id: '20b', name: 'Miriam Monteiro', type: 'adult' },
        { id: '20c', name: 'Erika Monteiro', type: 'older' },
        { id: '20d', name: 'Alice', type: 'young' },
        { id: '20e', name: 'Hugo', type: 'young' },
      ],
    },
    {
      id: 21,
      members: [
        { id: '21a', name: 'Lucas Braga', type: 'adult' },
        { id: '21b', name: 'Ariane Rodrigues', type: 'adult' },
        { id: '21c', name: 'Sophia', type: 'young' },
      ],
    },
    {
      id: 22,
      members: [
        { id: '22a', name: 'Andreza Cunha', type: 'adult' },
        { id: '22b', name: 'Namorado Andreza', type: 'adult' },
      ],
    },
    {
      id: 23,
      members: [{ id: '23a', name: 'Tainá Nunes', type: 'adult' }],
    },
    {
      id: 24,
      members: [
        { id: '24a', name: 'Viviane Almeida', type: 'adult' },
        { id: '24b', name: 'Lídia Almeida', type: 'older' },
      ],
    },
    {
      id: 25,
      members: [
        { id: '25a', name: 'Igor Nogueira', type: 'adult' },
        { id: '25b', name: 'Janaína Nogueira', type: 'adult' },
        { id: '25c', name: 'Bejamin', type: 'young' },
      ],
    },
    {
      id: 26,
      members: [
        { id: '26a', name: 'Matheus Domingos', type: 'adult' },
        { id: '26b', name: 'Priscilla', type: 'adult' },
      ],
    },
    {
      id: 27,
      members: [{ id: '27a', name: 'João Araujo', type: 'adult' }],
    },
    {
      id: 28,
      members: [
        { id: '28a', name: 'Almir Rogerio Dos Santos', type: 'adult' },
        { id: '28b', name: 'Adriana Janaina Marcolino Dos Santos', type: 'adult' },
        { id: '28c', name: 'Sophia Dos Santos', type: 'older' },
      ],
    },
    {
      id: 29,
      members: [
        { id: '29a', name: 'João Carvalho', type: 'adult' },
        { id: '29b', name: 'Cida Marcolino', type: 'adult' },
      ],
    },
    {
      id: 30,
      members: [
        { id: '30a', name: 'Rafael Marcolino de Carvalho', type: 'adult' },
        { id: '30b', name: 'Marília Ortega de Cabecinho', type: 'adult' },
        { id: '30c', name: 'Ricardo Cabecinha Carvalho', type: 'older' },
      ],
    },
    {
      id: 31,
      members: [
        { id: '31a', name: 'Adelmo Coelho', type: 'adult' },
        { id: '31b', name: 'Andreia Marcolino', type: 'adult' },
        { id: '31c', name: 'Gabriel Coelho', type: 'older' },
      ],
    },
    {
      id: 32,
      members: [
        { id: '32a', name: 'José Carlos Agueda Júnior', type: 'adult' },
        { id: '32b', name: 'Ana Paula Carvalho', type: 'adult' },
      ],
    },
    {
      id: 33,
      members: [
        { id: '33a', name: 'Rogério', type: 'adult' },
        { id: '33b', name: 'Thays Marcolino', type: 'adult' },
        { id: '33c', name: 'Livia', type: 'young' },
      ],
    },
    {
      id: 34,
      members: [
        { id: '34a', name: 'Anderson Marcolino', type: 'adult' },
        { id: '34b', name: 'Michele Rosa Dos Santos', type: 'adult' },
        { id: '34c', name: 'Tiffany Alecrim Marcolino', type: 'older' },
        { id: '34d', name: 'Davi Luca', type: 'young' },
      ],
    },
    {
      id: 35,
      members: [
        { id: '35a', name: 'Luiz Dos Santos', type: 'adult' },
        { id: '35b', name: 'Antônia Dos Santos', type: 'adult' },
      ],
    },
    {
      id: 36,
      members: [
        { id: '36a', name: 'Márcio Santos', type: 'adult' },
        { id: '36b', name: 'Erica Sanches', type: 'adult' },
        { id: '36c', name: 'Filha 1', type: 'young', needsName: true },
        { id: '36d', name: 'Filha 2', type: 'young', needsName: true },
      ],
    },
    {
      id: 37,
      members: [
        { id: '37a', name: 'Gilmar Dos Santos', type: 'adult' },
        { id: '37b', name: 'Claudia Dos Santos', type: 'adult' },
      ],
    },
    {
      id: 38,
      members: [
        { id: '38a', name: 'Jonathan Luis dos Santos', type: 'adult' },
        { id: '38b', name: 'Monalisa dos Santos', type: 'adult' },
        { id: '38c', name: 'Derek', type: 'young' },
        { id: '38d', name: 'Laura', type: 'young' },
      ],
    },
    {
      id: 39,
      members: [
        { id: '39a', name: 'Isaque Dos Santos', type: 'adult' },
        { id: '39b', name: 'Esthefan Dos santos', type: 'adult' },
        { id: '39c', name: 'Mizael', type: 'young' },
      ],
    },
    {
      id: 40,
      members: [
        { id: '40a', name: 'Márcio Dos Santos', type: 'adult' },
        { id: '40b', name: 'Rochele Cristina Nascimento Dos Santos', type: 'adult' },
        { id: '40c', name: 'Pedro Henrique Dos santos', type: 'older' },
        { id: '40d', name: 'Victor Hugo Nascimento Brito', type: 'older' },
        { id: '40e', name: 'Cibele Mariano da Silva', type: 'older' },
      ],
    },
    {
      id: 41,
      members: [
        { id: '41a', name: 'Wagner Lima', type: 'adult' },
        { id: '41b', name: 'Esposa Wagner', type: 'adult' },
        { id: '41c', name: 'Ana Clara Lima', type: 'older' },
        { id: '41d', name: 'Isabela lima', type: 'older' },
      ],
    },
    {
      id: 42,
      members: [
        { id: '42a', name: 'Beatriz Soares', type: 'adult' },
        { id: '42b', name: 'Job Soares', type: 'adult' },
        { id: '42c', name: 'Thiago Soares', type: 'older' },
        { id: '42d', name: 'Lorena Soares', type: 'young' },
        { id: '42e', name: 'Alice Soares', type: 'young' },
      ],
    },
    {
      id: 43,
      members: [
        { id: '43a', name: 'Airton Souza', type: 'adult' },
        { id: '43b', name: 'Marilda Souza', type: 'adult' },
      ],
    },
    {
      id: 44,
      members: [
        { id: '44a', name: 'Wilson Barbalho', type: 'adult' },
        { id: '44b', name: 'Mayza Yorgos', type: 'adult' },
      ],
    },
    {
      id: 45,
      members: [{ id: '45a', name: 'Larrissa Ortiz', type: 'adult' }],
    },
    {
      id: 46,
      members: [
        { id: '46a', name: 'Vanda Santos', type: 'adult' },
        { id: '46b', name: 'Isabely Sanches', type: 'older' },
      ],
    },
    {
      id: 47,
      members: [
        { id: '47a', name: 'Orlando Vieira', type: 'adult' },
        { id: '47b', name: 'Neuza Vieira', type: 'adult' },
        { id: '47c', name: 'Mayara Vieira', type: 'adult' },
        { id: '47d', name: 'Renato Vieira', type: 'adult' },
        { id: '47e', name: 'Victor', type: 'young' },
        { id: '47f', name: 'Eliane Veira', type: 'adult' },
        { id: '47g', name: 'Reginaldo', type: 'adult' },
        { id: '47h', name: 'Thiago', type: 'older' },
        { id: '47i', name: 'Edivaldo Vieira', type: 'adult' },
        { id: '47j', name: 'Cintia', type: 'adult' },
        { id: '47k', name: 'Luana Vieira', type: 'older' },
        { id: '47l', name: 'Pedro', type: 'older' },
        { id: '47m', name: 'Vinicius', type: 'young' },
      ],
    },
    {
      id: 51,
      members: [
        { id: '51a', name: 'William Sousa', type: 'adult' },
        { id: '51b', name: 'Juliana Sousa', type: 'adult' },
        { id: '51c', name: 'katterine', type: 'young' },
        { id: '51d', name: 'luiza', type: 'young' },
      ],
    },
  ],

  /**
   * Busca metadados de um membro pelo nome (para cruzar com a planilha)
   */
  findMemberByName(name) {
    const norm = GUESTS_REFERENCE.normalize(name);
    for (const family of this.families) {
      for (const member of family.members) {
        if (GUESTS_REFERENCE.normalize(member.name) === norm) {
          return { ...member, refFamilyId: family.id };
        }
      }
    }
    return null;
  },

  /** Família completa (inclui crianças young) pelo id de referência */
  getFullFamily(refFamilyId) {
    return this.families.find(f => f.id === refFamilyId) || null;
  },

  /** Remove acentos para busca */
  normalize(str) {
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  },

  /** Membros visíveis na confirmação (exclui young) */
  getVisibleMembers(family) {
    return family.members.filter(m => !this.rules.hiddenTypes.includes(m.type));
  },
};
