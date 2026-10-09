const input = document.getElementById("tarefa");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const adicionar = document.getElementById("adicionar");
const tema = document.getElementById("tema");

const botaoPrincipais = document.getElementById("botaoPrincipais");
const principaisContainer = document.getElementById("principaisContainer");
const listaPrincipais = document.getElementById("listaPrincipais");
const semPrincipais = document.getElementById("semPrincipais");

const abrirAudio = document.getElementById("abrirAudio");
const alertaAudio = document.getElementById("alertaAudio");
const reproduzirAudio = document.getElementById("reproduzirAudio");
const fecharAudio = document.getElementById("fecharAudio");
const audioPapoi = document.getElementById("audioPapoi");
const gifPrincipal = document.getElementById("gifPrincipal");

let tarefas = [];
let temporizadorGif = null;

try {
    const dadosSalvos = localStorage.getItem("tarefas");

    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);

        if (Array.isArray(dados)) {
            tarefas = dados
                .filter(tarefa => tarefa && typeof tarefa.texto === "string")
                .map(tarefa => ({
                    texto: tarefa.texto,
                    concluida: Boolean(tarefa.concluida),
                    principal: Boolean(tarefa.principal)
                }));
        }
    }
} catch (erro) {
    console.error("Erro ao carregar tarefas:", erro);
}

function salvarTarefas() {
    try {
        localStorage.setItem("tarefas", JSON.stringify(tarefas));
    } catch (erro) {
        console.error("Erro ao salvar tarefas:", erro);
    }
}

function atualizarGifPrincipal(mostrarGif = false) {
    clearTimeout(temporizadorGif);

    if (!gifPrincipal) return;

    if (mostrarGif) {
        gifPrincipal.style.display = "block";

        temporizadorGif = setTimeout(function() {
            gifPrincipal.style.display = "none";
        }, 8000);
    } else {
        gifPrincipal.style.display = "none";
    }
}

function mostrar() {
    if (!lista || !contador) return;

    lista.innerHTML = "";

    tarefas.forEach(function(tarefa, index) {
        const li = document.createElement("li");
        li.className = tarefa.concluida ? "tarefa concluida" : "tarefa";

        const texto = document.createElement("span");
        texto.className = "texto";
        texto.textContent = tarefa.texto;

        const acoes = document.createElement("div");
        acoes.className = "acoes";

        const botaoConcluir = document.createElement("button");
        botaoConcluir.type = "button";
        botaoConcluir.className = "concluir";
        botaoConcluir.dataset.i = index;
        botaoConcluir.setAttribute("aria-label", "Concluir tarefa");
        botaoConcluir.innerHTML = '<i class="fa-solid fa-check"></i>';

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.className = "excluir";
        botaoExcluir.dataset.i = index;
        botaoExcluir.setAttribute("aria-label", "Excluir tarefa");
        botaoExcluir.innerHTML = '<i class="fa-solid fa-trash"></i>';

        acoes.append(botaoConcluir, botaoExcluir);
        li.append(texto, acoes);
        lista.appendChild(li);
    });

    const quantidade = tarefas.length;
    contador.textContent = `${quantidade} ${quantidade === 1 ? "tarefa" : "tarefas"} na lista`;

    mostrarPrincipais();
}

function mostrarPrincipais() {
    if (!listaPrincipais || !semPrincipais) return;

    listaPrincipais.innerHTML = "";

    tarefas.forEach(function(tarefa, index) {
        if (!tarefa.principal) return;

        const li = document.createElement("li");
        li.className = tarefa.concluida
            ? "principalTarefa concluidaPrincipal"
            : "principalTarefa";

        const texto = document.createElement("span");
        texto.className = "textoPrincipal";

        const estrela = document.createElement("i");
        estrela.className = "fa-solid fa-star";

        texto.append(estrela, document.createTextNode(" " + tarefa.texto));

        const acoes = document.createElement("div");
        acoes.className = "acoesPrincipal";

        const botaoConcluir = document.createElement("button");
        botaoConcluir.type = "button";
        botaoConcluir.className = "concluirPrincipal";
        botaoConcluir.dataset.i = index;
        botaoConcluir.setAttribute("aria-label", "Concluir tarefa principal");
        botaoConcluir.innerHTML = '<i class="fa-solid fa-check"></i>';

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.className = "excluirPrincipal";
        botaoExcluir.dataset.i = index;
        botaoExcluir.setAttribute("aria-label", "Excluir tarefa principal");
        botaoExcluir.innerHTML = '<i class="fa-solid fa-trash"></i>';

        acoes.append(botaoConcluir, botaoExcluir);
        li.append(texto, acoes);
        listaPrincipais.appendChild(li);
    });

    const existemPrincipais = tarefas.some(tarefa => tarefa.principal);
    semPrincipais.style.display = existemPrincipais ? "none" : "block";
}

function adicionarTarefa() {
    if (!input) return;

    const texto = input.value.trim();

    if (texto === "") {
        input.focus();
        return;
    }

    const principal = confirm("Quer adicionar essa tarefa como principal? REQUISITO FUNCIONAL 2..");

    tarefas.push({
        texto: texto,
        concluida: false,
        principal: principal
    });

    salvarTarefas();
    input.value = "";
    mostrar();

    if (principal) {
        atualizarGifPrincipal(true);
    }

    input.focus();
}

if (adicionar) {
    adicionar.addEventListener("click", adicionarTarefa);
}

if (input) {
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            adicionarTarefa();
        }
    });
}

if (lista) {
    lista.addEventListener("click", function(event) {
        const botaoConcluir = event.target.closest(".concluir");
        const botaoExcluir = event.target.closest(".excluir");

        if (botaoConcluir) {
            const index = Number(botaoConcluir.dataset.i);
            if (!tarefas[index]) return;

            tarefas[index].concluida = !tarefas[index].concluida;
            salvarTarefas();
            mostrar();
        }

        if (botaoExcluir) {
            const index = Number(botaoExcluir.dataset.i);
            if (!tarefas[index]) return;

            tarefas.splice(index, 1);
            salvarTarefas();
            mostrar();
        }
    });
}

if (listaPrincipais) {
    listaPrincipais.addEventListener("click", function(event) {
        const botaoConcluir = event.target.closest(".concluirPrincipal");
        const botaoExcluir = event.target.closest(".excluirPrincipal");

        if (botaoConcluir) {
            const index = Number(botaoConcluir.dataset.i);
            if (!tarefas[index]) return;

            tarefas[index].concluida = !tarefas[index].concluida;
            salvarTarefas();
            mostrar();
        }

        if (botaoExcluir) {
            const index = Number(botaoExcluir.dataset.i);
            if (!tarefas[index]) return;

            tarefas.splice(index, 1);
            salvarTarefas();
            mostrar();
        }
    });
}

if (botaoPrincipais && principaisContainer) {
    botaoPrincipais.addEventListener("click", function() {
        const aberto = principaisContainer.style.display === "block";
        principaisContainer.style.display = aberto ? "none" : "block";

        if (!aberto) {
            mostrarPrincipais();
        }
    });
}

if (tema) {
    tema.addEventListener("click", function() {
        document.body.classList.toggle("escuro");

        const icone = tema.querySelector("i");

        if (icone) {
            icone.className = document.body.classList.contains("escuro")
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
        }
    });
}

if (abrirAudio && alertaAudio) {
    abrirAudio.addEventListener("click", function() {
        alertaAudio.style.display = "flex";
    });
}

function mostrarAviso() {
    const avisoAntigo = document.querySelector(".avisoPapoi");

    if (avisoAntigo) {
        avisoAntigo.remove();
    }

    const aviso = document.createElement("div");
    aviso.className = "avisoPapoi";
    aviso.textContent = "Requisito funcional 1: PAPOI";

    Object.assign(aviso.style, {
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#6757e8",
        color: "#ffffff",
        padding: "15px 25px",
        borderRadius: "10px",
        fontWeight: "bold",
        zIndex: "99999",
        boxShadow: "0 8px 25px #0004",
        maxWidth: "90%",
        textAlign: "center"
    });

    document.body.appendChild(aviso);

    setTimeout(function() {
        aviso.remove();
    }, 3000);
}

if (reproduzirAudio && audioPapoi) {
    reproduzirAudio.addEventListener("click", function() {
        audioPapoi.currentTime = 0;

        audioPapoi.play()
            .then(function() {
                mostrarAviso();
            })
            .catch(function(erro) {
                console.error("Erro ao reproduzir áudio:", erro);
            });
    });
}

function fecharJanelaAudio() {
    if (alertaAudio) {
        alertaAudio.style.display = "none";
    }

    if (audioPapoi) {
        audioPapoi.pause();
        audioPapoi.currentTime = 0;
    }
}

if (fecharAudio) {
    fecharAudio.addEventListener("click", fecharJanelaAudio);
}

if (alertaAudio) {
    alertaAudio.addEventListener("click", function(event) {
        if (event.target === alertaAudio) {
            fecharJanelaAudio();
        }
    });
}

mostrar();
atualizarGifPrincipal(false);