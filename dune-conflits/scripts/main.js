Hooks.once('init', async function() {
  console.log('Mon Module | Initialisation du module');
});

Hooks.once('ready', async function() {
  console.log('Mon Module | Module prêt');
});

Hooks.on('renderActorSheet', (app, html, data) => {
  // Créer le bouton
  const button = $('<button class="open-conflit-template">Conflit</button>');

  // Ajouter le bouton à la navigation des onglets
  const tabs = html.find('.sheet-tabs.sheet-navigation');
  if (tabs.length > 0) {
    tabs.append(button);
  } else {
    console.warn("Impossible de trouver l'élément .sheet-tabs.sheet-navigation");
  }

  // Ajouter l'événement de clic
  button.click(async (ev) => {
    ev.preventDefault();
    
    // Extraire tous les assets de la fiche d'acteur
    const actor = app.object;
    const assets = actor.items.filter(item => item.type === 'asset').map(item => {
      return { id: item.id, name: item.name, description: item.system.description };
    });

    // Charger et afficher le template avec les données injectées
    const content = await renderTemplate('modules/dune-conflits/templates/conflits.html', { assets: assets });
    const dialog = new Dialog({
      title: "Conflit",
      content: content,
      buttons: {
        close: {
          label: "Fermer",
          callback: () => {}
        }
      },
      render: html => {
        html.find('.view-asset').click(async (ev) => {
          const assetId = ev.currentTarget.dataset.id;
          const asset = assets.find(a => a.id === assetId);

          if (asset) {
            const detailContent = await renderTemplate('modules/dune-conflits/templates/conflits-vision.html', asset);
            new Dialog({
              title: `Détails de l'Asset : ${asset.name}`,
              content: detailContent,
              buttons: {
                close: {
                  label: "Fermer",
                  callback: () => {}
                }
              }
            }).render(true);
          }
        });
      }
    }).render(true);
  });
});
