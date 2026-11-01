const growerGrid = document.querySelector('[data-grower-grid]');
const growerProfile = document.querySelector('[data-grower-profile]');
const growersCatalogUrl = new URL('../../data/growers.json', document.currentScript.src);
const growerImagesCatalogUrl = new URL('../../data/grower-images.json', document.currentScript.src);
const lotsCatalogUrl = new URL('../../data/lots.json', document.currentScript.src);
const lotsBody = document.querySelector('[data-lots-body]');
const maxGrowerImages = 10;

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function safeImageUrl(src) {
  const imageUrl = new URL(src, window.location.href);
  if (imageUrl.origin !== window.location.origin && imageUrl.protocol !== 'https:') {
    throw new Error(`Image URL must be local or use HTTPS: ${src}`);
  }
  return imageUrl.href;
}

function validateCatalog(growers) {
  if (!Array.isArray(growers)) {
    throw new Error('growers.json must contain an array of grower profiles.');
  }

  const slugs = new Set();
  for (const grower of growers) {
    if (
      !grower ||
      typeof grower.slug !== 'string' ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(grower.slug) ||
      typeof grower.name !== 'string' ||
      !grower.name.trim() ||
      typeof grower.story !== 'string' ||
      !Array.isArray(grower.varieties) ||
      !grower.varieties.every((variety) => typeof variety === 'string') ||
      (grower.altitude !== null && typeof grower.altitude !== 'string') ||
      (grower.location !== undefined && typeof grower.location !== 'string') ||
      (grower.tagline !== undefined && typeof grower.tagline !== 'string') ||
      !hasValidCoordinates(grower)
    ) {
      throw new Error('A grower profile in growers.json has missing or invalid fields.');
    }

    if (slugs.has(grower.slug)) {
      throw new Error(`Duplicate grower slug in growers.json: ${grower.slug}`);
    }
    slugs.add(grower.slug);
  }

  return growers;
}

function hasValidCoordinates(grower) {
  const { latitude, longitude } = grower;
  if (latitude === undefined && longitude === undefined) return true;
  if (latitude === null && longitude === null) return true;

  return (
    typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === 'number' &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function validateGrowerImages(images, growers) {
  if (!images || typeof images !== 'object' || Array.isArray(images)) {
    throw new Error('grower-images.json must map grower slugs to image arrays.');
  }

  const growerSlugs = new Set(growers.map((grower) => grower.slug));
  for (const [slug, files] of Object.entries(images)) {
    if (
      !growerSlugs.has(slug) ||
      !Array.isArray(files) ||
      files.length > maxGrowerImages ||
      !files.every((image) =>
        image &&
        typeof image.src === 'string' &&
        typeof image.alt === 'string' &&
        image.alt.trim() &&
        (image.caption === undefined || (typeof image.caption === 'string' && image.caption.trim()))
      )
    ) {
      throw new Error(`Invalid image entries for grower slug "${slug}".`);
    }
  }

  return images;
}

function validateLots(lots, growers) {
  if (!Array.isArray(lots)) {
    throw new Error('lots.json must contain an array of lot entries.');
  }

  const growerSlugs = new Set(growers.map((grower) => grower.slug));
  for (const lot of lots) {
    if (
      !lot ||
      typeof lot.variety !== 'string' ||
      !lot.variety.trim() ||
      typeof lot.process !== 'string' ||
      !lot.process.trim() ||
      typeof lot.growerSlug !== 'string' ||
      !growerSlugs.has(lot.growerSlug) ||
      typeof lot.size !== 'string' ||
      typeof lot.availability !== 'string' ||
      typeof lot.cupDetails !== 'string'
    ) {
      throw new Error('A lot in lots.json has invalid fields or references an unknown grower slug.');
    }
  }

  return lots;
}

function renderLots(lots, growers) {
  if (!lotsBody) return;

  lotsBody.replaceChildren();
  if (lots.length === 0) {
    const row = document.createElement('tr');
    const cell = createTextElement('td', 'px-5 py-8 text-center text-[#5b473d]', 'No lots are listed at the moment. Please ask us about current availability.');
    cell.colSpan = 6;
    row.append(cell);
    lotsBody.append(row);
    return;
  }

  const growersBySlug = new Map(growers.map((grower) => [grower.slug, grower]));
  for (const lot of lots) {
    const grower = growersBySlug.get(lot.growerSlug);
    const row = document.createElement('tr');
    row.className = 'border-t border-[#d8c6b1]';

    row.append(createTextElement('th', 'px-5 py-4 font-semibold', lot.variety));
    row.lastElementChild.scope = 'row';
    row.append(createTextElement('td', 'px-5 py-4', lot.process));

    const estateCell = document.createElement('td');
    estateCell.className = 'px-5 py-4';
    const estateLink = document.createElement('a');
    const profileUrl = new URL('grower.html', window.location.href);
    profileUrl.searchParams.set('slug', grower.slug);
    estateLink.href = profileUrl.href;
    estateLink.className = 'font-semibold text-phibean-700 underline underline-offset-2 hover:text-phibean-900';
    estateLink.textContent = grower.name;
    estateCell.append(estateLink);
    row.append(estateCell);

    row.append(createTextElement('td', 'px-5 py-4', lot.size));
    row.append(createTextElement('td', 'px-5 py-4', lot.availability));
    row.append(createTextElement('td', 'px-5 py-4', lot.cupDetails));
    lotsBody.append(row);
  }
}

function createGrowerCard(grower) {
  const card = document.createElement('article');
  card.className = 'grower-card elegant-panel flex flex-col items-start rounded-[0.35rem] p-6 sm:p-8';

  card.append(createTextElement('p', 'text-xs font-semibold uppercase tracking-[0.2em] text-phibean-600', 'Grower story'));
  card.append(createTextElement('h3', 'card-title mt-4 text-xl font-semibold text-[#2a1e17]', grower.name));

  if (grower.tagline) {
    card.append(createTextElement('p', 'mt-1 text-base italic text-phibean-700', grower.tagline));
  }

  card.append(createTextElement('p', 'mt-3 text-sm leading-6 text-[#5b473d]', grower.story));

  const link = document.createElement('a');
  const profileUrl = new URL('grower.html', window.location.href);
  profileUrl.searchParams.set('slug', grower.slug);
  link.href = profileUrl.href;
  link.className = 'mt-auto pt-5 text-sm font-semibold text-phibean-700';
  link.textContent = 'Meet this grower →';
  card.append(link);

  return card;
}

function renderGrowerProfile(grower, images) {
  const status = document.querySelector('[data-grower-profile-status]');
  const content = growerProfile.querySelector('[data-grower-profile-content]');
  const isPlaceholder = (value) => /^Add (?:the approved location|the grower-approved estate story)\.?$/i.test(value || '');
  const approvedStory = isPlaceholder(grower.story) ? '' : grower.story.trim();
  const approvedLocation = isPlaceholder(grower.location) ? '' : grower.location;
  const displayStory = approvedStory || 'Farm story details will be shared once approved.';
  const displayLocation = approvedLocation || 'Karnataka, India';

  document.title = `${grower.name} | Arabica Coffee Grower in Karnataka | PhiBean Coffees`;
  const knownVarieties = grower.varieties.filter((variety) => variety.trim());
  const profileDetails = [
    approvedStory,
    knownVarieties.length > 0 ? `Grown varieties include ${knownVarieties.join(', ')}.` : '',
    approvedLocation
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  const profileDescription = profileDetails
    ? `Arabica coffee grower ${grower.name}. ${profileDetails} Karnataka, India`
    : `Arabica green coffee grower and estate profile for ${grower.name} in Karnataka, India.`;
  const description = profileDescription.length > 157
    ? `${profileDescription.slice(0, 154).replace(/\s+\S*$/, '')}…`
    : profileDescription;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[name="keywords"]').content = [
    'Arabica green coffee',
    'specialty green coffee',
    'traceable coffee',
    `${grower.name} coffee`,
    `${displayLocation} coffee`,
    ...knownVarieties.map((variety) => `${variety} coffee`)
  ].join(', ');
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[name="twitter:title"]').content = document.title;
  document.querySelector('meta[name="twitter:description"]').content = description;
  const canonicalUrl = new URL('grower.html', window.location.href);
  canonicalUrl.searchParams.set('slug', grower.slug);
  document.querySelector('link[rel="canonical"]').href = canonicalUrl.href;
  document.querySelector('meta[property="og:url"]').content = canonicalUrl.href;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: document.title,
    description,
    url: canonicalUrl.href,
    inLanguage: 'en-IN',
    isPartOf: {
      '@type': 'WebSite',
      name: 'PhiBean Coffees',
      url: new URL('index.html', window.location.href).href
    },
    about: {
      '@type': 'Thing',
      name: grower.name,
      description: displayStory
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: new URL('index.html', window.location.href).href },
        { '@type': 'ListItem', position: 2, name: 'Growers', item: new URL('index.html#growers', window.location.href).href },
        { '@type': 'ListItem', position: 3, name: grower.name, item: canonicalUrl.href }
      ]
    }
  };
  if (images.length > 0) {
    const imageUrl = safeImageUrl(images[0].src);
    structuredData.primaryImageOfPage = imageUrl;
    document.querySelector('meta[property="og:image"]').content = imageUrl;
    document.querySelector('meta[property="og:image:alt"]').content = images[0].alt;
    document.querySelector('meta[name="twitter:image"]').content = imageUrl;
    document.querySelector('meta[name="twitter:image:alt"]').content = images[0].alt;
  }
  document.querySelector('[data-grower-structured-data]').textContent = JSON.stringify(structuredData);

  growerProfile.querySelector('[data-grower-name]').textContent = grower.name;
  growerProfile.querySelector('[data-grower-tagline]').textContent = grower.tagline || '';
  growerProfile.querySelector('[data-grower-tagline]').hidden = !grower.tagline;
  growerProfile.querySelector('[data-grower-location]').textContent = displayLocation;
  growerProfile.querySelector('[data-grower-story]').textContent = displayStory;
  growerProfile.querySelector('[data-grower-altitude]').textContent = grower.altitude || 'Not yet shared';
  growerProfile.querySelector('[data-grower-varieties]').textContent =
    grower.varieties.length > 0 ? grower.varieties.join(', ') : 'Not yet shared';

  const mapSection = growerProfile.querySelector('[data-grower-map]');
  if (Number.isFinite(grower.latitude) && Number.isFinite(grower.longitude)) {
    const mapUrl = new URL('https://www.openstreetmap.org/export/embed.html');
    const latitude = grower.latitude;
    const longitude = grower.longitude;
    const bounds = 0.01;
    const formatBound = (value) => Number(value.toFixed(5)).toString();
    mapUrl.searchParams.set(
      'bbox',
      [
        formatBound(Math.max(-180, longitude - bounds)),
        formatBound(Math.max(-90, latitude - bounds)),
        formatBound(Math.min(180, longitude + bounds)),
        formatBound(Math.min(90, latitude + bounds))
      ].join(',')
    );
    mapUrl.searchParams.set('layer', 'mapnik');
    mapUrl.searchParams.set('marker', `${latitude},${longitude}`);
    mapSection.querySelector('[data-grower-map-frame]').src = mapUrl.href;

    const mapLink = new URL('https://www.openstreetmap.org/');
    mapLink.hash = `map=16/${latitude}/${longitude}`;
    mapSection.querySelector('[data-grower-map-link]').href = mapLink.href;
    mapSection.parentElement.classList.add('has-map');
    mapSection.hidden = false;
  } else {
    mapSection.parentElement.classList.remove('has-map');
    mapSection.hidden = true;
  }

  const slider = growerProfile.querySelector('[data-grower-slider]');
  const noImagesMessage = growerProfile.querySelector('[data-grower-no-images]');
  const slideImage = slider.querySelector('[data-grower-slide-image]');
  const slideCaption = slider.querySelector('[data-grower-slide-caption]');
  const controls = slider.querySelector('[data-grower-slider-controls]');
  const slideCount = slider.querySelector('[data-grower-slide-count]');
  let activeImageIndex = 0;

  function showImage(index) {
    activeImageIndex = (index + images.length) % images.length;
    const image = images[activeImageIndex];
    slideImage.src = safeImageUrl(image.src);
    slideImage.alt = image.alt;
    slideCaption.textContent = image.caption || '';
    slideCaption.hidden = !image.caption;
    slideCount.textContent = `${activeImageIndex + 1} of ${images.length}`;
  }

  if (images.length > 0) {
    showImage(0);
    slider.hidden = false;
    noImagesMessage.hidden = true;
    controls.hidden = images.length < 2;
  } else {
    slider.hidden = true;
    noImagesMessage.hidden = false;
    controls.hidden = true;
  }

  slider.querySelector('[data-grower-previous]').onclick = () => showImage(activeImageIndex - 1);
  slider.querySelector('[data-grower-next]').onclick = () => showImage(activeImageIndex + 1);

  const inquiryUrl = new URL('index.html', window.location.href);
  inquiryUrl.searchParams.set('opportunity', 'Spot micro-lot order');
  inquiryUrl.searchParams.set('grower', grower.slug);
  inquiryUrl.hash = 'contact';
  growerProfile.querySelector('[data-grower-inquiry]').href = inquiryUrl.href;

  const visitUrl = new URL('index.html', window.location.href);
  visitUrl.searchParams.set('opportunity', 'Estate visit');
  visitUrl.searchParams.set('grower', grower.slug);
  visitUrl.hash = 'contact';
  growerProfile.querySelector('[data-grower-visit]').href = visitUrl.href;

  status.hidden = true;
  content.hidden = false;
  growerProfile.hidden = false;
}

function showGrowerError(error) {
  console.error('Unable to load site catalogs:', error);
  if (growerProfile) {
    document.querySelector('meta[name="robots"]').content = 'noindex, nofollow';
  }
  if (lotsBody) {
    const row = document.createElement('tr');
    const cell = createTextElement('td', 'px-5 py-8 text-center text-[#5b473d]', 'Lot examples could not be loaded. Please try again later.');
    cell.colSpan = 6;
    row.append(cell);
    lotsBody.replaceChildren(row);
  }
  const status = document.querySelector('[data-grower-profile-status]') ||
    document.querySelector('[data-growers-status]');
  if (status) {
    status.textContent = 'Site information could not be loaded. Please try again later.';
    status.setAttribute('role', 'alert');
  }
}

async function loadGrowers() {
  try {
    const responses = await Promise.all([
      fetch(growersCatalogUrl),
      fetch(growerImagesCatalogUrl),
      lotsBody ? fetch(lotsCatalogUrl) : Promise.resolve(null)
    ]);

    if (!responses[0].ok) {
      throw new Error(`Unable to load growers.json (${responses[0].status}).`);
    }

    const growers = validateCatalog(await responses[0].json());
    if (!responses[1].ok) {
      throw new Error(`Unable to load grower-images.json (${responses[1].status}).`);
    }
    const imagesBySlug = validateGrowerImages(await responses[1].json(), growers);

    let lots = [];
    if (lotsBody) {
      if (!responses[2].ok) {
        throw new Error(`Unable to load lots.json (${responses[2].status}).`);
      }
      lots = validateLots(await responses[2].json(), growers);
    }

    if (growerGrid) {
      const query = new URLSearchParams(window.location.search);
      const requestedGrower = query.get('grower');
      if (query.get('opportunity') === 'Estate visit' && requestedGrower) {
        const grower = growers.find((entry) => entry.slug === requestedGrower);
        if (grower) {
          const estateField = document.querySelector('#roasterInquiryForm [name="company"]');
          if (estateField) estateField.value = grower.name;
        }
      }

      const status = growerGrid.querySelector('[data-growers-status]');
      const invitation = growerGrid.querySelector('[data-farm-story-invitation]');
      for (const grower of growers) {
        growerGrid.insertBefore(createGrowerCard(grower), invitation);
      }
      if (status) status.remove();
    }

    renderLots(lots, growers);

    if (growerProfile) {
      const slug = new URLSearchParams(window.location.search).get('slug');
      const grower = growers.find((entry) => entry.slug === slug);
      if (!grower) {
        throw new Error(slug ? `No grower profile found for "${slug}".` : 'A grower slug is required.');
      }
      renderGrowerProfile(grower, imagesBySlug[grower.slug] || []);
    }
  } catch (error) {
    showGrowerError(error);
  }
}

if (growerGrid || growerProfile) {
  loadGrowers();
}
