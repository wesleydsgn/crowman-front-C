window.onload = () => {
  const API = "https://crowman-promocoes-api.onrender.com/promocoes";
  let cache = [];

  function smartTags(texto) {
    const tags = [];
    const map = {
      "cupom": /cupom|cupon|código/i,
      "frete grátis": /frete/i,
      "smartphone": /celular|iphone|samsung|xiaomi|motorola/i,
      "pc gamer": /gamer|rtx|ssd|ryzen|intel|placa/i,
      "roupas": /camisa|moletom|nike|adidas|roupa/i,
      "eletrônicos": /tv|monitor|headset|fone/i
    };
    for (const t in map) if (map[t].test(texto)) tags.push(t);
    return tags;
  }

  async function carregar() {
    const res = await fetch(API);
    const dados = await res.json();

    if (cache.length > 0 && dados[0]?.id !== cache[0]?.id) {
      showToast();
    }

    cache = dados;
    render(dados);
  }

  function render(lista) {
    const el = document.getElementById("lista");
    el.innerHTML = "";

    lista.forEach(p => {
      const tags = smartTags(p.texto)
        .map(t => `<span>${t}</span>`)
        .join("");

      el.innerHTML += `
        <div class="card" onclick="openModal(${p.id})">
          ${p.imagem ? `<img src="https://crowman-promocoes-api.onrender.com/img/${p.imagem}" />` : ""}
          <div class="tagList">${tags}</div>
          <p>${p.texto.substring(0, 120)}...</p>
        </div>
      `;
    });
  }

  window.openModal = (id) => {
    const p = cache.find(x => x.id === id);
    const link = p.texto.match(/https?:\/\/[^\s]+/);

    document.getElementById("modalBody").innerHTML = `
      ${p.imagem ? `<img src="https://crowman-promocoes-api.onrender.com/img/${p.imagem}" style="width:100%;border-radius:10px;" />` : ""}
      <p style="margin-top:15px;">${p.texto.replace(/\n/g, '<br>')}</p>
      ${link ? `<a class='btnOferta' href='${link[0]}' target='_blank'>Abrir Oferta 🔥</a>` : ""}
    `;

    document.getElementById("modal").style.display = "flex";
  };

  window.closeModal = () => {
    document.getElementById("modal").style.display = "none";
  };

  document.getElementById("search").addEventListener("keyup", e => {
    const q = e.target.value.toLowerCase();
    const filtrado = cache.filter(x => x.texto.toLowerCase().includes(q));
    render(filtrado);
  });

  function showToast() {
    const t = document.getElementById("toast");
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3000);
  }

  carregar();
  setInterval(carregar, 5000);
};
