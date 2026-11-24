// =====================================================
// ELEMENTOS DA PÁGINA
// querySelector = procura no HTML o elemento com aquela classe
// querySelectorAll = procura TODOS e devolve uma lista
// =====================================================
let nome = document.querySelector(".nome")
let personagem = document.querySelector(".personagem")
let botoes = document.querySelectorAll(".avatar, .voce") // as 3 bolinhas + a selfie
let aviso = document.querySelector(".aviso")



// =====================================================
// TROCAR DE PERSONAGEM
// Recebe: nome, caminho da imagem, cor e o botão que foi clicado
// =====================================================
function escolherPersonagem(nomePersonagem, imagemPersonagem, cor, botao){

    nome.innerHTML = nomePersonagem
    // innerHTML = colocar algo dentro do HTML

    personagem.src = imagemPersonagem
    // src = colocar algo dentro do src da imagem

    personagem.alt = nomePersonagem
    // alt = descrição da imagem pra leitores de tela

    // A cor vai pra variável --cor do CSS.
    // Assim o nome, o brilho das bolinhas, o anel e o cursor
    // mudam de cor juntos, sem precisar mexer em cada um
    document.documentElement.style.setProperty("--cor", cor)

    // Marcar qual bolinha está selecionada:
    // 1) tira a classe "ativo" de todas
    // 2) coloca "ativo" só na que foi clicada
    if (botao) {
        botoes.forEach(function(b){ b.classList.remove("ativo") })
        botao.classList.add("ativo")
    }

    // Reiniciar a animação de entrada a cada troca.
    // Truque: desliga a animação, força o navegador a "perceber"
    // (offsetWidth) e liga de novo
    personagem.style.animation = "none"
    nome.style.animation = "none"
    void personagem.offsetWidth
    personagem.style.animation = ""
    nome.style.animation = ""
}


// =====================================================
// MENSAGEM DE AVISO (usada quando dá erro)
// =====================================================
function mostrarAviso(mensagem){

    aviso.textContent = mensagem
    aviso.classList.add("mostrar")

    // setTimeout = espera um tempo (em milissegundos) e depois faz algo
    setTimeout(function(){
        aviso.classList.remove("mostrar")
    }, 4000) // 4 segundos
}


/*
    ALGORITMO 2 (selfie)

    [x] Pegar a imagem do usuario
    [x] Enviar para a IA imagem + o que eu quero que ela faça
    [x] Receber a imagem da IA
    [x] Colocar a imagem no site

*/
function lerFoto(foto){

    // onchange() = quando mudar algo, faça algo
    // onclick() = quando clicar em algo, faça algo
    // onload() = quando carregar algo, faça algo
    // toda vez que eu tenho que ir no SERVIDOR - ASYNC / AWAIT

    // Se a pessoa abriu o seletor e cancelou, não tem foto: para aqui
    if (!foto.files[0]) return

    let botao = foto.parentElement // o <label> do 📸
    botao.classList.add("carregando") // começa a pulsar

    let leitor = new FileReader() // FileReader = Leitor de arquivos
    leitor.readAsDataURL(foto.files[0]) // transforma a foto em URL (link)

    leitor.onload = async function(){

        // try/catch = "tenta fazer isso; se der erro, cai no catch"
        // Sem isso, um erro da IA deixaria o site travado
        try {
            // await = espera a IA responder antes de continuar
            let desenho = await puter.ai.txt2img("Transforme a pessoa desta foto em um personagem de videogame: contorno preto grosso, cores vivas, meio corpo, mantendo o rosto parecido. Fundo totalmente transparente: sem cenário, sem chão e sem sombra.",
                {
                    model: "replicate:openai/gpt-image-2.5-flare",
                    provider: "openai",
                    input_image: leitor.result,
                    quality: "medium",
                    providerOptions: { background: "transparent" }
                })

            escolherPersonagem("Você", desenho, '#b9b604', botao)

        } catch (erro) {
            console.log("Deu erro ao gerar a imagem:", erro) // aparece no F12 > Console
            mostrarAviso("Não deu pra gerar sua selfie. Tente de novo.")
        }

        // Rodam sempre, deu certo ou não:
        botao.classList.remove("carregando") // para de pulsar
        foto.value = "" // limpa o input, assim dá pra escolher a mesma foto outra vez
    }
}


