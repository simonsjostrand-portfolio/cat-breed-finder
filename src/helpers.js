const headingIcon = document.querySelector('.heading-icon');
const headingWelcome = document.querySelector('.heading-welcome');
const errorMessage = document.querySelector('.error-message');
const spinner = document.querySelector('.spinner');

////////////////////////////////////////////////////////////////////////////////////

export const formatName = name => name.toLowerCase().replace(/[\s-]+/g, '_');

export const toggleSpinner = show =>
  (spinner.style.display = show ? 'block' : 'none');

export const showErrorMessage = function (err) {
  errorMessage.style.display = 'block';
  errorMessage.textContent = err.message;
};

export const hideUIMessages = function () {
  headingWelcome.style.display = 'none';
  headingIcon.style.display = 'none';
  errorMessage.style.display = 'none';
};

export const getJSON = async function (url) {
  try {
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
