// Complete com os dados confirmados da atleta. Campos vazios preservam a apresentação geral.
export const perfil = {
  nome: '',
  instagram: '',
  biografia: [],
  conquistas: [] // { titulo: 'Nome do campeonato', descricao: 'Ano, modalidade e colocação confirmados' }
};
if (perfil.nome.trim()) {
  document.title = `${perfil.nome} — GL Fight`;
  document.querySelector('#apresentacao').textContent = `${perfil.nome}. Atleta, campeã e empreendedora por trás da GL Fight.`;
}
if (perfil.biografia.length) {
  document.querySelector('#biografia').replaceChildren(...perfil.biografia.map(texto => {
    const p = document.createElement('p'); p.textContent = texto; return p;
  }));
}
if (perfil.conquistas.length) {
  document.querySelector('#listaConquistas').replaceChildren(...perfil.conquistas.map(conquista => {
    const card = document.createElement('article'); card.className = 'achievement';
    const icon = document.createElement('span'); icon.className = 'award-icon'; icon.textContent = '✦'; icon.setAttribute('aria-hidden', 'true');
    const title = document.createElement('h3'); title.textContent = conquista.titulo;
    const description = document.createElement('p'); description.textContent = conquista.descricao;
    card.append(icon, title, description); return card;
  }));
}
try {
  const url = new URL(perfil.instagram);
  if (url.protocol === 'https:' && ['instagram.com', 'www.instagram.com'].includes(url.hostname)) {
    const link = document.querySelector('#instagramAtleta'); link.href = url.href; link.hidden = false;
  }
} catch { /* Perfil não informado: o contato aparece quando houver um endereço válido. */ }

if (['localhost', '127.0.0.1'].includes(location.hostname)) {
  document.querySelectorAll('a[href="../GLfight/index.html"]').forEach(link => { link.href = 'http://localhost:5173/index.html'; });
}
