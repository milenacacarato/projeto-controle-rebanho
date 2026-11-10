# Controle de Rebanho

Aplicativo multiplataforma (Android, iOS e navegador) para substituir anotações em papel e organizar o cadastro e o acompanhamento de animais.

## Tecnologias

- React Native com Expo SDK 54 e Expo Router
- TypeScript
- Firebase Authentication (e-mail e senha)
- Cloud Firestore
- Toast para feedback de operações

## Funcionalidades implementadas

- Login e logout com Firebase Authentication
- Cadastro, listagem, consulta, edição e exclusão de animais
- Validação de campos e verificação de número de brinco duplicado
- Filtro por status: ativo, vendido e abatido
- Busca por brinco, nome ou raça
- Histórico de manejos em subcoleção: vacina, pesagem e tratamento
- Atualização automática do peso do animal ao registrar pesagem
- Alerta visual para animais sem vacina registrada nos últimos 180 dias
- Painel com totais de animais, ativos e alertas de vacinação

## 1. Pré-requisitos

- Node.js LTS instalado
- npm
- Conta Google para acessar o Firebase
- Editor como VS Code
- Expo Go no celular (opcional)

## 2. Instalação

Extraia o ZIP, abra a pasta do projeto no terminal e execute:

```bash
npm install
```

Crie o arquivo `.env` copiando `.env.example` e preencha as seis variáveis com as credenciais do seu próprio projeto Firebase.

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux/macOS:

```bash
cp .env.example .env
```

## 3. Configuração do Firebase

1. Acesse https://console.firebase.google.com/ e crie um projeto.
2. Adicione um aplicativo Web ao projeto Firebase.
3. Copie os valores de configuração do Firebase para o arquivo `.env`.
4. Em **Authentication > Sign-in method**, habilite **E-mail/senha**.
5. Em **Authentication > Users**, crie um usuário de teste com e-mail e senha.
6. Em **Firestore Database**, crie o banco de dados.
7. Na área **Rules** do Firestore, publique o conteúdo de `firestore.rules`.

> As regras fornecidas exigem autenticação, conforme o enunciado. Para uma aplicação real com múltiplos usuários/propriedades, restrinja também a leitura e escrita por proprietário/tenant.

### Variáveis esperadas

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Não publique o arquivo `.env` no GitHub. Ele já está listado no `.gitignore`.

## 4. Executar

```bash
npx expo start
```

Para navegador:

```bash
npx expo start --web
```

Leia o QR Code com o Expo Go para abrir no celular. Para encerrar, pressione `Ctrl+C`.

## 5. Modelo de dados Firestore

### Coleção `animais`

| Campo | Tipo | Obrigatório | Observação |
|---|---|---:|---|
| brinco | string | Sim | Identificador do animal; verificação de duplicidade no app |
| nome | string | Não | Nome/apelido |
| especie | string | Sim | Ex.: Bovino |
| raca | string | Não | Raça |
| sexo | string | Sim | `M` ou `F` |
| nascimento | string | Sim | `AAAA-MM-DD` |
| peso | number | Sim | Peso atual em kg |
| pasto | string | Não | Identificação do pasto |
| status | string | Sim | `ativo`, `vendido` ou `abatido` |

### Subcoleção `animais/{animalId}/manejos`

| Campo | Tipo | Obrigatório | Observação |
|---|---|---:|---|
| tipo | string | Sim | `vacina`, `pesagem` ou `tratamento` |
| descricao | string | Sim | Descrição do procedimento |
| data | string | Sim | `AAAA-MM-DD` |
| pesoKg | number | Condicional | Usado em registros do tipo `pesagem` |

As datas em formato ISO (`AAAA-MM-DD`) podem ser ordenadas como texto em ordem cronológica.

## 6. Telas

- Login
- Início / painel
- Listagem do rebanho, busca e filtros
- Cadastro e edição de animal
- Detalhes do animal e histórico de manejos
- Cadastro de manejo

## 7. Roteiro de entrega alinhado ao arquivo da atividade

1. **Configuração do ambiente (5 pontos):** instalar dependências, executar Expo, configurar Firebase, autenticação e regras do Firestore. Registrar capturas de tela.
2. **Autenticação (10 pontos):** demonstrar login, mensagens de erro e logout.
3. **Cadastro de animais (10 pontos):** demonstrar validação, gravação no Firestore e limpeza/retorno após salvar.
4. **Listagem (10 pontos):** demonstrar lista, atualização ao retornar à tela e estado vazio.
5. **Edição e exclusão (15 pontos):** editar um registro e excluir com confirmação.
6. **Identidade visual (5 pontos):** conferir paleta, navegação e remoção de conteúdo de exemplo.
7. **Funcionalidade adicional (20 pontos):** demonstrar manejos, atualização de peso, alerta de vacinação e filtros de status.
8. **README e Git (10 pontos):** manter documentação, comentários úteis e commits organizados; adicionar o link do repositório à entrega.

O arquivo de instruções fornecido descreve essas oito atividades. Confira com o professor se existe algum complemento de apresentação ou critério não incluído no arquivo recebido.

## 8. Sugestão de commits

```bash
git init
git add .
git commit -m "chore: estrutura inicial Expo e Firebase"
git add .
git commit -m "feat: autenticação e painel do rebanho"
git add .
git commit -m "feat: CRUD de animais e filtros"
git add .
git commit -m "feat: histórico de manejos e alerta de vacinação"
git add .
git commit -m "docs: documentação do projeto"
```

## Observações técnicas

- O projeto usa credenciais Firebase via variáveis `EXPO_PUBLIC_*`; configure o `.env` antes de iniciar.
- A checagem de brinco duplicado no cliente é uma validação de experiência, não uma garantia de unicidade transacional. Para uso em produção, considere usar o brinco como ID de documento ou implementar uma estratégia transacional.
- O alerta de vacinação considera o manejo mais recente do tipo `vacina` e sinaliza ausência de registro ou intervalo superior a 180 dias.
- O botão de exclusão remove primeiro os documentos da subcoleção `manejos` e depois o documento do animal.
- O código foi preparado como scaffold funcional, mas precisa ser instalado e executado no seu ambiente com as credenciais do seu Firebase. Não foi possível validar build/execução nesta sessão.
