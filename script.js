'use strict';

const catRelatives = {
  abyssinian: 'Somali',
  asian: 'African Wildcat',
  american_bobtail: 'Pixie-bob',
  american_curl: 'Scottish Fold',
  american_shorthair: 'British Shorthair',
  american_wirehair: 'American Shorthair',
  arabian_mau: 'Egyptian Mau',
  balinese: 'Siamese',
  bengal: 'Egyptian Mau',
  birman: 'Ragdoll',
  bombay: 'Burmese',
  british_longhair: 'British Shorthair',
  british_shorthair: 'Chartreux',
  burmese: 'Tonkinese',
  burmilla: 'Chinchilla Persian',
  chartreux: 'British Shorthair',
  cornish_rex: 'Devon Rex',
  cymric: 'Manx',
  chinese_li_hua: 'Oriental Shorthair',
  devon_rex: 'Cornish Rex',
  egyptian_mau: 'Bengal',
  european_shorthair: 'British Shorthair',
  exotic_shorthair: 'Persian',
  havana_brown: 'Oriental Shorthair',
  himalayan: 'Persian',
  japanese_bobtail: 'Kurilean Bobtail',
  javanese: 'Balinese',
  korat: 'Russian Blue',
  kurilian_bobtail: 'Japanese Bobtail',
  laPerm: 'Selkirk Rex',
  maine_coon: 'Norwegian Forest Cat',
  manx: 'Cymric',
  munchkin: 'Scottish Fold',
  mekong_mobtail: 'Thai cat',
  nebelung: 'Russian Blue',
  norwegian_forest: 'Maine Coon',
  ocicat: 'Egyptian Mau',
  oriental_bicolor: 'Oriental Shorthair',
  oriental_longhair: 'Oriental Shorthair',
  oriental_shorthair: 'Siamese',
  persian: 'Exotic Shorthair',
  peterbald: 'Sphynx',
  pixie_bob: 'American Bobtail',
  ragdoll_cats: 'Birman',
  russian_blue: 'Korat',
  savannah: 'Bengal',
  scottish_fold: 'American Curl',
  selkirk_rex: 'LaPerm',
  siamese_cat: 'Oriental Shorthair',
  siberian: 'Norwegian Forest Cat',
  singapura: 'Burmese',
  snowshoe: 'Siamese',
  somali: 'Abyssinian',
  sphynx: 'Peterbald',
  tonkinese: 'Burmese',
  toyger: 'Bengal',
  turkish_angora: 'Turkish Van',
  turkish_van: 'Turkish Angora',
};

const headingWelcome = document.querySelector('.welcome-heading');
const headingIcon = document.querySelector('.heading-icon');
const errorMessage = document.querySelector('.error-message');
const containerCat = document.querySelector('.cat_container');
const formSearchCat = document.querySelector('.form_search-cat');
const inputSearchCat = document.getElementById('search-cat');

// Spinner
const spinnerMarkup = `
  <div class="spinner">
    <div class="spin"></div>
  </div>
`;

const spinnerContainer = document.createElement('div');
spinnerContainer.innerHTML = spinnerMarkup;
document.body.appendChild(spinnerContainer);

const showSpinner = () =>
  (spinnerContainer.querySelector('.spinner').style.display = 'block');

const hideSpinner = () =>
  (spinnerContainer.querySelector('.spinner').style.display = 'none');

////////////////////////////////////////////////////////////////////////

// FETCH CAT DATA (Utility function)
const getJSON = async function (url) {
  try {
    // Send GET request to API with headers
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': 'o2UXq8pWVEg5rGLbiYeGzw==9XIV2HjOrjRzadc5',
      },
    });

    if (!res.ok)
      throw new Error('Oops! Something went wrong. Please try again later.');

    return res.json();
  } catch (err) {
    // Handle network errors separately (e.g., lost internet connection)
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      throw new Error(
        'Network error! Please check your internet connection...'
      );
    }

    throw err;
  }
};

// DISPLAY CAT INFO
const displayCatInfo = function (cat) {
  const formatName = name => name.toLowerCase().replace(/\s+/g, '_');

  // Clone cat object
  const catObj = structuredClone(cat);

  // Get closest breed relative
  const closestRelative = catRelatives[formatName(cat.name)] || 'unknown';

  const vocal =
    catObj.meowing === 1
      ? 'less vocal cats'
      : catObj.meowing === 2
      ? 'not very vocal'
      : catObj.meowing === 3
      ? 'vocal, but not excessively'
      : catObj.meowing === 4
      ? 'quite vocal'
      : catObj.meowing === 5
      ? 'very vocal'
      : '';

  // Create info elements
  const infoContainer = document.createElement('article');
  const info = document.createElement('p');
  const infoIcon = document.createElement('img');

  infoContainer.classList.add('cat_info');
  info.classList.add('info');
  infoIcon.classList.add('cat-icon');

  infoIcon.src = 'cat-icon.svg';
  infoIcon.alt = 'Cat Icon';

  info.textContent = `
      The ${catObj.name} is ${catObj.length}, and weights between ${catObj.min_weight}-${catObj.max_weight}lbs. They're ${vocal}. Their lifespan ranges from ${catObj.min_life_expectancy} to ${catObj.max_life_expectancy} years. Closest relative is ${closestRelative}.
      `;

  containerCat.insertAdjacentElement('beforeend', infoContainer);
  infoContainer.appendChild(infoIcon);
  infoContainer.insertAdjacentElement('beforeend', info);
};

// DISPLAY CAT
const displayCat = function (cat) {
  // Get family rating and play rating
  const familyRating = cat.family_friendly;
  const playRating = cat.playfulness;

  // Convert ratings to emojis
  const heartEmoji = '💚'.repeat(familyRating);
  const playEmoji = '🐈‍⬛'.repeat(playRating);

  const img = new Image();
  img.src = cat.image_link;
  img.alt = `Image of a ${cat.name} cat`;

  img.addEventListener('load', function () {
    const html = `
      <article class="cat">
        <img src="${cat.image_link}" alt="A Cat" />
        <h2 class="breed">${cat.name}</h2>
        <ul class="stats-list">
          <li class="stat"><span>Origin: </span>${
            cat.origin ? cat.origin : 'Unknown'
          }</li>
          <li class="stat"><span>Intelligence: </span>${
            cat.intelligence ? cat.intelligence + '/5' : 'Unknown'
          }</li>
          <li class="stat"><span>Family-Friendly: </span>${
            familyRating ? heartEmoji : 'Unknown'
          }</li>
          <li class="stat"><span>Playfulness: </span>${
            playRating ? playEmoji : 'Unknown'
          }</li>
        </ul>
      </article>`;

    hideSpinner();

    containerCat.insertAdjacentHTML('afterbegin', html);
    displayCatInfo(cat);
  });
};

// GET CAT
const getCat = async function (breed) {
  try {
    const data = await getJSON(
      `https://api.api-ninjas.com/v1/cats?name=${breed}`
    );

    if (!data.length)
      throw new Error(
        `😿 Sorry, couldn't find that breed right now... Try another!`
      );

    displayCat(data[0]);
  } catch (err) {
    console.error('Error fetching cat data:', err.message);

    hideSpinner();

    errorMessage.style.display = 'block';
    errorMessage.textContent = err.message;
  }
};

// SUBMIT FORM
formSearchCat.addEventListener('submit', function (e) {
  e.preventDefault();

  const catName = inputSearchCat.value.trim();

  headingWelcome.style.display = 'none';
  headingIcon.style.display = 'none';
  errorMessage.style.display = 'none';

  formSearchCat.reset();
  inputSearchCat.blur();
  containerCat.innerHTML = '';

  showSpinner();
  getCat(catName);
});
