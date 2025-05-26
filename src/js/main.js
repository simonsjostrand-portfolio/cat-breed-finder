import { formatName } from './helpers.js';
import { toggleSpinner } from './helpers.js';
import { getJSON } from './helpers.js';

const catRelatives = {
  abyssinian: 'Somali',
  asian: 'African Wildcat',
  american_bobtail: 'Pixie-bob',
  american_curl: 'Scottish Fold',
  american_shorthair: 'British Shorthair',
  american_wirehair: 'American Shorthair',
  aphrodite_giant: 'Cyprus',
  arabian_mau: 'Egyptian Mau',
  australian_mist: 'Burmese',
  balinese: 'Siamese',
  bengal_cats: 'Egyptian Mau',
  birman: 'Ragdoll',
  bombay: 'Burmese',
  british_longhair: 'British Shorthair',
  british_shorthair: 'Chartreux',
  burmese: 'Tonkinese',
  burmilla: 'Chinchilla Persian',
  chartreux: 'British Shorthair',
  cornish_rex: 'Devon Rex',
  cymric: 'Manx',
  cyprus: 'Aphrodite Giant',
  chinese_li_hua: 'Oriental Shorthair',
  devon_rex: 'Cornish Rex',
  donskoy: 'Oriental Shorthair',
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
  maine_coon: 'Norwegian Forest',
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
  ragamuffin: 'Ragdoll',
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

const vocalityLevels = {
  1: 'less vocal cats',
  2: 'not very vocal',
  3: 'vocal, but not excessively',
  4: 'quite vocal',
  5: 'very vocal',
};

const headingIcon = document.querySelector('.heading-icon');
const headingWelcome = document.querySelector('.heading-welcome');
const errorMessage = document.querySelector('.error-message');
const spinner = document.querySelector('.spinner');
const containerCat = document.querySelector('.cat_container');
const formSearchCat = document.querySelector('.form_search-cat');
const inputSearchCat = document.getElementById('search-cat');

////////////////////////////////////////////////////////////////////////

const safeText = (value, fallback = 'Unknown') => (value ? value : fallback);

const hideUIMessages = function () {
  headingIcon.style.display = 'none';
  headingWelcome.style.display = 'none';
  errorMessage.style.display = 'none';
};

const showErrorMessage = function (err) {
  errorMessage.style.display = 'block';
  errorMessage.textContent = err.message;
};

const formatCatDescription = function (cat) {
  // Get closest cat relative
  const relative = catRelatives[formatName(cat.name)] || 'unknown';

  const vocality = vocalityLevels[cat.meowing] || '';

  const weight =
    cat.min_weight && cat.max_weight
      ? `${cat.min_weight}-${cat.max_weight}lbs`
      : 'unknown weight';

  const lifespan =
    cat.min_life_expectancy && cat.max_life_expectancy
      ? `${cat.min_life_expectancy} to ${cat.max_life_expectancy} years`
      : 'an unknown lifespan';

  return `
  The ${cat.name} is ${cat.length === 'Medium' ? 'moderate' : cat.length}, 
  and weighs around ${weight}. They're ${vocality}. 
  Their lifespan ranges from ${lifespan}. 
  Closest relative is ${relative}.
`;
};

const renderCatDescription = function (cat) {
  const infoContainer = document.createElement('article');
  const infoIcon = document.createElement('img');
  const info = document.createElement('p');

  infoContainer.classList.add('cat_info');
  infoIcon.classList.add('cat-icon');
  info.classList.add('info');

  infoIcon.src = 'src/img/cat-icon.svg';
  infoIcon.alt = 'Cat Icon';

  info.textContent = formatCatDescription(cat);

  containerCat.insertAdjacentElement('beforeend', infoContainer);
  infoContainer.appendChild(infoIcon);
  infoContainer.appendChild(info);
};

const renderCat = function (cat) {
  // Get family rating and play rating
  const familyRating = cat.family_friendly;
  const playRating = cat.playfulness;

  // Convert ratings to emojis
  const heartEmoji = '💚'.repeat(familyRating);
  const playEmoji = '🐈‍⬛'.repeat(playRating);

  // Create img element and set attributes
  const img = new Image();
  img.src = cat.image_link;
  img.alt = `Image of a ${cat.name} cat`;

  // Img load event with markup
  img.addEventListener('load', function () {
    const html = `
      <article class="cat">
        <img src="${cat.image_link}" alt="A Cat" />
        <h2 class="breed">${cat.name}</h2>
        <ul class="stats-list">
          <li class="stat"><span>Origin: </span>${safeText(cat.origin)}</li>
          <li class="stat"><span>Intelligence: </span>${
            cat.intelligence ? `${cat.intelligence}/5` : 'Unknown'
          }
          </li>
          <li class="stat"><span>Family-Friendly: </span>${
            familyRating ? heartEmoji : 'Unknown'
          }
          </li>
          <li class="stat"><span>Playfulness: </span>${
            playRating ? playEmoji : 'Unknown'
          }
          </li>
        </ul>
      </article>`;

    toggleSpinner(false, spinner);
    containerCat.insertAdjacentHTML('afterbegin', html);

    renderCatDescription(cat);
  });
};

const loadCatProfile = async function (breed) {
  toggleSpinner(true, spinner);
  try {
    const cat = await getJSON(
      `https://api.api-ninjas.com/v1/cats?name=${breed}`
    );

    if (!cat || (Array.isArray(cat) && !cat.length))
      throw new Error(
        `😿 Sorry, couldn't find that breed for now... Try another!`
      );

    renderCat(cat[0]);
  } catch (err) {
    showErrorMessage(err);
  } finally {
    toggleSpinner(false, spinner);
  }
};

// Handler
const handleSubmit = function (e) {
  e.preventDefault();

  const query = inputSearchCat.value.trim();
  if (!query) return;

  formSearchCat.reset();
  containerCat.innerHTML = '';
  hideUIMessages();
  loadCatProfile(query);
};

// Event listener
formSearchCat.addEventListener('submit', handleSubmit);
