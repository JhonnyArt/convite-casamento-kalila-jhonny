# Convite de Casamento — Kalila & Jhonny

Convite digital elegante com animação de selo de cera, confirmação de presença via Google Sheets e hospedagem gratuita no GitHub Pages.

## Funcionalidades

- **Loading animado** com iniciais K & J (após abrir o convite)
- **Gatefold interativo** — clique no selo de cera para abrir o convite
- **Transição suave** entre capa e conteúdo
- **2 espaços para fotos** (início e final) com fade integrado ao fundo
- **RSVP por família** conectado ao Google Sheets
- **Contagem regressiva** até o grande dia
- **Navegação inferior** com mapa, confirmação, presentes e galeria

## Estrutura do projeto

```
├── index.html              # Página principal
├── css/style.css           # Estilos e animações
├── js/
│   ├── config.js           # Configurações (edite aqui!)
│   └── app.js              # Lógica do site
├── assets/
│   ├── foto-inicio.jpg     # Sua foto do topo
│   └── foto-final.jpg      # Sua foto do rodapé
└── google-apps-script/
    └── Code.gs             # Backend para Google Sheets
```

## Configuração rápida

### 1. Fotos

Coloque suas fotos em:
- `assets/foto-inicio.png` — foto do casal no topo
- `assets/foto-final.png` — foto no final da página

### 2. Personalização

Edite `js/config.js` com seus dados, links e URL do Apps Script.

### 3. Google Sheets (confirmação de presença)

#### Criar a planilha (automático)

1. Crie uma **planilha em branco** no Google Sheets
2. **Extensões → Apps Script** → cole o conteúdo de `google-apps-script/Code.gs`
3. Substitua `COLE_O_ID_DA_SUA_PLANILHA_AQUI` pelo ID da planilha  
   (ou deixe vazio se o script estiver vinculado à própria planilha)
4. Execute a função **`inicializarPlanilha`** uma vez no editor  
   → o script cria automaticamente as abas e colunas:

**Aba "Convidados"** (lista de convidados):

| ID | Sobrenome | Nomes |
|----|-----------|-------|
| 1  | Silva     | João Silva, Maria Silva |

- **Sobrenome**: nome da família
- **Nomes**: pessoas separadas por vírgula, ponto-e-vírgula ou pipe (`|`)

**Aba "Confirmados"** (preenchida pelo site):

| ID | Sobrenome | Nome | Data | Confirmado |
|----|-----------|------|------|------------|

> As abas também são criadas automaticamente na primeira vez que o site carrega a lista ou recebe uma confirmação.

#### Publicar o Apps Script

1. **Implantar → Nova implantação → App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
2. Copie a URL gerada e cole em `js/config.js` → `APPS_SCRIPT_URL`

### 4. Publicar no GitHub Pages

```bash
git init
git add .
git commit -m "Convite de casamento Kalila & Jhonny"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/convite-casamento.git
git push -u origin main
```

No GitHub: **Settings → Pages → Source: main / root → Save**

Seu convite ficará em: `https://SEU_USUARIO.github.io/convite-casamento/`

## Paleta de cores

- Serenity Blue: `#b3cee5`
- Creme: `#fbf5e9`
- Dourado: `#b8962e`

## Licença

Projeto pessoal — Kalila & Jhonny, 2026.
