const apikeyinput = document.getElementById('apikey');
const GameOptions = document.getElementById('GameOptions');
const BestTimeinput = document.getElementById('BestTimeinput');
const button = document.getElementById('button');
const AiResponse = document.getElementById('AiResponse');
const form = document.getElementById('form');

const markdownToHTML = (text) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(text);
};

const PerguntarIA = async (BestTime, game, apikey) => {
    const model = "gemini-2.5-flash"; // Recomendo usar um modelo mais recente como o 1.5-flash
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apikey}`;

    let pergunta;

    // --- ESTRUTURA LÓGICA CORRIGIDA ---
    if (game === 'Pixelmon') {
        pergunta = `
        Aja como um mestre em Pixelmon fluente em portugues e um especialista em ${game}.

        Preciso de ajuda com o seguinte tópico: "${BestTime}".
        Primeiro, use sua ferramenta de busca para encontrar o site oficial do Pixelmon Reforged e baseie sua resposta nas informações mais atuais encontradas lá.**
        Por favor, forneça uma lista nao muito grande sobre o que foi pedido. Para cada Pokémon relevante, inclua:

        * **Pokémon:** (Nome do Pokémon)
        * **Biomas:** (Onde encontrá-lo no mundo)
        * **Utilidade no jogo:** (Por que ele é útil? Ex: para batalhas, como montaria, para obter itens específicos, etc.)
        Nunca coloque informaçoes de onde o  foi buscada a informaçoes, apenas entregue a resposta.
        Ao final, inclua um  pequeno parágrafo com **dicas gerais e estratégias** sobre o tópico que perguntei.
        Responda em formato markdown.
        Não use saudações ou despedidas, seja direto nas respostas.
        Procure sempre buscar informações atuais.
        Seja criativo e me dê dicas que realmente façam a diferença no jogo!
        sempre busque respostas para deixar o usuário mais forte no jogo!
        `;

    } else if (game === 'Pokemon Showdown') {
        pergunta = `
        Aja como um mestre em PokemonShowdown fluente em portugues.

        Estou jogando no formato ${BestTime} e preciso da sua ajuda para montar um time competitivo.

        Por favor, crie um time de 6 Pokémon e, para cada um deles, forneça os seguintes detalhes em formato de lista:
        De essa lista com a organizaçao adequada para copiar e colar no PokemonShowdown

        * **Pokémon:** (Nome do Pokémon)
        * **Item:** (O item que o Pokémon deve segurar)
        * **Habilidade:** (A habilidade recomendada para a estratégia)
        * **Moveset:** (Uma lista com os 4 ataques)
        * **Nature:** (A "nature" que otimiza os status do Pokémon)
        * **EVs:** (A distribuição de "Effort Values" para maximizar a eficácia)
        * **IVs:** (Valores Individuais de cada Pokemon)

        Ao final, inclua um pequeno parágrafo explicando a **estratégia do time**, descrevendo como os Pokémon interagem e qual a sinergia entre eles.
        Responda em formato markdown.
        Nao entrege saudaçoes ou despedidas, seja direto nas respostas.
        procure sempre buscar informações atuais.
        Quando nao tiver certeza da informaçao, nao de ela como resposta.
        Seja criativo e me dê um time forte e original!
        deixe a resposta sem muitos detalhes, apenas o necessário para entender a estratégia do time.
        sempre deixe a resposta organizada para facilitar a copia e colagem no PokemonShowdown.
        `;
    
    } else if (game === 'Pokemon TCG') {
        pergunta = `
        Aja como um jogador profissional e deck builder de Pokémon TCG, especialista em análise de metagame e otimização de listas para o formato Padrão (Standard) atual. Sua fluência em português do Brasil é perfeita.

        Estou querendo montar um deck competitivo focado em "${BestTime}". Meu objetivo é ter uma lista otimizada para competir em torneios locais.

        Por favor, gere uma resposta completa seguindo estritamente a estrutura abaixo:

        1.  ****Arquétipo do Deck:**** (Escreva o nome popular do arquétipo).
        2.  ****Estratégia Principal:**** (Em um único parágrafo conciso, explique o plano de jogo central, como o deck busca vencer e qual o seu motor de consistência).
        3.  ****Decklist para Importação:**** (Forneça a lista completa no formato exato para ser copiada e colada no Pokémon TCG Live. Separe as cartas por tipo: Pokémon, Apoiador, Item, Energia).

            * Exemplo de Formato:
                \`4 Chien-Pao ex PAL 61\`
                \`3 Baxcalibur PAL 60\`
                \`4 Ultra Bola SVI 196\`
                \`...e assim por diante.\`

        4.  ****Análise Estratégica Detalhada:****
            * ****Combos Principais:**** Em formato de lista (bullet points), descreva 2 ou 3 interações e sinergias fundamentais entre as cartas do deck.
            * ****Plano de Jogo Básico:**** Descreva o que o jogador deve buscar fazer no "Turno 1", no "Meio do Jogo" (turnos 2-4) e no "Fim de Jogo" (condição de vitória).
            * ****Cartas Flexíveis ("Techs"):**** Sugira 1 ou 2 cartas que poderiam ser incluídas na lista para melhorar matchups específicas contra os decks mais populares do meta atual (ex: contra Charizard ex, Gardevoir ex, etc.) e explique o porquê.

        **Instruções de Comportamento:**

        * **Direto ao Ponto:** Não use saudações, introduções genéricas ou despedidas. Comece a resposta diretamente no item 1.
        * **Informações Atuais:** Baseie a lista e a análise no metagame mais recente possível.
        * **Seja Criativo e Competitivo:** Não forneça apenas a lista mais óbvia. A lista deve ser forte, mas pode incluir uma ou duas escolhas inteligentes e originais que surpreendam o oponente.
        * **Foco na Clareza:** A explicação da estratégia deve ser clara e fácil de entender, mesmo para um jogador que não conhece o deck a fundo.
        * **Formato:** Toda a resposta deve ser em Markdown para garantir a organização e a legibilidade.
        `;
    }

    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }];

    const tools = [{
        googleSearch: {},
    }];

    // Chamada API
    try {
        const response = await fetch(geminiURL, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                contents,
                tools
            })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro da API: ${errorBody.error.message}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "A resposta da IA não veio no formato esperado ou tentou usar uma ferramenta sem sucesso. Tente novamente.";
        }
    } catch (error) {
        console.error("Erro na chamada da API:", error);
        return `Ocorreu um erro ao conectar com a IA: ${error.message}`;
    }
};

// --- LÓGICA DO PLACEHOLDER CORRIGIDA ---
GameOptions.addEventListener('change', function () {
    const selectedGame = GameOptions.value;
    if (selectedGame === 'Pixelmon') {
        BestTimeinput.placeholder = 'Ex: melhores pokemons para Pixelmon';
    } else if (selectedGame === 'Pokemon Showdown') {
        BestTimeinput.placeholder = 'Ex: time para o modo Dupla OU';
    } else if (selectedGame === 'Pokemon TCG') {
        BestTimeinput.placeholder = 'Ex: deck de Chien-Pao ex';
    } else {
        BestTimeinput.placeholder = 'Ex: melhor time modo Dupla OU';
    }
});

const enviarformulario = async (event) => {
    event.preventDefault();
    const apikey = apikeyinput.value;
    const game = GameOptions.value;
    const BestTime = BestTimeinput.value;

    if (apikey === '' || game === '' || BestTime === '') {
        alert('Preencha todos os campos!');
        return;
    }

    button.disabled = true;
    button.textContent = 'Pensando...';
    button.classList.add('Loading');
    AiResponse.classList.remove('hidden');
    AiResponse.querySelector('.Response-content').innerHTML = ""; // Limpa a resposta anterior

    try {
        const text = await PerguntarIA(BestTime, game, apikey);
        AiResponse.querySelector('.Response-content').innerHTML = markdownToHTML(text);
    } catch (error) {
        console.error('Error no formulário:', error);
        AiResponse.querySelector('.Response-content').innerHTML = `<p style="color: #ff6b6b;">Ocorreu um erro. Verifique o console para mais detalhes.</p>`;
    } finally {
        button.disabled = false;
        button.textContent = "Perguntar";
        button.classList.remove('Loading');
    }
};

form.addEventListener('submit', enviarformulario);